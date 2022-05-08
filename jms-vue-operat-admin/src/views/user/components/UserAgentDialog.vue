<!--
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-29 08:55:14
 * @LastEditors : Please set LastEditors
 * @LastEditTime: 2021-10-20 21:01:14
 * @FilePath    : \src\views\components\UnitDialog\index.vue
 * @Description : 设置用户代理角色
-->
<template>
  <el-dialog
    title="设置代理等级"
    :visible="colonelopen"
    :width="width"
    append-to-body
    v-el-dialog-drag
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="cancel"
  >
    <el-form
      ref="userAgentForm"
      :model="form"
      :rules="rules"
      label-width="120px"
      label-suffix=":"
    >
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="form.phone"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="代理等级" prop="userLevel" v-if="!isEdit">
            <el-select
              style="width: 100%"
              v-model="form.userLevel"
              placeholder="请选择用户角色"
            >
              <el-option label="初级代理" value="P1"> </el-option>
              <el-option label="中级代理" value="P2"> </el-option>
              <el-option label="高级代理" value="P3"> </el-option>
            </el-select>
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
import { openUserAgent } from "@/api/user";

export default {
  name: "UserSetDialog",
  props: {
    // 是否打开
    colonelopen: {
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
      default: "500px",
    },
  },
  data() {
    return {
      // 弹窗标题
      title: "",
      // 表单校验
      rules: {
        phone: [
          { required: true, message: "手机号不能为空", trigger: "change" },
        ],
        userLevel: [
          { required: true, message: "请选择用户角色", trigger: "change" },
        ],
      },
    };
  },
  created() {},
  methods: {
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["userAgentForm"].validate((valid) => {
        if (valid) {
          openUserAgent(this.form).then((response) => {
            this.msgSuccess("开通成功");
            this.$emit("cancel");
            this.$emit("submit");
          });
        }
      });
    },
    // 取消按钮
    cancel() {
      this.$refs.userAgentForm.resetFields();
      this.$emit("cancel");
    },
  },
};
</script>