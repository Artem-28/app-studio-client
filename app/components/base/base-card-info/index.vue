<template>
  <base-card :class="rootClass" :tag="tag" :square="square">
    <header v-if="$slots.header || title" class="base-card-info__header">
      <slot name="header">
        <span v-if="title" class="base-card-info__header__title">{{ title }}</span>
      </slot>
      <div v-if="actions.length" class="base-card-info__header__actions">
        <base-button
          v-for="(action, i) in actions"
          :key="i"
          :class="action.class"
          :icon="action.icon"
          :icon-right="action.iconRight"
          :label="action.label"
          :color="action.color"
          :text-color="action.textColor"
          :flat="true"
          padding="0"
          @click="onActionClick(action)"
        />
      </div>
    </header>

    <div :class="contentClass" :style="contentStyle">
      <slot />
    </div>

    <div v-if="selectable || link" class="base-card-info__right-container">
      <template v-if="selectable">
        <base-checkbox :model-value="isSelected" @update:model-value="onCheckboxChange" />
      </template>
      <template v-else-if="link">
        <a
          class="base-card-info__link"
          :href="linkIsHref ? link : undefined"
          :target="linkOptions?.target || undefined"
          @click="onLinkClick"
        >
          <!-- TODO: заменить иконку на base-icon после его реализации -->
          <base-button icon="arrow_tail_right" :flat="true" padding="0" />
        </a>
      </template>
    </div>

    <footer v-if="$slots.footer" class="base-card-info__footer">
      <slot name="footer" />
    </footer>
  </base-card>
</template>

<script setup>
  import { computed } from 'vue';
  import { hClasses } from '@/helpers/index.js';

  const props = defineProps({
    modelValue: {
      default: false,
    },
    tag: {
      type: String,
      default: 'div',
    },
    square: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    actions: {
      type: Array,
      default: () => [],
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    link: {
      type: [String, Boolean],
      default: false,
    },
    linkOptions: {
      type: Object,
      default: null,
    },
    selectValue: {
      default: true,
    },
    contentClass: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits(['update:modelValue', 'command', 'clickLink']);

  const rootClass = computed(() => hClasses('base-card-info').value());

  const isSelected = computed(() => {
    if (Array.isArray(props.modelValue)) {
      return props.modelValue.includes(props.selectValue);
    }
    return props.selectValue === props.modelValue;
  });

  const indexValue = computed(() => {
    if (!Array.isArray(props.modelValue)) return -1;
    return props.modelValue.indexOf(props.selectValue);
  });

  const contentStyle = computed(() => ({
    marginRight: props.selectable || props.link ? '36px' : '0',
  }));

  const contentClass = computed(() => {
    const classes = hClasses('base-card-info__content');
    if (props.contentClass) classes.append(props.contentClass);
    return classes.value();
  });

  const linkIsHref = computed(() => typeof props.link === 'string');

  function getEmitValue(selected) {
    if (Array.isArray(props.modelValue)) {
      const values = [...props.modelValue];
      selected ? values.push(props.selectValue) : values.splice(indexValue.value, 1);
      return values;
    }
    if (selected) return props.selectValue;
    if (typeof props.modelValue === 'boolean') return false;
    if (typeof props.modelValue === 'string') return '';
    return null;
  }

  function onCheckboxChange(checked) {
    emit('update:modelValue', getEmitValue(checked));
  }

  function onActionClick(action) {
    emit('command', action.command);
  }

  function onLinkClick(e) {
    emit('clickLink');
    if (typeof props.linkOptions?.click !== 'function') return;
    e.preventDefault();
    e.stopPropagation();
    const link = linkIsHref.value ? props.link : '';
    props.linkOptions.click(e, link);
  }
</script>

<style scoped lang="scss">
  @use '../../assets/css/variables/index' as *;

  .base-card-info {
    position: relative;
    display: flex;
    gap: 4px;
    flex-direction: column;
    padding: 12px;
    width: fit-content;
    height: fit-content;
    box-sizing: border-box;
    color: white;

    &__header {
      display: flex;
      min-height: 18px;
      align-items: center;
      flex-wrap: nowrap;

      &__title {
        // TODO: заменить на актуальный глобальный класс после определения $color--text-secondary
        color: $color--text-secondary;
        font-size: 12px;
      }

      &__actions {
        display: flex;
        gap: 2px;
        align-items: center;
        margin-left: auto;
      }
    }

    &__content {
      box-sizing: border-box;
    }

    &__right-container {
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-sizing: content-box;
      top: 0;
      right: 0;
      bottom: 0;
      padding-right: 12px;
    }

    &__link {
      position: absolute;
      left: -24px;
      width: 24px;
      height: 24px;
    }

    &__footer {
      box-sizing: border-box;
    }
  }
</style>
