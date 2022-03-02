<template>
  <x-avatar :src="`/images/avatar/${Math.abs(userId)%6}.svg`"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import XAvatar from '../XAvatar.vue'

export default defineComponent({
  name: 'LavaAvatar',
  components: { XAvatar },
  props: {
    userId: {
      type: Number,
      default: 0
    }
  }
})
</script>