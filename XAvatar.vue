<template>
  <a-avatar :src="`/images/avatar/${Math.abs(userId)%6}.svg`"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'x-avatar',
  props: {
    userId: {
      type: Number,
      default: 0
    }
  }
})
</script>
