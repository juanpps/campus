# Fase 04 — Dashboards por Rol

| Campo | Valor |
|-------|-------|
| **Épica** | Paneles Principales |
| **Rama** | `feature/fase-04-dashboards` |
| **Dependencia** | Fase 03 completada |
| **Duración estimada** | 1 sprint (5-7 horas) |

---

## Objetivo del Sprint

Implementar el dashboard principal (Home) de cada rol con datos leídos de Firestore en tiempo real, widgets funcionales y diseño responsive que aproveche el layout adaptativo de la Fase 03.

---

## Checklist de Tareas (Orden de Ejecución)

### 1. Crear Rama de Trabajo
- [ ] `mcp_github-mcp-server_create_branch`: `feature/fase-04-dashboards` desde `main`

### 2. Instalar Componentes shadcn/ui Adicionales
```bash
npx shadcn@latest add progress
npx shadcn@latest add chart        # Si disponible, o usar Recharts directamente
```
```bash
npm install recharts               # Gráficos para estadísticas de admin
npm install date-fns               # Manipulación de fechas para countdown
```

### 3. Preparar Datos Base en Firestore
- [ ] Crear documento `/config/general` con:
  ```typescript
  {
    fecha_icfes: Timestamp,               // Fecha del ICFES para countdown
    frase_motivacional: string,           // "¡Tú puedes, Raptorcito! 🦅"
    modo_mantenimiento: false,
    mensaje_mantenimiento: "",
    banner_modal_activo: false,
    banner_modal_url: "",
    apps_externas: []
  }
  ```
- [ ] Crear documento `/cohortes/{cohorte_actual}` con:
  ```typescript
  {
    nombre: string,
    fecha_inicio: Timestamp,
    fecha_icfes: Timestamp,
    activa: true
  }
  ```

### 4. Dashboard del Estudiante

- [ ] `src/app/(estudiante)/dashboard/page.tsx`:

  **Componentes a crear:**

  | Componente | Descripción | Ubicación |
  |------------|-------------|-----------|
  | `WelcomeCard` | Bienvenida con nombre: "¡Hola, {nombre}! 🦅" | `components/estudiante/` |
  | `MotivationBox` | Frase motivacional desde `/config/general` | `components/estudiante/` |
  | `CountdownTimer` | Cuenta regresiva al ICFES (días, horas, minutos) | `components/shared/` |
  | `ProgressRing` | Porcentaje de simulacros completados (SVG circular) | `components/shared/` |
  | `AnnouncementCard` | Card de anuncio con autor, fecha, contenido truncado | `components/shared/` |
  | `EventPreviewCard` | Evento con fecha, hora, materia y color | `components/shared/` |
  | `StreakBadge` | Racha de días consecutivos con icono de fuego | `components/estudiante/` |
  | `SubjectProgressBar` | Barra de avance por materia con color | `components/estudiante/` |
  | `LastClassCard` | Última clase vista con botón "Continuar" | `components/estudiante/` |

  **Layout responsive:**
  - **Desktop:** Grid de 3 columnas. Welcome + motivation en fila completa, countdown y stats en la izquierda, anuncios y eventos en la derecha.
  - **Móvil:** Stack vertical de cards, scroll natural.

### 5. Dashboard del Tutor

- [ ] `src/app/(tutor)/dashboard/page.tsx`:

  | Componente | Descripción |
  |------------|-------------|
  | `QuickActionGrid` | Grid de botones: Subir clase, Subir material, Publicar anuncio, Crear simulacro, Agregar actividad |
  | `UpcomingTimeline` | Timeline vertical de próximas clases con fecha y hora |
  | `TutorStatsCards` | Total clases, materiales, anuncios activos, simulacros |

  **Layout:**
  - **Desktop:** Stats en fila superior (4 cards), acciones rápidas en la izquierda, timeline a la derecha.
  - **Móvil:** Stats 2x2 grid, acciones rápidas como lista vertical.

### 6. Dashboard del Admin

