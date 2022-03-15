<template>
  <x-drawer
    wrapClassName="lava-auth-of-object-drawer-inside"
    :visible="visible"
    :width="800"
    @close="handleClose"
  >
    <x-form class="form" layout="vertical">
      <x-form-item label="关联" v-if="action === ADD">
        <div class="controls">
          <x-select class="type-selector" v-model:value="type" :isInForm="true">
            <x-select-option value="user">用户</x-select-option>
            <x-select-option value="role">角色</x-select-option>
          </x-select>
          <x-select
            class="type-list-selector"
            show-search
            :isInForm="true"
            :placeholder="typeSelectorPlaceholder"
          >
            <template #prefixIcon><icon :name="`lava-auth-of-object/${typeSelectorIcon}`"></icon></template>
          </x-select>
        </div>
      </x-form-item>
      <x-form-item label="权限">
        <x-select
          class="action-selector"
          model="tags"
          placeholder="请选择需要授予的权限"
          :isInForm="true"
          :disabled="disableActionSelector"
        >
          <template #prefixIcon><icon :name="`lava-auth-of-object/auth`"></icon></template>
        </x-select>
      </x-form-item>
    </x-form>
    <div class="footer">
      <x-button class="submit">
        <template #icon><icon name="lava-auth-of-object/submit"></icon></template>
        提交
      </x-button>
    </div>
  </x-drawer>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref } from 'vue'
import Icon from '../../helper/Icon.vue'
import XForm from '../../XForm.vue'
import XFormItem from '../../XFormItem.vue'
import XSelect from '../../XSelect.vue'
import XSelectOption from '../../XSelectOption.vue'
import XButton from '../../XButton.vue'
import XDrawer from '../../XDrawer.vue'
import { USER, ADD } from './type'

export default defineComponent({
  name: 'LavaAuthEdit',
  components: {
    Icon,
    XForm,
    XFormItem,
    XSelect,
    XSelectOption,
    XButton,
    XDrawer
  },
  props: {
    action: {
      type: String,
      default: ADD
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: [ 'update:visible', 'close' ],
  setup(props, context) {
    const type: Ref<string> = ref(USER)
    const id: Ref<string | number> = ref('')
    const actions: Ref<string[]> = ref([])

    const typeSelectorIcon = computed(() => {
      return type.value === USER ? 'user' : 'role'
    })

    const typeSelectorPlaceholder = computed(() => {
      return type.value === USER ? '请选择或搜索需要关联的用户' : '请选择或搜索需要关联的角色'
    })

    const disableActionSelector = computed(() => id.value)

    const actionSelectorIcon = computed(() => {
      return disableActionSelector.value ? 'auth' : 'auth-active'
    })

    const onSubmit = () => {
      console.log('onSubmit')
    }

    const handleClose = () => {
      context.emit('update:visible', false)
      context.emit('close', false)
    }

    return {
      ADD,
      type,
      id,
      actions,
      disableActionSelector,
      typeSelectorIcon,
      typeSelectorPlaceholder,
      actionSelectorIcon,
      handleClose
    }
  }
})
</script>

<style lang="scss">
@import "../../styles/variables.scss";

.lava-auth-of-object-drawer-inside {

  .controls {
    display: flex;
    margin-bottom: 20px;
  }

  .type-selector {
    flex-basis: 100px;

    .ant-select-selector {
      padding-left: 0!important;
    }
  }

  .type-list-selector {
    //
  }

  .action-selector {
    // select 前缀图标样式重写
    // 为什么要用 + 选择器？
    // 因为 x-select 把前缀图标的类定义到自定义 class 的外部了，
    // 导致 action-selector 内部控制不到
    &+.smartui-select-prefix-icon {
      left: 0;
    }
    .ant-select-selector {
      padding-left: 23px!important;
    }
    // 不过最好在里面也写一遍，以防以后 x-select 重构，把 action-selector 移进来
    .smartui-select-prefix-icon {
      left: 0;
    }
  }

  label {
    color: $color-text-sub;
  }

  // select 样式重写
  .ant-select {

    &.ant-select-disabled .ant-select-selection-placeholder {
      color: $color-line-bold;
    }
  }

  .submit {
    position: absolute;
    left: 40px;
    bottom: 20px;
    color: #FFF!important;
    background-color: $color-primary-blue!important;
  }
}
</style>