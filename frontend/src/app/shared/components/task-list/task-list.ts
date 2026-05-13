import { Component, input, output } from '@angular/core';
import { Task } from '../../../core/models/task.model';
import { LowerCasePipe } from '@angular/common';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [LowerCasePipe],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskListComponent {
  // Recibimos un array estricto de Tareas mediante Signals
  tasks = input<Task[]>([]);
  
  // Emitimos el ID (string estricto) hacia el Smart Component
  deleteTask = output<string>();
  viewDetails = output<string>();

  onDelete(id: string): void {
    this.deleteTask.emit(id);
  }

  onViewDetails(id: string): void {
    this.viewDetails.emit(id);
  }
}