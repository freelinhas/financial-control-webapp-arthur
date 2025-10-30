import api from '@/services/http.service'

export const categoryService = {
  async getCategories() {
    const response = await api.get('/categories')
    return response.data
  },

  async getCategoriesWithTotal() {
    const response = await api.get('/categories/totals')
    return response.data
  },

  async createCategory(data: { name: string; type: 'ENTRY' | 'EXIT' }) {
    const response = await api.post('/categories', data)
    return response.data
  },

  async updateCategory(id: number, data: { name: string; type: 'ENTRY' | 'EXIT' }) {
    const response = await api.put(`/categories/${id}`, data)
    return response.data
  },
}
