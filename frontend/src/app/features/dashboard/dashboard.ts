import { Component, inject, OnInit, computed } from '@angular/core'; // <-- Importamos computed
import { TaskService } from '../../core/services/task';
import { TaskCreateDTO } from '../../core/models/task.model';
import { TaskMetricsComponent } from '../../shared/components/task-metrics/task-metrics';
import { TaskListComponent } from '../../shared/components/task-list/task-list';
import { TaskFormComponent } from '../../shared/components/task-form/task-form';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TaskMetricsComponent, TaskListComponent, TaskFormComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  public taskService = inject(TaskService);
  private router = inject(Router);

  // Creamos una señal "computada" que se actualiza sola
  public rootTasks = computed(() => {
    // 1. Leemos todas las tareas del servicio (asumiendo que la señal se llama tasks)
    const allTasks = this.taskService.tasks(); 

    // 2. Filtramos solo las que son tareas principales (padres)
    const mainTasks = allTasks.filter(t => t.parent_task_id === null);

    // 3. Devolvemos esas tareas principales, inyectándoles el contador
    return mainTasks.map(task => ({
      ...task,
      subtasksCount: allTasks.filter(t => t.parent_task_id === task.id).length
    }));
  });

  ngOnInit(): void {
    this.taskService.loadTasks();
    this.taskService.loadMetrics();
  }

  onTaskCreated(taskDto: TaskCreateDTO): void {
    this.taskService.createTask(taskDto);
  }

  onDeleteTask(id: string): void {
    this.taskService.deleteTask(id);
  }

  onViewTaskDetails(id: string): void {
    this.router.navigate(['/task', id]);
  }
}