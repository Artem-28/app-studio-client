<template>
  <component
    :is="tag"
    ref="rootRef"
    :class="rootClass"
    :style="rootStyle"
    v-bind="tagAttrs"
    @click="onClick"
  >
    <span :class="bgClass" />
    <span :class="contentClass">
      <!-- TODO: заменить на base-icon после его реализации -->
      <span v-if="icon" class="base-btn__icon">{{ icon }}</span>
      <span v-if="label" class="base-btn__content__label">{{ label }}</span>
      <slot />
      <!-- TODO: заменить на base-icon после его реализации -->
      <span v-if="iconRight" class="base-btn__icon">{{ iconRight }}</span>
    </span>
  </component>
</template>

<script setup>
  import { computed, ref } from 'vue';
  import { hClasses } from '@/helpers/index.js';
  import { useBaseHover } from '@/composable/base/base-hover.composable.js';
  import {
    baseRouterLinkProps,
    useBaseRouterLink,
  } from '@/composable/base/base-router-link.composable.js';

  const props = defineProps({
    label: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'primary',
    },
    textColor: {
      type: String,
      default: 'white-primary',
    },
    flat: {
      type: Boolean,
      default: false,
    },
    outline: {
      type: Boolean,
      default: false,
    },
    square: {
      type: Boolean,
      default: false,
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    bgOpacity: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    iconRight: {
      type: String,
      default: '',
    },
    padding: {
      type: String,
      default: '12px',
    },
    disable: {
      type: Boolean,
      default: false,
    },
    ...baseRouterLinkProps,
  });

  const emit = defineEmits(['click']);

  const rootRef = ref(null);
  const isHovered = useBaseHover(rootRef);

  const { tag, linkAttrs, navigateOnClick } = useBaseRouterLink(props, emit, {
    fallbackTag: 'button',
  });

  const tagAttrs = computed(() => {
    if (tag.value === 'button') {
      return { ...linkAttrs.value, type: 'button', disabled: props.disable || undefined };
    }
    return linkAttrs.value;
  });

  const isTransparentBg = computed(() => {
    return (
      props.flat ||
      Number(props.bgOpacity) <= 20 ||
      (props.outline && Number(props.bgOpacity || 0) <= 20)
    );
  });

  const activeTextColor = computed(() => {
    if (!props.disable && isHovered.value && isTransparentBg.value) {
      return props.color;
    }
    return props.textColor;
  });

  const rootClass = computed(() => {
    const classes = hClasses('base-btn');

    if (props.disable) classes.modify().append('disable');
    if (props.flat) classes.modify().append('flat');
    if (props.outline) classes.modify().append('outline');
    if (props.square) classes.modify().append('square');
    if (props.rounded) classes.modify().append('rounded');

    // TODO: заменить на актуальные глобальные классы после их определения
    if (props.color) classes.append(`color--${props.color}`);

    return classes.value();
  });

  const bgClass = computed(() => {
    const classes = hClasses('base-btn__bg');

    if (props.bgOpacity) {
      classes.modify().append('opacity');
      // TODO: заменить на актуальные глобальные классы после их определения
      classes.append(`opacity--${props.bgOpacity}`);
    }

    // TODO: заменить на актуальные глобальные классы после их определения
    if (props.color) classes.append(`bg-color--${props.color}`);

    return classes.value();
  });

  const contentClass = computed(() => {
    const classes = hClasses('base-btn__content');

    // TODO: заменить на актуальные глобальные классы после их определения
    if (activeTextColor.value) classes.append(`color--${activeTextColor.value}`);

    return classes.value();
  });

  const rootStyle = computed(() => {
    return props.padding ? { padding: props.padding } : {};
  });

  function onClick(e) {
    navigateOnClick(e);
  }
</script>

<style scoped lang="scss">
  $border-radius: 12px;

  .base-btn {
    display: inline-flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    width: auto;
    height: auto;
    position: relative;
    gap: 8px;
    cursor: pointer;
    outline: none;
    border: none;
    padding: 12px;
    background-color: inherit;
    border-radius: $border-radius;
    font-weight: 500;
    font-size: 16px;
    transition: all 0.2s;
    min-height: 1.5em;
    text-decoration: none;

    &__bg {
      transition: all 0.2s;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      background-color: currentColor;

      &::before {
        transition: all 0.2s;
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: inherit;
        opacity: 0;
      }
    }

    &:not(.base-btn--disable):hover {
      .base-btn__bg {
        &:not(.base-btn__bg--opacity)::before {
          opacity: 0.2;
          background-color: white;
        }
      }

      // TODO: заменить на актуальные глобальные классы после их определения
      .base-btn__bg.opacity--0 {
        opacity: 0.2;
      }
      .base-btn__bg.opacity--10 {
        opacity: 0.3;
      }
      .base-btn__bg.opacity--20 {
        opacity: 0.4;
      }
      .base-btn__bg.opacity--30 {
        opacity: 0.5;
      }
      .base-btn__bg.opacity--40 {
        opacity: 0.6;
      }
      .base-btn__bg.opacity--50 {
        opacity: 0.7;
      }
      .base-btn__bg.opacity--60 {
        opacity: 0.8;
      }
      .base-btn__bg.opacity--70 {
        opacity: 0.9;
      }
      .base-btn__bg.opacity--80 {
        opacity: 1;
      }
      .base-btn__bg.opacity--90::before {
        opacity: 0.1;
        background-color: white;
      }
      .base-btn__bg.opacity--100::before {
        opacity: 0.2;
        background-color: white;
      }
    }

    &__content {
      color: currentColor;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s;
    }

    &--disable {
      cursor: not-allowed;
      opacity: 0.45;
    }

    &--flat {
      background-color: transparent;

      .base-btn__bg {
        background-color: inherit;
        opacity: 0;
      }
    }

    &--outline {
      .base-btn__bg {
        &:not(.base-btn__bg--opacity) {
          background-color: transparent;

          &::before {
            background-color: currentColor !important;
          }
        }
      }

      &::before {
        content: '';
        display: block;
        position: absolute;
        inset: 0;
        border-radius: inherit;
        border: 1px solid currentColor;
      }
    }

    &--rounded {
      border-radius: 48px;

      .base-btn__bg,
      .base-btn__bg::before {
        border-radius: 48px;
      }
    }

    &--square {
      border-radius: 0;

      .base-btn__bg,
      .base-btn__bg::before {
        border-radius: 0;
      }
    }
  }
</style>
