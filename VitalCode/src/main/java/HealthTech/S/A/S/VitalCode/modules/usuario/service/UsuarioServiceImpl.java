package HealthTech.S.A.S.VitalCode.modules.usuario.service;

import HealthTech.S.A.S.VitalCode.domain.Usuario;
import HealthTech.S.A.S.VitalCode.modules.usuario.dto.LoginRequest;
import HealthTech.S.A.S.VitalCode.modules.usuario.dto.UsuarioRequest;
import HealthTech.S.A.S.VitalCode.modules.usuario.dto.UsuarioResponse;
import HealthTech.S.A.S.VitalCode.modules.usuario.mapper.UsuarioMapper;
import HealthTech.S.A.S.VitalCode.modules.usuario.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

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

        UsuarioResponse usuarioResponse = usuarioMapper.toResponse(usuarioGuardado);

        return usuarioResponse;
    }

    @Override
    public List<UsuarioResponse> listadoGeneral() throws Exception {

        // 1. Traemos la lista de entidades puras de la base de datos
        List<Usuario> listaGeneral = usuarioRepository.findAll();

        // 2. Transformamos cada Usuario a UsuarioResponse
        List<UsuarioResponse> listaResponse = listaGeneral.stream()
                .map(usuario -> usuarioMapper.toResponse(usuario))
                .toList();

        return listaResponse;
    }

    @Override
    public UsuarioResponse estadoUsuario(Long idUsuario) throws Exception {

        // 1. Buscamos la entidad pura
        Usuario estadoUsuario = usuarioRepository.findById(idUsuario).orElseThrow(
                () -> new Exception("El usuario con ID " + idUsuario + " no existe en el sistema de vitalCode")
        );

        if(!estadoUsuario.getEstado()){
            throw new Exception("El usuario con ID " + idUsuario + " ya esta desactivado en el sistema de vitalCode");
        }

        // 2. Actualizamos y guardamos la entidad pura
        estadoUsuario.setEstado(false);
        Usuario nuevoEstado = usuarioRepository.save(estadoUsuario);

        // 3. Pasamos el resultado guardado por el mapper
        UsuarioResponse usuarioResponse = usuarioMapper.toResponse(nuevoEstado);

        return usuarioResponse;
    }

    @Override
    public UsuarioResponse buscarUsuarioPorId(Long idUsuario) throws Exception {

        // 1. Buscamos la entidad pura
        Usuario usuarioExiste = usuarioRepository.findById(idUsuario).orElseThrow(
                () -> new Exception("El usuario con ID " + idUsuario + " no existe en el sistema de vitalCode")
        );

        // 2. Pasamos el resultado por el mapper
        UsuarioResponse usuarioResponse = usuarioMapper.toResponse(usuarioExiste);

        return usuarioResponse;
    }

    @Override
    public UsuarioResponse login(LoginRequest credenciales) throws Exception {

        // 1. Buscamos la entidad pura usando el correo del record
        Usuario usuarioLogin = usuarioRepository.findByCorreo(credenciales.correo()).orElseThrow(
                () -> new Exception("Credenciales incorrectas")
        );

        if(!usuarioLogin.getContrasena().equals(credenciales.contrasena())){
            throw new Exception("Credenciales incorrectas");
        }

        if(!usuarioLogin.getEstado()){
            throw new Exception("El usuario se encuentra inactivo en el sistema de vitalCode");
        }

        // 2. Si todo sale bien, lo pasamos por el mapper
        UsuarioResponse usuarioResponse = usuarioMapper.toResponse(usuarioLogin);

        return usuarioResponse;
    }
}