- [ ] `src/app/(admin)/dashboard/page.tsx`:

  | Componente | Descripción |
  |------------|-------------|
  | `PlatformStatsGrid` | Cards: Total estudiantes, Tutores activos, Materias, Anuncios activos |
  | `AdminQuickActions` | Botones: Agregar estudiante, Asignar tutor, Publicar anuncio, Crear evento, Agregar app |
  | `UsageChart` | Gráfico de barras: actividad por día (Recharts) |

  **Layout:**
  - **Desktop:** Stats en fila, chart grande debajo, acciones rápidas como sidebar derecha.
  - **Móvil:** Stats 2x2, chart full-width, acciones como FAB o lista.

### 7. Dashboard del Super Admin

- [ ] `src/app/(superadmin)/dashboard/page.tsx`:

  | Componente | Descripción |
  |------------|-------------|
  | `SystemStatusCard` | Estado del sistema: DB OK, Auth OK, modo mantenimiento |
  | `MaintenanceToggle` | Switch para activar/desactivar modo mantenimiento |
  | `UpdateLog` | Lista cronológica de actualizaciones publicadas |
  | `AdminList` | Tabla de cuentas admin con acciones rápidas |

### 8. Crear Hook useFirestoreDoc

- [ ] `src/hooks/useFirestoreDoc.ts`:
  - Wrapper para `onSnapshot` con estados: `data`, `loading`, `error`.
  - Usado por todos los dashboards para datos en tiempo real.

### 9. Banner Modal Condicional

- [ ] Crear `src/components/shared/BannerModal.tsx`:
  - Leer `/config/general.banner_modal_activo`.
  - Si activo: mostrar modal con imagen (Cloudinary URL) al entrar al dashboard.
  - Botón "Cerrar" + checkbox "No mostrar de nuevo hoy" (localStorage).
  - Usar componente `Dialog` de shadcn.

---

## Stack y Skills Necesarias

| Herramienta | Comando / Recurso |
|-------------|-------------------|
| shadcn/ui | `npx shadcn@latest add progress chart` |
| Recharts | `npm install recharts` |
| date-fns | `npm install date-fns` |

---

## Modelado de Datos

### Colección `/config/general` (lectura)
```typescript
{
  fecha_icfes: Timestamp;
  frase_motivacional: string;
  modo_mantenimiento: boolean;
  mensaje_mantenimiento: string;
  banner_modal_activo: boolean;
  banner_modal_url: string;
  apps_externas: Array<{
    nombre: string;
    descripcion: string;
    url: string;
    icono_url: string;
    orden: number;
  }>;
}
```

### Colección `/cohortes/{cohorte_id}` (lectura)
```typescript
{
  nombre: string;
  fecha_inicio: Timestamp;
  fecha_icfes: Timestamp;
  activa: boolean;
}
```

---

## GitOps — Instrucciones de Cierre

### Commits de esta fase
```
feat(estudiante): crea dashboard con countdown ICFES y progreso por materia
feat(estudiante): implementa racha de días y última clase vista
feat(tutor): construye dashboard con acciones rápidas y timeline
feat(admin): implementa panel de resumen con estadísticas y gráficos
feat(superadmin): crea dashboard de estado del sistema
feat(shared): crea componentes reutilizables (CountdownTimer, ProgressRing, AnnouncementCard)
feat(firestore): crea hook useFirestoreDoc para datos en tiempo real
feat(ui): implementa banner modal condicional desde config
docs(changelog): registra entregables de la Fase 04
```

### Actualización del CHANGELOG.md
```markdown
## [Fase 04] — 2026-XX-XX — Dashboards por Rol

### Agregado
- Dashboard del estudiante con bienvenida, countdown ICFES, progreso, racha y última clase.
- Dashboard del tutor con acciones rápidas, timeline y estadísticas de materia.
- Dashboard del admin con resumen de plataforma, gráficos y acciones rápidas.
- Dashboard del super admin con estado del sistema y control de mantenimiento.
- Componentes shared: CountdownTimer, ProgressRing, AnnouncementCard, EventPreviewCard.
- Hook useFirestoreDoc para lectura en tiempo real.
- Banner modal condicional desde configuración.
```

### Comando PR (MCP)
```
mcp_github-mcp-server_create_pull_request
  title: "Fase 04 — Dashboards por rol con datos en tiempo real"
  head: "feature/fase-04-dashboards"
  base: "main"
```

### Merge (MCP)
```
mcp_github-mcp-server_merge_pull_request
  merge_method: "squash"
  commit_title: "feat(dashboards): fase 04 completa — paneles principales por rol"
```
