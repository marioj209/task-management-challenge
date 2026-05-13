import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TaskService } from '../../core/services/task';
import { Task, TaskCreateDTO, TaskStatus } from '../../core/models/task.model';
import { TaskMetricsComponent } from '../../shared/components/task-metrics/task-metrics';
import { TaskListComponent } from '../../shared/components/task-list/task-list';
import { TaskFormComponent } from '../../shared/components/task-form/task-form';
import { LowerCasePipe } from '@angular/common';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [TaskMetricsComponent, TaskListComponent, TaskFormComponent,LowerCasePipe],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css'
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public taskService = inject(TaskService);

  // Estado local específico de esta vista
  public currentTask = signal<Task | null>(null);
  public subtasks = signal<Task[]>([]);
  private currentTaskId = '';
  private routeSub: Subscription = new Subscription();

  ngOnInit(): void {
    // Escuchamos los cambios en la URL por si navegamos hacia una subtarea
    this.routeSub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.currentTaskId = id;
        this.loadFullTaskContext();
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe(); // Evitamos memory leaks
  }

  private loadFullTaskContext(): void {
    // 1. Cargamos la tarea actual
    this.taskService.getTaskById(this.currentTaskId).subscribe(task => {
      this.currentTask.set(task);
    });
    
    // 2. Cargamos las subtareas directas
    this.taskService.getSubtasks(this.currentTaskId).subscribe(tasks => {
      this.subtasks.set(tasks);
    });
    
    // 3. ¡Magia recursiva! Pedimos las métricas SOLO para esta rama
    this.taskService.loadMetrics(this.currentTaskId);
  }

  // Interceptamos la creación del form para inyectarle el ID del padre actual
  onSubtaskCreated(dto: TaskCreateDTO): void {
    const subtaskPayload: TaskCreateDTO = {
      ...dto,
      parent_task_id: this.currentTaskId // Sobrescribimos el null por el ID actual
    };

    // Usamos el servicio. (Idealmente, en el servicio esto debería devolver un Observable 
    // para recargar loadFullTaskContext() al terminar. Por ahora usamos un timeout preventivo 
    // o asumimos que la vista se refresca si el servicio dispara un global refresh).
    this.taskService.createTask(subtaskPayload);
    
    // Forzamos la recarga visual de las subtareas tras medio segundo para dar tiempo a la DB
    setTimeout(() => this.loadFullTaskContext(), 500); 
  }

  onDeleteSubtask(id: string): void {
    this.taskService.deleteTask(id);
    setTimeout(() => this.loadFullTaskContext(), 500);
  }

  onViewSubtaskDetails(id: string): void {
    // Navegamos un nivel más profundo en la jerarquía
    this.router.navigate(['/task', id]);
  }

  updateTaskStatus(newStatus: TaskStatus): void {
    this.taskService.updateTask(this.currentTaskId, { status: newStatus });
    setTimeout(() => this.loadFullTaskContext(), 500);
  }

  goBack(): void {
    const parentId = this.currentTask()?.parent_task_id;
    if (parentId) {
      // Si tiene padre, subimos un nivel
      this.router.navigate(['/task', parentId]);
    } else {
      // Si es raíz, volvems al Dashboard
      this.router.navigate(['/']);
    }
  }
}