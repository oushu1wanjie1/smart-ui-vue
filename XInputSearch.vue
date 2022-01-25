<template>
  <div class="smartui-input-search">
    <a-input-search :value="value" v-bind="props">
      <template v-for="item in slots" v-slot:[item]>
        <slot :name="item"></slot>
      </template>
    </a-input-search>
    <div class="btn-search-wrapper" v-if="!loading">
      <icon name="ui-input/search" image />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { excludeNotExistProps, useModel } from './utils'
import { InputSearch } from 'ant-design-vue/lib/input'
import Icon from './helper/Icon.vue'

export default defineComponent({
  components: { Icon },
  name: 'XInputSearch',
  props: {
    ...excludeNotExistProps(InputSearch.props),
    value: String
  },
  setup(props, context) {
    return {
      props,
      // valueLocal: useModel('value', props, context),
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>

<style lang="scss">
.smartui-input-search {
  position: relative;
  .btn-search-wrapper {
    position: absolute;
    background-color: white;
    top: 4px;
    right: 11px;
    width: 14px;
    height: 20px;
    pointer-events: none;
  }
}
</style>