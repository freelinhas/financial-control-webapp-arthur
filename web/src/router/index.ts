import { createRouter, createWebHistory } from 'vue-router'
import LoginComponentVue from '@/modules/login/LoginComponent.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'auth',
      component: LoginComponentVue,
    },
  ],
})

export default router
