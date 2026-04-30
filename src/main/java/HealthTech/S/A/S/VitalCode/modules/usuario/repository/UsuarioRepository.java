package HealthTech.S.A.S.VitalCode.modules.usuario.repository;

import HealthTech.S.A.S.VitalCode.domain.Administrador;
import HealthTech.S.A.S.VitalCode.domain.Paciente;
import HealthTech.S.A.S.VitalCode.domain.PersonalSalud;
import HealthTech.S.A.S.VitalCode.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByCorreo(String correo);

    long countByEstado(Boolean estado);

    List<Usuario> findByEstado(Boolean estado);

    @Query("SELECT u FROM Usuario u WHERE LOWER(u.nombre) LIKE LOWER(CONCAT('%', :texto, '%')) " +
           "OR LOWER(u.apellido) LIKE LOWER(CONCAT('%', :texto, '%'))")
    List<Usuario> buscarPorNombreOApellido(@Param("texto") String texto);

    @Query("SELECT p FROM Paciente p")
    List<Paciente> findAllPacientes();

    @Query("SELECT p FROM Paciente p WHERE p.eps = :eps")
    List<Paciente> findPacientesByEps(@Param("eps") String eps);

    @Query("SELECT p.eps, COUNT(p) FROM Paciente p WHERE p.eps IS NOT NULL GROUP BY p.eps")
    List<Object[]> contarPacientesPorEps();

    @Query("SELECT p.genero, COUNT(p) FROM Paciente p WHERE p.genero IS NOT NULL GROUP BY p.genero")
    List<Object[]> contarPacientesPorGenero();

    @Query("SELECT p.grupoSanguineo, COUNT(p) FROM Paciente p WHERE p.grupoSanguineo IS NOT NULL GROUP BY p.grupoSanguineo")
    List<Object[]> contarPacientesPorGrupoSanguineo();

    @Query("SELECT p FROM Paciente p WHERE p.numDocumento = :doc")
    Optional<Paciente> findPacienteByNumDocumento(@Param("doc") Long doc);

    @Query("SELECT ps FROM PersonalSalud ps")
    List<PersonalSalud> findAllPersonalSalud();

    @Query("SELECT ps.cargo, COUNT(ps) FROM PersonalSalud ps WHERE ps.cargo IS NOT NULL GROUP BY ps.cargo")
    List<Object[]> contarPersonalPorCargo();

    @Query("SELECT ps.institucion, COUNT(ps) FROM PersonalSalud ps WHERE ps.institucion IS NOT NULL GROUP BY ps.institucion")
    List<Object[]> contarPersonalPorInstitucion();

    @Query("SELECT ps FROM PersonalSalud ps WHERE ps.cargo = :cargo")
    List<PersonalSalud> findPersonalByCargo(@Param("cargo") String cargo);

    @Query("SELECT a FROM Administrador a")
    List<Administrador> findAllAdministradores();

    @Query("SELECT a.departamento, COUNT(a) FROM Administrador a WHERE a.departamento IS NOT NULL GROUP BY a.departamento")
    List<Object[]> contarAdministradoresPorDepartamento();

    @Query("SELECT u FROM Usuario u ORDER BY u.fechaCreacion DESC")
    List<Usuario> findUltimosRegistrados();
}
