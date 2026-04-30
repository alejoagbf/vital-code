package HealthTech.S.A.S.VitalCode.modules.usuario.controller;

import HealthTech.S.A.S.VitalCode.domain.Administrador;
import HealthTech.S.A.S.VitalCode.domain.Paciente;
import HealthTech.S.A.S.VitalCode.domain.PersonalSalud;
import HealthTech.S.A.S.VitalCode.domain.Usuario;
import HealthTech.S.A.S.VitalCode.modules.usuario.dto.*;
import HealthTech.S.A.S.VitalCode.modules.usuario.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/usuarios")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:4173"})
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    // ── CRUD ─────────────────────────────────────────────────────────────────
    @PostMapping
    public UsuarioResponse crearUsuario(@RequestBody UsuarioRequest usuario) throws Exception {
        return usuarioService.crearUsuario(usuario);
    }

    @GetMapping
    public List<Usuario> listadoGeneral() throws Exception {
        return usuarioService.listadoGeneral();
    }

    @PutMapping("/{idUsuario}")
    public Usuario estadoUsuario(@PathVariable Long idUsuario) throws Exception {
        return usuarioService.estadoUsuario(idUsuario);
    }

    @GetMapping("/encontrarId/{idUsuario}")
    public Usuario encontrarId(@PathVariable Long idUsuario) throws Exception {
        return usuarioService.buscarUsuarioPorId(idUsuario);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = usuarioService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/estadisticas")
    public ResponseEntity<EstadisticasResponse> estadisticas() throws Exception {
        return ResponseEntity.ok(usuarioService.obtenerEstadisticas());
    }

    // ── Consultas (req. 14) ──────────────────────────────────────────────────
    /** 1. Listado general (ya existe en GET /). */

    /** 2. Listar por estado (activos / inactivos). */
    @GetMapping("/consultas/por-estado")
    public List<Usuario> consultaPorEstado(@RequestParam Boolean estado) {
        return usuarioService.listarPorEstado(estado);
    }

    /** 3. Buscar por nombre o apellido. */
    @GetMapping("/consultas/buscar")
    public List<Usuario> consultaBuscarTexto(@RequestParam String texto) {
        return usuarioService.buscarPorTexto(texto);
    }

    /** 4. Listar todos los pacientes. */
    @GetMapping("/consultas/pacientes")
    public List<Paciente> consultaPacientes() {
        return usuarioService.listarPacientes();
    }

    /** 5. Filtrar pacientes por EPS. */
    @GetMapping("/consultas/pacientes/eps")
    public List<Paciente> consultaPacientesPorEps(@RequestParam String eps) {
        return usuarioService.listarPacientesPorEps(eps);
    }

    /** 6. Buscar paciente por número de documento (PK funcional). */
    @GetMapping("/consultas/pacientes/documento/{doc}")
    public ResponseEntity<?> consultaPacientePorDocumento(@PathVariable Long doc) {
        try {
            return ResponseEntity.ok(usuarioService.buscarPacientePorDocumento(doc));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    /** 7. Listar todo el personal de salud. */
    @GetMapping("/consultas/personal-salud")
    public List<PersonalSalud> consultaPersonalSalud() {
        return usuarioService.listarPersonalSalud();
    }

    /** 8. Filtrar personal de salud por cargo. */
    @GetMapping("/consultas/personal-salud/cargo")
    public List<PersonalSalud> consultaPersonalPorCargo(@RequestParam String cargo) {
        return usuarioService.listarPersonalPorCargo(cargo);
    }

    /** 9. Listar todos los administradores. */
    @GetMapping("/consultas/administradores")
    public List<Administrador> consultaAdministradores() {
        return usuarioService.listarAdministradores();
    }

    /** 10. Últimos N usuarios registrados. */
    @GetMapping("/consultas/ultimos-registrados")
    public List<Usuario> consultaUltimosRegistrados(@RequestParam(defaultValue = "10") int limit) {
        return usuarioService.listarUltimosRegistrados(limit);
    }
}
