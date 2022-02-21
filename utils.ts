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

/**
 * 转换默认的事件名为props风格的事件名(on开头)
 * @param name 事件名
 */
export function toPropsStyleEventName(name: string): string {
  return `on${name[0].toUpperCase() + name.substring(1)}`
}

/**
 * 判断是否是props风格的事件名
 * @param name
 */
export function isPropsStyleEventName(name: string): boolean {
  return /^on[A-Z][\w|:]+$/.test(name)
}

/**
 * 转换props风格的事件名为默认事件名，如果传入的name格式不为props风格，则原样返回
 * @param propsStyleName
 */
export function toNormalEventName(propsStyleName: string): string {
  if (isPropsStyleEventName(propsStyleName)) {
    // eslint-disable-next-line no-magic-numbers
    return propsStyleName.substring(2).toLowerCase()
  } else {
    return propsStyleName
  }
}

/**
 * 排除Props中所有的事件props
 * @param propsObj
 */
export function excludeEventsInProps(propsObj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  for (const key in propsObj) {
    if (!isPropsStyleEventName(key)) result[key] = propsObj[key]
  }
  return result
}


/**
 * 删除 undefined 的属性
 * - 如果传了参数propKeys，则对propKeys的每一项进行检查，如果没有传值，则在propsObj中删除
 * - 否则，对所有propsObj内的key进行上述检查
 * @param propsObj
 * @param propKeys
 */
export function excludeNotExistProps(propsObj: Record<string, any>, propKeys?: string[]): Record<string, any> {
  const result: Record<string, any> = { ...propsObj }
  if (propKeys) {
    propKeys.forEach((propKey: string) => {
      if (result[propKey] === undefined) {
        delete result[propKey]
      }
    })
  } else {
    Object.keys(result).forEach((key: string) => {
      if (result[key] === undefined) {
        delete result[key]
      }
    })
  }
  return result
}

/**
 * 获取一个随机uuid
 * @param dash
 */
export const uuid = ({ dash } = { dash: true }) => {
  let result = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
  if (!dash) result = result.replaceAll('-', '')
  return result
}