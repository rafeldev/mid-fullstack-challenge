# Kanban Fullstack Challenge

Aplicacion full stack tipo Kanban construida con:

- **Runtime:** Bun (compatible tambien con npm)
- **Framework:** Next.js App Router
- **DB:** SQLite + Prisma
- **UI:** Tailwind CSS puro (sin shadcn/ui)

## Features implementadas

- Crear y listar boards
- Ver board con columnas y tareas en layout Kanban
- Crear columnas por board con `displayOrder`
- Crear tareas por columna
- Editar tarea (titulo + descripcion)
- Mover tarea entre columnas (dropdown)
- Eliminar tarea
- Loading states y empty states en pantallas principales

## Modelo de datos

`Board -> Column -> Task`

- **Board:** `id`, `name`, `createdAt`
- **Column:** `id`, `boardId`, `name`, `displayOrder`, `createdAt`
- **Task:** `id`, `columnId`, `title`, `description`, `priority`, `createdAt`, `updatedAt`
- **Priority enum:** `LOW | MEDIUM | HIGH`

## Endpoints API

Todos devuelven un formato consistente:

- Success: `{ "success": true, "data": ... }`
- Error: `{ "success": false, "error": { "code": "...", "message": "...", "details": ... } }`

Endpoints requeridos:

- `GET /api/boards`
- `POST /api/boards`
- `GET /api/boards/:id`
- `POST /api/columns`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

Validacion implementada en cada endpoint con Zod. Se usan estados HTTP de error apropiados (`400`, `404`, `409`, `500`).

## Correr el proyecto

### 1) Instalar dependencias

```bash
npm install
```

o con Bun:

```bash
bun install
```

### 2) Configurar y migrar base de datos

El proyecto incluye `.env` con:

```env
DATABASE_URL="file:./dev.db"
```

Ejecuta migraciones:

```bash
npm run db:migrate
```

### 3) Levantar entorno local

```bash
npm run dev
```

o:

```bash
bun dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Scripts utiles

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run db:generate`
- `npm run db:migrate`
- `npm run db:studio`

## Decisiones y trade-offs

- **Prisma + SQLite:** prioriza rapidez de desarrollo y claridad de esquema para challenge.
- **Route Handlers en App Router:** unifica frontend y backend en una sola app.
- **Validacion centralizada (`lib/validation.ts`):** menos duplicacion y errores de contrato.
- **Respuesta JSON uniforme:** facilita manejo de errores en cliente.
- **UI modular en componentes Kanban:** separacion clara entre board/column/task/modal.
- **Sin drag & drop:** se usa selector para mover tareas (scope acotado, menos complejidad).

## Nota de uso de IA

Se utilizo asistencia de IA para:

- definir estructura inicial de arquitectura,
- acelerar implementacion de endpoints y componentes UI,
- revisión de consistencia y errores de build.

Despues de la asistencia se realizaron ajustes manuales para:

- adaptar Prisma 7 + SQLite adapter,
- corregir imports cliente/servidor para evitar bundling de Prisma en frontend,
- alinear la UI al estilo de referencia solicitado con Tailwind puro.
