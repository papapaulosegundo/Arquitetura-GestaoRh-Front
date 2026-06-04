import axios from 'axios'

const baseURL = import.meta.env.VITE_BFF_BASE_URL ?? 'http://localhost:8080'

export const isMockMode = (import.meta.env.VITE_USE_MOCKS ?? 'true') === 'true'

const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function getFromBff(path, fallbackFactory) {
  if (isMockMode) {
    return fallbackFactory()
  }

  const { data } = await client.get(path)
  return data
}
