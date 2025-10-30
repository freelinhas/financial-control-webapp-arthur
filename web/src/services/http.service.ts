import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    // Se receber 401 (não autorizado), faz logout automático
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      sessionStorage.clear()
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default api
