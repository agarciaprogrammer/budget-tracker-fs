const app = require('./app');
const sequelize = require('./config/db');

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL exitosa');

    await sequelize.sync(); // Usar { force: true } para resetear la bdd
    console.log('Modelos sincronizados');

    app.listen(PORT, () =>
      console.log(`Servidor corriendo en http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
  }
}

startServer();
