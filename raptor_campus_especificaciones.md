# ESPECIFICACIONES DEL PROYECTO
## Campus Online · Método Raptor PREICFES
### Documento de referencia para NotebookLM — Fuente principal del proyecto

---

## 1. DESCRIPCIÓN GENERAL DEL PROYECTO

**Nombre:** Campus Online Método Raptor PREICFES
**Cliente:** Método Raptor — organización colombiana especializada en la preparación de estudiantes para la Prueba de Estado ICFES (Instituto Colombiano para la Evaluación de la Educación).
**Tipo de aplicación:** Progressive Web App (PWA) — funciona como app nativa tanto en PC como en móvil.
**Propósito:** Plataforma educativa digital completa que centraliza clases grabadas, materiales, simulacros, comunicados, calendario y gestión académica para estudiantes que se preparan para el ICFES bajo la metodología Raptor.
**Audiencia principal:** Estudiantes colombianos de grado 10 y 11, entre 15 y 18 años.
**Audiencia secundaria:** Tutores y administradores de Método Raptor.

---

## 2. IDENTIDAD Y LENGUAJE DE MARCA

- La plataforma nunca firma como "Admin" — siempre como **Raptor**.
- Los estudiantes son llamados **Raptorcitos** (masculino) y **Raptorcitas** (femenino).
- El tono de comunicación es cercano, motivador y juvenil, coherente con la audiencia objetivo.
- Los tutores firman con su nombre real en sus comunicados y materiales.

---

## 3. STACK TECNOLÓGICO

| Componente | Tecnología |
|---|---|
| Framework frontend | Next.js |
| Hosting | Vercel |
| Autenticación | Firebase Authentication (Google Sign In) |
| Base de datos | Firebase Firestore (plan gratuito Spark) |
| Notificaciones push | Firebase Cloud Messaging (FCM) |
| Almacenamiento de media | Cloudinary (imágenes, banners, thumbnails) |
| Archivos y documentos | Google Drive (PDFs, diapositivas, recursos) |
| Videos de clases | YouTube privados o Google Drive — reproducidos internamente |
| Clases en vivo | Google Meet |
| Tipo de app | PWA (Progressive Web App) |

### Consideraciones Firebase plan gratuito:
- El storage de Firebase NO se usa. Todo archivo va a Cloudinary o Drive.
- Los anuncios y comunicados tienen TTL (tiempo de vida) configurable — por defecto 24 horas. Se eliminan automáticamente de Firestore al vencer.
- Firebase se usa exclusivamente para: autenticación, base de datos en tiempo real y notificaciones push (FCM).
- Los videos, PDFs y archivos pesados viven en Cloudinary o Drive para no consumir cuota de Firestore.

---

## 4. DISEÑO PWA — EXPERIENCIA POR DISPOSITIVO

La plataforma es una PWA que se adapta profundamente a cada plataforma. No es simplemente responsive — es una experiencia optimizada y diferenciada:

- **PC:** Aprovecha el espacio horizontal. Navegación tipo sidebar fija. Layouts de múltiples columnas. Interfaz más densa y rica en información. Se siente como plataforma web premium.
- **Móvil:** Navegación tipo bottom navigation bar o drawer lateral. Layouts verticales. Interacciones táctiles nativas. Se siente como app instalada desde la tienda.
- **Regla fundamental:** Mismas funcionalidades y flujos en ambas plataformas. Solo cambia la organización, navegación y disposición visual.
- **Objetivo:** Que en cada dispositivo parezca que fue diseñado exclusivamente para ese sistema.

---

## 5. SISTEMA DE ROLES

La plataforma tiene 4 roles con paneles y accesos completamente distintos. El rol se asigna en Firebase y determina toda la experiencia del usuario.

---

### ROL 1 — ESTUDIANTE

#### Onboarding
- El admin genera un **link de acceso de único uso** para cada estudiante.
- El estudiante entra al link, inicia sesión con **Google Sign In**, completa un formulario de información adicional (nombre completo, grado, etc.).
- Al completar el registro, el link **expira automáticamente** y no puede volver a usarse.
- Se le asigna un **user_id único** que lo identifica en toda la plataforma y contiene toda su información académica.

#### Panel del estudiante — Vistas

**1. Dashboard Principal (Home)**
- Mensaje de bienvenida personalizado con el nombre del estudiante.
- Recuadro de motivación (frase o mensaje configurable por Raptor desde el panel admin).
- Contador regresivo de días y horas para la fecha del ICFES (configurable por admin).
- Progreso general en mini simulacros completados.
- Comunicados y anuncios recientes de Raptor y tutores.
- Próximos eventos del calendario.
- Actividades y talleres pendientes.
- Racha de días consecutivos conectado a la plataforma.
- Última clase vista con botón "Continuar".
- Porcentaje de avance por materia.

