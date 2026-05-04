
const API_BASE_URL = 'http://127.0.0.1:8000/api'

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('accessToken')

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  })

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    throw new Error(data?.detail || data?.message || 'Erreur API')
  }

  return data
}
