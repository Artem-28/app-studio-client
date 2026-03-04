<template>
  <footer ref="rootRef" :class="rootClass" :style="rootStyle">
    <slot />
  </footer>
</template>

<script setup>
  import { computed, ref } from 'vue';
  import { hClasses } from '@/helpers/index.js';
  import { useBaseLayoutChild } from '@/composable/base/base-layout.composable.js';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: true,
    },
  });

  const rootRef = ref(null);

  const { layout, updateLayout, useResizeObserver } = useBaseLayoutChild('footer');

  if (!layout) {
    console.error('BaseFooter должен быть дочерним элементом BaseLayout');
  }

  const fixed = computed(() => {
    if (!layout) return false;
    return layout.view.value.includes('F');
  });

  const rootClass = computed(() => {
    const classes = hClasses('base-footer');
    if (fixed.value) classes.modify().append('fixed');
    else classes.modify().append('absolute');
    return classes.value();
  });

  const rootStyle = computed(() => {
    if (!layout) return {};
    const matrix = layout.rows.value.bottom;
    const css = {};
    if (matrix[0] === 'l' && layout.left.space) {
      css.paddingLeft = `${layout.left.size}px`;
    }
    if (matrix[2] === 'r' && layout.right.space) {
      css.paddingRight = `${layout.right.size}px`;
    }
    return css;
  });

  updateLayout('space', props.modelValue);

  useResizeObserver(rootRef, ({ height }) => {
    updateLayout('size', height);
  });
</script>

<style scoped lang="scss">
  .base-footer {
    width: 100%;
    left: 0;
    right: 0;
    bottom: 0;
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