**2. Materias**
El campus tiene **6 materias en total**:
- Las 5 áreas del ICFES: Matemáticas, Lectura Crítica, Ciencias Naturales, Ciencias Sociales, Inglés.
- Psicología (materia especial — ver sección 5.1).

Todos los estudiantes de una cohorte ven las mismas 6 materias.

Cada una de las 5 materias ICFES contiene:
- **Banner tipo YouTube** en la parte superior (imagen de portada de la materia, subida a Cloudinary).
- **Presentación del tutor o tutores** asignados (varios tutores pueden dar la misma materia).
- **Clases grabadas:** tarjetas con miniatura y título estilo YouTube. Los videos son links de YouTube privados o Google Drive, reproducidos dentro de la plataforma mediante reproductor interno (sin salir de la app). El estudiante puede marcar cada clase como vista.
- **Indicador de clase nueva** cuando el tutor sube contenido reciente.
- **Comunicados y anuncios del tutor** de esa materia (con TTL configurable).
- **Actividades y talleres:** links externos. Se muestran como tarjetas con nombre, descripción y botón de acceso.
- **Mini simulacros:** ver sección 6.
- **Recursos del área:** archivos, anotaciones del maestro, diapositivas, PDFs, videos adicionales. Se visualizan dentro de la plataforma mediante visor embebido.

**3. Calendario**
- Vista mensual y semanal.
- Código de color por materia y por tipo de evento.
- Leyenda siempre visible para identificar qué color corresponde a qué materia o tipo.
- Admin (Raptor) crea eventos generales visibles para todos.
- Tutores crean eventos de su materia visibles para todos los estudiantes.
- Sincronización opcional con Google Calendar del estudiante (se activa desde configuración).
- Recordatorio automático antes de cada evento vía notificación push.

**4. Muro de Anuncios**
- Vista detallada de todos los comunicados y anuncios activos.
- Diferenciados visualmente entre anuncios de Raptor y anuncios de tutores por materia.
- Leyenda clara para identificar el origen de cada anuncio.

**5. Apps Externas**
- Sección de accesos directos a aplicaciones externas desarrolladas por el equipo Raptor.
- Se muestran como tarjetas o iconos con nombre y descripción.
- Son links simples, sin autenticación cruzada.
- El admin gestiona qué apps aparecen y en qué orden.

**6. Configuración y Perfil**
- Foto de perfil, nombre, información personal.
- Preferencias de notificaciones (el estudiante elige qué recibir).
- Activar/desactivar sincronización con Google Calendar.
- Modo oscuro / modo claro.
- Historial de simulacros presentados y puntajes.
- Onboarding guiado la primera vez que entra a la plataforma.

---

### 5.1 MATERIA ESPECIAL — PSICOLOGÍA

La materia de Psicología tiene una estructura diferente a las 5 materias ICFES:
- Funciona como un **blog de contenido** relacionado con psicología aplicada al ICFES.
- Tiene entradas de blog con texto, imágenes y recursos adjuntos.
- No tiene clases grabadas en formato video ni mini simulacros.
- El contenido lo gestiona el tutor o admin asignado a esta materia.

---

### ROL 2 — TUTOR

#### Asignación
- El admin asigna el tutor introduciendo su correo de Google en el panel.
- Al iniciar sesión con ese correo, Firebase le asigna automáticamente el rol de tutor con la materia designada.
- Un tutor puede tener una o más materias asignadas.

#### Panel del tutor — Vistas

**1. Dashboard Principal**
- Bienvenida personalizada con nombre del tutor.
- Timeline de próximas clases programadas.
- Botones de acción rápida: subir clase grabada, subir material, publicar anuncio, crear mini simulacro, agregar actividad/taller.
- Todos los accesos rápidos aplican exclusivamente a la materia del tutor.

**2. Biblioteca de Clases Grabadas**
- Lista de todas las clases subidas a su materia.
- Cada clase: título, thumbnail, fecha de publicación, número de visualizaciones.
- Analytics básico: qué estudiantes vieron cada clase y cuándo.
- Opciones: editar, eliminar, agregar nueva clase.

**3. Biblioteca de Material y Recursos**
- Lista de todos los archivos, PDFs, diapositivas y recursos publicados.
- Opciones: editar, eliminar, agregar nuevo material.

