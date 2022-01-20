<template>
  <a-drawer wrapper-class-name="smartui-drawer" :fullScreen="fullScreen" :closable="closable">
    <template v-for="item in slots" :key="item" v-slot:[item]>
      <slot :name="item"></slot>
      <div class="close-btn-wrapper" v-if="item === 'default' && closable">
        <icon name="ui-date-pick/close" class="close-icon"/>
      </div>
    </template>
  </a-drawer>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import Icon from '@/components/Icon.vue'

export default defineComponent({
  name: 'XDrawer',
  components: { Icon },
  props: {
    // 默认离top 74px（header的高度）
    // 需要 top 为 0 设置本属性即可
    fullScreen: {
      type: Boolean,
      default: false
    },
    closable: {
      type: Boolean,
      default: true
    }
  },
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>

<style lang="scss">
@import './styles/components/XDrawer';
</style>
