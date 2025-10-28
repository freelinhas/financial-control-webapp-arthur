<template>
  <v-container class="py-10">
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2 neon-pulse">
              <v-icon size="32" class="mr-2">mdi-monitor-dashboard</v-icon>
              DASHBOARD FINANCEIRO
            </h1>
            <p class="text-subtitle-1" style="color: var(--neon-cyan); opacity: 0.8;">
              Visão geral do seu controle financeiro
            </p>
          </div>
          <v-btn
            color="secondary"
            class="mb-6"
            prepend-icon="mdi-cog"
            variant="elevated"
            @click="goToAdmin"
          >
            Painel Admin
          </v-btn>
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
        <h2 class="text-h5 font-weight-bold mb-6">
          <v-icon class="mr-2">mdi-history</v-icon>
          Últimas Transações
        </h2>
        <v-data-table-server
          v-model:page="page"
          v-model:items-per-page="itemsPerPage"
          :items="transactions"
          :loading="loading"
          @update:options="loadTransactions"
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
            R$ {{ (item as any).value.toFixed(2).replace('.', ',') }}
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
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDashboard } from './composables/useDashboard';
import { usePaginatedTransactions } from './composables/usePaginatedTransactions'
import SpendingPieChart from './components/SpendingPieChart.vue';

const router = useRouter();
const { summary, loadDashboard } = useDashboard();
const { transactions, total, itemsPerPage, sortBy, page, load } = usePaginatedTransactions();

const loading = ref(false)

const goToAdmin = () => {
  router.push('/admin');
}

const loadTransactions = async () => {
  loading.value = true;
  await load();
  loading.value = false;
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
  { title: 'Descrição', key: 'description' },
  { title: 'Valor', key: 'value' },
  { title: 'Tipo', key: 'type' },
  { title: 'Data', key: 'date' },
]

onMounted(() => {
  loadDashboard()
})
</script>

<style scoped>
.neon-pulse {
  animation: neonPulse 3s ease-in-out infinite;
}
</style>

