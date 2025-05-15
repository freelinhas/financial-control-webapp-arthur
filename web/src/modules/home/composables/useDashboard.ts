import { ref } from 'vue'
import { dashboardService } from '../services/home.service'

export const useDashboard = () => {
  const summary = ref({ balance: 0, income: 0, expense: 0 })
  const transactions = ref([])

  const loadDashboard = async () => {
    const [summaryData, transactionData] = await Promise.all([
      dashboardService.getSummary(),
      dashboardService.getTransactions()
    ])

    summary.value = summaryData;
    transactions.value = transactionData;
  }

  return { summary, transactions, loadDashboard }
}
