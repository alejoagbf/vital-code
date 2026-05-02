// src/features/auth/api/authService.ts

import { apiClient as api } from '../../../services/api';

import type { LoginResponseBackend } from '../types/auth.types';

const nowIso = () => new Date().toISOString().slice(0, 19);

// Usuarios demo (Fallback si el backend no responde)
const DEMO_USERS: Record<string, LoginResponseBackend> = {
    'admin@vitalcode.com': {
        idUsuario: 1, tipoUsuario: 'ADMINISTRADOR',
        nombre: 'Alejandro', apellido: 'Vélez',
        correo: 'admin@vitalcode.com', estado: true, telefono: '+57 300 000 0000',
        fechaCreacion: nowIso(), ultimoAcceso: nowIso(),
        departamento: 'Dirección General',
    },
    'medico@vitalcode.com': {
        idUsuario: 2, tipoUsuario: 'PERSONAL_SALUD',
        nombre: 'Elena', apellido: 'Santos',
        correo: 'medico@vitalcode.com', estado: true, telefono: '+57 301 000 0000',
        fechaCreacion: nowIso(), ultimoAcceso: nowIso(),
        cargo: 'Médico Internista', numLicencia: 123456, institucion: 'Clínica Valle del Lili',
    },
    'paciente@vitalcode.com': {
        idUsuario: 3, tipoUsuario: 'PACIENTE',
        nombre: 'Carlos', apellido: 'Méndez',
        correo: 'paciente@vitalcode.com', estado: true, telefono: '+57 302 000 0000',
        fechaCreacion: nowIso(), ultimoAcceso: nowIso(),
        numDocumento: 1078901234, grupoSanguineo: 'O+', eps: 'Sura', genero: 'MASCULINO',
        fechaNacimiento: '1990-05-15T00:00:00',
    },
};

export const login = async (correo: string, contrasena: string): Promise<LoginResponseBackend> => {
    try {
        const { data } = await api.post<LoginResponseBackend>('/v1/usuarios/login', { correo, contrasena });
        localStorage.setItem('vitalcode_token', 'auth');
        localStorage.setItem('vitalcode_user', JSON.stringify(data));
        return data;
    } catch (err: any) {
        if (!err.response) {
            const demo = DEMO_USERS[correo.trim().toLowerCase()];
            if (demo && contrasena.length >= 3) {
                localStorage.setItem('vitalcode_token', 'demo');
                localStorage.setItem('vitalcode_user', JSON.stringify(demo));
                return demo;
            }
        }
        throw err;
    }
};

export const logout = (): void => {
    localStorage.removeItem('vitalcode_token');
    localStorage.removeItem('vitalcode_user');
};