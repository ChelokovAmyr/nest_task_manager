<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">
            {{ task ? 'Редактировать задачу' : 'Создать новую задачу' }}
          </h2>
          <button @click="$emit('close')" class="modal-close-btn" title="Закрыть">
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="modal-form">
          <div class="form-group">
            <label class="label">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Название задачи *
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              class="input"
              placeholder="Введите название задачи"
            />
          </div>

          <div class="form-group">
            <label class="label">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              Описание
            </label>
            <textarea
              v-model="form.description"
              class="input"
              rows="4"
              placeholder="Добавьте описание задачи..."
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="label">Статус</label>
              <select v-model="form.status" class="select">
                <option value="todo">К выполнению</option>
                <option value="in_progress">В работе</option>
                <option value="done">Выполнено</option>
              </select>
            </div>

            <div class="form-group">
              <label class="label">Приоритет *</label>
              <select v-model="form.priority" required class="select">
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="label">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Дедлайн
            </label>
            <input
              v-model="form.dueDate"
              type="datetime-local"
              class="input"
            />
          </div>

          <div class="modal-actions">
            <button
              type="submit"
              class="btn btn-primary flex-1"
              :disabled="loading"
            >
              <svg v-if="!loading" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                <path d="M5 12l5 5 10-10"/>
              </svg>
              <span v-if="loading">Сохранение...</span>
              <span v-else>{{ task ? 'Сохранить' : 'Создать' }}</span>
            </button>
            <button
              type="button"
              @click="$emit('close')"
              class="btn btn-secondary"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task, CreateTaskDto } from '~/composables/useTasks'

interface Props {
  task?: Task | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  save: [data: CreateTaskDto]
}>()

const loading = ref(false)

const form = ref({
  title: '',
  description: '',
  status: 'todo' as 'todo' | 'in_progress' | 'done',
  priority: 'medium' as 'low' | 'medium' | 'high',
  dueDate: '',
})

watch(() => props.task, (task) => {
  if (task) {
    form.value = {
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '',
    }
  } else {
    form.value = {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  const data: CreateTaskDto = {
    title: form.value.title,
    description: form.value.description || undefined,
    status: form.value.status,
    priority: form.value.priority,
    dueDate: form.value.dueDate ? new Date(form.value.dueDate).toISOString() : undefined,
  }
  emit('save', data)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: opacity;
}

.modal-container {
  background: white;
  border-radius: 1.5rem;
  max-width: 32rem;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.modal-container::-webkit-scrollbar {
  width: 8px;
}

.modal-container::-webkit-scrollbar-track {
  background: var(--gray-100);
  border-radius: 4px;
}

.modal-container::-webkit-scrollbar-thumb {
  background: var(--gray-400);
  border-radius: 4px;
}

.modal-container::-webkit-scrollbar-thumb:hover {
  background: var(--gray-500);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) translateZ(0);
  }
  to {
    opacity: 1;
    transform: translateY(0) translateZ(0);
  }
}

.modal-content {
  padding: 2rem;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--gray-200);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-900);
}

.modal-close-btn {
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  color: var(--gray-400);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close-btn:hover {
  background: var(--gray-100);
  color: var(--gray-600);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group .label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.form-group .label svg {
  color: var(--gray-500);
  flex-shrink: 0;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid var(--gray-200);
}

.flex-1 {
  flex: 1;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }

  .modal-actions .btn {
    width: 100%;
  }
}
</style>
