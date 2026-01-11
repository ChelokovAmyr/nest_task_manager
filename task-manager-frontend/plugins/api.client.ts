import axios, { AxiosInstance } from 'axios'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api: AxiosInstance = axios.create({
    baseURL: config.public.apiBase || 'http://localhost:3001/api/v1',
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 секунд таймаут
    withCredentials: false,
  })

  // Interceptor для добавления токена
  api.interceptors.request.use(
    (config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Interceptor для обработки ответов
  api.interceptors.response.use(
    (response) => {
      // Backend возвращает данные в формате { success: true, data: ... }
      if (response.data?.success !== undefined) {
        return response.data.data || response.data
      }
      return response.data
    },
    (error) => {
      // Обработка Network Error
      if (!error.response) {
        // Нет ответа от сервера (Network Error, CORS, таймаут)
        const networkError = new Error('Network Error: Не удалось подключиться к серверу. Проверьте, что бэкенд запущен.')
        networkError.name = 'NetworkError'
        return Promise.reject(networkError)
      }

      // Обработка HTTP ошибок
      if (error.response?.status === 401) {
        // Токен истек или невалидный
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
      }

      // Формируем понятное сообщение об ошибке
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.error ||
                          error.message ||
                          'Произошла ошибка при выполнении запроса'

      const formattedError = new Error(
        Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage
      )
      formattedError.name = 'ApiError'

      return Promise.reject(formattedError)
    }
  )

  return {
    provide: {
      api,
    },
  }
})
