<template>
  <div class="layout">
    <!-- Header -->
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="header-left">
            <NuxtLink to="/dashboard" class="logo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span class="logo-text">Task Manager</span>
            </NuxtLink>
            <nav class="nav">
              <NuxtLink
                to="/dashboard"
                class="nav-link"
                active-class="nav-link-active"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <span>Задачи</span>
              </NuxtLink>
              <NuxtLink
                to="/profile"
                class="nav-link"
                active-class="nav-link-active"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>Профиль</span>
              </NuxtLink>
            </nav>
          </div>

          <div class="header-right">
            <div v-if="user" class="user-info">
              <div class="user-avatar">
                {{ user.firstName?.[0] }}{{ user.lastName?.[0] }}
              </div>
              <div class="user-details">
                <div class="user-name">{{ user.firstName }} {{ user.lastName }}</div>
                <div class="user-email">{{ user.email }}</div>
              </div>
            </div>
            <button
              @click="handleLogout"
              class="btn btn-secondary btn-sm logout-btn"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
              Выйти
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <div class="container">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()

const handleLogout = () => {
  logout()
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
  background: var(--gray-50);
  display: flex;
  flex-direction: column;
}

.header {
  background: white;
  border-bottom: 1px solid var(--gray-200);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: box-shadow 0.3s ease;
  will-change: box-shadow;
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.95);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--gray-900);
  font-weight: 700;
  font-size: 1.25rem;
  transition: color 0.2s;
}

.logo:hover {
  color: var(--primary);
}

.logo svg {
  color: var(--primary);
}

.logo-text {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav {
  display: none;
  align-items: center;
  gap: 0.5rem;
}

@media (min-width: 768px) {
  .nav {
    display: flex;
  }
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  color: var(--gray-700);
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.nav-link:hover {
  background-color: var(--gray-100);
  color: var(--primary);
}

.nav-link-active {
  background-color: rgba(99, 102, 241, 0.1);
  color: var(--primary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: none;
  align-items: center;
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .user-info {
    display: flex;
  }
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: 0 4px 10px rgba(99, 102, 241, 0.25);
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--gray-900);
  line-height: 1.2;
}

.user-email {
  font-size: 0.75rem;
  color: var(--gray-500);
  line-height: 1.2;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
  transition: padding 0.3s ease;
  min-height: calc(100vh - 70px);
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
    transition: padding 0.3s ease;
  }

  .main-content {
    padding: 1.5rem 0;
  }
}

/* Плавная прокрутка для страницы */
.layout {
  scroll-behavior: smooth;
  overflow-x: hidden;
}
</style>
