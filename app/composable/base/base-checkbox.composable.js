import { computed } from 'vue'

export const baseCheckboxProps = {
  modelValue: {
    default: null,
  },
  val: {
    default: undefined,
  },
  trueValue: {
    default: true,
  },
  falseValue: {
    default: false,
  },
  indeterminateValue: {
    default: null,
  },
  toggleIndeterminate: {
    type: Boolean,
    default: false,
  },
  toggleOrder: {
    type: String,
    default: 'tf',
    validator: (v) => v === 'tf' || v === 'ft',
  },
  checkedIcon: {
    type: String,
    default: '',
  },
  uncheckedIcon: {
    type: String,
    default: '',
  },
  indeterminateIcon: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  labelPosition: {
    type: String,
    default: 'right',
    validator: (v) => ['top', 'right', 'bottom', 'left'].includes(v),
  },
  labelColor: {
    type: String,
    default: 'text-secondary',
  },
  color: {
    type: String,
    default: 'accent',
  },
  keepColor: {
    type: Boolean,
    default: false,
  },
  size: {
    type: [String, Number],
    default: 24,
  },
  disable: {
    type: Boolean,
    default: false,
  },
  clickableLabel: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: '',
  },
}

function deepEqual(a, b) {
  if (a === b) return true
  try { return JSON.stringify(a) === JSON.stringify(b) } catch { return false }
}

export function useBaseCheckbox(props, emit) {
  const modelIsArray = computed(() =>
    props.val !== undefined && Array.isArray(props.modelValue),
  )

  const index = computed(() => {
    if (!modelIsArray.value) return -1
    return props.modelValue.findIndex((opt) => deepEqual(opt, props.val))
  })

  const isTrue = computed(() => {
    if (modelIsArray.value) return index.value !== -1
    return deepEqual(props.modelValue, props.trueValue)
  })

  const isFalse = computed(() => {
    if (modelIsArray.value) return index.value === -1
    return deepEqual(props.modelValue, props.falseValue)
  })

  const isIndeterminate = computed(() => !isTrue.value && !isFalse.value)

  const hasIconMode = computed(() =>
    !!(props.checkedIcon || props.uncheckedIcon || props.indeterminateIcon),
  )

  const currentIcon = computed(() => {
    if (isTrue.value) return props.checkedIcon
    if (isIndeterminate.value) return props.indeterminateIcon
    return props.uncheckedIcon
  })

  function getNextValue() {
    if (modelIsArray.value) {
      if (isTrue.value) {
        const val = props.modelValue.slice()
        val.splice(index.value, 1)
        return val
      }
      return props.modelValue.concat([props.val])
    }

    if (isTrue.value && (props.toggleOrder !== 'ft' || !props.toggleIndeterminate)) {
      return props.falseValue
    }
    if (isFalse.value && (props.toggleOrder === 'ft' || !props.toggleIndeterminate)) {
      return props.trueValue
    }
    if (isIndeterminate.value && props.toggleOrder !== 'ft') return props.trueValue
    if (isIndeterminate.value && props.toggleOrder === 'ft') return props.falseValue

    return props.indeterminateValue
  }

  function onClick(e) {
    e.preventDefault()
    e.stopPropagation()
    if (props.disable) return
    emit('update:modelValue', getNextValue(), e)
  }

  function onClickLabel(e) {
    if (props.clickableLabel) return
    e.preventDefault()
    e.stopPropagation()
  }

  return {
    isTrue,
    isFalse,
    isIndeterminate,
    hasIconMode,
    currentIcon,
    onClick,
    onClickLabel,
  }
}
