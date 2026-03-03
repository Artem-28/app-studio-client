<template>
  <div class="base-tab-panels">
    <Transition v-if="animated" :name="transitionName">
      <div :key="modelValue" class="base-tab-panels__panel">
        <slot />
      </div>
    </Transition>
    <div v-else class="base-tab-panels__panel">
      <slot />
    </div>
  </div>
</template>

<script setup>
  import { computed, provide, ref, watch } from 'vue';

  const props = defineProps({
    modelValue: {
      type: [String, Number],
      required: true,
    },
    animated: {
      type: Boolean,
      default: false,
    },
    transitionDuration: {
      type: [Number, String],
      default: 300,
    },
  });

  const emit = defineEmits(['beforeTransition', 'transition']);

  const prevModel = ref(props.modelValue);
  const direction = ref(1);

  watch(
    () => props.modelValue,
    (newVal, oldVal) => {
      emit('beforeTransition', newVal, oldVal);
      direction.value = newVal > oldVal ? 1 : -1;
      prevModel.value = oldVal;
      setTimeout(
        () => emit('transition', newVal, oldVal),
        parseInt(String(props.transitionDuration))
      );
    }
  );

  const transitionName = computed(() => (direction.value === 1 ? 'slide-left' : 'slide-right'));

  provide('base-tab-panels', {
    currentModel: computed(() => props.modelValue),
  });
</script>

<style scoped lang="scss">
  .base-tab-panels {
    position: relative;
    overflow: hidden;
    box-sizing: inherit;

    &__panel {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      overflow: auto;
    }
  }

  .slide-left-enter-active,
  .slide-left-leave-active,
  .slide-right-enter-active,
  .slide-right-leave-active {
    transition:
      transform v-bind('`${parseInt(String(transitionDuration))}ms`') ease,
      opacity v-bind('`${parseInt(String(transitionDuration))}ms`') ease;
    position: absolute;
    width: 100%;
  }

  .slide-left-enter-from {
    transform: translateX(100%);
    opacity: 0;
  }
  .slide-left-leave-to {
    transform: translateX(-100%);
    opacity: 0;
  }
  .slide-right-enter-from {
    transform: translateX(-100%);
    opacity: 0;
  }
  .slide-right-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }
</style>
