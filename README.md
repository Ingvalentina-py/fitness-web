# fitness-web

Frontend de **App Fitness**, una aplicación para registrar actividad física con el gimnasio como sección principal.

La API vive en otro repositorio: **fitness-api**.

## Tecnologías

- **React 19** + **Vite 8**
- **React Router** para la navegación
- **TanStack Query** para pedir y guardar en caché los datos del servidor
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

## Rutas

| Ruta         | Acceso     | Pantalla                                              |
| ------------ | ---------- | ----------------------------------------------------- |
| `/ingresar`  | Sin sesión | Inicio de sesión                                      |
| `/registro`  | Sin sesión | Crear cuenta (envía la zona horaria del dispositivo) |
| `/`          | Con sesión | Inicio provisional (será "Hoy" en la Fase 3)          |
| `/perfil`    | Con sesión | Nombre, preferencias, cambio de contraseña y salir    |
| `/estado`    | Pública    | Estado de frontend, API y base de datos               |

`RequireAuth` envía a `/ingresar` si no hay sesión y recuerda a dónde querías ir. `GuestOnly` saca de `/ingresar` y `/registro` a quien ya inició sesión. Si cualquier petición responde `401` (sesión vencida), la app lo detecta en `app/queryClient.js` y vuelve a pedir inicio de sesión.

## Estructura

```
src/
├── main.jsx          # Punto de entrada: monta React con sus proveedores
├── app/              # Rutas, cliente de TanStack Query y página 404
├── components/       # Componentes reutilizables básicos (Field, Alert…); sistema de diseño en la Fase 3
├── features/
│   ├── auth/         # Sesión: API, hooks, guardas de rutas, inicio de sesión y registro
│   ├── profile/      # Perfil y preferencias
│   ├── status/       # Estado de la conexión
│   └── today/        # Inicio (provisional)
├── lib/              # Cliente HTTP, opciones de /meta y errores de formularios
└── styles/           # Estilos globales básicos
```

Organizar por **funcionalidad** (y no por tipo de archivo) mantiene juntos los componentes, hooks y llamadas a la API de cada sección. Así es fácil encontrarlos y la app puede crecer sin volverse un laberinto.
