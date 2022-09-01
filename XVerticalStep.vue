<template>
  <div :class="{open,'hidden-status':!parent.props.showStatus,'finish':isFinish}" class="x-vertical-step">
    <div v-if="parent.props.showStatus" class="x-vertical-step-status">
      <template v-if="isFinish">
        <div v-if="open" class="x-vertical-step-status-icon">
          <icon image name="ui-vertical-step/finish-active"></icon>
        </div>
        <div v-else class="x-vertical-step-status-icon">
          <icon image name="ui-vertical-step/finish"></icon>
        </div>
      </template>
      <template v-else>
        <div v-if="open" class="x-vertical-step-status-icon x-vertical-step-status-selected"></div>
        <div v-else class="x-vertical-step-status-icon x-vertical-step-status-blank"></div>
      </template>
    </div>
    <div class="x-vertical-step-container" @click="!open&&toggleOpen($event)">
      <div class="x-vertical-step-title">
        <div class="x-vertical-step-title-content">
          <!-- 如果没有配置open-title插槽，或者处在未打开的状态，则使用默认插槽-->
          <x-collapse-transition :visible="!slots.includes('open-title') || !open">
            <slot></slot>
          </x-collapse-transition>
          <!-- 如果配置了open-title插槽，且处在打开的状态，则使用open-title插槽-->
          <x-collapse-transition :visible="slots.includes('open-title')&&open">
            <slot name="open-title"></slot>
          </x-collapse-transition>
        </div>
        <div class="x-vertical-step-title-options">
          <icon v-if="showCollapse&&(!parent.props.noStep)"
                class="collapse-icon" color="#85888C"
                name="ui-vertical-step/collapse-close"
                @click="toggleOpen"></icon>
          <x-tooltip>
            <template #title>前往设置</template>
            <icon v-if="showOption" color="#336CFF" name="ui-vertical-step/navigation" @click="navigation"></icon>
          </x-tooltip>
        </div>
      </div>
      <x-collapse-transition :visible="slots.includes('content') && open">
        <div class="x-vertical-step-content">
          <slot name="content"></slot>
        </div>
      </x-collapse-transition>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable no-return-assign */
import {
  ComponentInternalInstance,
  computed,
  defineComponent,
  getCurrentInstance,
  inject,
  onBeforeMount,
  reactive,
  Ref, toRefs, watch,
} from 'vue'
import Icon from '@/smart-ui-vue/helper/Icon.vue'
import XCollapseTransition from '@/smart-ui-vue/XCollapseTransition.vue'
import XTooltip from '@/smart-ui-vue/XTooltip.vue'

export interface IVerticalStepsInject {
  props: any
  steps: Ref<VerticalStepItemState[]>
}

export interface VerticalStepItemState {
  uid: number
  open: boolean
}

export interface VerticalStepItemProps {
  isFinish: boolean
  showCollapse: boolean
  showOption: boolean
}

export default defineComponent({
  name: 'XVerticalStep',
  components: { XTooltip, XCollapseTransition, Icon },
  props: {
    isFinish: {
      type: Boolean,
      default: false,
    },
    showCollapse: {
      type: Boolean,
      default: true,
    },
    showOption: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:isFinish', 'navigation'],
  setup(props, context) {
    const parent: IVerticalStepsInject = (inject('xVerticalSteps') as IVerticalStepsInject)
    const currentInstance = (getCurrentInstance() as ComponentInternalInstance)
    const verticalStepItemState = reactive({
      uid: computed(() => currentInstance.uid),
      open: false,
    })
    const toggleOpen = (event: any) => _toggleOpen(event, verticalStepItemState, props, parent)
    const navigation = (event: any) => _navigation(event, context)
    onBeforeMount(() => {
      _addSelfToParentList(verticalStepItemState, parent)
    })
    watch(() => verticalStepItemState.open, () => {
      if (verticalStepItemState.open) {
        parent.steps.value.filter(item => item.uid !== currentInstance.uid).forEach(item => item.open = false)
      }
    })
    return {
      slots: computed(() => Object.keys(context.slots)),
      ...toRefs(verticalStepItemState),
      parent,
      toggleOpen,
      navigation,
    }
  },
})

function _addSelfToParentList(verticalStepItemState: VerticalStepItemState, parent: IVerticalStepsInject) {
  if (parent.props.isDefaultOpenFirst && parent.steps.value.length === 0) {
    verticalStepItemState.open = true
  }
  parent.steps.value = parent.steps.value.find((item: VerticalStepItemState) => item.uid === verticalStepItemState.uid) ? parent.steps.value : [...parent.steps.value, verticalStepItemState]
}

function _navigation(event: any, context: any) {
  event.stopPropagation()
  context.emit('navigation')
}

function _toggleOpen(event: any, verticalStepItemState: VerticalStepItemState, props: VerticalStepItemProps, parent: IVerticalStepsInject) {
  event.stopPropagation()
  if (props.showCollapse) {
    const newOpen = !verticalStepItemState.open
    if (newOpen) {
      parent.steps.value.forEach((item: VerticalStepItemState) => item.open = false)
    }
    verticalStepItemState.open = newOpen
  }
}
</script>

<style lang="scss">
.x-vertical-step {
  position: relative;
  padding-left: 20px;
  overflow: hidden;

  &.hidden-status {
    padding-left: 0px;
  }

  &.open {
    .collapse-icon {
      transform: rotate(180deg);
    }

    .x-vertical-step-container {
      border-color: $color-primary-blue !important;
    }
  }

  &.finish:not(:last-child) .x-vertical-step-status-icon:after,
  &.finish:not(:first-child) .x-vertical-step-status-icon:before {
    left: 6px;
  }

  .x-vertical-step-status-icon {
    position: relative;
    width: 12px;
    height: 12px;
    //overflow: hidden;
    .icon {
      position: relative;
      top: -7px;
      left: 0;
      width: 12px;
      height: 12px;
    }
  }

  &:not(:last-child) .x-vertical-step-status-icon:after {
    position: absolute;
    top: 11px;
    left: 5px;
    width: 1px;
    height: 1000px;
    content: '';
    background: #EAEAEA;
  }


  &:not(:first-child) .x-vertical-step-status-icon:before {
    position: absolute;
    top: -31px;
    left: 5px;
    width: 1px;
    height: 30px;
    content: '';
    background: #EAEAEA;
  }

  .x-vertical-step-status {
    position: absolute;
    top: 30px;
    left: 0;
  }

  .x-vertical-step-status-blank {
    position: relative;
    width: 12px;
    height: 12px;
    border: 1px solid #85888C;
    border-radius: 50%;
  }

  .x-vertical-step-status-selected {
    width: 12px;
    height: 12px;
    background: #85888C;
    border: 1px solid #85888C;
    border-radius: 50%;
  }


  .x-vertical-step-container {
    padding: 10px;
    margin: 10px 0;
    cursor: pointer;
    border: 1px solid rgba(213, 216, 219, 0.5);
    border-radius: 4px;

    &:hover {
      border-color: #85888C;
    }

    .x-vertical-step-title {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .x-vertical-step-title-content {
        flex: 1;
      }

      .x-vertical-step-title-options {
        transition: height ease 0.35s;
      }

      .x-vertical-step-title-options .icon {
        margin-left: 10px;
        cursor: pointer;
        transition: all .35s;

        &:hover {
          opacity: .8;
        }
      }
    }
  }
}
</style>
