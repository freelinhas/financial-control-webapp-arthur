<template>
  <v-container class="h-100 w-100 d-flex align-center justify-center pa-0 mt-15">
    <v-card
      class="pa-6"
      elevation="10"
      rounded="2xl"
      max-width="500"
      width="100%"
    >
      <v-card-title class="text-h5 text-center mb-4">Login</v-card-title>

      <v-form @submit.prevent="handleLogin" ref="formRef" v-model="formIsValid">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="form.email"
              label="Email"
              :rules="[rules.required, rules.email]"
              type="email"
              prepend-inner-icon="mdi-email"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="form.password"
              label="Senha"
              :rules="[rules.required]"
              type="password"
              prepend-inner-icon="mdi-lock"
            />
          </v-col>
        </v-row>
        <v-btn
          type="submit"
          color="primary"
          class="mt-4"
          :disabled="!formIsValid"
          block
        >
          Entrar
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useLogin } from './composables/useLogin'

const form = reactive({ email: '', password: '' })
const formRef = ref()
const formIsValid = ref(false)

const rules = {
  required: (v: string) => !!v || 'Campo obrigatório',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Email inválido',
}

const { login } = useLogin()

const handleLogin = async () => {
  if (!formRef.value?.validate()) return
  await login(form.email, form.password)
}
</script>
