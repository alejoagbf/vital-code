package HealthTech.S.A.S.VitalCode.modules.usuario.service;

import HealthTech.S.A.S.VitalCode.domain.Usuario;
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

}
