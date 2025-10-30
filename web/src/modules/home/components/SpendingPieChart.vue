<template>
  <v-card class="pa-6 mt-4" elevation="1">
    <div class="d-flex align-center mb-6">
      <v-icon size="24" class="mr-3">mdi-chart-bar</v-icon>
      <h2 class="text-h5 font-weight-medium">
        Análise de Gastos por Categoria
      </h2>
    </div>
    
    <div class="chart-container">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
    
    <!-- Estatísticas detalhadas -->
    <div class="mt-8">
      <div class="d-flex align-center justify-space-between mb-4">
        <h3 class="text-h6 font-weight-medium">
          <v-icon class="mr-2">mdi-chart-line</v-icon>
          Estatísticas Detalhadas
        </h3>
        <v-btn
          :icon="showDetails ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          variant="text"
          size="small"
          @click="toggleDetails"
          :title="showDetails ? 'Recolher estatísticas' : 'Expandir estatísticas'"
        >
        </v-btn>
      </div>
      
      <v-expand-transition>
        <div v-if="showDetails" class="details-container">
          <v-row>
            <v-col cols="12" md="6" v-for="category in detailedCategories" :key="category.name">
              <v-card class="pa-4 category-card" dark>
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <h4 class="text-subtitle-1 font-weight-bold">{{ category.name }}</h4>
                    <p class="text-h6 mb-0">{{ formatValue(category.total) }}</p>
                    <p class="text-caption opacity-70">{{ category.percentage }}% do total</p>
                  </div>
                  <div class="category-indicator" :style="{ backgroundColor: category.color }"></div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-expand-transition>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import type { ChartData, ChartOptions } from 'chart.js'
import { useCategories } from '../composables/useCategories'

const { categories, loadCategories } = useCategories()

// Estado do dropdown das estatísticas detalhadas
const showDetails = ref(true)

// Função para alternar a exibição das estatísticas
const toggleDetails = () => {
  showDetails.value = !showDetails.value
}

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// Paleta minimalista - tons suaves e profissionais
const chartPalette = [
  '#1976d2', // Azul principal
  '#388e3c', // Verde
  '#f57c00', // Laranja
  '#7b1fa2', // Roxo
  '#d32f2f', // Vermelho
  '#0288d1', // Azul claro
  '#689f38', // Verde claro
  '#fbc02d', // Amarelo
  '#5d4037', // Marrom
  '#455a64', // Cinza azulado
]

// Função para formatar valores monetários
const formatValue = (value: number) => {
  if (!value) return 'R$ 0,00'
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

// Computed para dados do gráfico
const chartData = computed<ChartData<'bar'>>(() => {
  const filteredCategories = categories.value
    .filter((c: any) => c.type !== 'ENTRY')
    .filter((c: any) => c.total > 0)
    .sort((a: any, b: any) => b.total - a.total) // Ordenar por valor decrescente

  const labels = filteredCategories.map((c: any) => c.name)
  const data = filteredCategories.map((c: any) => c.total || 0)
  const colors = filteredCategories.map((_, index) => chartPalette[index % chartPalette.length])

  return {
    labels,
    datasets: [
      {
        label: 'GASTOS POR CATEGORIA',
        data,
        backgroundColor: colors.map(color => `${color}80`), // Adicionar transparência
        borderColor: colors,
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  }
})

// Computed para estatísticas detalhadas
const detailedCategories = computed(() => {
  const filteredCategories = categories.value
    .filter((c: any) => c.type !== 'ENTRY')
    .filter((c: any) => c.total > 0)
    .sort((a: any, b: any) => b.total - a.total)

  const totalExpenses = filteredCategories.reduce((sum: number, c: any) => sum + (c.total || 0), 0)

  return filteredCategories.map((category: any, index: number) => ({
    name: category.name,
    total: category.total || 0,
    percentage: totalExpenses > 0 ? ((category.total || 0) / totalExpenses * 100).toFixed(1) : '0.0',
    color: chartPalette[index % chartPalette.length]
  }))
})

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false, // Remover legenda padrão
    },
    title: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 1,
      cornerRadius: 6,
      displayColors: true,
      callbacks: {
        title: (context: any) => {
          return `Categoria: ${context[0].label}`
        },
        label: (context: any) => {
          const value = context.parsed.y
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const percentage = ((value / total) * 100).toFixed(1)
          return [
            `Valor: ${formatValue(value)}`,
            `Percentual: ${percentage}%`
          ]
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      },
      ticks: {
        color: 'rgba(0, 0, 0, 0.7)',
        font: {
          size: 12
        }
      }
    },
    y: {
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      },
      ticks: {
        color: 'rgba(0, 0, 0, 0.7)',
        font: {
          size: 12
        },
        callback: function(value: any) {
          return formatValue(Number(value))
        }
      }
    }
  },
  animation: {
    duration: 2000,
    easing: 'easeInOutQuart'
  }
}

onMounted(() => {
  loadCategories();
})
</script>

<style scoped>
.chart-container {
  height: 400px;
  position: relative;
}

.details-container {
  overflow: hidden;
  transition: all 0.3s ease;
}

/* Responsividade */
@media (max-width: 768px) {
  .chart-container {
    height: 300px;
  }
}
</style>
