<template>
  <v-container class="py-10">
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2 neon-pulse title-main">
              <v-icon size="32" class="mr-2">mdi-monitor-dashboard</v-icon>
              DASHBOARD FINANCEIRO
            </h1>
            <p class="text-subtitle-1" style="color: var(--neon-cyan); opacity: 0.8;">
              Visão geral do seu controle financeiro
            </p>
          </div>
          <div class="d-flex">
            <v-btn
              color="secondary"
              class="mb-6 mr-5"
              prepend-icon="mdi-cog"
              variant="elevated"
              @click="goToAdmin"
            >
              Painel Admin
            </v-btn>
            <v-btn
              color="red"
              class="mb-6"
              prepend-icon="mdi-logout"
              variant="elevated"
              @click="userLogout"
            >
              Logout
            </v-btn>
          </div>
        </div>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-6 card-balance" dark>
          <div class="d-flex justify-space-between align-center">
            <div>
              <h3 class="text-overline mb-1" style="opacity: 0.9;">SALDO ATUAL</h3>
              <p class="text-h4 font-weight-bold mb-0">{{ formatValue(summary.balance) }}</p>
            </div>
            <div>
              <v-icon size="48" color="primary">mdi-wallet</v-icon>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-6 card-income" dark>
          <div class="d-flex justify-space-between align-center">
            <div>
              <h3 class="text-overline mb-1" style="opacity: 0.9;">ENTRADAS</h3>
              <p class="text-h4 font-weight-bold mb-0">{{ formatValue(summary.income) }}</p>
            </div>
            <v-icon size="48" color="success">mdi-trending-up</v-icon>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-6 card-expense" dark>
          <div class="d-flex justify-space-between align-center">
            <div>
              <h3 class="text-overline mb-1" style="opacity: 0.9;">SAÍDAS</h3>
              <p class="text-h4 font-weight-bold mb-0">{{ formatValue(summary.expense) }}</p>
            </div>
            <v-icon size="48" color="error">mdi-trending-down</v-icon>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <SpendingPieChart height="600" />

    <v-row class="mt-10">
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-6">
          <h2 class="text-h5 font-weight-bold title-main">
            <v-icon class="mr-2">mdi-history</v-icon>
            Últimas Transações
          </h2>
          
          <!-- Filtros de Data -->
          <div class="d-flex align-center gap-3">
            <v-select
              v-model="selectedMonth"
              :items="monthOptions"
              label="Mês"
              variant="outlined"
              density="compact"
              style="min-width: 120px;"
              clearable
              @update:model-value="applyFilters"
            />
            <v-select
              v-model="selectedYear"
              :items="yearOptions"
              label="Ano"
              variant="outlined"
              density="compact"
              style="min-width: 100px;"
              clearable
              @update:model-value="applyFilters"
            />
            <v-btn
              v-if="selectedMonth || selectedYear"
              color="secondary"
              variant="outlined"
              size="small"
              @click="clearFilters"
              icon="mdi-filter-remove"
              class="ml-2"
            >
            </v-btn>
          </div>
        </div>
        <div v-if="loading" class="table-loading">
          <CyberpunkLoader 
            type="skeleton" 
            :skeleton-count="5"
            message="Carregando transações..."
          />
        </div>
        
        <v-data-table-server
          v-else
          v-model:page="page"
          v-model:items-per-page="itemsPerPage"
          :items="transactions"
          :loading="loading"
          :headers="headers"
          :items-length="total"
          :items-per-page-options="[5, 10, 15]"
          density="comfortable"
          show-current-page
          class="elevation-1"
        >
          <template v-slot:item.date="{ item }">
            {{ formatDate((item as any).date) }}
          </template>
          <template v-slot:item.value="{ item }">
            {{ formatValue(Number((item as any).value)) }}
          </template>
          <template v-slot:item.category="{ item }">
            <v-chip color="primary" variant="outlined" size="small">
              {{ (item as any).category.name }}
            </v-chip>
          </template>
          <template v-slot:item.type="{ item }">
            <v-chip :color="(item as any).type === 'ENTRY' ? 'green' : 'red'" dark>
              {{ (item as any).type === 'ENTRY' ? 'Entrada' : 'Saída' }}
            </v-chip>
          </template>
        </v-data-table-server>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDashboard } from './composables/useDashboard';
import { usePaginatedTransactions } from './composables/usePaginatedTransactions'
import SpendingPieChart from './components/SpendingPieChart.vue';
import CyberpunkLoader from '@/components/CyberpunkLoader.vue';

const router = useRouter();
const { summary, loadDashboard } = useDashboard();
const { transactions, total, itemsPerPage, sortBy, page, load, loading, setDateFilter, clearDateFilter } = usePaginatedTransactions();

// Filtros de data
const selectedMonth = ref<number | null>(null);
const selectedYear = ref<number | null>(null);

// Opções para os selects
const monthOptions = [
  { title: 'Janeiro', value: 1 },
  { title: 'Fevereiro', value: 2 },
  { title: 'Março', value: 3 },
  { title: 'Abril', value: 4 },
  { title: 'Maio', value: 5 },
  { title: 'Junho', value: 6 },
  { title: 'Julho', value: 7 },
  { title: 'Agosto', value: 8 },
  { title: 'Setembro', value: 9 },
  { title: 'Outubro', value: 10 },
  { title: 'Novembro', value: 11 },
  { title: 'Dezembro', value: 12 },
];

const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= currentYear - 5; i--) {
    years.push({ title: i.toString(), value: i });
  }
  return years;
});

const applyFilters = () => {
  setDateFilter(selectedMonth.value || undefined, selectedYear.value || undefined);
  loadDashboard(selectedMonth.value || undefined, selectedYear.value || undefined);
};

const clearFilters = () => {
  selectedMonth.value = null;
  selectedYear.value = null;
  clearDateFilter();
  loadDashboard();
};

const goToAdmin = () => {
  router.push('/admin');
}

const userLogout = () => {
  router.push('/login')

  localStorage.removeItem('token')
  localStorage.removeItem('user')
  sessionStorage.clear()
}

const formatValue = (value: number) => {
  if (!value) return 'R$ 0,00';

  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }
  return new Date(date).toLocaleDateString('pt-BR', options)
}

const headers = [
  { title: 'Descrição', key: 'description', sortable: true },
  { title: 'Valor', key: 'value', sortable: true },
  { title: 'Tipo', key: 'type', sortable: true },
  { title: 'Categoria', key: 'category', sortable: false },
  { title: 'Data', key: 'date', sortable: true },
]

onMounted(() => {
  loadDashboard()
})
</script>

<style scoped>
.neon-pulse {
  animation: neonPulse 3s ease-in-out infinite;
}

.table-loading {
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border: 1px solid rgba(0, 255, 255, 0.2);
}
</style>

