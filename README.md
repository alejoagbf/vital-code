# 🏥 VitalCode API REST - Backend (Rama: victor)

Bienvenido a la rama `victor` del proyecto **VitalCode**, desarrollado para HealthTech S.A.S. 
Esta rama está dedicada **exclusivamente al desarrollo del Backend** (API REST). El Frontend se manejará en una rama independiente para mantener la separación de responsabilidades.

## 🚀 Tecnologías Utilizadas
* **Lenguaje:** Java 17+
* **Framework:** Spring Boot 3
* **Persistencia:** Spring Data JPA / Hibernate (Patrón DAO)
* **Base de Datos:** MySQL
* **Mapeo de Objetos:** MapStruct
* **Utilidades:** Lombok

## 🏗️ Arquitectura
El proyecto sigue estrictamente los patrones **MVC (Model-View-Controller)** y **DAO (Data Access Object)** requeridos, organizados por capas:

* `domain/`: Entidades de la base de datos (con herencia para Administrador, Paciente y PersonalSalud).
* `repository/`: Interfaces de Spring Data JPA (DAO).
* `service/`: Lógica de negocio (Interfaces y sus implementaciones).
* `controller/`: Controladores REST que exponen los endpoints.
* `dto/`: Objetos de Transferencia de Datos (Data Transfer Objects) encapsulados mediante `records` y clases para aislar la base de datos del cliente.
* `mapper/`: Interfaces de MapStruct para conversiones automáticas entre Entidades y DTOs.

## 📌 Funcionalidades Actuales (MVP en progreso)

### 👥 Módulo de Usuarios
Se gestionan 3 tipos de perfiles usando herencia: `ADMINISTRADOR`, `PACIENTE` y `PERSONAL_SALUD`.

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `POST` | `/api/v1/usuarios` | Crea un nuevo usuario en el sistema. |
| `GET` | `/api/v1/usuarios` | Retorna el listado general de usuarios registrados. |
| `GET` | `/api/v1/usuarios/encontrarId/{id}` | Busca un usuario específico por su ID. |
| `PUT` | `/api/v1/usuarios/{id}` | Inactiva a un usuario (Cambio de estado lógico). |
| `POST` | `/api/v1/usuarios/login` | Autentica a un usuario y valida su estado activo. |

*Nota: Todos los endpoints de salida están protegidos retornando objetos `UsuarioResponse` para evitar la exposición de credenciales y datos sensibles.*

## ⚙️ Cómo ejecutar el proyecto localmente
1. Clonar el repositorio y cambiar a la rama victor: `git checkout victor`
2. Configurar las credenciales de la base de datos en `src/main/resources/application.properties`.
3. Ejecutar la clase principal `VitalCodeApplication.java` desde tu IDE (IntelliJ, Eclipse, VSCode).
4. El servidor se levantará por defecto en `http://localhost:8080`.
