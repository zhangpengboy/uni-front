<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-03 14:20:04
 * @Description  : 商品发货-弹窗组件
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
      ref="DeliveryForm"
      :model="form"
      label-width="90px"
      label-suffix=":"
    >
      <!-- <el-form-item
        label="活动套餐"
        prop="packCode"
        :rules="[
          { required: true, message: '请选择活动套餐', trigger: 'blur' },
        ]"
      >
        <el-select
          v-model="form.packCode"
          placeholder="请选择活动套餐"
          clearable
          filterable
          class="w-100"
          @change="filterPackName"
        >
          <el-option
            v-for="(o, i) in packList"
            :key="i"
            :label="o.packName"
            :value="o.packCode"
          >
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item
        label="物流公司"
        prop="deliveryName"
        :rules="[
          { required: true, message: '请输入物流公司名称', trigger: 'change' },
        ]"
      >
        <!-- <el-input
          v-model="form.deliveryName"
          placeholder="请输入物流公司名称"
        ></el-input> -->
        <!-- <el-select
          v-model="form.deliveryName"
          placeholder="请选择物流公司名称"
          clearable
          filterable
          class="w-100"
        >
          <el-option
            v-for="(item, index) in Dict.DELIVERY_DICT"
            :key="index"
            :label="item.value"
            :value="item.key"
          >
          </el-option>
        </el-select> -->
        <el-autocomplete
          class="w-100"
          clearable
          v-model="form.deliveryName"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入物流公司名称"
          @select="handleSelect"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item
        label="物流单号"
        prop="deliveryNo"
        :rules="[
          { required: true, message: '请输入物流单号', trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.deliveryNo"
          placeholder="请输入物流单号"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" size="mini"
        >{{isEdit ? '修改物流' : '通知用户,我已发货'}}</el-button
      >
      <el-button @click="cancel" size="mini">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { addOrderDelivery, updateDeliveryNo, getDeliveryList } from "@/api/orders";
import { mapGetters } from "vuex";
export default {
  name: "StoreDialog",
  props: {
    // 是否打开
    open: {
      type: Boolean,
      default: false,
    },
    // 是否修改
    isEdit: {
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
      default: "500px",
    },
  },
  data() {
    return {
      // 弹窗标题
      title: "",
      restaurants: []
    };
  },
  computed: {
    ...mapGetters(["store"]),
  },
  created() {
    if (this.isEdit) {
      this.title = "商品发货";
    } else {
      this.title = "修改物流";
    }
    this.loadAll();
  },
  methods: {
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["DeliveryForm"].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            updateDeliveryNo(this.form).then((response) => {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.$emit("submit");
            });
            return;
          }
          addOrderDelivery(this.form).then((response) => {
            this.$message({
              message: "发货成功",
              type: "success",
            });
            this.$emit("submit");
          });
        }
      });
    },
    // 取消按钮
    cancel() {
      this.$emit("cancel");
    },
    loadAll() {
      getDeliveryList().then(res => {
        res.data.forEach(element => {
          this.restaurants.push({
            value: element.lotName
          })
        });
      })
    },
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants;
      cb(results);
    },
    createStateFilter(queryString) {
      return (state) => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelect(item) {
      this.form.deliveryName = item.value;
    },
  },
};
</script>

<style lang="scss" scoped>
.pack-item {
  margin-bottom: 10px;
  font-size: 14px;
  display: flex;
  align-items: center;
  .label {
    color: #999;
    margin-right: 5px;
  }
}
</style>