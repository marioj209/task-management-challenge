import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskCreateDTO, TaskMetrics, TaskUpdateDTO } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly http = inject(HttpClient);
  // Ajustá este puerto si tu backend corre en uno distinto
  private readonly apiUrl = 'http://localhost:3000/api/tasks';

  // Signals que manejan el estado global
  public tasks = signal<Task[]>([]);
  public metrics = signal<TaskMetrics>({
    total_estimated_effort: 0,
    effort_not_started: 0,
    effort_in_progress: 0,
    effort_completed: 0
  });

  /**
   * Carga todas las tareas de nivel raíz (sin padre)
   */
  loadTasks(): void {
    this.http.get<Task[]>(this.apiUrl).subscribe({
      next: (data: Task[]) => this.tasks.set(data),
      error: (err: HttpErrorResponse) => console.error('Error cargando tareas', err.message)
    });
  }

  /**
   * Carga las métricas. Si se pasa un ID, carga las métricas específicas de esa sub-jerarquía.
   */
  loadMetrics(rootTaskId?: string): void {
    const url = rootTaskId ? `${this.apiUrl}/metrics/${rootTaskId}` : `${this.apiUrl}/metrics`;
    
    this.http.get<TaskMetrics>(url).subscribe({
      next: (data: TaskMetrics) => this.metrics.set(data),
      error: (err: HttpErrorResponse) => console.error('Error cargando métricas', err.message)
    });
  }

  /**
   * Obtiene una tarea específica (Ideal para la vista de detalle)
   */
  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene las subtareas directas de un padre
   */
  getSubtasks(parentId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/${parentId}/subtasks`);
  }

  /**
   * Crea una nueva tarea o subtarea
   */
  createTask(task: TaskCreateDTO): void {
    this.http.post<Task>(this.apiUrl, task).subscribe({
      next: () => {
        // Refrescamos el estado para que la vista se actualice sola
        this.loadTasks();
        this.loadMetrics();
      },
      error: (err: HttpErrorResponse) => console.error('Error creando tarea', err.message)
    });
  }

  /**
   * Actualiza el estado o detalles de una tarea
   */
  updateTask(id: string, updates: TaskUpdateDTO): void {
    this.http.patch<Task>(`${this.apiUrl}/${id}`, updates).subscribe({
      next: () => {
        this.loadTasks();
        this.loadMetrics();
      },
      error: (err: HttpErrorResponse) => console.error('Error actualizando tarea', err.message)
    });
  }

  /**
   * Elimina una tarea
   */
  deleteTask(id: string): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.loadTasks();
        this.loadMetrics();
      },
      error: (err: HttpErrorResponse) => console.error('Error eliminando tarea', err.message)
    });
  }
}