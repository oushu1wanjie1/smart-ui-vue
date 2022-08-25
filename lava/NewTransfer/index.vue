<template>
  <div class="custom-transfer">
    <div class="custom-transfer-left">
      <div class="custom-transfer-left-title">
        {{ `选择${name}（共${localTotal}个）` }}
        <!-- 搞个 slot 最好 -->
        <slot name="headerButton"></slot>
      </div>
      <!-- 左侧的 table -->
      <div class="custom-transfer-left-table">
        <!-- 搜索框 -->
        <x-input
          v-model:value="searchLeftText"
          :placeholder="`请输入${name}名称/备注`"
          class="raw"
          @change="handleLeftSearchWithDebounce"
        >
          <template #suffix>
            <Icon name="search"></Icon>
          </template>
        </x-input>
        <x-table
          :columns="leftColumns"
          :custom-row="leftCustomRow"
          :data-source="leftDataList"
          :loading="localLoading"
          :pagination="false"
          :rowKey="rowKey"
          :rowSelection="leftRowSelection"
          :scroll="{ y: '100%' }"
          @change="handleLeftTableChange"
        >
          <template v-for="item in leftTableSlots" :key="item" v-slot:[item]="scope">
            <slot :name="item" v-bind="scope"></slot>
          </template>
          <template v-if="!leftTableSlots.includes('footer')" #footer>
            <template v-if="leftDataList.length < localTotal && !localLoading">
              <p class="custom-transfer-load-more" @click="handleLoadMoreData">
                加载更多...
              </p>
            </template>
          </template>
        </x-table>
      </div>
    </div>
    <div :style="{ flexBasis: rightTableFlexBasis}" class="custom-transfer-right">
      <div class="custom-transfer-right-title">
        {{ `已关联${name}（共${rightSelectedRowAfterSearch.length}个）` }}
      </div>
      <!-- 右侧的 table -->
      <div class="custom-transfer-right-table">
        <!-- 搜索框 -->
        <x-input
          v-model:value="searchRightText"
          :placeholder="`请输入${name}名称`"
          class="raw"
        >
          <template #suffix>
            <Icon name="search"></Icon>
          </template>
        </x-input>
        <x-table
          :columns="rightColumns"
          :custom-row="rightCustomRow"
          :data-source="rightSelectedRowAfterSearch"
          :pagination="false"
          :row-selection="rightRowSelection"
          :rowKey="rowKey"
          :scroll="{ y: '100%' }"
        >
          <template v-for="item in rightTableSlots" :key="item" v-slot:[item]="scope">
            <slot :name="item" v-bind="scope"></slot>
          </template>
          <template
            v-if="!rightTableSlots.includes('footer') && rightSelectedRowAfterSearch.length === 0"
            #footer
          >
          </template>
        </x-table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
/* eslint-disable */
/* tslint:disable */
// eslint-disable-next-line no-unused-vars
import { computed, defineComponent, PropType, reactive, Ref, ref, watch } from 'vue'
import Icon from '@/smart-ui-vue/helper/Icon.vue'
import http, { Response } from 'lava-fe-lib/lib-common/http'
import { useModel } from '@/smart-ui-vue/utils'
import LavaUserInfo from '@/smart-ui-vue/lava/LavaUserInfo.vue'
import qs from 'qs'
import { debounce } from 'lodash'
import { message } from 'ant-design-vue-3'
import XInput from '@/smart-ui-vue/XInput.vue'
import XTable from '@/smart-ui-vue/XTable.vue'

interface Params {
  pageNum: number,
  pageSize: number,
  search?: string,
  roleType?: string
}

interface Data {
  total: number,
  data: any[] | null
}

export interface SpecialNameAndValProps {
  nameProp: string,
  valProp: string
}

const PAGE_SIZE = 10

