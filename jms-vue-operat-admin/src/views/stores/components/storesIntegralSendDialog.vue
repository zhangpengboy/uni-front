<!--
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-29 08:55:14
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2021-07-14 19:16:16
-->
<template>
  <el-dialog
    title="礼券赠送配置"
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
          <el-form-item label="每天扫码赠送上限" prop="storeMax">
            <el-input
              v-model="form.storeMax"
              placeholder="请输入值"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="每月赠送上限" prop="storeMaxMonth">
            <el-input
              v-model="form.storeMaxMonth"
              placeholder="请输入值"
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
import { updateConfig } from "@/api/stores";

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
        storeMax: [
          { required: true, message: "请输入值", trigger: "change" },
        ],
        storeMaxMonth: [
          { required: true, message: "请输入值", trigger: "change" },
        ],
      },
    };
  },
  created() {},
  methods: {
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["userIntegralSendForm"].validate((valid) => {
        if (valid) {
          let obj = {
            id: this.form.id,
            storeMax: this.form.storeMax,
            storeMaxMonth: this.form.storeMaxMonth
          }
            updateConfig(obj).then((response) => {
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