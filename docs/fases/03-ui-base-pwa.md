# Fase 03 — UI Base PWA (Navegación Adaptativa)

| Campo | Valor |
|-------|-------|
| **Épica** | Experiencia Visual Fundacional |
| **Rama** | `feature/fase-03-ui-base` |
| **Dependencia** | Fase 02 completada |
| **Duración estimada** | 1 sprint (4-6 horas) |

---

## Objetivo del Sprint

Establecer el sistema de diseño completo, implementar la navegación condicional (Sidebar fija en Desktop ≥ `lg` / Bottom Navigation Bar en Móvil `< lg`) y construir los componentes UI primitivos reutilizables con shadcn/ui. Al finalizar esta fase, cada rol debe ver su layout con navegación funcional.

---

## Checklist de Tareas (Orden de Ejecución)

### 1. Crear Rama de Trabajo
- [ ] `mcp_github-mcp-server_create_branch`: `feature/fase-03-ui-base` desde `main`

### 2. Instalar Componentes shadcn/ui
```bash
npx shadcn@latest add button card input textarea label avatar badge
npx shadcn@latest add dialog sheet dropdown-menu tooltip
npx shadcn@latest add skeleton scroll-area separator tabs
npx shadcn@latest add sonner                           # Para toasts
npx shadcn@latest add sidebar                          # Bloque sidebar
```

### 3. Definir Sistema de Diseño en Tailwind

- [ ] Editar `src/app/globals.css` con variables CSS de la marca Raptor:
  ```css
  @layer base {
    :root {
      /* Paleta Raptor — Modo Claro */
      --background: 0 0% 100%;
      --foreground: 222 47% 11%;
      --primary: /* Color principal Raptor */;
      --primary-foreground: 0 0% 100%;
      --secondary: /* Color secundario */;
      --accent: /* Color de acento */;
      --muted: 210 40% 96%;
      --destructive: 0 84% 60%;
      --border: 214 32% 91%;
      --ring: /* Anillo de focus */;
      --radius: 0.5rem;

      /* Colores semánticos por materia (para calendario y badges) */
      --color-matematicas: 221 83% 53%;
      --color-lectura: 150 60% 40%;
      --color-ciencias-nat: 38 92% 50%;
      --color-ciencias-soc: 280 60% 50%;
      --color-ingles: 340 75% 55%;
      --color-psicologia: 190 70% 45%;
      --color-raptor: /* Color de anuncios generales */;
    }

    .dark {
      /* Paleta Raptor — Modo Oscuro */
      --background: 222 47% 5%;
      --foreground: 210 40% 98%;
      /* ... variantes oscuras desaturadas ... */
    }
  }
  ```

- [ ] Configurar `tailwind.config.ts` con tokens adicionales:
  ```typescript
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'sidebar': '16rem',     // 256px — ancho sidebar desktop
        'bottomnav': '4rem',    // 64px — alto bottom nav
        'topbar': '3.5rem',     // 56px — alto topbar
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-up': 'slideUp 250ms ease-out',
        'slide-down': 'slideDown 200ms ease-in',
      },
    },
  },
  ```

### 4. Implementar Sidebar (Desktop ≥ lg:1024px)

- [ ] Crear `src/components/navigation/Sidebar.tsx`:
  - **Estructura:**
    - Logo Raptor en la parte superior (link al dashboard del rol).
    - Lista de items de navegación con icono (Lucide) + texto.
    - Indicador visual de sección activa (fondo resaltado + borde izquierdo primario).
    - Divisor (`Separator` de shadcn).
    - Nombre, avatar y rol del usuario en la parte inferior.
    - Botón de cerrar sesión.
  - **Comportamiento:**
    - Fija en el lado izquierdo, ancho `w-64` (16rem).
    - Oculta en pantallas `< lg` via `hidden lg:flex lg:flex-col`.
    - Usa `ScrollArea` de shadcn si hay muchos ítems.
  - **Props:**
    ```typescript
    interface SidebarProps {
      items: NavItem[];    // Items varían por rol
      user: RaptorUser;
    }
    interface NavItem {
      label: string;
      href: string;
      icon: LucideIcon;
      badge?: number;      // Para notificaciones pendientes
    }
    ```

### 5. Implementar Bottom Navigation Bar (Móvil < lg)

