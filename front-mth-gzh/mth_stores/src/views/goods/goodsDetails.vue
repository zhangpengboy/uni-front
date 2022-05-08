<!-- 商品详情 -->
<template>
  <div class='goodsDetails'>
    <!-- 轮播图 -->
    <van-swipe @change="onChange"
               :autoplay="3000"
               indicator-color="white">
      <van-swipe-item v-for="(swiper, i) in swiperList"
                      :key="i"
                      @click="imagePreview(i)">
        <van-image width="100%"
                   height="10.54054054rem"
                   fit="fill"
                   :src="swiper"></van-image>
      </van-swipe-item>

      <template #indicator>
        <div class="custom-indicator">
          {{ current + 1 }}/{{ swiperList.length }}
        </div>
      </template>
    </van-swipe>
    <!-- 商品基础信息 -->
    <div class="goodsInfo">
      <div class="goodsInfo-case">
        <div class="price text-price text-main fs-18 fw-700">
          <span>{{ goodsBase.salePrice }}</span>
          <template v-if="goodsBase.integral > 0">
            <span class="text-xs">{{
              goodsBase.integralType | filterIntegralType
            }}</span>
            <span>{{ goodsBase.integral }}</span>
            <span class="text-xs">{{ $lance.getIntegralName() }}</span>
          </template>
          <span class="fs-13 color-light"
                v-if="goodsType === 1">{{`店内价¥ ${goodsBase.marketPrice}`}}</span>
          <span v-else
                class="text-marketPrice fs-12">{{
            `¥ ${goodsBase.marketPrice}`
          }}</span>
        </div>
        <p class="fs-16 color-text fw-700 mt-3"
           style="overflow: hidden;">{{ goodsBase.goodsName }}</p>
        <p v-if="goodsType !== 2"
           class="fs-14 color-muted mt-3"
           style="overflow: hidden;">{{ goodsBase.goodsTitle }}</p>
        <!-- <p v-if="goodsType === 2" class="fs-14 color-muted mt-3">{{ goodsBase.goodsDesc }}</p> -->
        <div class="d-flex justify-content-between align-items-center mt-3">
          <span class="fs-14 color-light">库存：{{ goodsBase.stockQty }}</span>
          <span v-if="goodsType !== 2"
                class="fs-14 color-light">已售：{{ goodsBase.salesVolume }}</span>
        </div>
      </div>
    </div>
    <!-- 商品规格 -->
    <div v-if="goodsType !== 1"
         class="goodsSku">
      <div class="goodsSku-case">
        <van-cell class="px-0"
                  title="商品规格"
                  is-link
                  :border="false"
                  @click="openSku=true" />
        <van-divider class="my-0" />
        <van-cell v-if="goodsType === 0"
                  class="px-0"
                  title="运费"
                  :value="goodsBase.postage !== 0 ? goodsBase.postage : '免运费'" />
        <van-cell v-if="goodsType === 2"
                  class="px-0"
                  title="商品分类"
                  :value="goodsBase.level1CategoryName" />
      </div>
    </div>
    <!-- 商品详情 -->
    <div class="details"
         v-if="goodsType !== 1">
      <div v-if="goodsType === 0">
        <p class="details-title">商品详情</p>
        <img class="img"
             v-for="(item, i) in detailImgList"
             :key="i"
             :src="item"
             alt="">
      </div>
      <div v-else>
        <p class="details-title">商品描述</p>
        <p class="fs-13 p-3 desc">{{goodsBase.goodsDesc}}</p>
      </div>
    </div>
    <!-- 街市商品相关信息 -->
    <div class="street"
         v-else>
      <!-- 店铺信息 -->
      <div class="storeInfo"
           @click="goStore">
        <div class="top">
          <div class="left">
            <img :src="goodsBase.storeLogo" />
            <span class="storeName">{{ goodsBase.storeName }}</span>
          </div>
          <van-icon name="arrow"
                    color="#c1c1c1" />
        </div>
        <div class="bottom">
          <img src="@/assets/images/goods/icon_location@2x.png"
               alt="">
          <p class="address">{{ goodsBase.address }}</p>
        </div>
      </div>
      <!-- 套餐信息 -->
      <div class="storeInfo">
        <p class="package-title">套餐详情</p>
        <div v-for="(data, index) in specification"
             :key="index">

          <p class="package-name">{{ data.name }}</p>
          <div class="package-details"
               v-for="(v, i) in data.item"
               :key="i">
            <div class="left">
              <div class="dian"></div>
              <p class="num">{{v.detail}} ({{v.num}}) 份</p>
            </div>
            <div class="price">{{ `¥ ${v.price}` }}</div>
          </div>
        </div>
      </div>
      <!-- 注意事项 -->
      <div class="storeInfo">
        <p class="package-title">注意事项</p>
        <p class="package-name">使用时间</p>
        <div class="package-details">
          <div class="left">
            <div class="dian"></div>
            <p>{{goodsBase.useTime}}</p>
          </div>
        </div>
        <p class="package-name">使用须知</p>
        <div class="package-details">
          <div class="left">
            <div class="dian"></div>
            <p>不提供发票，不支持退款</p>
          </div>
        </div>
        <p class="package-name">其它须知</p>
        <div class="package-details">
          <div class="left">
            <div class="dian"></div>
            <p v-if="goodsBase.purchaseNotice">{{ goodsBase.purchaseNotice}}</p>
            <p v-else>无</p>
          </div>
        </div>
      </div>
      <div class="mb-10 p-2 desc"></div>
    </div>
    <!-- 底部栏 -->
    <van-goods-action>
      <div class="pl-2"
           v-if="statuType === '1'">
        <van-button color="#666"
                    plain
                    round
                    class="px-5 ml-1"
                    size="mini"
                    @click.stop="operationGoods(goodsBase,0)">删除</van-button>
        <van-button v-if="goodsBase.actGoodsStatus == 3"
                    color="#666"
                    plain
                    round
                    class="px-5 ml-1"
                    size="mini"
                    @click.stop="operationGoods(goodsBase,2)">下架</van-button>
        <van-button v-if="goodsBase.actGoodsStatus == 2"
                    color="#eb6133"
                    plain
                    round
                    class="px-5 ml-1"
                    size="mini"
                    @click.stop="operationGoods(goodsBase,1)">上架</van-button>
      </div>
      <div class="pl-2"
           v-else>
        <van-button v-if="goodsBase.status !== 3 && goodsBase.actived !== 1"
                    color="#666"
                    plain
                    round
                    class="px-5 ml-1"
                    size="mini"
                    @click.stop="delGoods(goodsBase)">删除</van-button>
        <van-button v-if="goodsBase.status === 0 || goodsBase.status === 2 || goodsBase.status === 4"
                    color="#eb6133"
                    plain
                    round
                    class="px-5 ml-1"
                    size="mini"
                    @click.stop="editGoods(goodsBase)">编辑</van-button>
        <van-button v-if="goodsBase.status === 3"
                    color="#666"
                    plain
                    round
                    class="px-5 ml-1"
                    size="mini"
                    @click.stop="downGoods(goodsBase)">下架</van-button>
        <van-button v-if="goodsBase.status === 2 || goodsBase.status === 4"
                    color="#eb6133"
                    plain
                    round
                    class="px-5 ml-1"
                    size="mini"
                    @click.stop="upGoods(goodsBase)">上架</van-button>
      </div>
    </van-goods-action>
    <!-- sku弹框 -->
    <van-popup v-model="openSku"
               round
               closeable
               position="bottom"
               :close-on-popstate="true">
      <div class="skuname">
        <img :src="goodsDataSkuImg"
             @click="skuImgShowClick" />
        <div class="skutext">
          <div class="price text-price text-main">
            <span>{{ goodsDataSalePrice }}</span>
            <template v-if="goodsDataIntegral > 0">
              <span class="text-xs">{{
                  goodsDataIntegralType | filterIntegralType
                }}</span>
              <span>{{ goodsDataIntegral }}</span>
              <span class="text-xs">{{ $lance.getIntegralName() }}</span>
            </template>
          </div>
          <div class="skulist">剩于&nbsp;{{ goodsDataAmount }}&nbsp;件</div>
          <div class="skulist">
            已选择&nbsp;<span>{{ goodsDataSkuName }}</span>
          </div>
        </div>
      </div>
      <div style="margin-left: 0.32432rem">
        <div style="color: #333333; font-size: 14px; font-weight: 300">
          选择规格:
        </div>
        <div v-for="(v, i) in goodsData"
             :key="i"
             class="vanbut"
             :class="[isActivate === i ? 'activeClass' : 'noActiveClass']"
             @click="cutSKU(i)">
          {{ v.skuName }}
        </div>
      </div>
      <van-divider />

      <div class="stepper"
           v-if="goodsType === 0">
        <div class="ml-2">
          <span class="fs-16">数量：</span>
          <span class="fs-13 color-muted">{{
              `(限购 ${quota > goodsDataAmount ? goodsDataAmount : quota} 件)`
            }}</span>
        </div>
      </div>
      <van-button color="linear-gradient(180deg, #F1722C 0%, #EB6133 100%)"
                  block
                  size="small"
                  round
                  @click="openSku=false"
                  class="mt-8 mb-6 but">确认</van-button>
    </van-popup>
    <!-- 规格图片预览 -->
    <van-image-preview v-model="skuImgShow"
                       :images="skuImgList"
                       @change="onChangeSKUImg"
                       closeable
                       :loop="false"
                       :start-position="index"
                       @close="closePreview">
      <template v-slot:index>{{ goodsDataSkuName }}</template>
    </van-image-preview>
    <!-- 编辑弹框 -->
    <van-overlay :show="open"
                 @click="open = false">
      <div class="wrapper"
           @click.stop>
        <div class="dialog">
          <div class="dialog-title">
            <p>编辑</p>
            <van-icon name="cross"
                      size="12"
                      color="#D5D5D5"
                      class="icon"
                      @click="open = false" />
          </div>
          <van-field v-model="form.stock"
                     type="number"
                     label="库存数量："
                     placeholder="请输入库存数量" />
          <van-field v-model="form.salePrice"
                     type="number"
                     label="商品金额："
                     placeholder="请输入商品金额" />
          <div class="dialog-but"
               @click="update">确认</div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { ImagePreview } from 'vant'
