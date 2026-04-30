package HealthTech.S.A.S.VitalCode.modules.usuario.service;

import HealthTech.S.A.S.VitalCode.domain.*;
import HealthTech.S.A.S.VitalCode.modules.usuario.dto.*;
import HealthTech.S.A.S.VitalCode.modules.usuario.mapper.UsuarioMapper;
import HealthTech.S.A.S.VitalCode.modules.usuario.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository, UsuarioMapper usuarioMapper) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioMapper = usuarioMapper;
    }

    @Override
    public UsuarioResponse crearUsuario(UsuarioRequest request) throws Exception {
        Usuario nuevoUsuario = usuarioMapper.toEntity(request);
        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);
        return usuarioMapper.toResponse(usuarioGuardado);
    }

    @Override
    public List<Usuario> listadoGeneral() throws Exception {
        return usuarioRepository.findAll();
    }

    @Override
    public Usuario estadoUsuario(Long idUsuario) throws Exception {
        Usuario estadoUsuario = usuarioRepository.findById(idUsuario).orElseThrow(
                () -> new Exception("El usuario con ID " + idUsuario + " no existe")
        );
        estadoUsuario.setEstado(!estadoUsuario.getEstado());
        return usuarioRepository.save(estadoUsuario);
    }

    @Override
    public Usuario buscarUsuarioPorId(Long idUsuario) throws Exception {
        return usuarioRepository.findById(idUsuario).orElseThrow(
                () -> new Exception("El usuario con ID " + idUsuario + " no existe")
        );
    }

    @Override
    public LoginResponse login(LoginRequest request) throws Exception {
        Usuario usuario = usuarioRepository.findByCorreo(request.correo())
                .orElseThrow(() -> new Exception("Correo o contraseña incorrectos"));

        if (!usuario.getContrasena().equals(request.contrasena())) {
            throw new Exception("Correo o contraseña incorrectos");
        }

        if (!usuario.getEstado()) {
            throw new Exception("Tu cuenta está desactivada. Contacta al administrador.");
        }

        String tipo = "USUARIO";
        String departamento = null;
        Long numDocumento = null;
        String grupoSanguineo = null;
        String eps = null;
        String genero = null;
        java.time.LocalDateTime fechaNacimiento = null;
        String cargo = null;
        Long numLicencia = null;
        String institucion = null;

        if (usuario instanceof Administrador a) {
            tipo = "ADMINISTRADOR";
            departamento = a.getDepartamento();
        } else if (usuario instanceof Paciente p) {
            tipo = "PACIENTE";
            numDocumento = p.getNumDocumento();
            grupoSanguineo = p.getGrupoSanguineo();
            eps = p.getEps();
            genero = p.getGenero();
            fechaNacimiento = p.getFechaNacimiento();
        } else if (usuario instanceof PersonalSalud ps) {
            tipo = "PERSONAL_SALUD";
            cargo = ps.getCargo();
            numLicencia = ps.getNumLicencia();
            institucion = ps.getInstitucion();
        }

        return new LoginResponse(
                usuario.getIdUsuario(), tipo,
                usuario.getNombre(), usuario.getApellido(), usuario.getCorreo(),
                usuario.getEstado(), usuario.getTelefono(),
                usuario.getFechaCreacion(), usuario.getUltimoAcceso(),
                departamento, numDocumento, grupoSanguineo, eps, genero, fechaNacimiento,
                cargo, numLicencia, institucion
        );
    }

    @Override
    public EstadisticasResponse obtenerEstadisticas() throws Exception {
        List<Usuario> todos = usuarioRepository.findAll();
        long pacientes = todos.stream().filter(u -> u instanceof Paciente).count();
        long personal  = todos.stream().filter(u -> u instanceof PersonalSalud).count();
        long admins    = todos.stream().filter(u -> u instanceof Administrador).count();
        long activos   = todos.stream().filter(u -> Boolean.TRUE.equals(u.getEstado())).count();
        long inactivos = todos.size() - activos;

        Map<String, Long> porEps             = toMap(usuarioRepository.contarPacientesPorEps());
        Map<String, Long> porGenero          = toMap(usuarioRepository.contarPacientesPorGenero());
        Map<String, Long> porGrupoSanguineo  = toMap(usuarioRepository.contarPacientesPorGrupoSanguineo());
        Map<String, Long> porCargo           = toMap(usuarioRepository.contarPersonalPorCargo());
        Map<String, Long> porInstitucion     = toMap(usuarioRepository.contarPersonalPorInstitucion());
        Map<String, Long> porDepartamento    = toMap(usuarioRepository.contarAdministradoresPorDepartamento());

        List<EstadisticasResponse.RegistroReciente> recientes = usuarioRepository.findUltimosRegistrados()
                .stream()
                .limit(5)
                .map(u -> new EstadisticasResponse.RegistroReciente(
                        u.getIdUsuario(),
                        u.getNombre(),
                        u.getApellido(),
                        u.getCorreo(),
                        resolverTipo(u),
                        u.getFechaCreacion() != null ? u.getFechaCreacion().toString() : null
                ))
                .collect(Collectors.toList());

        return new EstadisticasResponse(
                todos.size(), pacientes, personal, admins, activos, inactivos,
                porEps, porGenero, porGrupoSanguineo, porCargo, porInstitucion, porDepartamento,
                recientes
        );
    }

    @Override
    public List<Usuario> listarPorEstado(Boolean estado) {
        return usuarioRepository.findByEstado(estado);
    }

    @Override
    public List<Usuario> buscarPorTexto(String texto) {
        return usuarioRepository.buscarPorNombreOApellido(texto);
    }

    @Override
    public List<Paciente> listarPacientes() {
        return usuarioRepository.findAllPacientes();
    }

    @Override
    public List<Paciente> listarPacientesPorEps(String eps) {
        return usuarioRepository.findPacientesByEps(eps);
    }

    @Override
    public Paciente buscarPacientePorDocumento(Long numDocumento) throws Exception {
        return usuarioRepository.findPacienteByNumDocumento(numDocumento)
                .orElseThrow(() -> new Exception("No existe paciente con documento " + numDocumento));
    }

    @Override
    public List<PersonalSalud> listarPersonalSalud() {
        return usuarioRepository.findAllPersonalSalud();
    }

    @Override
    public List<PersonalSalud> listarPersonalPorCargo(String cargo) {
        return usuarioRepository.findPersonalByCargo(cargo);
    }

    @Override
    public List<Administrador> listarAdministradores() {
        return usuarioRepository.findAllAdministradores();
    }

    @Override
    public List<Usuario> listarUltimosRegistrados(int limit) {
        return usuarioRepository.findUltimosRegistrados().stream().limit(limit).toList();
    }

    // ── Helpers ──────────────────────────────────────────────────────────────
    private Map<String, Long> toMap(List<Object[]> filas) {
        Map<String, Long> map = new LinkedHashMap<>();
        for (Object[] fila : filas) {
            String clave = fila[0] == null ? "Sin definir" : fila[0].toString();
            Long valor = ((Number) fila[1]).longValue();
            map.put(clave, valor);
        }
        return map;
    }

    private String resolverTipo(Usuario u) {
        if (u instanceof Administrador) return "ADMINISTRADOR";
        if (u instanceof Paciente)      return "PACIENTE";
        if (u instanceof PersonalSalud) return "PERSONAL_SALUD";
        return "USUARIO";
    }
}
