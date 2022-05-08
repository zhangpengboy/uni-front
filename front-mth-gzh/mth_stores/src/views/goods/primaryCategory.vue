<!-- 商品类目 -->
<template>
  <div class="primaryCategory">
    <p class="fs-14 color-muted3 fw-700 text-left mb-3">一级类目</p>
    <div class="butgroup">
      <div v-for="(item, i) in goodsCateOneOptions"
           :key="i"
           class="type"
           :class="[form.oneOptionsIndex === i ? 'activeClass' : '']"
           @click="clickOneTo(item, i)">
        <span>{{ item.title }}</span>
      </div>
    </div>
    <van-divider class="mt-0" />
    <p class="fs-14 color-muted3 fw-700 text-left mb-3">二级类目</p>
    <div class="butgroup">
      <div v-for="(item, i) in goodsCateTwoOptions"
           :key="i"
           class="type"
           :class="[form.twoOptionsIndex === i ? 'activeClass' : '']"
           @click="clickTwoTo(item, i)">
        <span>{{ item.title }}</span>
      </div>
    </div>
    <van-divider class="mt-0" />
    <p class="fs-14 color-muted3 fw-700 text-left mb-3">三级类目</p>
    <div class="butgroup">
      <div v-for="(item, i) in goodsCateThreeOptions"
           :key="i"
           class="type"
           :class="[form.threeOptionsIndex === i ? 'activeClass' : '']"
           @click="clickThreeTo(item, i)">
        <span>{{ item.title }}</span>
      </div>
    </div>
    <van-button color="linear-gradient(180deg, #F1722C 0%, #EB6133 100%)"
                block
                size="small"
                round
                @click="ok"
                class="mb-8 but">确认</van-button>
  </div>
</template>

