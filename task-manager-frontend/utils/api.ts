import { AxiosInstance } from 'axios'

// Получаем API из Nuxt plugin (вызывается в контексте Nuxt)
export default function useApi(): AxiosInstance {
  const { $api } = useNuxtApp()
  return $api as AxiosInstance
}
