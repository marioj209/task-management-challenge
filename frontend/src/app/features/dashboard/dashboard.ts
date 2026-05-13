import { Component, inject, OnInit } from '@angular/core';
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

  ngOnInit(): void {
    // Cuando el dashboard carga, le decimos al servicio que traiga todo.
    this.taskService.loadTasks();
    this.taskService.loadMetrics();
  }

  onTaskCreated(taskDto: TaskCreateDTO): void {
    // Como estamos en el Dashboard (raíz), el parent_task_id siempre será null
    this.taskService.createTask(taskDto);
  }

  onDeleteTask(id: string): void {
    this.taskService.deleteTask(id);
  }

  onViewTaskDetails(id: string): void {
    // Navegamos a la vista de detalle 
    this.router.navigate(['/task', id]);
  }
}