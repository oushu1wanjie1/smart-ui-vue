<template>
  <x-input-search v-model:value="value" :loading="loading" :placeholder="placeholder"></x-input-search>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue'
import XInputSearch from '@/smart-ui-vue/XInputSearch.vue'
import { debounce } from 'lodash'

export const DEBOUNCE_GAP = 800

export default defineComponent({
  name: 'LavaOperationSearch',
  inheritAttrs: false,
  components: { XInputSearch },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const state = reactive({
      value: ''
    })
    watch(() => state.value, debounce((val) => {
      console.log('state.value', state.value)
      emit('change', val || '')
    }, DEBOUNCE_GAP))
    return {
      ...toRefs(state)
    }
  }
})
</script>

<style scoped>

</style>
