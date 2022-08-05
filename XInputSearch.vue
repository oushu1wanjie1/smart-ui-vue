<template>
  <div :style="$attrs.style" class="smartui-input-search">
    <a-input-search v-model:value="localValueRef" v-bind="inputSearchAttrsRef">
      <template v-for="item in slots" v-slot:[item]>
        <slot :name="item"></slot>
      </template>
    </a-input-search>
    <div v-if="!loading" class="btn-search-wrapper" @click="handleSearch">
      <icon color="black" image name="ui-input/search"/>
    </div>
    <div v-if="!loading && allowClear && localValueRef.length > 0" class="btn-search-close-wrapper"
         @click="handleClear">
      <icon color="comment" name="ui-input/clear"/>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, Ref } from 'vue'
import { omit } from 'lodash'
import { excludeNotExistProps, useModel } from './utils'
import { Input as AInput } from 'ant-design-vue'
import Icon from './helper/Icon.vue'

export default defineComponent({
  name: 'XInputSearch',
  // eslint-disable-next-line vue/no-unused-components
  components: { Icon, AInputSearch: AInput.Search },
  props: {
    ...excludeNotExistProps(AInput.Search.props),
    value: String
  },
  setup(props, context) {
    // @ts-ignore
    const localValueRef: Ref<string> = (typeof props.value === 'string' && typeof props['onUpdate:value'] === 'function')
      ? useModel('value', props, context)
      : ref(props.value ?? '')

    const inputSearchAttrsRef = computed(() => {
      return omit(
        {
          ...context.attrs,
          ...props,
          style: undefined,
          allowClear: false,
        }, ['value', 'update:value', 'onUpdate:value']
      )
    })

    const handleSearch = () => {
      context.emit('search', localValueRef.value)
    }

    const handleClear = () => {
      localValueRef.value = ''
      context.emit('search', localValueRef.value)
      context.emit('change', localValueRef.value)
    }

    return {
      props,
      localValueRef,
      inputSearchAttrsRef,
      // valueLocal: useModel('value', props, context),
      slots: computed(() => Object.keys(context.slots)),

      handleSearch,
      handleClear,
    }
  }
})
</script>

<style lang="scss">
.smartui-input-search {
  position: relative;

  .#{$ant-prefix}-input-affix-wrapper {
    height: 30px;
  }

  .btn-search-wrapper {
    position: absolute;
    top: 50%;
    right: 12px;
    margin-top: -9px;
    line-height: 1;
    cursor: pointer;
    background-color: transparent;
  }

  .btn-search-close-wrapper {
    position: absolute;
    top: 50%;
    right: 30px;
    margin-top: -9px;
    line-height: 1;
    cursor: pointer;
    background-color: white;
  }

  input::-webkit-input-placeholder {
    font-size: 12px;
  }
}
</style>