<!-- 街市商品-商品详细信息 -->
<template>
  <div class="addStreetGoodsInfo">
    <van-form validate-first
              class="bg-white px-3 py-2">
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
      <van-cell title="商品轮播图"
                :border="false">
        <template #icon>
          <span class="color-danger">*</span>
        </template>
        <template #label>
          <van-uploader v-model="uploader2"
                        :max-count="5"
                        :max-size="1024 * 1024 * 3"
                        @oversize="onOversize2"
                        :after-read="afterReadUploader2"
                        @delete="deleteUploader2"
                        :before-read="beforeReadFile" />
          <p class="fs-13 color-c1">（最多可上传5张图片，建议尺寸750×750px，只能上传jpg/png 文件，且不超过3M）</p>
        </template>
      </van-cell>
      <p class="d-flex align-items-center mt-2">
        <span class="color-red pr-1">* </span>
        <span class="fs-14 color-text">套餐名称</span>
      </p>
      <specification v-for="(item, index) in list"
                     :specification="item"
                     :key="index"
                     @addSpecification="addSpecification"
                     @delSpecification="delSpecification"
                     :specificationKey="index"
                     :ref="'goodsSpecificationForm_' + index" />
      <van-button color="linear-gradient(180deg, #F1722C 0%, #EB6133 100%)"
                  block
                  size="small"
                  round
                  @click="next"
                  class="mt-8 but">下一步</van-button>
      <van-button class="but bg-primary ball my-4"
                  round
                  block
                  type="info"
                  @click="onStep">上一步</van-button>
    </van-form>
  </div>
</template>

<script>
import { ImagePreview } from 'vant'
import specification from './specification.vue'
export default {
  name: 'addStreetGoodsInfo',
  mixins: ['mixins'],
  components: {
    specification
  },
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
      isAndroid: !!window.jsObj,
      uploader1: [],
      uploader2: [],
      disabled: false,
      list: [{
        name: null,
        item: [
          {
            detail: null,
            num: null,
            price: null,
            addIconShow: true,
            delIconShow: false
          }
        ],
        addIconShow: true,
        delIconShow: false
      }],
      delList: [],
      bannerImgUrlList: []
    }
  },
  watch: {
    form (newVal, oldVal) {
      // do something
      console.log(newVal)
      // this.
      if (newVal.length > 1) {

      }
    }
  },
  created () {
    if (this.$route.query.goodsId) {
      this.dealUpdate()
    }
  },
  activated () {
    if (this.$route.query.goodsId) {
      this.dealUpdate()
    }
  },
  methods: {
    // 是否编辑
    dealUpdate () {
      console.log('addStreetGoodsInfo:', this.form)
      this.list = JSON.parse(this.form.specification)
      this.uploader1 = [{ url: this.form.goodsIcon }]
      this.form.goodsBanner.split(';').forEach(element => {
        this.uploader2.push({
          url: element
        })
        this.bannerImgUrlList.push(element)
      })
    },
    // 添加套餐
    addSpecification () {
      const _data = _.assign(
        {},
        {
          name: null,
          item: [
            {
              detail: null,
              num: null,
              price: null,
              addIconShow: true,
              delIconShow: false
            }
          ],
          addIconShow: false,
          delIconShow: true
        }
      )
      this.list.push(_data)
    },
    /** 删除套餐 */
    delSpecification (index) {
      const _list = _.cloneDeep(this.list)
      _.remove(_list, (v, i) => {
        if (index === i && v.id) {
          this.delList.push(v)
        }
        this.skuIndex = i
        return index === i
      })
      this.list = _list
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
    // 删除H5轮播图
    deleteUploader2 (file, detail) {
      this.bannerImgUrlList.splice(detail.index, 1)
    },
    // h5轮播图大小判断
    onOversize2 (file) {
      this.$toast('图片大小不能超过 3MB')
    },
    afterReadUploader2 (File) {
      this.afterReadUploader(File, 2)
    },
    // 下一步
    next () {
      if (!this.form.goodsIcon) return this.$toast('请上传商品缩略图')
      this.form.goodsBanner = this.bannerImgUrlList.join(';')
      if (!this.form.goodsBanner) return this.$toast('请上传商品轮播图')
      this.form.specification = JSON.stringify(this.list)
      // console.log('specification:', this.form.specification)
      // console.log('specification:', JSON.parse(this.form.specification))
      // console.log('list:', this.list)
      // console.log(this.$refs.goodsSpecificationForm_0[0].itemList)
      let toast = ''
      for (let i = 0; i < this.list.length; i++) {
        if (!this.list[i].name) {
          toast = '套餐名称不能为空!'
          break
        }
        if (!this.list[i].item) {
          toast = '套餐明细不能为空!'
          break
        }
        for (let j = 0; j < this.list[i].item.length; j++) {
          if (!this.list[i].item[j].detail) {
            toast = '套餐明细不能为空!'
            break
          }
          if (!this.list[i].item[j].num) {
            toast = '套餐数量不能为空!'
            break
          }
          if (!this.list[i].item[j].price) {
            toast = '套餐价格不能为空!'
            break
          }
        }
      }
      if (toast !== '') return this.$toast(toast)
      this.$emit('infoLastStep', this.form)
    },
    onStep () {
      this.$emit('infoOnStep')
    }
  }
}
</script>
<style lang="scss" scoped>
// @import url(); 引入公共css类
.addStreetGoodsInfo {
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