export default defineComponent({
  name: 'SmartTransfer',
  props: {
    // 标题，字符串，必需
    name: {
      type: String,
      required: true,
    },
    /**
     * 数据API接口，字符串，必需
     * String: 数据API接口
     * Array: 数据由外部传入
     */
    dataSource: {
      type: [String, Array],
      required: true,
    },
    /**
     * 总数据量条数
     * 外部控制数据时使用
     */
    total: {
      type: Number,
      default: Number.MAX_SAFE_INTEGER,
    },
    // 已勾选数据，数组，必需
    selectedDataProp: {
      type: Array as PropType<any[]>,
    },
    /**
     * 取决于当前穿梭框所在 drawer 的 visible 状态
     * 根据状态进行相应的处理
     */
    reload: {
      type: Boolean,
      required: true,
    },
    leftColumns: {
      type: [Array, null] as PropType<Array<any> | null>,
      default: null,
    },
    rowKey: {
      type: String,
      required: true,
    },
    rightColumns: {
      type: [Array, null] as PropType<Array<any> | null>,
      default: null,
    },
    /**
     * number 类型解释为百分比
     */
    height: {
      type: [String, Number],
      default: 100,
    },
    rightTableFlexBasis: {
      type: String,
      default: '200px',
    },
    /**
     * 额外配置
     * 1. name 映射
     *   例如，接口返回的 role_type 字段，在搜索时却又叫做 roleType
     * 2. 请求接口时，有专门的两个字段，一个是搜索的字段名，一个是搜索的值
     */
    extraNameMap: {
      type: Object as PropType<Record<string, string>>,
    },
    specialFilterNameAndVal: {
      type: Object as PropType<SpecialNameAndValProps>,
    },
    /**
     * 右侧输入框是前端本地搜索
     */
    rightSearchFunc: {
      type: Function as PropType<(row: any, searchText: string) => boolean>,
      default: (row: any, searchText: string) => {
        return row.name?.includes(searchText) || (row.description ?? row.name_remark ?? '').includes(searchText)
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
    'onUpdate:selectedDataProp': Function,
    'onUpdate:loading': Function,
    /**
     * 外部通过该回调函数控制输入
     */
    'onChange': Function as PropType<(pageNum: number, pageSize: number, searchVal: string, filterProp: string, filterVal: any) => void>,
  },
  emits: ['update:selectedDataProp', 'change'],
  // eslint-disable-next-line vue/no-unused-components
  components: { XTable, XInput, LavaUserInfo, Icon },
  setup(props, context) {
    // 穿梭框左侧数据
    const leftDataList: any[] = reactive([])
    // 页数
    const pageNum = ref(1)
    // 数据总条数
    const localTotal = ref(props.total)
    watch(() => props.total, () => {
      localTotal.value = props.total
    })
    // 穿梭框左侧的搜索框
    const searchLeftText = ref('')
    // 请求数据时是否带上左侧输入框内容
    const shouldUseSearchLeftText = computed(() => searchLeftText.value.length > 0)
    // 穿梭框右侧的搜索框
    const searchRightText = ref('')
    // 数据加载时的loading状态
    const localLoading: Ref<boolean> = ref(props.loading)
    watch(() => props.loading, () => {
      localLoading.value = props.loading
    })
    const filterNameRef = ref('')
    const filterValRef = ref('') as any

    /**
     * 加载更多数据
     * 1. 外部控制
     * 2. 内部控制，append 到队尾
     */
    const handleLoadMoreData = async() => {
      if (typeof props.dataSource !== 'string') {
        // 外部控制数据
        context.emit('change', pageNum, PAGE_SIZE, searchLeftText.value, filterNameRef.value, filterValRef.value)
        return
      }

      // 内部控制数据
      localLoading.value = true

      const params: Record<string, any> = {
        pageNum: pageNum.value,
        pageSize: PAGE_SIZE,
      }

      // 是否带上搜索内容
      if (shouldUseSearchLeftText.value) {
        params.search = searchLeftText.value
      }

      // 是否带上 filter 内容
      if (filterNameRef.value !== '' && filterValRef.value !== '') {
        // 指定了属性名、搜索值名
        if (props.specialFilterNameAndVal !== undefined) {
          // 有映射名用映射名字
          // 没有就用字段名
          params[props.specialFilterNameAndVal.nameProp] = props.extraNameMap
            ? props.extraNameMap[filterNameRef.value] : filterNameRef.value
          params[props.specialFilterNameAndVal.valProp] = props.extraNameMap
            ? props.extraNameMap[filterValRef.value] : filterValRef.value
        } else {
          // 有映射名用映射名字
          // 没有就用字段名
          params[props.extraNameMap ? props.extraNameMap[filterNameRef.value] : filterNameRef.value] = filterValRef.value
        }
      }

      try {
        // 请求数据接口，得带上请求条件 searchText
        const result: Response<Data> = await http.get(props.dataSource, {
          params,
          paramsSerializer: params => {
            return qs.stringify(params, {
              indices: false,
            })
          },
        })

        // if (result.meta?.success) {
        // mock data success can be ture or false.
        if (result.meta.success) {
          pageNum.value++
          localTotal.value = result.data.total

          // 获取数据
          const resultData = result.data.data ?? []

          // 加到队尾
          leftDataList.push(...resultData)
          handleNewData(resultData)
          localLoading.value = false
        } else {
          message.error(`获取数据失败：${result.meta.status_code}`)
        }
      } catch (e) {
        message.error(`获取数据失败：${e}`)
      }
    }

    /**
     * 穿梭框左侧的输入框进行搜索
     * 需要调用后端 API
     */
    const handleLeftSearch = () => {
      // 搜索页也要重置
      pageNum.value = 1
      // 数据也要重置
      leftDataList.length = 0

      handleLoadMoreData()
    }

    const handleLeftSearchWithDebounceWait = 500

    const handleLeftSearchWithDebounce = debounce(() => {
      handleLeftSearch()
    }, handleLeftSearchWithDebounceWait)


    // 左边选中行状态
    const leftSelectedRowsState: any[] = reactive([])
    // 左边选中行的 key 的状态
    const leftTableSelectedRowKeysRef: Ref<any[]> = computed(() => {
      return leftSelectedRowsState.map(item => item[props.rowKey])
    })
    const leftTableSlots = computed(() => (props.leftColumns ?? []).reduce((all, co) => all.concat(Object.values(co.slots)), ([])))
    // 左边 row selection
    const leftRowSelection = computed(() => ({
        columnWidth: '30px',
        selectedRowKeys: leftTableSelectedRowKeysRef,
        onSelect: (record: any, selected: boolean, selectedRows: any[]) => {
          handleToggleLeftSelectVersion2([record], selected)
          if (selected) {
            leftSelectedRowsState.push(record)
          } else {
            leftSelectedRowsState.splice(leftSelectedRowsState.findIndex((item => item[props.rowKey] === record[props.rowKey])), 1)
          }
        },
        onSelectAll: (selected: boolean, selectedRows: any[], changeRows: any[]) => {
          handleToggleLeftSelectVersion2(changeRows, selected)
          if (selected) {
            leftSelectedRowsState.push(...changeRows)
          } else {
            leftSelectedRowsState.splice(0, leftSelectedRowsState.length)
          }
        },
      }
    ))
    const leftSelectRow = (record: any) => {
      const index = leftTableSelectedRowKeysRef.value.indexOf(record[props.rowKey])
      if (index >= 0) {
        leftSelectedRowsState.splice(index, 1)
        handleToggleLeftSelectVersion2([record], false)
      } else {
        leftSelectedRowsState.push(record)
        handleToggleLeftSelectVersion2([record], true)
      }
    }
    const leftCustomRow = (record: any) => {
      return {
        onClick: () => {
          leftSelectRow(record)
        },
      }
    }
    // 左边 load 新数据，判断是否选中
    const handleNewData = (newDataList: any[]) => {
      const selectedSet = new Set(rightTableSelectedRowKeysRef.value)

      newDataList.forEach(item => {
        if (selectedSet.has(item[props.rowKey]))
          leftSelectedRowsState.push(item)
      })
    }
    // left table change
    // @ts-ignore
    const handleLeftTableChange = (pagination, filters, sorter, { currentDataSource }) => {
      if (Object.keys(filters).length > 0) {
        if (filters)
          filterNameRef.value = Object.keys(filters)[0]
        filterValRef.value = filters[filterNameRef.value]
        pageNum.value = 1
        leftDataList.splice(0, leftDataList.length)
        handleLoadMoreData()
      }
    }

    // 左边选中/取消选中数据，右边进行相应的操作
    const handleToggleLeftSelectVersion2 = (needChangeRows: any[], checked: boolean) => {
      const selectedSet = new Set(rightSelectedRowsState.value.map(item => item[props.rowKey]))

      needChangeRows.forEach(item => {
        if (checked && !selectedSet.has(item[props.rowKey])) {
          // 选中 & 右边未包含：右边加上
          rightSelectedRowsState.value.push(item)
        } else if (!checked && selectedSet.has(item[props.rowKey])) {
          // 取消选中，且右边有：右边减去
          // 删除的时间复杂度是 O(n^2)
          // 如果左右两边排序规则是一致的话，时间复杂度能优化到 O(n*log(n))
          rightSelectedRowsState.value.splice(
            rightSelectedRowsState.value.findIndex(row => row[props.rowKey] === item[props.rowKey])!
            , 1)
        }
      })
    }

    // 右边表的 slots
    const rightTableSlots = computed(() => ((props.rightColumns ?? []).reduce((all, co) => all.concat(Object.values(co.slots)), ([]))))
    // 右边选中行状态（实际上就是所有状态了）
    // const rightSelectedRowsState: any[] = reactive(props.selectedDataProp ?? [])
    const rightSelectedRowsState: Ref<any[]> = (typeof props.selectedDataProp === 'object' && typeof props['onUpdate:selectedDataProp'] === 'function')
      ? useModel('selectedDataProp', props, context) as Ref<any[]>
      : ref([])
    // 右边搜索后的数据
    const rightSelectedRowAfterSearch = computed(() => {
      return rightSelectedRowsState.value.filter(row => props.rightSearchFunc(row, searchRightText.value))
    })
    // 右边选中行的 keu 的状态
    const rightTableSelectedRowKeysRef: Ref<any[]> = computed(() => rightSelectedRowsState.value.map(item => item[props.rowKey]))
    // 右边 row selection
    const rightRowSelection = computed(() => ({
        columnWidth: '30px',
        selectedRowKeys: rightTableSelectedRowKeysRef.value,
        onSelect: (record: any, selected: boolean, selectedRows: any[]) => {
          // handleToggleLeftSelectVersion2([record], selected)
          if (selected) {
            // leftSelectedRowsState.push(record)

          } else {
            rightSelectRow(record)
            // rightSelectedRowsState.value.splice(rightSelectedRowsState.value.findIndex(row => row[props.rowKey] === record[props.rowKey])!, 1)
            // leftSelectedRowsState.splice(leftSelectedRowsState.findIndex((item => item[props.rowKey] === record.rowKey)), 1)
          }
        },
        onSelectAll: (selected: boolean, selectedRows: any[], changeRows: any[]) => {
          // handleToggleLeftSelectVersion2(changeRows, selected)
          if (selected) {
            // leftSelectedRowsState.push(...changeRows)
          } else {
            // 右边清空，左边也清空
            rightSelectedRowsState.value.splice(0, rightSelectedRowsState.value.length)
            leftSelectedRowsState.splice(0, leftSelectedRowsState.length)
          }
        },
      }),
    )
    const rightSelectRow = (record: any) => {
      // 右边删
      rightSelectedRowsState.value.splice(rightSelectedRowsState.value.findIndex(row => row[props.rowKey] === record[props.rowKey])!, 1)
      // 左边删
      const index = leftTableSelectedRowKeysRef.value.indexOf(record[props.rowKey])
      if (index >= 0) {
        leftSelectedRowsState.splice(index, 1)
      }
    }
    const rightCustomRow = (record: any) => {
      return {
        onClick: () => {
          rightSelectRow(record)
        },
      }
    }

    watch(() => props.reload, (now, pre) => {
      console.log(now)
      if (now) {
        // 打开抽屉时
        // 重新请求数据
        leftDataList.length = 0
        leftSelectedRowsState.length = 0
        pageNum.value = 1
        handleLoadMoreData()
      } else {
        // 关闭抽屉时
        searchLeftText.value = ''
        searchRightText.value = ''
      }
    }, {
      immediate: true,
    })

    watch(() => props.dataSource, () => {
      if (Array.isArray(props.dataSource)) {
        // 清空原左侧数据 & 追加新数据 & 检查新数据是否已选中
        leftSelectedRowsState.splice(0, leftSelectedRowsState.length)
        leftDataList.splice(0, leftDataList.length, ...props.dataSource)
        handleNewData(props.dataSource)
      }
    })


    return {
      leftDataList,
      searchLeftText,
      searchRightText,
      handleLoadMoreData,
      handleLeftSearch,
      handleLeftSearchWithDebounce,
      localLoading,
      localTotal,

      leftSelectedRowsState,
      leftTableSlots,
      leftRowSelection,
      leftCustomRow,
      handleLeftTableChange,

      rightSelectedRowsState,
      rightSelectedRowAfterSearch,
      rightTableSlots,
      rightRowSelection,
      rightCustomRow,

      height: computed(() => {
        return typeof props.height === 'string' ? props.height : `${props.height}%`
      }),
    }
  },
})
</script>
<style lang="scss">
.custom-transfer {
  display: flex;
  // 100% - header - drawer.header - drawer.bottom.button
  //height: v-bind(height);
  height: calc(v-bind(height));
  padding-top: 2px;
  padding-right: 40px;
  overflow-y: scroll;

  &-left-title,
  &-right-title {
    @include font-small();
    color: $color-text-comment;
  }

  &-left {
    display: flex;
    flex: 6;
    flex-direction: column;
    height: 100%;
    margin-right: 30px;

    &-table {
      flex: 1;
      padding: 20px 20px 0;
      border: 1px solid #EAEAEA;
      border-radius: 4px;

      .smartui-table {

        .#{$ant-prefix}-table-row-selected {

        }

        .#{$ant-prefix}-table-footer {
          max-height: 46px;
          padding-top: 0;
          padding-bottom: 0;

          .custom-transfer-load-more {
            padding: 0;
            cursor: pointer;
          }
        }
      }
    }
  }

  &-right {
    display: flex;
    flex: 0;
    flex-direction: column;

    &-table {
      flex: 1;
      padding: 20px 20px 0;
      border: 1px solid $color-line-bold;
      border-radius: 4px;

      .smartui-table {
        .#{$ant-prefix}-table-body {
          //max-height: calc(100% - 53.5px + 16px) !important;
        }
      }

      .smartui-table:not(.raw).antv-table-wrapper .antv-table-footer {
        display: none;
      }
    }
  }

  &-left,
  &-right {

    &-table {
      flex: 1;
      max-height: calc(100% - 43px);
      padding: 20px 20px 0;
      border: 1px solid $color-line-bold;
      border-radius: 4px;
    }

    .smartui-table:not(.raw).antv-table-wrapper .antv-table {
      border-bottom: none;
    }

    .smartui-table {
      height: calc(100% - 35px) !important;

      .#{$ant-prefix}-spin-nested-loading {
        height: 100%;

        .#{$ant-prefix}-spin-container {
          height: 100%;

          .#{$ant-prefix}-table {
            height: 100%;

            .#{$ant-prefix}-table-content {
              height: 100%;

              .#{$ant-prefix}-table-scroll {
                height: 100%;
                overflow: hidden;

                .#{$ant-prefix}-table-body {
                  max-height: calc(100% - 53.5px + 16px - 32px) !important;
                }
              }
            }
          }
        }
      }
    }
  }
}

