<template>
  <x-drawer
    wrapClassName="lava-auth-of-object-drawer-inside"
    :visible="visible"
    :width="800"
    @close="handleClose"
  >
    <x-form class="form" layout="vertical">
      <x-form-item label="权限">
        <x-select
          class="action-selector"
          mode="multiple"
          placeholder="请选择需要授予的权限"
          :isInForm="true"
          :disabled="actions.length === 0"
          :options="actions"
          v-model:value="actionsSelected"
          @change="handleChange"
        >
          <template #prefixIcon><icon name="lava-auth-of-object/auth-active"></icon></template>
        </x-select>
      </x-form-item>
    </x-form>
    <div class="footer">
      <x-button type="primary" class="submit" :disabled="isUnChanged" @click="onSubmit">
        <template #icon><icon name="lava-auth-of-object/submit"></icon></template>
        提交
      </x-button>
    </div>
  </x-drawer>
</template>

<script lang="ts">
import { computed, defineComponent, inject, Ref, ref, watch } from 'vue'
import Icon from '../../helper/Icon.vue'
import XForm from '../../XForm.vue'
import XFormItem from '../../XFormItem.vue'
import XSelect from '../../XSelect.vue'
import XButton from '../../XButton.vue'
import XDrawer from '../../XDrawer.vue'
import { ADD } from './type'
import { Strategy } from '@/smart-ui-vue/lava/LavaAuthOfObject/strategy'
import { message } from 'ant-design-vue'

export default defineComponent({
  name: 'LavaAuthEdit',
  components: {
    Icon,
    XForm,
    XFormItem,
    XSelect,
    XButton,
    XDrawer
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      required: true
    },
    id: {
      type: Number,
      required: true
    }
  },
  emits: [ 'update:visible', 'close' ],
  setup(props, context) {
    // select options
    const actions: Ref<{ label: string, value: number }[]> = ref([])
    // 存储修改后的 rs_type_action_id 数组
    const actionsSelected: Ref<number[]> = ref([])
    // 存储修改之前的 rs_type_action_id 数组，用于判断是否修改
    const actionsSelectedDefault: Ref<number[]> = ref([])
    const strategy = inject('strategy') as Strategy

    const isUnChanged = computed(() => {
      // 检查修改之前的每个 id 是否都能在修改后的 id 数组中找到，且两数组长度相等
      const allIn = actionsSelectedDefault.value.every(id => !!actionsSelected.value.find(_id => id === _id))
      return allIn && actionsSelectedDefault.value.length === actionsSelected.value.length
    })

    const handleChange = () => {
      console.log('actionsSelected: ', actionsSelected)
    }

    const handleReset = () => {
      actions.value = []
      actionsSelected.value = []
    }

    const handleInit = () => {
      handleReset()
      strategy.getAuthOfUserOrRole(props.type, props.id).then(data => {
        const { options, value } = strategy.formatAuthOfUserOrRole(data, '')
        actions.value = options
        actionsSelected.value = value
        actionsSelectedDefault.value = [ ...value ] // 新建一个数组，避免指向同一个引用
      }).catch(err => {
        message.error(`获取权限列表失败: ${err}`)
      })
    }

    const onSubmit = () => {
      // privileges 是完整的 actions 列表
      const privileges = actions.value.map(act => ({
        rs_type_action_id: act.value,
        checked: !!actionsSelected.value.find(id => id === act.value)
      }))
      strategy.setAuth(props.type, props.id, privileges).then(() => {
        message.success('编辑成功')
        handleClose()
      }).catch(err => {
        message.error(`编辑失败: ${err}`)
      })
    }

    const handleClose = () => {
      context.emit('update:visible', false)
      context.emit('close', false)
      handleReset()
    }

    watch(() => props.visible, (visible) => {
      if (visible) {
        // 打开抽屉
        handleInit()
      } else {
        // 关闭抽屉
        handleClose()
      }
    })

    return {
      ADD,
      actions,
      actionsSelected,
      isUnChanged,
      handleChange,
      handleClose,
      onSubmit
    }
  }
})
</script>

<style lang="scss">
@import './addOrEdit.scss';
</style>