<template>
  <div :class="{open,'hidden-status':!parent.props.showStatus}" class="x-vertical-step">
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
    <div class="x-vertical-step-container" @click="toggleOpen">
      <div class="x-vertical-step-title">
        <div class="x-vertical-step-title-content">
          <x-collapse-transition :visible="!slots.includes('open-title') || !open">
            <slot></slot>
          </x-collapse-transition>
          <x-collapse-transition :visible="slots.includes('open-title')&&open">
          </x-collapse-transition>
        </div>
        <div class="x-vertical-step-title-options">
          <icon class="collapse-icon" color="#85888C" name="ui-vertical-step/collapse-close" @click="toggleOpen"></icon>
          <icon v-if="showOption" color="#336CFF" name="ui-vertical-step/navigation" @click="navigation"></icon>
        </div>
      </div>
      <x-collapse-transition :visible="slots.includes('content') || !open">
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
  Ref, toRefs,
} from 'vue'
import Icon from '@/smart-ui-vue/helper/Icon.vue'
import XCollapseTransition from '@/smart-ui-vue/XCollapseTransition.vue'

export interface IVerticalStepsInject {
  props: any
  steps: Ref<VerticalStepItemState[]>
}

export interface VerticalStepItemState {
  uid: number
  open: boolean
}

export default defineComponent({
  name: 'XVerticalStep',
  components: { XCollapseTransition, Icon },
  props: {
    isFinish: {
      type: Boolean,
      default: false,
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
    const toggleOpen = (event: any) => _toggleOpen(event, verticalStepItemState, parent)
    const navigation = (event: any) => _navigation(event, context)
    onBeforeMount(() => {
      _addSelfToParentList(verticalStepItemState, parent)
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
  parent.steps.value = parent.steps.value.find((item: VerticalStepItemState) => item.uid === verticalStepItemState.uid) ? parent.steps.value : [...parent.steps.value, verticalStepItemState]
}

function _navigation(event: any, context: any) {
  event.stopPropagation()
  context.emit('navigation')
}

function _toggleOpen(event: any, verticalStepItemState: VerticalStepItemState, parent: IVerticalStepsInject) {
  event.stopPropagation()
  const newOpen = !verticalStepItemState.open
  if (newOpen) {
    parent.steps.value.forEach((item: VerticalStepItemState) => item.open = false)
  }
  verticalStepItemState.open = newOpen
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
    top: -17px;
    left: 5px;
    width: 1px;
    height: 16px;
    content: '';
    background: #EAEAEA;
  }

  .x-vertical-step-status {
    position: absolute;
    top: 15px;
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
      align-items: flex-start;
      justify-content: space-between;

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
