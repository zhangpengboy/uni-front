<!--
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-29 08:55:14
 * @LastEditors : Please set LastEditors
 * @LastEditTime: 2021-04-20 21:47:25
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
      label-width="120px"
      label-suffix=":"
    >
      <fieldset>
        <legend>陈列分润金额配置</legend>
        <el-row>
          <el-col :span="12">
            <el-form-item label="分润金额" prop="supplierAmount">
              <el-input
                clearable
                type="number"
                v-model.trim="form.config.supplierAmount"
                placeholder="请输入分润金额"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分润周期" prop="incomeDay">
              <el-input
                clearable
                v-model.trim="form.config.incomeDay"
                onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                maxlength="4"
                placeholder="请输入分润周期"
              ><template slot="append">天</template></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="12">
          <el-form-item label="店铺分润金额" prop="storeAmount">
            <el-input
              clearable
              type="number"
              
              v-model="form.config.storeAmount"
              placeholder="请输入店铺分润金额"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="业务员分润金额">
            <el-input
              clearable
              type="number"
              
              v-model="form.config.salesmanAmount"
              placeholder="请输入业务员分润金额"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="省代理分润金额">
            <el-input
              clearable
              type="number"
              
              v-model="form.config.provinceAgentAmount"
              placeholder="请输入省代理分润金额"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="市代理分润金额">
            <el-input
              clearable
              type="number"
              
              v-model="form.config.cityAgentAmount"
              placeholder="请输入市代理分润金额"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="区代理分润金额">
            <el-input
              clearable
              type="number"
              
              v-model="form.config.areaAgentAmount"
              placeholder="请输入区代理分润金额"
            ></el-input>
          </el-form-item>
        </el-col>
        
      </fieldset>
      <fieldset>
        <legend>动销分润比例配置</legend>
        <el-col :span="12">
          <el-form-item label="店铺分润比例" prop="storeIncome">
            <el-input
              clearable
              type="number"
              v-model="form.config.storeIncome"
              placeholder="请输入店铺分润比例"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="业务员分润比例">
            <el-input
              clearable
              type="number"
              v-model="form.config.salesmanIncome"
              placeholder="请输入业务员分润比例"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="省代理分润比例">
            <el-input
              clearable
              type="number"
              v-model="form.config.provinceAgentIncome"
              placeholder="请输入省代理分润比例"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="市代理分润比例">
            <el-input
              clearable
              type="number"
              v-model="form.config.cityAgentIncome"
              placeholder="请输入市代理分润比例"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="区代理分润比例">
            <el-input
              clearable
              type="number"
              v-model="form.config.areaAgentIncome"
              placeholder="请输入区代理分润比例"
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
  updateIncomeCloudStore,
  
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
        supplierAmount: [
          { required: true, message: "请输入分润金额", trigger: "blur" },
        ],
        incomeDay: [
          { required: true, message: "请输入分润周期", trigger: "blur" },
        ],
        storeIncome: [
          { required: true, message: "请输入店铺分润比例", trigger: "blur" },
        ],
        storeAmount: [
          { required: true, message: "请输入店铺分润金额", trigger: "blur" },
        ],
      },
    };
  },

  mounted() {
    // this.$refs["incomeForm"].clearValidate();
    if (this.isEdit) {
      // console.log(this.form)
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
          console.log(this.form)
          const config = this.form.config
          const count = parseFloat(config.storeIncome) + parseFloat(config.salesmanIncome) 
          + parseFloat(config.areaAgentIncome) + parseFloat(config.cityAgentIncome) + parseFloat(config.provinceAgentIncome)
          if(count > 1) return this.msgError("配置比例超过1");
          // this.form.bsType = "BS_B001";
          const _params = _.assign({}, this.form);
          _params.config = JSON.stringify(_params.config);
          
          if (_params.id != undefined) {
            updateIncomeCloudStore(_params).then((response) => {
              this.msgSuccess("配置修改成功");
              this.$emit("cancel");
              this.$emit("submit");
            });
          } else {
            updateIncomeCloudStore(_params).then((response) => {
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