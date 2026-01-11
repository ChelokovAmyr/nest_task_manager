import useApi from '~/utils/api'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  isActive: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface AuthResponse {
  user: User
  token: string
}

export const useAuth = () => {
  const api = useApi()
  const user = useState<User | null>('user', () => null)
  const token = useState<string | null>('token', () => null)
  const isAuthenticated = computed(() => !!user.value && !!token.value)

  // Загрузка данных из localStorage
  const loadFromStorage = () => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
      }
    }
  }

  // Сохранение в localStorage
  const saveToStorage = (newToken: string, newUser: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      token.value = newToken
      user.value = newUser
    }
  }

  // Обновление данных пользователя
  const updateUser = (updatedUser: Partial<User>) => {
    if (user.value) {
      const newUser = { ...user.value, ...updatedUser }
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('auth_token')
        if (storedToken) {
          localStorage.setItem('user', JSON.stringify(newUser))
          user.value = newUser
        }
      }
    }
  }

  // Очистка данных
  const clearAuth = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    }
    user.value = null
    token.value = null
  }

  // Логин
  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials)
      saveToStorage(response.token, response.user)
      return response
    } catch (error: any) {
      let message = 'Ошибка входа'
      if (error.name === 'NetworkError' || error.message?.includes('Network Error')) {
        message = 'Не удалось подключиться к серверу. Проверьте, что бэкенд запущен.'
      } else if (error.message) {
        message = error.message
      } else if (error.response?.data?.message) {
        message = Array.isArray(error.response.data.message)
          ? error.response.data.message.join(', ')
          : error.response.data.message
      }
      throw new Error(message)
    }
  }

  // Регистрация
  const register = async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data)
      saveToStorage(response.token, response.user)
      return response
    } catch (error: any) {
      let message = 'Ошибка регистрации'
      if (error.name === 'NetworkError' || error.message?.includes('Network Error')) {
        message = 'Не удалось подключиться к серверу. Проверьте, что бэкенд запущен.'
      } else if (error.message) {
        message = error.message
      } else if (error.response?.data?.message) {
        message = Array.isArray(error.response.data.message)
          ? error.response.data.message.join(', ')
          : error.response.data.message
      }
      throw new Error(message)
    }
  }

  // Выход
  const logout = () => {
    clearAuth()
    navigateTo('/login')
  }

  // Инициализация при загрузке
  if (typeof window !== 'undefined') {
    loadFromStorage()
  }

  return {
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    login,
    register,
    logout,
    clearAuth,
    loadFromStorage,
    saveToStorage,
    updateUser,
  }
}
