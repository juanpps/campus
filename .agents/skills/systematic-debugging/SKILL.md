---
name: systematic-debugging
description: "Protocolos y heurísticas de debug sistemático para resolver problemas en producción y entornos de desarrollo."
---

# Systematic Debugging

Guías y scripts automatizados para rastrear logs, verificar integraciones de Firebase SDK (Auth + Firestore), e identificar regresiones en Next.js.

REGLA DE AUDITORÍA DE SEGURIDAD:
El proyecto usa Firebase Spark. **NO APROVISIONAR, NO LEER, NI ESCRIBIR** en Firebase Storage, puesto que no fue autorizado en la facturación.
