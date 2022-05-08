<!-- 街市商品-基础商品信息 -->
<template>
  <div class="addGoods">
    <van-form validate-first
              class="bg-white px-3 py-2">
      <p class="d-flex align-items-center">
        <span class="color-red pr-1">*</span>
        <span class="fs-14 color-text">商品标题</span>
      </p>
      <van-field v-model="form.goodsName"
                 type="textarea"
                 maxlength="50"
                 placeholder="请输入商品标题"
                 show-word-limit
                 :border="false"
                 :autosize="{ maxHeight: 100, minHeight: 50 }"
                 class="cell" />
      <p class="d-flex align-items-center mt-2">
        <span class="color-red pr-1">* </span>
        <span class="fs-14 color-text">商品副标题</span>
      </p>
      <van-field v-model="form.goodsTitle"
                 :autosize="{ maxHeight: 200, minHeight: 50 }"
                 type="textarea"
                 maxlength="200"
                 placeholder="请输入商品副标题"
                 show-word-limit
                 :border="false"
                 class="cell" />
      <div class="d-flex justify-content-between align-items-center my-2">
        <div class="label-width text-right">
          <span class="fs-10 color-red pr-1">*</span>
          <span class="fs-14 color-text">商品分类</span>
        </div>
        <van-field class="w-75 cell px-2 py-1"
                   readonly
                   clickable
                   v-model="form.category"
                   right-icon="arrow"
                   placeholder="请选择"
                   @click="onClickCategory">
        </van-field>
      </div>
      <van-button color="linear-gradient(180deg, #F1722C 0%, #EB6133 100%)"
                  block
                  size="small"
                  round
                  @click="next"
                  class="mt-8 but">下一步</van-button>
    </van-form>
  </div>
</template>

<script>
export default {
  name: 'addStreetGoodsBase',
  props: {
    form: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {

    }
  },
  created () {

  },

  methods: {
    // 商品分类跳转
    onClickCategory () {
      this.$router.push({
        name: 'primaryCategory',
        query: {
          streetGoodsBase: this.form
        }
      })
    },
    // 下一步
    next () {
      if (!this.form.goodsName) return this.$toast('商品标题不能为空!')
      if (!this.form.goodsTitle) {
        return this.$toast('商品副标题不能为空!')
      }
      if (!this.form.category) return this.$toast('商品分类不能为空!')
      this.$emit('baseLastStep', this.form)
    }

  }
}
</script>
<style lang="scss" scoped>
// @import url(); 引入公共css类
.addGoods {
  height: 100vh;
  background: #fff;
  .label-width {
    min-width: 70px;
  }
  .cell {
    border: 1px solid #f2f2f2;
    border-radius: 8px;
  }
}
</style>
