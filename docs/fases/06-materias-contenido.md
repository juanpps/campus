# Fase 06 — Materias y Gestión de Contenido

| Campo | Valor |
|-------|-------|
| **Épica** | Core Académico |
| **Rama** | `feature/fase-06-materias` |
| **Dependencia** | Fases 04 y 05 completadas |
| **Duración estimada** | 2 sprints (8-12 horas) |

---

## Objetivo del Sprint

Construir las vistas completas de materias (5 ICFES + Psicología como blog), la experiencia del estudiante para consumir clases y recursos, las herramientas del tutor para gestionar su contenido, y los paneles de administración de estudiantes y tutores.

---

## Checklist de Tareas (Orden de Ejecución)

### 1. Crear Rama de Trabajo
- [ ] `mcp_github-mcp-server_create_branch`: `feature/fase-06-materias` desde `main`

### 2. Instalar Componentes shadcn/ui Adicionales
```bash
npx shadcn@latest add table
npx shadcn@latest add select
npx shadcn@latest add switch
npx shadcn@latest add form              # Form con react-hook-form + zod
npx shadcn@latest add alert-dialog      # Confirmaciones destructivas
npx shadcn@latest add popover
```
```bash
npm install react-hook-form zod @hookform/resolvers
npm install papaparse                    # Exportar CSV
npm install @tanstack/react-table        # Tablas avanzadas
```

### 3. Poblar Firestore con Datos de Materias
- [ ] Crear documentos en `/materias/`:
  ```typescript
  // Las 5 materias ICFES + Psicología
  { nombre: "Matemáticas",       tipo: "icfes",    color_calendario: "#3B82F6", tutores: [] }
  { nombre: "Lectura Crítica",   tipo: "icfes",    color_calendario: "#10B981", tutores: [] }
  { nombre: "Ciencias Naturales",tipo: "icfes",    color_calendario: "#F59E0B", tutores: [] }
  { nombre: "Ciencias Sociales", tipo: "icfes",    color_calendario: "#8B5CF6", tutores: [] }
  { nombre: "Inglés",            tipo: "icfes",    color_calendario: "#EC4899", tutores: [] }
  { nombre: "Psicología",        tipo: "especial", color_calendario: "#06B6D4", tutores: [] }
  ```

### 4. Vista de Materias — Estudiante

- [ ] `src/app/(estudiante)/materias/page.tsx`:
  - Grid de 6 cards (3 columnas desktop, 2 columnas tablet, 1 columna móvil).
  - Cada card: banner de portada (CloudinaryImage), nombre de la materia, nombre del tutor(es), badge con número de clases.
  - Indicador "Nuevo" si hay contenido reciente (< 24h).
  - Click → navega a `/materias/[materiaId]`.

- [ ] `src/app/(estudiante)/materias/[materiaId]/page.tsx`:
  - **Banner superior:** imagen de portada a ancho completo (CloudinaryImage).
  - **Presentación del tutor:** avatar, nombre, materia.
  - **Tabs** (componente `Tabs` de shadcn):
    - **Clases:** tarjetas estilo YouTube con thumbnail (CloudinaryImage), título, fecha, indicador "Nuevo", badge "Vista" si el estudiante ya la marcó.
    - **Simulacros:** lista de simulacros disponibles con estado (disponible, completado, bloqueado).
    - **Actividades:** tarjetas con nombre, descripción, botón de acceso (link externo).
    - **Recursos:** lista de archivos con icono de tipo (PDF, diapositiva), nombre, botón "Ver" que abre DriveFileViewer.
    - **Anuncios:** comunicados activos del tutor de esta materia.

- [ ] `src/app/(estudiante)/materias/[materiaId]/clase/[claseId]/page.tsx`:
  - VideoPlayer (YouTube privado o Drive).
  - Título y descripción de la clase.
  - Botón "Marcar como vista" → actualiza array `vistas` en `/clases/{claseId}`.
  - Navegación: "Clase anterior" / "Clase siguiente".

### 5. Vista Especial — Psicología (Blog)

- [ ] `src/app/(estudiante)/materias/psicologia/page.tsx`:
  - Detectar si `materia.tipo === 'especial'` → renderizar layout de blog.
  - Lista de entradas: título, fecha, extracto (primeros 150 chars), imagen.
  - Click → vista de detalle con contenido completo, imágenes, recursos adjuntos.
  - **Sin** tabs de Clases ni Simulacros.

### 6. Gestión de Clases — Tutor

- [ ] `src/app/(tutor)/clases/page.tsx`:
  - Tabla con todas las clases subidas (DataTable con @tanstack/react-table).
  - Columnas: thumbnail, título, fecha, vistas (conteo), acciones.
  - Acciones por clase: editar, eliminar (AlertDialog de confirmación).
  - Botón "Nueva Clase" → navega a formulario.

- [ ] `src/app/(tutor)/clases/nueva/page.tsx` y `[claseId]/editar/page.tsx`:
  - Formulario con react-hook-form + zod:
    - Título (Input, requerido).
    - Descripción (TextArea).
    - Upload de thumbnail a Cloudinary (vista previa de imagen).
    - URL de video (Input, validación YouTube/Drive).
    - Selector de materia (Select de shadcn, filtrado a sus materias asignadas).
  - On submit → crea/actualiza documento en `/clases/{claseId}`.

### 7. Gestión de Materiales — Tutor

