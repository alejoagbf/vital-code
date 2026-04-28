package HealthTech.S.A.S.VitalCode.modules.usuario.service;

import HealthTech.S.A.S.VitalCode.domain.Usuario;
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
    public List<Usuario> listadoGeneral() throws Exception {

        List<Usuario> listaGeneral = usuarioRepository.findAll();

        return listaGeneral;
    }

    @Override
    public Usuario estadoUsuario(Long idUsuario) throws Exception {

        Usuario estadoUsuario = usuarioRepository.findById(idUsuario).orElseThrow(
                () -> new Exception("El usuario con ID " + idUsuario + " no existe en el sistema de vitalCode")
        );

        if(!estadoUsuario.getEstado()){
            throw new Exception("El usuario con ID " + idUsuario + " ya esta desactivado en el sistema de vitalCode");
        }

        estadoUsuario.setEstado(false);
        Usuario nuevoEstado = usuarioRepository.save(estadoUsuario);

        return nuevoEstado;
    }

    @Override
    public Usuario buscarUsuarioPorId(Long idUsuario) throws Exception {

        Usuario usuarioExiste = usuarioRepository.findById(idUsuario).orElseThrow(
                () -> new Exception("El usuario con ID " + idUsuario + " no existe en el sistema de vitalCode")
        );

        return usuarioExiste;
    }
}
