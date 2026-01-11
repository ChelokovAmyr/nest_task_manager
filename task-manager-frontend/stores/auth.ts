import { defineStore } from 'pinia'
import type { User } from '~/composables/useAuth'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
  }),

  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    getIsAuthenticated: (state) => state.isAuthenticated,
  },

  actions: {
    setUser(user: User | null) {
      this.user = user
      this.isAuthenticated = !!user
      if (typeof window !== 'undefined' && user) {
        localStorage.setItem('user', JSON.stringify(user))
      }
    },

    setToken(token: string | null) {
      this.token = token
      if (typeof window !== 'undefined') {
        if (token) {
          localStorage.setItem('auth_token', token)
        } else {
          localStorage.removeItem('auth_token')
        }
      }
    },

    login(user: User, token: string) {
      this.setUser(user)
      this.setToken(token)
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
      }
    },

    loadFromStorage() {
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('auth_token')
        const storedUser = localStorage.getItem('user')

        if (storedToken && storedUser) {
          try {
            this.setToken(storedToken)
            this.setUser(JSON.parse(storedUser))
          } catch (error) {
            console.error('Error loading auth from storage:', error)
            this.logout()
          }
        }
      }
    },

    updateUser(updatedUser: Partial<User>) {
      if (this.user) {
        this.setUser({ ...this.user, ...updatedUser })
      }
    },
  },
})
