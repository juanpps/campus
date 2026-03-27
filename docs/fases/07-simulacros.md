# Fase 07 — Sistema de Mini Simulacros

| Campo | Valor |
|-------|-------|
| **Épica** | Evaluación Académica |
| **Rama** | `feature/fase-07-simulacros` |
| **Dependencia** | Fase 06 completada |
| **Duración estimada** | 2 sprints (8-10 horas) |

---

## Objetivo del Sprint

Implementar el ciclo completo de simulacros: creación por el tutor con clave de respuestas protegida, presentación por el estudiante con vista dividida PDF/formulario, calificación server-side (la clave NUNCA llega al cliente), y visualización de resultados por rol.

---

## Checklist de Tareas (Orden de Ejecución)

### 1. Crear Rama de Trabajo
- [ ] `mcp_github-mcp-server_create_branch`: `feature/fase-07-simulacros` desde `main`

### 2. Instalar Componentes shadcn/ui Adicionales
```bash
npx shadcn@latest add radio-group
npx shadcn@latest add toggle-group
npx shadcn@latest add collapsible
```

### 3. Creación de Simulacro — Panel del Tutor

- [ ] `src/app/(tutor)/simulacros/page.tsx`:
  - Tabla de simulacros creados: título, materia, fecha disponibilidad, completados, acciones.
  - Acciones: ver resultados, editar, eliminar.

- [ ] `src/app/(tutor)/simulacros/nuevo/page.tsx`:
  - Formulario con react-hook-form + zod:
    ```
    Campos:
    ├── Título (Input, requerido)
    ├── Materia (Select, filtrado a materias del tutor)
    ├── Número de preguntas (Input type number, min 1, max 100)
    ├── URL del PDF en Drive (Input, validación de URL)
    ├── Clave de respuestas (generado dinámicamente):
    │   ├── Pregunta 1: [A] [B] [C] [D]  ← RadioGroup por pregunta
    │   ├── Pregunta 2: [A] [B] [C] [D]
    │   └── ...N preguntas
    ├── Fecha de disponibilidad (Input type datetime-local)
    ├── Fecha límite (opcional, datetime-local)
    ├── Tiempo límite en minutos (opcional, Input type number)
    ├── Mostrar respuestas incorrectas (Switch)
    └── Permitir reintentos (Switch)
    ```
  - **Comportamiento del campo "Número de preguntas":** al cambiar el número, se generan dinámicamente N filas de RadioGroup para la clave.

- [ ] **API Route `/api/simulacros/crear`** (Server Action):
  - Valida datos del formulario con zod.
  - Verifica que el usuario es tutor de la materia.
  - Guarda documento en `/simulacros/{id}` con `clave_respuestas` como campo protegido.
  - La clave **solo** se escribe via Admin SDK.

### 4. Presentación de Simulacro — Panel del Estudiante

- [ ] `src/app/(estudiante)/materias/[materiaId]/simulacro/[simulacroId]/page.tsx`:

  **Paso 1: Verificación previa**
  ```
  ¿Disponible? → fecha_disponible <= now
  ¿Ya completado? → buscar en /resultados_simulacro donde estudiante_id == uid
  ¿Permite reintentos? → si completado y permite_reintentos == false → bloquear
  ¿Expirado? → fecha_limite && fecha_limite < now → bloquear
  ```

  **Paso 2: Selector de modo de visualización**
  - Dialog al entrar con dos opciones (visual, con preview):
    - **Vista dividida:** PDF a la izquierda (50%), formulario a la derecha (50%).
    - **Formulario flotante:** PDF a pantalla completa, formulario como Sheet draggable.
  - En **móvil**: solo formulario flotante (PDF ocupa toda la pantalla arriba, formulario abajo en scroll).

  **Paso 3: Interfaz de respuesta**
  ```
  ┌─────────────────────────┬──────────────────────────┐
  │                          │  Pregunta 1 de N          │
  │   DriveFileViewer        │  ○ A  ○ B  ○ C  ○ D      │
  │   (PDF del simulacro)    │                           │
  │                          │  Pregunta 2 de N          │
  │                          │  ○ A  ○ B  ○ C  ○ D      │
  │                          │  ...                      │
  │                          │                           │
  │                          │  ┌──────────────────────┐ │
  │                          │  │ Enviar respuestas    │ │
  │                          │  └──────────────────────┘ │
  │                          │  Tiempo restante: 45:32   │
  └─────────────────────────┴──────────────────────────┘
  ```

  **Timer:** Si hay `tiempo_limite_minutos`:
  - Cuenta regresiva visible.
  - Warning visual cuando quedan 5 minutos.
  - Auto-envío cuando llega a 0 (con toast de aviso).

  **Envío:**
  - Botón "Enviar" → AlertDialog de confirmación.
  - Al confirmar → POST a `/api/simulacros/calificar`.
  - Mientras califica → loading state en el botón.

