import { Task } from '../models/task';
import { CreateTaskDTO, UpdateTaskDTO } from '../interface/taskDTO';

export class TaskRepository {
  async create(data: CreateTaskDTO): Promise<Task> {
    return await Task.create(data as any);
  }

  async findAll(): Promise<Task[]> {
    return await Task.findAll();
  }

  async findById(id: string): Promise<Task | null> {
    return await Task.findByPk(id);
  }

  async update(id: string, data: UpdateTaskDTO): Promise<[number, Task[]]> {
    const [updatedCount] = await Task.update(data, { where: { id } });
    const updatedTask = await this.findById(id);
    return [updatedCount, updatedTask ? [updatedTask] : []];
  }

  async delete(id: string): Promise<number> {
    return await Task.destroy({ where: { id } });
  }
}