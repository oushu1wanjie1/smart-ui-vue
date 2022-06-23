<template>
  <div class="lava-cluster-selector">
    <x-select style="width: 400px;" dropdown-class-name="lava-cluster-selector-dropdown" v-model:value="valueLocal" :disabled="disabled">
      <template #prefixIcon>
        <Icon name="ui-cluster-selector/vc" image />
      </template>
      <x-select-option v-for="item in clusterList" :key="item.id" :value="item.id">
        <div class="select-option-container">
          <span>{{ item.name }}</span>
          <icon class="select-option-icon" image v-if="item.version === Version.Enterprise" name="ui-cluster-selector/enterprise" title="企业版" alt="企业版"/>
          <icon class="select-option-icon" image v-else-if="item.version === Version.Standard" name="ui-cluster-selector/standard" title="标准版" alt="标准版"/>
          <template v-if="MASTER_STATUS_MAP[item.status]">
            <icon class="select-option-icon" :name="MASTER_STATUS_MAP[item.status].iconName" image :alt="MASTER_STATUS_MAP[item.status].description"/>
          </template>
        </div>
      </x-select-option>
    </x-select>
  </div>
</template>

<script lang="ts">
import XSelect from '../../XSelect.vue'
import Icon from '../../helper/Icon.vue'
import XSelectOption from '../../XSelectOption.vue'
import { defineComponent, PropType } from 'vue'
import { ClusterInfo, MASTER_STATUS_MAP, Version } from '@/smart-ui-vue/lava/LavaClusterSelector/index'
import { useModel } from '@/smart-ui-vue/utils'

export default defineComponent({
  name: 'LavaClusterSelector',
  components: { XSelectOption, Icon, XSelect },
  props: {
    clusterList: {
      type: Array as PropType<ClusterInfo[]>,
      default: (): ClusterInfo[] => []
    },
    value: {
      type: Number,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    return {
      valueLocal: useModel('value', props, context),
      MASTER_STATUS_MAP,
      Version,
    }
  }
})
</script>

<style lang="scss">
.lava-cluster-selector {
  .select-option-container {
    .select-option-icon {
      margin-left: 10px;
    }
  }
}
.lava-cluster-selector-dropdown {
  .select-option-container {
    .select-option-icon {
      margin-left: 10px;
    }
  }
}
</style>