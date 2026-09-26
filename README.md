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

**Componentes** (`src/components/`):
- **Estructura y superficies:** `AnimatedBackground`, `GlassCard`, `PageHeader`, `BackLink`, `EmptyState`, `PageMessage`, `Stagger`/`Reveal`.
- **Botones:** `Button` (primary, secondary, ghost, danger), `IconButton`.
- **Formularios:** `Field` (input, select, textarea), `SearchField`, `SegmentedControl`, `ChoiceChips` (una o varias opciones), `NumberStepper` (− número +), `Switch`.
- **Mensajes y etiquetas:** `Alert` (error, éxito, aviso), `Badge`, `Chip`, `Avatar`, `Logo`.
- **Paneles:** `Sheet` (modal con `<dialog>` nativo, con pie fijo opcional), `ActionSheet` (menú de acciones) y `ConfirmSheet` (confirmación).
- **Íconos:** `icons.js` traduce los nombres que guarda la API a íconos de Lucide (incluido uno propio de patines) e `IconByName` los dibuja.

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
| `/`          | Con sesión | Hoy: saludo, resumen del día, lo planeado (con aviso de piernas) y lo que ya registraste |
| `/rutinas`   | Con sesión | Plan semanal, grupos con sus rutinas y rutinas archivadas |
| `/rutinas/nueva` | Con sesión | Crear rutina (`?grupo=<id>` elige el grupo)       |
| `/rutinas/:routineId` | Con sesión | Editar rutina                                |
| `/rutinas/plan` | Con sesión | Editar el plan semanal (se guarda al instante)     |
| `/sesion`    | Con sesión | Sesión de gimnasio en curso (`?rutina=<id>` la empieza desde una rutina; `?nueva=1`, desde cero) |
| `/sesion/:sessionId/resumen` | Con sesión | Resumen y celebración al terminar        |
| `/sesion/:sessionId/editar` | Con sesión | Corregir una sesión guardada, series incluidas |
| `/historial` | Con sesión | Calendario del mes y detalle del día (`?dia=AAAA-MM-DD`) |
| `/progreso`  | Con sesión | Rachas, días activos, distribuciones, progreso por ejercicio y récords |
| `/perfil`    | Con sesión | Nombre, preferencias, contraseña y cerrar sesión      |
| `/perfil/ejercicios` | Con sesión | Catálogo: buscar, filtrar y crear ejercicios propios |
| `/perfil/actividades` | Con sesión | Tipos de actividad: crear, editar y archivar los tuyos |
| `/estado`    | Pública    | Estado de frontend, API y base de datos               |
| `/estilos`   | Desarrollo | Guía de estilos                                       |

## Rutinas

- **Reordenar.** Rutinas y ejercicios se arrastran desde su manija (⋮⋮) con `Reorder` de Motion; también se puede usar "Subir"/"Bajar" en el menú de cada rutina (útil con teclado). Los grupos se reordenan desde su menú.
- **Actualizaciones optimistas.** Al reordenar o editar el plan semanal la pantalla cambia al instante y, si la API falla, vuelve atrás (`useRoutines.js`, `useWeeklyPlan.js`).
- **Editor de rutinas.** Series con botones −/+, rango de repeticiones, descanso y notas por ejercicio. El buscador permite elegir varios ejercicios de una vez, filtrar por músculo y equipo, o crear uno propio sin salir. Si sales con cambios sin guardar, pide confirmación (`useBlocker`).
- **División sugerida.** Las cuentas nuevas la reciben al registrarse; si no tienes rutinas, la pantalla ofrece "Usar división sugerida".

## Sesión de gimnasio

- **El borrador vive en el navegador** (`localStorage`, en `features/sessions/sessionDraft.js`). Mientras entrenas nada viaja a la API: funciona sin señal y el historial no se llena de sesiones a medias. Al pulsar "Terminar sesión" se envía entera y el borrador se borra. Los componentes lo leen con `useSyncExternalStore`, la forma de React de suscribirse a un dato que vive fuera de React.
- **Registrar una serie con un toque.** Al marcar una serie como hecha, si está vacía copia las repeticiones y el peso de la serie anterior (o de la vez anterior, si la unidad coincide). Los campos muestran como sugerencia las repeticiones objetivo de la rutina.
- **La vez anterior.** Cada ejercicio muestra lo que hiciste la última vez (`GET /sessions/previous`), incluido "(por lado)" en los unilaterales.
- **Volumen en vivo.** `sessionStats.js` repite el cálculo de la API (solo series marcadas, unilaterales × 2) para ver el avance sin esperar a guardar. El valor que queda guardado siempre es el del servidor.
- **Temporizador de descanso.** Arranca al marcar una serie, con el descanso de la rutina. Guarda el instante en que termina y calcula cuánto falta, así el reloj sigue bien aunque el celular apague la pantalla.
- **Aviso de sesión en curso.** Si sales de `/sesion` con una sesión a medias, aparece una barra arriba con el tiempo corriendo (`ActiveSessionBar`).
- **Unidad por ejercicio.** kg o lb se elige en el menú del ejercicio y se aplica a todas sus series; en el gimnasio la máquina no cambia de unidad a mitad de ejercicio.
- **Celebración.** El resumen cuenta el volumen con `CountUp` y suelta confeti. Ambos respetan "reducir movimiento" y, si la pestaña está en segundo plano (sin cuadros de animación), el número se muestra directamente.

