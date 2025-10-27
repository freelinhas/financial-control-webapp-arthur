<template>
  <v-card flat>
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">Gerenciar Usuários</span>
      <v-btn color="primary" prepend-icon="mdi-account-plus" disabled>
        Novo Usuário
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="users"
        :loading="loading"
        density="comfortable"
        class="elevation-1"
      >
        <template v-slot:item.isAdmin="{ item }">
          <v-chip :color="item.isAdmin ? 'primary' : 'grey'" dark size="small">
            {{ item.isAdmin ? 'Admin' : 'Usuário' }}
          </v-chip>
        </template>

        <template v-slot:item.createdAt="{ item }">
          {{ formatDate(item.createdAt) }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-eye"
            size="small"
            variant="text"
            @click="viewUser(item)"
          />
        </template>
      </v-data-table>
    </v-card-text>

    <!-- Dialog de Visualização -->
    <v-dialog v-model="viewDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h6">Detalhes do Usuário</span>
        </v-card-title>

        <v-card-text v-if="selectedUser">
          <v-list>
            <v-list-item>
              <v-list-item-title>ID</v-list-item-title>
              <v-list-item-subtitle>{{ selectedUser.id }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Nome</v-list-item-title>
              <v-list-item-subtitle>{{ selectedUser.name }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Email</v-list-item-title>
              <v-list-item-subtitle>{{ selectedUser.email }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Tipo</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip :color="selectedUser.isAdmin ? 'primary' : 'grey'" dark size="small">
                  {{ selectedUser.isAdmin ? 'Administrador' : 'Usuário' }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Data de Cadastro</v-list-item-title>
              <v-list-item-subtitle>{{ formatDate(selectedUser.createdAt) }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="viewDialog = false">Fechar</v-btn>
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
import { ref, onMounted } from 'vue'
import { adminUserService, type User } from '../services/admin-user.service'

const users = ref<User[]>([])
const loading = ref(false)
const viewDialog = ref(false)
const selectedUser = ref<User | null>(null)

const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Nome', key: 'name', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Tipo', key: 'isAdmin', sortable: true },
  { title: 'Cadastrado em', key: 'createdAt', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' },
]

const loadUsers = async () => {
  loading.value = true
  try {
    users.value = await adminUserService.getAll()
  } catch (error) {
    showSnackbar('Erro ao carregar usuários', 'error')
  } finally {
    loading.value = false
  }
}

const viewUser = (user: User) => {
  selectedUser.value = user
  viewDialog.value = true
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const showSnackbar = (message: string, color: string) => {
  snackbarMessage.value = message
  snackbarColor.value = color
  snackbar.value = true
}

onMounted(() => {
  loadUsers()
})
</script>

