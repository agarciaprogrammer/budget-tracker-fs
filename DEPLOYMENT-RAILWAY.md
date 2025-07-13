# Guía de Despliegue - Budget Tracker en Railway

Esta guía te ayudará a desplegar tu aplicación Budget Tracker en Vercel (frontend) y Railway (backend + base de datos).

## 🚀 Despliegue del Backend en Railway

### 1. Crear cuenta en Railway
1. Ve a [railway.app](https://railway.app)
2. Crea una cuenta o inicia sesión con GitHub
3. Railway te dará $5 de crédito mensual gratis

### 2. Crear un nuevo proyecto
1. Haz clic en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Conecta tu repositorio de GitHub

### 3. Agregar base de datos PostgreSQL
1. En tu proyecto, haz clic en "New"
2. Selecciona "Database" → "PostgreSQL"
3. Railway creará automáticamente una base de datos PostgreSQL
4. Anota las credenciales de conexión (las encontrarás en la pestaña "Variables")

### 4. Configurar el servicio web
1. En tu proyecto, haz clic en "New"
2. Selecciona "GitHub Repo"
3. Selecciona tu repositorio
4. Configura el servicio:
   - **Root Directory**: backend
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 5. Configurar variables de entorno
En la configuración del servicio web, agrega estas variables:

```
NODE_ENV=production
DB_USERNAME=postgres
DB_PASSWORD=tu_password_de_railway
DB_NAME=railway
DB_HOST=tu_host_de_railway
DB_PORT=5432
JWT_SECRET=tu_jwt_secret_super_seguro
FRONTEND_URL=https://tu-app.vercel.app
```

**Nota**: Railway proporciona automáticamente las variables de base de datos. Solo necesitas agregar `JWT_SECRET` y `FRONTEND_URL`.

### 6. Desplegar
- Railway desplegará automáticamente tu aplicación
- Anota la URL del servicio (ej: `https://budget-tracker-backend-production.up.railway.app`)

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
VITE_API_URL=https://tu-backend-url.up.railway.app/api
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

### Actualizar FRONTEND_URL en Railway
En la configuración de variables de entorno de Railway, actualiza:
```
FRONTEND_URL=https://tu-app.vercel.app
```

## 🧪 Probar el despliegue

1. **Backend**: Visita `https://tu-backend-url.up.railway.app/health`
2. **Frontend**: Visita tu URL de Vercel
3. **Prueba la funcionalidad**: Registra un usuario y prueba las funciones

## 💰 Costos y Límites

### Railway (Plan Gratuito)
- $5 de crédito mensual
- PostgreSQL incluido sin límites de tiempo
- Despliegue automático
- Variables de entorno incluidas

### Vercel (Plan Gratuito)
- Despliegue gratuito
- Dominio personalizado incluido
- SSL automático

## 🔍 Ventajas de Railway vs Render

### Railway ✅
- Base de datos PostgreSQL sin límites de tiempo
- $5 de crédito mensual (más generoso)
- Despliegue más rápido
- Mejor documentación
- Soporte más activo

### Render ❌
- PostgreSQL gratuito solo por 30 días
- Límites más estrictos
- Tiempo de inactividad en plan gratuito

## 🚀 Migración desde Render

Si ya tienes tu proyecto en Render:

1. **Exporta tu base de datos**:
   ```bash
   pg_dump -h tu-host-render -U tu-usuario -d tu-db > backup.sql
   ```

2. **Importa en Railway**:
   ```bash
   psql -h tu-host-railway -U tu-usuario -d tu-db < backup.sql
   ```

3. **Actualiza las variables de entorno** en Railway

4. **Actualiza la URL de la API** en Vercel

## 📝 Notas importantes

- Railway es más estable para proyectos personales
- La base de datos no se borra automáticamente
- Mejor rendimiento que Render
- Soporte para múltiples entornos (staging, production) 