## Otras actividades

- **Registrar en pocos toques.** El panel del botón "+" lista tus tipos: tocar uno abre el formulario con ese tipo ya elegido. La duración tiene atajos de 30, 45, 60 y 90 minutos.
- **Campos según el tipo.** La distancia solo aparece si el tipo la usa (bicicleta, patinaje…). La intensidad es opcional.
- **Día, no instante.** Se elige el día en un calendario; la app envía "ahora" si es hoy y el mediodía de ese día si es anterior, para que ninguna zona horaria lo corra al día vecino.
- **Hoy muestra el día completo.** `GET /activities?day=` trae gimnasio y otras actividades juntas, y la pantalla Hoy las lista en una sola sección con el color de cada tipo.
- **Tus tipos** se crean y editan en `/perfil/actividades` con el mismo selector de color e ícono de los grupos de rutinas. Los del sistema se ven pero no se tocan; los propios se archivan con confirmación.

## Historial

- **Calendario en texto, no en fechas.** Los días se manejan como `"AAAA-MM-DD"` (`lib/calendar.js`): comparar y ordenar esos textos equivale a comparar fechas, y no hay horas ni zonas horarias que puedan correr un día. La rejilla se arma en UTC solo para saber en qué día de la semana cae cada fecha.
- **Empieza donde tú empiezas la semana.** Las columnas siguen tu preferencia (`weekStartsOn`), y cada día lleva un punto por actividad con su color.
- **El día elegido vive en la URL** (`/historial?dia=2026-09-23`), así que se puede volver a él o compartirlo; al cambiar de mes, el detalle acompaña.
- **Corregir.** Las actividades se editan en el mismo formulario con el que se registran; las sesiones tienen su pantalla (`/sesion/:id/editar`), que reutiliza la tabla de series de la sesión en curso pero sin temporizador ni "la vez anterior", porque ahí no aplica.
- **Ojo con `useBlocker`.** El aviso de "cambios sin guardar" se apaga con una referencia (`useRef`) y no con el estado de la mutación: al guardar, la navegación ocurre antes de que el componente se vuelva a dibujar.

## Gráficas

Las gráficas son **SVG y HTML propios** (`components/charts/`), sin librería. El motivo: las que necesita la app son pocas y sencillas (columnas, barras horizontales y líneas), una librería como Recharts pesa casi tanto como toda la app hoy, y el estilo pedía control exacto de cada marca. Si más adelante hacen falta gráficas complejas (dispersión, zoom, muchas series), ahí sí compensa traer una.

Reglas que siguen todas, tomadas de la guía de visualización de datos:

- **Nunca dos ejes en una misma gráfica.** Peso máximo y volumen son dos escalas distintas, así que van en dos gráficas; juntarlas haría que cualquier cruce pareciera significativo sin serlo.
- **El color nunca es lo único que distingue.** La paleta viva del proyecto no pasa la prueba de daltonismo como paleta de series (lima y amarillo son casi el mismo color para quien tiene protanopia), así que ninguna gráfica usa el color para separar series: cada barra lleva su nombre y su valor escritos, y el color solo acompaña.
- **Marcas finas y discretas:** barras de máximo 24 px con la punta redondeada de 4 px y cuadrada en la base, líneas de 2 px, puntos de 10 px con anillo del color de la superficie, rejilla de 1 px y un hueco de 2 px entre barras vecinas.
- **Se etiqueta lo que cuenta, no todo:** el valor más alto (o el que señalas) debajo de la gráfica, y el eje carga el resto.
- **Todo dato es alcanzable sin pasar el dedo por encima:** cada gráfica trae un "Ver los datos" con la tabla, y las marcas responden igual al foco del teclado que al puntero.
- **A escala 1:1.** Las líneas se dibujan con el ancho real del contenedor (`useElementWidth`): si se dibujaran en un lienzo fijo y se dejaran escalar, los textos quedarían diminutos en el celular.

## Guardas de sesión

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
│   └── charts/       # Gráficas propias: columnas, barras, líneas y tabla de datos
├── features/         # Una carpeta por funcionalidad
│   ├── activities/   # Registrar actividades y gestionar sus tipos
│   ├── auth/         # Sesión, guardas de rutas, inicio de sesión y registro
│   ├── exercises/    # Catálogo, buscador y formulario de ejercicios
│   ├── history/      # Calendario del mes y detalle del día
│   ├── profile/      # Perfil y preferencias
│   ├── progress/     # Rachas, distribuciones, progreso por ejercicio y récords
│   ├── routines/     # Grupos, rutinas, editor y plan semanal
│   ├── sessions/     # Sesión de gimnasio: borrador, series, descanso y resumen
│   ├── status/       # Estado de la conexión
│   ├── styleguide/   # Guía de estilos (solo desarrollo)
│   └── today/        # Hoy
├── lib/              # Cliente HTTP, fechas, opciones de /meta y utilidades
└── styles/           # tokens.css y base.css (globales)
```

Organizar por **funcionalidad** (y no por tipo de archivo) mantiene juntos los componentes, hooks y llamadas a la API de cada sección. Con **CSS Modules**, cada `.module.css` genera nombres de clase únicos: los estilos de un componente nunca afectan a otro, por mucho que crezca la app.