- [ ] `src/app/(tutor)/materiales/page.tsx`:
  - Tabla de recursos publicados: nombre, tipo, fecha, acciones.
  - Formulario de nuevo material: título, descripción, tipo (PDF/diapositiva/otro), URL de Drive.
  - On submit → crea documento en colección dedicada o sub-colección de materia.

### 8. Gestión de Estudiantes — Admin

- [ ] `src/app/(admin)/estudiantes/page.tsx`:
  - DataTable con búsqueda por nombre/correo, filtros por estado.
  - Columnas: avatar, nombre, correo, estado (badge con color), fecha registro, acciones.
  - Acciones: ver perfil, banear, congelar, reactivar, eliminar (todos con AlertDialog).
  - Botón "Generar Link de Acceso":
    - Abre Dialog → confirma → llama API `/api/auth/generar-link`.
    - Muestra URL generada con botón "Copiar".
  - Botón "Exportar CSV":
    - Usa papaparse para generar CSV con: nombre, correo, estado, fecha.
    - Descarga automática.

- [ ] `src/app/(admin)/estudiantes/[userId]/page.tsx`:
  - Perfil detallado: foto, nombre, correo, grado, fecha registro, estado.
  - Historial académico básico: simulacros realizados, puntajes, clases vistas por materia.

### 9. Gestión de Tutores — Admin

- [ ] `src/app/(admin)/tutores/page.tsx`:
  - Tabla de tutores: nombre, correo, materia(s), clases subidas, estado.
  - Acciones: cambiar materia, bloquear, eliminar.
  - Formulario "Agregar Tutor":
    - Input: correo de Google del tutor.
    - Select: materia(s) a asignar (multi-select).
    - On submit: crea/actualiza documento en `/usuarios` con `rol: 'tutor'` y `materia_asignada`.

---

## Stack y Skills Necesarias

| Herramienta | Comando / Recurso |
|-------------|-------------------|
| shadcn/ui | `table, select, switch, form, alert-dialog, popover` |
| react-hook-form | `npm install react-hook-form @hookform/resolvers` |
| zod | `npm install zod` |
| @tanstack/react-table | `npm install @tanstack/react-table` |
| papaparse | `npm install papaparse` |

---

## Modelado de Datos

### Colección `/materias/{materia_id}`
```typescript
{
  nombre: string;                  // "Matemáticas"
  tipo: 'icfes' | 'especial';     // 'especial' = Psicología
  banner_url: string;              // URL Cloudinary
  tutores: string[];               // Array de UIDs de tutores
  color_calendario: string;        // Hex para calendario y badges
}
```

### Colección `/clases/{clase_id}`
```typescript
{
  materia_id: string;
  titulo: string;
  descripcion?: string;
  thumbnail_url: string;          // URL Cloudinary
  video_url: string;              // YouTube privado o Drive
  tutor_id: string;
  fecha_publicacion: Timestamp;
  vistas: string[];               // Array de UIDs que marcaron "vista"
}
```

### Reglas de Seguridad Relevantes
```
match /clases/{claseId} {
  allow read: if request.auth != null;
  allow create, update: if request.auth != null
    && get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol == 'tutor';
  allow delete: if request.auth != null
    && get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol in ['tutor', 'admin'];
}

match /materias/{materiaId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null
    && get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol in ['admin', 'superadmin'];
}
```

---

## GitOps — Instrucciones de Cierre

### Commits de esta fase
```
feat(materias): crea vista de listado de materias con cards y banners
feat(materias): implementa vista detallada con tabs (Clases, Simulacros, Recursos, Anuncios)
feat(materias): construye reproductor de clases con VideoPlayer
feat(psicologia): implementa vista especial tipo blog
feat(tutor): crea CRUD completo de clases grabadas con upload a Cloudinary
feat(tutor): implementa gestión de materiales y recursos
feat(admin): construye panel de gestión de estudiantes con DataTable
feat(admin): implementa generación de links de acceso y exportar CSV
feat(admin): crea panel de gestión de tutores con asignación de materias
chore(firestore): agrega reglas de seguridad para clases y materias
docs(changelog): registra entregables de la Fase 06
```

### Actualización del CHANGELOG.md
```markdown
## [Fase 06] — 2026-XX-XX — Materias y Gestión de Contenido

### Agregado
- Vista de listado de materias (grid responsive con banners Cloudinary).
- Vista detallada de materia con tabs: Clases, Simulacros, Actividades, Recursos, Anuncios.
- Reproductor de clases (YouTube privado + Drive) con "Marcar como vista".
- Vista especial de Psicología como blog de contenido.
- CRUD de clases grabadas para tutores con upload de thumbnail.
- Gestión de materiales y recursos para tutores.
- Panel de gestión de estudiantes (DataTable con búsqueda, filtros, acciones).
- Generación de links de acceso único y exportación CSV.
- Panel de gestión de tutores con asignación de materias.
```

### Comando PR (MCP)
```
mcp_github-mcp-server_create_pull_request
  title: "Fase 06 — Materias, clases, recursos y gestión de usuarios"
  head: "feature/fase-06-materias"
  base: "main"
```

### Merge (MCP)
```
mcp_github-mcp-server_merge_pull_request
  merge_method: "squash"
  commit_title: "feat(materias): fase 06 completa — core académico y gestión de contenido"
```
