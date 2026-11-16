# Demo interactiva v1

Abrir index.html con Live Server, o ejecutar desde esta carpeta:

    python -m http.server 5500 --bind 127.0.0.1

Abrir http://127.0.0.1:5500/. El servidor es estático y no simula Cloudflare ni las tareas de sincronización. Para probar envíos o administración sin escribir datos reales, sustituir el cliente de datos por un doble de prueba en el navegador.

## Base para recorridos futuros

Cada ficha identifica la galería con data-gallery. Cada foto tiene data-scene, data-photo-label, data-lightbox y data-thumb. Se pueden agrupar las fotos por sector, conservando esta galería como alternativa accesible.

- La Quinta: incorporar la foto aérea real, definir puntos con coordenadas normalizadas (0 a 1) sobre esa foto y vincular cada punto a una escena, por ejemplo pileta o quincho. Ofrecer también una lista navegable de sectores.
- Refugio Serrano: vincular escenas con fotos verificadas mediante un mapa de conexiones. Agregar cocina, balcón y otros espacios cuando haya material. Con movimiento reducido, abrir directamente el destino.
- Dos JPEG históricos de Refugio tienen nombres cruzados. Se conservaron sus URLs y se corrigió su uso: refugio-fachada-nueva.jpeg muestra el dormitorio principal y refugio-habitacion-matrimonial.jpeg muestra la fachada.

## Datos estructurados

El marcado usa el identificador estable refugio-serrano que ya usa el calendario, respeta la capacidad visible y apunta a ocho fotos reales, con dormitorio, baño y área común. Validar la URL pública en Google después de un despliegue autorizado.
