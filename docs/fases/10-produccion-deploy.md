# Fase 10 — Producción y Deploy Final

| Campo | Valor |
|-------|-------|
| **Épica** | Operación y Lanzamiento |
| **Rama** | `feature/fase-10-produccion` |
| **Dependencia** | Todas las fases anteriores (00–09) completadas |
| **Duración estimada** | 2 sprints (8-12 horas) |

---

## Objetivo del Sprint

Implementar las herramientas de configuración del admin, el panel completo de super admin, la sección de apps externas y perfil del estudiante, realizar optimizaciones de producción (performance, SEO, seguridad) y desplegar la plataforma con dominio propio.

---

## Checklist de Tareas (Orden de Ejecución)

### 1. Crear Rama de Trabajo
- [ ] `mcp_github-mcp-server_create_branch`: `feature/fase-10-produccion` desde `main`

### 2. Configuración de Plataforma — Admin

- [ ] `src/app/(admin)/configuracion/page.tsx`:

  **Secciones (Tabs o Accordion):**

  | Sección | Funcionalidad |
  |---------|---------------|
  | **Banners Modales** | Upload de imagen a Cloudinary + toggle activar/desactivar |
  | **Modo Mantenimiento** | Switch on/off + textarea para mensaje personalizado |
  | **Fecha del ICFES** | Input de fecha → actualiza `/config/general.fecha_icfes` |
  | **Frase Motivacional** | Textarea → actualiza `/config/general.frase_motivacional` |
  | **Apps Externas** | CRUD: nombre, descripción, URL, icono (Cloudinary), orden (drag & drop) |
  | **Gestión de Cohortes** | Botón "Iniciar Nueva Cohorte" con confirmación doble |
  | **Registro de Actualizaciones** | Lista de cambios publicados por super admin (read-only) |

- [ ] **Gestión de Cohortes — operación destructiva:**
  ```typescript
  // Flujo:
  // 1. Admin hace click en "Iniciar Nueva Cohorte".
  // 2. Dialog 1: "¿Estás seguro? Esto eliminará TODA la información académica."
  //    - Checkbox: "Conservar perfiles de estudiantes" (default: true)
  //    - Input de confirmación: escribir "NUEVA COHORTE" para desbloquear.
  // 3. Dialog 2: "Confirmación FINAL. Esta operación es irreversible."
  //    - Botón destructivo (rojo).
  // 4. API Route server-side que ejecuta batch deletes:
  //    - Elimina: /clases, /simulacros, /resultados_simulacro, /anuncios, /eventos
  //    - Si "no conservar": elimina /usuarios donde rol == 'estudiante'
  //    - Crea nueva cohorte en /cohortes
  //    - Actualiza /config/general con nueva fecha
  ```

### 3. Panel del Super Admin

- [ ] `src/app/(superadmin)/administradores/page.tsx`:
  - DataTable de cuentas admin: nombre, correo, fecha creación, estado.
  - Acciones: crear admin (asignar rol por correo), modificar, revocar acceso.
  - El super admin puede asignar el rol `admin` a cualquier correo registrado vía Google.

- [ ] Funciones exclusivas del super admin:
  - Control total de modo mantenimiento (override del admin).
  - Publicar registros de actualizaciones visibles para admin:
    - Formulario: título, descripción, fecha.
    - Se muestran en el panel de configuración del admin.
  - Acceso de emergencia: botón para acceder como cualquier rol (impersonar).

### 4. Apps Externas — Estudiante

- [ ] `src/app/(estudiante)/apps/page.tsx`:
  - Grid de tarjetas (responsive: 3 col desktop, 2 col tablet, 1 col móvil).
  - Cada tarjeta: icono (CloudinaryImage), nombre, descripción, botón "Abrir" (link externo `target="_blank"`).
  - Orden definido por el admin en configuración.
  - Query: leer `apps_externas` de `/config/general`, ordenar por `orden`.

### 5. Perfil y Configuración del Estudiante

