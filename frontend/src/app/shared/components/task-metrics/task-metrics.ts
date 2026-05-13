import { Component, input, computed } from '@angular/core';
import { Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-metrics',
  standalone: true,
  templateUrl: './task-metrics.html',
  styleUrl: './task-metrics.css'
})
export class TaskMetricsComponent {
  public tasks = input<Task[]>([]);

  // --- CÁLCULO DE CANTIDAD DE TAREAS ---
  public totalTasks = computed(() => this.tasks().length);
  public pendingTasks = computed(() => this.tasks().filter(t => t.status === 'TODO').length);
  public inProgressTasks = computed(() => this.tasks().filter(t => t.status === 'IN_PROGRESS').length);
  public doneTasks = computed(() => this.tasks().filter(t => t.status === 'DONE').length);

  // --- CÁLCULO DE PUNTOS DE ESFUERZO ---
  public totalEffort = computed(() => 
    this.tasks().reduce((acc, t) => acc + (t.estimated_effort || 0), 0)
  );
  public pendingEffort = computed(() => 
    this.tasks().filter(t => t.status === 'TODO')
                .reduce((acc, t) => acc + (t.estimated_effort || 0), 0)
  );
  public inProgressEffort = computed(() => 
    this.tasks().filter(t => t.status === 'IN_PROGRESS')
                .reduce((acc, t) => acc + (t.estimated_effort || 0), 0)
  );
  public doneEffort = computed(() => 
    this.tasks().filter(t => t.status === 'DONE')
                .reduce((acc, t) => acc + (t.estimated_effort || 0), 0)
  );
}