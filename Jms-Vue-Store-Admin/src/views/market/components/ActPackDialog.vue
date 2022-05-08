<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-03 14:20:04
 * @Description  : 参加活动-弹窗组件
-->
<template>
  <el-dialog
    title="活动报名"
    :visible="open"
    :width="width"
    append-to-body
    v-el-dialog-drag
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="cancel"
  >
    <el-form
      ref="actPackForm"
      :model="form"
      label-width="90px"
      label-suffix=":"
    >
      <el-form-item label="活动名称" prop="actName" required>
        <el-input v-model="form.actName" disabled></el-input>
      </el-form-item>
      <el-form-item
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
      </el-form-item>

      <el-form-item label="套餐信息">
        <el-row>
          <el-col :span="12" class="pack-item">
            <div class="label">开通价格：</div>
            <div class="name">&yen;{{ packInfo.price || 0 }}</div>
          </el-col>
          <el-col :span="12" class="pack-item">
            <div class="label">开通积分：</div>
            <div class="name">{{ packInfo.integral || 0 }}积分</div>
          </el-col>
          <el-col :span="12" class="pack-item">
            <div class="label">商品展示数量：</div>
            <div class="name">{{ packInfo.showAmount || 0 }}个</div>
          </el-col>
          <el-col :span="12" class="pack-item">
            <div class="label">有效时长：</div>
            <div class="name">
              {{ packInfo.avilableTime || 0 | filterTime }}
            </div>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" size="mini"
        >立即报名</el-button
      >
      <el-button @click="cancel" size="mini">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getActBindPackList, getActPackInfo } from "@/api/goods";
import { createActPackOrder, payIntegral } from "@/api/orders";
import { mapGetters } from "vuex";
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
      default: "500px",
    },
  },
  data() {
    return {
      // 弹窗标题
      title: "",
      // 套餐列表
      packList: [],
      // 套餐信息
      packInfo: {},
    };
  },
  filters: {
    filterTime: (val) => {
      let diff = val / 1000;
      if (diff < 60) return diff + "秒";
      if (diff < 60 * 60) return Math.ceil(diff / 60) + "分钟";
      if (diff < 60 * 60 * 24) return Math.ceil(diff / 3600) + "小时";
      return Math.ceil(diff / 3600 / 24) + "天";
    },
  },
  computed: {
    ...mapGetters(["store"]),
  },
  created() {
    getActBindPackList({ actCode: this.form.actCode }).then((res) => {
      this.packList = res.data;
    });
  },
  methods: {
    /** 筛选名称 */
    filterPackName(code) {
      if (code) {
        const PACK = _.find(this.packList, (v) => v.packCode == code);
        this.$set(this.form, "packName", PACK.packName);
        // 获取套餐信息
        getActPackInfo({ packCode: code }).then((res) => {
          this.packInfo = res.data;
        });
      } else {
        this.packInfo = {};
      }
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["actPackForm"].validate((valid) => {
        if (valid) {
          const _params = {
            storeId: this.store.id,
            storeName: this.store.storeName,
            actCode: this.form.actCode + ";" + this.form.packCode,
            totalAmount: this.packInfo.price || 0,
            payAmount: this.packInfo.price || 0,
            integralAmount: this.packInfo.integral,
          };
          createActPackOrder(_params).then((response) => {
            // 积分支付
            if (_params.payAmount == 0) {
              payIntegral({
                orderNo: response.data,
                role: this.store.storeRoleCode,
              }).then((res) => {
                this.msgSuccess("报名成功!");
                this.$emit("submit");
              });
            } else {
              this.$emit("submit", response.data);
            }
          });
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