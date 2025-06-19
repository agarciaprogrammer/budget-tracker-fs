# Guía de Despliegue - Budget Tracker con Supabase

Esta guía te ayudará a desplegar tu aplicación Budget Tracker usando Vercel (frontend), Render (backend) y Supabase (base de datos).

## 🗄️ Configurar Supabase (Base de Datos)

### 1. Crear cuenta en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión con GitHub
3. Haz clic en "New Project"

### 2. Crear un nuevo proyecto
1. **Organization**: Selecciona tu organización
2. **Name**: budget-tracker-db
3. **Database Password**: Crea una contraseña segura
4. **Region**: Selecciona la más cercana a ti
5. Haz clic en "Create new project"

### 3. Obtener credenciales de conexión
1. Ve a **Settings** → **Database**
2. Anota las credenciales:
   - **Host**: db.xxxxxxxxxxxxx.supabase.co
   - **Database name**: postgres
   - **Port**: 5432
   - **User**: postgres
   - **Password**: (la que creaste) 6TMinUt3JzoqTzx0

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
DATABASE_URL=postgresql://postgres:tu_password@db.rdvhwuhcxpaagepwxihg.supabase.co:5432/postgres
JWT_SECRET=tu_jwt_secret_super_seguro
FRONTEND_URL=https://tu-app.vercel.app
```

**Reemplaza** `tu_password` con la contraseña que creaste para el proyecto.

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
3. **Base de datos**: Ve a tu dashboard de Supabase
4. **Prueba la funcionalidad**: Registra un usuario y prueba las funciones

## 💰 Costos y Límites

### Supabase (Plan Gratuito)
- PostgreSQL sin límites de tiempo
- 500MB de almacenamiento
- 50,000 filas por mes
- 2GB de transferencia
- **Perfecto para proyectos personales**

### Render (Plan Gratuito)
- Servicios web gratuitos
- Tiempo de inactividad (se despierta con requests)
- Sin límites de tiempo para servicios web

### Vercel (Plan Gratuito)
- Despliegue gratuito
- Dominio personalizado incluido
- SSL automático

## 🔍 Ventajas de Supabase

### Supabase ✅
- **PostgreSQL sin límites de tiempo**
- Dashboard web para gestionar datos
- API REST automática
- Autenticación incluida
- Excelente documentación
- Muy estable y confiable

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

2. **Importa en Supabase**:
   - Ve a **SQL Editor** en Supabase
   - Copia y pega el contenido de backup.sql
   - Ejecuta el script

3. **Actualiza las variables de entorno** en Render

4. **Actualiza la URL de la API** en Vercel

## 📝 Notas importantes

- Supabase es más estable que Render PostgreSQL
- La base de datos no se borra automáticamente
- Dashboard web para gestionar datos fácilmente
- API REST automática si quieres usarla en el futuro
- Excelente para proyectos que crecen

## 🔧 Configuración avanzada de Supabase

### Habilitar Row Level Security (RLS)
Si quieres mayor seguridad:

```sql
-- En SQL Editor de Supabase
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixed_expenses ENABLE ROW LEVEL SECURITY;
```

### Crear políticas de seguridad
```sql
-- Ejemplo para expenses
CREATE POLICY "Users can only access their own expenses" ON expenses
FOR ALL USING (user_id = auth.uid());
``` 