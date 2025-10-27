<template>
  <div class="login-container">
    <div class="cyber-background"></div>
    
    <v-container class="h-100 w-100 d-flex align-center justify-center pa-0">
      <v-card
        class="pa-8 login-card"
        elevation="24"
        max-width="500"
        width="100%"
      >
        <div class="text-center mb-8">
          <v-icon size="64" color="primary" class="mb-4 neon-pulse">
            mdi-shield-lock
          </v-icon>
          <h1 class="text-h4 font-weight-bold neon-text mb-2">
            ACESSO AO SISTEMA
          </h1>
          <p class="text-subtitle-1" style="color: var(--neon-cyan); opacity: 0.8;">
            Financial Control v2.0
          </p>
        </div>

        <v-form @submit.prevent="handleLogin" ref="formRef" v-model="formIsValid">
          <v-text-field
            v-model="form.email"
            label="EMAIL"
            :rules="[rules.required, rules.email]"
            type="email"
            prepend-inner-icon="mdi-email"
            variant="outlined"
            class="mb-4"
          />

          <v-text-field
            v-model="form.password"
            label="SENHA"
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
            :disabled="!formIsValid"
            :loading="isLoading"
            block
            variant="elevated"
          >
            <v-icon start>mdi-login</v-icon>
            INICIAR SESSÃO
          </v-btn>
        </v-form>

        <div class="text-center mt-6">
          <p class="text-caption" style="color: rgba(0, 255, 255, 0.5);">
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
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.cyber-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(0, 255, 255, 0.1) 0%,
    transparent 50%
  );
  animation: pulseBackground 4s ease-in-out infinite;
}

@keyframes pulseBackground {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

.login-card {
  position: relative;
  z-index: 10;
  border: 2px solid var(--neon-cyan) !important;
  box-shadow: 
    0 0 60px rgba(0, 255, 255, 0.5),
    inset 0 0 60px rgba(0, 255, 255, 0.1) !important;
}

.neon-text {
  color: var(--neon-cyan);
  text-shadow: 
    0 0 10px var(--neon-cyan),
    0 0 20px var(--neon-cyan),
    0 0 30px var(--neon-cyan);
}

.neon-pulse {
  animation: neonPulse 2s ease-in-out infinite;
}

@keyframes neonPulse {
  0%, 100% {
    filter: drop-shadow(0 0 10px var(--neon-cyan));
  }
  50% {
    filter: drop-shadow(0 0 30px var(--neon-cyan));
  }
}
</style>
