import { ref, watch, type Ref } from 'vue'

/**
 * Composable для работы с localStorage
 * Автоматически синхронизирует значение с localStorage
 */
export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  const storedValue = typeof window !== 'undefined'
    ? localStorage.getItem(key)
    : null

  const value = ref<T>(
    storedValue ? JSON.parse(storedValue) : defaultValue
  ) as Ref<T>

  watch(value, (newValue) => {
    if (typeof window !== 'undefined') {
      if (newValue === null || newValue === undefined) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, JSON.stringify(newValue))
      }
    }
  }, { deep: true })

  return value
}

/**
 * Composable для работы с sessionStorage
 */
export function useSessionStorage<T>(key: string, defaultValue: T): Ref<T> {
  const storedValue = typeof window !== 'undefined'
    ? sessionStorage.getItem(key)
    : null

  const value = ref<T>(
    storedValue ? JSON.parse(storedValue) : defaultValue
  ) as Ref<T>

  watch(value, (newValue) => {
    if (typeof window !== 'undefined') {
      if (newValue === null || newValue === undefined) {
        sessionStorage.removeItem(key)
      } else {
        sessionStorage.setItem(key, JSON.stringify(newValue))
      }
    }
  }, { deep: true })

  return value
}
