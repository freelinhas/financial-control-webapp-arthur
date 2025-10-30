<template>
  <div class="login-container">
    <v-container class="h-100 w-100 d-flex align-center justify-center pa-0">
      <v-card
        class="pa-8 login-card"
        elevation="2"
        max-width="500"
        width="100%"
      >
        <div class="text-center mb-8">
          <div class="d-flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <v-icon size="64" color="primary" class="mb-4">
            mdi-shield-lock
          </v-icon>
          <h1 class="text-h4 font-weight-bold mb-2">
            Acesso ao Sistema
          </h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            Financial Control v2.0
          </p>
        </div>

        <v-form @submit.prevent="handleLogin" ref="formRef" v-model="formIsValid">
          <v-text-field
            v-model="form.email"
            label="Email"
            :rules="[rules.required, rules.email]"
            type="email"
            prepend-inner-icon="mdi-email"
            variant="outlined"
            class="mb-4"
          />

          <v-text-field
            v-model="form.password"
            label="Senha"
            :rules="[rules.required]"
            type="password"
            prepend-inner-icon="mdi-lock"
            variant="outlined"
            class="mb-6"
          />

          <v-btn
            type="submit"
            color="primary"
            size="large"
            :disabled="!formIsValid || isLoading"
            block
            variant="elevated"
            class="login-btn"
          >
            <CyberpunkLoader 
              v-if="isLoading" 
              type="button" 
              size="small"
            />
            <template v-else>
              <v-icon start>mdi-login</v-icon>
              Iniciar Sessão
            </template>
          </v-btn>
        </v-form>

        <div class="text-center mt-6">
          <p class="text-caption text-medium-emphasis">
            Sistema protegido • Acesso monitorado
          </p>
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useLogin } from './composables/useLogin'
import CyberpunkLoader from '@/components/CyberpunkLoader.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const form = reactive({ email: '', password: '' })
const formRef = ref()
const formIsValid = ref(false)
const isLoading = ref(false)

const rules = {
  required: (v: string) => !!v || 'Campo obrigatório',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Email inválido',
}

const { login } = useLogin()

const handleLogin = async () => {
  if (!formRef.value?.validate()) return
  isLoading.value = true
  try {
    await login(form.email, form.password)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f5f5 0%, #e3f2fd 100%);
}

.login-card {
  position: relative;
  backdrop-filter: blur(10px);
}
</style>
