<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card animate-fadeIn">
        <div class="auth-header">
          <div class="auth-logo">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1 class="auth-title">Создать аккаунт</h1>
          <p class="auth-subtitle">Зарегистрируйтесь, чтобы начать работу</p>
        </div>

        <form @submit.prevent="handleRegister" class="auth-form">
          <div v-if="error" class="alert alert-error">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            <span>{{ error }}</span>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label class="label">Имя</label>
              <input
                v-model="firstName"
                type="text"
                required
                minlength="2"
                class="input"
                placeholder="Иван"
              />
            </div>

            <div class="form-group">
              <label class="label">Фамилия</label>
              <input
                v-model="lastName"
                type="text"
                required
                minlength="2"
                class="input"
                placeholder="Иванов"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="label">Email адрес</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <input
                v-model="email"
                type="email"
                required
                class="input"
                placeholder="user@example.com"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="label">Пароль</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <input
                v-model="password"
                type="password"
                required
                minlength="8"
                class="input"
                placeholder="Минимум 8 символов"
              />
            </div>
            <p class="form-hint">
              Пароль должен содержать заглавные и строчные буквы, а также цифры
            </p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary w-full"
          >
            <svg v-if="!loading" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path d="M5 12l5 5 10-10"/>
            </svg>
            <span v-if="loading">Регистрация...</span>
            <span v-else>Зарегистрироваться</span>
          </button>
        </form>

        <div class="auth-footer">
          <p class="auth-footer-text">
            Уже есть аккаунт?
            <NuxtLink to="/login" class="auth-link">
              Войдите
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const { register, isAuthenticated } = useAuth()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

onMounted(() => {
  if (isAuthenticated.value) {
    navigateTo('/dashboard')
  }
})

const handleRegister = async () => {
  loading.value = true
  error.value = null

  try {
    await register({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    })
    navigateTo('/dashboard')
  } catch (err: any) {
    error.value = err.message || 'Ошибка регистрации'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
  position: relative;
  overflow: hidden;
}

.auth-page::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: float 20s infinite ease-in-out;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-50px, -50px) rotate(180deg); }
}

.auth-container {
  max-width: 28rem;
  width: 100%;
  position: relative;
  z-index: 1;
}

.auth-card {
  background: white;
  border-radius: 1.5rem;
  padding: 2.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-logo {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
}

.auth-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  color: var(--gray-600);
  font-size: 0.9375rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-hint {
  font-size: 0.75rem;
  color: var(--gray-500);
  margin-top: 0.5rem;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-400);
  pointer-events: none;
}

.input-wrapper .input {
  padding-left: 2.75rem;
}

.alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.alert-error {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}

.auth-footer {
  margin-top: 2rem;
  text-align: center;
}

.auth-footer-text {
  color: var(--gray-600);
  font-size: 0.875rem;
}

.auth-link {
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
  margin-left: 0.25rem;
  transition: color 0.2s;
}

.auth-link:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
