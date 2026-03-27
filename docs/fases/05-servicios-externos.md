# Fase 05 — Servicios de Integración Externa (Cloudinary y Google Drive)

| Campo | Valor |
|-------|-------|
| **Épica** | Cloudinary y Google Drive |
| **Rama** | `feature/fase-05-servicios` |
| **Dependencia** | Fase 01 completada (paralelizable con Fases 03-04) |
| **Duración estimada** | 1 sprint (3-4 horas) |

---

## Objetivo del Sprint

Crear los servicios reutilizables de Cloudinary (upload, optimización y eliminación de imágenes) y Google Drive (visor de PDFs, reproductor de videos), que serán consumidos por las fases 06-10. Firebase Storage NO se usa en ningún punto.

---

## Checklist de Tareas (Orden de Ejecución)

### 1. Crear Rama de Trabajo
- [ ] `mcp_github-mcp-server_create_branch`: `feature/fase-05-servicios` desde `main`

### 2. Instalar Dependencias
```bash
npm install cloudinary                # SDK de Cloudinary (server-side)
npm install next-cloudinary           # Componentes React para Cloudinary
```

### 3. Configurar Variables de Entorno
- [ ] Agregar a `.env.local`:
  ```env
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
  CLOUDINARY_API_KEY=
  CLOUDINARY_API_SECRET=
  ```
- [ ] Agregar a `.env.example` (sin valores reales).

### 4. Servicio de Cloudinary

- [ ] `src/lib/cloudinary/config.ts`:
  ```typescript
  // Configuración del SDK de Cloudinary (server-side)
  // Exporta instancia configurada con cloud_name, api_key, api_secret
  ```

- [ ] `src/lib/cloudinary/upload.ts`:
  ```typescript
  // Funciones server-side:

  uploadImage(file: Buffer, options: {
    folder: string;         // Ej: 'raptor/banners', 'raptor/thumbnails', 'raptor/avatars'
    publicId?: string;      // Identificador único opcional
    transformation?: object; // Resize, crop, etc.
  }): Promise<{ url: string; publicId: string }>

  deleteImage(publicId: string): Promise<void>

  getOptimizedUrl(publicId: string, options: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'thumb';
    format?: 'auto' | 'webp' | 'avif';
    quality?: 'auto' | number;
  }): string
  ```

- [ ] `src/app/api/cloudinary/sign/route.ts`:
  - Genera firma para upload directo desde el frontend (client-side upload).
  - Solo accesible para roles `tutor`, `admin`, `superadmin`.
  - Retorna: `signature`, `timestamp`, `cloudName`, `apiKey`.

- [ ] `src/app/api/cloudinary/upload/route.ts`:
  - Upload server-side para imágenes de perfil de estudiantes.
  - Recibe FormData con imagen.
  - Retorna URL de Cloudinary.

### 5. Componente CloudinaryImage

- [ ] `src/components/shared/CloudinaryImage.tsx`:
  ```typescript
  // Wrapper de next/image con loader personalizado de Cloudinary
  // Props: publicId, width, height, alt, className
  // Genera URL optimizada automáticamente (format: auto, quality: auto)
  // Soporta responsive sizes y lazy loading
  ```

### 6. Servicio de Google Drive

- [ ] `src/lib/drive/config.ts`:
  ```typescript
  // Configuración: credenciales de Service Account para Drive API
  // Solo se necesita si se usan archivos restringidos
  ```

