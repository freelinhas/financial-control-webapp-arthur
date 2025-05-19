import { ref } from 'vue'
import { dashboardService } from '../services/home.service'

export const useDashboard = () => {
  const summary = ref({ balance: 0, income: 0, expense: 0 })

  const loadDashboard = async () => {
    const [summaryData] = await Promise.all([
      dashboardService.getSummary(),
    ])

    summary.value = summaryData;
  }

  return { summary, loadDashboard }
}
