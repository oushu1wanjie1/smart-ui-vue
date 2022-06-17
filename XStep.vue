<template>
  <div :class="{ 'x-step-select': isSelect, 'x-step-finish': isFinish }" class="x-step">
    <icon v-if="icon" :name="icon" class="x-step-top-icon" image></icon>
    <div class="x-step-content">
      <div class="x-step-dotted-container">
        <div class="x-step-dotted-box">
          <div class="x-step-dotted"></div>
        </div>
      </div>
      <div class="x-step-title">
        <div style="display: flex;align-items: center;">
          <div style="display: flex;align-items: center;">
            <div class="x-step-title-circle"></div>
            <span style="margin-right: 10px;">{{ showIndexRef }}</span>
            <span v-if="!slots.includes('title')">{{ title }}</span>
            <slot v-else name="title"></slot>
          </div>
        </div>
      </div>
      <div class="x-step-dotted-container">
        <div class="x-step-dotted-box">
          <div class="x-step-dotted"></div>
        </div>
      </div>
    </div>
    <div v-if="description" class="x-step-description">
      {{ description }}
    </div>
    <div v-if="links&&links.length>0" class="x-step-links">
      <div v-for="link in links" :key="link.text">
        <x-button class="x-step-link" type="link" @click="navigatorToPath(link.callback,link.routeLocation)">
          <span style="margin-right: 5px;">{{ link.text }}</span>
          <icon color="#85888C" name="ui-step/right-arrow"></icon>
        </x-button>
      </div>
    </div>
    <div v-if="slots.includes('links')" class="x-step-links">
      <slot name="links"></slot>
    </div>
    <div v-if="slots.includes('buttons')" class="x-step-buttons">
      <slot name="buttons"></slot>
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
  inject, onBeforeMount, PropType,
  reactive,
  ref,
  Ref,
} from 'vue'
import Icon from '@/smart-ui-vue/helper/Icon.vue'
import XButton from '@/smart-ui-vue/XButton.vue'
import { RouteLocationRaw, useRouter } from 'vue-router'

export interface IStepsProps {
  direction: string
  selectIndex: number
  finishIndex: number
}

export interface StepItemState {
  uid: number
  setIndex: (val: number) => void
}

export interface IStepsInject {
  props: IStepsProps
  steps: Ref<StepItemState[]>
}

export interface IStepLink {
  text: string;
  routeLocation?: RouteLocationRaw;
  callback?: any;
}

export default defineComponent({
  name: 'XStep',
  components: { XButton, Icon },
  props: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    links: {
      type: Array as PropType<IStepLink[]>,
      default: () => [],
    },
  },
  setup(props, context) {
    const router = useRouter()
    const parent: IStepsInject = (inject('xSteps') as IStepsInject)
    const index = ref(-1)
    const currentInstance = (getCurrentInstance() as ComponentInternalInstance)
    const setIndex = (val: number) => index.value = val
    const stepItemState = reactive({
      uid: computed(() => currentInstance.uid),
      setIndex,
    })
    const showIndexRef = computed(() => _getShowIndexRef(parent.steps.value, stepItemState.uid))
    const isSelect = computed(() => {
      return (showIndexRef.value - 1) === parent.props.selectIndex
    })
    const isFinish = computed(() => (showIndexRef.value - 1) <= parent.props.finishIndex)
    const navigatorToPath = (callback: any, routeLocation: RouteLocationRaw) => {
      if (callback) {
        callback()
      } else {
        router.push(routeLocation)
      }
    }
    onBeforeMount(() => {
      parent.steps.value = parent.steps.value.find((item: StepItemState) => item.uid === stepItemState.uid) ? parent.steps.value : [...parent.steps.value, stepItemState]
    })
    return {
      slots: computed(() => Object.keys(context.slots)),
      parent,
      showIndexRef,
      index,
      isSelect,
      isFinish,
      navigatorToPath,
    }
  },
})

function _getShowIndexRef(steps: StepItemState[], currentUid: number) {
  return steps.findIndex((item: StepItemState) => item.uid === currentUid) + 1
}
</script>

<style lang="scss">
$default-color: #85888C;
$finish-color: #282B2E;
$select-color: #336CFF;
.x-step {
  text-align: center;

  &.x-step-finish {
    .x-step-content .x-step-title {
      color: $finish-color;

      .x-step-title-circle {
        background: $finish-color;
      }
    }

    .x-step-dotted-box .x-step-dotted {
      border-top-color: $finish-color;
    }
  }

  &.x-step-select {
    font-weight: 600;

    .x-step-content .x-step-title {
      color: $select-color;

      .x-step-title-circle {
        background: $select-color;
      }
    }

    .x-step-dotted-box .x-step-dotted {
      border-top-color: $select-color;
    }

  }

  .x-step-top-icon {
    width: 50px;
    height: 50px;
    margin-bottom: 10px;
  }

  .x-step-content {
    display: flex;
    align-items: center;

    .x-step-title {
      position: relative;
      color: $default-color;
      text-align: center;

      .x-step-title-circle {
        width: 6px;
        height: 6px;
        //background: #336CFF;
        margin-right: 5px;
        background: $default-color;
        border-radius: 50%;
      }

    }

    .x-step-dotted-container {
      flex: 1;

      .x-step-dotted-box {
        position: relative;
        left: calc(-50% + 20px);
        display: flex;
        width: calc(200% - 60px);
        transform: scale(0.5, 0.5);

        .x-step-dotted {
          flex: 1;
          height: 0;
          border-top: 4px $default-color dotted;
        }

        &:first-child {
          margin-left: 10px;
        }

        &:last-child {
          margin-right: 10px;
        }
      }

    }
  }

  .x-step-description {
    padding: 0 10px;
    margin-top: 10px;
    font-size: 14px;
    font-weight: 400;
    color: #282B2E;
  }

  .x-step-description, .x-step-buttons {
    margin-top: 10px;
  }

  .x-step-links {
    margin-top: 5px;
  }

}

.x-steps.layout-center .x-step {
  .x-step-title {
    color: $select-color !important;

    .x-step-title-circle {
      background: $select-color !important;
    }
  }

  &:first-child .x-step-dotted-container:first-child {
    opacity: 0;
  }

  &:last-child .x-step-dotted-container:last-child {
    opacity: 0;
  }

  .x-step-dotted-box .x-step-dotted {
    border-top-color: $default-color !important;
  }

  .x-step-dotted-container:first-child .x-step-dotted-box {
    left: calc(-50%);
    width: calc(200% - 40px);
  }

  .x-step-dotted-container:last-child .x-step-dotted-box {
    left: calc(-50%);
    width: calc(200% - 15px);
  }
}

</style>
