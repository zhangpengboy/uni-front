<!-- 街市商品添加 -->
<template>
  <div>
    <add-street-goods-base :form="form"
                           v-if="showBaseForm"
                           @baseLastStep="baseLastStep" />
    <add-street-goods-info :form="form"
                           v-if="showInfoForm"
                           @infoOnStep="infoOnStep"
                           @infoLastStep="infoLastStep" />
    <add-street-goods-sku :form="form"
                          v-if="showSkuForm"
                          :fullscreenLoading="fullscreenLoading"
                          @skuOnStep="skuOnStep"
                          @skuLastStep="skuLastStep" />
  </div>
</template>

<script>
import addStreetGoodsBase from './addStreetGoodsBase.vue'
import addStreetGoodsInfo from './addStreetGoodsInfo.vue'
import addStreetGoodsSku from './addStreetGoodsSku.vue'
export default {
  name: 'addStreetGoodsIndex',
  components: {
    addStreetGoodsBase,
    addStreetGoodsInfo,
    addStreetGoodsSku
  },
  data () {
    return {
      form: {
        category: '',
        integralName: '赠送礼券',
        integral: 0
      },
      fullscreenLoading: false,
      showBaseForm: true, // 是否显示基本信息
      showInfoForm: false, // 是否显示详细信息
      showSkuForm: false // 是否显示活动信息
    }
  },

  created () {
    if (this.$route.query.goodsId) {
      this.getStreetGoodsDetail()
    } else {
      this.form = {}
    }
  },
  activated () {
    // console.log('activated:', this.$lance.getJson('categoryInfo'))
    const categoryInfo = this.$lance.getJson('categoryInfo')
    if (categoryInfo) {
      this.hland(categoryInfo)
    }
    if (this.$route.query.goodsId) {
      this.getStreetGoodsDetail()
    }
  },
  beforeDestroy () {
    this.$lance.clearStorage('categoryInfo')
  },
  methods: {
    // 基本信息的下一步
    baseLastStep () {
      this.showBaseForm = false
      this.showInfoForm = true
      this.showSkuForm = false
    },
    // 详情的上一步
    infoOnStep () {
      this.showBaseForm = true
      this.showInfoForm = false
      this.showSkuForm = false
    },
    // 详情的下一步
    infoLastStep () {
      this.showBaseForm = false
      this.showInfoForm = false
      this.showSkuForm = true
    },
    // sku的上一步
    skuOnStep () {
      this.showBaseForm = false
      this.showInfoForm = true
      this.showSkuForm = false
    },
    // sku的下一步(提交)
    skuLastStep () {
      console.log(this.form)
      this.fullscreenLoading = true
      this.form.storeId = this.$lance.getJson('storeInfo').storeId
      this.form.storeName = this.$lance.getJson('storeInfo').storeName
      this.form.status = 0
      this.form.roleCode = this.$lance.getJson('storeInfo').storeRoleCode
      this.form.area1Id = this.$lance.getJson('storeInfo').area1Id
      this.form.area1Name = this.$lance.getJson('storeInfo').area1Name
      this.form.area2Id = this.$lance.getJson('storeInfo').area2Id
      this.form.area2Name = this.$lance.getJson('storeInfo').area2Name
      this.form.area3Id = this.$lance.getJson('storeInfo').area3Id
      this.form.area3Name = this.$lance.getJson('storeInfo').area3Name
      this.form.area4Id = this.$lance.getJson('storeInfo').area4Id
      this.form.area4Name = this.$lance.getJson('storeInfo').area4Name
      this.form.actCode = 'LZSY_C001'
      this.form.actName = '超划算' // 活动code暂时写死
      this.form.activeFlag = 1 // 暂时写死
      const categoryInfo = this.$lance.getJson('categoryInfo')
      if (this.form.id) {
        if (categoryInfo) {
          this.form.primaryCategoryId = categoryInfo.primaryCategoryId
          this.form.primaryCategoryName = categoryInfo.primaryCategoryName
          this.form.secondaryCategoryId = categoryInfo.secondaryCategoryId
          this.form.secondaryCategoryName = categoryInfo.secondaryCategoryName
          this.form.level3CategoryId = categoryInfo.level3CategoryId
          this.form.level3CategoryName = categoryInfo.level3CategoryName
        }
        this.$http.post(
          this.$apiUri.APP_STREET_GOODS_UPDATE,
          this.form,
          res => {
            this.fullscreenLoading = false
            this.$toast('提交成功，耐心等待审核')
            // this.form.id = res.data
            // this.$lance.setJson('streetGoodsBase', this.form)
            this.$lance.clearStorage('categoryInfo')
            this.$router.push({
              name: 'goods',
              query: {
                active: 0
              }
            })
          },
          err => {
            this.fullscreenLoading = false
            this.$toast(err.message)
          }
        )
      } else {
        this.form.primaryCategoryId = categoryInfo.primaryCategoryId
        this.form.primaryCategoryName = categoryInfo.primaryCategoryName
        this.form.secondaryCategoryId = categoryInfo.secondaryCategoryId
        this.form.secondaryCategoryName = categoryInfo.secondaryCategoryName
        this.form.level3CategoryId = categoryInfo.level3CategoryId
        this.form.level3CategoryName = categoryInfo.level3CategoryName
        this.$http.post(
          this.$apiUri.APP_STREET_GOODS_ADD,
          this.form,
          res => {
            this.fullscreenLoading = false
            this.$toast('提交成功，耐心等待审核')
            // this.form.id = res.data
            // this.$lance.setJson('streetGoodsBase', this.form)
            this.$lance.clearStorage('categoryInfo')
            this.$router.push({
              name: 'goods',
              query: {
                active: 0
              }
            })
          },
          err => {
            this.fullscreenLoading = false
            this.$toast(err.message)
          }
        )
      }
    },
    getStreetGoodsDetail () {
      this.$http.post(
        this.$apiUri.APP_STREET_GOODS_DETAIL,
        { goodsId: this.$route.query.goodsId },
        res => {
          if (!res.data) return null
          this.form = res.data
          console.log('getStreetGoodsDetail:', this.form)
          const categoryInfo = this.$lance.getJson('categoryInfo')
          if (categoryInfo) {
            this.hland(categoryInfo)
          } else {
            this.hland(res.data)
          }
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    // 处理分类数据
    hland (categoryInfo) {
      if (!categoryInfo.level3CategoryName && categoryInfo.secondaryCategoryName) {
        this.$set(
          this.form,
          'category',
          `${categoryInfo.primaryCategoryName}-${categoryInfo.secondaryCategoryName}`
        )
        return
      }
      if (!categoryInfo.secondaryCategoryName) {
        this.$set(this.form, 'category', categoryInfo.primaryCategoryName)
        return
      }
      this.$set(
        this.form,
        'category',
        `${categoryInfo.primaryCategoryName}-${categoryInfo.secondaryCategoryName
        }-${categoryInfo.level3CategoryName}`
      )
    }
  }
}
</script>

<style>
</style>
