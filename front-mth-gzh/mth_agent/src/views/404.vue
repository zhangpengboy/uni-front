<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-12-30 10:46:35
 * @Description  : 404 错误页面
-->
<template>
  <div class="notfund">
    <van-empty description="您访问的页面找不回来了！">
      <van-button round block type="danger" class="bottom-button" @click="$baseUtils.goBack()">返回</van-button>
    </van-empty>
  </div>
</template>
<style lang="scss">
.notfund {
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .bottom-button {
    width: 160px;
    height: 40px;
  }
}
</style>
