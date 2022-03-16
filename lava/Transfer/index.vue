<template>
  <div class="custom-transfer">
    <div class="custom-transfer-left">
      <div class="custom-transfer-left-title">
        {{ `选择${name}（共${data.length}个）` }}
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
          @keyup.enter="handleLeftSearch"
        >
          <template #suffix>
            <Icon name="search" @click="handleLeftSearch"></Icon>
          </template>
        </x-input>
        <!-- 数据头部（name） -->
        <div class="custom-transfer-left-table-header">
          <x-checkbox
            v-model:checked="leftCheckAll"
            :indeterminate="leftIndeterminate"
            @change="handleLeftCheckAll"
          />
          <div>{{ name }}名/备注</div>
          <!-- 目前只有角色有展示第二栏的需要 -->
          <div v-if="name === '角色'">
            <!-- cannot read properties of null (reading 'isCE') -->
            <a-dropdown
              v-model:visible="typeFilterVisible"
              :trigger="['click']"
              @visibleChange="handleTypeDropdownVisibleChange"
            >
              <div>
                {{ name }}类型
                <icon :class="{active:typesItemSelectedList.length > 0}" class="filter-icon" image name="filter"></icon>
              </div>
              <template #overlay>
                <x-menu
                  v-model:selected-keys="typesItemSelectedList"
                  :multiple="true"
                  selectable
                >
                  <!-- 此处 x-menu-item 点击事件失效 -->
                  <a-menu-item v-for="(type, typeIndex) in ROLE_TYPES" :key="typeIndex">
                    <x-checkbox
                      :checked="typesItemSelectedList.indexOf(typeIndex) >= 0"
                    />
                    {{ type }}
                  </a-menu-item>
                  <div class="custom-transfer-dropdown-filter-btns">
                    <a @click="handleConfirmTypeDropdown">确认</a>
                    <a @click="handleClearTypeDropdown">重置</a>
                  </div>
                </x-menu>
              </template>
            </a-dropdown>
          </div>
        </div>
        <div class="ink-bar ink-bar-gray"/>
        <!-- 数据展示 -->
        <div>
          <template v-for="(item,index) in data" :key="item.key">
            <div
              :class="[item.checked ? 'custom-transfer-left-table-item-selected' : '']"
              class="custom-transfer-left-table-item"
              @click="handleSelect(item)"
            >
              <!-- 复选框 -->
              <a-checkbox v-model:checked="item.checked"/>
              <!-- 第一列 -->
              <div>
<!--                <p class="custom-transfer-left-table-item-title">{{ item.name }}</p>-->
<!--                <p class="custom-transfer-left-table-item-description">-->
<!--                  {{-->
<!--                    // 用户组和角色是 description 属性-->
<!--                    // 用户是 name_remark 属性-->
<!--                    item.description ?? item.name_remark-->
<!--                  }}</p>-->
                <lava-user-info
                  :id="item.id"
                  :name="item.name"
                  :remark="item.description ?? item.name_remark"
                  :show-avatar="false"
                />
              </div>
              <!-- 第二列，类型 -->
              <div v-if="name === '角色'">
                <p>{{ ROLE_TYPES[item.role_type] }}</p>
              </div>
            </div>
            <div
              :class="[!item.checked && (index === data.length - 1 || !data[index+1].checked) ? 'ink-bar-gray':'']"
              class="ink-bar"
            />
          </template>
        </div>
        <!-- 加载更多 -->
        <template v-if="data.length < total">
          <div v-if="loading" class="spin-container">
            <a-spin/>
          </div>
          <p v-else class="custom-transfer-load-more" @click="handleLoadMoreData">
            加载更多...
          </p>
        </template>
        <template v-else>
          <p class="custom-transfer-no-more">
            没有更多啦～
          </p>
        </template>
      </div>
    </div>
    <div class="custom-transfer-right">
      <div class="custom-transfer-right-title">
        {{ `已关联${name}（共${selectedData.length}个）` }}
      </div>
      <!-- 右侧的 table -->
      <div class="custom-transfer-right-table">
        <!-- 搜索框 -->
        <x-input
          v-model:value="searchRightText"
          class="raw"
          placeholder="请输入角色名称"
        >
          <template #suffix>
            <Icon name="search"></Icon>
          </template>
        </x-input>
        <!-- 数据头部（name） -->
        <div class="custom-transfer-right-table-header">
          <a-checkbox
            v-bind:checked="rightCheckAllStatus"
            @change="handleRightCheckAll"
          />
          <div><p style="white-space: nowrap;">{{ name }}名/备注</p></div>
        </div>
        <div class="ink-bar ink-bar-gray"/>
        <!-- 数据展示 -->
        <div>
          <template v-for="item in selectedData" :key="item.key">
            <template
              v-if="searchRightText === ''
                || item.name.includes(searchRightText)
                || (item.description ?? item.name_remark).includes(searchRightText)"
            >
              <div class="custom-transfer-right-table-item" @click.prevent="handleUnselect(item)">
                <a-checkbox v-model:checked="item.checked"/>
                <div>
