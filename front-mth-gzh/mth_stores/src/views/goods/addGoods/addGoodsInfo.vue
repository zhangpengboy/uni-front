<!-- 添加商品详情 -->
<template>
  <div class="addGoodsInfo">
    <van-form validate-first class="bg-white pb-10 pt-2">
      <div class="px-3">
        <p class="d-flex align-items-center">
          <span class="color-red pr-1 pt-2">*</span>
          <span class="fs-14 color-text">商品标签</span>
        </p>
        <van-field
          v-model="form.goodsLabel"
          :autosize="{ maxHeight: 200, minHeight: 50 }"
          type="textarea"
          maxlength="200"
          placeholder="请输入商品标签"
          show-word-limit
          :border="false"
          class="cell"
        />
      </div>
      <van-cell title="商品轮播图" :border="false">
        <template #icon>
          <span class="color-danger">*</span>
        </template>
        <template #label>
          <div class="d-flex" v-if="isAndroid">
            <div v-if="bannerImgUrlList.length > 0 && bannerImgUrlList.length < 6" class="d-flex">
              <div
                v-for="(item,index) in bannerImgUrlList"
                :key="index"
                class="appImg mr-1"
                >
                <img
                  :src="item"
                  class="camera-bgImg"
                  alt=""
                  @click="ImagePreview1"
                />
                <div class="icon" @click="deleteAndroidUploader1(index)">
                  <van-icon name="cross" color="#fff" size="10px" />
                </div>
              </div>
            </div>
            <img
               v-if="imgUrlList.length >= 0 && imgUrlList.length < 5"
              class="camera-bgImg"
              :src="require('@/assets/images/camera@2x.png')"
              alt=""
              @click="androidUpload('bannerImg')"
            />
          </div>
          <van-uploader
            v-else
            v-model="uploader1"
            :max-count="5"
            :max-size="1024 * 1024 * 3"
            @oversize="onOversize1"
            :after-read="afterReadUploader1"
            @delete="deleteUploader1"
            :before-read="beforeReadFile"
          />
          <p class="fs-13 color-c1">（最多可上传5张图片，建议尺寸750×750px，只能上传jpg/png 文件，且不超过3M）</p>
        </template>
      </van-cell>
      <van-divider/>
      <van-cell title="商品详情图" :border="false">
        <template #icon>
          <span class="color-danger">*</span>
        </template>
        <template #label>
          <div class="d-flex" v-if="isAndroid">
            <div v-if="detailImgUrlList.length > 0 && detailImgUrlList.length < 11" class="d-flex">
              <div
                v-for="(item,index) in detailImgUrlList"
                :key="index"
                class="appImg mr-1"
                >
                <img
                  :src="item"
                  class="camera-bgImg"
                  alt=""
                  @click="ImagePreview2"
                />
                <div class="icon" @click="deleteAndroidUploader2(index)">
                  <van-icon name="cross" color="#fff" size="10px" />
                </div>
              </div>
            </div>
            <img
               v-if="detailImgUrlList.length >= 0 && detailImgUrlList.length < 10"
              class="camera-bgImg"
              :src="require('@/assets/images/camera@2x.png')"
              alt=""
              @click="androidUpload('detailImg')"
            />
          </div>
          <van-uploader
            v-else
            v-model="uploader2"
            :max-count="10"
            :max-size="1024 * 1024 * 3"
            @oversize="onOversize2"
            :after-read="afterReadUploader2"
            @delete="deleteUploader2"
            :before-read="beforeReadFile"
          />
          <p class="fs-13 color-c1">（最多可上传10张图片，建议尺寸750×750px，只能上传jpg/png 文件，且不超过3M）</p>
        </template>
      </van-cell>
      <van-button
        color="linear-gradient(180deg, #F1722C 0%, #EB6133 100%)"
        block
        size="small"
        round
        @click="next"
        class="mt-8 but"
        >下一步</van-button
      >
    </van-form>
  </div>
</template>

