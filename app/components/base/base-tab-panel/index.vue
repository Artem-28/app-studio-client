<template>
  <div v-if="isActive" class="base-tab-panel" role="tabpanel">
    <slot />
  </div>
</template>

<script setup>
  import { computed, inject } from 'vue';

  const props = defineProps({
    name: {
      type: String,
      required: true,
    },
    disable: {
      type: Boolean,
      default: false,
    },
  });

  const $panels = inject('base-tab-panels', null);

  if (!$panels) {
    console.error('BaseTabPanel должен быть дочерним элементом BaseTabPanels');
  }

  const isActive = computed(() => !props.disable && $panels?.currentModel.value === props.name);
</script>

<style scoped lang="scss">
  .base-tab-panel {
    width: 100%;
    height: 100%;
    box-sizing: inherit;
  }
</style>
