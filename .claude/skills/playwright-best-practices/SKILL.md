---
name: playwright-best-practices-skill
description: Mejores prácticas y convenciones de codificación para testing E2E con Playwright.
---
# Playwright Best Practices
- Utilizar page object models (POM) para UI compleja.
- Aislar flujos críticos (Autenticación, Dashboards).
- NUNCA probar sobre bbdd de producción en Firebase, utilícese emuladores o mocks (msw).
- Todo PR Fase 06+ debe venir acompañado de test E2E.
