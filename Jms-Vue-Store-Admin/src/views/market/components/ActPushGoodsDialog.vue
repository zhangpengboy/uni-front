<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-03 14:20:04
 * @Description  : 推送商品-弹窗组件
-->
<template>
  <el-dialog
    title="推送商品"
    :visible="open"
    :width="width"
    append-to-body
    v-el-dialog-drag
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="cancel"
  >
    <el-form
      ref="actPushGoodsForm"
      :model="form"
      label-width="90px"
      label-suffix=":"
    >
      <el-form-item
        label="选择商品"
        prop="goodsId"
        required
        :roles="[{ required: true, message: '商品不能为空' }]"
      >
        <el-input
          v-model="form.goodsName"
          readonly
          @focus.stop="openGoods = true"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="选择店铺"
        prop="storeNames"
        required
        :roles="[{ required: true, message: '店铺不能为空' }]"
      >
        <el-input
          v-model="form.storeNames"
          readonly
          @focus.stop="openStore = true"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" size="mini"
        >立 即 推 送</el-button
      >
      <el-button @click="cancel" size="mini">取 消</el-button>
    </div>

    <!-- 选择活动商品弹窗 -->
    <GoodsSelectDialog
      v-if="openGoods"
      :open="openGoods"
      type="pushGoods"
      :multiple="false"
      @cancel="openGoods = false"
      @submit="handleGoodsSelect"
    />

    <!-- 选择店铺弹窗  -->
    <StoreSelectDialog
      v-if="openStore"
      :key="'store_' + tempRowIndex"
      :open="openStore"
      :multiple="true"
      @cancel="
        openStore = false;
        tempRowIndex = null;
      "
      @submit="handleStoreSelect"
    />
  </el-dialog>
</template>
<script>
import { mapGetters } from "vuex";
import GoodsSelectDialog from "../components/GoodsSelectDialog";
import StoreSelectDialog from "@/views/mallcenter/components/StoreSelectDialog";

export default {
  name: "StoreDialog",
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
    // 弹窗宽度
    width: {
      type: String,
      default: "505px",
    },
  },
  components: {
    GoodsSelectDialog,
    StoreSelectDialog,
  },
  data() {
    return {
      // 弹窗标题
      title: "",
      // 商品弹窗
      openGoods: false,
      // 店铺弹窗
      openStore: false,
      tempRowIndex: false,
    };
  },
  computed: {
    ...mapGetters(["store"]),
  },
  methods: {
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["actPushGoodsForm"].validate((valid) => {
        if (valid) {
          const _params = _.assign(this.form, {
            storeId: this.store.id,
            storeName: this.store.storeName,
          });
          this.$emit("submit", _.assign({}, this.form));
        }
      });
    },
    // 取消按钮
    cancel() {
      this.$emit("cancel");
    },
    /** 商品选择 */
    handleGoodsSelect(row) {
      this.$set(this.form, "goodsId", row.id);
      this.$set(this.form, "goodsName", row.goodsName);
      this.openGoods = false;
    },
    handleStoreSelect(row) {
      console.log(row);
      this.$set(this.form, "stores", row);
      this.$set(
        this.form,
        "storeNames",
        row.map((v) => v.storeName).toString()
      );
      this.openStore = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.banner-uploader {
  /deep/ .el-upload {
    display: block;
    width: 100%;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .image {
    width: 100%;
    height: 150px;
  }
}
</style>