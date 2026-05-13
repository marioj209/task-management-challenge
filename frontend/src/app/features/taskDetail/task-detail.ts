import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TaskService } from '../../core/services/task';
import { Task, TaskStatus, TaskCreateDTO } from '../../core/models/task.model';
import { TaskListComponent } from '../../shared/components/task-list/task-list';
import { TaskFormComponent } from '../../shared/components/task-form/task-form';


@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [TaskListComponent, TaskFormComponent, ReactiveFormsModule],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css'
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public taskService = inject(TaskService);

  public currentTask = signal<Task | null>(null);
  public subtasks = signal<Task[]>([]);
  public isEditing = signal<boolean>(false);
  
  private currentTaskId = '';
  private routeSub: Subscription = new Subscription();

  public editForm = new FormGroup({
    title: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl<string>('', { nonNullable: true }),
    estimated_effort: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] })
  });

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.currentTaskId = id;
        this.loadFullTaskContext();
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  private loadFullTaskContext(): void {
    this.taskService.getTaskById(this.currentTaskId).subscribe(task => {
      this.currentTask.set(task);
      this.editForm.patchValue({
        title: task.title,
        description: task.description,
        estimated_effort: task.estimated_effort
      });
    });
    
    this.taskService.getSubtasks(this.currentTaskId).subscribe(tasks => {
      this.subtasks.set(tasks);
    });
  }

  toggleEditMode(): void {
    if (!this.isEditing()) {
      const current = this.currentTask();
      if (current) {
        this.editForm.patchValue({
          title: current.title,
          description: current.description,
          estimated_effort: current.estimated_effort
        });
      }
    }
    this.isEditing.set(!this.isEditing());
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }

  saveChanges(): void {
    if (this.editForm.valid) {
      const formValues = this.editForm.getRawValue();
      
      const updatePayload: Partial<Task> = {
        title: formValues.title,
        description: formValues.description,
        estimated_effort: formValues.estimated_effort
      };

      if (updatePayload.estimated_effort === 0) {
        updatePayload.status = 'TODO';
      }

      this.taskService.updateTask(this.currentTaskId, updatePayload);
      
      setTimeout(() => {
        this.loadFullTaskContext();
        this.isEditing.set(false);
      }, 300);
    }
  }

  onSubtaskCreated(dto: TaskCreateDTO): void {
    const subtaskPayload: TaskCreateDTO = {
      ...dto,
      parent_task_id: this.currentTaskId 
    };
    this.taskService.createTask(subtaskPayload);
    setTimeout(() => this.loadFullTaskContext(), 500); 
  }

  updateTaskStatus(newStatus: TaskStatus): void {
    this.taskService.updateTask(this.currentTaskId, { status: newStatus });
    setTimeout(() => this.router.navigate(['/']), 300);
  }

  onViewSubtaskDetails(id: string): void {
    this.router.navigate(['/task', id]);
  }

  onDeleteSubtask(id: string): void {
    this.taskService.deleteTask(id);
    setTimeout(() => this.loadFullTaskContext(), 500);
  }

  goBack(): void {
    const parentId = this.currentTask()?.parent_task_id;
    if (parentId) {
      this.router.navigate(['/task', parentId]);
    } else {
      this.router.navigate(['/']);
    }
  }
}