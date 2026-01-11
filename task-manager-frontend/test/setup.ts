import { vi } from 'vitest'

// Mock для localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

global.localStorage = localStorageMock as any

// Mock для window
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})
