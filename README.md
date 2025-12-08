## HC Platform API

API base en Node.js/Express lista para añadir más módulos de negocio. El primer módulo habilitado es autenticación y login contra PostgreSQL.

### Requisitos

- Node.js >= 18
- PostgreSQL 14+

### Variables de entorno

Copia el archivo `.env.example` a `.env` y ajusta los valores si es necesario.

```bash
cp .env.example .env
```

La API ya viene configurada para usar la cadena de conexión proporcionada:

```
DATABASE_URL=postgres://root:Pyme2025*@panel.hubcapture.com:5432/hubcapturedb?sslmode=disable
```

### Instalación

```bash
cd api
npm install
```

### Ejecutar en desarrollo

```bash
npm run dev
```

### Scripts útiles

- `npm start`: inicia la API en modo producción.
- `npm run dev`: inicia la API con `nodemon`.

### Estructura principal

```
src/
  app.js             -> configuración general de Express y middlewares
  server.js          -> arranque del servidor y verificación de base de datos
  config/env.js      -> carga de variables de entorno
  db/pool.js         -> pool de conexiones a PostgreSQL
  routes/            -> definición de rutas (ej. auth)
  controllers/       -> controladores HTTP
  services/          -> lógica de negocio
  repositories/      -> acceso a datos
  middlewares/       -> middlewares (manejo de errores, etc.)
  utils/             -> utilidades como logger y manejo de contraseñas
scripts/db/          -> scripts SQL (ej. creación de tabla de usuarios)
```

### Scripts de base de datos

Ejecuta los siguientes scripts para provisionar las tablas iniciales:

```bash
psql "$DATABASE_URL" -f scripts/db/create_users_table.sql
psql "$DATABASE_URL" -f scripts/db/create_companies_table.sql
```

### Endpoints disponibles

- `POST /api/v1/auth/login`
- `GET /api/v1/companies`
- `POST /api/v1/companies`
- `PUT /api/v1/companies/:id`
- `DELETE /api/v1/companies/:id`

> La entidad `companies` incluye el campo de texto `company_icp` pensado para almacenar notas o el Ideal Customer Profile asociado a la compañía.

### Docker

Para levantar la API con Docker:

```bash
cd api
cp .env.example .env   # ajusta DATABASE_URL y cualquier otra variable
cd ..
docker compose build api
docker compose up api
```

El servicio quedará disponible en `http://localhost:4000`.

Las rutas de `companies` requieren encabezado `Authorization: Bearer <sessionToken>` emitido por el login.

Body esperado:

```json
{
  "email": "usuario@empresa.com",
  "password": "secret"
}
```

Respuesta exitosa:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "f9b24842-8ac7-4a57-9d33-6c09511b0619",
      "email": "usuario@empresa.com",
      "firstName": "Nombre",
      "lastName": "Apellido",
      "lastLogin": "2024-08-12T16:16:20.000Z",
      "createdAt": "2024-08-01T13:01:10.000Z"
    },
    "sessionToken": "a0d9..."
  }
}
```

Cuando existan credenciales incorrectas se responde con `401` y mensaje `Credenciales inválidas`.
