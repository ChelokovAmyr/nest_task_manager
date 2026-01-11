<template>
  <div class="dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <div>
        <h1 class="dashboard-title">Мои задачи</h1>
        <p class="dashboard-subtitle">Управляйте своими задачами эффективно</p>
      </div>
      <button
        @click="showTaskModal = true"
        class="btn btn-primary create-task-btn"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
          <path d="M12 5v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
        Создать задачу
      </button>
    </div>

    <!-- Stats Cards -->
    <div v-if="stats" class="stats-grid">
      <div
        class="stat-card stat-card-total"
        :class="{ 'stat-card-active': filters.status === '' }"
        @click="handleStatClick('')"
        title="Показать все задачи"
      >
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-label">Всего задач</div>
          <div class="stat-value">{{ stats.total }}</div>
        </div>
      </div>

      <div
        class="stat-card stat-card-todo"
        :class="{ 'stat-card-active': filters.status === 'todo' }"
        @click="handleStatClick('todo')"
        title="Показать задачи к выполнению"
      >
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-label">К выполнению</div>
          <div class="stat-value">{{ stats.byStatus.todo }}</div>
        </div>
      </div>

      <div
        class="stat-card stat-card-progress"
        :class="{ 'stat-card-active': filters.status === 'in_progress' }"
        @click="handleStatClick('in_progress')"
        title="Показать задачи в работе"
      >
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-label">В работе</div>
          <div class="stat-value">{{ stats.byStatus.in_progress }}</div>
        </div>
      </div>

      <div
        class="stat-card stat-card-done"
        :class="{ 'stat-card-active': filters.status === 'done' }"
        @click="handleStatClick('done')"
        title="Показать выполненные задачи"
      >
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M5 12l5 5 10-10"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-label">Выполнено</div>
          <div class="stat-value">{{ stats.byStatus.done }}</div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-card">
      <div class="filters-header">
        <h3 class="filters-title">Фильтры и сортировка</h3>
        <button
          v-if="hasActiveFilters"
          @click="resetFilters"
          class="btn-reset-filters"
          title="Сбросить все фильтры"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M3 3l14 14M17 3L3 17"/>
            <circle cx="10" cy="10" r="7"/>
          </svg>
          Сбросить фильтры
        </button>
      </div>
      <div class="filters-grid">
        <div class="filter-group">
          <label class="label">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            Поиск
          </label>
          <input
            v-model="filters.search"
            type="text"
            class="input"
            placeholder="Поиск по названию..."
            @input="debouncedSearch"
          />
        </div>

        <div class="filter-group">
          <label class="label">Статус</label>
          <select v-model="filters.status" class="select stable-select" @change="loadTasks">
            <option value="">Все статусы</option>
            <option value="todo">К выполнению</option>
            <option value="in_progress">В работе</option>
            <option value="done">Выполнено</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="label">Приоритет</label>
          <select v-model="filters.priority" class="select stable-select" @change="loadTasks">
            <option value="">Все приоритеты</option>
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="label">Сортировка</label>
          <select v-model="filters.sortBy" class="select stable-select" @change="loadTasks">
            <option value="createdAt">Дата создания</option>
            <option value="updatedAt">Дата обновления</option>
            <option value="dueDate">Дедлайн</option>
            <option value="priority">Приоритет</option>
            <option value="title">Название</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tasks Container - фиксированная высота для предотвращения прыжков -->
    <div class="tasks-container">
      <!-- Loading State -->
      <Transition name="fade" mode="out-in">
        <div v-if="loading" key="loading" class="loading-state fade-in">
          <div class="loading-spinner"></div>
          <p class="loading-text">Загрузка задач...</p>
        </div>

        <!-- Tasks Grid -->
        <div v-else-if="tasks.length > 0" key="tasks" class="tasks-grid fade-in">
          <TaskCard
            v-for="task in tasks"
            :key="task.id"
            :task="task"
            @edit="handleEdit"
            @delete="handleDelete"
            @status-change="handleStatusChange"
          />
        </div>

        <!-- Empty State -->
        <div v-else key="empty" class="empty-state fade-in">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5"/>
            </svg>
          </div>
          <h3 class="empty-title">Нет задач</h3>
          <p class="empty-text">Создайте свою первую задачу, чтобы начать работу</p>
          <button @click="showTaskModal = true" class="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path d="M12 5v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Создать первую задачу
          </button>
        </div>
      </Transition>
    </div>

    <!-- Task Modal -->
    <TaskModal
      v-if="showTaskModal"
      :task="editingTask"
      @close="handleModalClose"
      @save="handleTaskSave"
    />

    <!-- Confirm Delete Modal -->
    <ConfirmModal
      :is-open="showDeleteConfirm"
      title="Удаление задачи"
      message="Вы уверены, что хотите удалить эту задачу? Это действие нельзя отменить."
      type="danger"
      confirm-text="Удалить"
      cancel-text="Отмена"
      :loading="deleting"
      @confirm="handleDeleteConfirm"
      @cancel="showDeleteConfirm = false; taskToDelete = null"
    />

    <!-- Notification Modal -->
    <NotificationModal
      :is-open="showNotification"
      :title="notificationTitle"
      :message="notificationMessage"
      :type="notificationType"
      @close="showNotification = false"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { fetchTasks, createTask, updateTask, deleteTask, fetchStats, tasks, loading, error } = useTasks()

