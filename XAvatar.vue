<template>
  <a-avatar :src="`/images/avatar/${Math.abs(userId)%6}.svg`"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Avatar as AAvatar } from 'ant-design-vue'

export default defineComponent({
  name: 'x-avatar',
  components: { AAvatar },
  props: {
    userId: {
      type: Number,
      default: 0
    }
  }
})
</script>
