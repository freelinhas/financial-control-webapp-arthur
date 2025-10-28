import api from '@/services/http.service'

export interface Transaction {
  id: number
  description: string
  value: string
  type: 'ENTRY' | 'EXIT'
  date: string
  userId: number
  category: {
    id: number
    name: string
  }
}

export interface CreateTransactionDto {
  description: string
  value: number
  type: 'ENTRY' | 'EXIT'
  date: string
  categoryId: number
}

export interface UpdateTransactionDto {
  description?: string
  value?: number
  type?: 'ENTRY' | 'EXIT'
  date?: string
  categoryId?: number
}

export const adminTransactionService = {
  async getAll(params: {
    page: number
    limit: number
    sortBy?: string
    sortOrder?: 'ASC' | 'DESC'
    month?: number
    year?: number
  }) {
    const response = await api.get<{ data: Transaction[]; total: number }>('/transactions', {
      params,
    })
    return response.data
  },

  async getById(id: number) {
    const response = await api.get<Transaction>(`/transactions/${id}`)
    return response.data
  },

  async create(dto: CreateTransactionDto) {
    const response = await api.post<Transaction>('/transactions', dto)
    return response.data
  },

  async update(id: number, dto: UpdateTransactionDto) {
    const response = await api.patch(`/transactions/${id}`, dto)
    return response.data
  },

  async delete(id: number) {
    const response = await api.delete(`/transactions/${id}`)
    return response.data
  },
}

