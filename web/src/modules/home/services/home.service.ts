import api from '@/services/http.service'

export const dashboardService = {
  async getSummary() {
    const response = await api.get('/transactions/balance')
    return response.data
  },

  async getPaginatedTransactions(page: number, limit: number, sortBy: string, sortOrder: string) {
    const response = await api.get('/transactions', {
      params: { page, limit, sortBy, sortOrder }
    })
    return response.data
  }
}
