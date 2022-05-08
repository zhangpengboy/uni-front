<!--
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-29 08:55:14
 * @LastEditors : Please set LastEditors
 * @LastEditTime: 2021-04-20 21:47:25
 * @FilePath    : \src\views\components\UnitDialog\index.vue
 * @Description : 活动套餐 - 添加、修改弹窗组件
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
      ref="MarketModuleForm"
      :model="form"
      :rules="rules"
      label-width="90px"
      label-suffix=":"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="权重规则" prop="weightPrinciple">
        <el-radio-group v-model="form.weightPrinciple">
          <el-radio label="1">金额+积分</el-radio>
          <el-radio label="2">金额</el-radio>
          <el-radio label="3">积分</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="开通价格"
        prop="price"
        v-if="form.weightPrinciple != 3"
      >
        <el-input v-model.number="form.price" placeholder="请输入开通价格" />
      </el-form-item>
      <el-form-item
        label="开通积分"
        prop="integral"
        v-if="form.weightPrinciple != 2"
      >
        <el-input v-model.number="form.integral" placeholder="请输入开通积分" />
      </el-form-item>
      <el-form-item label="展示数量" prop="showAmount">
        <el-input
          v-model.number="form.showAmount"
          placeholder="请输入展示商品的数量"
        />
      </el-form-item>
      <el-form-item label="有效时长" prop="avilableTime">
        <el-input
          v-model.number="form.avilableTime"
          placeholder="请输入有效时长（毫秒级：秒*1000）"
        />
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
import { addActCommonPack, updateActCommonPack } from "@/api/goods";
export default {
  name: "MarketModuleDialog",
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
        code: [
          { required: true, message: "编号唯一且不能为空", trigger: "blur" },
        ],
        name: [
          { required: true, message: "套餐名称不能为空", trigger: "blur" },
        ],
        weightPrinciple: [
          { required: true, message: "套餐权重不能为空", trigger: "blur" },
        ],
        price: [
          { required: true, message: "套餐开通价格不能为空", trigger: "blur" },
        ],
        integral: [
          { required: true, message: "套餐开通积分不能为空", trigger: "blur" },
        ],
        showAmount: [
          {
            required: true,
            message: "套餐显示的商品数量不能为空",
            trigger: "blur",
          },
        ],
        avilableTime: [
          {
            required: true,
            message: "套餐的有效时间不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    if (this.isEdit) {
      this.title = "活动套餐 - 修改";
    } else {
      this.title = "活动套餐 - 添加";
    }
  },
  methods: {
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["MarketModuleForm"].validate((valid) => {
        if (valid) {
          const _params = _.assign({}, this.form);
          if (_params.id != undefined) {
            updateActCommonPack(_params).then((response) => {
              this.msgSuccess("修改成功");
              this.$emit("cancel");
              this.$emit("submit");
            });
          } else {
            addActCommonPack(_params).then((response) => {
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
      this.$refs["MarketModuleForm"].clearValidate();
      this.$emit("cancel");
    },
  },
};
</script>