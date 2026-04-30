package HealthTech.S.A.S.VitalCode.modules.usuario.dto;

import java.time.LocalDateTime;

public record LoginResponse(
        Long idUsuario,
        String tipoUsuario,
        String nombre,
        String apellido,
        String correo,
        Boolean estado,
        String telefono,
        LocalDateTime fechaCreacion,
        LocalDateTime ultimoAcceso,
        String departamento,
        Long numDocumento,
        String grupoSanguineo,
        String eps,
        String genero,
        LocalDateTime fechaNacimiento,
        String cargo,
        Long numLicencia,
        String institucion
) {}