- [ ] `src/lib/drive/viewer.ts`:
  ```typescript
  // Funciones para generar URLs de embebido:

  getDrivePdfViewerUrl(fileId: string): string
  // Retorna: `https://drive.google.com/file/d/${fileId}/preview`

  getDriveVideoUrl(fileId: string): string
  // Retorna: URL de reproducción embebida de Drive

  getYouTubeEmbedUrl(videoUrl: string): string
  // Extrae video ID y retorna: `https://www.youtube.com/embed/${videoId}`
  // Agrega parámetros: modestbranding=1, rel=0 (sin videos relacionados)

  isYouTubeUrl(url: string): boolean
  isDriveUrl(url: string): boolean
  ```

### 7. Componente DriveFileViewer

- [ ] `src/components/shared/DriveFileViewer.tsx`:
  ```typescript
  // Visor embebido de PDFs desde Google Drive
  // Props: fileId, title, className
  // Usa iframe con URL de preview de Drive
  // Incluye: borde, border-radius, estado de carga (skeleton)
  // El PDF se muestra dentro de la plataforma, el estudiante NO puede salir a Drive
  ```

### 8. Componente VideoPlayer

- [ ] `src/components/shared/VideoPlayer.tsx`:
  ```typescript
  // Reproductor interno de video que soporta múltiples fuentes
  // Props: url (YouTube o Drive), title, onComplete?, className
  //
  // Lógica:
  // 1. Detecta si es YouTube o Drive con isYouTubeUrl / isDriveUrl
  // 2. YouTube: iframe con embed URL, parámetros de privacidad
  // 3. Drive: iframe con preview URL
  //
  // Features:
  // - Responsive (aspect-ratio 16/9)
  // - Skeleton loading mientras carga el iframe
  // - Título del video visible sobre el reproductor
  // - NO expone la URL directa al estudiante (iframe aislado)
  ```

### 9. Organización de Carpetas en Cloudinary

Estructura recomendada de carpetas en el panel de Cloudinary:
```
raptor/
├── banners/          # Banners de materias
├── thumbnails/       # Miniaturas de clases
├── avatars/          # Fotos de perfil
├── anuncios/         # Imágenes de anuncios
├── blog/             # Imágenes de entradas de psicología
└── config/           # Banner modal, logos, iconos
```

---

## Stack y Skills Necesarias

| Herramienta | Comando / Recurso |
|-------------|-------------------|
| Cloudinary SDK | `npm install cloudinary` |
| next-cloudinary | `npm install next-cloudinary` |
| Google Drive API | Configurar en Google Cloud Console |

---

## Modelado de Datos

No se crean colecciones Firestore en esta fase. Los servicios son utilidades puras que serán consumidas por las fases 06+.

**Patrón de almacenamiento:**
| Tipo de archivo | Destino | Formato de referencia en Firestore |
|-----------------|---------|-----------------------------------|
| Imágenes (banners, thumbnails, avatars) | Cloudinary | URL completa o `publicId` |
| PDFs de simulacros | Google Drive | `fileId` de Drive |
| Videos de clases | YouTube privado o Google Drive | URL completa |
| Diapositivas y materiales | Google Drive | `fileId` de Drive |

---

## GitOps — Instrucciones de Cierre

### Commits de esta fase
```
feat(cloudinary): crea servicio de upload y optimización de imágenes
feat(cloudinary): implementa API route de firma para upload directo
feat(cloudinary): crea componente CloudinaryImage con next/image
feat(drive): implementa funciones de visor de PDF y video embebido
feat(drive): crea componente DriveFileViewer con iframe aislado
feat(drive): crea componente VideoPlayer multi-fuente (YouTube + Drive)
docs(changelog): registra entregables de la Fase 05
```

### Actualización del CHANGELOG.md
```markdown
## [Fase 05] — 2026-XX-XX — Servicios Externos (Cloudinary y Drive)

### Agregado
- Servicio Cloudinary: upload, optimización (auto format/quality) y eliminación de imágenes.
- API route de firma para upload directo desde el frontend.
- Componente CloudinaryImage con loader personalizado para next/image.
- Servicio Google Drive: generación de URLs de visor para PDFs y videos.
- Componente DriveFileViewer para visualización embebida de PDFs.
- Componente VideoPlayer compatible con YouTube privado y Google Drive.
```

### Comando PR (MCP)
```
mcp_github-mcp-server_create_pull_request
  title: "Fase 05 — Servicios de Cloudinary y Google Drive"
  head: "feature/fase-05-servicios"
  base: "main"
```

### Merge (MCP)
```
mcp_github-mcp-server_merge_pull_request
  merge_method: "squash"
  commit_title: "feat(servicios): fase 05 completa — Cloudinary y Google Drive integrados"
```