const stats = ref<any>(null)
const showTaskModal = ref(false)
const editingTask = ref<any>(null)
const showDeleteConfirm = ref(false)
const taskToDelete = ref<string | null>(null)
const deleting = ref(false)

// Notification state
const showNotification = ref(false)
const notificationTitle = ref('')
const notificationMessage = ref('')
const notificationType = ref<'success' | 'error' | 'info'>('info')

const defaultFilters = {
  search: '',
  status: '',
  priority: '',
  sortBy: 'createdAt',
  sortOrder: 'DESC' as 'ASC' | 'DESC',
}

const filters = ref({ ...defaultFilters })

// Проверка наличия активных фильтров
const hasActiveFilters = computed(() => {
  return filters.value.search !== '' ||
         filters.value.status !== '' ||
         filters.value.priority !== '' ||
         filters.value.sortBy !== 'createdAt' ||
         filters.value.sortOrder !== 'DESC'
})

// Debounce для поиска
let searchTimeout: NodeJS.Timeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadTasks()
  }, 500)
}

const loadTasks = async () => {
  // Сохраняем позицию скролла перед загрузкой
  const scrollPosition = typeof window !== 'undefined' ? window.scrollY : 0

  try {
    await fetchTasks(filters.value)
    await loadStats()

    // Восстанавливаем позицию скролла после загрузки
    if (typeof window !== 'undefined') {
      // Используем requestAnimationFrame для плавного восстановления
      requestAnimationFrame(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: 'auto' // auto вместо smooth для мгновенного восстановления
        })
      })
    }
  } catch (err: any) {
    console.error('Failed to load tasks:', err)
    showNotificationMessage('Ошибка загрузки', err.response?.data?.message || 'Не удалось загрузить задачи', 'error')
    // Восстанавливаем позицию даже при ошибке
    if (typeof window !== 'undefined') {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: 'auto'
        })
      })
    }
  }
}

const loadStats = async () => {
  try {
    stats.value = await fetchStats()
  } catch (err) {
    console.error('Failed to load stats:', err)
  }
}

const handleEdit = (task: any) => {
  editingTask.value = task
  showTaskModal.value = true
}

const handleDelete = (id: string) => {
  taskToDelete.value = id
  showDeleteConfirm.value = true
}

const handleDeleteConfirm = async () => {
  if (!taskToDelete.value) return

  deleting.value = true
  try {
    await deleteTask(taskToDelete.value)
    await loadTasks()
    showDeleteConfirm.value = false
    taskToDelete.value = null
    showNotificationMessage('Задача удалена', 'Задача успешно удалена', 'success')
  } catch (err: any) {
    showNotificationMessage('Ошибка', err.response?.data?.message || 'Не удалось удалить задачу', 'error')
  } finally {
    deleting.value = false
  }
}

const showNotificationMessage = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
  notificationTitle.value = title
  notificationMessage.value = message
  notificationType.value = type
  showNotification.value = true
}

const handleStatClick = (status: string) => {
  filters.value.status = status
  loadTasks()
}

const resetFilters = () => {
  filters.value = { ...defaultFilters }
  loadTasks()
}

const handleStatusChange = async (id: string, status: string) => {
  try {
    await updateTask(id, { status: status as any })
    await loadTasks()
    showNotificationMessage('Статус обновлен', 'Статус задачи успешно изменен', 'success')
  } catch (err: any) {
    showNotificationMessage('Ошибка', err.response?.data?.message || 'Не удалось изменить статус задачи', 'error')
  }
}

