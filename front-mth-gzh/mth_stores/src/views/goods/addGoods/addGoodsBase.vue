<!-- 添加商品 -->
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
        <van-field v-model="form.category"
                   class="w-75 cell px-2 py-1"
                   readonly
                   clickable
                   right-icon="arrow"
                   placeholder="请选择"
                   @click="onClickCategory" />
      </div>
      <div class="d-flex justify-content-between align-items-center my-2">
        <div class="label-width text-right">
          <span class="fs-10 color-red pr-1">*</span>
          <span class="fs-14 color-text">商品品牌</span>
        </div>
        <van-field v-model="form.brandName"
                   class="w-75 cell px-2 py-1"
                   readonly
                   clickable
                   right-icon="arrow"
                   placeholder="请选择"
                   @click="showBrandCodes = true" />
      </div>
      <div class="d-flex justify-content-between align-items-center my-2">
        <div class="label-width text-right">
          <span class="fs-14 color-text">活动结束时间</span>
        </div>
        <van-field class="w-75 cell px-2 py-1"
                   readonly
                   clickable
                   v-model="form.pullOffTime"
                   right-icon="arrow"
                   placeholder="请选择"
                   @click="showUseTime=true">
        </van-field>
      </div>
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="label-width text-right">
          <span class="fs-10 color-red pr-1">*</span>
          <span class="fs-14 color-text">邮费</span>
        </div>
        <van-field v-model="form.postage"
                   class="w-75 cell px-2 py-1"
                   :border="false"
                   type="number"
                   placeholder="请输入邮费">
          <template #extra>
            <span class="color-text"> 元</span>
          </template>
        </van-field>
      </div>
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="label-width text-right">
          <span class="fs-14 color-text">商品编号</span>
        </div>
        <van-field v-model="form.goodsNo"
                   class="w-75 cell px-2 py-1"
                   :border="false"
                   placeholder="请输入商品编号" />
      </div>
      <div class="d-flex justify-content-between align-items-center my-2">
        <div class="label-width text-right">
          <span class="fs-14 color-text">商品角标</span>
        </div>
        <van-field v-model="form.goodsMarkName"
                   class="w-75 cell px-2 py-1"
                   readonly
                   clickable
                   right-icon="arrow"
                   placeholder="请选择"
                   @click="showGoodsMark = true" />
      </div>
    </van-form>
    <van-form validate-first
              class="bg-white pb-10 mt-2">
      <van-cell title="商品缩略图"
                :border="false">
        <template #icon>
          <span class="color-danger">*</span>
        </template>
        <template #label>
          <div v-if="isAndroid"
               class="d-flex">
            <div v-if="form.goodsIcon"
                 class="appImg mr-1">
              <img :src="form.goodsIcon"
                   class="camera-bgImg"
                   alt=""
                   @click="ImagePreview1">
              <div class="icon"
                   @click="deleteUploader1">
                <van-icon name="cross"
                          color="#fff"
                          size="10px" />
              </div>
            </div>
            <img v-else
                 class="camera-bgImg"
                 :src="require('@/assets/images/camera@2x.png')"
                 alt=""
                 @click="androidUpload('contanct')">
          </div>
          <van-uploader v-else
                        v-model="uploader1"
                        :max-count="1"
                        :max-size="1024 * 1024 * 3"
                        :after-read="afterReadUploader1"
                        :disabled="disabled"
                        :before-read="beforeReadFile"
                        @oversize="onOversize1"
                        @delete="deleteUploader1" />
          <p class="fs-13 color-c1">
            （可上传1张图片，建议尺寸400×400px,只能上传jpg/png文件，
            且不超过3MB）
          </p>
        </template>
      </van-cell>
      <van-button color="linear-gradient(180deg, #F1722C 0%, #EB6133 100%)"
                  block
                  size="small"
                  round
                  class="mt-8 but"
                  @click="next">下一步</van-button>
    </van-form>
    <!-- 商品角标 -->
    <van-popup v-model="showGoodsMark"
               position="bottom"
               round
               :close-on-popstate="false"
               :safe-area-inset-bottom="true">
      <van-picker title="商品角标"
                  show-toolbar
                  :columns="GoodsMarkColumns"
                  @confirm="onConfirmGoodsMark"
                  @cancel="showGoodsMark = false" />
    </van-popup>
    <!-- 商品品牌 -->
    <van-popup v-model="showBrandCodes"
               position="bottom"
               round
               :close-on-popstate="false"
               :safe-area-inset-bottom="true">
      <van-picker title="商品品牌"
                  show-toolbar
                  :columns="brandCodesColumns"
                  @confirm="onConfirmBrandCodes"
                  @cancel="showBrandCodes = false" />
    </van-popup>
    <!-- 选择时间 -->
    <van-popup v-model="showUseTime"
               position="bottom"
               round
               :close-on-popstate="false"
               :safe-area-inset-bottom="true">
      <van-datetime-picker v-model="currentDate"
                           type="datetime"
                           title="选择完整时间"
                           @confirm="onConfirmTime"
                           @cancel="showUseTime = false"
                           :min-date="minDate"
                           :max-date="maxDate" />
    </van-popup>
  </div>
