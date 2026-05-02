const API_BASE_URL = 'http://127.0.0.1:8000/api'

export async function loginUser(payload) {
  const response = await fetch(`${API_BASE_URL}/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Echec de connexion')
  }

  return data
}
