<template>
  <div class="lava-action-tag">
    <x-tooltip placement="bottomLeft" overlayClassName="lava-action-tag-tooltip">
      <template #title v-if="type === USER && action.type">
        <lava-role-panel :type="action.type" :roles="action.roles"></lava-role-panel>
      </template>
      <span>
        <icon v-if="isShowRolePanel(type, action.type)" name="lava-auth-of-object/inherit"></icon>
        <span class="name">{{ action.name }}</span>
        <icon
          v-if="!readonly"
          class="delete"
          name="lava-auth-of-object/x"
          @click="$emit('delete', action)"
        ></icon>
      </span>
    </x-tooltip>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import Icon from '../../helper/Icon.vue'
import XTooltip from '../../XTooltip.vue'
import LavaRolePanel from './LavaRolePanel.vue'
import { USER, SOURCE_INHERIT, SOURCE_SELF_INHERIT, ActionTag } from './type'
import { isShowRolePanel } from './strategy'

export default defineComponent({
  name: 'LavaActionTag',
  components: {
    Icon,
    XTooltip,
    LavaRolePanel
  },
  props: {
    type: {
      type: String,
      required: true
    },
    readonly: {
      type: Boolean,
      default: true
    },
    action: {
      type: Object as PropType<ActionTag>,
      required: true
    }
  },
  emits: [ 'delete' ],
  setup() {
    return {
      USER,
      SOURCE_INHERIT,
      SOURCE_SELF_INHERIT,
      isShowRolePanel
    }
  }
})
</script>

<style lang="scss">
@import "../../styles/variables.scss";

.lava-action-tag {
  display: inline-flex;
  align-items: center;
  color: $color-primary-black;
  font-size: $font-size-normal;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: rgba(213, 216, 219, 0.5);

  .delete {
    cursor: pointer;
    margin-left: 5px;
  }
}

.lava-action-tag-tooltip {
  max-width: 400px;
}
</style>