<template>
  <div :class="rootClasses">
    {{ rootClasses }}
    <div class="color--accent-60">some text</div>
    <base-button label="test" color="accent-60" />
  </div>
</template>

<script setup>
  import { useAsyncData } from 'nuxt/app';
  import { computed } from 'vue';
  import { hClasses } from '../helpers/index.js';
  import { useExample } from '../composable';
  import { useBaseExample } from '../composable/base';

  const { data: products } = await useAsyncData('products', () => $fetch('api/v1/products'));
  console.log(products);

  const exemple = useExample();
  const base = useBaseExample();
  const rootClasses = computed(() => {
    const classes = hClasses('root-class');
    const color = hClasses('color');

    classes.modify().append('disable');
    classes.modify().remove('disable');

    color.modify().append('accent');

    classes.append(color.value());

    return classes.value();
  });
</script>
