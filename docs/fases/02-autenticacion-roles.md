# Fase 02 — Autenticación y Sistema de Roles

| Campo | Valor |
|-------|-------|
| **Épica** | Acceso y Seguridad |
| **Rama** | `feature/fase-02-auth-roles` |
| **Dependencia** | Fase 01 completada |
| **Duración estimada** | 1 sprint (4-6 horas) |

---

## Objetivo del Sprint

Implementar el flujo completo de autenticación con Google Sign In, crear el modelo de usuario en Firestore, construir el middleware de protección de rutas por rol, y desarrollar el flujo de registro con links de acceso único (Bridge).

---

## Checklist de Tareas (Orden de Ejecución)

### 1. Crear Rama de Trabajo
- [ ] `mcp_github-mcp-server_create_branch`: `feature/fase-02-auth-roles` desde `main`

### 2. Habilitar Google Sign In en Firebase
- [ ] En Firebase Console → Authentication → Sign-in method → Habilitar Google.
- [ ] Copiar el ID de cliente web OAuth.

### 3. Instalar Componentes shadcn/ui Necesarios
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add avatar
npx shadcn@latest add toast
npx shadcn@latest add separator
```

### 4. Implementar Funciones de Autenticación
- [ ] Crear `src/lib/firebase/auth.ts`:
  - `signInWithGoogle()` — abre popup de Google Sign In.
  - `signOutUser()` — cierra sesión.
  - `onAuthStateChanged(callback)` — listener de cambio de estado.
  - `getIdToken()` — obtener token para verificación server-side.

### 5. Crear AuthProvider (Contexto de Autenticación)
- [ ] Crear `src/components/providers/AuthProvider.tsx` (componente `'use client'`):
  - Estado: `user`, `loading`, `role`.
  - Al detectar usuario → buscar documento en `/usuarios/{uid}` → extraer rol.
  - Exponer funciones: login, logout, estado de carga.
- [ ] Crear hook `src/hooks/useAuth.ts` para consumir el contexto.
- [ ] Envolver el `layout.tsx` raíz con `<AuthProvider>`.

### 6. Crear API Route de Sesión
- [ ] `src/app/api/auth/session/route.ts`:
  - **POST**: recibe ID token de Firebase → verifica con Admin SDK → establece cookie `HttpOnly` segura.
  - **DELETE**: elimina cookie de sesión.
  - Cookie: `__session`, `HttpOnly`, `Secure`, `SameSite=Lax`, `Max-Age=5 días`.

### 7. Construir Middleware de Protección de Rutas
- [ ] `src/middleware.ts`:
  ```typescript
  // Flujo del middleware:
  // 1. Rutas públicas (/login, /registro, /bridge, /mantenimiento) → pasar.
  // 2. Sin cookie de sesión → redirigir a /login.
  // 3. Verificar token con Admin SDK.
  // 4. Extraer rol del usuario.
  // 5. Verificar modo mantenimiento → redirigir a /mantenimiento (excepto superadmin).
  // 6. Validar que el rol tenga acceso al Route Group solicitado:
  //    - /estudiante/* → solo rol 'estudiante'
  //    - /tutor/* → solo rol 'tutor'
  //    - /admin/* → solo rol 'admin'
  //    - /superadmin/* → solo rol 'superadmin'
  // 7. Si el rol no coincide → redirigir al dashboard correcto del usuario.
  ```
- [ ] Configurar `matcher` de Next.js para excluir archivos estáticos y API routes:
  ```typescript
  export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icons|manifest.json).*)'],
  };
  ```

### 8. Construir Página de Login
- [ ] `src/app/(auth)/login/page.tsx`:
  - Logo Raptor centrado.
  - Botón `GoogleSignInButton` usando componente `Button` de shadcn.
  - Diseño: `Card` de shadcn centrada verticalmente, fondo con gradiente Raptor.
  - Post-login: redirigir al dashboard del rol correspondiente.

### 9. Implementar Bridge (Registro con Link Único)
- [ ] `src/app/(auth)/bridge/page.tsx`:
  - Leer token de query params (`?token=xxx`).
  - Verificar token contra `/links_acceso/{link_id}`:
    - Si `usado === true` o `fecha_expiracion < now()` → mostrar error.
    - Si válido → mostrar paso 1: botón Google Sign In.
  - Post-login → paso 2: formulario de datos adicionales:
    - Nombre completo (`Input` shadcn).
    - Grado (select/dropdown).
    - Teléfono de contacto (opcional).
  - Al enviar formulario:
    - Crear documento en `/usuarios/{uid}` con `rol: 'estudiante'`.
    - Actualizar `/links_acceso/{token}` → `usado: true`.
    - Redirigir a `/(estudiante)/dashboard`.

### 10. Crear API Route para Generación de Links
- [ ] `src/app/api/auth/generar-link/route.ts`:
  - Solo accesible por rol `admin` (validar token de sesión).
  - Genera token UUID único.
  - Crea documento en `/links_acceso/{token}`:
    ```typescript
    {
      token: string,       // UUID generado
      usado: false,
      fecha_expiracion: Timestamp,  // Configurable, default 7 días
      cohorte_id: string,
      creado_por: string,  // UID del admin
    }
    ```
  - Retorna URL completa: `https://dominio.com/bridge?token={token}`.

