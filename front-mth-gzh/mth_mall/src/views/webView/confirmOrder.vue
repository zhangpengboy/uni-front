<template>
  <div>
    <div class="pickway">
      <div class="distribution" :class="{wayStyle: wayIndex == 0}" @click="storeWay">
        店家配送
      </div>
      <div class="sincelift" :class="{wayStyle: wayIndex == 1}" @click="userWay">
        到店自取
      </div>
    </div>
    <van-cell :is-link='!wayIndex' class="order" center>
      <div @click="toaddress" v-if="wayIndex == 0">
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
      </div>
      <div class="right" v-if="wayIndex == 1" v-clipboard:copy="storeAddress"
              v-clipboard:success="spanPaste">
        <div class="">
          <div class="text">
            <div class="site">
              {{ storeAddress }}
            </div>
          </div>
        </div>
        <div style="color: #C1C1C1;">
        </div>
      </div>
    </van-cell>
    <van-cell class="order">
      <div class="wayrow" v-if="wayIndex == 0">
        <div class="nominal">立即送出</div>
        <div class="waycintent">
          <span>大约{{ $lance.parseTime(new Date().getTime() + 60*60*1000, '{h}:{i}') }}送达</span>
          <div class="cuIcon-right"></div>
        </div>
      </div>
      <div class="wayrow" v-if="wayIndex == 1">
				<div class="nominal">预留电话</div>
				<div class="waycintent">
					<input type="text" v-model="phone" />
					<div class="">
            <van-image
              width=".373333rem"
              height=".373333rem"
              style="margin-left:10px"
              :src="require('@/assets/images/edit.png')"
            />
					</div>
				</div>
			</div>
			<div class="wayrow">
				<div class="nominal">支付方式</div>
				<div class="waycintent">
					<span>微信支付</span>
					<div class="cuIcon-right"></div>
				</div>
			</div>
    </van-cell>
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
          {{ postStoreList[0].storeName }}
        </div>
      </div>
      <!-- 商品详情 -->
      <div class="card" v-for="(item,index) in postStoreList" :key="index">
        <img :src="item.goodsIcon" />
        <div class="card_image">
          <div class="card_list" style="height：1.875rem">{{ item.goodsName }}</div>
          <div color="#f2f2f2" text-color="#666" class="mb-2 card_num">× {{
            item.stockQtysss
          }}</div>
        </div>
        <div class="card_price price text-price text-main">
          <span>{{ (item.salePrice * item.stockQtysss).toFixed(2) }}</span>
          <!-- <template v-if="postStoreList.integral > 0">
            <span class="text-xs">{{
              postStoreList.integralType | filterIntegralType
            }}</span>
            <span>{{ postStoreId.integral }}</span>
            <span class="text-xs">{{ $lance.getIntegralName() }}</span>
          </template>
          <span class="text-marketPrice">{{
            `¥ ${postStoreId.marketPrice}`
          }}</span> -->
        </div>
      </div>
    </div>
    <!-- 结算 -->
    <div class="order_buttom">
      <div>
         <div class="d-flex justify-content-between align-items-center">
          <van-field
            class="opmoneysNote"
            v-model="note"
            label="留言"
            input-align="right"
            placeholder="给卖家留言"
            label-class="color-muted3"
          />
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <div class="opmoney">商品金额</div>
          <div class="moneylists">
            <span class="fs-10">￥</span>
            <span>{{
              sumObj.amount
            }}</span>
          </div>
        </div>
        <div
          class="d-flex justify-content-between align-items-center"
        >
          <div class="opmoney">
            {{ sumObj.integral >= 0 ? '赠送礼券' : '抵扣礼券' }}
          </div>
          <div class="moneylists">
            <span class="fs-14">{{
              sumObj.integral >= 0 ? '+&nbsp;' : ''
            }}</span>
            <span>{{ sumObj.integral }}</span>
            <span class="text-xs">{{ $lance.getIntegralName() }}</span>
          </div>
        </div>
        <!-- <div class="d-flex justify-content-between align-items-center">
          <div class="opmoneys">运费</div>
          <div class="moneylists">
            <span v-if="this.postStoreId.postage == 0" class="fs-14">包邮</span>
            <span v-else class="fs-14"
              >￥<span>{{ postStoreId.postage }}</span></span
            >
          </div>
        </div> -->
        <div class="d-flex justify-content-between align-items-center">
          <!-- <div >商品金额</div> -->
          <div class="opmoneyss">
            <div>
              <span class="fs-13 color-muted3">合计 : </span>
              <span class="fs-10 color-main">￥</span
              >
              <span class="fs-14 color-main">{{
                sumObj.amount
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-submit-bar
      button-text="提交订单"
      button-color="linear-gradient(180deg, #F1722C 0%, #EB6133 100%)"
      @submit="addpay"
    >
      <!-- <template #default>
        <div class="but">
          <div class="price text-price text-main fs-16 fw-700">
            <span>{{
              sumObj.amount
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
      </template> -->
    </van-submit-bar>
  </div>
</template>

<script>
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
      bsType: '',
      wayIndex: 0,
      storeAddress: '',
      phone: '',
      sumObj: {
        amount: 0,
        integral: 0
      }
    }
  },
  created () {
    this.phone = this.$lance.getJson('userInfo').phone
    // this.postStoreId = this.$lance.getJson('storeId')
    this.postStoreList = this.$lance.getJson('buy_storeGoods')
    this.getAddressList()
    this.getstoreinfoDetail()
    this.sumAmount()
  },
  activated () {
    this.getAddressList()
    // this.getGiftUse()
  },
  beforeDestroy () {
    this.$lance.clearStorage('select_address')
  },
  methods: {
    // 总价格， 总积分
    sumAmount () {
      this.postStoreList.map(item => {
        if (item.integralType == 0) {
          this.sumObj.integral -= item.integral * item.stockQtysss
        } else {
          this.sumObj.integral += item.integral * item.stockQtysss
        }
        this.sumObj.amount += item.salePrice * item.stockQtysss
        this.sumObj.amount.toFixed(2)
      })
    },
    storeWay () {
      this.wayIndex = 0
    },
    userWay () {
      this.wayIndex = 1
    },
    // 获取商家地址
    getstoreinfoDetail () {
      this.$http.post(
        this.$apiUri.APP_STORE_INFO_DETAIL,
        {
          storeId: this.postStoreList[0].storeId
        },
        res => {
          this.storeAddress = res.data.area1Name + ' ' + res.data.area2Name + ' ' + res.data.area3Name + ' ' + res.data.storeAddress
        }
      )
    },
    spanPaste () {
      this.$toast('复制成功')
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
    addpay () {
      const that = this
      const orderList = []
      if (this.isShow === false) {
        this.$toast('请填写地址')
        return
      }
      // 组装数据
      _.map(that.postStoreList, v => {
        let omsStreetOrder = {
          // actCode: that.actCode,
          storeId: v.storeId,
          storeName: v.storeName,
          bsType: 'BS_A014',
          integral: v.integral,
          integralType: v.integralType,
          address: that.wayIndex == 0 ? that.address.address : '',
          note: that.note,
          receivingWay: that.wayIndex,
          userPhone: that.phone,
          userName: that.address.userName
        }
        let omsStreetOrderDetail = {
          goodsId: v.id,
          goodsImg: v.goodsIcon,
          goodsName: v.goodsName,
          goodsType: 0,
          integralType: v.integralType,
          integral: v.integral,
          goodsNum: v.stockQtysss,
          marketPrice: v.marketPrice,
          salePrice: v.salePrice,
          settlePrice: v.settlePrice
          // remark: that.note,
        }
        // const omsOrderAddress = {
        // phone: that.recinfo.phone,
        // userName: that.recinfo.userName,
        // address: that.recinfo.address
        // }
        orderList.push({
          omsStreetOrder,
          omsStreetOrderDetail
          // omsOrderAddress
        })
      })
      this.$http.post(
        this.$apiUri.APP_STORE_ORDER_ADD,
        orderList,
        res => {
          this.getAddressLists = res.data
          if (res.data[0].omsStreetOrder.status === 5) {
            return this.$toast(res.data[0].omsStreetOrder.note)
          }
          if (this.$lance.getJson('select_address')) {
            this.$lance.clearStorage('select_address')
          }
          let query = {}
          if (this.getAddressLists[0].omsStreetOrder.orderParent) {
            query.parentNo = this.getAddressLists[0].omsStreetOrder.orderParent
          } else {
            query.orderNo = this.getAddressLists[0].omsStreetOrder.orderNo
          }
          this.$router.push({
            path: '/storeGoodsPay',
            query
          })
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
.pickway {
  display: flex;
  margin: 0 12px 0px;
  .distribution {
    width: 175px;
    height: 48px;
    font-size: 14px;
    line-height: 48px;
    text-align: center;
    background: #fff;
    color: #666666;
    // border-radius: 8px 0px 8px 0px;
  }

  .sincelift {
    width: 175px;
    height: 48px;
    font-size: 14px;
    line-height: 48px;
    text-align: center;
    background: #fff;
    color: #666666;
    border-radius: 8px 0px 8px 0px;
  }

  .wayStyle {
    background: #FFEEE8;
    font-size: 16px;
    font-weight: 500;
    color: #EB6133;
  }
}
.wayrow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 12px;

  .nominal {
    font-size: 13px;
    font-weight: 500;
    color: #333333;
  }

  .waycintent {
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: 500;
    color: #EB6133;

    text {
      margin-right: 12px;
    }

    input {
      margin-right: 12px;
      text-align: right;
    }

    view {
      color: #c1c1c1;
    }
  }
}
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
    width: 72px;
    height: 72px;
    border-radius: 4px;
  }
  .card_image {
    margin-left: 12px;
    margin-right: 12px;
    .card_list {
      width: 150px;
      // height: 34px;
      margin-bottom: 10px;
      font-size: 14px;
      color: #333333;
      font-weight: 300;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .card_num {
      margin-top: 16px;
    }
  }
  .card_price {
      width: 80px;
      text-align: right;
      margin-right: 8px;
      // span {
      //   text-align: center;
      // }
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
.opmoneysNote {
  font-size: 14px;
  color: #333333;
  font-weight: 300;
}
.order {
  width: 351px;
  margin: 0px 12px 0px 12px;
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
