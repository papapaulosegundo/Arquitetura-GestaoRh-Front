import axios from 'axios'

const rawBaseURL = import.meta.env.VITE_BFF_BASE_URL ?? 'http://localhost:8080'
const baseURL = rawBaseURL.replace(/\/+$/, '')
const rawApiPrefix = import.meta.env.VITE_BFF_API_PREFIX ?? ''
const apiPrefix = rawApiPrefix ? `/${rawApiPrefix.replace(/^\/+|\/+$/g, '')}` : ''

export const isMockMode = (import.meta.env.VITE_USE_MOCKS ?? 'false') === 'true'

export function buildBffPath(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${apiPrefix}${normalizedPath}`
}

const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function requestFromBff({ path, method = 'get', data, fallbackFactory }) {
  if (isMockMode) {
    return fallbackFactory ? fallbackFactory() : null
  }

  const response = await client.request({
    url: buildBffPath(path),
    method,
    data,
  })

  return response.data
}

export function getFromBff(path, fallbackFactory) {
  return requestFromBff({ path, method: 'get', fallbackFactory })
}

export function postToBff(path, data, fallbackFactory) {
  return requestFromBff({ path, method: 'post', data, fallbackFactory })
}

export function putToBff(path, data, fallbackFactory) {
  return requestFromBff({ path, method: 'put', data, fallbackFactory })
}

export function deleteFromBff(path, fallbackFactory) {
  return requestFromBff({ path, method: 'delete', fallbackFactory })
}
