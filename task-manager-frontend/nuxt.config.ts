// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@vueuse/nuxt',
    '@pinia/nuxt',
    // Временно отключаем проблемные модули
    // '@vee-validate/nuxt',
    // '@nuxtjs/i18n',
  ],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3001/api/v1',
    }
  },

  // TypeScript конфигурация
  typescript: {
    strict: true,
    typeCheck: process.env.NODE_ENV === 'production', // Проверка типов только в production
  },

  // VeeValidate конфигурация (временно отключен)
  // veeValidate: {
  //   autoImports: true,
  // },

  // i18n конфигурация (временно отключен)
  // i18n: {
  //   locales: [
  //     { code: 'ru', file: 'ru.json', name: 'Русский' },
  //     { code: 'en', file: 'en.json', name: 'English' },
  //   ],
  //   lazy: true,
  //   langDir: 'locales',
  //   defaultLocale: 'ru',
  //   strategy: 'no_prefix',
  // },

  app: {
    head: {
      title: 'Task Manager',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Full-stack Task Manager Application' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  ssr: false, // SPA mode для простоты
})
