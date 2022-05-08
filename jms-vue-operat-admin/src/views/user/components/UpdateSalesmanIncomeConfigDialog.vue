<!--
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-29 08:55:14
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-11-17 19:16:16
 * @FilePath    : \src\views\components\UnitDialog\index.vue
 * @Description : 修改业务员分润配置的弹窗组件
-->
<template>
  <el-dialog
    :title="title"
    :visible="open"
    :width="width"
    append-to-body
    v-el-dialog-drag
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="cancel"
  >
    <el-form
      ref="userSetForm"
      :model="form"
      :rules="rules"
      label-width="140px"
      label-suffix=":"
    >
      <el-form-item label="业务员分润金额" prop="salesmanAmount">
        <el-input v-model="form.salesmanAmount" placeholder="请输入业务员分润金额" type="number"></el-input>
      </el-form-item>
      <el-form-item label="省代理分润金额">
        <el-input
          v-model="form.provinceAgentAmount"
          placeholder="请输入省代理分润金额"
          type="number"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="市代理分润金额">
        <el-input
          v-model="form.cityAgentAmount"
          placeholder="请输入市代理分润金额"
          type="number"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="区代理分润金额">
        <el-input
          v-model="form.areaAgentAmount"
          placeholder="请输入区代理分润金额"
          type="number"
        >
        </el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" size="mini"
        >确 定</el-button
      >
      <el-button @click="cancel" size="mini">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  updateSalesmanIncomeConfig
} from "@/api/user";

export default {
  name: "UpdateSalesmanIncomeConfigDialog",
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
        salesmanAmount: [{ required: true, message: "业务员分润金额不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    this.title = "修改业务员分润配置";
  },
  methods: {
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["userSetForm"].validate((valid) => {
        if (valid) {
          const _params = {}
          _params.id = this.form.id
          delete this.form.id
          _params.C = _.assign({},this.form)
          console.log(_params);
          updateSalesmanIncomeConfig(_params).then((response) => {
            this.msgSuccess("配置成功");
            this.$emit("cancel");
            this.$emit("submit");
          });
        }
      });
    },
    // 取消按钮
    cancel() {
      this.$refs.userSetForm.resetFields();
      this.$emit("cancel");
    },
  },
};
</script>