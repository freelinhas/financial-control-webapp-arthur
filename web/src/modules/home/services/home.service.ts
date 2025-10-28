import api from '@/services/http.service'

export const dashboardService = {
  async getSummary(month?: number, year?: number) {
    const params: any = {}
    if (month) params.month = month
    if (year) params.year = year
    
    const response = await api.get('/transactions/balance', { params })
    return response.data
  },

  async getPaginatedTransactions(page: number, limit: number, sortBy: string, sortOrder: string, month?: number, year?: number) {
    const params: any = { page, limit, sortBy, sortOrder }
    if (month) params.month = month
    if (year) params.year = year
    
    const response = await api.get('/transactions', { params })
    return response.data
  }
}
