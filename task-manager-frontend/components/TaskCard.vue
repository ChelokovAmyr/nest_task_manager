<template>
  <div class="task-card" @click="$emit('edit', task)">
    <div class="task-card-header">
      <h3 class="task-title">{{ task.title }}</h3>
      <button
        @click.stop="$emit('delete', task.id)"
        class="task-delete-btn"
        title="Удалить задачу"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
        </svg>
      </button>
    </div>

    <p v-if="task.description" class="task-description">
      {{ task.description }}
    </p>

    <div class="task-badges">
      <span :class="`badge badge-${task.status}`">
        <span class="badge-icon" :class="`badge-icon-${task.status}`"></span>
        {{ getStatusLabel(task.status) }}
      </span>
      <span :class="`badge badge-${task.priority}`">
        <span class="badge-icon" :class="`badge-icon-${task.priority}`"></span>
        {{ getPriorityLabel(task.priority) }}
      </span>
    </div>

    <div v-if="task.dueDate" class="task-date">
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
      <span>Дедлайн: {{ formatDate(task.dueDate) }}</span>
    </div>

    <div class="task-footer">
      <div class="task-created">
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <span>{{ formatDate(task.createdAt) }}</span>
      </div>
      <div class="task-actions">
        <button
          v-if="task.status !== 'todo'"
          @click.stop="$emit('status-change', task.id, 'todo')"
          class="task-action-btn task-action-prev"
          title="Вернуть к выполнению"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <polyline points="11 17 6 12 11 7"/>
            <polyline points="18 17 13 12 18 7"/>
          </svg>
        </button>
        <button
          v-if="task.status === 'todo'"
          @click.stop="$emit('status-change', task.id, 'in_progress')"
          class="task-action-btn task-action-next"
          title="Взять в работу"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <polyline points="9 18 14 13 9 8"/>
            <polyline points="20 18 15 13 20 8"/>
          </svg>
        </button>
        <button
          v-if="task.status === 'in_progress'"
          @click.stop="$emit('status-change', task.id, 'done')"
          class="task-action-btn task-action-complete"
          title="Завершить"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M5 12l5 5 10-10"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/composables/useTasks'

interface Props {
  task: Task
}

const props = defineProps<Props>()

defineEmits<{
  edit: [task: Task]
  delete: [id: string]
  'status-change': [id: string, status: string]
}>()

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    todo: 'К выполнению',
    in_progress: 'В работе',
    done: 'Выполнено',
  }
  return labels[status] || status
}

const getPriorityLabel = (priority: string) => {
  const labels: Record<string, string> = {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
  }
  return labels[priority] || priority
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<style scoped>
.task-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  border: 2px solid var(--gray-200);
  box-shadow: var(--shadow);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  overflow: hidden;
  will-change: transform, box-shadow, border-color;
  min-height: 200px;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.task-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  transform: scaleX(0);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: left;
  will-change: transform;
}

.task-card:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px) translateZ(0);
}

.task-card:hover::before {
  transform: scaleX(1);
}

.task-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.task-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--gray-900);
  line-height: 1.4;
  flex: 1;
}

.task-delete-btn {
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
  flex-shrink: 0;
}

.task-delete-btn:hover {
  background: #fef2f2;
  color: var(--danger);
}

.task-description {
  color: var(--gray-600);
  font-size: 0.875rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  text-transform: capitalize;
}

.badge-icon {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.badge-icon-todo {
  background-color: #fbbf24;
}

.badge-icon-in-progress {
  background-color: #3b82f6;
}

.badge-icon-done {
  background-color: #10b981;
}

.badge-icon-low {
  background-color: var(--gray-500);
}

.badge-icon-medium {
  background-color: #f59e0b;
}

.badge-icon-high {
  background-color: #ef4444;
}

.task-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--gray-600);
  font-size: 0.8125rem;
  padding: 0.5rem;
  background: var(--gray-50);
  border-radius: 0.5rem;
}

.task-date svg {
  color: var(--gray-500);
  flex-shrink: 0;
}

.task-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid var(--gray-200);
  margin-top: auto;
}

.task-created {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--gray-500);
  font-size: 0.75rem;
}

.task-created svg {
  flex-shrink: 0;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
}

.task-action-btn {
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  background: var(--gray-100);
  color: var(--gray-600);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-action-btn:hover {
  background: var(--gray-200);
  transform: scale(1.1);
}

.task-action-prev:hover {
  background: #fef3c7;
  color: #92400e;
}

.task-action-next:hover {
  background: #dbeafe;
  color: #1e40af;
}

.task-action-complete:hover {
  background: #d1fae5;
  color: #065f46;
}
</style>