<!--                  <p class="custom-transfer-right-table-item-title">-->
<!--                    {{ item.name }}-->
<!--                  </p>-->
<!--                  <p class="custom-transfer-right-table-item-description">-->
<!--                    {{-->
<!--                      // 用户组和角色是 description 属性-->
<!--                      // 用户是 name_remark 属性-->
<!--                      item.description ?? item.name_remark-->
<!--                    }}-->
<!--                  </p>-->
                  <lava-user-info
                    :id="item.id"
                    :name="item.name"
                    :remark="item.description ?? item.name_remark"
                    :show-avatar="false"
                  />
                </div>
              </div>
              <div class="ink-bar ink-bar-gray"/>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
/* eslint-disable */
/* tslint:disable */
// eslint-disable-next-line no-unused-vars
import { computed, defineComponent, onMounted, PropType, reactive, Ref, ref, watch } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import Icon from '../../helper/Icon.vue'
import http, { Response } from 'lava-fe-lib/lib-common/http'
// @ts-ignore
import smartUI from '../../index.js'
import { RadioChangeEvent } from 'ant-design-vue/es/radio'
import { useModel } from '../../utils'
import LavaUserInfo from '../../lava/LavaUserInfo.vue'

interface Params {
  pageNum: number,
  pageSize: number,
  search?: string,
  roleType?: string
}

interface Data {
  total: number,
  data: any[]
}

const PAGE_SIZE = 10

const ROLE_TYPES = {
  '0': '系统角色',
  '1': '自定义角色',
}

