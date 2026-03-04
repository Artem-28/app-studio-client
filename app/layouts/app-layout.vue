<template>
  <base-layout view="hHh lpr fFf">
    <base-header>
      <app-header />
    </base-header>

    <base-page-container>
      <slot />
    </base-page-container>

    <base-footer>
      <app-footer />
    </base-footer>
  </base-layout>
</template>

<script setup></script>

<style scoped></style>
