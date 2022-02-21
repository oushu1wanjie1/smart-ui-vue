<template>
  <a-drawer
    v-model:visible="visibleLocal"
    :closable="closable"
    :fullScreen="fullScreen"
    v-bind="{ ...props, title: undefined }"
    wrapper-class-name="smartui-drawer"
  >
    <template v-for="item in slots" :key="item" v-slot:[item]>
      <slot :name="item"></slot>
      <div v-if="item === 'title' && closable" class="close-btn-wrapper">
        <icon class="close-icon" name="ui-date-pick/close"/>
      </div>
    </template>
    <template v-if="!slots.includes('title')" v-slot:title>
      {{ title ?? '' }}
      <div v-if="closable" class="close-btn-wrapper">
        <icon class="close-icon" name="ui-date-pick/close"/>
      </div>
    </template>
  </a-drawer>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import Icon from '@/components/Icon.vue'
import { excludeEventsInProps, useModel } from '@/smart-ui-vue/utils'
import { Drawer } from 'ant-design-vue'

export default defineComponent({
  name: 'XDrawer',
  components: { Icon },
  props: {
    // 默认离top 74px（header的高度）
    // 需要 top 为 0 设置本属性即可
    fullScreen: {
      type: Boolean,
      default: false,
    },
    closable: {
      type: Boolean,
      default: true,
    },
    ...excludeEventsInProps(Drawer.props),
  },
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots)),
      // @ts-ignore
      visibleLocal: useModel('visible', props, context),
      props,
    }
  },
})
</script>

<style lang="scss">
@import './styles/components/XDrawer';
</style>
