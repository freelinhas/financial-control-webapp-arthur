<template>
  <v-card class="pa-4 mt-15" elevation="2">
    <h3 class="text-subtitle-1 font-weight-medium mb-4">Distribuição de Gastos por Categoria</h3>
    <Bar :data="chartData" :options="chartOptions" />
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { useCategories } from '../composables/useCategories'

const { categories, loadCategories } = useCategories()

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const palette = [
  '#4caf50',
  '#2196f3',
  '#ff9800',
  '#9c27b0',
  '#f44336',
  '#00bcd4',
  '#cddc39',
  '#795548',
]

const chartData = computed<ChartData<'bar'>>(() => {
  const labels = categories.value
    .filter((c: any) => c.type !== 'ENTRY')
    .filter((c: any) => c.total > 0)
    .map((c: any) => c.name)
  const data = categories.value
    .filter((c: any) => c.type !== 'ENTRY')
    .filter((c: any) => c.total > 0)
    .map((c: any) => c.total || 0)

  return {
    labels,
    datasets: [
      {
        label: 'Gastos',
        data,
        backgroundColor: palette.slice(0, data.length),
      },
    ],
  }
})

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#fff',
        font: { size: 14 },
      },
    },
    title: {
      display: false,
    },
  },
}

onMounted(() => {
  loadCategories();
})
</script>
