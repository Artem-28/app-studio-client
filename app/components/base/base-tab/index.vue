<template>
  <div :class="rootClass" role="tab" @click="onClick">
    <div :class="innerClass">
      <!-- TODO: заменить на BaseIcon после реализации спрайта -->
      <span v-if="icon" class="base-tab__icon" :style="{ fontSize: iconSize }">{{ icon }}</span>
      <span v-if="label" class="base-tab__label">{{ label }}</span>
      <slot />
    </div>
  </div>
</template>

<script setup>
  import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue';
  import { hClasses } from '@/helpers/index.js';

  const props = defineProps({
    name: {
      type: [String, Number],
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    disable: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: '',
    },
    iconSize: {
      type: String,
      default: '24px',
    },
    align: {
      type: String,
      default: 'center', // center | left | right
    },
  });

  const emit = defineEmits(['click']);

  const $tabs = inject('base-tabs', null);

  if (!$tabs) {
    console.error('BaseTab должен быть дочерним элементом BaseTabs');
  }

  const rootRef = ref(null);

  const isActive = computed(() => $tabs?.currentModel.value === props.name);
  const isReadonly = computed(() => props.readonly || $tabs?.tabProps.value.readonly);

  const rootClass = computed(() => {
    const classes = hClasses('base-tab');
    if (isActive.value) {
      classes.modify().append('active');
      // TODO: заменить на актуальные глобальные классы после их определения
      if ($tabs?.tabProps.value.activeBgColor)
        classes.append(`bg-color--${$tabs.tabProps.value.activeBgColor}`);
      if ($tabs?.tabProps.value.activeColor)
        classes.append(`color--${$tabs.tabProps.value.activeColor}`);
      if ($tabs?.tabProps.value.activeClass) classes.append($tabs.tabProps.value.activeClass);
    } else {
      // TODO: заменить на актуальные глобальные классы после их определения
      if ($tabs?.tabProps.value.textColor)
        classes.append(`color--${$tabs.tabProps.value.textColor}`);
    }
    if (props.disable) classes.modify().append('disable');
    if (isReadonly.value) classes.modify().append('readonly');
    return classes.value();
  });

  const innerClass = computed(() => {
    const classes = hClasses('base-tab__content');
    if ($tabs?.tabProps.value.inlineLabel) {
      classes.modify().append('inline');
      classes.append(`content-${props.align}`);
    } else {
      classes.append(`items-${props.align}`);
    }
    if ($tabs?.tabProps.value.contentClass) classes.append($tabs.tabProps.value.contentClass);
    return classes.value();
  });

  const onClick = (e) => {
    if (props.disable || isReadonly.value) return;
    $tabs?.updateModel(props.name);
    emit('click', e);
  };

  onMounted(() => {
    $tabs?.registerTab?.({ name: computed(() => props.name), rootRef });
  });

  onBeforeUnmount(() => {
    $tabs?.unregisterTab?.({ name: computed(() => props.name), rootRef });
  });
</script>

<style scoped lang="scss">
  @use '../../assets/css/variables/index' as *;

  .base-tab {
    font-size: 14px;
    padding: 12px;
    line-height: 16px;
    cursor: pointer;
    border-radius: 8px;
    text-align: center;
    color: $color--text-secondary;

    &--active {
      background-color: $color--dark-secondary;
      color: $color--text-primary;
    }

    &__content {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 4px;

      &--inline {
        flex-direction: row;
      }
    }

    &--disable {
      cursor: not-allowed;
      opacity: 0.6;
    }

    &--readonly {
      cursor: default;
    }
  }
</style>
