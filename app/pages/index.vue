<template>
  <div>{{ $t('app_title') }}</div>
</template>

<script setup>

import { useAsyncData } from "nuxt/app";

const { data: products } = await useAsyncData('products', () => $fetch('api/v1/products'));
console.log(products);

</script>