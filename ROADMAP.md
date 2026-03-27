# 🦅 ROADMAP — Campus Online · Método Raptor PREICFES
## Índice Maestro (Epic Tracker)

> Este archivo es el punto de entrada al plan de desarrollo. Cada fase tiene su documento detallado en [`/docs/fases/`](./docs/fases/).

---

## Pipeline GitOps — Reglas Transversales

| Regla | Detalle |
|-------|--------|
| **Ramas** | Todo desarrollo en `feature/`, `fix/`, `chore/`. Prohibido commit directo a `main`. |
| **Commits** | Conventional Commits en español: `feat(auth): implementa protección de rutas` |
| **Cierre de fase** | Actualizar `CHANGELOG.md` → Crear PR vía MCP → Merge squash a `main` |
| **Herramientas** | Exclusivamente MCP GitHub Server (`create_branch`, `push_files`, `create_pull_request`, `merge_pull_request`) |

---

## Fases de Desarrollo

| # | Fase | Épica | Rama | Documento |
|:-:|------|-------|------|----------|
| 00 | Setup Repositorio y GitOps | Infraestructura | `feature/fase-00-setup-repo` | [00-setup-repo-gitops.md](./docs/fases/00-setup-repo-gitops.md) |
| 01 | Arquitectura Base | Fundación | `feature/fase-01-arquitectura` | [01-arquitectura-base.md](./docs/fases/01-arquitectura-base.md) |
| 02 | Autenticación y Roles | Acceso y Seguridad | `feature/fase-02-auth-roles` | [02-autenticacion-roles.md](./docs/fases/02-autenticacion-roles.md) |
| 03 | UI Base PWA | Experiencia Visual | `feature/fase-03-ui-base` | [03-ui-base-pwa.md](./docs/fases/03-ui-base-pwa.md) |
| 04 | Dashboards por Rol | Paneles Principales | `feature/fase-04-dashboards` | [04-dashboards-por-rol.md](./docs/fases/04-dashboards-por-rol.md) |
| 05 | Servicios Externos | Cloudinary y Drive | `feature/fase-05-servicios` | [05-servicios-externos.md](./docs/fases/05-servicios-externos.md) |
| 06 | Materias y Contenido | Core Académico | `feature/fase-06-materias` | [06-materias-contenido.md](./docs/fases/06-materias-contenido.md) |
| 07 | Mini Simulacros | Evaluación | `feature/fase-07-simulacros` | [07-simulacros.md](./docs/fases/07-simulacros.md) |
| 08 | Calendario y Anuncios | Comunicación | `feature/fase-08-calendario` | [08-calendario-anuncios.md](./docs/fases/08-calendario-anuncios.md) |
| 09 | Notificaciones FCM | Tiempo Real | `feature/fase-09-notificaciones` | [09-notificaciones-fcm.md](./docs/fases/09-notificaciones-fcm.md) |
| 10 | Producción y Deploy | Lanzamiento | `feature/fase-10-produccion` | [10-produccion-deploy.md](./docs/fases/10-produccion-deploy.md) |

---

*Campus Online · Método Raptor PREICFES — Roadmap v3.0*
*Actualizado: 2026-03-26*
