import { Component, input } from '@angular/core';
import { TaskMetrics } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-metrics',
  standalone: true,
  templateUrl: './task-metrics.html',
  styleUrl: './task-metrics.css'
})
export class TaskMetricsComponent {
  // Inicializamos con un valor por defecto. ¡Cero nulls, cero undefined!
  metrics = input<TaskMetrics>({
    total_estimated_effort: 0,
    effort_not_started: 0,
    effort_in_progress: 0,
    effort_completed: 0
  });
}