- [ ] `src/app/(estudiante)/perfil/page.tsx`:

  **Secciones:**
  | Sección | Controles |
  |---------|-----------|
  | **Foto de perfil** | Avatar editable, upload a Cloudinary, previsualización |
  | **Información personal** | Nombre, correo (read-only), grado |
  | **Notificaciones** | Checkboxes de preferencias (de Fase 09) |
  | **Google Calendar** | Toggle para sincronización (de Fase 08) |
  | **Apariencia** | Toggle modo oscuro/claro |
  | **Historial de simulacros** | Tabla: simulacro, materia, puntaje, fecha |

- [ ] **Onboarding guiado (primera vez):**
  - Detectar si usuario es nuevo (campo `onboarding_completado: false`).
  - Tour interactivo por las secciones principales:
    1. "Este es tu dashboard" → spotlight en widgets.
    2. "Aquí están tus materias" → navegar a materias.
    3. "Tu calendario" → mostrar calendario.
    4. "Configura tu perfil" → abrir perfil.
  - Al completar: `onboarding_completado: true`.
  - Implementar con tooltips posicionados o modal step-by-step.

### 6. Optimizaciones de Performance

- [ ] **Bundle size:**
  - Revisar con `npx @next/bundle-analyzer`.
  - Dynamic imports (`next/dynamic`) para:
    - Componente calendario.
    - DriveFileViewer / VideoPlayer.
    - Editor de simulacros.
    - Gráficos Recharts.
    - DataTables con muchas filas.
  - Verificar que no hay barrel imports (`import { x } from './components'`).

- [ ] **Data fetching:**
  - Verificar que queries paralelos usan `Promise.all()`.
  - No hay waterfalls (N+1 queries).
  - Usar React Server Components donde sea posible (páginas que solo leen datos).

- [ ] **UI:**
  - Skeletons implementados en cada página con carga async.
  - `next/image` con loader Cloudinary en todas las imágenes.
  - Virtualización con `@tanstack/react-virtual` para listas > 50 ítems (estudiantes, resultados).
  - `content-visibility: auto` para secciones below-the-fold.

### 7. SEO y Meta Tags

- [ ] Configurar `metadata` en cada `layout.tsx` y `page.tsx`:
  ```typescript
  export const metadata: Metadata = {
    title: 'Campus Raptor PREICFES',
    description: 'Plataforma educativa para la preparación del ICFES — Método Raptor',
    manifest: '/manifest.json',
    themeColor: '#DEFINIR',
    openGraph: {
      title: 'Campus Raptor PREICFES',
      description: '...',
      images: '/og-image.png',
    },
  };
  ```
- [ ] Generar imagen Open Graph (`og-image.png`) con branding Raptor.

### 8. Auditoría de Seguridad

- [ ] **Firestore:**
  - Revisar TODAS las reglas de seguridad.
  - Verificar que `clave_respuestas` es inaccesible desde el client.
  - Verificar que tokens de acceso único expiran correctamente.
  - Test: intentar leer `/simulacros/{id}` con clave desde el cliente → debe fallar.

- [ ] **Headers de seguridad en `next.config.ts`:**
  ```typescript
  headers: [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
      ],
    },
  ],
  ```

- [ ] **Cookies:**
  - Cookie de sesión: `HttpOnly`, `Secure`, `SameSite=Lax`.
  - No hay tokens sensibles en localStorage.

### 9. Testing de Flujos Críticos

- [ ] **Flujos a verificar manualmente:**
  | Flujo | Pasos | Resultado esperado |
  |-------|-------|-------------------|
  | Login Google | Click → popup → redirect dashboard | Dashboard correcto para el rol |
  | Registro Bridge | Link → Google → formulario → dashboard | Link marcado como usado |
  | Presentar simulacro | Abrir → responder → enviar | Puntaje calculado server-side |
  | Crear anuncio admin | Formulario → publicar | Visible para estudiantes, TTL activo |
  | Notificación push | Tutor sube clase → push | Estudiante recibe notificación |
  | Modo mantenimiento | Admin activa → estudiante visita | Redirige a /mantenimiento |

- [ ] **Test responsive:**
  - 375px (iPhone SE)
  - 390px (iPhone 14)
  - 768px (iPad)
  - 1024px (iPad landscape / desktop chico)
  - 1440px (desktop estándar)
  - Bottom Nav visible < 1024px, Sidebar visible ≥ 1024px.

