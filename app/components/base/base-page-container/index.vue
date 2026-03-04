<template>
  <div ref="rootRef" class="base-page-container" :style="rootStyle">
    <div class="base-page">
      <slot />
    </div>
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue';
  import { useBaseLayoutChild } from '@/composable/base/base-layout.composable.js';

  const rootRef = ref(null);
  const scrollbarWidth = ref(0);
  const innerHeight = ref(typeof window !== 'undefined' ? window.innerHeight : 0);

  const { layout, useResizeObserver } = useBaseLayoutChild('pageContainer');

  if (!layout) {
    console.error('BasePageContainer должен быть дочерним элементом BaseLayout');
  }

  const rootStyle = computed(() => {
    if (!layout) return {};
    let height = innerHeight.value;
    const css = {};

    if (layout.header.space) {
      css.marginTop = `${layout.header.size}px`;
      height -= layout.header.size;
    }
    if (layout.footer.space) {
      height -= layout.footer.size;
    }
    if (layout.left.space) {
      css.paddingLeft = `${layout.left.size}px`;
    }
    if (layout.right.space) {
      css.paddingRight = `${layout.right.size - scrollbarWidth.value}px`;
    }

    css.height = `${height}px`;
    return css;
  });

  useResizeObserver(rootRef, () => {
    if (!rootRef.value) return;
    const { width } = rootRef.value.getBoundingClientRect();
    scrollbarWidth.value = width - rootRef.value.clientWidth;
    innerHeight.value = window.innerHeight;
  });
</script>

<style scoped lang="scss">
  .base-page-container {
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
  }

  .base-page {
    position: relative;
    min-height: 100%;
    box-sizing: border-box;
  }
</style>
