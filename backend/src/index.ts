import express from 'express';
import cors from 'cors';
import { connectDB, sequelize } from './config/database';
import './models/task'; 
import taskRoutes from './routes/taskRoutes'; // <-- NUEVA LÍNEA

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// <-- NUEVA LÍNEA: Conectamos las rutas bajo el prefijo /api/tasks
app.use('/api/tasks', taskRoutes); 

const startServer = async () => {
  await connectDB();
  await sequelize.sync({ force: false }); 
  console.log('📦 Modelos sincronizados con SQLite.');

  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
};

startServer();