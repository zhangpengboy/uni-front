<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-27 16:12:59
 * @Description : 步骤封装
-->
<template>
  <div class="steps">
    <template v-if="obj.isPic">
      <div class="steps-img">
        <img src="@/assets/images/steps-img@2x.png" />
      </div>
    </template>
    <template v-else>
      <div class="steps-box">
        <div class="steps-round">{{ obj.sn }}</div>
        <div class="steps-title">{{ obj.title }}</div>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
interface StepConf {
  // 序号
  sn: number;
  // 信息
  title: string;
  // 是否图片
  isPic: boolean;
}
export default Vue.extend({
  name: 'StepsBlock',
  props: {
    item: {
      type: Object,
    },
  },
  computed: {
    obj() {
      return this.item as StepConf;
    },
  },
});
</script>

<style lang="less" scoped>
.steps {
  display: flex;
  &-round {
    width: 48px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    border: 3px solid #1e74e4;
    border-radius: 50%;
    color: #1e74e4;
    font-size: 18px;
    margin: 0 auto 10px;
  }
  &-title {
    width: 60px;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
  }

  &-img {
    width: 48px;
    height: 48px;
    margin: 0 80px;
  }
}
</style>
