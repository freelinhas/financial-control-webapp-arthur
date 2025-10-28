<template>
  <v-card flat>
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">Gerenciar Transações</span>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog()">
        Nova Transação
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-data-table-server
        v-model:page="page"
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="transactions"
        :items-length="total"
        :loading="loading"
        :items-per-page-options="[5, 10, 15, 25]"
        @update:options="loadTransactions"
        density="comfortable"
        class="elevation-1"
      >
        <template v-slot:item.date="{ item }">
          {{ formatDate(item.date) }}
        </template>

        <template v-slot:item.value="{ item }">
          {{ formatCurrency(item.value) }}
        </template>

        <template v-slot:item.type="{ item }">
          <v-chip :color="item.type === 'ENTRY' ? 'green' : 'red'" dark size="small">
            {{ item.type === 'ENTRY' ? 'Entrada' : 'Saída' }}
          </v-chip>
        </template>

        <template v-slot:item.category="{ item }">
          {{ item.category?.name || '-' }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="text"
            @click="openDialog(item)"
          />
          <v-btn
            icon="mdi-delete"
            size="small"
            variant="text"
            color="error"
            @click="confirmDelete(item)"
          />
        </template>
      </v-data-table-server>
    </v-card-text>

    <!-- Dialog de Criar/Editar -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h6">{{ isEdit ? 'Editar' : 'Nova' }} Transação</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="formRef" v-model="formIsValid">
            <v-text-field
              v-model="form.description"
              label="Descrição"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-2"
            />

            <v-text-field
              v-model="form.value"
              label="Valor"
              type="number"
              step="0.01"
              :rules="[rules.required, rules.positive]"
              variant="outlined"
              class="mb-2"
              prefix="R$"
            />

            <v-select
              v-model="form.type"
              :items="typeOptions"
              item-title="text"
              item-value="value"
              label="Tipo"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-2"
            />

            <v-select
              v-model="form.categoryId"
              :items="filteredCategories"
              item-title="name"
              item-value="id"
              label="Categoria"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-2"
            />

            <v-text-field
              v-model="form.date"
              label="Data"
              type="date"
              :rules="[rules.required]"
              variant="outlined"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="closeDialog">Cancelar</v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            :disabled="!formIsValid"
            :loading="saving"
            @click="handleSubmit"
          >
            {{ isEdit ? 'Atualizar' : 'Criar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de Confirmação de Exclusão -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">Confirmar Exclusão</v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir a transação <strong>{{ transactionToDelete?.description }}</strong>?
          Esta ação não pode ser desfeita.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="elevated" :loading="deleting" @click="handleDelete">
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar de Feedback -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { adminTransactionService, type Transaction } from '../services/admin-transaction.service'
import { adminCategoryService, type Category } from '../services/admin-category.service'

const transactions = ref<Transaction[]>([])
const categories = ref<Category[]>([])
const total = ref(0)
const page = ref(1)
const itemsPerPage = ref(10)
const loading = ref(false)
const dialog = ref(false)
const deleteDialog = ref(false)
const formRef = ref()
const formIsValid = ref(false)
const isEdit = ref(false)
const saving = ref(false)
const deleting = ref(false)
const transactionToDelete = ref<Transaction | null>(null)

const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

const form = reactive({
  id: 0,
  description: '',
  value: 0,
  type: 'ENTRY' as 'ENTRY' | 'EXIT',
  categoryId: 0,
  date: new Date().toISOString().split('T')[0],
})

const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Descrição', key: 'description', sortable: true },
  { title: 'Valor', key: 'value', sortable: true },
  { title: 'Tipo', key: 'type', sortable: true },
  { title: 'Categoria', key: 'category', sortable: false },
  { title: 'Data', key: 'date', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' as const },
]

const typeOptions = [
  { text: 'Entrada', value: 'ENTRY' },
  { text: 'Saída', value: 'EXIT' },
]

const filteredCategories = computed(() => {
  return categories.value.filter((cat) => cat.type === form.type)
})

const rules = {
  required: (v: any) => !!v || v === 0 || 'Campo obrigatório',
  positive: (v: number) => v > 0 || 'Valor deve ser maior que zero',
}

const loadTransactions = async () => {
  loading.value = true
  try {
    const result = await adminTransactionService.getAll({
      page: page.value,
      limit: itemsPerPage.value,
      sortBy: 'date',
      sortOrder: 'DESC',
    })
    transactions.value = result.data
    total.value = result.total
  } catch (error) {
    showSnackbar('Erro ao carregar transações', 'error')
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    categories.value = await adminCategoryService.getAll()
  } catch (error) {
    showSnackbar('Erro ao carregar categorias', 'error')
  }
}

const openDialog = (transaction?: Transaction) => {
  if (transaction) {
    isEdit.value = true
    form.id = transaction.id
    form.description = transaction.description
    form.value = parseFloat(transaction.value)
    form.type = transaction.type
    form.categoryId = transaction.category.id
    form.date = transaction.date.split('T')[0]
  } else {
    isEdit.value = false
    form.id = 0
    form.description = ''
    form.value = 0
    form.type = 'ENTRY'
    form.categoryId = 0
    form.date = new Date().toISOString().split('T')[0]
  }
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  formRef.value?.reset()
}

const handleSubmit = async () => {
  if (!formRef.value?.validate()) return

  saving.value = true
  try {
    const dto = {
      description: form.description,
      value: form.value,
      type: form.type,
      categoryId: form.categoryId,
      date: new Date(form.date).toISOString(),
    }

    if (isEdit.value) {
      await adminTransactionService.update(form.id, dto)
      showSnackbar('Transação atualizada com sucesso!', 'success')
    } else {
      await adminTransactionService.create(dto)
      showSnackbar('Transação criada com sucesso!', 'success')
    }
    closeDialog()
    await loadTransactions()
  } catch (error: any) {
    showSnackbar(error?.response?.data?.message || 'Erro ao salvar transação', 'error')
  } finally {
    saving.value = false
  }
}

const confirmDelete = (transaction: Transaction) => {
  transactionToDelete.value = transaction
  deleteDialog.value = true
}

const handleDelete = async () => {
  if (!transactionToDelete.value) return

  deleting.value = true
  try {
    await adminTransactionService.delete(transactionToDelete.value.id)
    showSnackbar('Transação excluída com sucesso!', 'success')
    deleteDialog.value = false
    await loadTransactions()
  } catch (error: any) {
    showSnackbar(error?.response?.data?.message || 'Erro ao excluir transação', 'error')
  } finally {
    deleting.value = false
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR')
}

const formatCurrency = (value: string | number) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  return numValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

const showSnackbar = (message: string, color: string) => {
  snackbarMessage.value = message
  snackbarColor.value = color
  snackbar.value = true
}

onMounted(() => {
  loadCategories()
  loadTransactions()
})
</script>

