<template>
  <div class="profile-page">
    <div class="profile-container">
      <div class="profile-header">
        <h1 class="profile-title">Мой профиль</h1>
        <p class="profile-subtitle">Управление данными профиля</p>
      </div>

      <div v-if="user" class="profile-card">
        <div class="profile-avatar-section">
          <div class="profile-avatar">
            {{ user.firstName?.[0] }}{{ user.lastName?.[0] }}
          </div>
          <div class="profile-user-info">
            <h2 class="profile-name">{{ user.firstName }} {{ user.lastName }}</h2>
            <p class="profile-email">{{ user.email }}</p>
          </div>
        </div>

        <form @submit.prevent="handleSave" class="profile-form">
          <div class="form-row">
            <div class="form-group">
              <label class="label">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Имя
              </label>
              <input
                v-model="form.firstName"
                type="text"
                required
                minlength="2"
                maxlength="50"
                class="input"
                placeholder="Ваше имя"
                :disabled="loading"
              />
            </div>

            <div class="form-group">
              <label class="label">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Фамилия
              </label>
              <input
                v-model="form.lastName"
                type="text"
                required
                minlength="2"
                maxlength="50"
                class="input"
                placeholder="Ваша фамилия"
                :disabled="loading"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="label">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              Email адрес
            </label>
            <input
              type="email"
              :value="user.email"
              class="input"
              disabled
            />
            <p class="form-hint">Email адрес нельзя изменить</p>
          </div>

          <div class="form-actions">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading || !hasChanges"
            >
              <svg v-if="!loading" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                <path d="M5 12l5 5 10-10"/>
              </svg>
              <span v-if="loading">Сохранение...</span>
              <span v-else>Сохранить изменения</span>
            </button>
            <button
              type="button"
              @click="resetForm"
              class="btn btn-secondary"
              :disabled="loading || !hasChanges"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>

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
import useApi from '~/utils/api'

definePageMeta({
  middleware: 'auth',
})

const { user, updateUser } = useAuth()
const api = useApi()

const form = ref({
  firstName: '',
  lastName: '',
})

const initialForm = ref({
  firstName: '',
  lastName: '',
})

const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

// Notification state
const showNotification = ref(false)
const notificationTitle = ref('')
const notificationMessage = ref('')
const notificationType = ref<'success' | 'error' | 'info'>('info')

const hasChanges = computed(() => {
  return form.value.firstName !== initialForm.value.firstName ||
         form.value.lastName !== initialForm.value.lastName
})

watch(() => user.value, (newUser) => {
  if (newUser) {
    form.value = {
      firstName: newUser.firstName || '',
      lastName: newUser.lastName || '',
    }
    initialForm.value = {
      firstName: newUser.firstName || '',
      lastName: newUser.lastName || '',
    }
  }
}, { immediate: true })

const resetForm = () => {
  if (user.value) {
    form.value = {
      firstName: user.value.firstName || '',
      lastName: user.value.lastName || '',
    }
  }
  error.value = null
  success.value = false
}

const showNotificationMessage = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
  notificationTitle.value = title
  notificationMessage.value = message
  notificationType.value = type
  showNotification.value = true
}

const handleSave = async () => {
  if (!hasChanges.value) {
    return
  }

  loading.value = true
  error.value = null
  success.value = false

  try {
    const response = await api.patch('/users/profile', {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
    })

    // Обновляем данные пользователя в состоянии
    if (response && user.value) {
      updateUser({
        firstName: response.firstName || form.value.firstName,
        lastName: response.lastName || form.value.lastName,
      })

      // Обновляем initialForm
      initialForm.value = {
        firstName: response.firstName || form.value.firstName,
        lastName: response.lastName || form.value.lastName,
      }
    }

    showNotificationMessage('Профиль обновлен', 'Профиль успешно обновлен', 'success')
  } catch (err: any) {
    console.error('Profile update error:', err)

    // Обработка Network Error
    let errorMessage = 'Ошибка обновления профиля'
    if (err.name === 'NetworkError' || err.message?.includes('Network Error')) {
      errorMessage = 'Не удалось подключиться к серверу. Проверьте, что бэкенд запущен на порту 3001.'
    } else if (err.message) {
      errorMessage = err.message
    } else if (err.response?.data?.message) {
      errorMessage = Array.isArray(err.response.data.message)
        ? err.response.data.message.join(', ')
        : err.response.data.message
    }

    error.value = errorMessage
    showNotificationMessage('Ошибка обновления', errorMessage, 'error')
    // НЕ восстанавливаем форму при ошибке, чтобы пользователь мог исправить данные
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.profile-page {
  max-width: 42rem;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.profile-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-header {
  text-align: center;
}

.profile-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--gray-900), var(--gray-700));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.profile-subtitle {
  color: var(--gray-600);
  font-size: 0.9375rem;
}

.profile-card {
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--gray-200);
}

.profile-avatar-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding-bottom: 2rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--gray-200);
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.5rem;
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.25);
  flex-shrink: 0;
}

.profile-user-info {
  flex: 1;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 0.25rem;
}

.profile-email {
  color: var(--gray-600);
  font-size: 0.9375rem;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
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

.form-hint {
  font-size: 0.75rem;
  color: var(--gray-500);
  margin-top: 0.5rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid var(--gray-200);
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

.alert-success {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .profile-avatar-section {
    flex-direction: column;
    text-align: center;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions .btn {
    width: 100%;
  }
}
</style>
