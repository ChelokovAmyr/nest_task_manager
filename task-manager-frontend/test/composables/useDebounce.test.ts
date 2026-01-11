import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ref } from 'vue'
import { useDebounce } from '~/composables/useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should debounce value changes', async () => {
    const value = ref('initial')
    const debouncedValue = useDebounce(value, 500)

    expect(debouncedValue.value).toBe('initial')

    value.value = 'updated'
    expect(debouncedValue.value).toBe('initial')

    vi.advanceTimersByTime(500)
    expect(debouncedValue.value).toBe('updated')
  })

  it('should cancel previous timeout on rapid changes', async () => {
    const value = ref('initial')
    const debouncedValue = useDebounce(value, 500)

    value.value = 'first'
    vi.advanceTimersByTime(300)

    value.value = 'second'
    vi.advanceTimersByTime(300)

    expect(debouncedValue.value).toBe('initial')

    vi.advanceTimersByTime(200)
    expect(debouncedValue.value).toBe('second')
  })
})