<script>
import { ImagePreview } from 'vant'
export default {
  name: 'addGoodsInfo',
  data () {
    return {
      form: {
        goodsLabel: null
      },
      isAndroid: !!window.jsObj,
      uploader1: [],
      uploader2: [],
      bannerImgUrlList: [],
      detailImgUrlList: [],
      goodsBase: null
    }
  },
  mixins: [ 'mixins' ],
  created () {
    this.goodsBase = this.$lance.getJson('goodsBase')
    if (this.goodsBase.id) {
      this.getGoodsInfo()
    }
  },
  // activated () {
  //   this.getGoodsInfo()
  // },
  methods: {
    // * Android 回调函数
    androidResponse (obj) {
      if (obj.type === 'bannerImg') {
        this.bannerImgUrlList.push(obj.imgPath)
      } else if (obj.type === 'detailImg') {
        this.detailImgUrlList.push(obj.imgPath)
      }
    },
    // app端轮播图图片预览
    ImagePreview1 () {
      ImagePreview(this.bannerImgUrlList)
    },
    // 删除安卓轮播图图片
    deleteAndroidUploader1 (file, detail) {
      this.bannerImgUrlList.splice(detail.index, 1)
    },
    // 删除H5轮播图
    deleteUploader1 (file, detail) {
      this.bannerImgUrlList.splice(detail.index, 1)
    },
    // h5轮播图大小判断
    onOversize1 (file) {
      this.$toast('图片大小不能超过 3MB')
    },
    afterReadUploader1 (File) {
      this.afterReadUploader(File, 2)
    },

    // app安卓端详情图图片预览
    ImagePreview2 () {
      ImagePreview(this.detailImgUrlList)
    },
    // H5详情图大小判断
    onOversize2 (file) {
      this.$toast('详情图片大小不能超过 3MB')
    },
    afterReadUploader2 (File) {
      this.afterReadUploader(File, 3)
    },
    // 删除安卓详情图
    deleteAndroidUploader2 (file, detail) {
      this.detailImgUrlList.splice(detail.index, 1)
    },
    // 删除H5详情图
    deleteUploader2 (file, detail) {
      this.detailImgUrlList.splice(detail.index, 1)
    },
    // 获取商品详情信息
    getGoodsInfo () {
      this.$http.post(
        this.$apiUri.APP_STORE_GOODS_DETAILINFO,
        { goodsId: this.goodsBase.id },
        (res) => {
          if (!res.data) return null
          this.form = res.data
          res.data.bannerImg.split(';').forEach(element => {
            this.uploader1.push({
              url: element
            })
            this.bannerImgUrlList.push(element)
          })
          res.data.detailImg.split(',').forEach(element => {
            this.uploader2.push({
              url: element
            })
            this.detailImgUrlList.push(element)
          })
        },
        (err) => {
          this.$toast(err.message)
        }
      )
    },
    // 下一步
    next () {
      this.form.bannerImg = this.bannerImgUrlList.join(';')
      this.form.detailImg = this.detailImgUrlList.join(',')
      if (!this.form.goodsLabel) return this.$toast('商品标签不能为空!')
      if (!this.form.bannerImg) return this.$toast('请上传商品轮播图')
      if (!this.form.detailImg) return this.$toast('请上传商品详情图')
      this.form = _.assign(this.form, {
        goodsId: this.goodsBase.id,
        goodsName: this.goodsBase.goodsName
      })
      if (this.form.id) {
        this.$http.post(
          this.$apiUri.APP_STORE_GOODS_DETAIL_UPDATE,
          this.form,
          (res) => {
            this.$toast('修改成功')
            this.$router.push({
              name: 'addGoodsSku',
              query: {
                goodsBase: this.goodsBase
              }
            })
          },
          (err) => {
            this.$toast(err.message)
          }
        )
      } else {
        this.$http.post(
          this.$apiUri.APP_STORE_GOODS_DETAIL_ADD,
          this.form,
          (res) => {
            this.$toast('添加成功')
            this.form.id = res.data
            this.$router.push({
              name: 'addGoodsSku',
              query: {
                goodsBase: this.goodsBase
              }
            })
          },
          (err) => {
            this.$toast(err.message)
          }
        )
      }
    }
  }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
.addGoodsInfo {
  .label-width {
    min-width: 70px;
  }
  .cell {
    border: 1px solid #f2f2f2;
    border-radius: 8px;
  }
}
</style>
