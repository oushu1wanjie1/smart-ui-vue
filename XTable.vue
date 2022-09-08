<template>
  <a-table
    :class="{
    'smartui-table-border': bordered,
    'x-ant-table-empty': isEmpty || isConditionalEmpty,
    [`x-table-${id}`]: true,
    'smartui-table-edit': editTable,
    'smartui-table-divider': divider
  }"
    :columns="formattedColumns"
    :customHeaderRow="column => {
      return {
        class: {
          'thead-tr-with-divider': divider,
        }
      }
    }"
    :dataSource="dataSource"
    :expanded-row-keys="expandedRowKeysRef"
    :loading="loading"
    :pagination="mergedPagination"
    :style="{ height: (isEmpty || isConditionalEmpty) ? emptyHeightRef : 'auto' }"
    :rowKey="rowKey"
    class="smartui-table"
    @expand="handleExpand"
    @expandedRowsChange="handleExpandedRowsChange"
  >
    <template
      v-if="!slots.includes('expandIcon') && (slots.includes('expandedRowRender') || isTreeDataRef)"
      #expandIcon="props"
    >
      <icon
        image
        name="ui-common/select_arrow"
        color="comment"
        class="x-table-expand-icon"
        :class="{ 'x-table-expand-icon-shrink': props.expanded}"
        :style="{ visibility:  props.record?.children || slots.includes('expandedRowRender') ? 'unset' : 'hidden' }"
        @click="handleExpandIconClick(!props.expanded, props.record)"
      />
    </template>
    <template v-for="item in slots" :key="item" v-slot:[item]="scope">
      <slot :name="item" v-bind="scope"></slot>
    </template>
    <template v-for="column in columnsHasFilter" :key="column.key" v-slot:[column.slots.filterIcon]>
      <div>
        <span v-if="column.title">{{ column.title }}</span>
        <slot v-else :name="column.slots.title"></slot>
        <icon class="btn-filter-icon" color="currentColor" name="ui-table/filter"/>
      </div>
    </template>
    <template v-for="column in columnsHasFilter" :key="column.key" v-slot:[column.slots.filterDropdown]="scope">
      <!--      用户自定义的filter-->
      <slot v-if="slots.includes(column.slots.filterDropdown)" :name="column.slots.filterDropdown"
            :scope="scope"></slot>
      <!--      默认的filter-->
      <template v-else>
        <div :id="`filter-${id}-${column.key}`"
             :class="{'filter-container': true, 'filter-container-multiple': column.filterMultiple }">
          <div
            v-for="item in scope.filters"
            :key="item.value"
            :class="{ 'filter-item': true, 'filter-item-selected': (filteredColumnKeys.find(fil => fil.key === column.key)?.value || []).some(selectedItem => selectedItem === item.value) }"
            @click="handleFilterItemClick(item, scope, column)">
            <span>{{ item.text }}</span>
          </div>
        </div>
        <x-button v-if="column.filterMultiple" class="filter-multiple-confirm-btn" type="link" @click="scope.confirm()">
          确定
        </x-button>
      </template>
    </template>
    <template v-if="(isEmpty || isConditionalEmpty) && !slots.includes('footer')" #footer>
      <x-empty v-if="isEmpty" :description="emptyDescription || '暂无数据'" :image="emptyImage"
               :image-style="{ width: '80px', height: '73.13px' }">
        <template #description>
          <slot name="emptyDescription"></slot>
        </template>
      </x-empty>
      <x-empty v-if="isConditionalEmpty" :description="conditionalEmptyDescription || '暂无数据'" :image="conditionalEmptyImage"
               :image-style="{ width: '80px', height: '73.13px' }">
        <template #description>
          <slot name="conditionalEmptyDescription"></slot>
        </template>
      </x-empty>
    </template>
  </a-table>
</template>

