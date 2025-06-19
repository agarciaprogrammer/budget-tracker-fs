const { Sequelize } = require('sequelize');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

let sequelize;

// Si tenemos DATABASE_URL, usarla (tanto para desarrollo como producción)
if (process.env.DATABASE_URL) {
  // Detectar si es una conexión del pooler (puerto 6543) o directa
  const isPooler = process.env.DATABASE_URL.includes(':6543');
  
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: env === 'development' ? console.log : false,
    pool: {
      max: isPooler ? 10 : 5, // Más conexiones para pooler
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    // Configuración específica para pooler
    ...(isPooler && {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        },
        // Deshabilitar prepared statements para pooler
        prepare: false
      }
    })
  });
} else if (env === 'production') {
  // Fallback para producción sin DATABASE_URL
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
} else {
  // Configuración para desarrollo local sin DATABASE_URL
  const configFile = require('./config.json');
  const config = configFile[env];
  
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: config.host,
      port: config.port,
      dialect: config.dialect,
      logging: config.logging !== undefined ? config.logging : console.log,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

module.exports = sequelize;
