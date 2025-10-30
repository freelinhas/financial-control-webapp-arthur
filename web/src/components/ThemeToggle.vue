<template>
  <v-btn
    :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
    variant="text"
    @click="toggleTheme"
    :title="isDark ? 'Modo claro' : 'Modo escuro'"
  />
</template>

<script setup lang="ts">
import { useThemeToggle } from '@/composables/useTheme'

const { isDark, toggleTheme } = useThemeToggle()
</script>
