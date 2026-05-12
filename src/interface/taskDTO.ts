export interface CreateTaskDTO {
  title: string;
  description: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  urgency?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimated_effort?: number;
  parent_task_id?: string | null;
}

export type UpdateTaskDTO = Partial<CreateTaskDTO>;