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

| Variable       | Descripción                                          |
| -------------- | ---------------------------------------------------- |
| `VITE_API_URL` | URL base de la API, por ejemplo `http://localhost:3000/api/v1` |

Las variables que empiezan por `VITE_` se incluyen en el código que descarga el navegador, así que **nunca** deben contener secretos.

## Estructura

```
src/
├── main.jsx          # Punto de entrada: monta React con sus proveedores
├── app/              # Configuración global: rutas y cliente de TanStack Query
├── features/         # Una carpeta por funcionalidad (status, routines, gym, progress…)
├── lib/              # Utilidades compartidas (cliente HTTP de la API)
└── styles/           # Estilos globales
```

Organizar por **funcionalidad** (y no por tipo de archivo) mantiene juntos los componentes, hooks y estilos de cada sección. Así es fácil encontrarlos y la app puede crecer sin volverse un laberinto. Los componentes reutilizables del sistema de diseño irán en `src/components/` (Fase 3).