### 5. Calificación Server-Side

- [ ] **API Route `/api/simulacros/calificar`:**
  ```typescript
  // POST body: { simulacro_id, respuestas: string[] }
  //
  // Proceso:
  // 1. Verificar autenticación (cookie de sesión).
  // 2. Leer clave_respuestas de /simulacros/{id} con Admin SDK.
  //    ⚠️ NUNCA enviar la clave al cliente.
  // 3. Comparar respuesta a respuesta.
  // 4. Calcular puntaje: (correctas / total) * 100.
  // 5. Determinar cuáles fueron incorrectas (si mostrar_respuestas_incorrectas == true).
  // 6. Guardar en /resultados_simulacro/{id}:
  //    { simulacro_id, estudiante_id, respuestas, puntaje, fecha_presentacion,
  //      incorrectas?: number[] }  // Solo los índices de las incorrectas
  // 7. Retornar al cliente:
  //    { puntaje, total_preguntas, correctas, incorrectas?: number[] }
  //    ⚠️ NUNCA retornar las respuestas correctas, solo los índices incorrectos.
  ```

> ⚠️ **SEGURIDAD CRÍTICA:**
> - El campo `clave_respuestas` en `/simulacros` está protegido por reglas de Firestore que bloquean lectura del cliente.
> - Solo el Admin SDK (server-side) puede leer este campo.
> - La API NUNCA retorna las respuestas correctas, solo indica cuáles fueron incorrectas (por índice).
> - El estudiante ve: "Pregunta 3: Tu respuesta fue incorrecta" pero NUNCA "La respuesta correcta era B".

### 6. Vista de Resultados

- [ ] **Resultado inmediato post-envío (Estudiante):**
  - Pantalla de resultados: puntaje prominente, preguntas correctas/incorrectas.
  - Si `mostrar_respuestas_incorrectas`: lista de preguntas marcadas como incorrectas.
  - Botón "Volver a la materia".

- [ ] **Historial en perfil (Estudiante):**
  - Tabla en configuración/perfil: simulacro, materia, puntaje, fecha.

- [ ] **Panel de resultados (Tutor):**
  - `src/app/(tutor)/simulacros/[simulacroId]/resultados/page.tsx`:
  - DataTable: estudiante, puntaje, fecha, tiempo usado.
  - Estadísticas: promedio, mediana, mejor puntaje, peor puntaje.
  - Exportar a CSV.

- [ ] **Vista admin:**
  - Estadísticas agregadas por materia en el dashboard del admin.

---

## Stack y Skills Necesarias

| Herramienta | Comando / Recurso |
|-------------|-------------------|
| shadcn/ui | `radio-group, toggle-group, collapsible` |
| react-hook-form + zod | Ya instalados |
| DriveFileViewer | Componente de Fase 05 |

---

## Modelado de Datos

### Colección `/simulacros/{simulacro_id}`
```typescript
{
  materia_id: string;
  tutor_id: string;
  titulo: string;
  num_preguntas: number;
  pdf_url: string;                       // URL de Drive (fileId)
  clave_respuestas: string[];            // ['A', 'B', 'D', 'C', ...] ⚠️ SOLO SERVER
  fecha_disponible: Timestamp;
  fecha_limite?: Timestamp;              // Opcional
  tiempo_limite_minutos?: number;        // Opcional
  mostrar_respuestas_incorrectas: boolean;
  permite_reintentos: boolean;
  fecha_creacion: Timestamp;
}
```

