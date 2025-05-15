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
}
