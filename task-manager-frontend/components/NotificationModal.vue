<template>
  <Teleport to="body">
    <Transition name="notification">
      <div v-if="isOpen" class="notification-overlay" @click.self="handleClose">
        <div class="notification-container" :class="typeClass">
          <div class="notification-icon">
            <svg v-if="type === 'error'" width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            <svg v-else-if="type === 'success'" width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>
          </div>

          <div class="notification-content">
            <h3 class="notification-title">{{ title }}</h3>
            <p v-if="message" class="notification-message">{{ message }}</p>
          </div>

          <button
            type="button"
            class="notification-close"
            @click="handleClose"
            aria-label="Закрыть"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path d="M15 5L5 15M5 5l10 10" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
  title: string
  message?: string
  type?: 'success' | 'error' | 'info'
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 5000,
})

const emit = defineEmits<{
  close: []
}>()

const typeClass = computed(() => {
  return {
    'notification-success': props.type === 'success',
    'notification-error': props.type === 'error',
    'notification-info': props.type === 'info',
  }
})

let timeoutId: NodeJS.Timeout | null = null

const handleClose = () => {
  emit('close')
}

watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.duration > 0) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      handleClose()
    }, props.duration)
  } else if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
})

onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})

// Закрытие по Escape
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen) {
      handleClose()
    }
  }
  document.addEventListener('keydown', handleEscape)
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>

<style scoped>
.notification-overlay {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 2000;
  max-width: 28rem;
  width: 100%;
  animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-container {
  background: white;
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  border-left: 4px solid;
  position: relative;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.notification-success {
  border-left-color: var(--success);
}

.notification-error {
  border-left-color: var(--danger);
}

.notification-info {
  border-left-color: var(--primary);
}

.notification-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  margin-top: 2px;
}

.notification-success .notification-icon {
  color: var(--success);
}

.notification-error .notification-icon {
  color: var(--danger);
}

.notification-info .notification-icon {
  color: var(--primary);
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0 0 0.25rem;
}

.notification-message {
  font-size: 0.875rem;
  color: var(--gray-600);
  margin: 0;
  line-height: 1.5;
}

.notification-close {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-400);
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-top: 2px;
}

.notification-close:hover {
  color: var(--gray-600);
  background: var(--gray-100);
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%) translateZ(0);
  }
  to {
    opacity: 1;
    transform: translateX(0) translateZ(0);
  }
}

/* Vue transitions */
.notification-enter-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-leave-active {
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
}

.notification-enter-active .notification-container,
.notification-leave-active .notification-container {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-enter-from .notification-container {
  transform: translateX(100%) translateZ(0);
}

.notification-leave-to .notification-container {
  transform: translateX(100%) translateZ(0);
}

@media (max-width: 640px) {
  .notification-overlay {
    top: 0.5rem;
    right: 0.5rem;
    left: 0.5rem;
    max-width: none;
  }
}
</style>
