---
name: gws-calendar
description: "Sincronización bidireccional de eventos y clases en calendarios."
---

# Google Workspace Calendar API

Gestiona la sincronización del Calendario in-app de Método Raptor con Google Calendar para mantener notificados a los estudiantes.

REGLA DE AUDITORÍA DE SEGURIDAD:
El protocolo de arquitectura dicta **uso CERO** de Firebase Storage. Toda la media generada o anclada al calendario usará Drive o Cloudinary.
