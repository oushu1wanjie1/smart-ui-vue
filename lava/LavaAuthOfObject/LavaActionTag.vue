<template>
  <div class="lava-action-tag">
    <x-tooltip placement="bottomLeft" overlayClassName="lava-action-tag-tooltip">
      <template #title>
        <div class="lava-action-tag-source">
          <span v-if="action.type === SOURCE_SELF">自身权限</span>
          <span v-if="action.type === SOURCE_INHERIT">继承自角色</span>
          <span v-if="action.type === SOURCE_SELF_INHERIT">自身权限且继承自角色</span>
        </div>
        <div class="lava-action-tag-roles">
          <div class="role-name" v-for="role in action.roles" :key="role.id">
            <icon name="lava-auth-of-object/role-blue"></icon>
            <a @click="$router.push(`/main/user_center/role/${role.id}`)">{{ role.name }}</a>
          </div>
        </div>
      </template>
      <icon
        v-if="action.type === SOURCE_INHERIT || action.type === SOURCE_SELF_INHERIT"
        name="lava-auth-of-object/inherit"
      ></icon>
      <span class="name">{{ action.name }}</span>
      <icon
        v-if="!readonly"
        class="delete"
        name="lava-auth-of-object/x"
        @click="$emit('delete', action)"
      ></icon>
    </x-tooltip>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import Icon from '../../helper/Icon.vue'
import XTooltip from '../../XTooltip.vue'

export const SOURCE_SELF = 'self'
export const SOURCE_INHERIT = 'inherit'
export const SOURCE_SELF_INHERIT = 'self_inherit'

export interface Role {
  id: number;
  name: string;
}

export interface ActionTag {
  id: string | number;
  name: string;
  type: string;
  roles: Role[];
}

export default defineComponent({
  name: 'LavaActionTag',
  components: {
    Icon,
    XTooltip
  },
  props: {
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
      SOURCE_SELF,
      SOURCE_INHERIT,
      SOURCE_SELF_INHERIT
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

  .name {
    margin-right: 5px;
  }

  .delete {
    cursor: pointer;
  }
}

.lava-action-tag-tooltip {
  max-width: 300px;
}

.lava-action-tag-source {
  color: $color-text-sub;
  font-size: $font-size-small;
}

.lava-action-tag-roles {

  .role-name {
    display: inline-block;
    font-size: $font-size-normal;
    margin-top: 10px;
    margin-right: 10px;
    white-space: nowrap;

    a {
      color: $color-primary-blue;
      margin-left: 2px;
    }
  }
}
</style>