<template>
  <component :is="tag" :class="rootClass" @click="onClick">
    <slot />
  </component>
</template>

<script setup>
  import { computed } from 'vue';
  import { hClasses } from '../../helpers/index.js';

  const props = defineProps({
    tag: {
      type: String,
      default: 'div',
    },
    square: {
      type: Boolean,
      default: false,
    },
    disable: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['click']);

  const rootClass = computed(() => {
    const classes = hClasses('base-card');

    if (props.square) classes.modify().append('square');
    if (props.disable) classes.modify().append('disable');

    return classes.value();
  });

  function onClick(e) {
    if (props.disable) return;
    emit('click', e);
  }
</script>

<style scoped lang="scss">
  @use '../../assets/css/variables/index' as *;

  .base-card {
    position: relative;
    vertical-align: top;
    border-radius: 12px;
    background-color: $color--dark-secondary;

    &--disable {
      &::before {
        content: '';
        display: block;
        position: absolute;
        inset: 0;
        opacity: 0;
        border-radius: inherit;
        z-index: 10;
      }
    }

    &--square {
      border-radius: 0;
    }
  }
</style>
