# Guía de Despliegue - Budget Tracker con Neon

Esta guía te ayudará a desplegar tu aplicación Budget Tracker usando Vercel (frontend), Render (backend) y Neon (base de datos PostgreSQL serverless).

## 🗄️ Configurar Neon (Base de Datos)

### 1. Crear cuenta en Neon
1. Ve a [neon.tech](https://neon.tech)
2. Crea una cuenta o inicia sesión con GitHub
3. Haz clic en "Create Project"

### 2. Crear un nuevo proyecto
1. **Project Name**: budget-tracker-db
2. **Region**: Selecciona la más cercana a ti
3. **Compute**: Free tier
4. Haz clic en "Create Project"

### 3. Obtener credenciales de conexión
1. Una vez creado, ve a **Connection Details**
2. Anota las credenciales:
   - **Host**: ep-xxxxxxxxxxxxx.us-east-2.aws.neon.tech
   - **Database name**: neondb
   - **Port**: 5432
   - **User**: tu_usuario
   - **Password**: (se genera automáticamente)

### 4. Configurar la base de datos
1. Ve a **SQL Editor**
2. Ejecuta las migraciones de Sequelize (se crearán automáticamente cuando conectes)

## 🚀 Despliegue del Backend en Render

### 1. Crear cuenta en Render
1. Ve a [render.com](https://render.com)
2. Crea una cuenta o inicia sesión
3. Conecta tu repositorio de GitHub

### 2. Desplegar el servicio web
1. En Render, ve a "New" → "Web Service"
2. Conecta tu repositorio de GitHub
3. Configura el servicio:
   - **Name**: budget-tracker-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 3. Configurar variables de entorno
En la configuración del servicio web, agrega estas variables:

```
NODE_ENV=production
DB_USERNAME=tu_usuario_neon
DB_PASSWORD=tu_password_neon
DB_NAME=neondb
DB_HOST=ep-xxxxxxxxxxxxx.us-east-2.aws.neon.tech
DB_PORT=5432
JWT_SECRET=tu_jwt_secret_super_seguro
FRONTEND_URL=https://tu-app.vercel.app
```

**Reemplaza** `ep-xxxxxxxxxxxxx.us-east-2.aws.neon.tech` con tu host real de Neon.

### 4. Desplegar
- Haz clic en "Create Web Service"
- Render construirá y desplegará tu aplicación
- Anota la URL del servicio (ej: `https://budget-tracker-backend.onrender.com`)

## 🌐 Despliegue del Frontend en Vercel

### 1. Configurar el proyecto en Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Crea una cuenta o inicia sesión
3. Conecta tu repositorio de GitHub

### 2. Configurar el proyecto
1. En Vercel, haz clic en "New Project"
2. Selecciona tu repositorio
3. Configura el proyecto:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: dist

### 3. Configurar variables de entorno
En la configuración del proyecto, agrega esta variable:

```
VITE_API_URL=https://tu-backend-url.onrender.com/api
```

### 4. Desplegar
- Haz clic en "Deploy"
- Vercel construirá y desplegará tu aplicación
- Anota la URL del frontend (ej: `https://budget-tracker.vercel.app`)

## 🔧 Configuración adicional

### Actualizar CORS en el backend
Una vez que tengas la URL de Vercel, actualiza el archivo `backend/app.js`:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://tu-app.vercel.app', // Reemplaza con tu URL de Vercel
  process.env.FRONTEND_URL
].filter(Boolean);
```

### Actualizar FRONTEND_URL en Render
En la configuración de variables de entorno de Render, actualiza:
```
FRONTEND_URL=https://tu-app.vercel.app
```

## 🧪 Probar el despliegue

1. **Backend**: Visita `https://tu-backend-url.onrender.com/health`
2. **Frontend**: Visita tu URL de Vercel
3. **Base de datos**: Ve a tu dashboard de Neon
4. **Prueba la funcionalidad**: Registra un usuario y prueba las funciones

## 💰 Costos y Límites

### Neon (Plan Gratuito)
- PostgreSQL serverless sin límites de tiempo
- 3GB de almacenamiento
- 10GB de transferencia por mes
- Auto-scaling automático
- **Excelente para proyectos personales**

### Render (Plan Gratuito)
- Servicios web gratuitos
- Tiempo de inactividad (se despierta con requests)
- Sin límites de tiempo para servicios web

### Vercel (Plan Gratuito)
- Despliegue gratuito
- Dominio personalizado incluido
- SSL automático

## 🔍 Ventajas de Neon

### Neon ✅
- **PostgreSQL serverless sin límites de tiempo**
- Auto-scaling automático
- Muy rápido y moderno
- 3GB de almacenamiento gratuito
- Excelente documentación
- Tecnología serverless moderna

### Render PostgreSQL ❌
- Solo 30 días gratis
- Se borra automáticamente
- Límites estrictos

## 🚀 Migración desde Render PostgreSQL

Si ya tienes datos en Render PostgreSQL:

1. **Exporta tu base de datos**:
   ```bash
   pg_dump -h tu-host-render -U tu-usuario -d tu-db > backup.sql
   ```

2. **Importa en Neon**:
   - Ve a **SQL Editor** en Neon
   - Copia y pega el contenido de backup.sql
   - Ejecuta el script

3. **Actualiza las variables de entorno** en Render

4. **Actualiza la URL de la API** en Vercel

## 📝 Notas importantes

- Neon es PostgreSQL serverless moderno
- La base de datos no se borra automáticamente
- Auto-scaling automático
- Muy rápido y eficiente
- Excelente para proyectos que crecen

## 🔧 Configuración avanzada de Neon

### Habilitar conexiones SSL
Neon requiere SSL por defecto, pero tu configuración ya lo incluye:

```javascript
// En backend/config/db.js ya está configurado
dialectOptions: {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
}
```

### Configurar pool de conexiones
```javascript
// En backend/config/db.js ya está configurado
pool: {
  max: 5,
  min: 0,
  acquire: 30000,
  idle: 10000
}
```

## 🆚 Comparación: Supabase vs Neon

### Supabase
- ✅ Dashboard web completo
- ✅ API REST automática
- ✅ Autenticación incluida
- ✅ 500MB de almacenamiento
- ❌ Menos almacenamiento que Neon

### Neon
- ✅ 3GB de almacenamiento
- ✅ PostgreSQL serverless puro
- ✅ Auto-scaling automático
- ✅ Muy rápido
- ❌ Solo base de datos (sin dashboard web)

**Recomendación**: Si quieres algo simple y solo base de datos → **Neon**. Si quieres más funcionalidades → **Supabase**. 