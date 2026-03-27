---
name: performance-optimization
description: "Best practices para optimización de rendimiento (Core Web Vitals) en Next.js."
---

# Performance Optimization

Optimizaciones de bundle, re-rendering y estrategias de hidratación progresiva. Particular uso en la Fase 10.

REGLA DE AUDITORÍA DE SEGURIDAD:
Las imágenes no se sirven desde Firebase Storage (prohibido). Todo se hace mediante Next `next/image` y el CDN de Cloudinary.
