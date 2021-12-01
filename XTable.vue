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
      type: Array,
      default: () => []
    },
    // 是否加上纵向分隔线，暂不可用于template风格，之后有需求会优化
    divider: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const formattedColumns = computed(() => {
      let result = [...props.columns]
      if (!props.divider) return result
      result = result.map(item => {
        const it = { ...item }
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
