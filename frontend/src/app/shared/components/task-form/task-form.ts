import { Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskCreateDTO, TaskStatus, TaskUrgency } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.html', // <-- Sin el .component
  styleUrl: './task-form.css'      // <-- Sin el .component
})
export class TaskFormComponent {
  createTask = output<TaskCreateDTO>();

  taskForm = new FormGroup({
    title: new FormControl<string>('', { 
      nonNullable: true, 
      validators: [Validators.required] 
    }),
    description: new FormControl<string>('', { 
      nonNullable: true 
    }),
    urgency: new FormControl<TaskUrgency>('MEDIUM', { 
      nonNullable: true 
    }),
    estimated_effort: new FormControl<number>(0, { 
      nonNullable: true, 
      validators: [Validators.min(0)] 
    }),
    status: new FormControl<TaskStatus>('TODO', { 
      nonNullable: true 
    }),
    parent_task_id: new FormControl<string | null>(null)
  });

  onSubmit(): void {
    if (this.taskForm.valid) {
      const formData: TaskCreateDTO = this.taskForm.getRawValue();
      this.createTask.emit(formData);
      
      this.taskForm.reset({
        title: '',
        description: '',
        urgency: 'MEDIUM',
        estimated_effort: 0,
        status: 'TODO',
        parent_task_id: null
      });
    }
  }
}