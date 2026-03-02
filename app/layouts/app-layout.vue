<template>
  <app-header />
  <app-background />
  <main class="app-page">
    <slot />
  </main>
  <app-footer />
</template>

<script setup>
import AppBackground from '../components/app/app-background.vue';
</script>

<style scoped>

</style>