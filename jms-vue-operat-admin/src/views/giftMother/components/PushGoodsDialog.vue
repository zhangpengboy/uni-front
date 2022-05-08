<!--
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-29 08:55:14
 * @LastEditors : Please set LastEditors
 * @LastEditTime: 2021-04-20 21:47:25
 * @Description : 推送商品到礼券妈妈 - 添加、修改弹窗组件      
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
      ref="cloudPushForm"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-suffix=":"
    >
      <el-form-item label="选择供应商" prop="supplierName">
        <el-input
          v-model="form.supplierName"
          @focus.stop="openSupplier = true"
        ></el-input>
      </el-form-item>
      <el-form-item label="选择商品" prop="goodsId">
        <el-input
          v-model="form.goodsName"
          @focus.stop="clickOpenGoods"
        ></el-input>
      </el-form-item>
      <el-form-item label="选择货架" prop="storeInfos">
        <el-input v-model="form.cloudNames" @focus.stop="clickOpen"></el-input>
      </el-form-item>

      <el-col :span="24">
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            style="width: 100%"
            v-model="form.endTime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="权重" prop="weight">
          <el-input
            style="width: 100%"
            v-model="form.weight"
            type="number"
            placeholder="请输入权重"
          >
          </el-input>
        </el-form-item>
      </el-col>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" size="mini"
        >推 送</el-button
      >
      <el-button @click="cancel" size="mini">取 消</el-button>
    </div>
    <!-- 选择商品弹窗 -->
    <GoodsSelectDialog
      v-if="openGoods"
      :key="'goodsSelect_' + tempRowIndex"
      :open="openGoods"
      :supplierId="form.supplierId"
      :multiple="false"
      type="pushGiftGoods"
      @cancel="
        openGoods = false;
        tempRowIndex = null;
      "
      @submit="handleGoodsSelect"
    />
    <!-- 选择货架弹窗 -->
    <CloudStoreSelectDialog
      v-if="openCloudStore"
      :goodsId="form.goodsId"
      :key="'cloudStoreSelect_' + tempRowIndex"
      :open="openCloudStore"
      :multiple="true"
      @cancel="
        openCloudStore = false;
        tempRowIndex = null;
      "
      @submit="handleCloudStoreSelect"
    />
    <!-- 选择供应商弹窗 -->
    <SupplierSelectDialog
      v-if="openSupplier"
      :key="'supplierSelect_' + tempRowIndex"
      :open="openSupplier"
      :multiple="false"
      @cancel="
        openSupplier = false;
        tempRowIndex = null;
      "
      @submit="handleSupplierSelect"
    />
  </el-dialog>
</template>
<script>
import { pushGoodsToGiftMotherStore, updatePushGoods } from "@/api/goods";
import GoodsSelectDialog from "../../market/components/GoodsSelectDialog";
import CloudStoreSelectDialog from "./CloudStoreSelectDialog";
import SupplierSelectDialog from "./SupplierSelectDialog";
export default {
  name: "PushGoodsDialog",
  components: {
    GoodsSelectDialog,
    CloudStoreSelectDialog,
    SupplierSelectDialog,
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
    // 是否是修改
    isEdit: {
      type: Boolean,
      default: false,
    },
    // 弹窗宽度
    width: {
      type: String,
      default: "600px",
    },
  },
  data() {
    return {
      // 弹窗标题
      title: "",
      // 表单校验
      openGoods: false, // 是否显示商品弹框
      openCloudStore: false, // 是否显示货架弹框
      openSupplier: false, // 是否显示供应商弹框
      tempRowIndex: false,
      disabled: false,
      rules: {
        goodsId: [
          { required: true, message: "请选择代卖商品", trigger: "change" },
        ],
        storeInfos: [
          { required: true, message: "请选择货架", trigger: "change" },
        ],
        supplierName: [
          { required: true, message: "请选择供应商", trigger: "change" },
        ],
        endTime: [
          { required: true, message: "结束时间不能为空", trigger: "blur" },
        ],
      },
    };
  },

  mounted() {
    // this.$refs["cloudPushForm"].clearValidate();
    if (this.isEdit) {
      this.title = "货架商品 - 修改";
    } else {
      this.title = "货架商品 - 推送";
    }
  },
  methods: {
    /** 点击货架打开弹框 */
    clickOpen() {
      if (!this.form || !this.form.goodsId)
        return this.$message.error("请先选择代卖商品！");
      this.openCloudStore = true;
    },
    clickOpenGoods() {
      if (!this.form || !this.form.supplierId)
        return this.$message.error("请先选择供应商！");
      this.openGoods = true;
    },
    /** 商品选择 */
    handleGoodsSelect(row) {
      this.$set(this.form, "goodsId", row.id);
      this.$set(this.form, "goodsName", row.goodsName);
      this.openGoods = false;
    },
    /** 货架选择 */
    handleCloudStoreSelect(row) {
      let Names = row.map((item) => item.storeName).join("; ");
      // console.log(ids);
      // console.log(Names);
      this.$set(this.form, "storeInfos", row);
      this.$set(this.form, "cloudNames", Names);
      this.openCloudStore = false;
    },
    /** 供应商选择 */
    handleSupplierSelect(row) {
      if (this.form.goodsId || this.form.storeInfos) {
        this.form.goodsName = null;
        this.form.goodsId = null;
        this.form.storeInfos = null;
        this.form.cloudNames = null;
        this.$refs.cloudPushForm.resetFields();
      }
      this.$set(this.form, "supplierId", row.id);
      this.$set(this.form, "supplierName", row.storeName);
      this.openSupplier = false;
    },

    /** 提交按钮 */
    submitForm: function () {
      this.$refs["cloudPushForm"].validate((valid) => {
        if (valid) {
          // let arry = []

          const _params = _.assign({}, this.form);
          // arry.push(_params)
          if (_params.id != undefined) {
            updatePushGoods(_params).then((response) => {
              this.msgSuccess("修改成功");
              this.$emit("cancel");
              this.$emit("submit");
            });
          } else {
            pushGoodsToGiftMotherStore(_params).then((response) => {
              this.msgSuccess("推送成功");
              this.$emit("cancel");
              this.$emit("submit");
            });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      // this.$refs["cloudPushForm"].clearValidate();
      // this.$refs["cloudPushForm"].resetFields();
      // console.log(this.$refs)
      this.$refs.cloudPushForm.resetFields();
      this.$emit("cancel");
    },
  },
};
</script>