import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard';
import{ TaskDetailComponent } from './features/taskDetail/task-detail';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'task/:id', component: TaskDetailComponent },
  { path: '**', redirectTo: '' }
];