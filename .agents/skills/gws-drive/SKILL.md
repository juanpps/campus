---
name: gws-drive
description: "Integración de Google Workspace Drive para visores de simulacros en formato PDF."
---

# Google Workspace Drive API

Gestiona la integración y lectura de archivos PDF alojados en Google Drive para la plataforma web de Método Raptor.

## Funciones Clave
- Obtención de URLs de visualización (embed) de Drive.
- Gestión de permisos para asegurarse que los documentos solo sean legibles pero no descargables libremente.

REGLA DE AUDITORÍA DE SEGURIDAD:
**Bajo ninguna circunstancia** se debe guardar o subir documentos base de simulacros a Firebase Storage. La orden arquitectónica es usar exclusivamente Google Drive.
