import api from '@/services/http.service'

export interface User {
  id: number
  name: string
  email: string
  isAdmin: boolean
  createdAt: string
}

export const adminUserService = {
  async getAll() {
    const response = await api.get<User[]>('/users')
    return response.data
  },

  async getById(id: number) {
    const response = await api.get<User>(`/users/${id}`)
    return response.data
  },
}

