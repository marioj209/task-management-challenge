import { Request, Response } from 'express';
import { TaskService } from '../services/taskService';

const taskService = new TaskService();

export class TaskController {
  static async createTask(req: Request, res: Response) {
    try {
      const task = await taskService.createTask(req.body);
      res.status(201).json(task);
    } catch (error: unknown) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async getAllTasks(req: Request, res: Response) {
    try {
      const tasks = await taskService.getAllTasks();
      res.json(tasks);
    } catch (error: unknown) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  // --- NUEVO: Obtener una sola tarea por ID ---
  static async getTaskById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const task = await taskService.getTaskById(id);
      
      if (!task) {
        res.status(404).json({ error: 'Tarea no encontrada' });
        return;
      }
      res.json(task);
    } catch (error: unknown) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  // --- NUEVO: Obtener las subtareas de un padre ---
  static async getSubtasks(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const tasks = await taskService.getSubtasks(id);
      res.json(tasks); // Si no hay subtareas, devuelve []
    } catch (error: unknown) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  // --- MODIFICADO: Ahora acepta el ID por parámetro de URL ---
  static async getMetrics(req: Request, res: Response) {
    try {
      // Tomamos el ID si viene en la ruta (/metrics/:id)
      const taskId = req.params.id as string | undefined;
      const metrics = await taskService.getMetrics(taskId);
      res.json(metrics);
    } catch (error: unknown) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async updateTask(req: Request, res: Response) {
    try {
      const id = req.params.id as string; 
      const [updatedCount, tasks] = await taskService.updateTask(id, req.body);
      
      if (updatedCount === 0) {
        res.status(404).json({ error: 'No encontrado' });
        return;
      }
      res.json(tasks[0]);
    } catch (error: unknown) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async deleteTask(req: Request, res: Response) {
    try {
      const id = req.params.id as string; 
      const deletedCount = await taskService.deleteTask(id);
      
      if (deletedCount === 0) {
        res.status(404).json({ error: 'No encontrado' });
        return;
      }
      res.status(204).send();
    } catch (error: unknown) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}