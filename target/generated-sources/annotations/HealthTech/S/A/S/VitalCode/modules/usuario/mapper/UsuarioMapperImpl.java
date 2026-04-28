package HealthTech.S.A.S.VitalCode.modules.usuario.mapper;

import HealthTech.S.A.S.VitalCode.domain.Usuario;
import HealthTech.S.A.S.VitalCode.modules.usuario.dto.UsuarioRequest;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-26T18:16:42-0500",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 26 (Oracle Corporation)"
)
@Component
public class UsuarioMapperImpl implements UsuarioMapper {

    @Override
    public Usuario toEntity(UsuarioRequest request) {
        if ( request == null ) {
            return null;
        }

        Usuario usuario = crearUsuario( request );

        usuario.setCorreo( request.correo() );
        usuario.setContrasena( request.contrasena() );
        usuario.setEstado( request.estado() );
        usuario.setNombre( request.nombre() );
        usuario.setApellido( request.apellido() );
        usuario.setTelefono( request.telefono() );
        usuario.setFechaCreacion( request.fechaCreacion() );
        usuario.setUltimoAcceso( request.ultimoAcceso() );

        mapearCamposDelHijo( request, usuario );

        return usuario;
    }
}
