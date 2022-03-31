<template>
  <template v-if="slots.includes('prefixIcon')">
    <!-- 自定义前缀 icon -->
    <div class="smartui-select-with-prefix-icon" :class="[disabled ? 'smartui-select-with-prefix-icon-disabled' : '', isInForm ? 'width-100': '']" :borderedNormal="borderedNormal">
      <a-select
        class="smartui-select"
        v-model:value="valueLocal"
        v-bind="mergedAttrs"
        :class="[borderedNormal ? '' : 'smartui-select-no-bordered-normally', isInForm ? 'smartui-select-in-form' : '']"
      >
        <template v-for="item in slots.filter(item => item !== 'prefixIcon')" v-slot:[item]="scope">
          <slot :name="item" v-bind="{...scope}"></slot>
        </template>
        <!-- 未自定义 suffixIcon & 展示小箭头时：替换小箭头 -->
        <template v-if="!slots.includes('suffixIcon') && showArrow !== false" v-slot:suffixIcon>
          <icon name="ui-select/select_arrow" class="x-select-custom-arrow"/>
        </template>
        <!-- 未自定义 notFoundContent 时 -->
        <template v-if="!slots.includes('notFoundContent')" v-slot:notFoundContent>
          <div style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
            <icon name="ui-select/select_not_found_content" class="x-select-custom-arrow" style="width: 80px;height: 80px;" image/>
            <p>暂无搜索结果</p>
          </div>
        </template>
        <template v-if="!slots.includes('clearIcon')" v-slot:clearIcon>
          <icon name="ui-select/close" class="x-select-clear" color="comment"/>
        </template>
      </a-select>
      <span class="smartui-select-prefix-icon">
        <slot name="prefixIcon"/>
      </span>
    </div>
  </template>
  <template v-else>
    <a-select
      class="smartui-select"
      v-model:value="valueLocal"
      v-bind="mergedAttrs"
      :class="[borderedNormal ? '' : 'smartui-select-no-bordered-normally', isInForm ? 'smartui-select-in-form' : '']"
    >
      <template v-for="item in slots.filter(item => item !== 'prefixIcon')" v-slot:[item]="props">
        <slot :name="item" v-bind="{...props}"></slot>
      </template>
      <!-- 未自定义 suffixIcon & 展示小箭头时：替换小箭头 -->
      <template v-if="!slots.includes('suffixIcon') && showArrow !== false" v-slot:suffixIcon>
        <icon name="ui-select/select_arrow" class="x-select-custom-arrow"/>
      </template>
      <!-- 未自定义 notFoundContent 时 -->
      <template v-if="!slots.includes('notFoundContent')" v-slot:notFoundContent>
        <div style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
          <icon name="ui-select/select_not_found_content" class="x-select-custom-arrow" style="width: 80px;height: 80px;" image/>
          <p>暂无搜索结果</p>
        </div>
      </template>
      <template v-if="!slots.includes('clearIcon')" v-slot:clearIcon>
        <icon name="ui-select/close" class="x-select-clear" color="comment"/>
      </template>
    </a-select>
  </template>
</template>

<script>
/**
 * x-select扩展功能：
 * - 添加了自动异步加载选项的功能
 */
import { useModel } from './utils'
import { computed, onBeforeUpdate, ref, toRefs } from 'vue'
import { debounce } from 'lodash'
import { SelectProps } from 'ant-design-vue/es/select'
import Icon from './helper/Icon'

// 触发自动加载阈值，为当前滚动高度占总高度的百分比
const AUTO_LOAD_OFFSET = 0.2
// 滚动事件防抖间隔(ms)
const DEBOUNCE_GAP = 800

export default {
  name: 'XSelect',
  components: { Icon },
  inheritAttrs: false,
  props: {
    ...SelectProps(),
    /**
     * 默认关闭清除功能
     */
    allowClear: {
      type: Boolean,
      default: false,
    },
    /**
     * 无操作状态、禁用状态时，是否显示边框
     */
    borderedNormal: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否为只寸下划线、表单内出现用来输入的形式
     * 名字取的不是很合理
     */
    isInForm: {
      type: Boolean,
      default: false,
    },
    value: [String, Number, Array],
    /**
     * 扩展功能 - 滚动到底时是否自动异步加载
     * 扩展了focus和search事件，两个事件的回调函数现在将拥有第二个参数page（从1开始），用于表示当前页数。
     * 如果是普通下拉选择，使用focus来更新数据，如果是可输入的选择，使用search来更新数据
     *
     * 如果开启，当选项列表滚动到超过阈值AUTO_LOAD_OFFSET时，将使page +1，然后再次触发search事件回调函数。
     * 你需要在外部将新的选项追加到之前的options后面，才会正常发挥其功能
     *
     * 当用户输入字符更新或者下拉菜单关闭的时候，将重置page = 1
     * 因此，当page变为1的时候，应该将返回的选项列表覆盖之前的选项，这些也需要你在外部处理
     *
     * 每页条数可以在外部自己设置，反正收到多少条就展示多少条
     */
    isAutoLoadMore: {
      type: Boolean,
      default: false
    },
  },
  setup(props, context) {
    // props
    const { isAutoLoadMore } = toRefs(props)
    // 全部slots
    const slots = computed(() => {
      return Object.keys(context.slots)
    })
    // 内置翻页页数
    let page = 1
    // 可输入状态下，缓存的输入内容
    let inputCache = ''
    // 处理过后的attrs
    const mergedAttrs = ref({})

    /**
     * @handler
     * 监听滚动事件，达到阈值时自动触发onSearch, onFocus
     */
    const handleMoreData = debounce((ev) => {
      if (ev.target.scrollTop / ev.target.scrollHeight > AUTO_LOAD_OFFSET) {
        page ++
        handleSearch(inputCache, page)
        handleFocus(page)
      }
    }, DEBOUNCE_GAP)

    /**
     * @handler
     * 劫持search事件，添加page参数
     * @param {String} val 原search回调函数参数
     */
    const handleSearch = (val) => {
      if (inputCache !== val) {
        page = 1
        inputCache = val
      }
      if (props.onSearch) props.onSearch.call(null, val, page)
    }

    /**
     * @handler
     * 劫持focus事件，添加page参数
     * 适用于非输入式的选择器
     */
    const handleFocus = () => {
      if (props.onFocus) props.onFocus.call(null, page)
    }

    /**
     * @handler
     * 当下拉菜单消失时, 重置page
     */
    const handleDropdownVisibleChange = (...args) => {
      page = 1
      if (props.onDropdownVisibleChange) props.onDropdownVisibleChange.apply(null, args)
    }

    /**
     * 更新attrs，添加注入的事件
     */
    const updateAttrs = () => {
      const result = {
        ...context.attrs,
        style: {
          ...context.attrs.style,
          maxWidth: context.attrs.style?.width
        },
        ...props,
        onSearch: handleSearch,
        onFocus: handleFocus,
        onDropdownVisibleChange: handleDropdownVisibleChange,
      }
      if (isAutoLoadMore.value) result.onPopupScroll = handleMoreData
      return result
    }

    onBeforeUpdate(() => {
      mergedAttrs.value = updateAttrs()
    })

    // 处理过的attrs，注入自动异步加载时需求的方法
    mergedAttrs.value = updateAttrs()

    return {
      slots,
      valueLocal: useModel('value', props, context),
      mergedAttrs
    }
  }
}
</script>

<style lang="scss">
@import './styles/components/XSelect';
</style>