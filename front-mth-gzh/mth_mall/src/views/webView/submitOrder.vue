<template>
  <div>
    <!-- <van-nav-bar
      :title="$route.meta.title"
      :right-text="$route.meta.text"
      left-arrow
      fixed
      placeholder
      @click-left="onClickLeft"
    /> -->
    <!-- 地址 -->
    <!-- <div  > -->
    <van-cell is-link class="order" center @click="toaddress">
      <div v-if="!isShow">
        请选择地址
      </div>
      <div v-else>
        <div class="pohen">
          <span>{{ address.userName }}</span
          >&nbsp;<span>{{ address.phone }}</span>
        </div>
        <div class="text">
          <van-tag
            class="tag"
            type="danger"
            v-if="address.status"
            color="#EB6133"
            >默认</van-tag
          >&nbsp;
          <div class="site">{{ address.address }}</div>
        </div>
      </div>
    </van-cell>
    <!-- </div> -->
    <!-- 商品详情 -->
    <div class="order_top">
      <!-- 店铺名称 -->
      <div class="logo">
        <van-image
          width="0.64865rem"
          height="0.64865rem"
          style="border-radius: 50%; overflow: hidden"
          :src="require('@/assets/images/logo.png')"
        />
        <div class="store">
          {{ postStoreId.storeName }}
        </div>
      </div>
      <!-- 商品详情 -->
      <div class="card">
        <img :src="postStoreList.skuImg" />
        <div class="card_image">
          <div class="card_list">{{ postStoreList.goodsName }}</div>
          <van-tag color="#f2f2f2" text-color="#666" class="mb-2">{{
            postStoreList.skuName
          }}</van-tag>
          <div class="price text-price text-main">
            <span>{{ postStoreList.salePrice }}</span>
            <template v-if="postStoreList.integral > 0">
              <span class="text-xs">{{
                postStoreList.integralType | filterIntegralType
              }}</span>
              <span>{{ postStoreId.integral }}</span>
              <span class="text-xs">{{ $lance.getIntegralName() }}</span>
            </template>
            <span class="text-marketPrice">{{
              `¥ ${postStoreId.marketPrice}`
            }}</span>
          </div>
        </div>
      </div>
      <div class="stepper">
        <div class="ml-1">
          <span class="fs-14">数量：</span>
          <span class="fs-13 color-muted">{{
            `(限购 ${
              postStoreList.quota > postStoreList.goodsDataAmount
                ? postStoreList.goodsDataAmount
                : postStoreList.quota
            } 件)`
          }}</span>
        </div>
        <van-stepper
          :max="
            postStoreList.quota > postStoreList.goodsDataAmount
              ? postStoreList.goodsDataAmount
              : postStoreList.quota
          "
          disable-input
          integer
          min="1"
          class="mr-1"
          v-model="value"
        />
      </div>
      <van-field
        v-model="note"
        label="留言"
        input-align="right"
        placeholder="给卖家留言"
        label-class="color-muted3"
      />
    </div>
    <!-- 结算 -->
    <div class="order_buttom">
      <div>
        <div class="d-flex justify-content-between align-items-center">
          <div class="opmoney">商品金额</div>
          <div class="moneylists">
            <span class="fs-10">￥</span>
            <span>{{
              (postStoreList.salePrice * 1000 * (value * 10)) / 10000
            }}</span>
          </div>
        </div>
        <div
          v-if="postStoreId.actCode == 'mth_l3kra9zp'"
          class="d-flex justify-content-between align-items-center"
          @click="giftbag"
        >
          <div class="opmoney">礼券福袋</div>
          <div class="opacity">
            {{
              selectnum === 0
                ? `可使用${giftNumber}张礼券福袋`
                : `-￥${selectprice}`
            }}
            <van-icon name="arrow" color="#C1C1C1" size="14px" />
          </div>
        </div>
        <div
          class="d-flex justify-content-between align-items-center"
          v-if="postStoreId.integral > 0"
        >
          <div class="opmoney">
            {{ postStoreId.integralType === 0 ? '抵扣礼券' : '赠送礼券' }}
          </div>
          <div class="moneylists">
            <span class="fs-14">{{
              postStoreId.integralType === 0 ? '-&nbsp;' : '+&nbsp;'
            }}</span>
            <span>{{ postStoreId.integral * value }}</span>
            <span class="text-xs">{{ $lance.getIntegralName() }}</span>
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <div class="opmoneys">运费</div>
          <div class="moneylists">
            <span v-if="this.postStoreId.postage == 0" class="fs-14">包邮</span>
            <span v-else class="fs-14"
              >￥<span>{{ postStoreId.postage }}</span></span
            >
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <!-- <div >商品金额</div> -->
          <div class="opmoneyss">
            <div>
              <span class="fs-13 color-muted3">合计 : </span>
              <span class="fs-10 color-main">￥</span
              ><span
                v-if="postStoreId.actCode == 'mth_l3kra9zp' && !giftNumber"
                class="fs-14 color-main"
                >{{
                  allCount
                }}</span
              >
              <span v-else class="fs-14 color-main">{{
                allCount
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-submit-bar
      button-text="提交订单"
      button-color="linear-gradient(180deg, #F1722C 0%, #EB6133 100%)"
      @submit="onSubmit"
    >
      <template #default>
        <div class="but">
          <!-- <div class="order_txt">合计：</div> -->
          <div class="price text-price text-main fs-16 fw-700">
            <span v-if="postStoreId.actCode == 'mth_l3kra9zp'">{{
              allCount
            }}</span>
            <span v-else>{{
              allCount
            }}</span>
            <span v-if="selectnum !== 0" class="fs-13 ml-2 color-muted3"
              >已优惠<span class="fs-13 color-main">
                ￥{{ selectprice }}</span
              ></span
            >
            <template
              v-if="
                postStoreList.integral > 0 && postStoreList.integralType === 0
              "
            >
              <span class="text-xs">{{
                postStoreList.integralType | filterIntegralType
              }}</span>
              <span>{{ postStoreId.integral * value }}</span>
              <span class="text-xs">{{ $lance.getIntegralName() }}</span>
            </template>
          </div>
        </div>
      </template>
    </van-submit-bar>
  </div>
</template>

<script>
import Decimal from 'decimal.js-light'
export default {
  data () {
    return {
      // addressList: [],
      address: {},
      value: 0, // 购买数量
      postStoreId: '',
      isShow: false,
      postStoreList: {},
      note: '', // 留言
      quotas: '',
      addressPath: '',
      giftNumber: 0, // 可使用礼券数量
      selectprice: 0, // 礼券价格
      giftselectList: [],
      saleStoreId: '',
      supplierName: '',
      selectnum: 0, // 礼券福袋选中的礼券数量
      bsType: ''
    }
  },
  computed: {
    allCount: function () {
      if (this.postStoreList.salePrice !== null && this.postStoreId.postage !== null &&
      this.value !== null && this.selectprice !== null) {
        return new Decimal(this.postStoreList.salePrice)
          .mul(new Decimal(this.value)).add(new Decimal(this.postStoreId.postage))
          .sub(new Decimal(this.selectprice))
          .toFixed(2)
      }
      return null
    }
  },
  created () {
    this.getAddressList()
    this.getGiftUse()
    this.postStoreId = this.$lance.getJson('storeId')
    // console.log(22222, this.postStoreId)
    this.postStoreList = this.$lance.getJson('goodsList')
    this.value =
      this.$route.query.Numb === undefined ? 0 : this.$route.query.Numb * 1
    this.bsType = this.$route.query.bsType
    this.saleStoreId = this.$route.query.saleStoreId
    this.saleStoreName = this.$route.query.saleStoreName
    this.note = this.$route.query.note
    this.selectnum =
      this.$route.query.selectnum === undefined
        ? 0
        : this.$route.query.selectnum * 1 // 选择的礼券数量
    this.selectprice =
      this.$route.query.selectprice === undefined
        ? 0
        : this.$route.query.selectprice * 1
    this.giftselectList =
      this.$route.query.giftselectList === undefined
        ? []
        : this.$route.query.giftselectList
  },
  activated () {
    this.getAddressList()
    // this.getGiftUse()
  },
  beforeDestroy () {
    this.$lance.clearStorage('select_address')
  },
  methods: {
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
          if (this.selectnum > 0) {
            this.giftNumber = 0
          }
        }
      )
    },
    // 点击跳转礼券福袋
    giftbag () {
      this.$router.push({
        path: '/giftbag',
        query: {
          notes: this.note,
          bsType: this.bsType,
          Numb: this.value
        }
      })
    },
    // 获取用户地址
    getAddressList () {
      if (this.$lance.getJson('select_address')) {
        this.isShow = true
        return (this.address = this.$lance.getJson('select_address'))
      }
      this.$http.post(
        this.$apiUri.APP_ADDRESSLIST,
        null,
        res => {
          res.data.map(item => {
            if (item.status === 1) {
              this.address = item
            }
          })
          if (Object.keys(this.address).length === 0) {
            this.address = this.$lance.getJson('select_address')
              ? this.$lance.getJson('select_address')
              : {}
          }
          if (Object.keys(this.address).length > 0) {
            this.isShow = true
          }
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    // 跳转地址页面
    toaddress () {
      this.$router.push({
        path: '/site',
        query: {
          type: 'select'
        }
      })
    },
    // 返回
    // onClickLeft () {
    //   this.$router.push('/commodity')
    //    this.$baseUtils.goBack(-1)
    // },
    addpay () {
      console.log('bsType:', this.bsType)
      this.$http.post(
        this.$apiUri.APP_ORDERV,
        [
          {
            inviteCode: '',
            giftCodes: this.giftselectList,
            omsOrder: {
              bsType: this.bsType,
              storeId: this.postStoreId.storeId,
              storeName: this.postStoreId.storeName,
              saleStoreId: this.saleStoreId || null,
              saleStoreName: this.saleStoreId ? this.postStoreId.storeName : null,
              note: this.note,
              actCode: this.postStoreId.actCode,
              userName: this.address.phone
            },
            omsOrderAddress: {
              address: this.address.address,
              phone: this.address.phone,
              userName: this.address.userName
            },
            omsOrderDetail: {
              goodsId: this.postStoreId.id,
              goodsName: this.postStoreId.goodsName,
              goodsTitle: this.postStoreList.goodsTitle,
              goodsSkuId: this.postStoreList.id,
              goodsSkuIcon: this.postStoreList.skuImg,
              goodsSkuName: this.postStoreList.skuName,
              salePrice: this.postStoreList.salePrice,
              settlePrice: this.postStoreList.settlePrice,
              integralType: this.postStoreList.integralType,
              integral: this.postStoreList.integral,
              goodsNum: this.value,
              marketPrice: this.postStoreId.marketPrice
            }
          }
        ],
        res => {
          this.getAddressLists = res.data
          // this.$lance.setJson('aiipay_list', this.getAddressLists)
          if (res.data[0].omsOrder.status === 5) {
            return this.$toast(res.data[0].omsOrder.note)
          }
          if (this.$lance.getJson('select_address')) {
            this.$lance.clearStorage('select_address')
          }

          this.$router.push({
            path: '/aiipay',
            query: {
              orderNo: this.getAddressLists[0].omsOrder.orderNo,
              integralType: this.postStoreList.integralType
            }
          })
        }
      )
    },
    addpays () {
      this.$http.post(
        this.$apiUri.APP_ORDERV,
        [
          {
            inviteCode: '',
            giftCodes: this.giftCodes,

            omsOrder: {
              bsType: 'BS_A008',
              storeId: this.postStoreId.storeId,
              storeName: this.postStoreId.storeName,
              note: this.note,
              userName: this.address.phone
            },
            omsOrderAddress: {
              address: this.address.address,
              phone: this.address.phone,
              userName: this.address.userName
            },
            omsOrderDetail: {
              goodsId: this.postStoreId.id,
              goodsName: this.postStoreId.goodsName,
              goodsTitle: this.postStoreList.goodsTitle,
              goodsSkuId: this.postStoreList.id,
              goodsSkuIcon: this.postStoreList.skuImg,
              goodsSkuName: this.postStoreList.skuName,
              salePrice: this.postStoreList.salePrice,
              settlePrice: this.postStoreList.settlePrice,
              integralType: this.postStoreList.integralType,
              integral: this.postStoreList.integral,
              goodsNum: this.value,
              marketPrice: this.postStoreId.marketPrice
            }
          }
        ],
        res => {
          this.getAddressLists = res.data
          // this.$lance.setJson('aiipay_list', this.getAddressLists)
          // if (res.data[0].omsOrder.status === 5) {
          // return this.$toast(res.data[0].omsOrder.note)
          // }
          if (this.$lance.getJson('select_address')) {
            this.$lance.clearStorage('select_address')
          }

          this.$router.push({
            path: '/aiipay',
            query: {
              orderNo: this.getAddressLists[0].omsOrder.orderNo,
              integralType: this.postStoreList.integralType
            }
          })
        }
      )
    },
    // 提交订单跳转付款页面
    onSubmit () {
      if (this.isShow === false) {
        this.$toast('请填写地址')
        return
      }
      if (this.postStoreList.quota < this.value) {
        return this.$toast('购买数量大于限购数量，无法订购')
      }
      // if (this.goodsDataAmount < this.value) {
      //   this.$toast('购买数量大于商品数量，无法订购')
      //   return
      // }
      this.$http.post(
        this.$apiUri.APP_GRALGET,
        {},
        res => {
          console.log(12345, res)
          if (this.postStoreList.integralType === 0) {
            if (res.data.freeAmount < this.postStoreList.integral) {
              this.$toast('账号礼券不足')
              return
            }
          }
          // if (
          //   this.postStoreId.actCode === 'mth_l3kra9zp' &&
          //   this.giftNumber == 1
          // ) {
          //   this.addpays()
          // } else {
          //   this.addpay()
          // }
          this.addpay()
        },
        err => {
          this.$toast(err.message)
        }
      )
    }
  }
  // beforeRouteEnter (to, from, next) {
  //   console.log(from.name)//|| from.name === 'submitOrder'
  //   if (from.name === 'site') {
  //     next(vm => {
  //       vm.isBack = false
  //     })
  //   }
  //   next()
  // }
}
</script>

<style lang="less" scoped>
.opacity {
  height: 17px;
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 300;
  line-height: 17px;
  color: #eb6133;
  padding-right: 10px;
}
.but {
  width: 100%;
  display: flex;
  align-items: center;
  text-align: left;
}
.store {
  font-size: 14px;
  color: #333333;
  font-weight: 300;
  margin-left: 12px;
  margin-top: 5px;
}
.quantity {
  margin-left: 12px;
  margin-top: 5px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #333333;
  font-weight: 300;
}
/deep/.van-cell {
  padding: 10px 12px;
}
.van-button--info {
  width: 130px;
  height: 38px;
  margin-right: 14px;
  margin-top: 6px;
  margin-left: 10px;
  color: #fff;
  background-color: #eb6133;
  border: 1px solid #eb6133;
}
.card {
  display: flex;
  margin-top: 15px;
  margin-left: 15px;
  margin-bottom: 10px;
  color: #333333;
  img {
    width: 94px;
    height: 94px;
    border-radius: 4px;
  }
  .card_image {
    margin-left: 14px;
    margin-right: 14px;
    .card_list {
      margin-bottom: 10px;
      font-size: 14px;
      color: #333333;
      font-weight: 300;
    }
  }
}
.card_lists {
  color: #666666;
  text-indent: 5px;
  background: #f2f2f2;
  margin-bottom: 10px;
  font-size: 12px;
  color: #333333;
  border: 1px solid #f2f2f2;
  font-weight: 300;
}
.stepper {
  margin: 12px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ordertwo {
  width: 351px;
  height: 52px;
  margin: 12px;
  display: flex;
  background: #fff;
  opacity: 1;
  border-radius: 8px;
  color: #333333;
  font-size: 14px;
  line-height: 52px;
  padding-left: 14px;
}
.van-submit-bar__text[data-v-738c06f6] {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  padding-right: 0.32rem;
  color: #333333;
  text-align: left;
}
.opmoneys {
  margin: 14px 235px 16px 12px;
  font-size: 14px;
  color: #333333;
  font-weight: 300;
}

.order {
  width: 351px;
  margin: 12px;
  background: #fff;
  opacity: 1;
  border-radius: 8px;
  .pohen {
    height: 18px;
    font-size: 13px;
    font-weight: 300;
    line-height: 18px;
    color: #333333;
    opacity: 1;
    margin-left: 12px;
  }
  .text {
    // width: 275px;
    // height: 18px;
    // display: flex;
    font-size: 13px;
    font-weight: 300;
    line-height: 18px;
    margin-top: 10px;
    margin-left: 12px;
    color: #333333;
    // opacity: 1;
    // white-space: nowrap;
    // overflow: hidden;
    // text-overflow: ellipsis;
    .tag {
      float: left;
      margin-right: 2px;
      margin-top: 2px;
    }
    .site {
      float: left;
      max-width: 256px;
    }
  }
}
.order_top {
  width: 351px;
  margin: 12px;
  background: #fff;
  opacity: 1;
  border-radius: 8px;
  color: #333333;
  .logo {
    width: 100%;
    display: flex;
    padding-top: 8px;
    padding-left: 12px;
  }
}
.opmoneyss {
  width: 100%;
  font-size: 14px;
  margin: 12px;
  color: #333333;
  font-weight: 300;
  text-align: right;
}
// .opmoneys {
//   margin-bottom: 12px;
//   margin-top: 12px;
//   margin-left: 12px;
//   font-size: 14px;
//   color: #333333;
//   font-weight: 300;
// }
.order_buttom {
  width: 351px;
  margin-left: 12px;
  background: #fff;
  opacity: 1;
  border-radius: 8px;
  margin-bottom: 62px;
  .opmoney {
    margin-bottom: 12px;
    margin-top: 12px;
    margin-left: 12px;
    font-size: 14px;
    color: #333333;
    font-weight: 300;
  }
  .moneylists {
    // color: #eb6133;
    margin-right: 12px;
  }
}
.order_submit {
  width: 375px;
  height: 49px;
  display: flex;
  background: #ffffff;
  opacity: 1;
  position: fixed;
  bottom: 0;
  // padding-bottom: 20px;
}
.order_txt {
  width: 50px;
  margin-left: 12px;
  line-height: 49px;
  font-size: 14px;
  font-weight: 300;
  color: #333333;
}
</style>
