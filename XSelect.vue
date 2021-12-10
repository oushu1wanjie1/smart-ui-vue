<template>
  <a-select
    class="smartui-select"
    v-model:value="valueLocal"
    v-bind="mergedAttrs"
  >
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-select>
</template>

<script>
/**
 * x-select扩展功能：
 * - 添加了自动异步加载选项的功能
 */
import { useModel } from './utils'
import { computed, onBeforeUpdate, ref, toRefs } from 'vue'
import { debounce } from 'lodash'

// 触发自动加载阈值，为当前滚动高度占总高度的百分比
const AUTO_LOAD_OFFSET = 0.2
// 滚动事件防抖间隔(ms)
const DEBOUNCE_GAP = 800

export default {
  name: 'XSelect',
  inheritAttrs: false,
  props: {
    value: [String, Array],
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
    const slots = computed(() => Object.keys(context.slots))
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
      if (context.attrs.onSearch) context.attrs.onSearch.call(null, val, page)
    }

    /**
     * @handler
     * 劫持focus事件，添加page参数
     * 适用于非输入式的选择器
     */
    const handleFocus = () => {
      if (context.attrs.onFocus) context.attrs.onFocus.call(null, page)
    }

    /**
     * @handler
     * 当下拉菜单消失时, 重置page
     */
    const handleDropdownVisibleChange = (...args) => {
      page = 1
      if (context.attrs.onDropdownVisibleChange) context.attrs.onDropdownVisibleChange.apply(null, args)
    }

    /**
     * 更新attrs，添加注入的事件
     */
    const updateAttrs = () => {
      const result = {
        ...context.attrs,
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