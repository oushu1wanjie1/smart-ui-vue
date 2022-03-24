<template>
  <a-table
    class="smartui-table"
    :class="{ 'smartui-table-border': bordered, 'x-ant-table-empty': isEmpty || isConditionalEmpty }"
    :style="{ height: (isEmpty || isConditionalEmpty) ? emptyHeight : 'auto' }"
    :columns="formattedColumns"
    :dataSource="dataSource"
    :loading="loading"
    :pagination="mergedPagination"
    :customHeaderRow="column => {
      return {
        class: {
          'thead-tr-with-divider': divider,
        }
      }
    }"
  >
    <template v-for="item in slots" :key="item" v-slot:[item]="scope">
      <slot :name="item" v-bind="scope"></slot>
    </template>
    <template v-for="column in columnsHasFilter" :key="column.key" v-slot:[column.slots.filterIcon]>
      <div>
        <span v-if="column.title">{{ column.title }}</span>
        <slot v-else :name="column.slots.title"></slot>
        <icon name="ui-table/filter" color="currentColor" class="btn-filter-icon"/>
      </div>
    </template>
    <template v-for="column in columnsHasFilter" :key="column.key" v-slot:[column.slots.filterDropdown]="scope">
      <div class="filter-container">
        <div
          v-for="item in scope.filters"
          :key="item.value"
          :class="{ 'filter-item': true, 'filter-item-selected': scope.selectedKeys.find(selectedItem => selectedItem === item.value) }"
          @click="handleFilterItemClick(item, scope, column)">
          {{ item.text }}
        </div>
      </div>
    </template>
    <template v-if="!loading && (isEmpty || isConditionalEmpty)" #footer>
      <x-empty v-if="isEmpty" :image="emptyImage" :description="emptyDescription" :image-style="{ width: '180px', height: '164.55px' }">
        <template #description>
          <slot name="emptyDescription"></slot>
        </template>
      </x-empty>
      <x-empty v-if="isConditionalEmpty" :image="conditionalEmptyImage" :description="conditionalEmptyDescription" :image-style="{ width: '180px', height: '164.55px' }">
        <template #description>
          <slot name="conditionalEmptyDescription"></slot>
        </template>
      </x-empty>
    </template>
  </a-table>
</template>

<script>
import Icon from './helper/Icon.vue'
import { computed, defineComponent, h, nextTick, onMounted, reactive, ref, toRefs } from 'vue'
import { NullFilterKey } from './constant'
import XEmpty from '@/smart-ui-vue/XEmpty'
import { useModel } from '@/smart-ui-vue/utils'

export default defineComponent({
  // eslint-disable-next-line vue/no-unused-components
  components: { XEmpty, Icon },
  name: 'XTable',
  emits: ['filtered'],
  props: {
    columns: {
      type: [Array, null],
      default: null
    },
    dataSource: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    // 是否加上尾部的纵向分隔线
    // 支持在columns中配置，单独为某个column后加分隔线，属性也是divider
    // template风格下不支持，若想在template风格下使用请在a-table-column的default slot下包裹一层<div class="td-with-divider">
    divider: {
      type: Boolean,
      default: false
    },
    // 可选项
    // 效果
    // 1. table: 10px padding
    // 2. table: 1px solid border
    bordered: {
      type: Boolean,
      default: false,
    },
    // filter默认空值
    // 默认为''
    nullFilterValue: {
      default: ''
    },
    // 空状态时高度，默认为auto
    emptyHeight: {
      type: [String, Number, undefined],
    },
    emptyImage: {
      type: String,
      default: ''
    },
    emptyDescription: {
      type: String,
    },
    conditionalEmptyImage: {
      type: String,
      default: 'ui-empty/conditional-empty'
    },
    conditionalEmptyDescription: {
      type: String,
      default: '暂无搜索结果'
    },
    conditional: {
      type: Boolean,
      default: false
    },
    // 分页配置
    pagination: {
      type: Object,
      default: () => ({})
    },
    customPageSize: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const { conditional, dataSource, pagination, customPageSize } = toRefs(props)
    const formattedColumns = computed(() => {
      if (!props.columns) return null
      let result = [...props.columns]
      result = result.map(item => {
        const it = { ...item }
        // 劫持默认的filter配置
        if (item.filters) {
          if (!item.slots) it.slots = {}
          it.slots.filterIcon = `filterIcon_${item.key}`
          it.slots.filterDropdown = `filterDropdown_${item.key}`
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

    const columnsHasFilter = computed(() => {
      return (formattedColumns.value || []).filter(item => item.slots && item.slots.filterDropdown)
    })

    const filteredColumnKeys = reactive([])

    const isEmpty = computed(() => !(filteredColumnKeys.length || conditional.value) && !dataSource.value.length)

    const isConditionalEmpty = computed(() => (filteredColumnKeys.length || conditional.value) && !dataSource.value.length)

    const mergedPagination = computed(() => {
      if (!pagination.value) return false
      const result = {
        ...pagination.value,
        itemRender: ({ type, originalElement }) => {
          if (type === 'prev') return h(originalElement, {}, h(Icon, { name: 'ui-table/prev', color: '' }))
          else if (type === 'next') return h(originalElement, {}, h(Icon, { name: 'ui-table/next', color: '' }))
          else return originalElement
        },
        onShowSizeChange: (current, size) => {
          if (!customPageSize.value) window.localStorage.setItem('PAGE_SIZE', size)
        }
      }
      if (!customPageSize.value) result.pageSize = Number(window.localStorage.getItem('PAGE_SIZE')) || 20
      return result
    })

    const getEmptyImage = (name) => name ? h(Icon, { name }) : undefined

    const handleFilterItemClick = (item, scope, column) => {
      if (item.value === props.nullFilterValue) {
        // 清除筛选
        scope.clearFilters()
        if (filteredColumnKeys.indexOf(column.key) > -1) filteredColumnKeys.splice(filteredColumnKeys.indexOf(column.key), 1)
      } else {
        // 筛选
        scope.setSelectedKeys([item.value])
        nextTick(() => {
          if (item.value !== props.nullFilterValue) filteredColumnKeys.push(column.key)
        })
      }
      scope.confirm()
    }

    onMounted(() => {
      nextTick(() => {
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
    })
    return {
      slots: computed(() => Object.keys(context.slots)),
      formattedColumns,
      columnsHasFilter,
      handleFilterItemClick,
      getEmptyImage,
      isEmpty,
      isConditionalEmpty,
      mergedPagination,
      console: console
    }
  }
})
</script>

<style lang="scss">
@import './styles/components/XTable/index.scss';
</style>
