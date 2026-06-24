# 🖥 Backend — Parque del Café Planimetría

API REST construida con **Express + TypeScript**, organizada en arquitectura por capas.

---

## 🏗 Arquitectura en Capas

```
src/
├── server.ts               ← Punto de entrada — levanta el servidor
├── app.ts                  ← Configuración de Express, middlewares y rutas
│
├── config/
│   └── env.ts              ← Variables de entorno validadas
│
├── types/
│   ├── auth.ts             ← Tipos de autenticación (UserRole, AuthUser)
│   └── errors.ts           ← Clase AppError para errores controlados
│
├── models/                 ← Interfaces de dominio (contratos de datos)
│   ├── attraction.model.ts
│   ├── plan.model.ts
│   ├── user.model.ts
│   └── maintenance.model.ts
│
├── services/               ← Lógica de negocio y validaciones
│   ├── attraction.service.ts
│   ├── plan.service.ts
│   ├── auth.service.ts
│   ├── user.service.ts
│   └── maintenance.service.ts
│
├── controllers/            ← Handlers HTTP puros (req → service → res)
│   ├── attractions.controller.ts
│   ├── plans.controller.ts
│   ├── auth.controller.ts
│   ├── users.controller.ts
│   └── maintenance.controller.ts
│
├── routes/                 ← Definición de rutas y middlewares de ruta
│   ├── attractions.routes.ts
│   ├── plans.routes.ts
│   ├── auth.routes.ts
│   ├── users.routes.ts
│   └── maintenance.routes.ts
│
├── middleware/             ← Middlewares de aplicación
│   ├── auth.ts             ← requireAuth, requireRole
│   ├── upload.ts           ← Multer (PDF uploads)
│   └── errorHandler.ts     ← Manejador global de errores
│
└── data/
    └── mockData.js         ← Datos demo en memoria (mientras no hay BD)
```

---

## 🔄 Flujo de una Petición

```
Cliente HTTP
    │
    ▼
routes/*.routes.ts        ← Aplica requireAuth / requireRole / multer
    │
    ▼
controllers/*.controller  ← Extrae req.body/params/query, llama al servicio
    │
    ▼
services/*.service        ← Lógica de negocio, validaciones, lanza AppError
    │
    ▼
controllers/*.controller  ← Devuelve res.json() con el resultado
    │
  (si hay error)
    ▼
middleware/errorHandler   ← Formatea y envía la respuesta de error al cliente
```

---

## 🧩 Descripción de Cada Capa

### `types/errors.ts` — AppError
Clase personalizada que extiende `Error`:
- `statusCode` — código HTTP que se enviará al cliente.
- `isOperational` — `true` para errores esperados (404, 400, 409), `false` para bugs.

```typescript
// En un servicio:
throw new AppError('Atracción no encontrada', 404);
throw new AppError('El código ya existe', 409);
```

### `models/` — Interfaces de dominio
Contratos TypeScript que definen la forma de cada entidad. Incluyen DTOs para crear y actualizar.

### `services/` — Lógica de negocio
Toda la lógica de validación, transformación y acceso a datos. No conoce `req`/`res`.

### `controllers/` — Handlers HTTP
Solo extraen datos de `req`, llaman al servicio, y devuelven `res.json()`.
Propagan errores con `next(err)` — **nunca** llaman a `res.status(xxx)` directamente para errores.

### `middleware/errorHandler.ts` — Manejador global
Centraliza todas las respuestas de error:
- `AppError` (isOperational) → responde con su `statusCode` y `message`.
- Cualquier otro error → responde `500`. En producción no expone el mensaje interno.

---

## ⚙️ Variables de Entorno

Copia `.env.example` a `.env` y ajusta los valores:

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/parque_cafe_planimetria?schema=public
JWT_SECRET=change-me-before-production
JWT_EXPIRES_IN=8h
UPLOAD_DIR=uploads
FRONTEND_ORIGIN=http://127.0.0.1:5173
```

---

## 📦 Scripts NPM

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor en modo desarrollo con recarga automática (tsx watch) |
| `npm run build` | Compilación TypeScript a `dist/` |
| `npm start` | Inicia el servidor compilado (`dist/server.js`) |
| `npm run prisma:generate` | Genera el cliente de Prisma |
| `npm run prisma:migrate` | Ejecuta migraciones de BD |
| `npm run prisma:studio` | Abre Prisma Studio (interfaz visual de la BD) |

---

## ➕ Cómo Agregar una Nueva Entidad

1. **Modelo**: Crea `src/models/nueva-entidad.model.ts` con las interfaces y DTOs.
2. **Servicio**: Crea `src/services/nueva-entidad.service.ts` con la lógica de negocio. Usa `throw new AppError(...)` para errores.
3. **Controlador**: Crea `src/controllers/nueva-entidad.controller.ts`. Solo llama al servicio y usa `next(err)` para propagar errores.
4. **Rutas**: Crea `src/routes/nueva-entidad.routes.ts` y aplica `requireAuth`/`requireRole` según corresponda.
5. **Registra el router** en `src/app.ts`.

---

## 🔒 Roles y Permisos

| Rol | Descripción |
|---|---|
| `admin` | Acceso total |
| `engineer` | Crea y edita atracciones y planos |
| `technician` | Acceso de lectura + gestión de mantenimiento |
| `operator` | Solo lectura |
