<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-09 19:13:25
 * @Description  : SKU 套餐组件
-->
<template>
  <el-form
    class="goods-form form-header"
    :ref="'goodsSkuForm_' + skuKey"
    :model="skuItem"
    label-width="110px"
    size="medium"
    label-suffix=":"
  >
    <el-row :gutter="20">
      <el-col :span="24" :sm="12" :md="8" :lg="6">
        <el-form-item
          label="套餐名称"
          prop="name"
          required
          :rules="[{ required: true, message: '套餐名称不能为空' }]"
        >
          <el-input
            v-model="skuItem.name"
            placeholder="请输入套餐名称"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" :sm="12" :md="8" :lg="6">
        <el-form-item
          label="租赁周期"
          prop="day"
          required
          :rules="[{ required: true, message: '租赁周期不能为空' }]"
        >
          <el-input
            v-model.number="skuItem.day"
            type="number"
            placeholder="请输入租赁周期(天)"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" :sm="12" :md="8" :lg="6">
        <el-form-item
          label="最少购买"
          prop="minNum"
          required
          :rules="[
            { required: true, message: '最少购买数量不能为空' },
            { type: 'number', message: '最少购买数量必须为数字' },
          ]"
        >
          <el-input
            v-model.number="skuItem.minNum"
            type="number"
            placeholder="请输入商品的最少购买数量"
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" :sm="12" :md="8" :lg="6">
        <el-form-item
          label="最多购买"
          prop="maxNum"
          required
          :rules="[
            { required: true, message: '最多购买数量不能为空' },
            { type: 'number', message: '最多购买数量必须为数字' },
          ]"
        >
          <el-input
            v-model.number="skuItem.maxNum"
            type="number"
            placeholder="请输入商品的最多购买数量"
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" :sm="12" :md="8" :lg="6">
        <el-form-item
          label="折扣"
          prop="rebate"
          required
          :rules="[
            { required: true, message: '折扣不能为空' }
          ]"
        >
          <el-input
            v-model="skuItem.rebate"
            placeholder="请输入商品套餐的折扣（0.95）"
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" :sm="12" :md="8" :lg="6">
        <el-form-item>
          <el-button type="success" size="small" block @click="addSku"
            >新增套餐</el-button
          >
          <el-button
            type="danger"
            size="small"
            block
            @click="delSku"
            v-if="skuKey > 0"
            >删除套餐</el-button
          >
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
export default {
  props: {
    // SKU 套餐信息
    skuItem: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 当前表单Key
    skuKey: Number,
  },
  data() {
    return {};
  },
  methods: {
    /** 添加套餐 */
    addSku() {
      this.$emit("addSku");
    },
    /** 删除套餐 */
    delSku() {
      this.$emit("delSku", this.skuKey);
    },
  },
};
</script>