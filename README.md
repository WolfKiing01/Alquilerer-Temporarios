# Alquileres Temporales – V4 (Supabase)

Esta versión reemplaza el calendario y los registros guardados en `localStorage` por la base online de Supabase.

## Qué ya funciona

- Calendario público conectado a `blocked_dates`.
- Refugio Serrano: estadías por ingreso/salida; el día de salida no se bloquea.
- La Quinta: reservas por una jornada puntual.
- Reserva existente de Refugio Serrano: ingreso 18/01/2027, salida 24/01/2027 (noches 18 al 23 ocupadas, cargadas en Supabase mediante el SQL inicial).
- Formulario de promociones conectado a `leads`.
- Los visitantes no crean usuarios.
- `admin.html` usa Email + Contraseña de Supabase Auth.
- Las políticas RLS restringen la administración al UID configurado.
- Admin permite bloquear/liberar fechas, ver contactos, eliminar registros y exportar CSV.
- Galerías con flechas, teclado y contador.
- Videos reales de Refugio en versión horizontal y vertical.
- Contactos oficiales: WhatsApp, Gmail, Instagram y Facebook.

## Cómo probar

1. Abrí la carpeta completa en VS Code.
2. `index.html` > Open with Live Server.
3. Probá `disponibilidad.html`.
4. Abrí `admin.html` directamente desde la misma URL del Live Server.
5. Iniciá sesión con el usuario que creaste en Supabase.
6. Marcá una fecha ocupada.
7. Abrí la web en otro navegador/dispositivo y comprobá que la fecha aparezca ocupada.

## Importante

La Publishable Key de Supabase está en `supabase-config.js`. Es normal que sea visible en una web pública. La seguridad depende de RLS. Nunca agregues una `service_role`, secret key ni contraseña de base de datos a estos archivos.

La imagen principal del home carga desde Wikimedia Commons y requiere internet. Foto: Argeneditor, CC BY 4.0.


## V4.1
- Corregido el calendario que quedaba mostrando `Cargando disponibilidad…` aunque Supabase respondiera correctamente.
- Mejorado el contraste visual del logotipo y textos de La Quinta sobre fondos fotográficos.
