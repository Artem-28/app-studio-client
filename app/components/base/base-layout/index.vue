<template>
  <div :class="rootClass">
    <slot />
  </div>
</template>

<script setup>
  import { computed, onMounted, provide } from 'vue';
  import { hClasses } from '@/helpers/index.js';
  import { layoutKey, useBaseLayout } from '@/composable/base/base-layout.composable.js';

  const props = defineProps({
    view: {
      type: String,
      default: 'hhh lpr fff',
    },
  });

  const layout = useBaseLayout(props);
  provide(layoutKey, layout);

  onMounted(() => {
    document.body.style.height = '100vh';
    document.body.style.width = '100vw';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
  });

  const rootClass = computed(() => {
    const classes = hClasses('base-layout');
    if (layout.animated.value) classes.modify().append('animate');
    return classes.value();
  });
</script>

<style scoped lang="scss">
  .base-layout {
    width: 100%;
    height: 100%;
    position: relative;
    background: #0f0f1a;
    color: white;

    &--animate {
      * {
        transition:
          padding 0.12s,
          margin 0.12s,
          height 0.12s !important;
      }
    }
  }
</style>
