# fitness-web

Frontend de **App Fitness**, una aplicación para registrar actividad física con el gimnasio como sección principal.

La API vive en otro repositorio: **fitness-api**.

## Tecnologías

- **React 19** + **Vite 8**
- **React Router** para la navegación
- **TanStack Query** para pedir y guardar en caché los datos del servidor
- **Motion** para las animaciones
- **Lucide** para los íconos
- **Archivo** (variable, servida desde el propio proyecto con Fontsource)
- **CSS Modules** para los estilos de cada componente
- **Oxlint** para revisar el código

## Requisitos

- Node.js 24 (`node --version`)
- La API (`fitness-api`) corriendo en `http://localhost:3000`

## Puesta en marcha

```bash
npm install
cp .env.example .env   # en PowerShell: Copy-Item .env.example .env
npm run dev
```

Abre http://localhost:5173.

## Scripts

| Comando           | Qué hace                                         |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Servidor de desarrollo con recarga instantánea   |
| `npm run build`   | Compila la app para producción en `dist/`        |
| `npm run preview` | Sirve localmente la versión compilada            |
| `npm run lint`    | Revisa el código con Oxlint                      |

## Variables de entorno

| Variable       | Valor         | Descripción                   |
| -------------- | ------------- | ----------------------------- |
| `VITE_API_URL` | `/api/v1`     | URL base de la API (relativa) |

Las variables que empiezan por `VITE_` se incluyen en el código que descarga el navegador, así que **nunca** deben contener secretos.

## Cómo se conecta con la API

El frontend siempre llama a `/api/v1/...` en **su propio dominio**:

- **En desarrollo**, el proxy de Vite (`vite.config.js`) reenvía `/api` a `http://localhost:3000`.
- **En producción**, un rewrite de Vercel hará lo mismo hacia el dominio de fitness-api (Fase 10).

Así el navegador ve un solo sitio y la cookie de sesión (`httpOnly`) funciona en todos los navegadores, incluido Safari en iPhone. El código nunca toca el token: la cookie viaja sola en cada petición.

## Sistema de diseño

Modo claro, luminoso y deportivo, con **vidrio** (transparencia y desenfoque) sobre un **fondo de color en movimiento**. Todo parte de los tokens.

- **Tokens** (`src/styles/tokens.css`): paleta, roles de color, vidrio, tipografía, espacios, radios y movimiento. Cambiar la paleta es cambiar ese archivo.
- **Contraste.** Los colores vivos solo llegan a 1.5–3.3:1 sobre el fondo, así que se usan para fondos, íconos y gráficas. Para texto se usa su variante `-strong` (≥ 4.8:1). La tinta sí se lee sobre cualquier color vivo (≥ 4.9:1). Sobre el fondo animado, el texto va siempre en `--text`.
- **Tipografía.** Archivo: títulos con ancho moderadamente expandido (`font-stretch: 110%`) y peso 800, texto en ancho normal. Los números usan la clase `num` (cifras tabulares).
- **Vidrio.** `GlassCard`: blanco al 60 %, `blur(18px) saturate(160%)`, borde blanco fino y sombra teñida de fucsia, con fondo casi opaco si el navegador no soporta `backdrop-filter`. No se anidan capas desenfocadas.
- **Fondo animado.** `AnimatedBackground`: 4 manchas con degradado radial (sin `filter: blur`, más liviano en el celular) que solo animan `transform`.
- **Movimiento.** Fundido rápido al cambiar de pestaña, tarjetas que aparecen escalonadas (`Stagger`/`Reveal`), píldora de la pestaña activa que se desliza (Motion `layoutId`) y panel que sube desde abajo.
- **Reducir movimiento.** Si el sistema lo pide, `MotionConfig reducedMotion="user"` quita los desplazamientos y `base.css` detiene las animaciones CSS, incluido el fondo.

**Componentes** (`src/components/`): `AnimatedBackground`, `GlassCard`, `Button`, `Field`, `SegmentedControl`, `Switch`, `Alert`, `Badge`, `Chip`, `Avatar`, `Logo`, `PageHeader`, `EmptyState`, `Sheet` (panel modal con `<dialog>` nativo), `Stagger`/`Reveal` y `PageMessage`. `icons.js` traduce los nombres de ícono que guarda la API a íconos de Lucide, incluido un ícono propio de patines.

**Guía de estilos:** en desarrollo, abre http://localhost:5173/estilos para ver colores, tipografía y componentes juntos. Esa ruta no se incluye en la versión de producción.

## Navegación

- **Celular:** encabezado con la marca y tu inicial (abre el Perfil), y barra inferior de vidrio con **Hoy · Rutinas · [+] · Historial · Progreso**. El "+" abre "¿Qué vas a registrar?".
- **Computador (≥ 768 px):** barra lateral con la marca, el botón "Registrar", las pestañas y el acceso al perfil.
- Las pestañas se definen en `src/app/layout/navigation.js`. El "+" siempre queda en el centro, así que agregar **Alimentación** es sumar un elemento a esa lista.

## Rutas

| Ruta         | Acceso     | Pantalla                                              |
| ------------ | ---------- | ----------------------------------------------------- |
| `/ingresar`  | Sin sesión | Inicio de sesión                                      |
| `/registro`  | Sin sesión | Crear cuenta (envía la zona horaria del dispositivo)  |
| `/`          | Con sesión | Hoy: saludo, resumen del día y lo planeado            |
| `/rutinas`   | Con sesión | Rutinas y plan semanal (vacía hasta la Fase 4)        |
| `/historial` | Con sesión | Calendario (vacía hasta la Fase 7)                    |
| `/progreso`  | Con sesión | Estadísticas y récords (vacía hasta la Fase 8)        |
| `/perfil`    | Con sesión | Nombre, preferencias, contraseña y cerrar sesión      |
| `/estado`    | Pública    | Estado de frontend, API y base de datos               |
| `/estilos`   | Desarrollo | Guía de estilos                                       |

`RequireAuth` envía a `/ingresar` si no hay sesión y recuerda a dónde querías ir. `GuestOnly` saca de `/ingresar` y `/registro` a quien ya inició sesión. Si cualquier petición responde `401` (sesión vencida), la app lo detecta en `app/queryClient.js` y vuelve a pedir inicio de sesión.

## Estructura

```
src/
├── main.jsx          # Punto de entrada: fuente, tokens, proveedores y fondo animado
├── app/
│   ├── layout/       # Estructura con navegación: barra inferior, lateral, encabezado y panel "+"
│   ├── router.js     # Rutas
│   └── queryClient.js
├── components/       # Sistema de diseño: componentes reutilizables con su .module.css
├── features/         # Una carpeta por funcionalidad
│   ├── activities/   # Tipos de actividad
│   ├── auth/         # Sesión, guardas de rutas, inicio de sesión y registro
│   ├── history/      # Historial
│   ├── profile/      # Perfil y preferencias
│   ├── progress/     # Progreso
│   ├── routines/     # Rutinas
│   ├── status/       # Estado de la conexión
│   ├── styleguide/   # Guía de estilos (solo desarrollo)
│   └── today/        # Hoy
├── lib/              # Cliente HTTP, fechas, opciones de /meta y utilidades
└── styles/           # tokens.css y base.css (globales)
```

Organizar por **funcionalidad** (y no por tipo de archivo) mantiene juntos los componentes, hooks y llamadas a la API de cada sección. Con **CSS Modules**, cada `.module.css` genera nombres de clase únicos: los estilos de un componente nunca afectan a otro, por mucho que crezca la app.