### Colección `/resultados_simulacro/{resultado_id}`
```typescript
{
  simulacro_id: string;
  estudiante_id: string;
  respuestas: string[];                  // ['A', 'C', 'B', 'D', ...]
  puntaje: number;                       // Porcentaje (0-100)
  correctas: number;                     // Número de respuestas correctas
  incorrectas?: number[];                // Índices de preguntas incorrectas
  fecha_presentacion: Timestamp;
  tiempo_usado_minutos?: number;         // Si había timer
}
```

### Reglas de Seguridad Críticas
```
match /simulacros/{simulacroId} {
  // Lectura: todos los autenticados EXCEPTO el campo clave_respuestas
  allow read: if request.auth != null;
  // ⚠️ El campo clave_respuestas es filtrado a nivel de aplicación:
  // - El cliente NUNCA solicita este campo.
  // - El Admin SDK lee el documento completo en el server.
  // - Refuerzo: usar Firestore field-level security o sub-colección privada.

  // Escritura: solo tutores de esa materia
  allow create, update: if request.auth != null
    && get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol == 'tutor';
}

// Alternativa más segura: mover clave a sub-colección
match /simulacros/{simulacroId}/privado/clave {
  allow read, write: if false;  // Solo Admin SDK
}

match /resultados_simulacro/{resultadoId} {
  allow read: if request.auth != null
    && (resource.data.estudiante_id == request.auth.uid
        || get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol in ['tutor', 'admin']);
  allow create: if request.auth != null;
  allow update, delete: if false;  // Inmutable
}
```

> **Recomendación de arquitectura:** Para seguridad máxima, almacenar `clave_respuestas` en una **sub-colección privada** `/simulacros/{id}/privado/clave` con regla `allow read: if false`. Esto garantiza que ni siquiera un bug en el cliente pueda filtrar la clave.

---

## GitOps — Instrucciones de Cierre

### Commits de esta fase
```
feat(simulacros): crea formulario de creación con clave dinámica protegida
feat(simulacros): implementa API Route de creación con Admin SDK
feat(simulacros): construye interfaz de presentación con vista dividida
feat(simulacros): implementa timer y auto-envío por tiempo
feat(simulacros): crea calificación server-side segura
feat(simulacros): implementa vista de resultados por rol (estudiante, tutor, admin)
chore(firestore): protege clave_respuestas con reglas de sub-colección privada
docs(changelog): registra entregables de la Fase 07
```

### Actualización del CHANGELOG.md
```markdown
## [Fase 07] — 2026-XX-XX — Sistema de Mini Simulacros

### Agregado
- Formulario de creación de simulacros con clave de respuestas dinámica.
- API Route de creación que protege la clave via Admin SDK.
- Interfaz de presentación con vista dividida (PDF + formulario) y modo flotante.
- Timer configurable con auto-envío al finalizar.
- Calificación exclusivamente server-side (clave nunca expuesta al cliente).
- Vista de resultados inmediatos para estudiantes.
- Panel de resultados para tutores con estadísticas y exportar CSV.
- Reglas de seguridad con sub-colección privada para claves.

### Seguridad
- Campo `clave_respuestas` almacenado en sub-colección con `allow read: if false`.
- API de calificación nunca retorna respuestas correctas, solo índices incorrectos.
```

### Comando PR (MCP)
```
mcp_github-mcp-server_create_pull_request
  title: "Fase 07 — Sistema de mini simulacros con calificación server-side"
  head: "feature/fase-07-simulacros"
  base: "main"
```

### Merge (MCP)
```
mcp_github-mcp-server_merge_pull_request
  merge_method: "squash"
  commit_title: "feat(simulacros): fase 07 completa — simulacros con seguridad server-side"
```
