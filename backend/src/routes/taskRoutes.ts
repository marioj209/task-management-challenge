import { Router } from 'express';
import { TaskController } from '../controllers/taskController'; // Ajustá el path si es distinto

const router = Router();
console.log("¡Cargando las rutas de tareas!")
// 1. Rutas generales (Sin ID)
router.post('/', TaskController.createTask);
router.get('/', TaskController.getAllTasks);

// 2. Rutas de Métricas 
router.get('/metrics', TaskController.getMetrics);
router.get('/metrics/:id', TaskController.getMetrics); 

// 3. Rutas específicas con ID
router.get('/:id/subtasks', TaskController.getSubtasks); 
router.get('/:id', TaskController.getTaskById);          
router.patch('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

export default router;