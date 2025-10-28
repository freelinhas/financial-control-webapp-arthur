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
    const response = await api.get<User[]>('/user')
    return response.data
  },

  async getById(id: number) {
    const response = await api.get<User>(`/user/${id}`)
    return response.data
  },
}

