<template>
  <x-button @click="handleClick">{{ 'length: ' + selectedProp.length + '--------ddddddddddddddddddddddddddddddd' }}
  </x-button>
  <x-drawer
      v-model:visible="drawerVisible"
      :destroyOnClose="true"
      :title="`关联${name}`"
      :width="800"
  >
    <SmartTransfer
        v-model:selectedDataProp="selectedProp"
        :data-source="dataSource"
        :name="name">
      <template v-slot:headerButton>
        <x-button type="primary">新建{{ name }}</x-button>
      </template>
    </SmartTransfer>
  </x-drawer>
</template>

<script>
import { reactive, ref, watch } from 'vue'
// import HelloWorld from './components/HelloWorld.vue'
import SmartTransfer from './index'
// import SmartTransfer from '../Transfer'
import XButton from '../../../../../lava-ui-permissions/src/smart-ui-vue/XButton'
import XDrawer from '../../../../../lava-ui-permissions/src/smart-ui-vue/XDrawer'

export default {
  name: 'App',
  components: {
    SmartTransfer,
    XButton,
    XDrawer,
    // HelloWorld
  },
  setup() {
    const drawerVisible = ref(true)
    const name = ref('角色')
    const dataSource = '/lava/role'
    const selectedProp = reactive([])

    const handleClick = () => {
      drawerVisible.value = !drawerVisible.value
    }

    watch(selectedProp, (pre, now) => {
      console.log(now.map(item => {
        return { ...item }
      }))
    })

    const testValue = ''

    return {
      drawerVisible,
      name,
      selectedProp,
      testValue,
      dataSource,
      handleClick,
    }
  },
}
</script>

<style lang="scss">
//@import "../../styles/index";
//@import "./styles/index";

#app {
  margin-top: 60px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
