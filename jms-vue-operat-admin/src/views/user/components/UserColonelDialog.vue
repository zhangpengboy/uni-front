<!--
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-29 08:55:14
 * @LastEditors : Please set LastEditors
 * @LastEditTime: 2021-08-11 13:56:20
 * @FilePath    : \src\views\components\UnitDialog\index.vue
 * @Description : 设置下级代理的弹窗组件
-->
<template>
  <el-dialog
    :title="isEdit ? '矫正团队数量' : '开通团长'"
    :visible="colonelopen"
    :width="width"
    append-to-body
    v-el-dialog-drag
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="cancel"
  >
    <el-form
      ref="userColonelForm"
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
          <el-form-item label="用户角色" prop="roleCode" v-if="!isEdit">
            <el-select
              style="width: 100%"
              v-model="form.roleCode"
              placeholder="请选择用户角色"
            >
              <el-option label="初级团长" value="61"> </el-option>
              <el-option label="中级团长" value="62"> </el-option>
              <el-option label="高级团长" value="63"> </el-option>
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
import { correctData, openGroup } from "@/api/user";

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
        roleCode: [
          { required: true, message: "请选择用户角色", trigger: "change" },
        ],
      },
    };
  },
  created() {},
  methods: {
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["userColonelForm"].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            correctData({ phone: this.form.phone }).then((response) => {
              this.msgSuccess("矫正成功");
              this.$emit("cancel");
              this.$emit("submit");
            });
          } else {
            openGroup(this.form).then((response) => {
              this.msgSuccess("开通成功");
              this.$emit("cancel");
              this.$emit("submit");
            });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.$refs.userColonelForm.resetFields();
      this.$emit("cancel");
    },
  },
};
</script>