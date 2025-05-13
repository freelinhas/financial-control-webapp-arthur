import axios from 'axios';

export const authService = {
  async login(email: string, password: string) {

    const response = await axios.post('/auth/login', { email, password })
    return response.data
  }
}
