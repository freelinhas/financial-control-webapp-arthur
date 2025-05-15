<template>
  <v-container class="py-10">
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between">
          <h1 class="text-h5 font-weight-bold mb-6">Painel Administrativo</h1>
          <v-btn
            class="mb-4"
            color="grey-darken-1"
            prepend-icon="mdi-arrow-left"
            variant="text"
            @click="$router.push('/home')"
          >
            Voltar para Dashboard
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-tabs v-model="tab" color="primary" grow class="mt-15">
      <v-tab value="categories">Categorias</v-tab>
      <v-tab value="transactions">Transações</v-tab>
      <v-tab value="users">Usuários</v-tab>
    </v-tabs>

    <v-window v-model="tab" class="mt-6">
      <v-window-item value="categories">
        <v-card flat class="pa-4">
          <h2 class="text-subtitle-1 font-weight-medium mb-4">Gerenciar Categorias</h2>
          <v-btn color="primary" prepend-icon="mdi-plus">Nova Categoria</v-btn>
        </v-card>
      </v-window-item>

      <v-window-item value="transactions">
        <v-card flat class="pa-4">
          <h2 class="text-subtitle-1 font-weight-medium mb-4">Gerenciar Transações</h2>
          <v-btn color="primary" prepend-icon="mdi-plus">Nova Transação</v-btn>
        </v-card>
      </v-window-item>

      <v-window-item value="users">
        <v-card flat class="pa-4">
          <h2 class="text-subtitle-1 font-weight-medium mb-4">Gerenciar Usuários</h2>
          <v-btn color="primary" prepend-icon="mdi-account-plus">Novo Usuário</v-btn>
        </v-card>
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const tab = ref('categories')
</script>