### 11. Escribir Reglas de Seguridad de Firestore
- [ ] Crear `firestore.rules` (o configurar directamente en Firebase Console):
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {

      // Usuarios: lectura propia, escritura controlada
      match /usuarios/{userId} {
        allow read: if request.auth != null && request.auth.uid == userId;
        allow write: if request.auth != null && request.auth.uid == userId
                     && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['rol', 'estado']);
      }

      // Links de acceso: solo admins pueden crear, bridge puede leer/actualizar 'usado'
      match /links_acceso/{linkId} {
        allow read: if true;  // El bridge necesita validar sin auth
        allow create: if request.auth != null
                      && get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol == 'admin';
        allow update: if request.resource.data.diff(resource.data).affectedKeys().hasOnly(['usado']);
      }

      // Config: lectura para todos los autenticados, escritura solo admin/superadmin
      match /config/{configId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null
                     && get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol in ['admin', 'superadmin'];
      }

      // Simulacros: CLAVE DE RESPUESTAS PROTEGIDA
      match /simulacros/{simulacroId} {
        allow read: if request.auth != null
                    && !resource.data.keys().hasAny(['clave_respuestas']);
        // La clave SOLO es accesible vía Admin SDK (server-side)
      }
    }
  }
  ```

---

## Stack y Skills Necesarias

| Herramienta | Comando / Recurso |
|-------------|-------------------|
| shadcn/ui | `npx shadcn@latest add button card input label avatar toast separator` |
| Firebase Auth | Configurar en Console |
| Firebase Admin SDK | Ya instalado en Fase 01 |
| uuid | `npm install uuid @types/uuid` (para generar tokens) |

---

## Modelado de Datos

### Colección `/usuarios/{uid}`
```typescript
{
  uid: string;                    // UID de Firebase Auth
  nombre: string;                 // Nombre completo
  correo: string;                 // Email de Google
  rol: 'estudiante' | 'tutor' | 'admin' | 'superadmin';
  foto_perfil: string;            // URL de Google o Cloudinary
  materia_asignada?: string[];    // Solo tutores
  fecha_registro: Timestamp;
  estado: 'activo' | 'congelado' | 'baneado';
  cohorte_id: string;
  fcm_token?: string;             // Se agrega en Fase 09
  preferencias_notificaciones?: {  // Se agrega en Fase 09
    clases: boolean;
    anuncios: boolean;
    simulacros: boolean;
    eventos: boolean;
  };
}
```

### Colección `/links_acceso/{linkId}`
```typescript
{
  token: string;               // UUID único
  usado: boolean;              // Se marca true tras primer uso
  fecha_expiracion: Timestamp; // Default: 7 días desde creación
  cohorte_id: string;
  creado_por: string;          // UID del admin que lo generó
}
```

### Reglas de Seguridad Críticas
> ⚠️ **`clave_respuestas` en `/simulacros`**: Este campo NUNCA debe ser legible desde el cliente. Las reglas de Firestore deben explícitamente bloquear su lectura. Solo el Admin SDK (server-side via API Routes) puede acceder a él.

---

## GitOps — Instrucciones de Cierre

### Commits de esta fase
```
feat(auth): implementa inicio de sesión con Google Sign In
feat(auth): crea AuthProvider con contexto de sesión y rol
feat(auth): crea API route de sesión con cookie HttpOnly
feat(middleware): implementa protección de rutas por rol
feat(auth): construye página de login con diseño Raptor
feat(bridge): implementa registro con link de acceso único
feat(auth): crea API de generación de links para admin
chore(firestore): escribe reglas de seguridad base por rol
docs(changelog): registra entregables de la Fase 02
```

### Actualización del CHANGELOG.md
```markdown
## [Fase 02] — 2026-XX-XX — Autenticación y Sistema de Roles

### Agregado
- Inicio de sesión con Google Sign In (Firebase Auth).
- AuthProvider con contexto de usuario y detección de rol.
- API route de sesión con cookie HttpOnly segura.
- Middleware de protección de rutas por rol con redirección automática.
- Página de login con diseño Raptor.
- Bridge de registro con link de acceso único validado contra Firestore.
- API de generación de links de acceso para administradores.
- Reglas de seguridad de Firestore por rol (clave_respuestas protegida).
```

### Comando PR (MCP)
```
mcp_github-mcp-server_create_pull_request
  title: "Fase 02 — Autenticación con Google, roles y protección de rutas"
  head: "feature/fase-02-auth-roles"
  base: "main"
```

### Merge (MCP)
```
mcp_github-mcp-server_merge_pull_request
  merge_method: "squash"
  commit_title: "feat(auth): fase 02 completa — autenticación, roles y middleware"
```
