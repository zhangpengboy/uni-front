<!--
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-29 08:55:14
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-10-30 11:38:03
 * @FilePath    : \src\views\components\UnitDialog\index.vue
 * @Description : 店铺类别 - 添加、修改弹窗组件
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
      ref="storeCategoryForm"
      :model="form"
      :rules="rules"
      label-width="90px"
      label-suffix=":"
    >
      <el-form-item label="名称" prop="title">
        <el-input v-model="form.title" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="店铺类型" prop="roleCode">
        <!-- <el-input v-model="form.roleCode" placeholder="请输入店铺角色" /> -->
        <el-select
          :disabled="secondary || isEdit"
          v-model="form.roleCode"
          clearable
          placeholder="请选择店铺类型"
          class="w-100 mr5"
        >
          <el-option
            v-for="(v, i) in storeRoleList"
            :key="i"
            :label="v.name"
            :value="v.code.toString()"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="form.remarks"
          type="textarea"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio v-model="form.status" :label="1">启用</el-radio>
        <el-radio v-model="form.status" :label="0">禁用</el-radio>
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
  addStoresCategory,
  updateStoresCategory,
  storeAllRoleList,
} from "@/api/stores";
export default {
  name: "StoresCategoryDialog",
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
    // 添加下级
    secondary: {
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
        title: [
          { required: true, message: "店铺类别名称不能为空", trigger: "blur" },
        ],
        roleCode: [
          { required: true, message: "店铺类型不能为空", trigger: "blur" },
        ],
      },
      storeRoleList: [],
    };
  },
  created() {
    if (this.isEdit) {
      this.title = "店铺类别 - 修改";
    } else {
      this.title = "店铺类别 - 添加";
    }
    this.getStoreRoleList();
  },
  methods: {
    // 获取店铺角色列表
    getStoreRoleList() {
      storeAllRoleList().then((response) => {
        this.storeRoleList = response.data;
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["storeCategoryForm"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateStoresCategory(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.$emit("cancel");
              this.$emit("submit");
            });
          } else {
            addStoresCategory(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.$emit("cancel");
              this.$emit("submit");
            });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>