<script>
import Icon from './helper/Icon.vue'
import {
  computed,
  defineComponent,
  h,
  inject,
  nextTick,
  onBeforeMount,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue'
import XEmpty from '@/smart-ui-vue/XEmpty'
import { uuid } from '@/smart-ui-vue/utils'
import { debounce } from 'lodash-es'
import XButton from '@/smart-ui-vue/XButton'
import { Table as ATable } from 'ant-design-vue'

const AUTO_LOAD_OFFSET = 0.7

export default defineComponent({
  // eslint-disable-next-line vue/no-unused-components
  components: { XButton, XEmpty, Icon, ATable },
  name: 'XTable',
  emits: ['filtered', 'expand', 'expandedRowsChange'],
  props: {
    columns: {
      type: [Array, null],
      default: null,
    },
    dataSource: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    // 是否加上尾部的纵向分隔线
    // 支持在columns中配置，单独为某个column后加分隔线，属性也是divider
    // template风格下不支持，若想在template风格下使用请在a-table-column的default slot下包裹一层<div class="td-with-divider">
    divider: {
      type: Boolean,
      default: false,
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
      default: '',
    },
    // 空状态时高度，默认为auto
    emptyHeight: {
      type: [String, Number, undefined],
      default: 'auto'
    },
    // 自动计算空状态下 table 的高度（至屏幕适口底部）
    autoCalcEmptyHeight: {
      type: Boolean,
      default: false
    },
    // 空状态图片
    emptyImage: {
      type: String,
      default: 'ui-empty/empty',
    },
    // 空状态描述，不填则使用默认值"暂无数据"，默认值的颜色为灰色，非默认值的颜色为黑色，如果需要别的颜色自行修改
    emptyDescription: {
      type: String,
      default: ''
    },
    conditionalEmptyImage: {
      type: String,
      default: 'ui-empty/conditional-empty',
    },
    conditionalEmptyDescription: {
      type: String,
      default: '暂无搜索结果',
    },
    conditional: {
      type: Boolean,
      default: false,
    },
    // 分页配置
    pagination: {
      type: [Object, Boolean],
      default: () => ({}),
    },
    customPageSize: {
      type: Boolean,
      default: false,
    },
    expandedRowKeys: {
      type: Array,
      default: undefined,
    },
    /**
     * 手风琴
     */
    accordion: Boolean,
    /**
     * 是否为可编辑表（影响样式）
     */
    editTable: {
      type: Boolean,
      default: false
    },
    /**
     * 若 record 无 key，
     * 则必须指定 row key，否则会影响功能
     */
    rowKey: {
      type: [String, Number]
    }
  },
  setup(props, context) {
    const { conditional, dataSource, pagination, customPageSize, expandedRowKeys: propExpandedRowKeys } = toRefs(props)
    const MODULE_NAME = inject('$moduleName')
    const id = uuid()
    // 动态filters列表
    const dynamicFilters = ref((props.columns || []).reduce((prev, item) => {
      return {
        ...prev,
        [item.key]: { item: [], pageNum: 1 },
      }
    }, {}))
    const formattedColumns = computed(() => {
      if (!props.columns) return null
      let result = [...props.columns]
      result = result.map(item => {
        const it = { ...item }
        // 劫持默认的filter配置
        if (item.filters) {
          if (item.filters instanceof Function) {
            it.filters = dynamicFilters.value[item.key].item
          }
          if (!item.slots) it.slots = {}
          it.slots.filterIcon = `filterIcon_${item.key}`
          it.slots.filterDropdown = item.slots?.filterDropdown || `filterDropdown_${item.key}`
        }
        return it
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
        showSizeChanger: true,
        onShowSizeChange: (current, size) => {
          if (!customPageSize.value) window.localStorage.setItem('PAGE_SIZE', size)
        },
      }
      if (!customPageSize.value) result.pageSize = Number(window.localStorage.getItem('PAGE_SIZE')) || 20
      return result
    })

    const getEmptyImage = (name) => name ? h(Icon, { name }) : undefined

    const localExpandedRowKeysRef = ref([])
    const expandedRowKeysRef = computed(() => {
      if (propExpandedRowKeys.value)
        return propExpandedRowKeys.value
      else
        return localExpandedRowKeysRef.value
    })
    const handleExpand = (expanded, record) => {
      context.emit('expand', expanded, record)
    }
    const handleExpandedRowsChange = (expandedRowKeys) => {
      context.emit('expandedRowsChange', expandedRowKeys)
    }
    const handleExpandIconClick = (expanded, record) => {
      if (expanded) {
        if (props.accordion) localExpandedRowKeysRef.value = [record.key ?? record[props.rowKey]]
        else localExpandedRowKeysRef.value.push(record.key ?? record[props.rowKey])
      } else {
        localExpandedRowKeysRef.value.splice(
          localExpandedRowKeysRef.value.findIndex(
            (item => (item.key ?? item[props.rowKey]) === (record.key ?? record[props.rowKey])), 1))
      }
      context.emit('expand', expanded, record)
      context.emit('expandedRowsChange', localExpandedRowKeysRef.value)
    }

    const handleFilterItemClick = (item, scope, column) => {
      if (item.value === props.nullFilterValue) {
        // 清除筛选
        scope.clearFilters()
        if (filteredColumnKeys.findIndex(fil => fil.key === column.key) > -1) filteredColumnKeys.splice(filteredColumnKeys.findIndex(fil => fil.key === column.key), 1)
      } else {
        // 筛选
        let value = []
        if (column.filterMultiple) {
          value = [...(filteredColumnKeys.find(fil => fil.key === column.key)?.value || [])]
          if (value.indexOf(item.value) > -1) value.splice(value.indexOf(item.value), 1)
          else value.push(item.value)
        } else value.push(item.value)
        scope.setSelectedKeys(value)
        // 注意从setSelectedKeys开始到confirm完成前不能有任何改变表格状态的操作，一定要放到nextTick里，否则会导致confirm不能正常执行
        nextTick(() => {
          if (filteredColumnKeys.find(fil => fil.key === column.key)) {
            filteredColumnKeys.find(fil => fil.key === column.key).value = [...value]
          } else filteredColumnKeys.push({ key: column.key, value: [...value], confirm: scope.confirm })
        })
      }
      if (!column.filterMultiple) scope.confirm()
    }

    const xTableRef = ref(null)
    const emptyHeightRef = ref(props.emptyHeight)

    const isTreeDataRef = computed(() => props.dataSource.some(item => Array.isArray(item.children)))

    /**
     * 仅在第一次加载完成后执行
     * @type {WatchStopHandle}
     */
    const xTableRefWatchStop = watch(xTableRef, (now, pre) => {
      if (props.autoCalcEmptyHeight)
        emptyHeightRef.value = `calc(100vh - ${now.$el.getBoundingClientRect().top}px - 58px - 20px)`
      xTableRefWatchStop()
    })

    watch(() => [...(propExpandedRowKeys.value ?? [])], () => {
      const rowList = document.querySelectorAll(`.x-table-${id} tbody tr.antv-table-row`)
      rowList.forEach(row => {
        if ((propExpandedRowKeys.value ?? []).includes(row.getAttribute('data-row-key'))) {
          row.classList.add('x-ant-table-row-expanded')
        } else {
          row.classList.remove('x-ant-table-row-expanded')
        }
      })
    })

    onBeforeMount(() => {
      // 动态筛选结果的初始化
      (props.columns || []).forEach(item => {
        if (item.filters instanceof Function) {
          item.filters(dynamicFilters.value[item.key]?.pageNum).then(res => {
            dynamicFilters.value[item.key] = { item: res, pageNum: dynamicFilters.value[item.key].pageNum + 1 }
          })
        }
      })
    })

    onMounted(() => {
      nextTick(() => {
        // 排序图标替换
        document.querySelectorAll('.antv-table-column-sorter-inner .anticon').forEach(item => {
          /* eslint-disable max-len */
          item.innerHTML = `
              <svg image="false" class="icon btn-sort-icon" disabled="false" style="color: currentcolor; stroke: none; fill: currentColor""><use xlink:href="#${MODULE_NAME}/ui-table/sort"></use></svg>
              <svg image="false" class="icon btn-sort-icon btn-sort-icon-asc" disabled="false" style="color: currentcolor; stroke: none; fill: currentColor"><use xlink:href="#${MODULE_NAME}/ui-table/sort-asc"></use></svg>
              <svg image="false" class="icon btn-sort-icon btn-sort-icon-desc" disabled="false" style="color: currentcolor; stroke: none; fill: currentColor""><use xlink:href="#${MODULE_NAME}/ui-table/sort-desc"></use></svg>
            `
        });
        /* eslint-enable max-len */
        // 动态筛选结果的无限滚动
        (props.columns ?? []).forEach(item => {
          if (item.filters instanceof Function) {
            const handleMoreData = debounce((ev) => {
              if (ev.target.scrollTop / (ev.target.scrollHeight - 300) > AUTO_LOAD_OFFSET) {
                item.filters(dynamicFilters.value[item.key]?.pageNum).then(res => {
                  dynamicFilters.value[item.key] = {
                    item: [...dynamicFilters.value[item.key].item, ...res],
                    pageNum: dynamicFilters.value[item.key].pageNum + 1,
                  }
                })
              }
            }, 1000)
            document.getElementById(`filter-${id}-${item.key}`).parentElement.addEventListener('scroll', handleMoreData)
          }
        })
      })
    })
    return {
      isTreeDataRef,
      slots: computed(() => Object.keys(context.slots)),
      formattedColumns,
      columnsHasFilter,
      handleFilterItemClick,
      handleExpand,
      handleExpandedRowsChange,
      handleExpandIconClick,
      getEmptyImage,
      isEmpty,
      isConditionalEmpty,
      mergedPagination,
      id,
      dynamicFilters,
      filteredColumnKeys,
      xTableRef,
      emptyHeightRef,
      expandedRowKeysRef,
    }
  },
})
</script>

<style lang="scss">
@import './styles/components/XTable/index.scss';
</style>
