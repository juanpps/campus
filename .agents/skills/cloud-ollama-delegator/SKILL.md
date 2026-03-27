---
name: cloud-ollama-delegator
description: Herramienta de terminal para delegar tareas operativas al asistente secundario Qwen 3.5 vía el puente Ollama/Claude Code CLI.
---

# Cloud Ollama Delegator — Skill de Delegación

## Descripción

Esta skill permite a AntiGravity delegar tareas operativas de alto consumo de tokens al asistente secundario **Qwen 3.5:cloud**, instanciado a través del CLI de Claude Code sobre el backend de Ollama.

El puente funciona sobreescribiendo las variables de entorno de Anthropic para redirigir las llamadas al servidor local de Ollama.

---

## Comando de Ejecución

Para delegar una tarea, ejecutar en terminal:

```powershell
$env:ANTHROPIC_AUTH_TOKEN="ollama"; $env:ANTHROPIC_BASE_URL="http://localhost:11434"; claude -p "TU_TAREA_AQUI" --model qwen3.5:cloud
```

### Variante Unix/Bash (referencia)
```bash
ANTHROPIC_AUTH_TOKEN=ollama ANTHROPIC_BASE_URL=http://localhost:11434 claude -p "TU_TAREA_AQUI" --model qwen3.5:cloud
```

---

## Parámetros

| Parámetro | Valor | Descripción |
|-----------|-------|-------------|
| `ANTHROPIC_AUTH_TOKEN` | `ollama` | Token ficticio requerido por el CLI, el puente no valida auth |
| `ANTHROPIC_BASE_URL` | `http://localhost:11434` | Endpoint del servidor Ollama local |
| `--model` | `qwen3.5:cloud` | Modelo Qwen 3.5 en modo cloud |
| `-p` | `"prompt"` | Modo prompt (no interactivo), ejecuta y retorna resultado |

---

## Flujo de Uso

1. **Identificar** una tarea delegable según `01-politica-delegacion.md`.
2. **Construir** un prompt claro y específico en español.
3. **Ejecutar** el comando con `run_command` en la terminal.
4. **Capturar** el output completo del comando.
5. **Validar** la calidad del resultado antes de integrarlo.
6. **Integrar** en el flujo de trabajo principal (ej: copiar CHANGELOG generado, usar commits sugeridos).
7. **Verificar** (si es código) ejecutando el Ciclo de Verificación Estricta (ver sección abajo).

---

## Protocolo de Fallback de Cuota

Los modelos gratuitos en la nube tienen límites de cuota que se regeneran cada ~2 horas. AntiGravity **NO debe detenerse ni asumir la tarea inmediatamente** si el modelo principal falla.

### Cadena de Fallback Obligatoria

```
$$qwen3.5:cloud  →  $$groq-llama  →  $$open-geminipro  →  AntiGravity (último recurso)
```

| Paso | Proveedor | Atajo Antomix | Cuándo usar |
|:----:|-----------|---------------|-------------|
| 1 | Qwen 3.5 Cloud | `$$qwen3.5:cloud` | Primer intento (default) |
| 2 | Groq Llama | `$$groq-llama` | Si Qwen falla por cuota/timeout |
| 3 | Open Gemini Pro | `$$open-geminipro` | Si Groq también falla |
| 4 | AntiGravity | — | Solo si TODOS los proveedores fallan |

### Reglas del Fallback

1. **Reintentar antes de escalar:** Si el error es `429 Too Many Requests` o timeout, esperar 3 segundos y reintentar UNA vez con el mismo proveedor.
2. **Escalar al siguiente:** Si falla dos veces consecutivas, pasar al siguiente proveedor de la cadena.
3. **Preservar el prompt:** El mismo prompt se reutiliza exactamente igual para cada proveedor.
4. **Registrar el proveedor usado:** Anotar internamente qué proveedor completó la tarea para métricas.

### Ejemplo de Fallback en Terminal
```powershell
# Intento 1: Qwen falla por cuota
$$qwen3.5:cloud "Genera commits en español para..."
# Error 429 → Fallback automático:
$$groq-llama "Genera commits en español para..."
```

---

## Ciclo de Verificación Estricta (Dry Run)

> [!CAUTION]
> **NINGÚN código o tipado sugerido por sub-agentes se considera final hasta ser validado en la terminal.** Esta regla es INVIOLABLE.

### Comandos de Validación Obligatorios

