<template>
  <div class="base-tabs" role="tablist">
    <div :class="contentClass">
      <slot />
    </div>
  </div>
</template>

<script setup>
  import { computed, provide } from 'vue';
  import { hClasses } from '../../helpers/index.js';

  const props = defineProps({
    modelValue: {
      type: [Number, String],
      default: null,
    },
    activeBgColor: {
      type: String,
      default: 'dark-secondary',
    },
    activeColor: {
      type: String,
      default: 'white-primary',
    },
    textColor: {
      type: String,
      default: 'white-primary',
    },
    activeClass: {
      type: String,
      default: '',
    },
    contentClass: {
      type: String,
      default: '',
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    align: {
      type: String,
      default: 'center', // center | left | right | justify
    },
    inlineLabel: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['update:modelValue']);

  const contentClass = computed(() => {
    const classes = hClasses('base-tabs__content');
    classes.modify().append(`align-${props.align}`);
    if (props.vertical) classes.modify().append('vertical');
    if (props.contentClass) classes.append(props.contentClass);
    return classes.value();
  });

  provide('base-tabs', {
    currentModel: computed(() => props.modelValue),
    tabProps: computed(() => ({
      activeBgColor: props.activeBgColor,
      activeColor: props.activeColor,
      textColor: props.textColor,
      activeClass: props.activeClass,
      contentClass: props.contentClass,
      inlineLabel: props.inlineLabel,
      readonly: props.readonly,
    })),
    updateModel: (name) => {
      if (props.modelValue !== name) {
        emit('update:modelValue', name);
      }
    },
  });
</script>

<style scoped lang="scss">
  @use '../../assets/css/variables/index' as *;

  .base-tabs {
    padding: 4px;
    border-radius: 8px;
    background-color: $color--dark-primary;

    &__content {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      gap: 4px;

      &--align-center {
        justify-content: center;
      }

      &--align-left {
        justify-content: flex-start;
      }

      &--align-right {
        justify-content: flex-end;
      }

      &--align-justify {
        :deep(.base-tab) {
          flex: 1 1 auto;
        }
      }

      &--vertical {
        flex-direction: column;
      }

      :deep(.base-tab) {
        transition: background-color 0.12s;
      }
    }
  }
</style>
