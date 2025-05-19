<template>
  <v-container class="py-10">
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between">
          <h1 class="text-h5 font-weight-bold mb-6">Dashboard Financeira</h1>
          <v-btn
            color="secondary"
            class="mb-6"
            prepend-icon="mdi-cog"
            @click="$router.push('/admin')"
          >
            Ir para o Painel Administrativo
          </v-btn>
        </div>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4" color="primary" dark>
          <div class="d-flex justify-space-between align-center">
            <div>
              <h3 class="text-h6">Saldo</h3>
              <p class="text-h5 font-weight-bold">{{ formatValue(summary.balance) }}</p>
            </div>
            <div>
              <v-icon size="32">mdi-eye</v-icon>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4" color="green" dark>
          <div class="d-flex justify-space-between align-center">
            <div>
              <h3 class="text-h6">Entradas</h3>
              <p class="text-h5 font-weight-bold">{{ formatValue(summary.income) }}</p>
            </div>
            <v-icon size="32">mdi-arrow-down-bold</v-icon>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4" color="red" dark>
          <div class="d-flex justify-space-between align-center">
            <div>
              <h3 class="text-h6">Saídas</h3>
              <p class="text-h5 font-weight-bold">{{ formatValue(summary.expense) }}</p>
            </div>
            <v-icon size="32">mdi-arrow-up-bold</v-icon>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <SpendingPieChart height="600" />

    <v-row class="mt-10">
      <v-col cols="12">
        <h1 class="text-h5 font-weight-bold mb-6">Últimas transações</h1>
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
            {{ formatDate(item.date) }}
          </template>
          <template v-slot:item.value="{ item }">
            R$ {{ item.value.toFixed(2).replace('.', ',') }}
          </template>
          <template v-slot:item.type="{ item }">
            <v-chip :color="item.type === 'ENTRY' ? 'green' : 'red'" dark>
              {{ item.type === 'ENTRY' ? 'Entrada' : 'Saída' }}
            </v-chip>
          </template>
        </v-data-table-server>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useDashboard } from './composables/useDashboard';
import { usePaginatedTransactions } from './composables/usePaginatedTransactions'
import SpendingPieChart from './components/SpendingPieChart.vue';

const { summary, loadDashboard } = useDashboard();
const { transactions, total, itemsPerPage, sortBy, page, load } = usePaginatedTransactions();

const loading = ref(false)

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

