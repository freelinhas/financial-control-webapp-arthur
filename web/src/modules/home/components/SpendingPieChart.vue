<template>
  <v-card class="pa-10 mt-15 cyberpunk-chart" elevation="2">
    <div class="d-flex align-center mb-6">
      <v-icon size="28" class="mr-3 neon-icon">mdi-chart-bar</v-icon>
      <h1 class="text-h5 font-weight-bold cyberpunk-title">
        ANÁLISE DE GASTOS POR CATEGORIA
      </h1>
    </div>
    
    <div class="chart-container">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
    
    <!-- Estatísticas detalhadas -->
    <div class="mt-8">
      <div class="d-flex align-center justify-space-between mb-4">
        <h3 class="text-h6 font-weight-bold cyberpunk-subtitle">
          <v-icon class="mr-2">mdi-chart-line</v-icon>
          ESTATÍSTICAS DETALHADAS
        </h3>
        <v-btn
          :icon="showDetails ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          variant="text"
          size="small"
          class="cyberpunk-toggle-btn"
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
import { useCategories } from '../composables/useCategories'

const { categories, loadCategories } = useCategories()

// Estado do dropdown das estatísticas detalhadas
const showDetails = ref(true)

// Função para alternar a exibição das estatísticas
const toggleDetails = () => {
  showDetails.value = !showDetails.value
}

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// Paleta cyberpunk - tons de neon e escuros
const cyberpunkPalette = [
  '#00ffff', // Cyan neon
  '#ff00ff', // Magenta neon
  '#00ff00', // Verde neon
  '#ffff00', // Amarelo neon
  '#ff6600', // Laranja neon
  '#6600ff', // Roxo neon
  '#ff0066', // Rosa neon
  '#00ff66', // Verde água
  '#ff6600', // Laranja escuro
  '#6666ff', // Azul neon
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
  const colors = filteredCategories.map((_, index) => cyberpunkPalette[index % cyberpunkPalette.length])

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
    color: cyberpunkPalette[index % cyberpunkPalette.length]
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
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      titleColor: '#00ffff',
      bodyColor: '#ffffff',
      borderColor: '#00ffff',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      callbacks: {
        title: (context) => {
          return `CATEGORIA: ${context[0].label}`
        },
        label: (context) => {
          const value = context.parsed.y
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const percentage = ((value / total) * 100).toFixed(1)
          return [
            `VALOR: ${formatValue(value)}`,
            `PERCENTUAL: ${percentage}%`
          ]
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(0, 255, 255, 0.1)',
        drawBorder: true,
        borderColor: '#00ffff'
      },
      ticks: {
        color: '#00ffff',
        font: {
          size: 12,
          weight: 'bold'
        }
      }
    },
    y: {
      grid: {
        color: 'rgba(0, 255, 255, 0.1)',
        drawBorder: true,
        borderColor: '#00ffff'
      },
      ticks: {
        color: '#00ffff',
        font: {
          size: 12,
          weight: 'bold'
        },
        callback: function(value) {
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
.cyberpunk-chart {
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  border: 2px solid #00ffff;
  border-radius: 12px;
  box-shadow: 
    0 0 20px rgba(0, 255, 255, 0.3),
    inset 0 0 20px rgba(0, 255, 255, 0.1);
  position: relative;
  height: auto !important;
  overflow: visible; /* Permitir que o conteúdo expanda */
  min-height: auto; /* Altura dinâmica */
  transition: all 0.3s ease; /* Transição suave */
}

.cyberpunk-chart::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(45deg, transparent 49%, rgba(0, 255, 255, 0.03) 50%, transparent 51%),
    linear-gradient(-45deg, transparent 49%, rgba(0, 255, 255, 0.03) 50%, transparent 51%);
  background-size: 20px 20px;
  pointer-events: none;
}

.neon-icon {
  color: #00ffff;
  filter: drop-shadow(0 0 8px #00ffff);
  animation: neonPulse 2s ease-in-out infinite alternate;
}

.cyberpunk-title {
  color: #00ffff;
  text-shadow: 0 0 10px #00ffff;
  letter-spacing: 1px;
  font-family: 'Courier New', monospace;
}

.cyberpunk-subtitle {
  color: #ff00ff;
  text-shadow: 0 0 8px #ff00ff;
  letter-spacing: 0.5px;
  font-family: 'Courier New', monospace;
}

.cyberpunk-toggle-btn {
  color: #00ffff !important;
  background: rgba(0, 255, 255, 0.1) !important;
  border: 1px solid rgba(0, 255, 255, 0.3) !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
  min-width: 40px !important;
  height: 40px !important;
}

.cyberpunk-toggle-btn:hover {
  background: rgba(0, 255, 255, 0.2) !important;
  border-color: #00ffff !important;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.4) !important;
  transform: scale(1.05) !important;
}

.cyberpunk-toggle-btn .v-icon {
  color: #00ffff !important;
  filter: drop-shadow(0 0 4px #00ffff);
  transition: transform 0.3s ease;
}

.cyberpunk-toggle-btn:hover .v-icon {
  transform: scale(1.1);
}

.chart-container {
  height: 400px;
  position: relative;
  z-index: 1;
}

.details-container {
  overflow: hidden;
  transition: all 0.3s ease;
}


.category-card {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(26, 26, 46, 0.8) 100%);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.category-card:hover {
  border-color: #00ffff;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
  transform: translateY(-2px);
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.category-card:hover::before {
  left: 100%;
}

.category-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: 0 0 10px currentColor;
  animation: neonPulse 2s ease-in-out infinite alternate;
}

@keyframes neonPulse {
  0% {
    opacity: 0.8;
    filter: brightness(1);
  }
  100% {
    opacity: 1;
    filter: brightness(1.2);
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .cyberpunk-chart {
    padding: 16px;
  }
  
  .chart-container {
    height: 300px;
  }
  
  .cyberpunk-title {
    font-size: 1.2rem;
  }
}
</style>
