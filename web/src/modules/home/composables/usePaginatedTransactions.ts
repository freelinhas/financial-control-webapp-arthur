import { ref, watch } from 'vue'
import { dashboardService } from '../services/home.service'

export const usePaginatedTransactions = () => {
  const transactions = ref([])
  const total = ref(0)
  const loading = ref(false)

  const page = ref(1)
  const itemsPerPage = ref(10)
  const sortBy = ref([{ key: 'date', order: 'desc' }])

  const load = async () => {
    loading.value = true
    try {
      const sort = sortBy.value[0]
      const res = await dashboardService.getPaginatedTransactions(
        page.value,
        itemsPerPage.value,
        sort.key,
        sort.order.toUpperCase()
      )

      transactions.value = res.data
      total.value = res.total
    } catch (error) {
      console.error('Erro ao carregar transações:', error)
    } finally {
      loading.value = false
    }
  }

  watch([page, itemsPerPage, sortBy], load, { immediate: true })

  return {
    transactions,
    total,
    page,
    itemsPerPage,
    sortBy,
    loading,
    load,
  }
}
