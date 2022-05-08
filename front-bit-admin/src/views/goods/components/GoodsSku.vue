<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-05 16:16:26
 * @Description  : 商品详情信息
-->
<template>
  <div class="goods">
    <el-card class="box-card">
      <div slot="header">
        <span>商品SKU</span>
      </div>

      <!-- SKU 套餐信息 -->
      <SkuFormItem
        v-for="(item, index) in list"
        :skuItem="item"
        :key="index"
        @addSku="addSku"
        @delSku="delSku"
        :skuKey="index"
        :ref="'goodsSkuForm_' + index"
      ></SkuFormItem>

      <el-row :gutter="20">
        <el-col :span="22" :offset="2">
          <el-button
            type="info"
            size="default"
            block
            @click="backPrefixForm"
            icon="el-icon-arrow-left el-icon--left"
            >返回，上一步</el-button
          >
          <el-button
            type="primary"
            size="default"
            block
            @click="submitNextForm"
            v-loading.fullscreen.lock="fullscreenLoading"
            >提交，完成<i class="el-icon-check el-icon--right"></i
          ></el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import SkuFormItem from "./SkuFormItem";
import { addUpdateGoodsPack, delGoodsPack } from "@/api/goods";
export default {
  name: "GoodsSKUForm",
  props: {
    // 是否修改
    isEdit: {
      type: Boolean,
      default: false,
    },
    // 商品SKU数组
    value: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 商品基础信息
    goodsBase: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: { SkuFormItem },
  data() {
    return {
      // 基础商品表单
      list: _.cloneDeep(this.value),
      // 加载层
      fullscreenLoading: false,
      // 删除skuList
      delList: [],
    };
  },
  watch: {
    // 监听异步获取表单信息赋值
    value: function (nVal, oVal) {
      this.list = nVal;
    },
  },
  methods: {
    /** 下一步 */
    submitNextForm() {
      this.fullscreenLoading = true;
      let fnList = [];
      _.each(this.list, (v) => {
        v.productNo = this.goodsBase.productNo;
        // 更新sku 结算价信息
        fnList.push(addUpdateGoodsPack(v));
      });
      Promise.all(fnList).then(res=>{
        this.fullscreenLoading = false;
        this.msgSuccess("操作成功");
        this.$emit("reset");
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.push({ name: "GoodsList" });
      })
    },
    /** 返回列表 */
    backGoodsList() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ name: "GoodsList" });
    },
    /** 上一步 */
    backPrefixForm() {
      this.$emit("steps", "GOODS_INFO");
    },
    /** 添加套餐 */
    addSku() {
      const _data = _.assign(
        {},
        {
          id: undefined,
          productNo: undefined,
          packNo: undefined,
          name: undefined,
          day: 0,
          minNum: 1,
          maxNum: 1,
          rebate: 1,
        }
      );
      this.list.push(_data);
    },
    /** 删除套餐 */
    delSku(index) {
      const _list = _.cloneDeep(this.list);
      _.remove(_list, (v, i) => {
        if (index == i && v.id) {
          // 删除
          delGoodsPack({ packId: v.id });
        }
        return index == i;
      });
      this.list = _list;
    },
  },
};
</script>
<style lang="scss" scoped>
</style>