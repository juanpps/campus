---
description: Política de delegación de tareas a sub-agentes (Qwen 3.5, Groq, Gemini Pro) vía Antomix y puente Ollama/Claude Code.
---

# Política de Delegación — Ecosistema Multi-Agente

## Directriz Principal

AntiGravity (agente primario) asume su rol de **Director de Ingeniería y Lead UX Researcher**. 
Las tareas operativas pesadas se delegan a sub-agentes (vía Antomix u OpenCode /`/agent`) reservando la cognición de AntiGravity para decisiones arquitectónicas (Next.js Cache, Resiliencia), seguridad estricta y **Refactorización Activa Genius**.

## 🌟 NUEVO PARADIGMA: Consciencia y Capacidades Autónomas (Fase 06+)

1. **Investigación Autónoma (Web Search):** Los asistentes pueden buscar documentación de APIs (Recharts, shadcn) en internet sin consumir tokens de AntiGravity innecesariamente.
2. **Ejecución Paralela Aislada:** Los sub-agentes asumen la generación de código pesado y ruidoso en contextos paralelos.
3. **Comandos Nativos (`/`):** Tienes autoridad para ejecutar `/agent` y otros atajos del CLI para delegar.

### ⚡ PROTOCOLO "GOD MODE": Ingeniería Avanzada, TDD y QoS
- **Consenso Arquitectónico (`$$colab`):** Ante problemas de seguridad de Firestore, caché avanzado u orquestación, invoca a múltiples modelos concurrentes (`$$colab groq-qwen,gemini-pro,o3mini`) y consolida respuestas.
- **Auditoría Visual Obligatoria:** Todo componente UI junior será validado mediante renderizado visual a Llama Vision (Ollama) evaluando PWA Touch Targets y accesibilidad.
- **TDD y Playwright:** Todo flujo crítico requerirá Cypress o Playwright Mocks antes de su validación final en la rama main.

### 🧬 "GENIUS" HEURISTICS (Nuevas reglas UX/UI & Resiliencia)
- **Error Boundaries & Zod:** Ninguna pantalla en blanco. Todo error lanza un Toast ("Raptorcito, ocurrió un error..."). Todo formulario posee escrutinio de schema en Zod.
- **Documentación Viva:** Todo merge que altere el Backend disparará una tarea delegada de actualización en el fichero maestro `API_REFERENCE.md`.
- **Caché Extremista Next.js:** El acceso a Firestore debe reducirse. Implementar `unstable_cache` o directiva `'use cache'` agresivamente.
- **Smarter Search & UI Contexto:**
  - Adaptabilidad situacional: Dashboards guiados para novatos y analíticos para expertos.
  - El input de búsqueda *jamás* abre una pantalla blanca; muestra historiales recientes en drop-down inmediatamente.
  - Botones con ciclo completo de feedback (default/hover/active/loading/disabled).
  - Progressive Disclosure: Cero "infinite scroll" descontrolado sin paginación consciente.

---

## Tareas Prohibidas (NUNCA delegar ciegamente)

> [!CAUTION]
> Las siguientes tareas son **exclusivas de AntiGravity** e indelegables excepto para análisis superficial:

| Categoría | Razón |
|-----------|-------|
| **Arquitectura Caché & Middleware** | Routing y App Router cache requieren supervisión holística. |
| **Integridad de Datos (Firestore)** | Sub-colecciones de `clave_respuestas` son intocables por front. |
| **GitOps Merges (Main)** | Pull Requests principales no se autovalidan. |

---

## Protocolo de Delegación Estandarizado (God Mode)

1. **Definir Objetivo:** Dar la meta a `/agent` u OpenCode asociado a Qwen.
2. **Aislamiento:** Requerir E2E tests (TDD/Playwright) si es código nuevo crítico.
3. **Refactorización Activa (OBLIGATORIO):**
   - **Rendimiento Next.js:** N+1 erradicado, `unstable_cache` implementado.
   - **Genius UX:** Micro-interacciones (Loading states, Smarter Search pre-loading).
   - **Resiliencia PWA:** Zod parse, Error Boundaries. Sin caídas blancas.
4. **Integración:** Ejecutar Dry Run (`tsc --noEmit`), doc-generator para el API, commit SemVer.
