const app = require('./app');
const sequelize = require('./config/db');

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL exitosa');

    // Force sync to update the schema 
    await sequelize.sync();
    console.log('Modelos sincronizados (schema actualizado)');

    app.listen(PORT, () =>
      console.log(`Servidor corriendo en http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
  }
}

startServer();
