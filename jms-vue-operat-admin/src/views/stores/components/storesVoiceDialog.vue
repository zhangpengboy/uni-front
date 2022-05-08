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
      ref="storeVoiceForm"
      :model="form"
      :rules="rules"
      label-width="150px"
      label-suffix=":"
    >
      <el-form-item v-if="!isEdit" label="手机号" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="设备ProductKey" prop="productKey">
        <el-input
          v-model="form.productKey"
          placeholder="请输入设备ProductKey"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="产品类型" prop="productType">
        <el-select
          v-model="form.productType"
          placeholder="请选择类型"
          style="width: 100%"
        >
          <el-option label="移动网络版" :value="0"></el-option>
          <el-option label="WiFi版" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Topic完整名称" prop="topicFullName">
        <el-input v-model="form.topicFullName" placeholder="请输入名称">
          <template slot="prepend">{{ `/${form.productKey}/` }}</template>
          <template slot="append">/user/get</template>
        </el-input>
      </el-form-item>
      <el-form-item label="店铺" v-if="!isEdit">
        <!-- <el-select
          v-model="form.storeName"
          filterable
          clearable
          placeholder="请输入手机号搜索店铺"
          style="width: 100%"
          multiple
          remote
          reserve-keyword
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="item in storeList"
            :key="item.id"
            :label="item.storeName"
            :value="item.phone"
          >
          </el-option>
        </el-select> -->
        
        <!-- <el-autocomplete
          style="width: 100%;"
          v-model="form.phone"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入手机号搜索店铺"
          @select="handleSelect"
        ></el-autocomplete> -->
        <el-input
          v-model="form.storeName"
          placeholder="请选择店铺"
          @focus.stop="openStore"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.mark" placeholder="请输入备注" />
      </el-form-item>
      <!-- <el-form-item label="状态">
        <el-select v-model="form.status" placeholder="请选择状态">
          <el-option label="启用" value="0"> </el-option>
          <el-option label="禁用" value="1"> </el-option>
        </el-select>
      </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" size="mini"
        >确 定</el-button
      >
      <el-button @click="cancel" size="mini">取 消</el-button>
    </div>
    <!-- 选择店铺弹窗 -->
    <!-- <StoresSelectDialog
      v-if="openSupplier"
      :key="'supplierSelect_' + tempRowIndex"
      :open="openSupplier"
      :multiple="false"
      @cancel="
        openSupplier = false;
        tempRowIndex = null;
      "
      @submit="handleSupplierSelect"
    /> -->
    <StoreSelectDialog
      v-if="openSupplier"
      :key="'supplierSelect_' + tempRowIndex"
      :open="openSupplier"
      :multiple="false"
      :phone="phone"      
      @cancel="
        openSupplier = false;
        tempRowIndex = null;
      "
      @submit="handleSupplierSelect"
    />
  </el-dialog>
</template>
<script>
import {
  storeVoiceBindUser,
  storeVoiceEditUser,
  getStoreInfoList,
  updateIMInfo
} from "@/api/stores";

// import StoresSelectDialog from "./StoresSelectDialog";
import StoreSelectDialog from "../../market/components/StoreSelectDialog";
export default {
  name: "StoresVoiceDialog",
    components: {
    // StoresSelectDialog,
    StoreSelectDialog
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
      default: "700px",
    },
  },
  data() {
    return {
      // 弹窗标题
      title: "",
      // 表单校验
      rules: {
        phone: [{ required: true, message: "手机号不能为空", trigger: "blur" }],
        productKey: [
          {
            required: true,
            message: "设备ProductKey不能为空",
            trigger: "blur",
          },
        ],
        productType: [
          { required: true, message: "请选择产品类型", trigger: "change" },
        ],
        storeId: [{ required: true, message: "请选择店铺", trigger: "change" }],
        topicFullName: [
          { required: true, message: "名称不能为空", trigger: "blur" },
        ],
      },
      // 店铺列表
      storeList: [],
      loading: false,
      timeout: null,
      openSupplier: false,
      tempRowIndex: false,
      phone: ''
    };
  },
  created() {
    // if (this.isEdit) {
    //   this.title = "商品类别 - 修改";
    // } else {
    //   this.title = "商品类别 - 添加";
    // }
    this.title = "收款音响-编辑";
    // this.getStoreList();
    
  },
  methods: {
    // 打开店铺弹框
    openStore() {
      this.openSupplier = true
      this.phone = this.form.phone
    },
    /** 店铺选择 */
    handleSupplierSelect(row) {
      this.$set(this.form, "storeId", row.id);
      this.$set(this.form, "storeName", row.storeName);
      // this.form.storeId = row.id
      // this.form.storeName = row.storeName
      this.openSupplier = false;
       
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["storeVoiceForm"].validate((valid) => {
        if (valid) {
          this.storeList.map((item) => {
            if (item.id == this.form.storeId) {
              this.form.storeName = item.storeName;
            }
          });
          // console.log(this.form)
          // if (this.isEdit) {
          //   let obj = {
          //     storeId: this.form.storeid,
          //     storeName: this.form.storename,
          //     workId: this.form.id,
          //   };
          //   storeVoiceEditUser(obj).then((response) => {
          //     this.msgSuccess("修改成功");
          //     this.$emit("cancel");
          //     this.$emit("submit");
          //   });
          // } else {
            
          // }
          const _params = _.assign({}, this.form);
          _params.topicFullName = `/${this.form.productKey}/${this.form.topicFullName}/user/get`
          var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
          if (!reg_tel.test(_params.phone)) {
            this.msgError("请正确填写您的手机号码！");
            return false;
          }
          _params.productType = +_params.productType;
          // console.log(_params);
          if(_params.id != undefined) {
            updateIMInfo(_params).then((response) => {
              this.msgSuccess("修改成功");
              this.$emit("cancel");
              this.$emit("submit");
            });
          }else {
            storeVoiceBindUser(_params).then((response) => {
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
      this.$refs.storeVoiceForm.resetFields();
      this.$emit("cancel");
    },
  },
};
</script>