// 【搜索】输入框
.custom-transfer-left-table,
.custom-transfer-right-table {
  .#{$ant-prefix}-input-affix-wrapper {
    height: 30px;
    padding-right: 15px;
    padding-left: 15px;
    margin-bottom: 5px;
    border: 1px solid $color-line-bold;
    border-radius: 4px;

    & > input.#{$ant-prefix}-input {
      @include font-small;
      height: 100%;
    }

    &:after {
      display: none;
    }
  }
}

// 穿梭框左右的标题：选择角色(n个）
.custom-transfer-left-title,
.custom-transfer-right-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 30px;
  margin-bottom: 10px;
}

.custom-transfer-left-table-header,
.custom-transfer-right-table-header,
.custom-transfer-left-table-item,
.custom-transfer-right-table-item {
  display: flex;
  align-items: center;

  padding-left: 18px;

  & > div:first-of-type {
    flex: 3;
    margin-left: 13px;
  }

  & > div:nth-of-type(2) {
    flex: 0 0 80px;
    margin-right: 5px;
  }
}

.custom-transfer-left-table-header,
.custom-transfer-right-table-header {
  @include font-normal;
  line-height: 40px;
}

.custom-transfer-left-table-item,
.custom-transfer-right-table-item {
  height: 68px;
}

