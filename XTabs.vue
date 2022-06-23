<template>
  <a-tabs
    ref="tabsRef"
    :class="{'smartui-tabs': true, 'x-tabs-fix-top': isFixTop}"
    :activeKey="localActiveKey"
    @change="onChange"
  >
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-tabs>
</template>

<script lang='ts'>
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface TabsProps {
  selector?: string;
  fixTop?: boolean;
  addKeyToRouter?: boolean;
  activeKey: string;
}

export default defineComponent({
  name: 'XTabs',
  props: {
    selector: {
      type: String
    },
    fixTop: {
      type: Boolean,
      default: false
    },
    addKeyToRouter: {
      type: Boolean,
      default: false
    },
    activeKey: {
      type: String,
      required: true
    }
  },
  emits: [ 'update:activeKey', 'change' ],
  setup(props: TabsProps, context) {
    // 用于获取 tabs 组件实例
    const tabsRef = ref()
    // 当前是否处于置顶状态
    const isFixTop = ref(false)
    // 用于设置 tabBar fixed 定位的 top 值
    const tabBarTop = ref('0px')
    // 用于设置 tabBar fixed 定位后的宽度
    const tabBarWidth = ref('0px')
    // 定义 container
    let container: HTMLElement|null = null
    // container 是否为 html 或 body
    let isHtmlOrBody = false
    // container 到视口顶部的距离
    let containerTop = 0
    // tabs 到视口顶部的距离
    let tabsTop = 0

    const route = useRoute()
    const router = useRouter()

    // 借助计算属性实现双向绑定
    const localActiveKey = computed({
      get() {
        return props.activeKey
      },
      set(val: string) {
        context.emit('update:activeKey', val)
      }
    })

    if (props.addKeyToRouter && route && route.query && route.query.activeTab) {
      localActiveKey.value = route.query.activeTab as string
      context.emit('update:activeKey', route.query.activeTab)
    }

    const onChange = (key: string) => {
      // 把值的变更返回给调用者
      context.emit('update:activeKey', key)
      // 触发调用者注册的 change 事件
      context.emit('change', key)
      // 将 activeKey 绑定到路由的查询字符串中
      if (props.addKeyToRouter) {
        localActiveKey.value = key
        router.replace({ name: route.name as string, query: { ...route.query, activeTab: key } })
      }
    }

    const handleFixTop = () => {
      // 获取 tabs 组件实例
      const tabsInstance = tabsRef.value
      // 获取 container 卷起来的高度
      if (!container) return
      const containerScrollTop = container.scrollTop
      if (containerScrollTop >= tabsTop - containerTop) {
        tabBarWidth.value = tabsInstance.$el.clientWidth + 'px'
        if (isHtmlOrBody) {
          tabBarTop.value = 0 + 'px'
        } else {
          tabBarTop.value = container.getBoundingClientRect().top + 'px'
        }
        isFixTop.value = true
      } else {
        isFixTop.value = false
        tabBarWidth.value = 'auto'
        tabBarTop.value = '0px'
      }
    }

    // 实现在页面滚动时，tabBar 始终位于容器的顶部
    const handlePageScroll = () => {
      if (!container) return
      const pageScrollTop = document.documentElement.scrollTop || document.body.scrollTop
      tabBarTop.value = container.offsetTop - pageScrollTop + 'px'
    }

    onMounted(() => {
      if (props.fixTop) {
        // 初始化 container
        container = props.selector ? document.querySelector(props.selector) : document.documentElement || document.body
        if (!container) return
        isHtmlOrBody = container === document.documentElement || container === document.body
        containerTop = container.getBoundingClientRect().top
        tabsTop = tabsRef.value.$el.getBoundingClientRect().top
        if (isHtmlOrBody) {
          window.addEventListener('scroll', handleFixTop)
        } else {
          container.addEventListener('scroll', handleFixTop)
          window.addEventListener('scroll', handlePageScroll)
        }
      }
    })

    onUnmounted(() => {
      if (props.fixTop) {
        if (isHtmlOrBody) {
          window.removeEventListener('scroll', handleFixTop)
        } else {
          if (container) {
            container.removeEventListener('scroll', handleFixTop)
          }
          window.removeEventListener('scroll', handlePageScroll)
        }
      }
    })

    return { localActiveKey, tabsRef, isFixTop, tabBarTop, tabBarWidth, onChange, slots: computed(() => Object.keys(context.slots)) }
  }
})
</script>

<style lang="scss">
@import './styles/components/XTabs/index';

.x-tabs-fix-top {
  :deep(.#{$ant-prefix}-tabs-top-bar) {
    position: fixed;
    // 在 CSS 中使用组件中的变量
    top: v-bind(tabBarTop);
    width: v-bind(tabBarWidth)
  }
  // 占位符，防止吸顶时抖动
  &::before {
    content: '';
    height: 60px;
  }
}
</style>
