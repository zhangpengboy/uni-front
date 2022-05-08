<!--
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-29 08:55:14
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-11-17 19:16:16
 * @FilePath    : \src\views\components\UnitDialog\index.vue
 * @Description : 商品类别 - 添加、修改弹窗组件
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
      ref="goodsCategoryForm"
      :model="form"
      :rules="rules"
      label-width="90px"
      label-suffix=":"
    >
      <el-form-item label="上级分类">
        <el-input v-model="form.parentTitle" disabled></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入名称" />
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
import { goodsCategoryAdd, goodsCategoryUpdate, getGoodsCate } from "@/api/goods";
export default {
  name: "GoodsCategoryDialog",
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
          { required: true, message: "商品类别名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    if (this.isEdit) {
      this.title = "商品类别 - 修改";
    } else {
      this.title = "商品类别 - 添加";
    }
  },
  methods: {
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["goodsCategoryForm"].validate((valid) => {
        if (valid) {
          const _params = _.assign({}, this.form);
          delete _params.parentTitle;
          if (_params.id != undefined) {
            goodsCategoryUpdate(_params).then((response) => {
              this.msgSuccess("修改成功");
              this.$emit("cancel");
              this.$emit("submit");
            });
          } else {
            goodsCategoryAdd(_params).then((response) => {
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