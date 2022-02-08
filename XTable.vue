<template>
  <a-table
    class="smartui-table"
    :class="{ 'smartui-table-border': bordered }"
    :columns="formattedColumns"
    :customHeaderRow="record => {
      return {
        'className': divider && 'thead-tr-with-divider'
      }
    }"
  >
    <template v-for="item in slots" :key="item" v-slot:[item]="scope">
      <slot :name="item" v-bind="scope"></slot>
    </template>
    <template #filterIcon>
      <div>
        <icon name="ui-table/filter" color="currentColor" class="btn-filter-icon"/>
      </div>
    </template>
    <template #filterDropdown="scope">
      <div class="filter-container">
        <div
          v-for="item in scope.filters"
          :key="item.value"
          :class="{ 'filter-item': true, 'filter-item-selected': scope.selectedKeys.find(selectedItem => selectedItem === item.value) }"
          @click="handleFilterItemClick(item, scope)">
          {{ item.text }}
        </div>
      </div>
    </template>
  </a-table>
</template>

<script>
import Icon from './helper/Icon.vue'
import { computed, defineComponent, h, nextTick, onMounted } from 'vue'
import { NullFilterKey } from './constant'

export default defineComponent({
  // eslint-disable-next-line vue/no-unused-components
  components: { Icon },
  name: 'XTable',
  emits: ['filtered'],
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
    },
    // 可选项
    // 1. table: 10px padding
    // 2. table: 1px solid border
    bordered: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const formattedColumns = computed(() => {
      if (!props.columns) return null
      let result = [...props.columns]
      result = result.map(item => {
        const it = { ...item }
        // 劫持默认的filter配置
        if (item.filters) {
          item.slots.filterIcon = 'filterIcon'
          item.slots.filterDropdown = 'filterDropdown'
        }
        // 处理divider
        if (props.divider || item.divider) {
          let render = null
          if ((it.slots && it.slots.customRender) || it.customRender) {
            render = it.slots.customRender || it.customRender
          }
          return {
            ...it,
            slots: { ...it.slots, customRender: undefined },
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
    const handleFilterItemClick = (item, scope) => {
      if (item.value === NullFilterKey) scope.clearFilters()
      else scope.setSelectedKeys([item.value])
      scope.confirm()

      // context.emit('filtered', { item, column: scope.column })
    }

    onMounted(() => {
      document.querySelectorAll('.ant-table-column-sorter-inner .anticon').forEach(item => {
        /* eslint-disable max-len */
        item.innerHTML = `
            <svg image="false" class="icon btn-sort-icon" disabled="false" style="color: currentcolor; stroke: none; fill: currentColor""><use xlink:href="#ui-table/sort"></use></svg>
            <svg image="false" class="icon btn-sort-icon btn-sort-icon-asc" disabled="false" style="color: currentcolor; stroke: none; fill: currentColor"><use xlink:href="#ui-table/sort-asc"></use></svg>
            <svg image="false" class="icon btn-sort-icon btn-sort-icon-desc" disabled="false" style="color: currentcolor; stroke: none; fill: currentColor""><use xlink:href="#ui-table/sort-desc"></use></svg>
          `
      })
      /* eslint-enable max-len */
    })
    return {
      slots: computed(() => Object.keys(context.slots)),
      formattedColumns,
      handleFilterItemClick,
      console: console
    }
  }
})
</script>

<style lang="scss">
@import './styles/components/XTable/index.scss';
</style>
