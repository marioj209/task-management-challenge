import { TaskRepository } from "../repositories/taskRepository";
import { CreateTaskDTO, UpdateTaskDTO } from "../interface/taskDTO";

export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async createTask(data: CreateTaskDTO) {
    if (data.estimated_effort !== undefined && data.estimated_effort < 0) {
      throw new Error('ValidationError: El esfuerzo estimado no puede ser negativo');
    }
    
    return await this.taskRepository.create(data);
  }
  async getAllTasks() {
    return await this.taskRepository.findAll();
  }
  async updateTask(id: string, data: UpdateTaskDTO) {
    return await this.taskRepository.update(id, data);
  }
  async deleteTask(id: string) {
    return await this.taskRepository.delete(id);
  }
  async getTaskById(id: string) {
    // Busca una tarea específica por su ID
    return await this.taskRepository.findById(id);
  }

  async getSubtasks(parentId: string) {
    // Busca todas las tareas que tengan como padre al ID que le pasamos
    return await this.taskRepository.findByParentId(parentId);
  }

  async getMetrics(rootTaskId?: string) {
    const allTasks = await this.taskRepository.findAll();
    const tasks = allTasks.map(t => (typeof t.toJSON === 'function' ? t.toJSON() : t));

    let totalEffort = 0;
    let todoEffort = 0;
    let inProgressEffort = 0;
    let doneEffort = 0;

    const calculateRecursive = (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      totalEffort += task.estimated_effort;
      if (task.status === "TODO") todoEffort += task.estimated_effort;
      if (task.status === "IN_PROGRESS")
        inProgressEffort += task.estimated_effort;
      if (task.status === "DONE") doneEffort += task.estimated_effort;

      const subtasks = tasks.filter((t) => t.parent_task_id === taskId);
      for (const subtask of subtasks) {
        calculateRecursive(subtask.id);
      }
    };

    if (rootTaskId) {
      calculateRecursive(rootTaskId);
    } else {
      const rootTasks = tasks.filter((t) => t.parent_task_id === null);
      for (const root of rootTasks) {
        calculateRecursive(root.id);
      }
    }

    return {
      total_estimated_effort: totalEffort,
      effort_not_started: todoEffort,
      effort_in_progress: inProgressEffort,
      effort_completed: doneEffort,
    };
  }
  
}
