# Fase 08 — Calendario y Sistema de Anuncios

| Campo | Valor |
|-------|-------|
| **Épica** | Comunicación y Organización |
| **Rama** | `feature/fase-08-calendario` |
| **Dependencia** | Fase 06 completada (paralelizable con Fase 07) |
| **Duración estimada** | 1.5 sprints (6-8 horas) |

---

## Objetivo del Sprint

Implementar el calendario interactivo con código de colores por materia, vistas mensual/semanal, creación de eventos por rol, y el sistema completo de anuncios con TTL (expiración automática).

---

## Checklist de Tareas (Orden de Ejecución)

### 1. Crear Rama de Trabajo
- [ ] `mcp_github-mcp-server_create_branch`: `feature/fase-08-calendario` desde `main`

### 2. Instalar Dependencias
```bash
npx shadcn@latest add calendar       # Componente Calendar de shadcn (basado en react-day-picker)
npx shadcn@latest add toggle
```
```bash
npm install date-fns                  # Ya instalado desde Fase 04
```

### 3. Componente de Calendario

- [ ] `src/components/shared/Calendar.tsx`:
  - **Vistas:** toggle entre mensual y semanal (botones `Toggle` de shadcn).
  - **Vista mensual:** grid de días con dots de color por eventos.
  - **Vista semanal:** timeline vertical con bloques de eventos por hora.
  - **Código de colores:**
    - Cada materia usa su `color_calendario` de Firestore.
    - Eventos generales de Raptor usan un color diferenciado (ej: dorado/amber).
  - **Leyenda:** siempre visible debajo del calendario, muestra colores con nombre de materia.
  - **Interacción:** click en evento → Sheet/Dialog con detalles.
  - **Responsive:**
    - Desktop: calendario amplio con eventos visibles inline.
    - Móvil: calendario compacto con dots, lista de eventos del día seleccionado debajo.
  - **Props:**
    ```typescript
    interface CalendarProps {
      eventos: Evento[];
      onEventClick: (evento: Evento) => void;
      canCreate?: boolean;          // true para tutor y admin
      onDateClick?: (date: Date) => void;  // Para crear evento
    }
    ```

### 4. Vista del Calendario — Estudiante

- [ ] `src/app/(estudiante)/calendario/page.tsx`:
  - Calendario read-only con todos los eventos (generales + por materia).
  - Click en evento → Sheet con detalles: título, descripción, fecha, hora, materia, creador.
  - Filtro opcional por materia (pills de color).
  - Próximos eventos como lista debajo del calendario.

### 5. Vista del Calendario — Tutor

- [ ] `src/app/(tutor)/calendario/page.tsx`:
  - Calendario con opción de crear eventos de su materia.
  - Click en fecha → formulario de creación:
    - Título (Input).
    - Descripción (TextArea).
    - Fecha y hora inicio/fin (datetime-local).
    - Tipo: automático = materia del tutor, color del calendario heredado.
    - Tiempo de recordatorio antes del evento (Select: 15min, 1h, 1 día).
  - CRUD de sus eventos: editar, eliminar.

### 6. Gestión de Eventos — Admin

- [ ] `src/app/(admin)/eventos/page.tsx`:
  - Calendario completo con todos los eventos.
  - Crear eventos **generales** (tipo: `general`, color: Raptor).
  - Ver y gestionar todos los eventos (propios y de tutores).
  - Formulario de creación similar al del tutor pero con campo de tipo:
    - `general` — visible para toda la plataforma.
    - `materia` — admin puede crear eventos para cualquier materia.

### 7. Sincronización con Google Calendar (Opcional)

- [ ] En perfil del estudiante: botón "Conectar Google Calendar".
- [ ] Flujo OAuth 2.0 para Google Calendar API:
  - Solicitar permisos de escritura en el calendario del usuario.
  - Al activar: exportar eventos de Raptor al calendar personal.
  - Toggle para activar/desactivar.
- [ ] **Nota:** Esta funcionalidad es opcional y puede posponerse a un sprint posterior.

### 8. Sistema de Anuncios con TTL

- [ ] **Creación de anuncios — Admin:**
  - `src/app/(admin)/anuncios/page.tsx`:
    - Tabla de anuncios activos (propios y de tutores).
    - Formulario de nuevo anuncio:
      - Contenido (TextArea o editor simple).
      - Imagen adjunta opcional (upload a Cloudinary).
      - TTL configurable: 12h, 24h, 48h, 72h, 1 semana, permanente (Select).
      - Al publicar: `fecha_expiracion = now + TTL`.
    - Acciones: editar, eliminar, extender TTL.
    - Anuncios del admin firman como **"Raptor"**.

- [ ] **Creación de anuncios — Tutor:**
  - `src/app/(tutor)/anuncios/page.tsx`:
    - CRUD de anuncios de su materia.
    - Mismos campos que admin pero con `materia_id` fijo.
    - Firman con el **nombre del tutor**.

