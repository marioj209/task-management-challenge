import { Sequelize } from 'sequelize';
import path from 'path';

// Inicializamos Sequelize usando SQLite
export const sequelize = new Sequelize({
  dialect: 'sqlite',
  // La base de datos será un archivo local en la raíz del proyecto
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: false, // Ponelo en true si querés ver los queries SQL en la consola
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a SQLite establecida correctamente.');
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error);
    process.exit(1);
  }
};