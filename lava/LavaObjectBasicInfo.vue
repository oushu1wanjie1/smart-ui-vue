<template>
  <div class="lava-object-basic-info">
    <div class="left">
      <x-avatar class="avatar" v-if="type === USER && icon" :src="icon"/>
      <icon class="avatar" v-else-if="type === ROLE && icon" :name="icon"></icon>
      <span class="avatar default" v-else></span>
    </div>
    <div class="right">
      <div class="name">
        <a @click="handleJump" :title="name">{{ name }}</a>
        <slot></slot>
      </div>
      <div class="remark" :title="remark">{{ remark }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import Icon from '../helper/Icon.vue'
import XAvatar from '../XAvatar.vue'
import { USER, ROLE } from '@/smart-ui-vue/lava/LavaAuthOfObject/type'

const JUMP_MAP: { [key: string]: string } = {
  'user': '/main/user_center/user',
  'role': '/main/user_center/role'
}

export default defineComponent({
  name: 'LavaObjectBasicInfo.vue',
  components: {
    Icon,
    XAvatar
  },
  props: {
    type: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    remark: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const router = useRouter()

    const handleJump = () => {
      const prefix = JUMP_MAP[props.type]
      if (prefix) {
        router.push(`${prefix}/${props.id}`)
      }
    }

    return {
      USER,
      ROLE,
      handleJump
    }
  }
})
</script>

<style lang="scss">
@import "../styles/variables";

.lava-object-basic-info {
  display: flex;
  align-items: center;

  .left {
    width: 24px;
    height: 24px;
    margin-right: 10px;

    svg {
      width: 24px;
      height: 24px;
    }
  }

  .avatar {
    display: inline-block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    margin-right: 10px;

    &.default {
      background-color: $color-line-bold;
    }
  }

  .name {
    display: flex;

    a {
      width: 100px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: $color-primary-blue;
      font-size: $font-size-normal;
    }
  }

  .remark {
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: $color-primary-black;
    font-size: $font-size-small;
  }
}
</style>