**4. Mini Simulacros**
- El tutor crea y gestiona los mini simulacros de su materia.
- Al crear un simulacro define los siguientes parámetros:
  - Título del simulacro.
  - Número de preguntas (el tutor define cuántas).
  - Link al PDF con el contenido y las preguntas (alojado en Drive).
  - Clave de respuestas correctas por cada pregunta (A/B/C/D) — almacenada de forma privada, solo accesible para el sistema y el tutor.
  - Fecha de disponibilidad para los estudiantes.
  - Fecha límite de entrega (opcional).
  - Tiempo límite para completarlo en minutos (opcional).
  - Si se muestran o no las respuestas incorrectas al finalizar (configurable).
  - Si permite reintentos (configurable).
- El tutor puede ver los resultados completos de cada estudiante.

**5. Anuncios Activos**
- Lista de comunicados publicados en su materia.
- Puede crear, editar o eliminar anuncios.
- Configura el TTL de cada anuncio al publicarlo.

**6. Calendario**
- Vista del calendario general de la plataforma.
- Puede crear eventos de su materia con fecha, hora, descripción y tipo.
- Los eventos se muestran a los estudiantes con el color de su materia.

**7. Mis Estudiantes**
- Lista de todos los estudiantes de la plataforma.
- El tutor ve métricas de su materia por estudiante: clases vistas, simulacros completados, puntajes obtenidos, actividades entregadas.
- No puede ver información de otras materias.

---

### ROL 3 — ADMIN (firma como RAPTOR)

#### Panel del admin — Vistas

**1. Dashboard Principal**
- Bienvenida al administrador.
- Resumen general: total de estudiantes activos, tutores asignados, materias activas.
- Estadísticas básicas de uso de la plataforma.
- Botones de acción rápida: agregar estudiante, asignar tutor, publicar anuncio general, crear evento, agregar app externa.

**2. Gestión de Estudiantes**
- Lista completa de todos los estudiantes registrados con su estado.
- Acciones por estudiante: ver perfil completo, banear, congelar (suspender temporalmente), reactivar, eliminar.
- Generar links de acceso de único uso para nuevos estudiantes.
- Exportar lista de estudiantes a CSV/Excel.
- Ver historial académico básico de cada estudiante.

**3. Gestión de Tutores**
- Lista de todos los tutores registrados.
- Ver por tutor: materia asignada, clases subidas, materiales publicados, anuncios activos.
- Acciones: agregar tutor por correo, cambiar materia asignada, bloquear, eliminar.
- Ver clases programadas y clases dadas por cada tutor.

**4. Anuncios y Eventos**
- Crear, editar y eliminar anuncios generales firmados como Raptor.
- Crear, editar y eliminar eventos generales del calendario.
- Configurar TTL de cada anuncio.
- Ver todos los anuncios activos de la plataforma (propios y de tutores).

**5. Configuración de la Plataforma**
- **Banners modales:** configurar banners que aparecen al entrar a la plataforma para anuncios especiales, promociones o novedades. Activar/desactivar cuando se requiera.
- **Modo mantenimiento:** poner la plataforma en mantenimiento con mensaje personalizado. Durante el mantenimiento solo el super admin puede acceder.
- **Gestión de cohortes:**
  - Iniciar nueva cohorte: elimina la información académica de la cohorte anterior (clases, materiales, simulacros, resultados, anuncios) y deja la plataforma lista para el nuevo ciclo.
  - Los perfiles de estudiantes se pueden conservar o eliminar según configuración.
  - Operación con confirmación doble por ser destructiva.
- **Registro de actualizaciones:** el admin ve el historial de cambios y actualizaciones realizadas a la plataforma por el super admin.
- **Apps externas:** agregar, editar, reordenar o eliminar los accesos directos visibles para los estudiantes.
- **Fecha del ICFES:** configurar la fecha objetivo para el contador regresivo del dashboard del estudiante.
- **Frase motivacional:** configurar el mensaje del recuadro de motivación del dashboard del estudiante.

---

### ROL 4 — SUPER ADMIN (oculto — desarrollador)

- Accede con el mismo flujo de Google Sign In que los demás roles.
- El rol `superadmin` se asigna manualmente en Firebase — no hay interfaz de asignación.
- Su panel no es visible ni accesible para ningún otro rol.
- Funciones principales:
  - Gestionar cuentas admin: crear, modificar, revocar acceso.
  - Control total del modo mantenimiento.
  - Publicar registros de actualizaciones visibles para el admin.
  - Acceso de emergencia a cualquier sección de la plataforma.
  - Gestión técnica de configuración global de la plataforma.

