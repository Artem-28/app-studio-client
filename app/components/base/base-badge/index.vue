<template>
  <div role="status" :class="rootClass" :style="rootStyle">
    <template v-if="label">
      {{ label }}
    </template>
    <slot />
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import { hClasses } from '@/helpers/index.js';

  const props = defineProps({
    color: {
      type: String,
      default: 'primary',
    },
    textColor: {
      type: String,
      default: 'white-primary',
    },
    opacity: {
      type: String,
      default: '100',
    },
    floating: {
      type: Boolean,
      default: false,
    },
    outline: {
      type: Boolean,
      default: false,
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    label: {
      type: [Number, String],
      default: '',
    },
    align: {
      type: String,
      required: false,
    },
  });

  const rootStyle = computed(() => {
    return props.align ? { verticalAlign: props.align } : {};
  });

  const rootClass = computed(() => {
    const textColor = props.outline ? props.color || props.textColor : props.textColor;
    const classes = hClasses('base-badge');

    if (props.outline) classes.modify().append('outline');
    if (props.rounded) classes.modify().append('round');
    if (props.floating) classes.modify().append('floating');

    // TODO: заменить на актуальные глобальные классы после их определения
    if (textColor) classes.append(`color--${textColor}`);
    if (props.color) classes.append(`bg-color--${props.color}`);
    if (props.opacity) classes.append(`opacity--${props.opacity}`);

    classes.append('inline-flex');
    classes.append('items-center');
    classes.append('no-wrap');

    return classes.value();
  });
</script>

<style scoped lang="scss">
  @use '../../assets/css/variables' as *;
  .base-badge {
    color: #fff;
    background-color: $color--accent;
    padding: 0 5px;
    border-radius: 4px;
    font-size: 12px;
    line-height: 14px;
    min-height: 18px;
    font-weight: normal;
    vertical-align: baseline;
    box-sizing: border-box;

    &--outline {
      background-color: transparent !important;
      border: 1px solid currentColor !important;
    }

    &--round {
      border-radius: 1em;
    }

    &--floating {
      position: absolute;
      top: -4px;
      right: -3px;
      cursor: inherit;
    }
  }
</style>
