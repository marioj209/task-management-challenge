import { Router } from 'express';
import { TaskController } from '../controllers/taskController';

const router = Router();

// Rutas de métricas (Debe ir antes de /:id para que Express no confunda "metrics" con un ID)
router.get('/metrics', TaskController.getMetrics);

// Rutas CRUD estándar
router.post('/', TaskController.createTask);
router.get('/', TaskController.getAllTasks);
router.put('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

export default router;