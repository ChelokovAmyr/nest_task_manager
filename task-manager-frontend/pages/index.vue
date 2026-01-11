<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated } = useAuth()

onMounted(() => {
  if (isAuthenticated.value) {
    navigateTo('/dashboard')
  } else {
    navigateTo('/login')
  }
})
</script>
