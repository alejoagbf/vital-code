package HealthTech.S.A.S.VitalCode.modules.usuario.controller;

import HealthTech.S.A.S.VitalCode.domain.Usuario;
import HealthTech.S.A.S.VitalCode.modules.usuario.dto.UsuarioRequest;
import HealthTech.S.A.S.VitalCode.modules.usuario.dto.UsuarioResponse;
import HealthTech.S.A.S.VitalCode.modules.usuario.repository.UsuarioRepository;
import HealthTech.S.A.S.VitalCode.modules.usuario.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping
    public UsuarioResponse crearUsuario (@RequestBody UsuarioRequest usuario) throws Exception {
        UsuarioResponse usuarioNuevo = usuarioService.crearUsuario(usuario);
        return usuarioNuevo;
    }

    @GetMapping
    public List<Usuario> listadoGeneral () throws Exception {
        List<Usuario> listaGeneral = usuarioService.listadoGeneral();

        return listaGeneral;
    }

    @PutMapping("/{idUsuario}")
    public Usuario estadoUsuario(@PathVariable Long idUsuario) throws Exception {
        Usuario nuevoEstadoUsuario = usuarioService.estadoUsuario(idUsuario);

        return nuevoEstadoUsuario;

    }

    @GetMapping ("/encontrarId/{idUsuario}")
    public Usuario encontrarId(@PathVariable Long idUsuario) throws Exception {
        Usuario encontrarId = usuarioService.buscarUsuarioPorId(idUsuario);
        return encontrarId;
    }




}
