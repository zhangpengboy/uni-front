<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-12-24 19:43:47
 * @Description  : 添加 | 修改代理商
-->

<template>
  <div class="app-container">
    <AgentDetail  :isEdit="isEdit" :value="form"/>
  </div>
</template>
<script>
import AgentDetail from './components/AgentDetail';
export default {
  components: {
    AgentDetail
  },
  data() {
    return {
      // 是否修改
      isEdit: false,
      // 表单信息
      form: {}
    };
  },
  created() {

  }
};
</script>