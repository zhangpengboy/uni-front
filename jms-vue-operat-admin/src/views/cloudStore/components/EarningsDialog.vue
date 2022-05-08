<!--
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-29 08:55:14
 * @LastEditors : Please set LastEditors
 * @LastEditTime: 2021-04-20 21:47:25
 * @Description : 收益发放 - 添加、修改弹窗组件      
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
      ref="cloudModuleForm"
      :model="form"
      :rules="rules"
      label-width="120px"
      label-suffix=":"
    >
      <el-form-item
        label="金额/积分"
        prop="amount"
      >
        <el-input
          v-model="form.amount"
          :disabled="disabled"
          type="number"
          placeholder="请输入收益发放的金额/积分"
        ></el-input>
      </el-form-item>
      
      <el-form-item
        label="分润类型"
        prop="incomeType"
      >
        <el-select
          v-model="form.incomeType"
          style="width: 100%;"
          placeholder="请选择分润类型"
          :disabled="disabled"
        >
          <el-option label="积分" :value="0" ></el-option>
          <el-option label="红包" :value="1" ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="选择店铺" prop="storeId">
        <el-input v-model="form.storeName" @focus.stop="openCloudStore=true"></el-input>
      </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" size="mini"
        >确 定</el-button
      >
      <el-button @click="cancel" size="mini">取 消</el-button>
    </div>
    <!-- 选择货架弹窗 -->
    <CloudStoreSelectDialog
      v-if="openCloudStore"
      :key="'cloudStoreSelect_' + tempRowIndex"
      :open="openCloudStore"
      :multiple="false"
      @cancel="
        openCloudStore = false;
        tempRowIndex = null;
      "
      @submit="handleCloudStoreSelect"
    />
  </el-dialog>
</template>
<script>
import { getAppBusinessDictList, incomeDistribution } from "@/api/goods";

import CloudStoreSelectDialog from "./CloudStoreSelectDialog";
export default {
  name: "EarningsDialog",
  components: {
    CloudStoreSelectDialog,
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
      default: "680px",
    },
  },
  data() {
    return {
      // 弹窗标题
      title: "",
      // 表单校验
      openCloudStore: false, // 是否显示货架店铺弹框
      bsTypeLlist: [],
      tempRowIndex: false,
      disabled: false,
      rules: {
        amount: [
          { required: true, message: "请输入收益发放的金额/积分", trigger: "blur" },
        ],
        incomeType: [
          { required: true, message: "请选择分润类型", trigger: "blur" },
        ],
      },
    };
  },

  created() {
    if (this.isEdit) {
      // console.log(this.form)
      this.disabled = false
      this.title = "收益发放";
    } else {
      this.disabled = false
      this.title = "收益发放";
    }
  },
  methods: {
    // 获取业务类型数据
    getBsTypeLlist() {
      getAppBusinessDictList().then((response) => {
        this.bsTypeLlist= response.data.list;
      });
    },

    /** 货架选择 */
    handleCloudStoreSelect(row) {
      // console.log(row)
      this.$set(this.form, "storeId", row.storeId);
      this.$set(this.form, "storeName", row.storeName);
      this.openCloudStore = false;
    },

    /** 收益发放按钮 */
    submitForm: function () {
      this.$refs["cloudModuleForm"].validate((valid) => {
        if (valid) {
          this.form.bsType = 'BS_B001'
          const _params = _.assign({}, this.form);
          incomeDistribution(_params).then(() => {
            this.msgSuccess("收益发放成功");
            this.$emit("cancel");
            this.$emit("submit");
          });
        }
      });
    },
    // 取消按钮
    cancel() {
      this.$refs["cloudModuleForm"].clearValidate();
      this.$emit("cancel");
    },
  },
};
</script>