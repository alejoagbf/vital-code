package HealthTech.S.A.S.VitalCode.modules.usuario.service;

import HealthTech.S.A.S.VitalCode.domain.Administrador;
import HealthTech.S.A.S.VitalCode.domain.Paciente;
import HealthTech.S.A.S.VitalCode.domain.PersonalSalud;
import HealthTech.S.A.S.VitalCode.domain.Usuario;
import HealthTech.S.A.S.VitalCode.modules.usuario.dto.*;

import java.util.List;

public interface UsuarioService {

    UsuarioResponse crearUsuario(UsuarioRequest usuario) throws Exception;

    List<Usuario> listadoGeneral() throws Exception;

    Usuario estadoUsuario(Long idUsuario) throws Exception;

    Usuario buscarUsuarioPorId(Long idUsuario) throws Exception;

    LoginResponse login(LoginRequest request) throws Exception;

    EstadisticasResponse obtenerEstadisticas() throws Exception;

    // ── Consultas adicionales (req. 14) ──────────────────────────────────────
    List<Usuario> listarPorEstado(Boolean estado);

    List<Usuario> buscarPorTexto(String texto);

    List<Paciente> listarPacientes();

    List<Paciente> listarPacientesPorEps(String eps);

    Paciente buscarPacientePorDocumento(Long numDocumento) throws Exception;

    List<PersonalSalud> listarPersonalSalud();

    List<PersonalSalud> listarPersonalPorCargo(String cargo);

    List<Administrador> listarAdministradores();

    List<Usuario> listarUltimosRegistrados(int limit);
}
