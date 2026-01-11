import { defineStore } from 'pinia'
import type { Task, TaskFilters, PaginatedResponse, TaskStats } from '~/composables/useTasks'

interface TasksState {
  tasks: Task[]
  currentTask: Task | null
  loading: boolean
  error: string | null
  stats: TaskStats | null
  filters: TaskFilters
}

export const useTasksStore = defineStore('tasks', {
  state: (): TasksState => ({
    tasks: [],
    currentTask: null,
    loading: false,
    error: null,
    stats: null,
    filters: {
      status: '',
      priority: '',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'DESC',
    },
  }),

  getters: {
    getTasks: (state) => state.tasks,
    getCurrentTask: (state) => state.currentTask,
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
    getStats: (state) => state.stats,
    getFilters: (state) => state.filters,

    getTasksByStatus: (state) => {
      return (status: 'todo' | 'in_progress' | 'done') =>
        state.tasks.filter(task => task.status === status)
    },

    getTasksByPriority: (state) => {
      return (priority: 'low' | 'medium' | 'high') =>
        state.tasks.filter(task => task.priority === priority)
    },
  },

  actions: {
    setTasks(tasks: Task[]) {
      this.tasks = tasks
    },

    setCurrentTask(task: Task | null) {
      this.currentTask = task
    },

    setLoading(loading: boolean) {
      this.loading = loading
    },

    setError(error: string | null) {
      this.error = error
    },

    setStats(stats: TaskStats) {
      this.stats = stats
    },

    setFilters(filters: Partial<TaskFilters>) {
      this.filters = { ...this.filters, ...filters }
    },

    resetFilters() {
      this.filters = {
        status: '',
        priority: '',
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      }
    },

    addTask(task: Task) {
      this.tasks.push(task)
    },

    updateTask(updatedTask: Task) {
      const index = this.tasks.findIndex(t => t.id === updatedTask.id)
      if (index !== -1) {
        this.tasks[index] = updatedTask
      }
      if (this.currentTask?.id === updatedTask.id) {
        this.currentTask = updatedTask
      }
    },

    removeTask(taskId: string) {
      this.tasks = this.tasks.filter(t => t.id !== taskId)
      if (this.currentTask?.id === taskId) {
        this.currentTask = null
      }
    },
  },
})
