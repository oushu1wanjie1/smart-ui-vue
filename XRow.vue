<template>
  <a-row v-bind="{...$props}">
    <template #default>
      <slot name="default"/>
    </template>
  </a-row>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'XRow',
  props: {
    /**
     * 转为 flex 布局
     */
    type: String as PropType<'flex'>,
    align: String as PropType<'top' | 'middle' | 'bottom' | 'stretch'>,
    justify: String as PropType<'start' | 'end' | 'center' | 'space-around' | 'space-between'>,
    /**
     * 栅格间隔，可以写成像素值或支持响应式的对象写法来设置水平间隔 { xs: 8, sm: 16, md: 24}。或者使用数组形式同时设置 [水平间距, 垂直间距]
     */
    gutter: {
      type: [Object, Number, Array] as PropType<Record<string, unknown> | number | []>,
      default: 0
    },
    /**
     * 是否换行
     */
    wrap: {
      type: Boolean,
      default: false
    }
  }
})
</script>