.custom-transfer-left-table-item-title,
.custom-transfer-right-table-item-title {
  @include font-normal;
  display: -webkit-box;
  margin-bottom: 2px;
  overflow: hidden;
  color: $color-primary-blue;
  cursor: pointer;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.custom-transfer-left-table-item-description,
.custom-transfer-right-table-item-description {
  @include font-small();
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.custom-transfer-left-table-item-selected {
  background-color: $color-line-bold;
}

span, p {
  padding: 0;
  margin: 0
}

.ink-bar {
  width: 100%;
  height: 1px;
  background-color: white;

  &-gray {
    background-color: $color-line-bold;
  }
}


// 【加载更多】按钮
.custom-transfer-load-more {
  @include font-normal;
  padding-top: 6px;
  padding-bottom: 6px;
  color: $color-primary-blue;
  text-align: center;
}

.custom-transfer-no-more {
  @include font-normal;
  padding-top: 7px;
  padding-bottom: 7px;
  color: black;
  text-align: center;
}

.custom-transfer-dropdown-filter {
  background-color: white;
  box-shadow: 0 2px 8px #00000026;

  .#{$ant-prefix}-menu-vertical .#{$ant-prefix}-menu-item {
    padding: 0 12px;
  }

  &-btns {
    display: flex;
    justify-content: space-between;
    padding: 7px 8px;
    border-top: 1px solid #f0f0f0;
  }
}

.spin-container {
  display: flex;
  justify-content: center;
  margin: 8px 0;
}

.filter-icon.active {
  color: $color-primary-blue;
}

.color-comment {
  color: $color-text-comment !important;
}
</style>

