# Fase 09 — Notificaciones Push (FCM) y en Tiempo Real

| Campo | Valor |
|-------|-------|
| **Épica** | Comunicación en Tiempo Real |
| **Rama** | `feature/fase-09-notificaciones` |
| **Dependencia** | Fases 07 y 08 completadas |
| **Duración estimada** | 1.5 sprints (5-7 horas) |

---

## Objetivo del Sprint

Configurar Firebase Cloud Messaging para notificaciones push, implementar triggers automáticos por eventos de la plataforma, crear el centro de notificaciones in-app, y agregar preferencias de notificaciones al perfil del estudiante.

---

## Checklist de Tareas (Orden de Ejecución)

### 1. Crear Rama de Trabajo
- [ ] `mcp_github-mcp-server_create_branch`: `feature/fase-09-notificaciones` desde `main`

### 2. Configurar FCM en Firebase Console
- [ ] Ir a Firebase Console → Cloud Messaging → Generar clave VAPID (Web Push Certificate).
- [ ] Agregar a `.env.local`:
  ```env
  NEXT_PUBLIC_FIREBASE_VAPID_KEY=
  ```

### 3. Implementar Servicios FCM (Client-Side)

- [ ] `src/lib/firebase/messaging.ts`:
  ```typescript
  // requestNotificationPermission():
  //   1. Solicitar permiso del navegador (Notification.requestPermission).
  //   2. Si concedido → obtener token FCM.
  //   3. Guardar token en /usuarios/{uid}.fcm_token en Firestore.
  //   4. Retornar token.

  // getDeviceToken():
  //   Obtener token actual del dispositivo/navegador.

  // onForegroundMessage(callback):
  //   Listener para mensajes recibidos mientras la app está en foreground.
  //   Muestra toast (Sonner de shadcn) con título y cuerpo del mensaje.

  // revokeToken():
  //   Eliminar token del dispositivo.
  //   Actualizar /usuarios/{uid}.fcm_token = null.
  ```

### 4. Service Worker para Notificaciones Background

- [ ] Crear `public/firebase-messaging-sw.js`:
  ```javascript
  // Importar scripts de Firebase
  // Configurar Firebase App en el SW
  // Listener: messaging.onBackgroundMessage((payload) => {
  //   self.registration.showNotification(payload.notification.title, {
  //     body: payload.notification.body,
  //     icon: '/icons/icon-192.png',
  //     badge: '/icons/badge-72.png',
  //     data: payload.data  // URL de redirección
  //   });
  // });
  // Click en notificación → abrir URL de la app
  ```

### 5. API Route de Envío de Notificaciones (Server-Side)

- [ ] `src/app/api/notifications/send/route.ts`:
  ```typescript
  // POST body: {
  //   tipo: 'clase' | 'material' | 'anuncio-raptor' | 'anuncio-tutor' |
  //         'simulacro' | 'evento' | 'manual',
  //   destinatarios: 'todos' | string[],  // 'todos' o array de UIDs
  //   materia_id?: string,
  //   titulo: string,
  //   cuerpo: string,
  //   url?: string,   // URL de redirección al hacer click
  //   data?: object    // Datos adicionales
  // }
  //
  // Proceso:
  // 1. Verificar autenticación (admin o tutor).
  // 2. Si destinatarios == 'todos' → query todos los UIDs con fcm_token.
  //    Si destinatarios es array → query esos UIDs.
  // 3. Filtrar por preferencias de notificaciones del usuario.
  // 4. Enviar via Admin SDK: admin.messaging().sendEachForMulticast()
  // 5. Guardar en /notificaciones/{id} para historial in-app.
  // 6. Retornar conteo de enviados/fallidos.
  ```

- [ ] `src/lib/notifications/templates.ts`:
  ```typescript
  // Templates de notificación en español:
  const TEMPLATES = {
    clase: (tutor: string, materia: string) =>
      ({ titulo: '🦅 Nueva clase disponible',
         cuerpo: `${tutor} subió una nueva clase de ${materia}` }),

    material: (materia: string) =>
      ({ titulo: '📚 Nuevo material',
         cuerpo: `Hay nuevo material en ${materia}, revísalo` }),

    'anuncio-raptor': () =>
      ({ titulo: '📢 Comunicado de Raptor',
         cuerpo: 'Raptor tiene un comunicado importante para ti' }),

    'anuncio-tutor': (tutor: string, materia: string) =>
      ({ titulo: `📢 Anuncio de ${tutor}`,
         cuerpo: `${tutor} publicó un anuncio en ${materia}` }),

    simulacro: (materia: string) =>
      ({ titulo: '📝 Simulacro disponible',
         cuerpo: `Ya puedes presentar el simulacro de ${materia}` }),

    evento: (nombre: string, minutos: number) =>
      ({ titulo: '🦅 Evento próximo',
         cuerpo: `En ${minutos} minutos tienes ${nombre}` }),

    manual: (titulo: string, cuerpo: string) =>
      ({ titulo, cuerpo }),
  };
  ```

### 6. Triggers Automáticos

Integrar el envío de notificaciones en las acciones existentes:

| Trigger | Dónde se integra | Destinatarios |
|---------|-------------------|---------------|
| Tutor sube clase nueva | POST de `/api/clases` (Fase 06) | Estudiantes de esa materia |
| Tutor sube material | POST de materiales (Fase 06) | Estudiantes de esa materia |
| Admin publica anuncio | POST de `/api/anuncios` (Fase 08) | Todos los estudiantes |
| Tutor publica anuncio | POST de `/api/anuncios` (Fase 08) | Estudiantes de esa materia |
| Simulacro disponible | POST de `/api/simulacros` (Fase 07) | Estudiantes de esa materia |
| Evento próximo | Vercel Cron cada 15min | Según tipo de evento |
| Admin envía manual | Nuevo formulario en admin dashboard | Todos los estudiantes |

