<template>
  <div>
    <van-popup v-model="show" position="bottom" :style="{ height: '50%' }">
      <van-picker
        title="标题"
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        @cancel="onCancel"
        @change="onChange"
      />
    </van-popup>
  </div>
</template>

<script>
import { Toast } from 'vant'

export default {
  data () {
    return {
      show: true,
      columns: ['杭州', '宁波', '温州', '绍兴', '湖州', '嘉兴', '金华', '衢州']
    }
  },
  methods: {
    onConfirm (value, index) {
      Toast(`当前值：${value}, 当前索引：${index}`)
    },
    onChange (picker, value, index) {
      Toast(`当前值：${value}, 当前索引：${index}`)
    },
    onCancel () {
      Toast('取消')
    }
  }
}
</script>

<style></style>
