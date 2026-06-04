import axios from 'axios'

const baseURL = import.meta.env.VITE_BFF_BASE_URL ?? 'http://localhost:8080'

export const isMockMode = (import.meta.env.VITE_USE_MOCKS ?? 'false') === 'true'

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
    url: path,
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