Tras integrar cualquier sugerencia técnica (código, tipos, interfaces) de un sub-agente en los archivos del proyecto, ejecutar **en este orden exacto**:

```powershell
# Paso 1: Verificar integridad de TypeScript
npx tsc --noEmit

# Paso 2: Verificar reglas de Next.js / React
npm run lint
```

### Flujo de Auto-Corrección Delegada

Si la terminal arroja errores en estas pruebas:

1. **PROHIBIDO** gastar tokens propios de AntiGravity para corregir el error.
2. **Copiar el error textual** de la terminal.
3. **Devolver al sub-agente** con el error adjunto para que él lo corrija:

```powershell
# Ejemplo: lint falló → devolver error al sub-agente
$$groq-llama "El código que generaste falló el linting con este error: [PEGAR_ERROR_TERMINAL]. Devuelve SOLO el código corregido, sin explicaciones."
```

4. **Re-validar** el código corregido ejecutando ambos comandos de nuevo.
5. **Máximo 3 ciclos** de corrección. Si tras 3 intentos sigue fallando, AntiGravity asume la corrección directamente.

### Diagrama del Ciclo

```
Sub-agente genera código
        ↓
Integrar en archivos del proyecto
        ↓
npx tsc --noEmit → ¿OK?
        ↓ NO              ↓ SÍ
Copiar error           npm run lint → ¿OK?
        ↓                   ↓ NO            ↓ SÍ
Devolver al sub-agente   Copiar error     ✅ Código validado
con error adjunto        Devolver al        → Listo para commit
        ↓                sub-agente
Re-validar (max 3x)          ↓
                        Re-validar (max 3x)
```

---

## Manejo de Errores

| Error | Causa probable | Acción |
|-------|---------------|--------|
| `Connection refused` | Servidor Ollama no activo | Fallback → `$$groq-llama` → `$$open-geminipro` → asumir |
| `Model not found` | Modelo no descargado | Fallback al siguiente proveedor |
| `429 Too Many Requests` | Cuota agotada | Esperar 3s → reintentar → fallback |
| `Timeout` | Tarea compleja o servidor lento | Reintentar 1x → fallback |
| `Output vacío` | Error de parsing en el puente | Reintentar 1x → fallback |
| `tsc --noEmit` falla | Código del sub-agente con errores TS | Ciclo de auto-corrección delegada (max 3x) |
| `npm run lint` falla | Violación de reglas ESLint/Next.js | Ciclo de auto-corrección delegada (max 3x) |

> [!IMPORTANT]
> **Regla de oro:** La cadena de fallback garantiza disponibilidad continua. AntiGravity solo asume una tarea directamente cuando TODOS los proveedores de la cadena han fallado Y los 3 ciclos de corrección se han agotado.

---

## Ejemplo de Uso Real

### Generar entrada de CHANGELOG para Fase 01
```powershell
$$qwen3.5:cloud "Genera una entrada de CHANGELOG.md en español con formato Keep a Changelog para la Fase 01 del proyecto Campus Raptor PREICFES. Los entregables fueron: proyecto Next.js 15 con App Router, Tailwind CSS configurado con paleta Raptor, shadcn/ui inicializado, estructura de carpetas con Route Groups por rol, configuración PWA con manifest.json, Firebase SDK conectado."
```

### Generar mensajes de commit
```powershell
$$qwen3.5:cloud "Genera una lista de Conventional Commits en español para los siguientes cambios: se creó el proyecto Next.js, se configuró Tailwind con colores Raptor, se instaló shadcn/ui, se crearon las carpetas de Route Groups."
```

### Auto-corrección tras fallo de lint
```powershell
$$groq-llama "El código que generaste para el componente Sidebar.tsx falló con: Error: 'usePathname' is imported from 'next/navigation' but never used. Devuelve SOLO el código corregido."
```

---

## Restricciones

- **NUNCA** usar `ollama run` directamente. Siempre usar atajos Antomix (`$$`) o el CLI de Claude Code con variables de entorno sobreescritas.
- **NUNCA** delegar tareas marcadas como prohibidas en `01-politica-delegacion.md`.
- **NUNCA** enviar credenciales, tokens de Firebase o claves API en el prompt de delegación.
- **NUNCA** dar por bueno código de sub-agentes sin pasar el Ciclo de Verificación Estricta.
- **NUNCA** gastar tokens propios de AntiGravity para corregir errores que un sub-agente puede auto-corregir.
