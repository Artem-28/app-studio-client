import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useBaseHover(refElement) {
  const isHovered = ref(false);

  function onMouseEnter() {
    isHovered.value = true;
  }
  function onMouseLeave() {
    isHovered.value = false;
  }

  onMounted(() => {
    refElement.value?.addEventListener('mouseenter', onMouseEnter);
    refElement.value?.addEventListener('mouseleave', onMouseLeave);
  });

  onBeforeUnmount(() => {
    refElement.value?.removeEventListener('mouseenter', onMouseEnter);
    refElement.value?.removeEventListener('mouseleave', onMouseLeave);
  });

  return isHovered;
}
