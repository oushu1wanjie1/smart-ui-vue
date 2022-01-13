import { computed } from 'vue'

export function useModel(name: string, props: any, context: any) {
  return computed({
    get() {
      return props[name]
    },
    set(val) {
      context.emit(`update:${name}`, val)
    },
  })
}

export function getModelType(formItemType: any) {
  switch (formItemType) {
    case 'XSelect':
    case 'XRangePicker':
      return []
    default:
      return null
  }
}

export function getModelName(formItemType: any) {
  switch (formItemType) {
    case 'XSelect':
    case 'XRangePicker':
      return 'value'
    default:
      return 'modelValue'
  }
}

export function upperFirstLetter(str = '') {
  if (!str.length) return ''
  return str[0].toUpperCase() + str.substring(1)
}

export function excludeEventsInProps(propsObj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  for (const key in propsObj) {
    if (!/^on[A-Z]\w+$/.test(key)) result[key] = propsObj[key]
  }
  return result
}

export default {
  useModel,
  getModelType,
  getModelName,
  upperFirstLetter
}
