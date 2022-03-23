<template>
  <div class="lava-object-basic-info">
    <div class="left">
      <icon v-if="icon" :name="icon"></icon>
      <span v-else class="default-avatar"></span>
    </div>
    <div class="right">
      <div class="name">
        <a @click="handleJump">{{ name }}</a>
        <slot></slot>
      </div>
      <div class="remark">{{ remark }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import Icon from '../helper/Icon.vue'

const JUMP_MAP: { [key: string]: string } = {
  'user': '/main/user_center/user',
  'role': '/main/user_center/role'
}

export default defineComponent({
  name: 'LavaObjectBasicInfo.vue',
  components: {
    Icon
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
  }

  .default-avatar {
    display: inline-block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    margin-right: 10px;
    background-color: $color-line-bold;
  }

  .name {
    display: flex;

    a {
      color: $color-primary-blue;
      font-size: $font-size-normal;
    }
  }

  .remark {
    color: $color-primary-black;
    font-size: $font-size-small;
  }
}
</style>