### 9. Muro de Anuncios — Estudiante

- [ ] `src/app/(estudiante)/anuncios/page.tsx`:
  - Lista de todos los anuncios activos (no expirados).
  - Query Firestore: `where('fecha_expiracion', '>', serverTimestamp())`, `orderBy('fecha_publicacion', 'desc')`.
  - Diferenciación visual:
    - Anuncios de Raptor: badge dorado/amber, icono de megáfono.
    - Anuncios de tutor: badge con color de la materia, nombre del tutor.
  - Leyenda de colores para identificar origen.
  - Card de anuncio: autor, fecha, contenido, imagen (si tiene).

### 10. Expiración Automática de Anuncios (TTL)

- [ ] **Opción A: Vercel Cron Job** (recomendada):
  - Crear `src/app/api/cron/limpiar-anuncios/route.ts`:
    - Query: documentos con `fecha_expiracion < now()`.
    - Batch delete con Admin SDK.
    - Ejecutar cada hora.
  - Configurar en `vercel.json`:
    ```json
    {
      "crons": [{
        "path": "/api/cron/limpiar-anuncios",
        "schedule": "0 * * * *"
      }]
    }
    ```

- [ ] **Opción B: Filtro en tiempo real** (complementaria):
  - Las queries del cliente ya filtran por `fecha_expiracion > now()`.
  - Los anuncios expirados no se muestran aunque sigan en Firestore.
  - El cron limpia storage periódicamente.

---

## Stack y Skills Necesarias

| Herramienta | Comando / Recurso |
|-------------|-------------------|
| shadcn/ui | `calendar, toggle` |
| date-fns | Para formateo y cálculo de fechas |
| Vercel Cron | Configurar en `vercel.json` |
| Google Calendar API | OAuth 2.0 (opcional) |

---

## Modelado de Datos

### Colección `/eventos/{evento_id}`
```typescript
{
  titulo: string;
  descripcion: string;
  fecha_inicio: Timestamp;
  fecha_fin: Timestamp;
  tipo: 'general' | 'materia';
  materia_id: string | null;        // null si es general
  creador_id: string;               // UID del admin o tutor
  color: string;                    // Heredado de materia o color Raptor
  recordatorio_minutos_antes: number; // 15, 60, 1440 (1 día)
}
```

### Colección `/anuncios/{anuncio_id}`
```typescript
{
  autor_id: string;
  autor_nombre: string;            // "Raptor" si es admin, nombre real si es tutor
  tipo: 'raptor' | 'tutor';
  materia_id: string | null;       // null si es general
  contenido: string;
  imagen_url?: string;             // URL Cloudinary (opcional)
  fecha_publicacion: Timestamp;
  fecha_expiracion: Timestamp;     // TTL: publicación + duración configurada
}
```

### Reglas de Seguridad
```
match /eventos/{eventoId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null
    && get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol in ['tutor', 'admin', 'superadmin'];
  allow update, delete: if request.auth != null
    && (resource.data.creador_id == request.auth.uid
        || get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol in ['admin', 'superadmin']);
}

match /anuncios/{anuncioId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null
    && get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol in ['tutor', 'admin'];
  allow update, delete: if request.auth != null
    && (resource.data.autor_id == request.auth.uid
        || get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol in ['admin', 'superadmin']);
}
```

---

## GitOps — Instrucciones de Cierre

### Commits de esta fase
```
feat(calendario): crea componente de calendario con vistas mensual y semanal
feat(calendario): implementa código de color por materia con leyenda
feat(calendario): construye creación de eventos para tutor y admin
feat(anuncios): implementa CRUD de anuncios con TTL configurable
feat(anuncios): crea muro de anuncios del estudiante con diferenciación visual
chore(cron): configura Vercel Cron para limpieza automática de anuncios expirados
chore(firestore): agrega reglas de seguridad para eventos y anuncios
docs(changelog): registra entregables de la Fase 08
```

### Actualización del CHANGELOG.md
```markdown
## [Fase 08] — 2026-XX-XX — Calendario y Anuncios

### Agregado
- Calendario interactivo con vistas mensual y semanal.
- Código de color por materia con leyenda siempre visible.
- Creación de eventos por tutor (materia) y admin (generales).
- CRUD completo de anuncios con TTL configurable (12h a permanente).
- Muro de anuncios del estudiante con diferenciación visual por origen.
- Vercel Cron Job para limpieza automática de anuncios expirados cada hora.
- Reglas de seguridad para eventos y anuncios.
```

### Comando PR (MCP)
```
mcp_github-mcp-server_create_pull_request
  title: "Fase 08 — Calendario interactivo y anuncios con TTL"
  head: "feature/fase-08-calendario"
  base: "main"
```

### Merge (MCP)
```
mcp_github-mcp-server_merge_pull_request
  merge_method: "squash"
  commit_title: "feat(calendario): fase 08 completa — calendario y anuncios con TTL"
```