const handleModalClose = () => {
  showTaskModal.value = false
  editingTask.value = null
}

const handleTaskSave = async (taskData: any) => {
  try {
    if (editingTask.value) {
      await updateTask(editingTask.value.id, taskData)
      showNotificationMessage('Задача обновлена', 'Задача успешно обновлена', 'success')
    } else {
      await createTask(taskData)
      showNotificationMessage('Задача создана', 'Задача успешно создана', 'success')
    }
    await loadTasks()
    handleModalClose()
  } catch (err: any) {
    showNotificationMessage('Ошибка', err.response?.data?.message || 'Не удалось сохранить задачу', 'error')
  }
}

onMounted(() => {
  loadTasks()
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dashboard-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--gray-900);
  margin-bottom: 0.25rem;
  background: linear-gradient(135deg, var(--gray-900), var(--gray-700));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dashboard-subtitle {
  color: var(--gray-600);
  font-size: 0.9375rem;
}

.create-task-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.25);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
}

@media (min-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  border: 2px solid var(--gray-200);
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  will-change: transform, box-shadow, border-color;
  min-height: 100px;
  cursor: pointer;
  user-select: none;
}

.stat-card-active {
  border-color: var(--primary);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.stat-card-active::before {
  transform: scaleX(1);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  transition: transform 0.3s ease;
  transform: scaleX(0);
  transform-origin: left;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary);
}

.stat-card:hover::before {
  transform: scaleX(1);
}

.stat-card-total::before {
  background: linear-gradient(90deg, var(--gray-600), var(--gray-800));
}

.stat-card-todo::before {
  background: linear-gradient(90deg, #f59e0b, #f97316);
}

.stat-card-progress::before {
  background: linear-gradient(90deg, #3b82f6, #2563eb);
}

.stat-card-done::before {
  background: linear-gradient(90deg, #10b981, #059669);
}

.stat-icon {
  width: 48px;
  height: 48px;
  min-width: 48px;
  min-height: 48px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  display: block;
  width: 24px;
  height: 24px;
  margin: 0;
  flex-shrink: 0;
}

.stat-card-total .stat-icon {
  background: var(--gray-100);
  color: var(--gray-700);
}

.stat-card-todo .stat-icon {
  background: #fef3c7;
  color: #f59e0b;
}

.stat-card-progress .stat-icon {
  background: #dbeafe;
  color: #3b82f6;
}

.stat-card-done .stat-icon {
  background: #d1fae5;
  color: #10b981;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--gray-600);
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--gray-900);
  line-height: 1;
}

.filters-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  border: 1px solid var(--gray-200);
}

.filters-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--gray-200);
}

.filters-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0;
}

.btn-reset-filters {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--gray-100);
  border: 1px solid var(--gray-300);
  border-radius: 0.5rem;
  color: var(--gray-700);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-reset-filters:hover {
  background: var(--gray-200);
  border-color: var(--gray-400);
  color: var(--gray-900);
  transform: translateY(-1px);
}

.btn-reset-filters:active {
  transform: translateY(0);
}

.btn-reset-filters svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
}

@media (min-width: 768px) {
  .filters-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .filters-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group .label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.filter-group .label svg {
  color: var(--gray-500);
}

/* Контейнер для задач - фиксированная минимальная высота */
.tasks-container {
  min-height: 400px;
  position: relative;
  transition: min-height 0.3s ease;
  will-change: min-height;
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  min-height: 400px;
  transition: min-height 0.3s ease, opacity 0.2s ease;
  will-change: opacity, min-height;
}

@media (min-width: 768px) {
  .tasks-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .tasks-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.tasks-container .loading-state,
.tasks-container .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  text-align: center;
  min-height: 400px;
  transition: min-height 0.3s ease, padding 0.3s ease, opacity 0.2s ease;
}

.tasks-grid {
  min-height: 400px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--gray-200);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
  will-change: transform;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: var(--gray-600);
  font-size: 0.9375rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Плавные переходы Vue */
.fade-enter-active {
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}

.fade-leave-active {
  transition: opacity 0.15s ease-in, transform 0.15s ease-in;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(5px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--gray-100);
  color: var(--gray-400);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.empty-text {
  color: var(--gray-600);
  margin-bottom: 1.5rem;
  max-width: 24rem;
}

.alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
}

.alert-error {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}
</style>