- [ ] Crear `src/components/navigation/BottomNav.tsx`:
  - **Estructura:**
    - Barra fija en la parte inferior, alto `h-16` (4rem).
    - Máximo 5 ítems con icono + label (texto pequeño).
    - Indicador de sección activa (color primario + dot o barra superior).
  - **Comportamiento:**
    - Visible solo en `< lg` via `flex lg:hidden`.
    - Posición `fixed bottom-0` con `z-50`.
    - Respeta safe area del dispositivo: `pb-safe` o `env(safe-area-inset-bottom)`.
    - Usa `border-t` para separación visual del contenido.
  - **Props:** mismas que Sidebar (`items`, `user`).
  - **Regla UX:** Si el rol tiene más de 5 secciones, las adicionales van en un menú "Más" (DropdownMenu de shadcn).

### 6. Implementar TopBar

- [ ] Crear `src/components/navigation/TopBar.tsx`:
  - **Estructura:**
    - Título de la sección actual (dinámico vía pathname).
    - Icono de notificaciones (`Bell` de Lucide) con badge numérico.
    - Avatar del usuario → `DropdownMenu` de shadcn con opciones:
      - Mi perfil
      - Modo oscuro / claro (toggle)
      - Cerrar sesión
  - **Comportamiento:**
    - Fija en la parte superior, alto `h-14` (3.5rem).
    - En desktop: se ubica a la derecha del sidebar (`lg:ml-sidebar`).
    - En móvil: ocupa todo el ancho.
    - Posición `sticky top-0` con `z-40` y `backdrop-blur`.

### 7. Crear Layouts por Rol

- [ ] Cada Route Group necesita su `layout.tsx` con la navegación correcta:

  **`src/app/(estudiante)/layout.tsx`:**
  ```tsx
  // Items: Home, Materias, Calendario, Anuncios, Apps, Perfil
  // Íconos: Home, BookOpen, Calendar, Megaphone, Grid, User
  // Bottom Nav (móvil): Home, Materias, Calendario, Anuncios, Perfil (5 max)
  // "Apps" se accede desde el perfil o menú "Más" en móvil
  ```

  **`src/app/(tutor)/layout.tsx`:**
  ```tsx
  // Items: Home, Clases, Materiales, Simulacros, Anuncios, Calendario, Estudiantes
  // Bottom Nav (móvil): Home, Clases, Simulacros, Calendario, Más
  // "Más" contiene: Materiales, Anuncios, Estudiantes
  ```

  **`src/app/(admin)/layout.tsx`:**
  ```tsx
  // Items: Home, Estudiantes, Tutores, Anuncios, Eventos, Configuración
  // Bottom Nav (móvil): Home, Estudiantes, Tutores, Anuncios, Más
  // "Más" contiene: Eventos, Configuración
  ```

  **`src/app/(superadmin)/layout.tsx`:**
  ```tsx
  // Items: Home, Administradores
  // Bottom Nav: Home, Administradores (solo 2 ítems)
  ```

### 8. Implementar Toggle de Tema (Oscuro/Claro)

- [ ] Crear `src/stores/theme-store.ts` con Zustand:
  ```typescript
  // Estado: theme ('light' | 'dark' | 'system')
  // Acción: setTheme(theme)
  // Persistencia: localStorage
  ```
- [ ] Crear `src/components/providers/ThemeProvider.tsx` que aplique la clase `dark` al `<html>`.
- [ ] Incluir toggle en TopBar dropdown.

### 9. Crear Componentes Shared Adicionales

- [ ] `src/components/shared/EmptyState.tsx`:
  - Icono grande, título, descripción, botón de acción opcional.
- [ ] `src/components/shared/PageHeader.tsx`:
  - Título de página, subtítulo opcional, acciones.
- [ ] `src/components/shared/LoadingPage.tsx`:
  - Skeletons que imitan la estructura del layout (sidebar + contenido).

---

## Stack y Skills Necesarias

| Herramienta | Comando / Recurso |
|-------------|-------------------|
| shadcn/ui | `npx shadcn@latest add button card dialog sheet dropdown-menu tooltip skeleton scroll-area separator tabs sonner sidebar` |
| Lucide React | Ya instalado |
| Zustand | Ya instalado |
| `next/font` | Para cargar Inter (Google Fonts) |

