import api from '@/services/http.service'

export const dashboardService = {
  async getSummary() {
    const response = await api.get('/transactions/balance')
    return response.data
  },

  async getTransactions() {
    const response = await api.get('/transactions?limit=5')
    return response.data
  }
}
