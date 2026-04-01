# Kanban Fullstack Challenge

App full stack tipo Kanban hecha para el challenge técnico.

- **Runtime:** Bun (también corre con npm)
- **Framework:** Next.js App Router
- **Base de datos:** SQLite + Prisma
- **UI:** Tailwind CSS puro (sin shadcn/ui)

## Qué incluye

- Crear y listar boards
- Ver un board en formato Kanban (columnas + tarjetas)
- Crear columnas por board con `displayOrder`
- Crear tareas por columna
- Editar tarea (título y descripción)
- Mover tarea entre columnas con dropdown
- Eliminar tarea
- Estados de carga y estados vacíos en UI

## Modelo de datos

`Board -> Column -> Task`

- **Board:** `id`, `name`, `createdAt`
- **Column:** `id`, `boardId`, `name`, `displayOrder`, `createdAt`
- **Task:** `id`, `columnId`, `title`, `description`, `priority`, `createdAt`, `updatedAt`
- **Priority enum:** `LOW | MEDIUM | HIGH`

## API

Todas las rutas responden con un formato consistente:

- Éxito: `{ "success": true, "data": ... }`
- Error: `{ "success": false, "error": { "code": "...", "message": "...", "details": ... } }`

Rutas implementadas:

- `GET /api/boards`
- `POST /api/boards`
- `GET /api/boards/:id`
- `POST /api/columns`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

Cada endpoint valida entrada con Zod y devuelve códigos HTTP correctos (`400`, `404`, `409`, `500`).

## Cómo correr el proyecto

### 1) Instalar dependencias

```bash
npm install
```

o con Bun:

```bash
bun install
```

### 2) Configurar y migrar base de datos

En `.env` se usa:

```env
DATABASE_URL="file:./dev.db"
```

Luego corre migraciones:

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

Abre [http://localhost:3000](http://localhost:3000).

## Scripts útiles

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run db:generate`
- `npm run db:migrate`
- `npm run db:studio`

## Decisiones de implementación

- **Prisma + SQLite:** fue la opción más rápida para tener esquema claro y migraciones simples.
- **Route Handlers en App Router:** backend y frontend viven en el mismo proyecto.
- **Validación centralizada (`lib/validation.ts`):** evita repetir reglas en cada endpoint.
- **Respuesta JSON uniforme:** simplifica manejo de éxito/error en cliente.
- **UI modular:** separación clara en `board`, `column`, `task`, `modal`.
- **Sin drag and drop:** para este alcance, el dropdown cubre el requisito con menos complejidad.

## Nota de uso de IA

Se usó IA para:

- proponer la estructura inicial,
- acelerar la implementación de endpoints y componentes,
- revisar errores de build y consistencia.

Después se hicieron ajustes manuales en:

- integración de Prisma 7 con SQLite adapter,
- imports cliente/servidor para evitar bundling de Prisma en frontend,
- ajuste visual final para respetar la referencia y mantener Tailwind puro.