---

## 6. MINI SIMULACROS — ESPECIFICACIONES DETALLADAS

### Creación (exclusiva del tutor de la materia correspondiente)
El tutor define al crear cada simulacro:
- Título del simulacro.
- Número de preguntas (él define cuántas).
- Link al PDF con el contenido de las preguntas (alojado en Drive).
- Clave de respuestas correctas por pregunta (A/B/C/D) — nunca visible para el estudiante.
- Fecha de disponibilidad para estudiantes.
- Fecha límite de entrega (opcional).
- Tiempo límite para completarlo en minutos (opcional).
- Si permite reintentos (configurable).
- Si muestra cuáles respuestas fueron incorrectas al finalizar (configurable).

### Experiencia del estudiante
- El estudiante ve el simulacro disponible en su materia con su estado (disponible, pendiente, completado).
- Al entrar, elige su modo de visualización:
  - **Vista dividida:** PDF a la izquierda, formulario de respuestas a la derecha.
  - **Formulario superpuesto:** formulario flotante y movible sobre el PDF.
- El formulario muestra cada pregunta numerada con opciones A, B, C, D para marcar.
- Al finalizar y enviar, el sistema calcula automáticamente el puntaje comparando con la clave del tutor.
- El estudiante ve su resultado inmediatamente: puntaje total y (si el tutor lo configuró) cuáles respuestas fueron incorrectas.
- El sistema **nunca envía la clave de respuestas al cliente** — el cálculo ocurre en el servidor.
- Una vez enviado, no se puede volver a presentar (salvo que el tutor lo configure diferente).

### Seguridad crítica
- Las claves de respuestas se almacenan en Firestore con reglas de acceso que solo permiten leerlas desde el servidor (Next.js API routes).
- Nunca se exponen en el cliente bajo ninguna circunstancia.

### Resultados
- El tutor ve los resultados completos de todos los estudiantes en su panel.
- El admin ve estadísticas generales de simulacros por materia.
- El estudiante ve su historial de simulacros presentados y puntajes en su perfil.

---

## 7. SISTEMA DE NOTIFICACIONES

### Tecnología
Firebase Cloud Messaging (FCM) — notificaciones push que llegan aunque la app esté cerrada o el dispositivo en reposo.

### Tipos de notificaciones

| Evento | Destinatario | Ejemplo de mensaje |
|---|---|---|
| Clase nueva subida | Estudiantes de esa materia | "Raptorcito, [Tutor] subió una nueva clase de Matemáticas 🦅" |
| Material nuevo subido | Estudiantes de esa materia | "Hay nuevo material en Ciencias Naturales, revísalo 📚" |
| Anuncio nuevo de Raptor | Todos los estudiantes | "Raptor tiene un comunicado importante para ti 📢" |
| Anuncio nuevo de tutor | Estudiantes de esa materia | "[Tutor] publicó un anuncio en Inglés" |
| Evento próximo | Según tipo de evento | "En 15 minutos tienes clase, Raptorcito 🦅" |
| Simulacro disponible | Estudiantes de esa materia | "Ya puedes presentar el simulacro de Lectura Crítica" |
| Actividad pendiente | Estudiantes con tarea sin entregar | "Tienes una actividad pendiente en Sociales, no te quedes atrás" |
| Recordatorio de evento | Según tipo de evento | Configurable: 15 min, 1 hora o 1 día antes |
| Notificación manual admin | Todos los estudiantes | Mensaje personalizado desde el panel admin |

### Configuración
- El estudiante puede personalizar qué tipos de notificaciones recibe desde su configuración.
- Las notificaciones en tiempo real también aparecen dentro de la app (in-app) cuando el estudiante está conectado.
- El admin puede enviar notificaciones manuales a todos los estudiantes desde su panel.

---

## 8. CALENDARIO — ESPECIFICACIONES

- **Vistas disponibles:** mensual y semanal.
- **Creadores de eventos:**
  - Admin (Raptor): eventos generales visibles para toda la plataforma.
  - Tutores: eventos de su materia, visibles para todos los estudiantes.
- **Código de colores:** cada materia tiene un color asignado. Los eventos generales de Raptor tienen su propio color diferenciado. Leyenda siempre visible en la interfaz.
- **Sincronización:** el estudiante puede sincronizar el calendario con su Google Calendar personal — opcional, se activa desde configuración de perfil.
- **Recordatorios automáticos:** cada evento genera notificaciones push automáticas. El tiempo de anticipación lo configura quien crea el evento.

---

