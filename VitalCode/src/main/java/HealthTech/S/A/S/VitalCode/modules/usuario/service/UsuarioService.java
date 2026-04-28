package HealthTech.S.A.S.VitalCode.modules.usuario.service;

import HealthTech.S.A.S.VitalCode.domain.Usuario;
import HealthTech.S.A.S.VitalCode.modules.usuario.dto.UsuarioRequest;
import HealthTech.S.A.S.VitalCode.modules.usuario.dto.UsuarioResponse;

import java.util.List;

public interface UsuarioService {

    UsuarioResponse crearUsuario(UsuarioRequest usuario) throws Exception;

    List<Usuario> listadoGeneral() throws Exception;

    Usuario estadoUsuario(Long idUsuario) throws Exception;

    Usuario buscarUsuarioPorId (Long idUsuario) throws  Exception;


}
