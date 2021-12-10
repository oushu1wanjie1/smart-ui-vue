<template>
  <a-table
    class="smartui-table"
    :columns="formattedColumns"
    :customHeaderRow="record => {
      return {
        'className': divider && 'thead-tr-with-divider'
      }
    }"
  >
    <template v-for="item in slots" v-slot:[item]="scope">
      <slot :name="item" v-bind="scope"></slot>
    </template>
  </a-table>
</template>

<script>
import { computed, defineComponent, h } from 'vue'

export default defineComponent({
  name: 'XTable',
  props: {
    columns: {
      type: [Array, null],
      default: null
    },
    // 是否加上尾部的纵向分隔线
    // 支持在columns中配置，单独为某个column后加分隔线，属性也是divider
    // template风格下不支持，若想在template风格下使用请在a-table-column的default slot下包裹一层<div class="td-with-divider">
    divider: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const formattedColumns = computed(() => {
      if (!props.columns) return null
      let result = [...props.columns]
      result = result.map(item => {
        const it = { ...item }
        console.log('it', it)
        if (props.divider || item.divider) {
          let render = null
          if ((it.slots && it.slots.customRender) || it.customRender) {
            render = it.slots.customRender || it.customRender
            if (it.slots.customRender) delete it.slots.customRender
            else if (it.customRender) delete it.customRender
          }
          return {
            ...it,
            customRender: (args) => {
              return {
                children: h('div', { className: 'td-with-divider' }, render ? context.slots[render](args) : args.text),
                props: {}
              }
            }
          }
        } else return it
      })
      return result
    })
    return {
      slots: computed(() => Object.keys(context.slots)),
      formattedColumns
    }
  }
})
</script>

<style lang="scss">
@import './styles/components/XTable/index.scss';
</style>
