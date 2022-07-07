<template>
  <div :class="extraClasses" class="custom-range-picker smartui-range-picker-bordered">
    <icon class="custom-range-picker-time-to" color="#B1B2B5" name="ui-date-pick/time-split"></icon>
    <a-range-picker
      v-bind="$attrs"
      v-model:value="valueLocal"
      :getCalendarContainer="triggerNode => triggerNode.parentNode"
      :locale="locale"
      :placeholder="placeholder"
    >
      <template v-for="item in slots" v-slot:[item]>
        <slot :name="item"></slot>
      </template>
      <template #suffixIcon>
        <icon color="#B1B2B5" name="ui-date-pick/calendar"></icon>
      </template>
    </a-range-picker>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import Icon from '../helper/Icon.vue'
import { useModel } from '@/smart-ui-vue/utils'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'

export default defineComponent({
  name: 'BorderedRangePicker',
  components: { Icon },
  inheritAttrs: false,
  props: {
    value: Array,
    extraClass: Object,
    select: Boolean,
    active: Boolean,
    placeholder: {
      type: Array,
      default: () => ['开始时间', '结束时间'],
    },
  },
  emits: [],
  setup(props, context) {
    const slots = computed(() => Object.keys(context.slots))
    const extraClasses = computed(() => {
      return {
        ...(props.extraClass || {}),
        'custom-range-picker-select': props.select,
        'custom-range-picker-active': props.active,
      }
    })
    return {
      slots,
      locale,
      valueLocal: useModel('value', props, context),
      extraClasses,
    }
  },
})
</script>

<style lang="scss">
//svg.icon.#{$ant-prefix}-calendar-picker-icon {
//  top: 12px;
//}
.smartui-range-picker-bordered.custom-range-picker {
  position: relative;
  display: inline-block;

  .#{$ant-prefix}-calendar-range-left .#{$ant-prefix}-calendar-input-wrap {
    border-right: 0 !important;
  }

  .#{$ant-prefix}-calendar-range-right .#{$ant-prefix}-calendar-input-wrap {
    border-left: 0 !important;
  }

  .#{$ant-prefix}-calendar-range-middle {
    color: #D8D8D8;
  }

  span.#{$ant-prefix}-calendar-range-picker-separator {
    opacity: 0;
  }

  span.#{$ant-prefix}-calendar-picker-input.#{$ant-prefix}-input {
    border-radius: 4px;
  }

  .custom-range-picker-time-to {
    position: absolute;
    top: 7px;
    right: calc(50% + 9px);
    z-index: 1;
  }
}

.smartui-range-picker-bordered.custom-range-picker-select {
  span.#{$ant-prefix}-calendar-picker-input.#{$ant-prefix}-input {
    color: #336CFF;
    border-color: #336CFF;
  }

  .#{$ant-prefix}-calendar-input-wrap {
    border: 1px solid #336CFF;
  }
}

.smartui-range-picker-bordered.custom-range-picker.custom-range-picker-active {
  .#{$ant-prefix}-calendar-input-wrap {
    border: 1px solid #336CFF;
  }

  span.#{$ant-prefix}-calendar-picker-input.#{$ant-prefix}-input {
    background: #336CFF;
  }

  .#{$ant-prefix}-calendar-range-picker-separator, .#{$ant-prefix}-calendar-picker-icon {
    color: #D8D8D8;
    stroke: #D8D8D8;
  }

  .#{$ant-prefix}-calendar-range-picker-input {
    color: #fff;
  }

  .#{$ant-prefix}-calendar-input-wrap, .#{$ant-prefix}-calendar-input,
  span.anticon.anticon-close-circle.#{$ant-prefix}-calendar-picker-clear {
    color: #fff;
    background: #336CFF;
  }
}

.custom-range-picker-active {
  svg.icon.#{$ant-prefix}-calendar-picker-icon {
    color: #fff !important;
    opacity: 0.5;
  }
}

.custom-range-picker-active:hover svg.icon.#{$ant-prefix}-calendar-picker-icon {
  opacity: 0;
}
</style>
