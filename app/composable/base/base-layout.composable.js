import { computed, inject, onMounted, onUnmounted, reactive, ref } from 'vue';

export const layoutKey = Symbol('base-layout');

export function useBaseLayout(props) {
  const animated = ref(true);
  let animateTimer = null;

  function animate() {
    clearTimeout(animateTimer);
    animated.value = true;
    animateTimer = setTimeout(() => {
      animated.value = false;
    }, 120);
  }

  const rows = computed(() => {
    const matrix = props.view.toLowerCase().split(' ');
    return {
      top: matrix[0].split(''),
      middle: matrix[1].split(''),
      bottom: matrix[2].split(''),
    };
  });

  const layout = {
    view: computed(() => props.view),
    rows,
    header: reactive({ size: 0, offset: 0, space: false, show: true }),
    left: reactive({ size: 0, offset: 0, space: false, show: false }),
    right: reactive({ size: 0, offset: 0, space: false, show: false }),
    footer: reactive({ size: 0, offset: 0, space: false, show: true }),
    animated,
    animate,
    update(part, key, value) {
      layout[part][key] = value;
    },
  };

  onUnmounted(() => {
    clearTimeout(animateTimer);
  });

  return layout;
}

export function useBaseLayoutChild(part) {
  const layout = inject(layoutKey, null);

  function updateLayout(key, value) {
    if (!layout) return;
    layout.update(part, key, value);
  }

  function useResizeObserver(elRef, onResize) {
    let observer = null;

    onMounted(() => {
      if (!elRef.value) return;
      observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          onResize({ width: entry.contentRect.width, height: entry.contentRect.height });
        }
      });
      observer.observe(elRef.value);
    });

    onUnmounted(() => {
      if (observer) observer.disconnect();
    });
  }

  return { layout, updateLayout, useResizeObserver };
}