## 9. ESTRUCTURA DE DATOS — FIRESTORE (referencia general)

```
/usuarios/{user_id}
  - nombre
  - correo
  - rol (estudiante | tutor | admin | superadmin)
  - foto_perfil (URL Cloudinary)
  - materia_asignada[] (array — solo tutores, pueden tener varias)
  - fecha_registro
  - estado (activo | congelado | baneado)
  - cohorte_id
  - fcm_token (para notificaciones push)

/materias/{materia_id}
  - nombre
  - tipo (icfes | especial)
  - banner_url (Cloudinary)
  - tutores[] (array de user_id)
  - color_calendario

/clases/{clase_id}
  - materia_id
  - titulo
  - thumbnail_url (Cloudinary)
  - video_url (YouTube privado o Drive)
  - tutor_id
  - fecha_publicacion
  - vistas[] (array de user_id que la vieron)

/simulacros/{simulacro_id}
  - materia_id
  - tutor_id
  - titulo
  - num_preguntas
  - pdf_url (Drive)
  - clave_respuestas[] (PRIVADO — solo accesible desde servidor)
  - fecha_disponible
  - fecha_limite (opcional)
  - tiempo_limite_minutos (opcional)
  - mostrar_respuestas_incorrectas (boolean)
  - permite_reintentos (boolean)

/resultados_simulacro/{resultado_id}
  - simulacro_id
  - estudiante_id
  - respuestas[]
  - puntaje
  - fecha_presentacion

/anuncios/{anuncio_id}
  - autor_id
  - tipo (raptor | tutor)
  - materia_id (null si es general)
  - contenido
  - fecha_publicacion
  - fecha_expiracion (TTL — default 24h)

/eventos/{evento_id}
  - titulo
  - descripcion
  - fecha_inicio
  - fecha_fin
  - tipo (general | materia)
  - materia_id (null si es general)
  - creador_id
  - recordatorio_minutos_antes

/links_acceso/{link_id}
  - token (único, de un solo uso)
  - usado (boolean)
  - fecha_expiracion
  - cohorte_id

/cohortes/{cohorte_id}
  - nombre
  - fecha_inicio
  - fecha_icfes
  - activa (boolean)

/config/{config_id}
  - fecha_icfes
  - frase_motivacional
  - modo_mantenimiento (boolean)
  - mensaje_mantenimiento
  - banner_modal_activo (boolean)
  - banner_modal_url (Cloudinary)
  - apps_externas[] (array de {nombre, descripcion, url, icono_url, orden})
```

---

## 10. CONSIDERACIONES TÉCNICAS Y DE SEGURIDAD

- **Claves de simulacros:** nunca se envían al cliente. El cálculo del puntaje ocurre exclusivamente en el servidor mediante Next.js API routes. Las reglas de Firestore bloquean el acceso directo del cliente a `clave_respuestas`.
- **Videos privados de YouTube:** embebidos mediante iframe. El usuario no puede acceder a la URL directa de YouTube.
- **PDFs de Drive:** visualizados mediante Google Docs Viewer embebido o iframe de Drive con permisos de solo lectura. No se descarga el archivo directamente.
- **Links de acceso único:** se marcan como `usado: true` en Firestore inmediatamente después del primer uso exitoso y no pueden reutilizarse.
- **Modo mantenimiento:** redirige a todos los roles excepto superadmin a una página de mantenimiento con mensaje personalizado.
- **Eliminación de cohorte:** operación destructiva que requiere confirmación doble. Elimina clases, materiales, simulacros, resultados y anuncios de la cohorte anterior. Los perfiles de usuario se archivan o eliminan según configuración del admin antes de ejecutar.
- **TTL de anuncios:** se implementa mediante una Cloud Function o proceso programado que elimina documentos de Firestore cuya `fecha_expiracion` ya pasó.

---

## 11. SECCIONES PENDIENTES DE DEFINIR

Las siguientes áreas están abiertas para definición en fases posteriores del proyecto:
- Gamificación adicional del dashboard del estudiante (insignias, logros, ranking).
- Sección de soporte o preguntas frecuentes para estudiantes.
- Posible integración con herramientas de videoconferencia distintas a Meet.
- Vistas adicionales del panel de estudiante que el cliente defina durante el desarrollo.

*Estas se incorporarán al documento conforme avance el proyecto.*

---

*Documento de especificaciones — Campus Online Raptor PREICFES*
*Versión 1.0 — Base completa del sistema*
*Este documento debe subirse como fuente principal en NotebookLM junto con el Super Prompt del proyecto.*
