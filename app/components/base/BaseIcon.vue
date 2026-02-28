<template>
  <i :class="rootClass" :style="rootStyle">
    <svg class="base-icon__svg">
      <use :href="`#${iconId}`" />
    </svg>
  </i>
</template>

<script setup>
// TODO: создать BaseIconSprite.vue со всеми SVG символами и подключить его один раз в app-layout.vue
// Спрайт должен содержать <symbol id="base-icon__name"> для каждой иконки из ICON_SPRITE ниже.
// Образец: app/components/perenos/components/src/lib/components/t-icon/sprite/TIconSprite.vue
// (переименовать ID с t-icon__ → base-icon__)

import { computed } from 'vue'
import { hClasses } from '../../helpers/index.js'


// TODO: пример спрайта

const ICON_SPRITE = {
  burger: 'base-icon__burger',
 
}

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '',
  },
  size: {
    type: [String, Number],
    default: 24,
  },
})

const emit = defineEmits(['click'])

const iconId = computed(() => ICON_SPRITE[props.name] ?? `base-icon__${props.name}`)

const rootClass = computed(() => {
  const classes = hClasses('base-icon')
  // TODO: заменить на актуальные глобальные классы после их определения
  if (props.color) classes.append(`color--${props.color}`)
  return classes.value()
})

const rootStyle = computed(() => ({
  fontSize: typeof props.size === 'number' ? `${props.size}px` : props.size,
}))
</script>

<style scoped lang="scss">
.base-icon {
  position: relative;
  display: inline-flex;
  color: currentColor;
  width: 1em;
  min-width: 1em;
  height: 1em;

  &__svg {
    position: absolute;
    width: 100% !important;
    height: 100% !important;
    inset: 0;
  }
}
</style>
