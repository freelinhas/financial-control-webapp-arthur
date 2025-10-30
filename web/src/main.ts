import './assets/main.css'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
import router from './router'
import { useThemeToggle } from './composables/useTheme'

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
  },
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#fafafa',
          surface: '#ffffff',
          primary: '#1976d2',
          secondary: '#424242',
          accent: '#82b1ff',
          error: '#f44336',
          info: '#2196f3',
          success: '#4caf50',
          warning: '#ff9800',
        },
      },
      dark: {
        dark: true,
        colors: {
          background: '#121212',
          surface: '#1e1e1e',
          primary: '#2196f3',
          secondary: '#616161',
          accent: '#64b5f6',
          error: '#f44336',
          info: '#2196f3',
          success: '#4caf50',
          warning: '#ff9800',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      style: 'text-transform: none;',
      rounded: 'md',
    },
    VCard: {
      rounded: 'md',
      elevation: 1,
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VTextarea: {
      variant: 'outlined',
      density: 'comfortable',
    },
  },
})

const app = createApp(App)
app.use(vuetify)
app.use(router)
app.use(createPinia())

// Carregar tema salvo após a criação do app
app.mount('#app')

// Carregar tema salvo após o mount
const { loadSavedTheme } = useThemeToggle()
loadSavedTheme()

