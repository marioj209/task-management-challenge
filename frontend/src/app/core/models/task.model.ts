
// 1. Tipos estrictos para asegurar que no se ingrese texto inválido
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskUrgency = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// 2. Interfaz principal que refleja la base de datos (lo que recibimos del Backend)
export interface Task {
  id: string; 
  title: string;
  description: string;
  status: TaskStatus;
  urgency: TaskUrgency;
  estimated_effort: number; // El form validará que sea >= 0
  parent_task_id: string | null; // null si es una tarea raíz, string si es subtarea
  created_at?: string; // Opcional por si el backend lo devuelve
  updated_at?: string; // Opcional por si el backend lo devuelve
}

// 3. DTO para CREAR una tarea (No tiene ID ni fechas automáticas)
export interface TaskCreateDTO {
  title: string;
  description: string;
  status: TaskStatus;
  urgency: TaskUrgency;
  estimated_effort: number;
  parent_task_id: string | null;
}

// 4. DTO para ACTUALIZAR una tarea (Todas las propiedades son opcionales)
export interface TaskUpdateDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  urgency?: TaskUrgency;
  estimated_effort?: number;
  parent_task_id?: string | null;
}

// 5. Interfaz para las métricas del Dashboard
export interface TaskMetrics {
  total_estimated_effort: number;
  effort_not_started: number;
  effort_in_progress: number;
  effort_completed: number;
}