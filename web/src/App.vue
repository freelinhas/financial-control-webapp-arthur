<script setup lang="ts">
</script>

<template>
  <v-app>
    <section>
      <div class="app-content">
        <v-main>
          <RouterView />
        </v-main>
      </div>
    </section>
  </v-app>
</template>

<style lang="sass">
body, html
  margin: 0
  padding: 0
  height: 100%
  overflow: hidden

html
  background-color: #e4e4e4

.app-grid
  display: flex;
  height: 100vh;


.app-content
  width: 100%
</style>
