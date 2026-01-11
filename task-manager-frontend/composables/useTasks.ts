import useApi from '~/utils/api'

export interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  createdAt: string
  updatedAt: string
  user_id: string
}

export interface CreateTaskDto {
  title: string
  description?: string
  status?: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
}

export interface UpdateTaskDto {
  title?: string
  description?: string
  status?: 'todo' | 'in_progress' | 'done'
  priority?: 'low' | 'medium' | 'high'
  dueDate?: string
}

export interface TaskFilters {
  status?: string
  priority?: string
  search?: string
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface TaskStats {
  total: number
  byStatus: {
    todo: number
    in_progress: number
    done: number
  }
  byPriority: {
    low: number
    medium: number
    high: number
  }
  overdue: number
}

export const useTasks = () => {
  const api = useApi()
  const tasks = useState<Task[]>('tasks', () => [])
  const currentTask = useState<Task | null>('currentTask', () => null)
  const loading = useState<boolean>('tasksLoading', () => false)
  const error = useState<string | null>('tasksError', () => null)

  // Получить все задачи
  const fetchTasks = async (filters?: TaskFilters): Promise<Task[] | PaginatedResponse<Task>> => {
    loading.value = true
    error.value = null
    try {
      const params = new URLSearchParams()
      if (filters?.status) params.append('status', filters.status)
      if (filters?.priority) params.append('priority', filters.priority)
      if (filters?.search) params.append('search', filters.search)
      if (filters?.sortBy) params.append('sortBy', filters.sortBy)
      if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder)
      if (filters?.page) params.append('page', filters.page.toString())
      if (filters?.limit) params.append('limit', filters.limit.toString())

      const response = await api.get<Task[] | PaginatedResponse<Task>>(
        `/tasks${params.toString() ? `?${params.toString()}` : ''}`
      )

      if (Array.isArray(response)) {
        tasks.value = response
        return response
      } else {
        tasks.value = response.data
        return response
      }
    } catch (err: any) {
      const errorMsg = err.name === 'NetworkError' || err.message?.includes('Network Error')
        ? 'Не удалось подключиться к серверу'
        : err.message || err.response?.data?.message || 'Не удалось загрузить задачи'
      error.value = Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg
      throw err
    } finally {
      loading.value = false
    }
  }

  // Получить задачу по ID
  const fetchTask = async (id: string): Promise<Task> => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<Task>(`/tasks/${id}`)
      currentTask.value = response
      return response
    } catch (err: any) {
      const errorMsg = err.name === 'NetworkError' || err.message?.includes('Network Error')
        ? 'Не удалось подключиться к серверу'
        : err.message || err.response?.data?.message || 'Не удалось загрузить задачу'
      error.value = Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg
      throw err
    } finally {
      loading.value = false
    }
  }

  // Создать задачу
  const createTask = async (data: CreateTaskDto): Promise<Task> => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post<Task>('/tasks', data)
      tasks.value.push(response)
      return response
    } catch (err: any) {
      const errorMsg = err.name === 'NetworkError' || err.message?.includes('Network Error')
        ? 'Не удалось подключиться к серверу'
        : err.message || err.response?.data?.message || 'Не удалось создать задачу'
      error.value = Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg
      throw err
    } finally {
      loading.value = false
    }
  }

  // Обновить задачу
  const updateTask = async (id: string, data: UpdateTaskDto): Promise<Task> => {
    loading.value = true
    error.value = null
    try {
      const response = await api.patch<Task>(`/tasks/${id}`, data)
      const index = tasks.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tasks.value[index] = response
      }
      if (currentTask.value?.id === id) {
        currentTask.value = response
      }
      return response
    } catch (err: any) {
      const errorMsg = err.name === 'NetworkError' || err.message?.includes('Network Error')
        ? 'Не удалось подключиться к серверу'
        : err.message || err.response?.data?.message || 'Не удалось обновить задачу'
      error.value = Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg
      throw err
    } finally {
      loading.value = false
    }
  }

  // Удалить задачу
  const deleteTask = async (id: string): Promise<void> => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/tasks/${id}`)
      tasks.value = tasks.value.filter(t => t.id !== id)
      if (currentTask.value?.id === id) {
        currentTask.value = null
      }
    } catch (err: any) {
      const errorMsg = err.name === 'NetworkError' || err.message?.includes('Network Error')
        ? 'Не удалось подключиться к серверу'
        : err.message || err.response?.data?.message || 'Не удалось удалить задачу'
      error.value = Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg
      throw err
    } finally {
      loading.value = false
    }
  }

  // Получить статистику
  const fetchStats = async (): Promise<TaskStats> => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<TaskStats>('/tasks/stats')
      return response
    } catch (err: any) {
      const errorMsg = err.name === 'NetworkError' || err.message?.includes('Network Error')
        ? 'Не удалось подключиться к серверу'
        : err.message || err.response?.data?.message || 'Не удалось загрузить статистику'
      error.value = Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    tasks: readonly(tasks),
    currentTask: readonly(currentTask),
    loading: readonly(loading),
    error: readonly(error),
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    fetchStats,
  }
}
