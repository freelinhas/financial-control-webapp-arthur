<template>
  <v-app>
    <v-main class="mobile-main">
      <v-container fluid class="pa-0">
        <RouterView />
      </v-container>
    </v-main>
    
    <CyberpunkLoader 
      :visible="loaderState.visible"
      :type="loaderState.type"
      :message="loaderState.message"
      :progress="loaderState.progress"
      :skeleton-count="loaderState.skeletonCount"
      :size="loaderState.size"
    />
  </v-app>
</template>

<style scoped>
.mobile-main {
  min-height: 100vh;
  min-height: 100dvh; /* Dynamic viewport height for mobile */
}

/* Garantir que o container seja full width em mobile */
.v-container.fluid.pa-0 {
  padding: 0 !important;
  margin: 0 !important;
  max-width: 100% !important;
}
</style>

<script setup lang="ts">
import CyberpunkLoader from '@/components/CyberpunkLoader.vue'
import { useGlobalLoader } from '@/stores/loader'

const { loaderState } = useGlobalLoader()
</script>