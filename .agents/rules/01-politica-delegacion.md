---
description: Política de delegación de tareas a sub-agentes (Qwen 3.5, Groq, Gemini Pro) vía Antomix y puente Ollama/Claude Code.
---

# Política de Delegación — Ecosistema Multi-Agente

## Directriz Principal

AntiGravity (agente primario) tiene la directriz estricta de **delegar tareas operativas de alto consumo de tokens** a sub-agentes vía Antomix (`$$qwen3.5:cloud`, `$$groq-llama`, `$$open-geminipro`, `$$gemini-pro`).

El objetivo es optimizar el consumo de tokens del agente primario en fases de desarrollo (01 en adelante), reservando su capacidad para decisiones arquitectónicas y de seguridad críticas.

## Directriz Gemini Pro (Ventana de Contexto Extendida)

> [!IMPORTANT]
> Para tareas que requieran el análisis de **documentos masivos** (ej. extraer preguntas de un PDF de simulacro de 50+ páginas) o procesar **logs de errores gigantes**, DEBES utilizar el atajo `$$gemini-pro` a través de Antomix para aprovechar su ventana de contexto extendida.

| Caso de uso | Por qué Gemini Pro |
|-------------|--------------------|
| PDFs de simulacros (50+ páginas) | Ventana de contexto de 1M+ tokens |
| Logs de build/runtime extensos | Procesa archivos de log sin truncar |
| Análisis de `raptor_campus_especificaciones.md` completo | Puede ingerir el documento entero |
| Auditoría de múltiples archivos de fase simultáneamente | Contexto suficiente para cross-reference |

**Nota:** Si se experimentan errores de ruteo con Gemini en Antomix, configurar `absolute_url: true` en los ajustes del proxy.

---

## Tareas Delegables (Permitidas para Qwen)

| Categoría | Ejemplos |
|-----------|----------|
| **Auditoría de skills** | Revisar y resumir skills de terceros, detectar incompatibilidades |
| **Redacción de CHANGELOG** | Generar entradas de CHANGELOG.md en español con formato Keep a Changelog |
| **Conventional Commits** | Generar mensajes de commit en español siguiendo la convención establecida |
| **Análisis de logs** | Parsear logs de errores de terminal, build o runtime y proponer soluciones |
| **Mock data** | Crear datos de prueba para Firestore (usuarios, materias, simulacros, etc.) |
| **Documentación auxiliar** | Redactar comentarios JSDoc, descripciones de PR, resúmenes de fase |
| **Revisión de código boilerplate** | Validar sintaxis de archivos repetitivos (types, interfaces, schemas) |
| **Análisis de documentos masivos** | Usar `$$gemini-pro` para PDFs de simulacros, logs extensos, specs completas |
| **Auditoría de skills de terceros** | Descargar, verificar e instalar skills desde SkillsMP vía `skill-vetter` |
| **Código aislado vía OpenCode** | Algoritmos complejos, componentes aislados, scripts paralelos (vía `acp-router`) |

---

## Tareas Prohibidas (NUNCA delegar)

> [!CAUTION]
> Las siguientes tareas son **exclusivas del agente primario (AntiGravity)** y NUNCA deben delegarse al asistente secundario.

| Categoría | Razón |
|-----------|-------|
| **Arquitectura Next.js App Router** | Decisiones de routing, layouts, middleware y RSC requieren contexto completo del proyecto |
| **Configuración de Tailwind CSS** | Tokens de diseño, paleta Raptor y breakpoints son críticos para la identidad visual |
| **Reglas de seguridad de Firestore** | Especialmente la protección de `clave_respuestas` en simulacros — riesgo de seguridad |
| **Orquestación de Firebase Auth** | Flujos de sesión, cookies HttpOnly y middleware de roles son sensibles |
| **Configuración de FCM** | Service workers y tokens push requieren integración precisa |
| **Decisiones de GitOps** | Creación de ramas, PRs y merges deben ser ejecutados por el agente primario vía MCP |
| **Integración con Cloudinary/Drive** | APIs externas con credenciales sensibles |
| **Archivos core (OpenCode prohibido)** | `next.config.ts`, `tailwind.config.ts`, `middleware.ts`, `layout.tsx` de cualquier Route Group |

---

## Protocolo de Delegación

1. **Evaluar** si la tarea es delegable (ver tablas arriba).
2. **Seleccionar proveedor:** Usar `$$qwen3.5:cloud` por defecto. Para docs masivos usar `$$gemini-pro`.
3. **Invocar** la skill `cloud-ollama-delegator` con el prompt de tarea.
4. **Capturar** el output y validar la calidad.
5. **Verificar** código con `npx tsc --noEmit` + `npm run lint` (Ciclo Dry Run).
6. **Integrar** el resultado en el flujo de trabajo principal.
7. **Fallback:** `$$qwen3.5:cloud` → `$$groq-llama` → `$$gemini-pro` → `$$open-geminipro` → AntiGravity.
