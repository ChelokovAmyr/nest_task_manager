import { ref } from 'vue'

export interface ErrorInfo {
  message: string
  code?: string
  status?: number
  timestamp: Date
}

export const useErrorHandler = () => {
  const error = ref<ErrorInfo | null>(null)
  const isError = ref(false)

  const handleError = (err: any): string => {
    isError.value = true

    let errorMessage = 'Произошла неизвестная ошибка'
    let errorCode: string | undefined
    let status: number | undefined

    if (err.name === 'NetworkError' || err.message?.includes('Network Error')) {
      errorMessage = 'Не удалось подключиться к серверу. Проверьте подключение к интернету.'
      errorCode = 'NETWORK_ERROR'
    } else if (err.response) {
      status = err.response.status
      errorCode = `HTTP_${status}`

      switch (status) {
        case 400:
          errorMessage = err.response.data?.message || 'Неверный запрос'
          break
        case 401:
          errorMessage = 'Необходима авторизация'
          errorCode = 'UNAUTHORIZED'
          break
        case 403:
          errorMessage = 'Доступ запрещен'
          errorCode = 'FORBIDDEN'
          break
        case 404:
          errorMessage = 'Ресурс не найден'
          errorCode = 'NOT_FOUND'
          break
        case 422:
          errorMessage = err.response.data?.message || 'Ошибка валидации данных'
          errorCode = 'VALIDATION_ERROR'
          break
        case 500:
          errorMessage = 'Внутренняя ошибка сервера'
          errorCode = 'SERVER_ERROR'
          break
        default:
          errorMessage = err.response.data?.message || `Ошибка ${status}`
      }
    } else if (err.message) {
      errorMessage = err.message
    }

    error.value = {
      message: Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage,
      code: errorCode,
      status,
      timestamp: new Date(),
    }

    // Логирование ошибки
    console.error('Error handled:', error.value)

    return error.value.message
  }

  const clearError = () => {
    error.value = null
    isError.value = false
  }

  const reset = () => {
    clearError()
  }

  return {
    error: readonly(error),
    isError: readonly(isError),
    handleError,
    clearError,
    reset,
  }
}
