<img src="frontend/public/logo.png" alt="VitalCode Logo" width="120" />

# VitalCode — ¡Tu Salud a un Click!

> **Sistema Web de Gestión de Información Médica de Emergencia mediante Códigos QR**  
> Empresa de Servicios Tecnológicos en Salud · S.A.S · Tuluá, Valle del Cauca 🇨🇴

---

## Descripción del Proyecto

**VITAL CODE** es una microempresa privada de base tecnológica, dedicada a la innovación en salud digital y orientada a la prestación de servicios preventivos mediante herramientas tecnológicas accesibles.

El sistema permite crear un perfil médico digital vinculado a una **manilla o tarjeta inteligente con código QR**. Al ser escaneado por un profesional de la salud en una emergencia, se despliegan automáticamente los datos clínicos esenciales del paciente (alergias, tipo de sangre, patologías, medicamentos, contactos de emergencia), reduciendo el tiempo de obtención de información médica en un **90%** respecto a métodos tradicionales.

### Problema que resuelve

En situaciones de emergencia, la incapacidad de un paciente para comunicarse retrasa protocolos vitales. La falta de acceso inmediato a antecedentes médicos genera:

- ⏱️ **Pérdida de tiempo crítico** en la atención inicial
- ⚠️ **Riesgo de contraindicaciones** por desconocimiento de alergias
- 📵 **Falla en la comunicación** con familiares y acudientes

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React 18 + TypeScript + Tailwind CSS + Vite |
| **Backend** | Spring Boot (Java) + REST API |
| **Base de datos** | MySQL |
| **Íconos** | Lucide React |
| **Notificaciones** | React Hot Toast |
| **HTTP Client** | Axios |
| **Autenticación** | JWT |

---

## Funcionalidades

### Para el Paciente
- Registro y gestión de perfil clínico completo
- Generación de carnet digital con código QR único
- Gestión de contactos de emergencia
- Historial de escaneos realizados

### Para el Personal Médico
- Escaneo y visualización instantánea de ficha médica
- Dashboard con estadísticas de pacientes
- Gestión administrativa de usuarios
- Control de seguridad y roles de acceso

### Panel Administrativo (este repositorio)
- CRUD completo de **Pacientes**
- CRUD completo de **Personal de Salud**
- CRUD completo de **Administradores**
- Búsqueda, paginación y filtros en tiempo real
- Sistema de autenticación con JWT

---

## Estructura del Repositorio

```
vital-code/
├── frontend/                  # Aplicación React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        # Sidebar, DashboardLayout
│   │   │   └── ui/            # Modal, ConfirmDialog, Pagination
│   │   ├── pages/             # LoginPage, PacientesPage, etc.
│   │   ├── services/          # Axios API client
│   │   └── types/             # TypeScript interfaces
│   ├── tailwind.config.js
│   └── package.json
├── src/                       # Backend Spring Boot
│   └── main/java/HealthTech/
└── pom.xml
```

---

## Instalación y Uso

### Prerrequisitos
- Node.js 18+
- Java 17+
- MySQL 8+

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Backend

```bash
# Configura tu base de datos en src/main/resources/application.properties
./mvnw spring-boot:run
```

El API queda disponible en `http://localhost:8080/api`.

---

## Información Legal

| Campo | Dato |
|-------|------|
| **Razón Social** | VITAL CODE |
| **Tipo de Sociedad** | Sociedad por Acciones Simplificadas (S.A.S.) |
| **Actividad Económica** | Empresa de Servicios Tecnológicos en Salud |
| **Ciudad** | Tuluá |
| **Departamento** | Valle del Cauca |
| **Teléfono** | 3003378698 |

---

## Misión

Proveer soluciones digitales innovadoras y confiables que faciliten el acceso a la información médica, contribuyendo a salvar vidas, fortalecer la seguridad y la cultura del autocuidado en la comunidad.

## Visión

Para el año 2030, VITAL CODE será reconocida a nivel nacional como una empresa líder en innovación tecnológica en salud, referente en la integración de soluciones digitales que garanticen seguridad, eficiencia y calidad en la atención médica.

## Valores Institucionales

- 🤝 **Compromiso** — Soluciones que protegen la vida y el bienestar
- 💡 **Innovación** — Tecnología moderna para mejorar la atención en emergencias
- 🔒 **Responsabilidad** — Manejo ético, seguro y confidencial de la información
- 🫂 **Solidaridad** — Ayuda mutua y empatía en situaciones de emergencia
- ✅ **Calidad** — Productos confiables, funcionales y de alto impacto social
- 🛡️ **Prevención** — Cultura de preparación ante riesgos de salud
- 💙 **Confianza** — Tranquilidad y seguridad en cada usuario

---

## Presupuesto Inicial Estimado

| Categoría | Valor (COP) |
|-----------|-------------|
| Costos legales y administrativos | $337.000 |
| Desarrollo tecnológico | $3.500.000 |
| Producción de prototipos físicos (manillas/tarjetas) | $1.000.000 |
| Marketing y comunicación | $1.500.000 |
| Operación inicial (3 meses) | $1.750.000 |
| Arrendamiento y acondicionamiento | $2.100.000 |
| **TOTAL GENERAL ESTIMADO** | **$10.187.000** |

---

## Equipo de Desarrollo

### Proyecto Integrador — UCEVA 2025

**Estudiantes:**
- Mariana Zuleta Rodríguez
- Laura María García
- Ana Fernanda Posso
- Gissel Vanessa Cardona Mejía
- Albeiro Antonio Anaya Lucas

**Desarrollo de Software:**
- Alejandro Ortiz Marin · `Full Stack` · [alejoagbf](https://github.com/alejoagbf)
- Víctor Daniel Tigreros · `Full Stack`

**Docentes:**
- Lcda. Sara Marcela Vacca Ariza
- Lcdo. Harold Mauricio López Sepúlveda
- Lcdo. José Herney Sánchez Pizzaro
- Lcdo. Luis Alfonzo Russi Muñoz
- Lcdo. Rodrigo José Herrera Hoyos
- Lcdo. Mgs. Juan Sebastián Henao

**Institución:** Unidad Central del Valle del Cauca — UCEVA  
**Facultad:** Ciencias Administrativas, Económicas y Contables (FACAEC)  
**Programa:** Administración de Servicios de Salud · 2° Semestre · 2025

---

## Resultados Esperados

- ✅ Aplicación web funcional bajo arquitectura MVC con persistencia de datos
- ✅ Reducción del tiempo de obtención de información médica en un **90%**
- ✅ Disponibilidad de información las **24 horas** del día mediante acceso por QR
- ✅ Sistema de notificaciones automáticas a familiares vía correo electrónico

---

<p align="center">
  <strong>VITAL CODE</strong> · ¡Tu Salud a un Click! · Tuluá, Valle del Cauca · 2025
</p>
