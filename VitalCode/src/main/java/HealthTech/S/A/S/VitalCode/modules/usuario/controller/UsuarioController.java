package HealthTech.S.A.S.VitalCode.modules.usuario.controller;


import HealthTech.S.A.S.VitalCode.modules.usuario.dto.LoginRequest;
import HealthTech.S.A.S.VitalCode.modules.usuario.dto.UsuarioRequest;
import HealthTech.S.A.S.VitalCode.modules.usuario.dto.UsuarioResponse;
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
    public List<UsuarioResponse> listadoGeneral () throws Exception {
        List<UsuarioResponse> listaGeneral = usuarioService.listadoGeneral();

        return listaGeneral;
    }

    @PutMapping("/{idUsuario}")
    public UsuarioResponse estadoUsuario(@PathVariable Long idUsuario) throws Exception {
        UsuarioResponse nuevoEstadoUsuario = usuarioService.estadoUsuario(idUsuario);

        return nuevoEstadoUsuario;

    }

    @GetMapping ("/encontrarId/{idUsuario}")
    public UsuarioResponse encontrarId(@PathVariable Long idUsuario) throws Exception {
        UsuarioResponse encontrarId = usuarioService.buscarUsuarioPorId(idUsuario);
        return encontrarId;
    }

    @PostMapping("/login")
    public UsuarioResponse login(@RequestBody LoginRequest credenciales) throws Exception {
        UsuarioResponse usuarioLogin = usuarioService.login(credenciales);
        return usuarioLogin;
    }


}