</template>

<script>
import { ImagePreview } from 'vant'
export default {
  name: 'AddGoods',
  mixins: ['mixins'],
  data () {
    return {
      showGoodsMark: false,
      showBrandCodes: false,
      form: {
        goodsName: null,
        goodsTitle: null,
        brandCode: null,
        brandName: null,
        category: null,
        postage: null,
        goodsNo: null,
        goodsMark: 0,
        goodsMarkName: '不显示'
      },
      isAndroid: !!window.jsObj,
      uploader1: [],
      disabled: false,
      GoodsMarkColumns: ['不显示', '折扣', '直降', '特卖价'],
      brandCodesColumns: [],
      brandList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      showUseTime: false,
      minDate: new Date(),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date()
    }
  },
  created () {
    this.getBrandList()
    if (this.$route.query.goodsId) {
      this.getGoodsBase()
    } else {
      this.form.category = null
    }
  },
  activated () {
    if (this.$lance.getJson('categoryInfo')) {
      this.$set(
        this.form,
        'category',
        `${this.$lance.getJson('categoryInfo').primaryCategoryName}-${this.$lance.getJson('categoryInfo').secondaryCategoryName
        }-${this.$lance.getJson('categoryInfo').level3CategoryName}`
      )
    }
    if (this.$route.query.goodsId) {
      this.getGoodsBase()
    }
  },
  beforeDestroy () {
    this.$lance.clearStorage('categoryInfo')
  },
  methods: {
    onConfirmTime (time) {
      this.form.pullOffTime = this.$lance.parseTime(time, '{y}-{m}-{d} {h}:{i}')
      this.showUseTime = false
    },
    // * Android 回调函数
    androidResponse (obj) {
      // if (obj.type === 'goodsIcon') {
      //   this.$set(this.form, 'goodsIcon', obj.imgPath)
      //   this.uploader1 = [{ url: obj.imgPath }]
      // }
      if (obj.type === 'contanct') {
        this.$set(this.form, 'goodsIcon', obj.imgPath)
        this.uploader1 = [{ url: obj.imgPath }]
      }
    },
    // app端缩略图图片预览
    ImagePreview1 () {
      ImagePreview([this.form.goodsIcon])
    },
    deleteUploader1 () {
      this.form.goodsIcon = null
    },
    // 缩略图大小限制
    onOversize1 (file) {
      this.$toast('缩略图大小不能超过 3MB')
    },
    afterReadUploader1 (File) {
      if (Array.isArray(File)) {
        return this.$toast('只能上传一张图片')
      }
      this.afterReadUploader(File, 1)
    },
    // 商品分类跳转
    onClickCategory () {
      this.$router.push({
        name: 'primaryCategory',
        query: {
          goodsBase: this.form
        }
      })
    },
    // 商品角标弹框
    onConfirmGoodsMark (value, index) {
      this.form.goodsMark = index
      this.form.goodsMarkName = value
      this.showGoodsMark = false
    },
    // 商品品牌弹框
    onConfirmBrandCodes (value, index) {
      this.$set(
        this.form,
        'brandCode',
        this.brandList.filter(item => item.brandName === value)[0].brandCode
      )
      this.form.brandName = value
      this.showBrandCodes = false
    },
    // 获取品牌信息
    getBrandList () {
      this.$http.post(
        this.$apiUri.APP_STORE_GOODS_BRAND,
        this.queryParams,
        res => {
          if (!res.data) return null
          this.brandList = res.data
          this.brandCodesColumns = res.data.map(item => item.brandName)
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    // 获取商品基础信息
    getGoodsBase () {
      this.$http.post(
        this.$apiUri.APP_STORE_GOODS_DETAIL,
        { goodsId: this.$route.query.goodsId },
        res => {
          if (!res.data) return null
          this.form = res.data
          this.uploader1 = [{ url: res.data.goodsIcon }]
          this.form.goodsMarkName = this.GoodsMarkColumns[res.data.goodsMark]
          if (this.$lance.getJson('categoryInfo')) {
            this.$set(
              this.form,
              'category',
              `${this.$lance.getJson('categoryInfo').primaryCategoryName}-${this.$lance.getJson('categoryInfo').secondaryCategoryName
              }-${this.$lance.getJson('categoryInfo').level3CategoryName}`
            )
          } else {
            this.form.category = `${res.data.primaryCategoryName}-${res.data.secondaryCategoryName}-${res.data.level3CategoryName}`
          }
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    check (v) {
      var a = /^[0-9]*(\.[0-9]{1,2})?$/
      if (!a.test(v)) {
        return false
      } else {
        return true
      }
    },
    // 下一步
    next () {
      if (!this.form.goodsName) return this.$toast('商品标题不能为空!')
      if (!this.form.goodsTitle) {
        return this.$toast('商品副标题不能为空!')
      }
      if (!this.form.category) return this.$toast('商品分类不能为空!')
      if (!this.form.brandName) return this.$toast('商品品牌不能为空!')
      if (!this.form.postage) return this.$toast('邮费不能为空!')
      if (!this.check(this.form.postage)) return this.$toast('请输入正确的邮费')
      if (!this.form.goodsIcon) return this.$toast('请上传商品缩略图')

      this.form.storeId = this.$lance.getJson('storeInfo').storeId
      this.form.storeName = this.$lance.getJson('storeInfo').storeName
      this.form.status = 0
      this.form.roleCode = this.$lance.getJson('storeInfo').storeRoleCode
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
          this.$apiUri.APP_STORE_GOODS_UPDATE,
          this.form,
          res => {
            this.$toast('修改成功')
            this.$lance.clearStorage('categoryInfo')
            this.$lance.setJson('goodsBase', this.form)
            this.$router.push({
              name: 'addGoodsInfo',
              query: {
                goodsBase: this.form
              }
            })
          },
          err => {
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
          this.$apiUri.APP_STORE_GOODS_ADD,
          this.form,
          res => {
            this.$toast('添加成功')
            this.form.id = res.data
            this.$lance.setJson('goodsBase', this.form)
            this.$lance.clearStorage('categoryInfo')
            this.$router.push('addGoodsInfo')
          },
          err => {
            this.$toast(err.message)
          }
        )
      }
    }
  }
}
</script>
<style lang="scss" scoped>
// @import url(); 引入公共css类
.addGoods {
  .label-width {
    min-width: 70px;
  }
  .cell {
    border: 1px solid #f2f2f2;
    border-radius: 8px;
  }
  .camera-bgImg {
    width: 60px;
    height: 60px;
  }

  .appImg {
    position: relative;
    .icon {
      position: absolute;
      top: 0;
      right: 0;
      width: 16px;
      height: 16px;
      background-color: rgba(0, 0, 0, 0.7);
      border-radius: 0 0 0 0.32rem;
      line-height: 16px;
      text-align: center;
    }
  }
}
</style>
