<template>
  <v-card flat>
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">Gerenciar Categorias</span>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog()">
        Nova Categoria
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="categories"
        :loading="loading"
        density="comfortable"
        class="elevation-1"
      >
        <template v-slot:item.type="{ item }">
          <v-chip :color="item.type === 'ENTRY' ? 'green' : 'red'" dark size="small">
            {{ item.type === 'ENTRY' ? 'Entrada' : 'Saída' }}
          </v-chip>
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
      </v-data-table>
    </v-card-text>

    <!-- Dialog de Criar/Editar -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h6">{{ isEdit ? 'Editar' : 'Nova' }} Categoria</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="formRef" v-model="formIsValid">
            <v-text-field
              v-model="form.name"
              label="Nome da categoria"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-2"
            />

            <v-select
              v-model="form.type"
              :items="typeOptions"
              item-title="text"
              item-value="value"
              label="Tipo"
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
          Tem certeza que deseja excluir a categoria <strong>{{ categoryToDelete?.name }}</strong>?
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
import { ref, reactive, onMounted } from 'vue'
import { adminCategoryService, type Category } from '../services/admin-category.service'

const categories = ref<Category[]>([])
const loading = ref(false)
const dialog = ref(false)
const deleteDialog = ref(false)
const formRef = ref()
const formIsValid = ref(false)
const isEdit = ref(false)
const saving = ref(false)
const deleting = ref(false)
const categoryToDelete = ref<Category | null>(null)

const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

const form = reactive({
  id: 0,
  name: '',
  type: 'ENTRY' as 'ENTRY' | 'EXIT',
})

const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Nome', key: 'name', sortable: true },
  { title: 'Tipo', key: 'type', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' as const },
]

const typeOptions = [
  { text: 'Entrada', value: 'ENTRY' },
  { text: 'Saída', value: 'EXIT' },
]

const rules = {
  required: (v: string) => !!v || 'Campo obrigatório',
}

const loadCategories = async () => {
  loading.value = true
  try {
    categories.value = await adminCategoryService.getAll()
  } catch (error) {
    showSnackbar('Erro ao carregar categorias', 'error')
  } finally {
    loading.value = false
  }
}

const openDialog = (category?: Category) => {
  if (category) {
    isEdit.value = true
    form.id = category.id
    form.name = category.name
    form.type = category.type
  } else {
    isEdit.value = false
    form.id = 0
    form.name = ''
    form.type = 'ENTRY'
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
    if (isEdit.value) {
      await adminCategoryService.update(form.id, {
        name: form.name,
        type: form.type,
      })
      showSnackbar('Categoria atualizada com sucesso!', 'success')
    } else {
      await adminCategoryService.create({
        name: form.name,
        type: form.type,
      })
      showSnackbar('Categoria criada com sucesso!', 'success')
    }
    closeDialog()
    await loadCategories()
  } catch (error: any) {
    showSnackbar(error?.response?.data?.message || 'Erro ao salvar categoria', 'error')
  } finally {
    saving.value = false
  }
}

const confirmDelete = (category: Category) => {
  categoryToDelete.value = category
  deleteDialog.value = true
}

const handleDelete = async () => {
  if (!categoryToDelete.value) return

  deleting.value = true
  try {
    await adminCategoryService.delete(categoryToDelete.value.id)
    showSnackbar('Categoria excluída com sucesso!', 'success')
    deleteDialog.value = false
    await loadCategories()
  } catch (error: any) {
    showSnackbar(error?.response?.data?.message || 'Erro ao excluir categoria', 'error')
  } finally {
    deleting.value = false
  }
}

const showSnackbar = (message: string, color: string) => {
  snackbarMessage.value = message
  snackbarColor.value = color
  snackbar.value = true
}

onMounted(() => {
  loadCategories()
})
</script>