export default defineComponent({
  name: 'SmartTransfer',
  props: {
    // 标题，字符串，必需
    name: {
      type: String,
      required: true,
    },
    // 数据API接口，字符串，必需
    dataSource: {
      type: String,
      required: true,
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
  },
  emits: ['update:selectedDataProp'],
  // eslint-disable-next-line vue/no-unused-components
  components: { LavaUserInfo, SearchOutlined, Icon, ...smartUI },
  setup(props, context) {
    // 穿梭框左侧数据
    const leftDataList: any[] = reactive([])
    // 页数
    const pageNum = ref(1)
    // 数据总条数
    const total = ref(Number.POSITIVE_INFINITY)
    // 穿梭框右侧数据
    // @ts-ignore
    const selectedData: Ref<any[]> = useModel('selectedDataProp', props, context) as Ref<any[]>
    // 穿梭框左侧的全选按钮
    const leftCheckAll = ref(false)
    // 穿梭框左侧的全选按钮的中间态
    const leftIndeterminate = ref(false)
    // 穿梭框左侧的搜索框
    const searchLeftText = ref('')
    // 请求数据时是否带上左侧输入框内容
    const shouldUseSearchLeftText = ref(false)
    // 穿梭框右侧的搜索框
    const searchRightText = ref('')
    // 类型下拉dropdown显示状态
    const typeFilterVisible = ref(false)
    // 类型下拉的菜单选中状态
    const typesItemSelectedList = ref([])
    // 数据加载时的loading状态
    const loading = ref(false)
    // 记录刚打开 dropdown 时已选中元素的状态
    const lastMenuSelectedTypeList: any[] = []

    /**
     * 加载更多数据，追加到现有数据末尾
     */
    const handleLoadMoreData = async() => {
      loading.value = true

      const params: Params = {
        pageNum: pageNum.value,
        pageSize: PAGE_SIZE,
      }

      // 是否带上搜索内容
      if (shouldUseSearchLeftText.value) {
        params.search = searchLeftText.value
      }
      // 是否带上筛选内容（仅【角色】类型）
      if (typesItemSelectedList.value.length > 0) {
        params.roleType = typesItemSelectedList.value.join(',')
      }

      // 请求数据接口，得带上请求条件 searchText
      const result: Response<Data> = await http.get(props.dataSource, {
        params,
      })

      if (result.meta?.success) {
        pageNum.value++
        total.value = result.data.total

        // 已选择项集合，空间换时间
        const rightIdMap = selectedData.value.reduce((tempMap, item) => {
          tempMap[item.id] = true
          return tempMap
        }, {})

        // 获取数据
        const resultData = result.data.data
        resultData.forEach(resultItem => {
          // 新加载的数据，可能之前搜索并且选中过，这样的话 checked 状态需要维护
          resultItem.checked = !!rightIdMap[resultItem.id]
        })

        // 加到队尾
        leftDataList.push(...resultData)
        handleLeftCheckAllStatus()

        loading.value = false
      }
    }

    /**
     * 穿梭框左侧的输入框进行搜索
     * 需要调用后端 API
     */
    const handleLeftSearch = () => {
      // 清楚筛选框状态
      typesItemSelectedList.value.length = 0
      lastMenuSelectedTypeList.length = 0

      // 发起请求，根据 searchLeftText 进行查询
      shouldUseSearchLeftText.value = searchLeftText.value !== ''
      // 搜索页也要重置
      pageNum.value = 1
      // 数据也要重置
      leftDataList.length = 0

      handleLoadMoreData()
    }

    /**
     * 维护左侧全选状态
     */
    const handleLeftCheckAllStatus = () => {
      const checkedLength = leftDataList.reduce((checkedLen, dataItem) => {
        return dataItem.checked ? checkedLen + 1 : checkedLen
      }, 0)
      leftIndeterminate.value = !!checkedLength && checkedLength < leftDataList.length
      leftCheckAll.value = !!checkedLength && checkedLength === leftDataList.length
    }

    /**
     * 处理左侧的数据，并处理右边相关的变换
     * 场景：
     * 1. 左侧点选、全选
     *
     * 提取通用部分做成函数
     */
    const handleToggleLeftSelect = (needChangeItems: any[], checked: boolean) => {
      // 左边的数据切换
      // maybe 影响右边的数据
      // { index: value } => { value.id: index }
      const map = selectedData.value.reduce((tempMap, selectedItem, selectedItemIndex) => {
        tempMap[selectedItem.id] = selectedItemIndex
        return tempMap
      }, {}) ?? {}

      // 从后向前遍历所有元素，若 id 在左边出现，则删掉
      // 为什么从后向前删除：不会影响 index，减少数组抖动
      for (let i = needChangeItems.length - 1; i >= 0; i--) {
        const item = needChangeItems[i]

        // checked 状态更新
        item.checked = checked

        if (checked && map[item.id] === undefined) {
          // 左边勾选，并且右边未曾记录过
          selectedData.value?.push({ ...item })
        } else if (!checked && map[item.id] !== undefined) {
          // 左边反选，并且右边记录过
          selectedData.value?.splice(map[item.id], 1)
        }
      }
      // 排序
      selectedData.value.sort((a, b) => a.id - b.id)
    }

    /**
     * 处理右侧取消的数据
     * 右侧点击只有取消，没有选中，则没有第二个参数 checked
     */
    const handleRightUnselect = () => {
      // maybe 影响左边的数据
      // { index: value } => { value.id: index }
      const map = leftDataList.reduce((tempMap, item, itemIndex) => {
        tempMap[item.id] = itemIndex
        return tempMap
      }, {})

      // 右侧删除反选的数据，且左侧维护对应数据的选中状态
      for (let i = selectedData.value.length - 1; i >= 0; i--) {
        const selectedItem = selectedData.value[i]

        if (selectedItem.waitingDelete === true) {
          selectedData.value.splice(i, 1)

          // eslint-disable-next-line no-unused-expressions
          map[selectedItem.id] !== undefined && (leftDataList[map[selectedItem.id]].checked = false)
        }
      }

      // 维护左侧全选状态
      handleLeftCheckAllStatus()
    }

    /**
     * 穿梭框左侧点击某条数据（选择 or 取消），穿梭框右侧进行相应的同步
     * @param item 当前点击的数据
     */
    const handleSelect = (item: any) => {
      handleToggleLeftSelect([item], !item.checked)
      handleLeftCheckAllStatus()
    }

    /**
     * 穿梭框左侧，点击全选按钮
     * @param e 左侧全选按钮点击事件
     */
    const handleLeftCheckAll = (e: RadioChangeEvent) => {
      leftIndeterminate.value = false
      handleToggleLeftSelect(leftDataList, e.target.checked)
    }

    /**
     * 穿梭框右侧点击某条数据（取消），左侧进行相应的同步
     * @param item 当前点击的数据
     */
    const handleUnselect = (item: any) => {
      item.waitingDelete = true
      handleRightUnselect()
    }

    /**
     * 穿梭框右侧，点击全选按钮
     * @param e 右侧全选按钮点击事件
     */
    const handleRightCheckAll = (e: RadioChangeEvent) => {
      if (e.target.checked) {
        return
      }

      selectedData.value.forEach(selectedItem => {
        // 考虑【筛选状态】下的全选
        if (searchRightText.value === ''
          || selectedItem.title.includes(searchRightText.value)
          || selectedItem.description.includes(searchRightText.value)) {
          selectedItem.waitingDelete = true
        }
      })
      handleRightUnselect()
    }

    const handleTypeDropdownVisibleChange = (visible: boolean) => {
      // 当下拉框拉起的时候，得记录其进入时的状态，再其出去时，若两者状态一致，则不需要做任何改变
      if (visible) {
        lastMenuSelectedTypeList.splice(0, lastMenuSelectedTypeList.length, ...typesItemSelectedList.value)
      }
    }

    /**
     * 隐藏类型的筛选下拉菜单
     */
    const handleHideTypeDropdown = () => {
      typeFilterVisible.value = false
    }

    /**
     * 确定筛选条件
     */
    const handleConfirmTypeDropdown = () => {
      handleHideTypeDropdown()

      // 比较两个数组内容是否相等，方法比较简单粗暴，两个数组排序后转换成字符串，比较是否相等
      if ([...typesItemSelectedList.value].sort((a, b) => a - b).join('') !==
        [...lastMenuSelectedTypeList].sort((a, b) => a - b).join('')) {
        // 勾选数据有变化，重新请求数据
        // 若搜索框有数据，并且点击过，还得带上搜索框的条件
        leftDataList.length = 0
        pageNum.value = 1
        handleLoadMoreData()
      }
    }

    /**
     * 重置筛选条件
     */
    const handleClearTypeDropdown = () => {
      typesItemSelectedList.value.length = 0

      if (lastMenuSelectedTypeList.length !== 0) {
        // 重新请求数据
        leftDataList.length = 0
        pageNum.value = 1
        handleLoadMoreData()
      }
      handleHideTypeDropdown()
    }

    watch(() => props.reload, (now, pre) => {
      if (now) {
        // 打开抽屉时
        // 重新请求数据
        leftDataList.length = 0
        pageNum.value = 1
        selectedData.value.forEach(item => item.checked = true)
        handleLoadMoreData()
      } else {
        // 关闭抽屉时
        searchLeftText.value = ''
        searchRightText.value = ''
      }
    })

    /**
     * transfer 右侧 check-box 的状态
     * 选中状态：
     * 1. 无搜索 + （数据 >= 1条）
     * 2. 有搜索 + （搜索到的数据 >= 1条）
     */
    const rightCheckAllStatus = computed(() => {
      const searchValue = searchRightText.value
      // eslint-disable-next-line no-extra-parens
      return (searchValue === '' && selectedData.value.length > 0) || (searchValue !== '' &&
        selectedData.value.some(item => item.name.includes(searchValue) || (item.description ?? item.name_remark).includes(searchValue)))
    })

    return {
      data: leftDataList,
      selectedData,
      searchLeftText,
      searchRightText,
      leftCheckAll,
      leftIndeterminate,
      rightCheckAllStatus,
      typeFilterVisible,
      handleSelect,
      handleLeftCheckAll,
      handleUnselect,
      handleRightCheckAll,
      handleLoadMoreData,
      handleLeftSearch,
      handleConfirmTypeDropdown,
      handleClearTypeDropdown,
      ROLE_TYPES,
      typesItemSelectedList,
      handleTypeDropdownVisibleChange,
      loading,
      total,
    }
  },
})
</script>
<style lang="scss">
@import "../../../../../lava-ui-permissions/src/smart-ui-vue/styles/mixins";
@import "../../../../../lava-ui-permissions/src/smart-ui-vue/styles/variables";

.custom-transfer {
  display: flex;
  // 100% - header - drawer.header - drawer.bottom.button
  height: calc(100vh - 60px - 74px - 70px);
  padding-top: 2px;
  padding-right: 40px;
  overflow-y: scroll;

  &-left-title,
  &-right-title {
    @include font-small();
    color: $color-text-comment;
  }

  &-left {
    flex: 7;
    display: flex;
    flex-direction: column;
    height: 100%;
    margin-right: 30px;

    &-table {
      flex: 1;
      padding: 20px 20px 0;
      border: 1px solid #EAEAEA;
      border-radius: 4px;
    }
  }

  &-right {
    flex: 3;
    display: flex;
    flex-direction: column;

    &-table {
      flex: 1;
      padding: 20px 20px 0;
      border: 1px solid $color-line-bold;
      border-radius: 4px;
    }
  }
}

// 【搜索】输入框
.custom-transfer-left-table,
.custom-transfer-right-table {
  .ant-input-affix-wrapper {
    height: 30px;
    padding-right: 15px;
    padding-left: 15px;
    border: 1px solid $color-line-bold;
    border-radius: 4px;

    & > input.ant-input {
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
    flex: 1;
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
  margin-bottom: 2px;
  color: $color-primary-blue;
  cursor: pointer;
}

.custom-transfer-left-table-item-description,
.custom-transfer-right-table-item-description {
  @include font-small;
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
  padding-top: 7px;
  padding-bottom: 7px;
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

  .ant-menu-vertical .ant-menu-item {
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
</style>

