<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { loadFromStorage } = useAuth()

onMounted(() => {
  loadFromStorage()

  // Предотвращение прыжков при загрузке
  if (typeof window !== 'undefined') {
    // Сохраняем позицию скролла при переходе между страницами
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString())
    })

    // Восстанавливаем позицию скролла
    const savedScrollPosition = sessionStorage.getItem('scrollPosition')
    if (savedScrollPosition) {
      setTimeout(() => {
        window.scrollTo({
          top: parseInt(savedScrollPosition, 10),
          behavior: 'auto'
        })
        sessionStorage.removeItem('scrollPosition')
      }, 100)
    }
  }
})
</script>

<style>
/* Глобальные стили для плавности */
#__nuxt {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Плавные переходы между страницами */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Предотвращение прыжков при загрузке изображений */
img {
  content-visibility: auto;
  contain-intrinsic-size: 1px 400px;
}

/* Оптимизация рендеринга */
.card,
.stat-card,
.task-card {
  contain: layout style paint;
}
</style>
