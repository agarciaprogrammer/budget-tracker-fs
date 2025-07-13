# Guía de Despliegue - Budget Tracker

Esta guía te ayudará a desplegar tu aplicación Budget Tracker en Vercel (frontend) y Render (backend).

## 🚀 Despliegue del Backend en Render

### 1. Preparar el repositorio
- Asegúrate de que tu código esté en un repositorio de GitHub
- El backend debe estar en la carpeta `backend/`

### 2. Crear cuenta en Render
1. Ve a [render.com](https://render.com)
2. Crea una cuenta o inicia sesión
3. Conecta tu repositorio de GitHub

### 3. Crear una base de datos PostgreSQL
1. En Render, ve a "New" → "PostgreSQL"
2. Elige el plan gratuito
3. Dale un nombre como "budget-tracker-db"
4. Anota las credenciales de conexión

### 4. Desplegar el servicio web
1. En Render, ve a "New" → "Web Service"
2. Conecta tu repositorio de GitHub
3. Configura el servicio:
   - **Name**: budget-tracker-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 5. Configurar variables de entorno
En la configuración del servicio web, agrega estas variables:

```
NODE_ENV=production
DB_USERNAME=tu_usuario_de_postgres
DB_PASSWORD=tu_password_de_postgres
DB_NAME=tu_nombre_de_base_de_datos
DB_HOST=tu_host_de_postgres
DB_PORT=5432
JWT_SECRET=tu_jwt_secret_super_seguro
FRONTEND_URL=https://tu-app.vercel.app
```

### 6. Desplegar
- Haz clic en "Create Web Service"
- Render construirá y desplegará tu aplicación
- Anota la URL del servicio (ej: `https://budget-tracker-backend.onrender.com`)

## 🌐 Despliegue del Frontend en Vercel

### 1. Preparar el repositorio
- Asegúrate de que el frontend esté en la carpeta `frontend/`

### 2. Crear cuenta en Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Crea una cuenta o inicia sesión
3. Conecta tu repositorio de GitHub

### 3. Configurar el proyecto
1. En Vercel, haz clic en "New Project"
2. Selecciona tu repositorio
3. Configura el proyecto:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: dist

### 4. Configurar variables de entorno
En la configuración del proyecto, agrega esta variable:

```
VITE_API_URL=https://tu-backend-url.onrender.com/api
```

### 5. Desplegar
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
3. **Prueba la funcionalidad**: Registra un usuario y prueba las funciones

## 🔍 Solución de problemas

### Error de CORS
- Verifica que las URLs en `allowedOrigins` sean correctas
- Asegúrate de que `FRONTEND_URL` esté configurada en Render

### Error de base de datos
- Verifica que las credenciales de PostgreSQL sean correctas
- Asegúrate de que la base de datos esté activa en Render

### Error de build
- Verifica que todas las dependencias estén en `package.json`
- Revisa los logs de build en Vercel/Render

## 📝 Notas importantes

- El plan gratuito de Render puede tener limitaciones de tiempo de inactividad
- Las variables de entorno sensibles no deben estar en el código
- Siempre usa HTTPS en producción
- Considera usar un dominio personalizado para mejor branding 