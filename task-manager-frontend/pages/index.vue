<template>
  <div class="index-page">
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>Загрузка...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated, loadFromStorage } = useAuth()

onMounted(async () => {
  // Загружаем данные из localStorage
  loadFromStorage()

  // Небольшая задержка для инициализации
  await nextTick()

  // Редирект в зависимости от авторизации
  if (isAuthenticated.value) {
    await navigateTo('/dashboard')
  } else {
    await navigateTo('/login')
  }
})
</script>

<style scoped>
.index-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray-50);
}

.loading-container {
  text-align: center;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--gray-200);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-container p {
  color: var(--gray-600);
  font-size: 0.9375rem;
}
</style>
