import { ref, watch, type Ref } from 'vue'

/**
 * Composable для debounce значений
 * Часто используется на собеседованиях для оптимизации производительности
 */
export function useDebounce<T>(value: Ref<T>, delay = 500) {
  const debouncedValue = ref(value.value) as Ref<T>

  let timeoutId: NodeJS.Timeout | null = null

  watch(value, (newValue) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })

  return debouncedValue
}

/**
 * Composable для debounce функций
 */
export function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  delay = 500
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null

  return function debouncedFn(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
