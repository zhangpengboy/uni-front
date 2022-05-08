<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-03 14:20:04
 * @Description  : 参加活动-支付弹窗组件
-->
<template>
  <el-dialog
    title="付款码"
    :visible="show"
    :width="width"
    append-to-body
    v-el-dialog-drag
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="cancel"
  >
    <el-image class="pay-image" :src="url" />
    <el-row class="pay-tips">
      <el-col :span="4" class="label">
        <span>注意事项：</span>
      </el-col>
      <el-col :span="20" class="text">
        <div class="mb5">1、请使用微信扫码进行支付；</div>
        <div class="mb5">2、请在30分钟之内完成支付；</div>
        <div class="mb5">3、完成支付之前请勿关闭当前页面。</div>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" size="mini"
        >我已支付</el-button
      >
      <el-button @click="cancel" size="mini">关 闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  getActBindPackList,
  getActPackList,
  addStoreInfo,
  updateStoreInfo,
} from "@/api/goods";
export default {
  name: "StoreDialog",
  props: {
    // 是否打开
    show: {
      type: Boolean,
      default: false,
    },
    // 支付的二维码地址
    url: {
      type: String,
      default: null,
    },
    // 弹窗宽度
    width: {
      type: String,
      default: "540px",
    },
  },
  data() {
    return {};
  },
  methods: {
    /** 提交按钮 */
    submitForm: function () {
      this.$emit("submit");
    },
    /** 取消按钮 */
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style lang="scss" scoped>
.pay-image {
  width: 280px;
  height: 280px;
  left: 50%;
  transform: translateX(-50%);
}
.pay-tips {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
  .label {
    text-align: right;
  }
  .text {
    color: #666;
  }
}
</style>