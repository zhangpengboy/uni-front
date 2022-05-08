<!--
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-29 08:55:14
 * @LastEditors : Please set LastEditors
 * @LastEditTime: 2021-07-03 18:07:54
 * @Description : 分润配置 - 添加、修改弹窗组件      
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
    @open="openDialog"
  >
    <el-form
      ref="incomeForm"
      :model="form.config"
      :rules="rules"
      label-width="140px"
      label-suffix=":"
    >
      <fieldset>
        <legend>动销分润比例配置</legend>
        <el-col :span="12">
          <el-form-item :label="`${form.config.S.desc}分润比例`" :prop="form.config.S.amount">
            <el-input
              clearable
              type="number"
              v-model="form.config.S.amount"
              :placeholder="`请输入${form.config.S.desc}分润比例`"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.config.D">
          <el-form-item :label="`${form.config.D.desc}分润比例`">
            <el-input
              clearable
              type="number"
              v-model="form.config.D.amount"
              :placeholder="`请输入${form.config.D.desc}分润比例`"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${form.config.M3.desc}分润比例`">
            <el-input
              clearable
              type="number"
              v-model="form.config.M3.amount"
              :placeholder="`请输入${form.config.M3.desc}分润比例`"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${form.config.M2.desc}分润比例`">
            <el-input
              clearable
              type="number"
              v-model="form.config.M2.amount"
              :placeholder="`请输入${form.config.M2.desc}分润比例`"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${form.config.M1.desc}分润比例`">
            <el-input
              clearable
              type="number"
              v-model="form.config.M1.amount"
              :placeholder="`请输入${form.config.M1.desc}分润比例`"
            ></el-input>
          </el-form-item>
        </el-col>
        
      </fieldset>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" size="mini"
        >确 定</el-button
      >
      <el-button @click="cancel" size="mini">取 消</el-button>
    </div>
    <!-- 选择数字货架商品弹窗 -->
    <!-- <pushGoodsSelectDialog
      v-if="openGoods"
      :key="'goodsSelect_' + tempRowIndex"
      :open="openGoods"
      :multiple="false"
      @cancel="
        openGoods = false;
        tempRowIndex = null;
      "
      @submit="handleGoodsSelect"
    /> -->
  </el-dialog>
</template>
<script>
import {
  updateIncomeGiftMother,
  
} from "@/api/goods";

import pushGoodsSelectDialog from "../components/pushGoodsSelectDialog";
export default {
  name: "IncomeConfigDialog",
  components: {
    pushGoodsSelectDialog,
  },
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
    // 绑定的分润配置项表单对象
    // config: {
    //   type: Object,
    //   default: function () {
    //     return {};
    //   },
    // },
    // 是否是修改
    isEdit: {
      type: Boolean,
      default: false,
    },
    // 弹窗宽度
    width: {
      type: String,
      default: "690px",
    },
  },
  data() {
    return {
      // 弹窗标题
      title: "",
      // 表单校验
      openGoods: false, // 是否显示数字货架商品弹框
      bsTypeLlist: [],
      tempRowIndex: false,
      disabled: false,
      rules: {
        // supplierAmount: [
        //   { required: true, message: "请输入分润金额", trigger: "blur" },
        // ],
        // incomeDay: [
        //   { required: true, message: "请输入分润周期", trigger: "blur" },
        // ],
        amount: [
          { required: true, message: "请输入店铺分润比例", trigger: "blur" },
        ],
        // storeAmount: [
        //   { required: true, message: "请输入店铺分润金额", trigger: "blur" },
        // ],
      },
    };
  },

  mounted() {
    // this.$refs["incomeForm"].clearValidate();
    // console.log(this.form)
    if (this.isEdit) {
      
      this.disabled = true;
      this.title = "商品分润总配置-编辑";
    } else {
      this.disabled = false;
      this.title = "商品分润配置-编辑";
    }
  },
  methods: {
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["incomeForm"].validate((valid) => {
        if (valid) {
          // console.log(this.form)
          const config = this.form.config
          // console.log(config);
          let count = null
          if(config.D) {
            count = parseFloat(config.D.amount) + parseFloat(config.S.amount) 
            + parseFloat(config.M1.amount) + parseFloat(config.M2.amount) + parseFloat(config.M3.amount)
          }else {
            count = parseFloat(config.S.amount) + parseFloat(config.M1.amount) + parseFloat(config.M2.amount) + parseFloat(config.M3.amount)
          }
          if(count > 1) return this.msgError("配置比例超过1");
          // this.form.bsType = "BS_B001";
          const _params = _.assign({}, this.form);
          _params.config = JSON.stringify(_params.config);
          if (_params.id != undefined) {
            updateIncomeGiftMother(_params).then((response) => {
              this.msgSuccess("配置修改成功");
              this.$emit("cancel");
              this.$emit("submit");
            });
          } else {
            updateIncomeGiftMother(_params).then((response) => {
              this.msgSuccess("配置新增成功");
              this.$emit("cancel");
              this.$emit("submit");
            });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      // this.$refs["incomeForm"].clearValidate();
      this.$refs.incomeForm.resetFields();
      this.$emit("cancel");
    },
    // 打开按钮
    openDialog() {
      // this.$refs["incomeForm"].clearValidate();
    },

  },
};
</script>