- [ ] Crear Cron Job para recordatorios de eventos:
  - `src/app/api/cron/recordatorio-eventos/route.ts`:
    - Query eventos donde `fecha_inicio - recordatorio_minutos_antes ≈ now (±15min)`.
    - Enviar notificación a los destinatarios correspondientes.
  - Configurar en `vercel.json`:
    ```json
    { "path": "/api/cron/recordatorio-eventos", "schedule": "*/15 * * * *" }
    ```

### 7. Centro de Notificaciones In-App

- [ ] `src/components/shared/NotificationCenter.tsx`:
  - Icono de campana (`Bell` de Lucide) en el TopBar con badge de conteo.
  - Click → `Sheet` de shadcn con lista de notificaciones recientes.
  - Cada notificación: icono de tipo, título, cuerpo, fecha relativa ("hace 5 min").
  - Marcar como leída (individual o "Marcar todas como leídas").
  - Click en notificación → navegar a URL correspondiente.

- [ ] Listener en tiempo real:
  ```typescript
  // onSnapshot en /notificaciones donde destinatario_id == uid
  // Ordenar por fecha, límite 50
  // Actualizar badge de conteo
  ```

### 8. Formulario de Notificación Manual — Admin

- [ ] Agregar en `(admin)/dashboard` o sección dedicada:
  - Formulario: título, cuerpo del mensaje, botón "Enviar a todos".
  - Confirmación via AlertDialog antes de enviar.

### 9. Preferencias de Notificaciones — Estudiante

- [ ] En `(estudiante)/perfil` → sección "Notificaciones":
  - Checkboxes por tipo:
    - [ ] Nuevas clases
    - [ ] Nuevo material
    - [ ] Anuncios de Raptor
    - [ ] Anuncios de tutores
    - [ ] Simulacros disponibles
    - [ ] Recordatorios de eventos
  - Guardar en `/usuarios/{uid}.preferencias_notificaciones`.
  - La API de envío filtra por estas preferencias antes de enviar.

---

## Stack y Skills Necesarias

| Herramienta | Comando / Recurso |
|-------------|-------------------|
| Firebase Cloud Messaging | Configurar en Console |
| shadcn/ui | `sheet` (ya instalado) |
| Vercel Cron | Configurar en `vercel.json` |

---

## Modelado de Datos

### Campo adicional en `/usuarios/{uid}`
```typescript
{
  // ... campos existentes ...
  fcm_token: string | null;
  preferencias_notificaciones: {
    clases: boolean;         // default true
    materiales: boolean;     // default true
    anuncios_raptor: boolean; // default true
    anuncios_tutores: boolean; // default true
    simulacros: boolean;     // default true
    eventos: boolean;        // default true
  };
}
```

### Colección `/notificaciones/{notif_id}`
```typescript
{
  destinatario_id: string;       // UID del usuario
  tipo: 'clase' | 'material' | 'anuncio-raptor' | 'anuncio-tutor' |
        'simulacro' | 'evento' | 'manual';
  titulo: string;
  cuerpo: string;
  url?: string;                  // URL de redirección
  leida: boolean;                // default false
  fecha: Timestamp;
  materia_id?: string;
}
```

### Reglas de Seguridad
```
match /notificaciones/{notifId} {
  allow read: if request.auth != null
    && resource.data.destinatario_id == request.auth.uid;
  allow update: if request.auth != null
    && resource.data.destinatario_id == request.auth.uid
    && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['leida']);
  allow create: if false;  // Solo Admin SDK (server-side)
  allow delete: if false;
}
```

---

## GitOps — Instrucciones de Cierre

### Commits de esta fase
```
feat(fcm): configura Firebase Cloud Messaging con clave VAPID
feat(fcm): crea service worker para notificaciones background
feat(notificaciones): implementa API route de envío server-side
feat(notificaciones): crea templates de notificación en español
feat(notificaciones): integra triggers automáticos en acciones existentes
feat(notificaciones): crea centro de notificaciones in-app
feat(notificaciones): implementa formulario de envío manual para admin
feat(perfil): agrega preferencias de notificaciones del estudiante
chore(cron): configura recordatorio automático de eventos cada 15min
chore(firestore): agrega reglas de seguridad para notificaciones
docs(changelog): registra entregables de la Fase 09
```

### Actualización del CHANGELOG.md
```markdown
## [Fase 09] — 2026-XX-XX — Notificaciones Push (FCM)

### Agregado
- Firebase Cloud Messaging configurado con clave VAPID.
- Service worker para notificaciones en background.
- API Route de envío de notificaciones server-side (Admin SDK).
- Templates de notificación en español para cada tipo de evento.
- Triggers automáticos: clase nueva, material, anuncio, simulacro, evento.
- Centro de notificaciones in-app con badge, lista y marcar como leída.
- Formulario de notificación manual para admin.
- Preferencias de notificaciones en perfil del estudiante.
- Cron Job de recordatorio de eventos cada 15 minutos.
```

### Comando PR (MCP)
```
mcp_github-mcp-server_create_pull_request
  title: "Fase 09 — Notificaciones push FCM y centro de notificaciones in-app"
  head: "feature/fase-09-notificaciones"
  base: "main"
```

### Merge (MCP)
```
mcp_github-mcp-server_merge_pull_request
  merge_method: "squash"
  commit_title: "feat(notificaciones): fase 09 completa — FCM push y notificaciones in-app"
```
