<template>
  <div class="home">
    <!-- <div class="dityTop">

    </div> -->
    <van-swipe @change="onChange" :autoplay="3000" indicator-color="white">
      <van-swipe-item
        v-for="(swiper, i) in swiperList"
        :key="i"
        @click="imagePreview(i)"
      >
        <van-image
          width="100%"
          height="10.5rem"
          fit="fill"
          :src="swiper"
        ></van-image>
      </van-swipe-item>

      <template #indicator>
        <div class="custom-indicator">
          {{ current + 1 }}/{{ swiperList.length }}
        </div>
      </template>
    </van-swipe>
    <div class="moneyBox" v-if="goodsObj">
      <div class="price text-price text-main fs-18 fw-700">
        <span>{{ goodsObj.salePrice }}</span>
        <template v-if="goodsObj.integral > 0">
          <span class="text-xs">{{
            goodsObj.integralType | filterIntegralType
          }}</span>
          <span>{{ goodsObj.integral }}</span>
          <span class="text-xs">{{ $lance.getIntegralName() }}</span>
        </template>
        <span class="text-marketPrice fs-12">{{
          `¥ ${goodsObj.marketPrice}`
        }}</span>
        <van-image
          @click="imageFh"
          width="16"
          height="16"
          style="float: right"
          :src="require('../../assets/images/exchange/分享@2x.png')"
        />
      </div>
      <span
        style="
          font-size: 10px;
          font-weight: 300;
          color: #999999;
          opacity: 1;
          float: right;
        "
        >分享</span
      >
      <div class="huaWel">
        <!-- <span class="key">自营</span> -->
        {{ goodsObj.goodsName }}
      </div>
      <div class="huaWels">
        {{ goodsObj.goodsTitle }}
      </div>
      <!-- 数字货架分润 -->
      <div v-if="userStoreShow">
        <van-divider />
        <div class="yongjin">
          <div>
            <div class="jine">商品陈列奖励</div>
            <div class="moneyYojin">￥{{ Obj.storeAmount }}</div>
          </div>
          <div
            style="width: 1px; height: 36px; background: #eeeeee; opacity: 1"
          ></div>
          <div>
            <div class="jine">商品动销奖励比例</div>
            <div class="moneyYojin">{{ Obj.storeIncome * 100 }}%</div>
          </div>
        </div>
      </div>
      <!-- 礼券妈妈分润 -->
      <div v-if="giftMotherShow">
        <van-divider />
        <div class="yongjin">
          <div>
            <div class="jine">预计奖励</div>
            <div class="moneyYojin">￥{{ yjparice }}</div>
          </div>
          <div
            style="width: 1px; height: 36px; background: #eeeeee; opacity: 1"
          ></div>
          <div>
            <div class="jine">预计奖励比例</div>
            <div class="moneyYojin">
              {{
                giftMotherObj.type === '1'
                  ? `${giftMotherObj.amount * 100}%`
                  : giftMotherObj.amount
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="giftvouchers && opengift"
      @click="userPayNotify"
      class="giftvouchers"
      style="
        background-image: url(https://app-static.meitianhui.com/images/ebbe6f658ceac1d8f1e06fc3eebeb304-n58esp0zcw.png);
      "
    >
      <van-image
        class="giftvouchers_img"
        width="22"
        height="22"
        :src="require('../../assets/images/my/icon_gift certificate@2x.png')"
      />
      <div class="giftvouchers_center">
        <span>优惠</span>
        <span class="giftvouchers_texts" v-if="opengift"
          >可使用{{ giftNumber }}张礼券福袋</span
        >
        <span class="giftvouchers_text" v-else
          >开通365礼券福袋
          <span
            style="color: #c1c1c1; font-size: 14px; margin-left: 3.51351rem"
          >
            <van-icon name="arrow" /> </span
        ></span>
      </div>
    </div>

    <!-- 我的店铺 -->
    <!-- <div class="ditydp" @click="onClickMy">
      <van-image
        width="32"
        height="32"
        style="border-radius: 50%;
          overflow: hidden;margin:14px 10px 12px 12px;"
        :src="require('../../assets/images/logo.png')"
      />
      <div style="font-size: 15px;font-weight: 500;color: #333333;opacity: 1;">
        {{ goodsObj.storeName }}
      </div>
      <div
        style=" margin-top: 2px;

     margin-left: 50%;
     width: 50px;
     text-align: center;"
      >
        <van-icon name="arrow" />
      </div>
    </div> -->
    <div class="popup">
      <van-cell is-link @click.stop="show = true"
        ><span style="font-size: 14px; color: #999999; margin-left: "
          >服务</span
        >
        <span
          style="float: right; font-size: 14px; color: #999999; margin-left: "
          >查看服务</span
        >
      </van-cell>
      <van-popup
        v-model="show"
        round
        closeable
        position="bottom"
        :style="{ height: '40%' }"
      >
        <div class="popLog">
          <p>正品保证</p>
          <p>此商品官方保证为正品</p>
          <p>极速退款</p>
          <p>此商品享受退货极速退款服务</p>
          <p>7天退换</p>
          <p>此商品享受7天无理由退换服务</p>
        </div>
      </van-popup>
      <van-cell is-link @click="onClickButton"
        ><span style="font-size: 14px; color: #999999; margin-left: ">规格</span
        ><span
          style="float: right; font-size: 14px; color: #999999; margin-left: "
          >选择/规格</span
        >
      </van-cell>
      <van-popup
        v-model="hide"
        round
        closeable
        position="bottom"
        :close-on-popstate="true"
      >
        <div class="skuname">
          <img :src="goodsDataSkuImg" @click="skuImgShowClick" />
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
          <div
            v-for="(v, i) in goodsData"
            :key="i"
            class="vanbut"
            :class="[isActivate === i ? 'activeClass' : 'noActiveClass']"
            @click="cutSKU(i)"
          >
            {{ v.skuName }}
          </div>
          <!-- <div
            class="item"
            :class="{ active: listIndex == index }"
            v-for="(item, index) in goodsDatas"
            :key="index"
            @click="clickSwitch(item, index)"
          >
            {{ item.skuName }}
          </div> -->
        </div>
        <van-divider />

        <div class="stepper">
          <div class="ml-1">
            <span class="fs-16">数量：</span>
            <span class="fs-13 color-muted">{{
              `(限购 ${quota > goodsDataAmount ? goodsDataAmount : quota} 件)`
            }}</span>
          </div>
          <van-stepper integer min="1" class="mr-1" v-model="value" />
        </div>
        <van-button round type="info" @click="submit" class="mb-3"
          >立即购买</van-button
        >
      </van-popup>
    </div>
    <div class="details">商品详情</div>
    <div id="detailImgList" v-for="item in detailImgList" :key="item.id">
      <van-image width="100%" height="100%" :src="item" />
    </div>
    <!-- <div class="imageMAX" v-for="swiper in swiperList" :key="swiper.id">

    </div> -->
    <div class="findButtom">
      <van-goods-action>
        <van-goods-action-icon text="店铺" @click="onClickMy">
          <template #icon>
            <van-image
              width="0.48648rem"
              height="0.48648rem"
              :src="require('@/assets/images/exchange/icon_shop@2x.png')"
            />
          </template>
        </van-goods-action-icon>
        <van-goods-action-icon text="客服" @click="onClickIcon">
          <template #icon>
            <van-image
              width="0.48648rem"
              height="0.48648rem"
              :src="require('@/assets/images/exchange/service@2x.png')"
            />
          </template>
        </van-goods-action-icon>
        <van-goods-action-icon
          :text="isKeep ? '收藏' : '已收藏'"
          @click="onClickCollect"
        >
          <template #icon>
            <van-image
              width="0.48648rem"
              height="0.48648rem"
              :src="
                isKeep
                  ? require('@/assets/images/exchange/icon_collect_nor@2x.png')
                  : require('@/assets/images/exchange/collect@2x.png')
              "
            />
          </template>
        </van-goods-action-icon>
        <van-goods-action-button
          type="danger"
          text="立即购买"
          @click="onClickButton"
        />
      </van-goods-action>
    </div>
    <!-- 规格图片预览 -->
    <van-image-preview
      v-model="skuImgShow"
      :images="skuImgList"
      @change="onChangeSKUImg"
      closeable
      :loop="false"
      :start-position="index"
      @close="closePreview"
    >
      <template v-slot:index>{{ goodsDataSkuName }}</template>
    </van-image-preview>
    <!-- 分享模板 -->

    <!-- <van-share-sheet
      v-model="showShare"
      title="立即分享给好友"
      :options="options"
      @select="onSelect"
    /> -->
    <van-overlay :show="showShare" @click="showShare = false">
      <!-- <div class="wrapper" @click.stop> -->
      <div class="wrapper">点击右上角按钮</div>
      <div class="block">
        立即分享到朋友圈
        <!-- </div> -->
      </div>
      <div class="dashed">我知道了</div>
    </van-overlay>
  </div>
</template>

<script>
import { Toast, ImagePreview } from 'vant'
import Decimal from 'decimal.js-light'
// import { mapState } from 'vuex'
export default {
  data () {
    return {
      current: 0,
      amount: 0,
      show: false,
      hide: false,
      value: 0,
      swiperList: [],
      detailImgList: [],
      goodsData: [], // 规格
      skuImgShow: false,
      skuImgList: [], // 规格图片预览图列表
      goodsObj: {}, // 商品基础信息
      isKeep: true, // xq收藏
      demoId: '',
      goodsDataSkuImg: '',
      goodsDataSalePrice: null,
      goodsDataIntegral: null,
      goodsDataAmount: null,
      goodsDataSkuName: null,
      goodsDataIntegralType: null,
      quota: 1, // 限购数量
      skuColor: '', // #EB6133
      isActivate: 0,
      pathName: '', // 路径名称
      Obj: {}, // 数字货架分润数据
      userStoreShow: false,
      opengift: false,
      giftNumber: 0,
      index: 0,
      giftvouchers: false,
      giftMotherShow: false, // 礼券妈妈分润是否显示
      giftMotherObj: {}, // 礼券妈妈分润数据
      // giftMotherIconShow: true // 礼券妈妈底部店铺、客服图标是否显示
      showShare: false,
      options: [{ name: '微信好友', icon: 'wechat' }],
      datas: {},
      bsType: '', // 区分普通、数字货架、云创业的商品
      saleStoreId: '',
      saleStoreName: '',
      yjparice: null
      // goodsCode: '',
    }
  },
  // computed: {
  //   // 计算分润价格
  //   yjparice: function () {
  //     if (
  //       !_.isEmpty(this.giftMotherObj.amount) &&
  //       !_.isEmpty(this.goodsObj.salePrice) &&
  //       this.giftMotherObj.type === '1'
  //     ) {
  //       console.log(66, this.giftMotherObj.amount)
  //       console.log(77, this.goodsObj.salePrice)
  //       return new Decimal(this.giftMotherObj.amount)
  //         .mul(new Decimal(this.goodsObj.salePrice))
  //         .toFixed(2)
  //     }
  //     return this.giftMotherObj.amount
  //   }
  //   // ...mapState(['userInviteCode'])
  // },
  created () {
    this.hide = false
    this.demoId = this.$route.query.dataIP
    this.bsType = this.$route.query.bsType || 'BS_A001'
    this.uuid = this.$route.query.uuid
    if (this.bsType === 'BS_A013') {
      // 云创业
      this.getGiftMotherGoods(this.uuid)
    } else if (this.bsType === 'BS_A010') {
      // 数字货架
      this.getCloudStoreGoods(this.uuid)
    } else {
      // 普通商品
      this.getGoodsInfo()
    }
    this.getIsBuyGift()
    this.getGiftUse()
  },
  methods: {
    imageFh () {
      this.showShare = true
    },
    getWxSign (goods) {
      this.$http.post(
        this.$apiUri.APP_ADD_UPDTA_HESIGN,
        {
          url: window.location.href
        },
        res => {
          goods.inviteCode = this.$lance.getData('userInviteCode')

          this.$wxApi.wxShare(goods, res.data)
        }
      )
    },

    // 预览轮播图片
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
      this.goodsDataAmount = this.goodsData[i.index].amount
      this.goodsDataSkuName = this.goodsData[i.index].skuName
      this.goodsDataIntegralType = this.goodsData[i.index].integralType
      this.quota = this.goodsData[i.index].quota
      this.index = i.index
    },
    // 开通365礼券按钮
    userPayNotify () {
      if (!this.opengift) {
        this.$router.push('/recharge')
      }
    },
    // 查看使用和未使用的礼包卷
    getGiftUse () {
      this.$http.post(
        this.$apiUri.APP_GETGIFTUSE,
        {
          type: 0
        },
        res => {
          let num = 0
          res.data.list.map(item => {
            if (item.isActivate === 1) {
              num += 1
            }
          })
          this.giftNumber = num
        }
      )
    },
    // 返回是否开通365礼包 true=开通
    getIsBuyGift () {
      this.$http.post(this.$apiUri.APP_GETGIFTBUY, {}, res => {
        this.opengift = res.data
      })
    },
    // 查询数字货架商品分润配置
    getGoodsIncomeConfig () {
      this.$http.post(
        this.$apiUri.APP_MECONFIG,
        { goodsId: this.demoId, storeId: this.saleStoreId },
        res => {
          this.Obj = JSON.parse(res.data.config)
        }
      )
    },

    // 获取礼券妈妈商品分润配置详情
    getGiftMotherIncomeConfig () {
      this.$http.post(
        this.$apiUri.APP_INCOMEGIFTMOTHER_DETAIL,
        {
          goodsId: this.demoId
        },
        res => {
          this.giftMotherObj = JSON.parse(res.data.config).S
          if (
            !_.isEmpty(this.giftMotherObj.amount) &&
            this.goodsObj.salePrice != null &&
            this.giftMotherObj.type === '1'
          ) {
            this.yjparice = new Decimal(this.giftMotherObj.amount)
              .mul(new Decimal(this.goodsObj.salePrice))
              .toFixed(2)
          } else {
            this.yjparice = this.giftMotherObj.amount
          }
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    // 获取普通商品基础信息
    getGoodsInfo () {
      this.$http.post(this.$apiUri.APP_DATEL, { goodsId: this.demoId }, res => {
        this.goodsObj = res.data
        this.getWxSign(res.data)

        this.detailInfo()
        this.skulist()
        this.getGoods()
        // 福袋
        if (res.data.actCode === 'mth_l3kra9zp') {
          this.giftvouchers = true
          this.bsType = 'BS_A008'
        }
      })
    },
    // 获取云创业商品代卖信息
    getGiftMotherGoods (uuid) {
      this.$http.post(
        this.$apiUri.APP_GOODS_BY_UUID,
        { uuid: uuid },
        res => {
          this.saleStoreId = res.data.storeId
          this.saleStoreName = res.data.storeName
          this.demoId = res.data.goodsId
          this.getGoodsInfo()
          // 礼券妈妈
          if (
            this.bsType === 'BS_A013' &&
            this.$route.query.isFlag === 'giftMother'
          ) {
            // 从礼券妈妈后台进来的展示分润信息
            this.giftMotherShow = true
            // this.giftMotherIconShow = false
            this.getGiftMotherIncomeConfig()
          }
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    // 获取数字货架商品代卖信息
    getCloudStoreGoods (uuid) {
      this.$http.post(
        this.$apiUri.APP_CLOUDSTOREGOODS_BY_UUID,
        { uuid: uuid },
        res => {
          this.saleStoreId = res.data.storeId
          this.demoId = res.data.goodsId
          // this.demoId = res.data.goodsId
          this.getGoodsInfo()
          // 数字货架
          if (
            this.bsType === 'BS_A010' &&
            this.$route.query.isFlag === 'cloudGoods'
          ) {
            this.userStoreShow = true
            this.getGoodsIncomeConfig()
          }
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    // 获取用户是否收藏了商品
    getGoods () {
      if (this.$store.state.hasLogin) {
        this.$http.post(
          this.$apiUri.APP_USERFAVORGOODS_YES_NO,
          { goodsId: this.demoId },
          res => {
            this.isKeep = !res.data
          }
        )
      }
    },
    // 获取规格
    skulist () {
      this.$http.post(
        this.$apiUri.APP_SKULIST,
        { goodsId: this.demoId },
        res => {
          this.goodsData = res.data
          if (this.goodsData.length > 0) {
            this.goodsDataSkuImg = this.goodsData[0].skuImg
            this.goodsDataSalePrice = this.goodsData[0].salePrice
            this.goodsDataIntegral = this.goodsData[0].integral
            this.goodsDataAmount = this.goodsData[0].amount
            this.goodsDataSkuName = this.goodsData[0].skuName
            this.quota = this.goodsData[0].quota
            this.goodsDataIntegralType = this.goodsData[0].integralType
            this.skuImgList = this.goodsData.map(item => item.skuImg)
          }
        }
      )
    },
    // 切换商品规格
    cutSKU (i) {
      this.isActivate = i
      this.goodsDataSkuImg = this.goodsData[i].skuImg
      this.goodsDataSalePrice = this.goodsData[i].salePrice
      this.goodsDataIntegral = this.goodsData[i].integral
      this.goodsDataAmount = this.goodsData[i].amount
      this.goodsDataSkuName = this.goodsData[i].skuName
      this.goodsDataIntegralType = this.goodsData[i].integralType
      this.quota = this.goodsData[i].quota
      this.index = i
    },
    // banner图片
    detailInfo () {
      this.$http.post(
        this.$apiUri.APP_DATELNFO,
        { goodsId: this.demoId },
        res => {
          // 商品详情信息
          this.swiperList = res.data.bannerImg.split(';')
          this.detailImgList = res.data.detailImg.split(',')
        }
      )
    },

    /* 收藏按钮操作 */
    onClickCollect () {
      if (!this.isKeep) {
        // 取消收藏
        this.$http.post(
          this.$apiUri.APP_FAVORDEL,
          {
            workId: this.demoId
          },
          res => {
            if (res.success) {
              this.isKeep = !this.isKeep
              Toast('已取消收藏~')
            }
          }
        )
      } else {
        this.$http.post(
          this.$apiUri.APP_FAVORADD,
          {
            goodsId: this.demoId,
            goodsName: this.goodsObj.goodsName,
            goodsIcon: this.goodsObj.goodsIcon,
            salePrice: this.goodsObj.salePrice,
            marketPrice: this.goodsObj.marketPrice,
            integral: this.goodsObj.integral,
            integralType: this.goodsObj.integralType,
            bsType: this.bsType,
            saleUuid: this.uuid
          },
          res => {
            if (res.success) {
              this.isKeep = !this.isKeep
              Toast('添加收藏成功~')
            }
          }
        )
      }
    },
    // 跳转店铺
    onClickMy () {
      if (this.bsType === 'BS_A010') {
        this.$router.push({
          path: '/storeData',
          query: { storeId: this.saleStoreId }
        })
      } else if (this.bsType === 'BS_A013') {
        this.$router.push('/giftMother')
      } else {
        this.$router.push({
          path: '/storeData',
          query: {
            storeId: this.goodsObj.storeId
          }
        })
      }
    },
    // 客服
    onClickIcon () {
      window.open('https://wpa1.qq.com/SVEwR648?_type=wpa&qidian=true', '_self')
    },

    // 提交跳转订单页面
    submit () {
      this.$lance.setJson('storeId', this.goodsObj)
      this.$lance.setJson('goodsList', this.goodsData[this.isActivate])
      if (this.goodsDataAmount < this.value) {
        Toast('购买数量大于商品数量，无法订购')
        return
      }
      if (this.quota < this.value) {
        Toast('购买数量大于限购数量，无法订购')
        return
      }
      this.hide = false
      console.log('购买:::::::', this.bsType)
      this.$router.push({
        path: '/submitOrder',
        query: {
          Numb: this.value,
          giftNumber: this.giftNumber,
          bsType: this.bsType,
          saleStoreId: this.saleStoreId,
          saleStoreName: this.saleStoreName
        }
      })
    },
    onChange (index) {
      this.current = index
    },
    // // 订购弹起
    onClickButton () {
      this.hide = true
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  color: #ffffff;
  text-align: center;
  margin-top: 210px;
}

.dashed {
  border: 1px dashed #fff;
  width: 180px;
  color: #ffffff;
  text-align: center;
  height: 50px;
  line-height: 50px;
  margin-left: 100px;
  margin-top: 180px;
}

.block {
  text-align: center;
  margin-top: 20px;
  color: #ffffff;
}

.giftvouchers_texts {
  margin-left: 20px;
}

.giftvouchers_text {
  margin-left: 20px;
  // margin-right: 135px;
}

.giftvouchers_center {
  margin-top: 18px;
  font-size: 14px;
  font-weight: 300;
  color: #8b5b04;
}

.giftvouchers_img {
  margin-top: 15px;
  margin-right: 8px;
  margin-left: 22px;
}

.giftvouchers {
  width: 359px;
  height: 52px;
  display: flex;
  margin: 0 auto;
}

#detailImgList {
  /deep/ img {
    margin-bottom: -4px;
  }
}

.moneyYojin {
  height: 21px;
  font-size: 15px;
  font-weight: 300;
  line-height: 21px;
  color: #eb6133;
  opacity: 1;
  text-align: center;
}

.yongjin {
  display: flex;
  justify-content: space-around;
}

.jine {
  color: #999999;
  font-size: 14px;
  font-weight: 300;
  margin-bottom: 8px;
}

.van-divider {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  margin: 0.42667rem 0;
  color: #969799;
  font-size: 0.37333rem;
  line-height: 0.64rem;
  border-color: #ebedf0;
  border-style: solid;
  border-width: 0;
  width: 335px;
  text-align: center;
  margin-left: 11px;
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

.item {
  background-color: #f2f2f2;
  border-radius: 15px;
  line-height: 26px;
  text-align: center;
  color: #666666;
  height: 26px;
  padding-left: 5px;
  padding-right: 5px;
  margin-top: 15px;
  font-size: 13px;
}

.active {
  background-color: #eb6133 !important;
  color: #fff !important;

  //   width: 86px;
  //   height: 32px;
  //   height: 26px;
  //   margin-top: 15px;
}

.van-button--round {
  border-radius: 26.64rem;
  width: 360px;
  margin-left: 8px;
  background-color: #eb6133;
  border: #eb6133;
}

.stepper {
  margin: 12px 8px 30px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.ditydp {
  width: 359px;
  height: 64px;
  background: #ffffff;
  opacity: 1;
  border-radius: 8px;
  display: flex;
  line-height: 64px;
  margin-left: 8px;
}

.popLog {
  // height: 30px;
  margin-top: 40px;
  margin-left: 20px;

  // text-align: center;
  // background-color: blue;
  p:nth-child(2n) {
    padding-top: 10px;
    font-size: 10px;
    padding-bottom: 10px;
    color: #999999;
  }
}

.van-goods-action-button--danger {
  background: linear-gradient(180deg, #f1722c 0%, #eb6133 100%);
  width: 110px;
  height: 38px;
  margin-left: 120px;
}

.findButtom {
  width: 375px;
  height: 49px;
  background: #fff;
  opacity: 1;
  position: fixed;
  bottom: 0px;
}

.imageMAX {
  width: 375px;
  background: #ffffff;
  opacity: 1;
}

.details {
  background: #ffffff;
  opacity: 1;
  padding-left: 14px;
  margin-top: 12px;
  font-weight: 300;
  color: #333333;
  font-size: 14px;
  line-height: 44px;
}

.van-cell {
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 10px 0.42667rem;
  overflow: hidden;
  color: #333333;
  font-size: 14px;
  line-height: 0.64rem;
  background-color: #fff;
  color: #999999;
  border-radius: 8px;
}

.popup {
  width: 359px;
  background: #ffffff;
  opacity: 1;
  border-radius: 8px;
  margin-left: 8px;
  margin-top: 12px;
}

.discounts {
  display: flex;
  width: 359px;
  height: 52px;
  background: #ffece2;
  opacity: 1;
  border-radius: 8px;
  margin-left: 8px;
  line-height: 52px;
}

.huaWels {
  width: 332px;
  font-size: 14px;
  font-weight: 300;
  line-height: 20px;
  color: #666666;
  opacity: 1;
  // margin: 14px 0;
}

.huaWel {
  width: 332px;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  color: #333333;
  opacity: 1;
  margin: 22px 0 10px 0;

  .key {
    display: inline-block;
    width: 28px;
    height: 16px;
    background: #eb6132;
    opacity: 1;
    color: #fff;
    line-height: 16px;
    font-size: 10px;
    text-align: center;
    border-radius: 9px;
    font-weight: 300;
    margin-top: 12px;
  }
}

.money {
  height: 33px;
  padding: 12px;
  font-size: 24px;
  font-weight: 500;
  line-height: 33px;
  color: #eb6133;
  // text-indent: 5px;

  opacity: 1;

  span:nth-child(1) {
    font-size: 14px;
  }

  del {
    margin-left: 5px;
    font-size: 11px;
    font-weight: 300;
    line-height: 16px;
    color: #999999;
    opacity: 1;
  }
}

.moneyBox {
  width: 359px;
  background: #ffffff;
  opacity: 1;
  border-radius: 8px;
  margin: 8px;
  padding: 12px;
}

.my-swipe .van-swipe-item {
  // width: 375px;
  // height: 375px;

  opacity: 1;
  text-align: center;
  background-color: #fff;
}

.home {
  // width: 375px;
  background: #f3f3f3;
  opacity: 1;
  padding-bottom: 50px;

  .dityTop {
    // width: 375px;
    height: 390px;
    background: #ffffff;
    opacity: 1;
  }

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
}

.img {
  margin-bottom: -4px;
}
</style>
