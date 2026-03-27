# Fase 00 — Setup del Repositorio y Pipeline GitOps

| Campo | Valor |
|-------|-------|
| **Épica** | Infraestructura de Control de Versiones |
| **Rama** | `feature/fase-00-setup-repo` |
| **Dependencia** | Ninguna — es la primera fase |
| **Duración estimada** | 1 sprint corto (1-2 horas) |

---

## Objetivo del Sprint

Crear el repositorio en GitHub vía MCP Server, establecer los archivos fundacionales del proyecto (`CHANGELOG.md`, `.gitignore`, `README.md`) y dejar el pipeline GitOps completamente operativo para que todas las fases subsiguientes sigan el flujo de ramas.

---

## Checklist de Tareas (Orden de Ejecución)

### 1. Crear Repositorio
- [ ] Ejecutar `mcp_github-mcp-server_create_repository` con:
  - `name`: `campus`
  - `private`: `true`
  - `autoInit`: `true` (genera README inicial)
  - `description`: `Campus Online · Método Raptor PREICFES — PWA educativa`

### 2. Crear Rama de Trabajo
- [ ] Ejecutar `mcp_github-mcp-server_create_branch`:
  - `branch`: `feature/fase-00-setup-repo`
  - `from_branch`: `main`

### 3. Generar Archivos Base
- [ ] Ejecutar `mcp_github-mcp-server_push_files` en la rama `feature/fase-00-setup-repo` con los siguientes archivos:

#### `CHANGELOG.md`
```markdown
# Changelog — Campus Online · Método Raptor PREICFES

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).
Commits siguen [Conventional Commits](https://www.conventionalcommits.org/) en español.

---

## [Sin publicar]

### Agregado
- Inicialización del repositorio y estructura base del proyecto.
- Configuración de CHANGELOG.md, .gitignore y README.md.
```

#### `.gitignore`
```
# Dependencias
node_modules/
.pnp/
.pnp.js

# Build
.next/
out/
build/
dist/

# Variables de entorno
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Firebase
*-debug.log
firebase-debug.log
firestore-debug.log
ui-debug.log
.firebase/
serviceAccountKey.json

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Misc
npm-debug.log*
yarn-debug.log*
yarn-error.log*
*.tsbuildinfo
next-env.d.ts

# PWA
sw.js
workbox-*.js
```

#### `README.md`
```markdown
# 🦅 Campus Online · Método Raptor PREICFES

PWA educativa para la preparación del ICFES bajo la metodología Raptor.

## Stack Tecnológico

| Componente | Tecnología |
|---|---|
| Framework | Next.js (App Router) |
| Estilos | Tailwind CSS + shadcn/ui |
| Auth & DB | Firebase (Auth + Firestore) |
| Notificaciones | Firebase Cloud Messaging |
| Imágenes | Cloudinary |
| Archivos/Videos | Google Drive |
| Hosting | Vercel |
| Tipo | PWA (Progressive Web App) |

## Inicio Rápido

\`\`\`bash
npm install
npm run dev
\`\`\`

## Documentación

Ver [ROADMAP.md](./ROADMAP.md) para el plan de desarrollo completo.
Ver [/docs/fases/](./docs/fases/) para el detalle de cada fase.
```

### 4. Actualizar CHANGELOG
- [ ] Agregar entrada de Fase 00 al `CHANGELOG.md` dentro de la misma rama.

### 5. Crear Pull Request
- [ ] Ejecutar `mcp_github-mcp-server_create_pull_request`:
  - `title`: `Fase 00 — Inicialización del repositorio y pipeline GitOps`
  - `body`: Resumen de archivos creados.
  - `head`: `feature/fase-00-setup-repo`
  - `base`: `main`

### 6. Merge
- [ ] Ejecutar `mcp_github-mcp-server_merge_pull_request`:
  - `merge_method`: `squash`

---

## Stack y Skills Necesarias

| Herramienta | Propósito |
|-------------|-----------|
| MCP GitHub Server | Todas las operaciones de Git |
| GitHub Account | Propiedad del repositorio |

No se requieren dependencias de código ni instalaciones npm en esta fase.

---

## Modelado de Datos

No aplica para esta fase — no se interactúa con Firestore.

---

## GitOps — Instrucciones de Cierre

### Commits de esta fase
```
chore(repo): inicializa repositorio con changelog y gitignore
docs(repo): crea README con stack y guía de inicio rápido
```

### Actualización del CHANGELOG.md
Agregar al `CHANGELOG.md` antes del merge:
```markdown
## [Fase 00] — 2026-03-XX — Setup del Repositorio

### Agregado
- Repositorio `campus` creado en GitHub (privado).
- Archivo `CHANGELOG.md` con formato Keep a Changelog.
- Archivo `.gitignore` configurado para Next.js + Firebase.
- Archivo `README.md` con descripción del stack.
```

### Comando PR (MCP)
```
mcp_github-mcp-server_create_pull_request
  title: "Fase 00 — Inicialización del repositorio y pipeline GitOps"
  head: "feature/fase-00-setup-repo"
  base: "main"
```

### Merge (MCP)
```
mcp_github-mcp-server_merge_pull_request
  merge_method: "squash"
  commit_title: "chore(repo): fase 00 completa — setup repositorio y gitops"
```
