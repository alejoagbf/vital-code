package HealthTech.S.A.S.VitalCode.modules.usuario.repository;

import HealthTech.S.A.S.VitalCode.domain.Usuario;
import HealthTech.S.A.S.VitalCode.modules.usuario.dto.EstadisticaResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario,Long> {

    Optional<Usuario> findByCorreo(String correo);


    // CONSULTAS PARA LOS 5 GRÁFICOS (Retornan EstadisticaResponse)

    //  Usuarios por Rol (Usamos TYPE para diferenciar las clases hijas)
    @Query("SELECT new HealthTech.S.A.S.VitalCode.modules.usuario.dto.EstadisticaResponse(" +
            "CASE WHEN TYPE(u) = Administrador THEN 'Administrador' " +
            "WHEN TYPE(u) = Paciente THEN 'Paciente' " +
            "ELSE 'Personal de Salud' END, COUNT(u)) " +
            "FROM Usuario u GROUP BY TYPE(u)")
    List<EstadisticaResponse> contarUsuariosPorRol();


    //  Pacientes por EPS
    @Query("SELECT new HealthTech.S.A.S.VitalCode.modules.usuario.dto.EstadisticaResponse(p.eps, COUNT(p)) FROM Paciente p GROUP BY p.eps")
    List<EstadisticaResponse> contarPacientesPorEps();

    // Estado de Usuarios (Activos vs Inactivos)
    @Query("SELECT new HealthTech.S.A.S.VitalCode.modules.usuario.dto.EstadisticaResponse(CASE WHEN u.estado = true THEN 'Activo' ELSE 'Inactivo' END, COUNT(u)) FROM Usuario u GROUP BY u.estado")
    List<EstadisticaResponse> contarUsuariosPorEstado();

    // Pacientes por Género
    @Query("SELECT new HealthTech.S.A.S.VitalCode.modules.usuario.dto.EstadisticaResponse(p.genero, COUNT(p)) FROM Paciente p GROUP BY p.genero")
    List<EstadisticaResponse> contarPacientesPorGenero();

    //  Personal de Salud por Cargo
    @Query("SELECT new HealthTech.S.A.S.VitalCode.modules.usuario.dto.EstadisticaResponse(ps.cargo, COUNT(ps)) FROM PersonalSalud ps GROUP BY ps.cargo")
    List<EstadisticaResponse> contarPersonalPorCargo();


    //  REPORTES Y FILTROS (Retornan List<Usuario> para mapear a Response)

    //  Filtrar Pacientes por EPS
    @Query("SELECT p FROM Paciente p WHERE p.eps = :eps")
    List<Usuario> buscarPacientesPorEps(String eps);

    //  Filtrar Personal por Institución
    @Query("SELECT ps FROM PersonalSalud ps WHERE ps.institucion = :institucion")
    List<Usuario> buscarPersonalPorInstitucion(String institucion);

    //  Filtrar Usuarios Inactivos (Magia de Spring, no requiere @Query)
    List<Usuario> findByEstadoFalse();

    //  Últimos 10 Usuarios Registrados (Magia de Spring, ordena y limita)
    List<Usuario> findTop10ByOrderByFechaCreacionDesc();

    //  Filtrar Pacientes por Grupo Sanguíneo
    @Query("SELECT p FROM Paciente p WHERE p.grupoSanguineo = :grupoSanguineo")
    List<Usuario> buscarPacientesPorGrupoSanguineo(String grupoSanguineo);

}
