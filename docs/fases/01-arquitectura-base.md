# Fase 01 — Arquitectura Base y Scaffolding

| Campo | Valor |
|-------|-------|
| **Épica** | Fundación del Proyecto |
| **Rama** | `feature/fase-01-arquitectura` |
| **Dependencia** | Fase 00 completada |
| **Duración estimada** | 1 sprint (2-4 horas) |

---

## Objetivo del Sprint

Crear el proyecto Next.js con App Router, configurar Tailwind CSS con la identidad visual Raptor, establecer la estructura de carpetas con Route Groups por rol, habilitar la PWA y conectar el Firebase SDK (client + admin).

---

## Checklist de Tareas (Orden de Ejecución)

### 1. Crear Rama de Trabajo
- [ ] `mcp_github-mcp-server_create_branch`: `feature/fase-01-arquitectura` desde `main`

### 2. Inicializar Proyecto Next.js
- [ ] Ejecutar localmente:
  ```bash
  npx -y create-next-app@latest ./ --app --tailwind --typescript --eslint --src-dir --import-alias "@/*" --use-npm
  ```
- [ ] Verificar que el proyecto arranca con `npm run dev`.

### 3. Instalar shadcn/ui
- [ ] Inicializar shadcn/ui:
  ```bash
  npx shadcn@latest init
  ```
  Configuración recomendada:
  - Style: `default`
  - Base color: `slate`
  - CSS variables: `yes`
  - React Server Components: `yes`
- [ ] Verificar que se creó `components.json` y la función `cn()` en `src/lib/utils.ts`.

### 4. Configurar Tailwind con Identidad Raptor
- [ ] Editar `tailwind.config.ts`:
  ```typescript
  // Agregar paleta Raptor, breakpoints custom, tokens de espaciado
  theme: {
    extend: {
      colors: {
        raptor: {
          // Definir paleta primaria, secundaria, acentos
        },
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
      },
    },
  },
  ```
- [ ] Configurar modo oscuro con `darkMode: 'class'` en Tailwind.
- [ ] Definir CSS variables de diseño en `src/app/globals.css` (colores semánticos, radii, sombras).

