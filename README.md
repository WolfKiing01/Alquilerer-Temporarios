# 🏡 Alquileres Temporadas

Sitio web desarrollado para la promoción y gestión digital de dos propiedades familiares ubicadas en Córdoba, Argentina: **Refugio Serrano** y **La Quinta**.

El proyecto nació con el objetivo de centralizar la información de ambas propiedades, mostrar disponibilidad, facilitar el contacto con potenciales clientes y disponer de herramientas administrativas para gestionar reservas y consultas.

🌐 **Sitio en producción:**  
https://alquilerestemporadas.com.ar

---

## 🏠 Propiedades

### 🌲 Refugio Serrano

Alojamiento temporal ubicado en **Villa Icho Cruz / Tala Huasi, Córdoba**, a una cuadra del río.

El sitio permite consultar sus características, servicios, fotografías, videos, ubicación y disponibilidad por rango de fechas.

### 🌻 La Quinta

Espacio ubicado en **Villa Esquiú, Córdoba**, destinado principalmente a reuniones, encuentros familiares y eventos.

Cuenta con quincho, pileta climatizada, parque, juegos, estacionamiento privado y otros espacios recreativos.

La disponibilidad se administra por día.

---

## ✨ Funcionalidades principales

- 📱 Diseño responsive para celulares, tablets y escritorio.
- 🏡 Página independiente para cada propiedad.
- 🖼️ Galerías fotográficas interactivas.
- 🎥 Videos optimizados de las propiedades.
- 📅 Consulta de disponibilidad.
- 🔒 Panel administrativo privado.
- 🗓️ Gestión de fechas ocupadas.
- 👥 Registro de personas interesadas en promociones.
- 📊 Exportación de contactos a CSV.
- 💬 Integración directa con WhatsApp.
- 📍 Integración con Google Maps.
- 📷 Integración con redes sociales.
- 📝 Páginas de términos, privacidad y condiciones.
- 🔎 Optimización básica para motores de búsqueda.
- 🌐 Dominio personalizado.
- ☁️ Despliegue mediante Cloudflare.

---

## 🛠️ Tecnologías utilizadas

### Frontend

- HTML5
- CSS3
- JavaScript
- Diseño responsive

### Backend / Base de datos

- Supabase
- PostgreSQL
- Supabase Authentication
- Row Level Security (RLS)

### Infraestructura

- Cloudflare Workers / Static Assets
- Cloudflare DNS
- HTTPS
- Dominio `.com.ar`

### Control de versiones

- Git
- GitHub

---

## 📅 Sistema de disponibilidad

El sitio consulta las fechas almacenadas en Supabase para mostrar qué días se encuentran disponibles u ocupados.

Las propiedades utilizan lógicas diferentes:

**Refugio Serrano**
- Selección mediante rango de fechas.
- Estadías de varias noches.
- Manejo independiente del día de check-out.

**La Quinta**
- Reservas por día.
- Pensado para encuentros y eventos.

La disponibilidad puede modificarse desde el panel administrativo sin necesidad de editar el código ni volver a desplegar el sitio.

---

## 🔐 Panel administrativo

El proyecto cuenta con un panel administrativo independiente que permite gestionar información sin exponer estas herramientas en la navegación pública.

Entre sus funciones se encuentran:

- Inicio de sesión mediante Supabase Auth.
- Gestión de fechas ocupadas.
- Consulta de interesados registrados.
- Eliminación de registros.
- Exportación de contactos.
- Cierre de sesión seguro.

El acceso administrativo no depende únicamente de controles realizados en el frontend.

---

## 🛡️ Seguridad

La seguridad fue uno de los aspectos considerados durante el desarrollo del proyecto.

Se implementaron, entre otras medidas:

- Autenticación mediante Supabase.
- Políticas **Row Level Security (RLS)**.
- Separación entre permisos públicos y administrativos.
- Uso de una clave pública de cliente en el frontend.
- Ausencia de `service_role` y credenciales privadas en el repositorio.
- Restricción de operaciones administrativas desde la base de datos.
- HTTPS mediante Cloudflare.
- Encabezados HTTP de seguridad.
- Panel administrativo excluido de la indexación de buscadores.
- Validación del usuario autorizado para tareas administrativas.

> Las credenciales privadas, contraseñas y claves con privilegios elevados no forman parte del repositorio.

---

## 🔎 SEO

El proyecto incluye:

- `robots.txt`
- `sitemap.xml`
- Metadatos por página.
- Favicons.
- URLs específicas para cada propiedad.
- Datos estructurados.
- Integración con Google Search Console.
- Integración con Google Business Profile.
- Dominio canónico sin `www`.
- Redirección permanente `www → dominio principal`.

---

## 📂 Estructura general

```text
/
├── assets/
├── index.html
├── refugio-serrano.html
├── la-quinta.html
├── disponibilidad.html
├── quienes-somos.html
├── admin.html
├── terminos.html
├── privacidad.html
├── contrato-refugio.html
├── acuerdo-la-quinta.html
├── styles.css
├── app.js
├── availability.js
├── admin.js
├── supabase-config.js
├── robots.txt
├── sitemap.xml
└── _headers
```

---

## 🌐 Producción

La aplicación se encuentra desplegada públicamente en:

### 👉 https://alquilerestemporadas.com.ar

La infraestructura utiliza **Cloudflare** para DNS, HTTPS y publicación del sitio, mientras que **Supabase** proporciona base de datos y autenticación.

---

## 🎯 Objetivo del proyecto

Además de resolver una necesidad real de un emprendimiento familiar, este proyecto fue desarrollado como experiencia práctica en:

- Desarrollo web.
- Gestión de bases de datos.
- Autenticación.
- Seguridad de aplicaciones.
- Control de acceso.
- Cloud computing.
- DNS y dominios.
- Despliegue web.
- SEO.
- Git y GitHub.

El proyecto continuará evolucionando con nuevas fotografías, mejoras de contenido y nuevas funcionalidades.

---

## 👨‍💻 Autor

**Lautaro Suárez**

Estudiante de **Licenciatura en Seguridad Informática**.

Interesado en ciberseguridad, desarrollo, automatización, administración de sistemas e implementación de soluciones tecnológicas.

GitHub:  
https://github.com/WolfKiing01

---

## 📄 Estado

**Versión actual: V5.3**

Proyecto funcional y desplegado en producción.