<template>
  <x-popover v-if="env === 'development'" title="开发工具" trigger="click">
    <template #content>
      <lava-dev-tool-login />
    </template>
    <x-button class="fixed bottom-20 right-10">工具</x-button>
  </x-popover>
</template>

<script lang="ts">

import XPopover from '@/smart-ui-vue/XPopover.vue'
import XButton from '@/smart-ui-vue/XButton.vue'
import LavaDevToolLogin from '@/smart-ui-vue/lava/LavaDevtools/login.vue'
export default {
  name: 'LavaDevTools',
  components: { LavaDevToolLogin, XButton, XPopover },
  setup() {
    const env = process.env.NODE_ENV
    console.log('process.env.NODE_ENV', process.env.NODE_ENV, env)
    return {
      env
    }
  }
}
</script>

<style lang="scss">

</style>