### 5. Estructura de Carpetas (Route Groups)
- [ ] Crear la estructura completa de directorios:

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Placeholder
│   │   ├── registro/page.tsx       # Placeholder
│   │   └── bridge/page.tsx         # Placeholder
│   ├── (estudiante)/
│   │   ├── layout.tsx              # Layout con nav de estudiante
│   │   ├── dashboard/page.tsx
│   │   ├── materias/page.tsx
│   │   ├── calendario/page.tsx
│   │   ├── anuncios/page.tsx
│   │   ├── apps/page.tsx
│   │   └── perfil/page.tsx
│   ├── (tutor)/
│   │   ├── layout.tsx              # Layout con nav de tutor
│   │   ├── dashboard/page.tsx
│   │   ├── clases/page.tsx
│   │   ├── materiales/page.tsx
│   │   ├── simulacros/page.tsx
│   │   ├── anuncios/page.tsx
│   │   ├── calendario/page.tsx
│   │   └── estudiantes/page.tsx
│   ├── (admin)/
│   │   ├── layout.tsx              # Layout con nav de admin
│   │   ├── dashboard/page.tsx
│   │   ├── estudiantes/page.tsx
│   │   ├── tutores/page.tsx
│   │   ├── anuncios/page.tsx
│   │   ├── configuracion/page.tsx
│   │   └── eventos/page.tsx
│   ├── (superadmin)/
│   │   ├── layout.tsx              # Layout con nav de superadmin
│   │   ├── dashboard/page.tsx
│   │   └── administradores/page.tsx
│   ├── mantenimiento/page.tsx
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Landing / redirect
│   └── globals.css
├── components/
│   ├── ui/                         # Componentes shadcn/ui (se instalan aquí)
│   ├── navigation/                 # Sidebar, BottomNav, TopBar
│   └── shared/                     # CloudinaryImage, VideoPlayer, etc.
├── lib/
│   ├── firebase/
│   │   ├── client.ts               # Firebase App (client-side)
│   │   └── admin.ts                # Firebase Admin SDK (server-side)
│   ├── cloudinary/                 # (se implementa en Fase 05)
│   ├── drive/                      # (se implementa en Fase 05)
│   └── utils.ts                    # cn() de shadcn + helpers
├── hooks/                          # useAuth, useRole, useMediaQuery, etc.
├── stores/                         # Zustand stores (tema, sidebar, etc.)
├── types/                          # TypeScript interfaces globales
│   ├── user.ts
│   ├── materia.ts
│   ├── simulacro.ts
│   └── index.ts
└── middleware.ts                   # Protección de rutas (se implementa en Fase 02)
```

- [ ] Cada `page.tsx` placeholder debe exportar un componente mínimo con el nombre de la ruta para verificar que el routing funciona.

### 6. Configurar PWA
- [ ] Instalar dependencia PWA:
  ```bash
  npm install @ducanh2912/next-pwa
  ```
- [ ] Configurar `next.config.ts` con el plugin PWA.
- [ ] Crear `public/manifest.json`:
  ```json
  {
    "name": "Campus Raptor PREICFES",
    "short_name": "Raptor",
    "description": "Plataforma educativa PREICFES — Método Raptor",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#DEFINIR_COLOR",
    "theme_color": "#DEFINIR_COLOR",
    "icons": [
      { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
      { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
    ]
  }
  ```
- [ ] Agregar meta tags PWA en `src/app/layout.tsx`:
  ```tsx
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#DEFINIR_COLOR" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <link rel="apple-touch-icon" href="/icons/icon-192.png" />
  ```

### 7. Conectar Firebase SDK
- [ ] Instalar dependencias:
  ```bash
  npm install firebase firebase-admin
  ```
- [ ] Crear `src/lib/firebase/client.ts`:
  ```typescript
  // Inicialización de Firebase App con variables de entorno
  // FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, etc.
  // Exporta: app, auth, db (Firestore)
  ```
- [ ] Crear `src/lib/firebase/admin.ts`:
  ```typescript
  // Inicialización de Firebase Admin SDK con Service Account
  // Usa variables de entorno del servidor
  // Exporta: adminApp, adminAuth, adminDb
  ```
- [ ] Crear `.env.local` (excluido por `.gitignore`):
  ```env
  NEXT_PUBLIC_FIREBASE_API_KEY=
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
  NEXT_PUBLIC_FIREBASE_APP_ID=
  FIREBASE_ADMIN_PROJECT_ID=
  FIREBASE_ADMIN_CLIENT_EMAIL=
  FIREBASE_ADMIN_PRIVATE_KEY=
  ```
- [ ] Crear `.env.example` (SIN valores reales, se sube al repo como referencia).

### 8. Configurar next.config.ts
- [ ] Configurar dominios de imágenes remotas (Cloudinary):
  ```typescript
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  ```
- [ ] Agregar headers de seguridad básicos.

### 9. Configurar Tipos TypeScript Base
- [ ] Crear `src/types/user.ts`:
  ```typescript
  export type UserRole = 'estudiante' | 'tutor' | 'admin' | 'superadmin';
  export type UserStatus = 'activo' | 'congelado' | 'baneado';

  export interface RaptorUser {
    uid: string;
    nombre: string;
    correo: string;
    rol: UserRole;
    foto_perfil: string;
    materia_asignada?: string[];
    fecha_registro: Date;
    estado: UserStatus;
    cohorte_id: string;
    fcm_token?: string;
  }
  ```
- [ ] Crear interfaces base para `Materia`, `Clase`, `Simulacro`, `Anuncio`, `Evento` en sus respectivos archivos.

### 10. Vincular con Vercel
- [ ] Conectar repositorio GitHub a Vercel.
- [ ] Configurar variables de entorno en Vercel (mismas de `.env.local`).
- [ ] Verificar primer deploy con la página placeholder.

---

## Stack y Skills Necesarias

| Herramienta | Comando / Recurso |
|-------------|-------------------|
| Next.js | `npx create-next-app@latest` |
| shadcn/ui | `npx shadcn@latest init` |
| Tailwind CSS | Viene con create-next-app |
| PWA | `npm install @ducanh2912/next-pwa` |
| Firebase | `npm install firebase firebase-admin` |
| Lucide Icons | `npm install lucide-react` |
| Google Fonts | Importar via `next/font/google` (Inter) |
| Zustand | `npm install zustand` |
| Vercel CLI | `npm install -g vercel` (opcional) |

**Skills de referencia:**
- `vercel-react-best-practices` — para configuración óptima de Next.js.
- `shadcn-ui` — para inicialización correcta de componentes.
- `ui-ux-pro-max` — para tokens de diseño (se usará activamente en Fase 03).

---

## Modelado de Datos

No se crean colecciones en Firestore en esta fase, pero sí se definen las interfaces TypeScript que representan el esquema futuro. La conexión Firebase queda lista para usarse a partir de la Fase 02.

---

## GitOps — Instrucciones de Cierre

### Commits de esta fase
```
feat(scaffold): inicializa proyecto Next.js con App Router y Tailwind CSS
feat(shadcn): configura shadcn/ui con estilo default y CSS variables
feat(estructura): crea route groups por rol con páginas placeholder
feat(pwa): configura manifest.json y plugin next-pwa
feat(firebase): conecta SDK client y admin con variables de entorno
feat(types): define interfaces TypeScript base para todos los modelos
chore(vercel): vincula repositorio y verifica primer deploy
docs(changelog): registra entregables de la Fase 01
```

### Actualización del CHANGELOG.md
```markdown
## [Fase 01] — 2026-XX-XX — Arquitectura Base

### Agregado
- Proyecto Next.js 15 con App Router, TypeScript y Tailwind CSS.
- shadcn/ui inicializado con estilo default.
- Estructura de carpetas con Route Groups: (auth), (estudiante), (tutor), (admin), (superadmin).
- Configuración PWA con manifest.json y service worker.
- Firebase SDK (client + admin) conectado con variables de entorno.
- Interfaces TypeScript para todos los modelos de datos.
- Primer deploy a Vercel verificado.
```

### Comando PR (MCP)
```
mcp_github-mcp-server_create_pull_request
  title: "Fase 01 — Arquitectura Base y Scaffolding del Proyecto"
  head: "feature/fase-01-arquitectura"
  base: "main"
```

### Merge (MCP)
```
mcp_github-mcp-server_merge_pull_request
  merge_method: "squash"
  commit_title: "feat(scaffold): fase 01 completa — arquitectura base del proyecto"
```
