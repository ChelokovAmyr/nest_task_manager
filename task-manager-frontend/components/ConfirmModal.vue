<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="handleCancel">
        <div class="modal-container confirm-modal">
          <div class="modal-header">
            <div class="modal-icon" :class="iconClass">
              <svg v-if="type === 'danger'" width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
              <svg v-else width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
              </svg>
            </div>
            <h2 class="modal-title">{{ title }}</h2>
          </div>

          <div class="modal-body">
            <p class="modal-message">{{ message }}</p>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="handleCancel"
              :disabled="loading"
            >
              {{ cancelText }}
            </button>
            <button
              type="button"
              class="btn"
              :class="confirmButtonClass"
              @click="handleConfirm"
              :disabled="loading"
            >
              <span v-if="loading" class="loading-spinner-small"></span>
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
  title?: string
  message: string
  type?: 'danger' | 'warning' | 'info'
  confirmText?: string
  cancelText?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Подтверждение',
  type: 'info',
  confirmText: 'Подтвердить',
  cancelText: 'Отмена',
  loading: false,
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const iconClass = computed(() => {
  return {
    'icon-danger': props.type === 'danger',
    'icon-warning': props.type === 'warning',
    'icon-info': props.type === 'info',
  }
})

const confirmButtonClass = computed(() => {
  return {
    'btn-danger': props.type === 'danger',
    'btn-warning': props.type === 'warning',
    'btn-primary': props.type === 'info',
  }
})

const handleConfirm = () => {
  if (!props.loading) {
    emit('confirm')
  }
}

const handleCancel = () => {
  if (!props.loading) {
    emit('cancel')
  }
}

// Закрытие по Escape
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen && !props.loading) {
      handleCancel()
    }
  }
  document.addEventListener('keydown', handleEscape)
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
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
  z-index: 2000;
  padding: 1rem;
  animation: fadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.confirm-modal {
  background: white;
  border-radius: 1rem;
  max-width: 28rem;
  width: 100%;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateZ(0);
  backface-visibility: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 1.5rem 1rem;
}

.modal-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-danger {
  background: #fef2f2;
  color: #dc2626;
}

.icon-warning {
  background: #fef3c7;
  color: #f59e0b;
}

.icon-info {
  background: #dbeafe;
  color: #3b82f6;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--gray-900);
  margin: 0;
}

.modal-body {
  padding: 0 1.5rem 1.5rem;
}

.modal-message {
  color: var(--gray-600);
  line-height: 1.6;
  margin: 0;
}

.modal-footer {
  display: flex;
  gap: 0.75rem;
  padding: 0 1.5rem 1.5rem;
  justify-content: flex-end;
}

.btn-danger {
  background: var(--danger);
  color: white;
  border-color: var(--danger);
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
  border-color: #dc2626;
}

.btn-warning {
  background: var(--warning);
  color: white;
  border-color: var(--warning);
}

.btn-warning:hover:not(:disabled) {
  background: #d97706;
  border-color: #d97706;
}

.loading-spinner-small {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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

/* Vue transitions */
.modal-enter-active {
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-leave-active {
  transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .confirm-modal,
.modal-leave-active .confirm-modal {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from .confirm-modal,
.modal-leave-to .confirm-modal {
  opacity: 0;
  transform: translateY(20px) translateZ(0);
}
</style>
