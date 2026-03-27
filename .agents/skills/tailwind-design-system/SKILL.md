---
name: tailwind-design-system
description: "Directrices para construir y mantener el sistema de diseño basado en Tailwind v4 para el Campus Raptor."
---

# Tailwind Design System

Esta skill proporciona las bases para garantizar consistencia visual en toda la PWA de Método Raptor usando Tailwind CSS.

## Directrices
1. Utilizar unicamente variables semánticas de color definidas en `globals.css` (ej. `--raptor-orange`).
2. Mantener la configuración orientada a utility-classes.
3. No utilizar estilos inline. Todo se orquesta por Tailwind.

REGLA DE AUDITORÍA DE SEGURIDAD:
**Bajo ninguna circunstancia** se debe instruir o escribir código que utilice Firebase Storage para alojar imágenes del sistema de diseño. Todo asset estático va en `/public`, y toda imagen dinámica usa Cloudinary.
