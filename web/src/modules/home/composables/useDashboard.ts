import { ref } from 'vue'
import { dashboardService } from '../services/home.service'

export const useDashboard = () => {
  const summary = ref({ balance: 0, income: 0, expense: 0 })

  const loadDashboard = async (month?: number, year?: number) => {
    const [summaryData] = await Promise.all([
      dashboardService.getSummary(month, year),
    ])

    summary.value = summaryData;
  }

  return { summary, loadDashboard }
}
