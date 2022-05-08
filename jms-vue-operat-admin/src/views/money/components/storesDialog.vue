<!--
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-29 08:55:14
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2021-07-14 19:16:16
-->
<template>
  <el-dialog
    title="手续费配置"
    :visible="open"
    :width="width"
    append-to-body
    v-el-dialog-drag
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="cancel"
  >
    <el-form
      ref="userIntegralSendForm"
      :model="form"
      :rules="rules"
      label-width="150px"
      label-suffix=":"
    >
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="费率类型" prop="type">
            <el-select
              @input='changeFn'
              v-model="form.type"
              clearable
              placeholder="请选择费率类型"
              class="w-100 mr5"
            >
              <el-option label="百分比" :value="1"></el-option>
              <el-option label="固定金额" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="费率/金额" prop="rate">
            <el-input
              @input='changeFn'
              v-model="form.rate"
              placeholder="请输入费率/金额"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align: center">
      <el-button type="primary" @click="submitForm" size="mini"
        >确 定</el-button
      >
      <el-button @click="cancel" size="mini">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { moneyRateUpdate_v2 } from "@/api/money";

export default {
  name: "UserSetDialog",
  props: {
    // 是否打开
    open: {
      type: Boolean,
      default: false,
    },
    // 绑定的表单对象
    form: {
      type: Object,
      default: function () {
        return {};
      },
    },
    // 是否是修改
    isEdit: {
      type: Boolean,
      default: false,
    },
    // 弹窗宽度
    width: {
      type: String,
      default: "700px",
    },
  },
  data() {
    return {
      // 弹窗标题
      title: "",
      // 表单校验
      rules: {
        type: [
          { required: true, message: "请选择费率类型", trigger: "change" },
        ],
        rate: [{ required: true, message: "请输入费率/金额", trigger: "blue" }],
      },
    };
  },
  created() {},
  methods: {
    changeFn() {
      this.$forceUpdate();
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["userIntegralSendForm"].validate((valid) => {
        if (valid) {
          let obj = {
            type: this.form.type,
            rate: this.form.rate,
          };
          this.form.drawType = JSON.stringify([obj])
          console.log(this.form);
          moneyRateUpdate_v2(this.form).then((response) => {
            this.msgSuccess("设置成功");
            this.$emit("cancel");
            this.$emit("submit");
          });
        }
      });
    },
    // 取消按钮
    cancel() {
      this.$refs.userIntegralSendForm.resetFields();
      this.$emit("cancel");
    },
  },
};
</script>