export default {
  name: 'goodsDetails',
  data () {
    return {
      swiperList: [],
      current: 0,
      goodsId: null,
      goodsBase: {},
      goodsInfo: {},
      goodsData: [], // 规格
      detailImgList: [],
      goodsDataSkuImg: '',
      goodsDataSalePrice: null,
      goodsDataIntegral: null,
      goodsDataAmount: null,
      goodsDataSkuName: null,
      goodsDataIntegralType: null,
      quota: 1, // 限购数量
      skuColor: '', // #EB6133
      isActivate: 0,
      skuImgList: [], // 规格图片预览图列表
      skuImgShow: false,
      index: 0,
      openSku: false,
      statuType: null, // 是否从营销页面过来
      actType: null,
      open: false,
      goodsType: null, // 0->商城商品；1->街市商品；2->店铺商品
      form: {
        stock: null,
        salePrice: null
      },
      updateUrl: null,
      deleteUrl: null,
      skuListUrl: null,
      specification: []
    }
  },
  created () {
    this.goodsId = this.$route.query.goodsId
    this.statuType = this.$route.query.statuType
    this.actType = this.$route.query.actType
    this.goodsType = this.$route.query.goodsType * 1
    if (this.goodsType === 0) {
      this.updateUrl = this.$apiUri.APP_STORE_GOODS_UPDATE_STATUS
      this.deleteUrl = this.$apiUri.APP_STORE_GOODS_DELETE
      this.skuListUrl = this.$apiUri.APP_STORE_GOODS_SKULIST
    }
    if (this.goodsType === 1) {
      this.updateUrl = this.$apiUri.APP_STREET_GOODS_UPDATE_STATUS
      this.deleteUrl = this.$apiUri.APP_STREET_GOODS_DELETE
    }
    if (this.goodsType === 2) {
      this.updateUrl = this.$apiUri.APP_STORE_GOODSUPDATE
      this.deleteUrl = this.$apiUri.APP_STORE_GOODSDELETE
      this.skuListUrl = this.$apiUri.APP_STORE_GOODS_SKU_LIST
    }
    if (this.goodsType === 0) {
      this.getGoodsBase()
      this.getGoodsInfo()
      this.getGoodsSku()
    }
    if (this.goodsType === 1) {
      this.streetGoodsInfo()
    }
    if (this.goodsType === 2) {
      this.storeGoodsInfo()
      this.getGoodsSku()
    }
  },
  methods: {
    // 获取商城商品基础信息
    getGoodsBase () {
      this.$http.post(
        this.$apiUri.APP_STORE_GOODS_DETAIL,
        { goodsId: this.goodsId },
        res => {
          this.goodsBase = res.data
        }, err => {
          this.$toast(err.message)
        }
      )
    },
    // 获取商城商品详细信息
    getGoodsInfo () {
      this.$http.post(
        this.$apiUri.APP_STORE_GOODS_DETAILINFO,
        { goodsId: this.goodsId },
        res => {
          this.goodsInfo = res.data
          this.swiperList = res.data.bannerImg.split(';')
          this.detailImgList = res.data.detailImg.split(',')
        }, err => {
          this.$toast(err.message)
        }
      )
    },
    // 获取商城商品、店铺商品sku信息
    getGoodsSku () {
      this.$http.post(
        this.skuListUrl,
        { goodsId: this.goodsId },
        res => {
          this.goodsData = res.data
          if (this.goodsData.length > 0) {
            this.goodsDataSkuImg = this.goodsData[0].skuImg
            this.goodsDataSalePrice = this.goodsData[0].salePrice
            this.goodsDataIntegral = this.goodsData[0].integral
            this.goodsDataAmount = this.goodsType === 0 ? this.goodsData[0].amount : this.goodsData[0].stock
            this.goodsDataSkuName = this.goodsData[0].skuName
            this.quota = this.goodsData[0].quota
            this.goodsDataIntegralType = this.goodsData[0].integralType
            this.skuImgList = this.goodsData.map(item => item.skuImg)
          }
        }, err => {
          this.$toast(err.message)
        }
      )
    },
    // 获取街市商品详细信息
    streetGoodsInfo () {
      this.$http.post(
        this.$apiUri.APP_STREET_GOODS_DETAIL,
        { goodsId: this.goodsId },
        res => {
          this.goodsBase = res.data
          this.goodsBase.storeLogo = res.data.storeLogo || this.$lance.publicCdnHost() + '/assets/imgs/logo.png'
          // console.log(this.goodsBase.storeLogo)
          this.goodsBase.storeName = res.data.storeName || '实惠街市自营店'
          this.swiperList = res.data.goodsBanner.split(';')
          this.specification = JSON.parse(res.data.specification)
          // console.log(this.specification)
          this.goodsBase.address = `${res.data.area1Name || ''}${res.data.area2Name || ''}${res.data.area3Name || ''}${res.data.area4Name || ''}${res.data.storeAddress || ''}`
        }, err => {
          this.$toast(err.message)
        }
      )
    },
    // 跳转到店铺
    goStore () {
      this.$router.push({
        name: 'storeInfo'
      })
    },
    // 轮播图预览
    imagePreview (i) {
      if (this.swiperList.length > 0) {
        ImagePreview({
          images: this.swiperList,
          startPosition: i,
          // showIndicators: true,
          loop: false,
          closeable: true
        })
      }
    },
    onChange (index) {
      this.current = index
    },
    // 点击缩略图打开规格预览图
    skuImgShowClick () {
      if (this.skuImgList.length > 0) {
        this.skuImgShow = true
      }
    },
    // 预览规格图片切换
    onChangeSKUImg (index) {
      // console.log(index);
      this.goodsDataSkuName = this.goodsData.map(item => item.skuName)[index]
    },
    // 关闭规格预览图,切换规格数据
    closePreview (i) {
      this.isActivate = i.index
      this.goodsDataSkuImg = this.goodsData[i.index].skuImg
      this.goodsDataSalePrice = this.goodsData[i.index].salePrice
      this.goodsDataIntegral = this.goodsData[i.index].integral
      this.goodsDataIntegralType = this.goodsData[i.index].integralType
      this.goodsDataAmount = this.goodsType === 0 ? this.goodsData[i.index].amount : this.goodsData[i.index].stock
      this.goodsDataSkuName = this.goodsData[i.index].skuName
      this.quota = this.goodsData[i.index].quota
      this.index = i.index
    },
    // 切换商品规格
    cutSKU (i) {
      this.isActivate = i
      this.goodsDataSkuImg = this.goodsData[i].skuImg
      this.goodsDataSalePrice = this.goodsData[i].salePrice
      this.goodsDataIntegral = this.goodsData[i].integral
      this.goodsDataIntegralType = this.goodsData[i].integralType
      this.goodsDataAmount = this.goodsType === 0 ? this.goodsData[i].amount : this.goodsData[i].stock
      this.goodsDataSkuName = this.goodsData[i].skuName
      this.quota = this.goodsData[i].quota
      this.index = i
    },
    // 删除商品
    delGoods (v) {
      this.dialogHttp('删除', this.deleteUrl, { ids: [v.id], actCode: v.actCode, type: 1 })
    },
    // 编辑商品
    editGoods (v) {
      // 商城商品编辑
      if (this.goodsType === 0) {
        this.$router.push({
          name: 'addGoodsBase',
          query: {
            goodsId: v.id
          }
        })
      }
      // 街市商品编辑
      if (this.goodsType === 1) {
        this.$router.push({
          name: 'addStreetGoodsIndex',
          query: {
            goodsId: v.id
          }
        })
      }
      // 店铺商品编辑
      if (this.goodsType === 2) {
        this.open = true
      }
    },
    // 店铺商品编辑操作
    update () {
      if (!this.form.stock) return this.$toast('库存数量不能为空')
      const numzz = /(^[1-9]\d*$)/
      if (!numzz.test(this.form.stock)) return this.$toast('请输入正确库存数量')
      if (!this.form.salePrice) return this.$toast('商品金额不能为空')
      const zz = /(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0)$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/
      if (!zz.test(this.form.salePrice)) {
        return this.$toast('请输入正确的价格')
      }
      this.form.id = this.goodsId
      this.$http.post(
        this.$apiUri.APP_STORE_GOODS_SKUUPDATE,
        this.form,
        () => {
          this.open = false
          this.$toast('修改成功')
          this.storeGoodsInfo()
        }, err => {
          this.$toast(err.message)
        }
      )
    },
    // 上架商品
    upGoods (v) {
      this.dialogHttp('上架', this.updateUrl, { ids: [v.id], status: 3, actCode: v.actCode, type: 1 })
    },
    // 下架商品
    downGoods (v) {
      this.dialogHttp('下架', this.updateUrl, { ids: [v.id], status: 4, actCode: v.actCode, type: 1 })
    },
    // 弹框请求方法
    dialogHttp (typeName, url, parameters) {
      let _this = this
      _this.$dialog.confirm({
        title: '',
        message: `是否${typeName}商品？`,
        confirmButtonText: '是',
        cancelButtonText: '否'
      })
        .then(() => {
          _this.$http.post(
            url,
            parameters,
            () => {
              _this.$toast(`${typeName}成功`)
              this.$router.go(-1)
            }, err => {
              _this.$toast(err.message)
            }
          )
        })
        .catch(() => {
          _this.$toast(`已取消商品${typeName}`)
        })
    },
    // 营销上下架 删除
    operationGoods (v, i) {
      // console.log(v)
      // console.log(this.actType)
      if (i === 0) {
        // 删除
        if (this.actType === '1') {
          let obj = {
            goodsId: v.id,
            storeId: v.storeId
          }
          this.$http.post(this.$apiUri.APP_GOODS_RECOMMEND_DELETE, [obj],
            res => {
              this.list = []
              this.finished = false
              // this.onLoad()
              this.$toast('删除成功')
              this.$router.back()
            },
            err => {
              this.$toast(err.message)
            })
        } else if (this.actType === '2') {
          let obj = {
            goodsId: v.id,
            storeId: v.storeId
          }
          this.$http.post(this.$apiUri.APP_GOODS_NEWS_DELETE, [obj],
            res => {
              this.list = []
              this.finished = false
              // this.onLoad()
              this.$toast('删除成功')
              this.$router.back()
            },
            err => {
              this.$toast(err.message)
            })
        } else {
          let arr = []
          arr.push(v.id)
          let obj = {
            actCode: v.actCode,
            ids: arr
          }
          this.$http.post(this.$apiUri.APP_GOODS_ACT_DELETE, obj,
            res => {
              this.list = []
              this.finished = false
              // this.onLoad()
              this.$toast('删除成功')
              this.$router.back()
            },
            err => {
              this.$toast(err.message)
            })
        }
      } else {
        let obj = {
          actCode: v.actCode,
          id: v.id
        }
        if (i === 1) {
          // 上架
          obj.actGoodsStatus = 3
        } else {
          obj.actGoodsStatus = 4
        }
        this.$http.post(this.$apiUri.APP_GOODS_ACT_UPDATE_STATUS, [obj],
          res => {
            this.list = []
            this.finished = false
            // this.onLoad()
            this.$toast(i === 1 ? '上架成功' : '下架成功')
            this.$router.back()
          },
          err => {
            this.$toast(err.message)
          })
      }
    },
    // 店铺商品详情
    storeGoodsInfo () {
      this.$http.post(
        this.$apiUri.APP_STORE_GOODS_V2_DETAIL,
        { goodsId: this.goodsId },
        res => {
          this.goodsBase = res.data
          this.swiperList = res.data.goodsBanner.split(',')
          // this.detailImgList = res.data.detailImg.split(',')
        }, err => {
          this.$toast(err.message)
        }
      )
    }
  }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
.goodsDetails {
  background: #f4f4f4;
  .custom-indicator {
    position: absolute;
    left: 175px;
    bottom: 10px;
    padding: 0px 5px;
    font-size: 12px;
    // background: rgba(177, 62, 62, 0.1);
    width: 40px;
    height: 24px;
    background: #000000;
    opacity: 0.2;
    border-radius: 13px;
    line-height: 24px;
    text-align: center;
    color: #f7f7f7;
  }
  .goodsInfo {
    width: 100%;
    height: 100%;
    padding: 0 8px;
    margin-top: 12px;
    &-case {
      width: 100%;
      height: 100%;
      background: #ffffff;
      border-radius: 8px;
      padding: 12px;
    }
  }
  .goodsSku {
    width: 100%;
    height: 100%;
    padding: 0 8px;
    margin-top: 12px;
    &-case {
      width: 100%;
      height: 100%;
      background: #ffffff;
      border-radius: 8px;
      padding: 12px;
    }
  }
  .details {
    margin-top: 12px;
    margin-bottom: 55px;
    padding-bottom: constant(safe-area-inset-bottom); // 兼容 IOS<11.2
    padding-bottom: env(safe-area-inset-bottom); // 兼容 IOS>=11.2
    &-title {
      width: 100%;
      height: 44px;
      font-size: 14px;
      background: #fff;
      color: #333;
      line-height: 44px;
      text-align: left;
      padding-left: 16px;
    }
    img {
      width: 100%;
      height: 100%;
      margin-bottom: -5px;
    }
  }
  // 街市商品信息
  .street {
    width: 100%;
    height: 100%;
    padding: 0 8px;
    margin-top: 12px;
    .storeInfo {
      width: 100%;
      height: 100%;
      background: #ffffff;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 12px;

      .dian {
        width: 6px;
        height: 6px;
        background: #d5d5d5;
        margin-right: 8px;
      }
      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left {
          display: flex;
          align-items: center;
          img {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            margin-right: 10px;
          }
          .storeName {
            max-width: 120px;
            color: #333333;
            font-size: 15px;
            // vertical-align: top;
            font-weight: 700;
            display: inline-block;
            overflow: hidden; //超出的文本隐藏
            text-overflow: ellipsis; //溢出用省略号显示
            white-space: nowrap; //溢出不换行
          }
        }
      }

      .bottom {
        display: flex;
        align-items: flex-start;
        margin-top: 14px;
        img {
          width: 14px;
          height: 14px;
          margin-right: 3px;
        }
        .address {
          width: 261px;
          // height: 20px;
          font-size: 14px;
          font-weight: 300;
          line-height: 20px;
          color: #666666;
          // display: -webkit-box;
          // overflow: hidden;
          // text-overflow: ellipsis;
          // -webkit-line-clamp: 2;
          // -webkit-box-orient: vertical;
        }
      }

      // 套餐
      .package-title {
        width: 64px;
        height: 22px;
        font-size: 16px;
        font-weight: 300;
        line-height: 22px;
        color: #333333;
        text-align: left;
      }
      .package-name {
        height: 21px;
        font-size: 15px;
        font-weight: 700;
        line-height: 21px;
        text-align: left;
        color: #333333;
        margin: 14px 0;
      }
      .package-details {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left {
          display: flex;
          align-items: center;
          .num {
            width: 257px;
            // height: 20px;
            font-size: 14px;
            font-weight: 300;
            // line-height: 20px;
            color: #999999;
          }
          p {
            width: 300px;
            // height: 20px;
            font-size: 14px;
            font-weight: 300;
            // line-height: 20px;
            color: #999999;
          }
        }
        .price {
          height: 20px;
          font-size: 14px;
          font-weight: 300;
          line-height: 20px;
          color: #666666;
        }
      }
    }
  }

  .desc {
    // margin-bottom: 55px;
    padding-bottom: 0;
    padding-bottom: constant(safe-area-inset-bottom); // 兼容 IOS<11.2
    padding-bottom: env(safe-area-inset-bottom); // 兼容 IOS>=11.2
  }

  .skutext {
    margin-top: 18px;
    margin-left: 12px;
  }

  .skulist {
    margin-top: 12px;
    font-size: 14px;
    color: #999999;
  }
  .skuname {
    display: flex;
    margin: 60px 14px 14px 14px;

    img {
      width: 100px;
      height: 100px;
      border-radius: 4px;
    }
  }
  .vanbut {
    max-width: 140px;
    height: 32px;
    font-size: 13px;
    margin: 12px 20px 0 0;
    border-radius: 30px;
    text-align: center;
    line-height: 32px;
    padding: 0 12px;
    display: inline-block;
    overflow: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
  }

  .activeClass {
    border: 1px solid #eb6133;
    background: #ffebe4;
    color: #eb6133;
  }

  .noActiveClass {
    background: #f2f2f2;
    color: #666;
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    .dialog {
      width: 300px;
      height: 210px;
      padding: 24px 14px 16px 14px;
      background: #fff;
      border-radius: 8px;

      &-title {
        p {
          height: 22px;
          font-size: 16px;
          font-weight: 300;
          line-height: 16px;
          text-align: center;
          color: #333333;
        }
        .icon {
          position: relative;
          top: -32px;
          left: 260px;
        }
      }

      &-but {
        width: 262px;
        height: 38px;
        font-size: 16px;
        background: linear-gradient(180deg, #f1722c 0%, #eb6133 100%);
        border-radius: 19px;
        margin: 16px auto;
        line-height: 38px;
        text-align: center;
        color: #fff;
      }
    }
  }
}
</style>