**Skills de referencia:**
- `ui-ux-pro-max` — Reglas de navegación:
  - `bottom-nav-limit`: máximo 5 ítems con label + icono.
  - `adaptive-navigation`: sidebar en `≥1024px`, bottom nav en pantallas pequeñas.
  - `nav-state-active`: indicador visual claro de sección activa.
  - `safe-area-awareness`: respetar notch y gesture bar en móvil.
  - `touch-target-size`: mínimo 44×44pt para ítems de navegación.
- `shadcn-ui` — Usar bloques de sidebar y sheet para crear la navegación.

---

## Comportamiento PWA Detallado

### Desktop (≥ 1024px / breakpoint `lg`)
```
┌──────────┬────────────────────────────────────────┐
│          │  TopBar (sticky, z-40)                  │
│ Sidebar  │─────────────────────────────────────────│
│ (fixed   │                                         │
│  w-64    │  Contenido principal                    │
│  z-50)   │  (padding-left: sidebar width)          │
│          │                                         │
│  Logo    │                                         │
│  Nav     │                                         │
│  Items   │                                         │
│          │                                         │
│  User    │                                         │
│  Info    │                                         │
└──────────┴─────────────────────────────────────────┘
```

### Móvil (< 1024px)
```
┌────────────────────────────────────────────────────┐
│  TopBar (sticky, z-40)                             │
│────────────────────────────────────────────────────│
│                                                     │
│  Contenido principal                               │
│  (padding-bottom: bottom nav height)               │
│                                                     │
│                                                     │
│                                                     │
│                                                     │
│────────────────────────────────────────────────────│
│  Bottom Nav (fixed bottom-0, z-50, h-16)           │
│  [Home] [Mat] [Cal] [Anun] [Perfil]               │
└────────────────────────────────────────────────────┘
```

### CSS Clave
```css
/* Main content wrapper */
.main-content {
  @apply lg:ml-sidebar;                    /* Espacio para sidebar en desktop */
  @apply mt-topbar;                        /* Espacio para topbar */
  @apply pb-bottomnav lg:pb-0;            /* Espacio para bottom nav solo en móvil */
  @apply min-h-[calc(100dvh-var(--topbar-height))]; /* Altura mínima dinámica */
}
```

---

## Modelado de Datos

No se crean colecciones nuevas en esta fase. Se consume:
- `/usuarios/{uid}` — para nombre, avatar y rol en la navegación.

---

## GitOps — Instrucciones de Cierre

### Commits de esta fase
```
feat(ui): establece sistema de diseño con tokens CSS en Tailwind
feat(shadcn): instala componentes base (button, card, dialog, sheet, sidebar)
feat(navegacion): implementa Sidebar fija para desktop >= lg
feat(navegacion): implementa Bottom Navigation Bar para móvil < lg
feat(navegacion): crea TopBar con notificaciones y menú de usuario
feat(layout): configura layouts específicos por rol con items de nav
feat(tema): implementa toggle modo oscuro/claro con Zustand
feat(ui): crea componentes shared (EmptyState, PageHeader, LoadingPage)
docs(changelog): registra entregables de la Fase 03
```

### Actualización del CHANGELOG.md
```markdown
## [Fase 03] — 2026-XX-XX — UI Base PWA

### Agregado
- Sistema de diseño con tokens CSS (colores Raptor, tipografía, espaciado, sombras).
- Componentes shadcn/ui instalados: button, card, dialog, sheet, sidebar, skeleton, tabs, sonner.
- Sidebar fija para desktop (≥1024px) con logo, nav items e info de usuario.
- Bottom Navigation Bar para móvil (<1024px) con máximo 5 ítems + menú "Más".
- TopBar sticky con título dinámico, notificaciones y menú de usuario.
- Layouts específicos por rol (estudiante, tutor, admin, superadmin).
- Toggle de modo oscuro/claro con persistencia en localStorage (Zustand).
- Componentes shared: EmptyState, PageHeader, LoadingPage.
```

### Comando PR (MCP)
```
mcp_github-mcp-server_create_pull_request
  title: "Fase 03 — UI Base PWA con navegación adaptativa"
  head: "feature/fase-03-ui-base"
  base: "main"
```

### Merge (MCP)
```
mcp_github-mcp-server_merge_pull_request
  merge_method: "squash"
  commit_title: "feat(ui): fase 03 completa — sistema de diseño y navegación adaptativa"
```