<script>
export default {
  name: 'primaryCategory',
  data () {
    return {
      // 商品分类 1 2 3 级
      goodsCateOneOptions: [],
      goodsCateTwoOptions: [],
      goodsCateThreeOptions: [],
      form: {
        oneOptionsIndex: -1,
        twoOptionsIndex: -1,
        threeOptionsIndex: -1,
        primaryCategoryId: '',
        primaryCategoryName: '',
        secondaryCategoryId: '',
        secondaryCategoryName: '',
        level3CategoryId: '',
        level3CategoryName: ''
      },
      goodsBase: {},
      streetGoodsBase: {},
      categoryList: [],
      goodsCateUrl: null,
      cateType: null
    }
  },
  created () {
    this.goodsBase = this.$route.query.goodsBase || {}
    this.streetGoodsBase = this.$route.query.streetGoodsBase || {}
    if (Object.values(this.goodsBase).length > 0 && this.goodsBase.category) {
      this.categoryList = this.goodsBase.category.split('-')
    }
    if (Object.values(this.goodsBase).length > 0) {
      this.goodsCateUrl = this.$apiUri.APP_STORE_GOODS_CATE_GET
      this.cateType = 'goods'
    }
    if (Object.values(this.streetGoodsBase).length > 0) {
      this.goodsCateUrl = this.$apiUri.APP_STREET_CATEGORY
      this.cateType = 'treetGoods'
    }
    this.getStoreOrStreetGoodsCateList(0, 'one')
  },
  methods: {
    // 获取街市商品分类
    getStreetGoodsCateList (e) {
      this.$http.post(
        this.goodsCateUrl,
        {
          workId: e
        },
        res => {
          this.goodsCateOneOptions = res.data
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    // 获取商城/街市 商品分类
    getStoreOrStreetGoodsCateList (pid, type) {
      let queryParams = {}
      if (this.cateType === 'goods') {
        queryParams = {
          roleCode: this.$lance.getJson('storeInfo').storeRoleCode,
          storeId: this.$lance.getData('storeId'),
          pid: pid
        }
      } else {
        queryParams = { workId: pid }
      }
      this.$http.post(
        this.goodsCateUrl,
        queryParams,
        res => {
          if (type === 'one') {
            this.goodsCateOneOptions = res.data
            if (this.categoryList.length > 0) {
              this.form.oneOptionsIndex = _.findIndex(
                this.goodsCateOneOptions,
                item => item.title === this.categoryList[0]
              )
              const data = _.find(
                this.goodsCateOneOptions,
                item => item.title === this.categoryList[0]
              )
              this.form.primaryCategoryId = data.id
              this.form.primaryCategoryName = data.title
              this.getStoreOrStreetGoodsCateList(this.form.primaryCategoryId, 'two')
            }
          }
          if (type === 'two') {
            this.goodsCateTwoOptions = res.data
            if (this.categoryList.length > 0) {
              this.form.twoOptionsIndex = _.findIndex(
                this.goodsCateTwoOptions,
                item => item.title === this.categoryList[1]
              )
              const data = _.find(
                this.goodsCateTwoOptions,
                item => item.title === this.categoryList[1]
              )
              this.form.secondaryCategoryId = data.id
              this.form.secondaryCategoryName = data.title
              this.getStoreOrStreetGoodsCateList(this.form.secondaryCategoryId, 'three')
            }
          }
          if (type === 'three') {
            this.goodsCateThreeOptions = res.data
            if (this.categoryList.length > 0) {
              this.form.threeOptionsIndex = _.findIndex(
                this.goodsCateThreeOptions,
                item => item.title === this.categoryList[2]
              )
              const data = _.find(
                this.goodsCateThreeOptions,
                item => item.title === this.categoryList[2]
              )
              this.form.level3CategoryId = data.id
              this.form.level3CategoryName = data.title
            }
          }
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    // 一级类目按钮切换
    clickOneTo (item, i) {
      this.form.oneOptionsIndex = i
      this.$set(this.form, 'primaryCategoryId', item.id)
      this.$set(this.form, 'primaryCategoryName', item.title)
      this.$set(this.form, 'secondaryCategoryId', '')
      this.$set(this.form, 'secondaryCategoryName', '')
      this.$set(this.form, 'level3CategoryId', '')
      this.$set(this.form, 'level3CategoryName', '')
      this.goodsCateTwoOptions = []
      this.form.twoOptionsIndex = -1
      this.goodsCateThreeOptions = []
      this.form.threeOptionsIndex = -1
      this.categoryList = []
      this.getStoreOrStreetGoodsCateList(item.id, 'two')
    },
    // 二级类目按钮切换
    clickTwoTo (item, i) {
      this.form.twoOptionsIndex = i
      this.$set(this.form, 'secondaryCategoryId', item.id)
      this.$set(this.form, 'secondaryCategoryName', item.title)
      this.$set(this.form, 'level3CategoryId', '')
      this.$set(this.form, 'level3CategoryName', '')
      this.goodsCateThreeOptions = []
      this.form.threeOptionsIndex = -1
      this.categoryList = []
      this.getStoreOrStreetGoodsCateList(item.id, 'three')
    },
    // 三级类目按钮切换
    clickThreeTo (item, i) {
      this.form.threeOptionsIndex = i
      this.form.level3CategoryName = item.title
      this.form.level3CategoryId = item.id
    },
    ok () {
      if (!this.form.primaryCategoryId) return this.$toast('一级类目不能为空')
      if (!this.form.secondaryCategoryId && this.cateType === 'goods') return this.$toast('二级类目不能为空')
      if (!this.form.level3CategoryId && this.cateType === 'goods') return this.$toast('三级类目不能为空')
      this.$lance.setJson('categoryInfo', this.form)
      this.$baseUtils.goBack(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
// @import url(); 引入公共css类
.primaryCategory {
  background: #fff;
  padding: 12px;
  .butgroup {
    display: flex;
    flex-flow: row wrap;
    .type {
      width: 105px;
      height: 32px;
      font-size: 14px;
      border: 1px solid #f2f2f2;
      border-radius: 28px;
      color: #666;
      line-height: 32px;
      text-align: center;
      margin-right: 12px;
      margin-bottom: 20px;
      padding: 0 8px;
      display: inline-block;
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
    }
    .activeClass {
      border: 1px solid #eb6133;
      background: #eb6133;
      color: #fff;
    }
  }
}
</style>
