---
name: next-cache-components
description: Optimización extrema de React Server Components y App Router Cache.
---
# Next.js Cache Optimization
- Utilizar `unstable_cache` o la directiva `'use cache'` donde las lecturas repetitivas a Firestore constituyan un cuello de botella.
- Aplicar Revalidación basada en tags (`revalidateTag`) para granularidad.
