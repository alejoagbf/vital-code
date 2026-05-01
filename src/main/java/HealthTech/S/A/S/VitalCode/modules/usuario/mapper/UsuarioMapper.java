package HealthTech.S.A.S.VitalCode.modules.usuario.mapper;

import HealthTech.S.A.S.VitalCode.domain.Administrador;
import HealthTech.S.A.S.VitalCode.domain.Paciente;
import HealthTech.S.A.S.VitalCode.domain.PersonalSalud;
import HealthTech.S.A.S.VitalCode.domain.Usuario;
import HealthTech.S.A.S.VitalCode.modules.usuario.dto.UsuarioRequest;
import HealthTech.S.A.S.VitalCode.modules.usuario.dto.UsuarioResponse;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ObjectFactory;

import java.time.LocalDateTime;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    Usuario toEntity(UsuarioRequest request);

    default UsuarioResponse toResponse(Usuario usuario) {
        if (usuario == null) return null;


        String tipoStr = null;
        String departamentoStr = null;
        Long numDoc = null;
        LocalDateTime fechaNac = null;
        String grupoSang = null;
        String epsStr = null;
        String generoStr = null;
        String cargoStr = null;
        Long licenciaLong = null;
        String instStr = null;

        // Extraemos los datos dependiendo de qué hijo sea
        if (usuario instanceof PersonalSalud p) {
            tipoStr = "PERSONAL_SALUD";
            cargoStr = p.getCargo();
            licenciaLong = p.getNumLicencia();
            instStr = p.getInstitucion();
        } else if (usuario instanceof Paciente pac) {
            tipoStr = "PACIENTE";
            numDoc = pac.getNumDocumento();
            fechaNac = pac.getFechaNacimiento();
            grupoSang = pac.getGrupoSanguineo();
            epsStr = pac.getEps();
            generoStr = pac.getGenero();
        } else if (usuario instanceof Administrador admin) {
            tipoStr = "ADMINISTRADOR";
            departamentoStr = admin.getDepartamento();
        }

        // Retornamos mapeando estrictamente en el orden
        return new UsuarioResponse(
                tipoStr,                     // 1. String tipoUsuario
                usuario.getIdUsuario(),      // 2. Long idUsuario
                usuario.getCorreo(),         // 3. String correo
                usuario.getContrasena(),     // 4. String contrasena
                usuario.getEstado(),         // 5. Boolean estado
                usuario.getNombre(),         // 6. String nombre
                usuario.getApellido(),       // 7. String apellido
                usuario.getTelefono(),       // 8. String telefono
                usuario.getFechaCreacion(),  // 9. LocalDateTime fechaCreacion
                usuario.getUltimoAcceso(),   // 10. LocalDateTime ultimoAcceso
                departamentoStr,             // 11. String departamento
                numDoc,                      // 12. Long numDocumento
                fechaNac,                    // 13. LocalDateTime fechaNacimiento
                grupoSang,                   // 14. String grupoSanguineo
                epsStr,                      // 15. String eps
                generoStr,                   // 16. String genero
                cargoStr,                    // 17. String cargo
                licenciaLong,                // 18. Long numLicencia
                instStr                      // 19. String institucion
        );
    }


    @ObjectFactory
    default Usuario crearUsuario(UsuarioRequest request) {
        if (request.tipoUsuario() == null) {
            throw new IllegalArgumentException("El tipo de usuario es obligatorio para el registro.");
        }

        // Usamos toUpperCase() por si en el front lo mandan en minúsculas
        return switch (request.tipoUsuario().toUpperCase()) {
            case "ADMINISTRADOR" -> new Administrador();
            case "PACIENTE" -> new Paciente();
            case "PERSONAL_SALUD" -> new PersonalSalud();
            default -> throw new IllegalArgumentException("Tipo de usuario no válido: " + request.tipoUsuario());
        };
    }


    @AfterMapping
    default void mapearCamposDelHijo(UsuarioRequest request, @MappingTarget Usuario usuario) {
        if (usuario instanceof PersonalSalud p) {
            p.setCargo(request.cargo());
            p.setNumLicencia(request.numLicencia());
            p.setInstitucion(request.institucion());
        } else if (usuario instanceof Paciente pac) {
            pac.setNumDocumento(request.numDocumento());
            pac.setFechaNacimiento(request.fechaNacimiento());
            pac.setGrupoSanguineo(request.grupoSanguineo());
            pac.setEps(request.eps());
            pac.setGenero(request.genero());
        } else if (usuario instanceof Administrador admin) {
            admin.setDepartamento(request.departamento());
        }
    }
}
