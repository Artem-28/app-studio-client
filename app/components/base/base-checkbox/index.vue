<template>
  <div :class="rootClass" @click="onClick">
    <div class="base-checkbox__inner-wrap">
      <div :class="innerClass" :style="innerStyle">
        <input
          class="base-checkbox__native"
          type="checkbox"
          :checked="isTrue"
          :disabled="disable"
          :name="name"
          tabindex="-1"
          @click.stop
        />

        <template v-if="hasIconMode">
          <!-- TODO: заменить на BaseIcon после его реализации -->
          <span class="base-checkbox__icon-placeholder">{{ currentIcon }}</span>
        </template>
        <template v-else>
          <div class="base-checkbox__bg-wrapper">
            <div class="base-checkbox__bg">
              <svg class="base-checkbox__svg" viewBox="0 0 24 24">
                <path class="base-checkbox__truthy" d="M3 3h18v18H3V3z" />
                <path class="base-checkbox__indeterminate" d="M4,14H20V10H4" />
              </svg>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div v-if="label || $slots.default" :class="labelClass" @click.stop="onClickLabel">
      <slot>{{ label }}</slot>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import { hClasses } from '@/helpers/index.js';
  import {
    baseCheckboxProps,
    useBaseCheckbox,
  } from '@/composable/base/base-checkbox.composable.js';

  const props = defineProps(baseCheckboxProps);

  const emit = defineEmits(['update:modelValue']);

  const { isTrue, isFalse, isIndeterminate, hasIconMode, currentIcon, onClick, onClickLabel } =
    useBaseCheckbox(props, emit);

  const rootClass = computed(() => {
    const classes = hClasses('base-checkbox');
    const isRow = props.labelPosition === 'right' || props.labelPosition === 'left';

    if (props.disable) classes.modify().append('disable');
    classes.modify().append(`label-${props.labelPosition}`);
    if (isRow) classes.append('flex-center');

    return classes.value();
  });

  const innerClass = computed(() => {
    const classes = hClasses('base-checkbox__inner');

    if (isTrue.value) classes.modify().append('truthy');
    else if (isIndeterminate.value) classes.modify().append('indeterminate');
    else classes.modify().append('falsy');

    // TODO: заменить на актуальные глобальные классы после их определения
    if (props.keepColor || isTrue.value || isIndeterminate.value) {
      classes.append(`color--${props.color}`);
    }

    return classes.value();
  });

  const labelClass = computed(() => {
    const classes = hClasses('base-checkbox__label');

    if (props.clickableLabel) classes.modify().append('clickable');
    classes.modify().append(props.labelPosition);

    // TODO: заменить на актуальные глобальные классы после их определения
    if (props.labelColor) classes.append(`color--${props.labelColor}`);

    return classes.value();
  });

  const innerStyle = computed(() => ({
    fontSize: typeof props.size === 'number' ? `${props.size}px` : props.size,
  }));
</script>

<style scoped lang="scss">
  @use '../../assets/css/variables/index' as *;

  .base-checkbox {
    display: inline-flex;
    outline: 0 !important;
    cursor: pointer;
    vertical-align: middle;
    flex-wrap: nowrap;
    gap: 8px;

    &--label-right {
      flex-direction: row;
      align-items: center;
    }
    &--label-left {
      flex-direction: row-reverse;
      align-items: center;
    }
    &--label-bottom {
      flex-direction: column;
    }
    &--label-top {
      flex-direction: column-reverse;
    }

    &--disable {
      cursor: not-allowed;
      opacity: 0.2;
    }

    &__label {
      user-select: none !important;

      &--clickable {
        cursor: pointer;
      }
    }

    &__inner-wrap {
      width: fit-content;
      height: fit-content;
    }

    &__inner {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1em;
      min-width: 1em;
      height: 1em;
      outline: 0;
      user-select: none !important;
      color: $color--text-description;
      box-sizing: border-box;
      padding: 13.58%;

      &--truthy {
        color: $color--accent;

        .base-checkbox__truthy {
          transform: scale(1, 1);
        }

        .base-checkbox__bg {
          color: white;
        }
      }

      &--indeterminate {
        color: $color--accent;

        .base-checkbox__indeterminate {
          transform: scale(1, 1);
        }

        .base-checkbox__bg {
          color: white;
        }
      }
    }

    &__bg-wrapper {
      border-radius: 8.333%;
      position: relative;
      width: 100%;
      height: 100%;
    }

    &__bg {
      position: absolute;
      box-sizing: border-box;
      border-radius: inherit;
      border: 2px solid currentColor;
      width: 100%;
      height: 100%;
    }

    &__svg {
      position: absolute;
      width: 100% !important;
      height: 100% !important;
      inset: 0;
    }

    &__truthy {
      transform-origin: center;
      transform: scale(0, 0);
      fill: currentColor;
      transition: all 200ms;
    }

    &__indeterminate {
      transform-origin: center;
      transform: scale(0, 1);
      fill: currentColor;
      transition: all 200ms;
    }

    &__native {
      position: absolute;
      display: none;
      margin: 0;
      padding: 0;
      width: 1px;
      height: 1px;
    }
  }
</style>
