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
    :before-close="cancel"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="cancel"
  >
    <el-form
      ref="StoreDiscountsDialog"
      :model="form"
      :rules="rules"
      label-width="90px"
      label-suffix=":"
    >
      <el-form-item
        :rules="{
          required: true,
          message: '店铺类型不能为空',
          trigger: 'blur',
        }"
        label="店铺类型"
        prop="storeRole"
      >
        <el-select
          v-model="form.storeRole"
          placeholder="活动区域"
          style="width: 100%"
          clearable
        >
          <el-option
            v-for="item in storeList"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :rules="{
          required: true,
          message: '折扣不能为空',
          trigger: 'blur',
        }"
        label="折扣"
        prop="rate"
      >
        <el-input
          v-model="form.rate"
          placeholder="请输入折扣"
          clearable
          type="number"
        ></el-input>
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
import { addRate, editRate } from "@/api/stores";
export default {
  name: "StoreDiscountsDialog",
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
    storeList: {
      type: Array,
      default: () => {
        return [];
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
        title: [
          { required: true, message: "店铺类别名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    if (this.isEdit) {
      this.title = "充值比例 - 修改";
    } else {
      this.title = "充值比例 - 添加";
    }
  },
  methods: {
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["StoreDiscountsDialog"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            editRate(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.$emit("cancel");
              this.$emit("submit");
            });
          } else {
            addRate(this.form).then((response) => {
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
      this.$refs["StoreDiscountsDialog"].resetFields();
      this.$emit("cancel");
    },
  },
};
</script>