- [ ] **Test accesibilidad:**
  - Contraste 4.5:1 mínimo (verificar en modo claro y oscuro).
  - Keyboard nav funcional (Tab, Enter, Escape).
  - Focus rings visibles.
  - Screen reader: ARIA labels en botones de icono.

### 10. Deploy a Producción

- [ ] Configurar dominio custom en Vercel:
  - DNS: apuntar dominio al servidor de Vercel.
  - Verificar SSL automático.
- [ ] Variables de entorno en Vercel configuradas (`Production` environment).
- [ ] Deploy final: `git push` → Vercel build automático.
- [ ] **Smoke test en producción:**
  - [ ] Login funcional con Google.
  - [ ] Dashboard de cada rol carga correctamente.
  - [ ] Simulacro se puede presentar y calificar.
  - [ ] Notificaciones push llegan.
  - [ ] Modo mantenimiento funciona.
  - [ ] PWA se puede instalar.

---

## Stack y Skills Necesarias

| Herramienta | Comando / Recurso |
|-------------|-------------------|
| @next/bundle-analyzer | `npm install @next/bundle-analyzer` |
| @tanstack/react-virtual | `npm install @tanstack/react-virtual` |
| Vercel CLI | `npx vercel --prod` (o push a main) |
| Vercel Analytics | Habilitar en dashboard de Vercel |

---

## Modelado de Datos

### Campos adicionales relevantes
```typescript
// /usuarios/{uid} — campo nuevo
{
  onboarding_completado: boolean;   // default false, se marca true al completar tour
}

// /config/actualizaciones/{update_id} — nueva colección
{
  titulo: string;
  descripcion: string;
  fecha: Timestamp;
  autor_id: string;     // UID del super admin
}
```

---

## GitOps — Instrucciones de Cierre

### Commits de esta fase
```
feat(config): implementa panel de configuración del admin
feat(config): crea gestión de cohortes con confirmación doble
feat(superadmin): construye panel de gestión de administradores
feat(superadmin): implementa registro de actualizaciones
feat(apps): crea sección de apps externas para estudiantes
feat(perfil): construye perfil y configuración del estudiante
feat(perfil): implementa onboarding guiado para nuevos usuarios
refactor(performance): optimiza bundle con dynamic imports
refactor(performance): implementa virtualización de listas largas
feat(seo): configura metadata y Open Graph en todas las páginas
chore(seguridad): endurece headers y audita reglas de Firestore
ci(vercel): configura dominio custom y variables de producción
docs(changelog): registra entregables de la Fase 10 — release v1.0.0
```

### Actualización del CHANGELOG.md
```markdown
## [1.0.0] — 2026-XX-XX — Release Inicial

### Agregado
- Panel de configuración del admin: banners, mantenimiento, ICFES, frase, apps, cohortes.
- Panel del super admin: gestión de admins, actualizaciones, acceso de emergencia.
- Sección de apps externas para estudiantes.
- Perfil del estudiante con foto, preferencias y onboarding guiado.
- Optimización de bundle con dynamic imports y virtualización.
- SEO y meta tags en todas las páginas.

### Seguridad
- Auditoría completa de reglas de Firestore.
- Headers de seguridad configurados (X-Frame-Options, CSP, etc.).
- Cookie de sesión HttpOnly verificada.
- Verificación de inaccesibilidad de clave_respuestas desde cliente.

### Deploy
- Dominio custom configurado en Vercel.
- Primera versión estable desplegada en producción.
```

### Comando PR (MCP)
```
mcp_github-mcp-server_create_pull_request
  title: "Fase 10 — Release v1.0.0 · Campus Online Método Raptor PREICFES"
  body: "Release inicial con todas las funcionalidades core implementadas."
  head: "feature/fase-10-produccion"
  base: "main"
```

### Merge (MCP)
```
mcp_github-mcp-server_merge_pull_request
  merge_method: "squash"
  commit_title: "feat(release): v1.0.0 — Campus Online Método Raptor PREICFES"
```

### Tag de Release
Tras el merge, crear tag `v1.0.0` en GitHub para marcar el release oficial.
