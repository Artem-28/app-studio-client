<template>
  <header ref="rootRef" :class="rootClass" :style="rootStyle">
    <slot />
  </header>
</template>

<script setup>
  import { computed, ref, watch } from 'vue';
  import { hClasses } from '@/helpers/index.js';
  import { useBaseLayoutChild } from '@/composable/base/base-layout.composable.js';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: true,
    },
  });

  const rootRef = ref(null);

  const { layout, updateLayout, useResizeObserver } = useBaseLayoutChild('header');

  if (!layout) {
    console.error('BaseHeader должен быть дочерним элементом BaseLayout');
  }

  const fixed = computed(() => {
    if (!layout) return false;
    return layout.view.value.includes('H');
  });

  const rootClass = computed(() => {
    const classes = hClasses('base-header');
    if (fixed.value) classes.modify().append('fixed');
    else classes.modify().append('absolute');
    return classes.value();
  });

  const rootStyle = computed(() => {
    if (!layout) return {};
    const matrix = layout.rows.value.top;
    const css = {};
    if (matrix[0] === 'l' && layout.left.space) {
      css.paddingLeft = `${layout.left.size}px`;
    }
    if (matrix[2] === 'r' && layout.right.space) {
      css.paddingRight = `${layout.right.size}px`;
    }
    return css;
  });

  watch(
    () => props.modelValue,
    (value) => {
      updateLayout('space', value);
    },
  );

  updateLayout('space', props.modelValue);

  useResizeObserver(rootRef, ({ height }) => {
    updateLayout('size', height);
  });
</script>

<style scoped lang="scss">
  .base-header {
    width: 100%;
    left: 0;
    right: 0;
    top: 0;
    z-index: 100;
    box-sizing: border-box;

    &--fixed {
      position: fixed;
    }

    &--absolute {
      position: absolute;
    }
  }
</style>
