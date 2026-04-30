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

        return new UsuarioResponse(
                tipoStr,
                usuario.getIdUsuario(),
                usuario.getCorreo(),
                usuario.getContrasena(),
                usuario.getEstado(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getTelefono(),
                usuario.getFechaCreacion(),
                usuario.getUltimoAcceso(),
                departamentoStr,
                numDoc,
                fechaNac,
                grupoSang,
                epsStr,
                generoStr,
                cargoStr,
                licenciaLong,
                instStr
        );
    }

    @ObjectFactory
    default Usuario crearUsuario(UsuarioRequest request) {
        if (request.tipoUsuario() == null) {
            throw new IllegalArgumentException("El tipo de usuario es obligatorio para el registro.");
        }

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
