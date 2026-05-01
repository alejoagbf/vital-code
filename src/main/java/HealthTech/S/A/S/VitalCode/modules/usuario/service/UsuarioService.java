package HealthTech.S.A.S.VitalCode.modules.usuario.service;

import HealthTech.S.A.S.VitalCode.domain.Usuario;
import HealthTech.S.A.S.VitalCode.modules.usuario.dto.EstadisticaResponse;
import HealthTech.S.A.S.VitalCode.modules.usuario.dto.LoginRequest;
import HealthTech.S.A.S.VitalCode.modules.usuario.dto.UsuarioRequest;
import HealthTech.S.A.S.VitalCode.modules.usuario.dto.UsuarioResponse;

import java.util.List;

public interface UsuarioService {

    UsuarioResponse crearUsuario(UsuarioRequest usuario) throws Exception;

    List<UsuarioResponse> listadoGeneral() throws Exception;

    UsuarioResponse estadoUsuario(Long idUsuario) throws Exception;

    UsuarioResponse buscarUsuarioPorId (Long idUsuario) throws  Exception;

    UsuarioResponse login(LoginRequest credenciales) throws Exception;

    List<EstadisticaResponse> obtenerUsuariosPorRol();

    List<EstadisticaResponse> obtenerPacientesPorEps();

    List<EstadisticaResponse> obtenerUsuariosPorEstado();

    List<EstadisticaResponse> obtenerPacientesPorGenero();

    List<EstadisticaResponse> obtenerPersonalPorCargo();

    List<UsuarioResponse> listarPacientesPorEps(String eps);

    List<UsuarioResponse> listarPersonalPorInstitucion(String inst);

    List<UsuarioResponse> listarInactivos();

    List<UsuarioResponse> listarUltimosDiez();

    List<UsuarioResponse> listarPacientesPorSangre(String sangre);
}
