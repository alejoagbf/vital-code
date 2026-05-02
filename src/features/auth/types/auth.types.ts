// src/features/auth/types/auth.types.ts

export interface LoginResponseBackend {
    idUsuario: number;
    tipoUsuario: string;
    nombre: string;
    apellido: string;
    correo: string;
    estado: boolean;
    telefono: string;
    fechaCreacion: string;
    ultimoAcceso: string;
    departamento?: string;
    numDocumento?: number;
    grupoSanguineo?: string;
    eps?: string;
    genero?: string;
    fechaNacimiento?: string;
    cargo?: string;
    numLicencia?: number;
    institucion?: string;
}