import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL

export const authService = {
  async login(email: string, password: string) {
    const response = await axios.post(`${baseURL}/auth/login`, {
      email,
      password,
    })
    return response.data
  }
}
