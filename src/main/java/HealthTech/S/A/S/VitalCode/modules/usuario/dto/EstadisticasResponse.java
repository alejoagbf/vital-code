package HealthTech.S.A.S.VitalCode.modules.usuario.dto;

import java.util.List;
import java.util.Map;

public record EstadisticasResponse(
        long totalUsuarios,
        long totalPacientes,
        long totalPersonalSalud,
        long totalAdministradores,
        long usuariosActivos,
        long usuariosInactivos,
        Map<String, Long> pacientesPorEps,
        Map<String, Long> pacientesPorGenero,
        Map<String, Long> pacientesPorGrupoSanguineo,
        Map<String, Long> personalPorCargo,
        Map<String, Long> personalPorInstitucion,
        Map<String, Long> administradoresPorDepartamento,
        List<RegistroReciente> ultimosRegistrados
) {
    public record RegistroReciente(
            Long idUsuario,
            String nombre,
            String apellido,
            String correo,
            String tipoUsuario,
            String fechaCreacion
    ) {}
}
