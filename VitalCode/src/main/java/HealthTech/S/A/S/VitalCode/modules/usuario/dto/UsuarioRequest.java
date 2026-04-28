package HealthTech.S.A.S.VitalCode.modules.usuario.dto;

import jakarta.persistence.Column;

import java.time.LocalDateTime;

public record UsuarioRequest(

        String tipoUsuario,

        String correo,

        String contrasena,

        Boolean estado,

        String nombre,

        String apellido,

        String telefono,

        LocalDateTime fechaCreacion,

        LocalDateTime ultimoAcceso,

        String departamento,

        Long numDocumento,

        LocalDateTime fechaNacimiento,

        String grupoSanguineo,

        String eps,

        String genero,

        String cargo,

        Long numLicencia,

        String institucion
) {}
