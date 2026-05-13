import { TaskService } from '../services/taskService';
import { TaskRepository } from '../repositories/taskRepository';

// Simulamos (Mock) el Repositorio para no golpear la base de datos real
jest.mock('../repositories/taskRepository');

describe('TaskService - Lógica de Negocio (Métricas y Recursividad)', () => {
  let taskService: TaskService;
  let mockRepository: jest.Mocked<TaskRepository>;

  beforeEach(() => {
    // Limpiamos los mocks antes de cada test
    jest.clearAllMocks();
    taskService = new TaskService();
    // Accedemos a la instancia mockeada del repositorio
    mockRepository = (taskService as any).taskRepository;
  });

  it('Debe calcular correctamente el esfuerzo de una tarea y toda su descendencia', async () => {
    // 1. PREPARACIÓN (Arrange): Creamos un árbol de tareas falso
    const mockTasks = [
      { id: 'epic-1', estimated_effort: 10, status: 'TODO', parent_task_id: null },
      { id: 'sub-1', estimated_effort: 5, status: 'IN_PROGRESS', parent_task_id: 'epic-1' },
      { id: 'sub-sub-1', estimated_effort: 8, status: 'DONE', parent_task_id: 'sub-1' },
      { id: 'epic-2', estimated_effort: 20, status: 'TODO', parent_task_id: null } // Tarea de otra rama
    ];

    // Le decimos al mock que cuando llamen a findAll, devuelva nuestra lista falsa
    mockRepository.findAll.mockResolvedValue(mockTasks as any);

    // 2. ACCIÓN (Act): Calculamos las métricas solo para la rama 'epic-1'
    const metrics = await taskService.getMetrics('epic-1');

    // 3. AFIRMACIÓN (Assert): Verificamos que las matemáticas sean exactas
    // El total debe ser 10 (epic-1) + 5 (sub-1) + 8 (sub-sub-1) = 23. (Ignora epic-2)
    expect(metrics.total_estimated_effort).toBe(23);
    
    // Verificamos los estados individuales
    expect(metrics.effort_not_started).toBe(10); // epic-1
    expect(metrics.effort_in_progress).toBe(5);  // sub-1
    expect(metrics.effort_completed).toBe(8);    // sub-sub-1
  });

  it('Debe calcular correctamente el esfuerzo total de todo el proyecto', async () => {
    const mockTasks = [
      { id: 'epic-1', estimated_effort: 10, status: 'TODO', parent_task_id: null },
      { id: 'sub-1', estimated_effort: 5, status: 'IN_PROGRESS', parent_task_id: 'epic-1' },
      { id: 'epic-2', estimated_effort: 20, status: 'TODO', parent_task_id: null }
    ];

    mockRepository.findAll.mockResolvedValue(mockTasks as any);

    // Al no pasar ID, calcula todo el tablero
    const metrics = await taskService.getMetrics();

    // El total debe ser 10 + 5 + 20 = 35
    expect(metrics.total_estimated_effort).toBe(35);
    expect(metrics.effort_not_started).toBe(30); // 10 + 20
    expect(metrics.effort_in_progress).toBe(5);
  });

it('debería fallar al crear una tarea con esfuerzo negativo', async () => {
    await expect(taskService.createTask({
      title: 'Tarea Inválida',
      description: 'Prueba de error',
      estimated_effort: -10
    })).rejects.toThrow('ValidationError: El esfuerzo estimado no puede ser negativo');
  });
});