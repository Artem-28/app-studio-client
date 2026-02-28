import { computed } from 'vue'
import { useRouter } from 'vue-router'

export const baseRouterLinkProps = {
  to: { type: [String, Object], default: null },
  href: { type: String, default: '' },
  target: { type: String, default: '' },
  replace: { type: Boolean, default: false },
}

export function useBaseRouterLink(props, emit, { fallbackTag = 'div' } = {}) {
  const router = useRouter()

  const hasHrefLink = computed(() => !props.disable && !!props.href)
  const hasRouterLink = computed(() => !props.disable && !!props.to)
  const hasLink = computed(() => hasHrefLink.value || hasRouterLink.value)

  const tag = computed(() => {
    if (hasRouterLink.value) return 'NuxtLink'
    if (hasHrefLink.value) return 'a'
    return fallbackTag
  })

  const linkAttrs = computed(() => {
    if (hasRouterLink.value) return { to: props.to }
    if (hasHrefLink.value) {
      const attrs = { href: props.href }
      if (props.target) attrs.target = props.target
      return attrs
    }
    return {}
  })

  async function navigateOnClick(e) {
    if (props.disable) {
      e.preventDefault()
      e.stopPropagation()
      return
    }

    if (!hasRouterLink.value) {
      emit('click', e)
      return
    }

    if (
      e.metaKey || e.altKey || e.ctrlKey || e.shiftKey
      || (e.button !== undefined && e.button !== 0)
      || props.target === '_blank'
    ) {
      emit('click', e)
      return
    }

    e.preventDefault()
    emit('click', e)

    if (!e.defaultPrevented) {
      await router[props.replace ? 'replace' : 'push'](props.to).catch(() => {})
    }
  }

  return {
    hasHrefLink,
    hasRouterLink,
    hasLink,
    tag,
    linkAttrs,
    navigateOnClick,
  }
}
