import './assets/main.css'
import './assets/cyberpunk.css'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
  },
  components,
  directives,
  theme: {
    defaultTheme: 'cyberpunk',
    themes: {
      cyberpunk: {
        dark: true,
        colors: {
          background: '#0a0e27',
          surface: '#141b3d',
          primary: '#00ffff', // Cyan neon
          secondary: '#ff00ff', // Magenta neon
          accent: '#ffff00', // Yellow neon
          error: '#ff0055',
          info: '#00d9ff',
          success: '#00ff9f',
          warning: '#ffaa00',
        },
      },
    },
  },
})

createApp(App).use(vuetify).use(router).use(createPinia()).mount('#app')

