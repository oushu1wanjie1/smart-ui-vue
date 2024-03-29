<template>
  <x-tooltip v-if="tooltipContent" :title="tooltipContent" :overlayClassName="tooltipClassName">
    <svg :image="image" class="icon" :class="iconExtraClass" :style="iconExtraStyle" :disabled="disabled" @click="handleClick">
      <use :xlink:href="`#${MODULE_NAME || fallbackModuleName}/${namespace}${namespace ? '/': ''}${name}`"></use>
    </svg>
  </x-tooltip>
  <svg v-else :image="image" class="icon" :class="iconExtraClass" :style="iconExtraStyle" :disabled="disabled" @click="handleClick">
    <use :xlink:href="`#${MODULE_NAME || fallbackModuleName}/${namespace}${namespace ? '/': ''}${name}`"></use>
  </svg>
</template>

<script lang="ts">
/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
import { inject, PropType, reactive, toRefs, watch } from 'vue'
import XTooltip from '../XTooltip.vue'

export type ColorType = 'primary' | 'warn' | 'danger' | 'black' | 'white' | 'orange' | 'comment' | 'lineBold' | 'comment-blue' | 'comment-black' | string
const COLOR_TYPE_LIST = ['primary', 'warn', 'danger', 'black', 'white', 'orange', 'comment', 'lineBold', 'comment-blue', 'comment-black']
export default {
  name: 'Icon',
  components: { XTooltip },
  props: {
    tooltipContent: {
      type: String,
      default: '',
    },
    tooltipClassName: {
      type: String,
      default: '',
    },
    // image模式，在这个模式下无法改变图标颜色，用于处理复杂图形的显示bug
    // 翻译：避免 stroke 带来的影响
    image: {
      type: Boolean,
      default: false,
    },
    // svg 名称
    name: String,
    // (可选) 自定义sprite命名空间
    // 防止多个sprite数据源svg名称冲突
    namespace: {
      type: String,
      default: '',
    },
    color: {
      type: String as PropType<ColorType>,
      default: 'primary',
    },
    disabled: {
      type: Boolean,
      default: false
    },
    iconStyle: {
      type: Object as PropType<{
        [value: string]: string
      }>,
      default: () => {
        return {}
      },
    },
    iconClass: {
      type: Object as PropType<{
        [value: string]: boolean
      }>,
      default: () => {
        return {}
      },
    },
    // 当获取不到provide的ModuleName时，通过这个参数手动添加
    fallbackModuleName: {
      type: String,
      default: ''
    }
  },
  emits: ['click'],
  setup(props: any, context: any) {
    const MODULE_NAME = inject('$moduleName')
    // 设置图标默认颜色 start
    const colorRefs = reactive<{
      iconExtraClass: {
        [value: string]: boolean
      },
      iconExtraStyle: {
        [value: string]: string
      },
    }>({
      iconExtraClass: {
        ...(props.iconClass || {}),
      },
      iconExtraStyle: {
        ...(props.iconStyle || {}),
      },
    })
    const configColor = () => {
      const color = `${props.color}`
      if (COLOR_TYPE_LIST.includes(color)) {
        colorRefs.iconExtraClass[`icon-${color}-color`] = true
      } else {
        colorRefs.iconExtraStyle.color = `${color}`
        colorRefs.iconExtraStyle.stroke = `${color}`
      }
    }
    watch(() => props.color, () => { // 直接监听
      configColor()
    })
    configColor()
    const handleClick = (event: Event) => {
      if (props.disabled) {
        event.preventDefault()
        return
      }
      context.emit('click', event)
    }
    // 设置图标默认颜色 end
    return {
      ...toRefs(colorRefs),
      handleClick,
      MODULE_NAME
    }
  },
}
</script>

<style lang="scss">
// 因为 icon 是初始倒入的，所以其他需要全局引入的也放在这
@import "../styles/components/XMessage";

.icon {
  width: 18px;
  height: 18px;
  overflow: hidden;
  vertical-align: -4px;
  outline: none;
  transition: all .35s;
  fill: currentColor;
  // 避免某些情况下浏览器的自动样式
  stroke: currentColor;

  &[image="true"] {
    fill: none !important;
    stroke: none !important;
  }

  &[disabled="true"] {
    cursor: not-allowed !important;
    color: $color-text-comment !important;
    stroke: $color-text-comment !important;
  }
}

.icon.icon-primary-color {
  color: $color-primary-blue;
  stroke: $color-primary-blue;
}

.icon.icon-danger-color {
  color: $color-danger;
  stroke: $color-danger;
}

.icon.icon-warning-color {
  color: $color-warn;
  stroke: $color-warn;
}

.icon.icon-black-color {
  color: $color-primary-black;
  stroke: $color-primary-black;
}

.icon.icon-white-color {
  color: white;
  stroke: white;
}

.icon.icon-orange-color {
  color: $color-primary-orange;
  stroke: $color-primary-orange;
}

.icon.icon-comment-color {
  color: $color-text-comment;
  stroke: $color-text-comment;
}
.icon.icon-comment-blue-color {
  color: $color-text-comment;
  stroke: $color-text-comment;

  &:hover {
    color: $color-primary-blue;
    stroke: $color-primary-blue;
  }
}

.icon.icon-comment-black-color {
  color: $color-text-comment;
  stroke: $color-text-comment;

  &:hover {
    color: $color-primary-black;
    stroke: $color-primary-black;
  }
}


.icon.icon-line-bold {
  color: $color-line-bold;
  stroke: $color-line-bold;
}
</style>
