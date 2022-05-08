<!-- 套餐明细  -->
<template>
  <div class="specificationItem">
    <van-form validate-first
              class="bg-white pt-2"
              :ref="'goodsSpecificationItemForm_' + specificationItemKey">
      <van-row gutter="6"
               type="flex">
        <van-col span="10">
          <van-field v-model="specificationItem.detail"
                     clickable
                     placeholder="套餐明细,如牛肉"
                     @change="specificationItemChange"
                     class="cell" />
        </van-col>
        <van-col span="6">
          <van-field v-model="specificationItem.num"
                     clickable
                     @change="specificationItemChange"
                     type="number"
                     placeholder="数量/份"
                     class="cell" />
        </van-col>
        <van-col span="6">
          <van-field v-model="specificationItem.price"
                     clickable
                     @change="specificationItemChange"
                     type="number"
                     placeholder="价格/元"
                     class="cell" />
        </van-col>
        <van-col span="2">
          <van-icon name="add-o"
                    class="icon"
                    v-show="specificationItem.addIconShow"
                    size="28"
                    @click="addSpecificationItem" />
          <van-icon name="close"
                    class="icon"
                    v-show="specificationItem.delIconShow"
                    size="28"
                    @click="delSpecificationItem" />
        </van-col>
      </van-row>
    </van-form>
  </div>
</template>

<script>
export default {
  props: {
    specificationItem: {
      type: Object,
      default: function () {
        return {}
      }
    },
    specificationItemKey: Number
  },
  data () {
    return {

    }
  },
  methods: {
    addSpecificationItem () {
      if (!this.specificationItem.detail) return this.$toast('套餐明细不能为空')
      if (!this.specificationItem.num) return this.$toast('套餐数量不能为空')
      if (!this.specificationItem.price) return this.$toast('套餐价格不能为空')
      this.$emit('addSpecificationItem')
    },
    delSpecificationItem () {
      this.$emit('delSpecificationItem', this.specificationItemKey)
    },
    specificationItemChange () {
      this.$emit('specificationItemChange')
    }
  }
}
</script>

<style lang="scss" scoped>
.specificationItem {
  .van-row--flex {
    align-items: center;
  }
  .cell {
    // height: 32px;
    border: 1px solid #f2f2f2;
    border-radius: 8px;
  }
}
</style>
