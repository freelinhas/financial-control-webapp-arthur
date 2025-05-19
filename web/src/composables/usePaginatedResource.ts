import { ref, watch } from 'vue'

export function usePaginatedResource<T>(fetchFn: (params: {
  page: number,
  limit: number,
  sortBy?: string,
  sortOrder?: 'ASC' | 'DESC'
}) => Promise<{ data: T[]; total: number }>) {
  const data = ref<T[]>([])
  const total = ref(0)

  const page = ref(1)
  const itemsPerPage = ref(10)
  const sortBy = ref([{ key: 'id', order: 'desc' }])
  const loading = ref(false)

  const load = async () => {
    loading.value = true
    try {
      const sort = sortBy.value[0] || { key: 'id', order: 'desc' }
      const res = await fetchFn({
        page: page.value,
        limit: itemsPerPage.value,
        sortBy: sort.key,
        sortOrder: sort.order.toUpperCase() as 'ASC' | 'DESC'
      })

      data.value = res.data
      total.value = res.total
    } finally {
      loading.value = false
    }
  }

  const resetPagination = () => {
    page.value = 1
  }

  watch([page, itemsPerPage, sortBy], load, { immediate: true })

  return {
    data,
    total,
    page,
    itemsPerPage,
    sortBy,
    loading,
    load,
    refresh: load,
    resetPagination,
  }
} 