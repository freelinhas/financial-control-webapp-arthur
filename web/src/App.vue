<template>
  <v-app>
    <v-main>
      <v-container>
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

<script setup lang="ts">
import CyberpunkLoader from '@/components/CyberpunkLoader.vue'
import { useGlobalLoader } from '@/stores/loader'

const { loaderState } = useGlobalLoader()
</script>