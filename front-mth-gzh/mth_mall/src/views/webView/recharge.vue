<!-- 365礼包充值 -->
<template>
  <div class="giftBag">
    <van-cell-group>
      <van-cell center>
        <template #title>
          <div class="giftBag-userInfo">
            <van-image
              round
              width="40"
              height="40"
              :src="userWeixinInfo.headImgUrl"
            />
            <span class="giftBag-userInfo-phone">{{ userInfo.phone | filterPhone }}</span>
          </div>
        </template>
      </van-cell>
      <van-cell title="福袋数量" center is-link>
        <template #right-icon>
          <div class="giftBag-num">
            {{ pageList.giftAmount }}
            <span
              style="    font-size: 12px;
    font-weight: 500;
    margin-left: -0.08108rem;"
              >x</span
            ><span
              style="    font-size: 12px;
    font-weight: 500;
    margin-left: 0.05405rem;"
              >{{ pageList.giftNumAll }}</span
            >
          </div>
        </template>
      </van-cell>
    </van-cell-group>
    <br />
    <van-cell-group>
      <!-- <van-field
        v-if="userLevel == 'P0'"
        readonly
        clickable
        colon
        v-model="region"
        label="地区选择"
        placeholder="点击选择省市区"
        @click="showArea = true"
      /> -->
      <van-field
        v-model="region"
        :is-link="isLink"
        readonly
        label="地区选择"
        placeholder="点击选择省市区"
        input-align="right"
        @click="fieldValueShow"
      />
      <van-cell title="购买时长">{{ pageList.giftValidity }}天</van-cell>
      <van-cell title="应付金额" class="giftBag-money"
        >￥{{ pageList.payAmount }}</van-cell
      >
    </van-cell-group>
    <br />
    <div class="giftBag-pay">
      <p class="giftBag-pay-title">选择支付方式</p>
      <div class="giftBag-pay-way">
        <!-- <template v-for="(v, i) in payWay">
          <div
            class="giftBag-pay-way-details colorNO"
            :key="i"
            :class="{ colorOK: v.isActivate }"
            @click="selectPayWay(i)"
          >
            <img :src="v.icon" class="img" />
            <span>{{ v.name }}</span>
            <div
              v-show="v.isActivate"
              class="ok"
              :class="[v.name === '微信' ? 'wxOKClass' : 'zfbOKClass']"
            ></div>
            <img class="wxOKClass" src="@/assets/images/组 2684@2x.png" />
          </div>
        </template> -->
        <img
          :src="require('@/assets/images/exchange/wxPay_on@2x.png')"
          alt=""
        />
      </div>
    </div>
    <van-button
      color="linear-gradient(180deg, #F1722C 0%, #EB6133 100%)"
      block
      size="small"
      round
      @click="depositOrder"
      class="giftBag-pay-but"
      >立即支付</van-button
    >
    <!-- <van-popup v-model="showArea" position="bottom">
      <van-area
        :area-list="options"
        @confirm="onConfirm"
        @cancel="showArea = false"
      />
    </van-popup> -->
    <van-popup v-model="show" round position="bottom">
      <van-cascader
        v-model="cascaderValue"
        :options="options"
        @close="show = false"
        @finish="onFinish"
        :field-names="fieldNames"
      />
    </van-popup>
    <!-- <baidu-map id="map" @ready="handler" /> -->
  </div>
</template>

<script>
// import area from '@/utils/area.js'
// import { Cascader } from 'vant'

import city from '@/utils/city.json'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      payWay: [
        {
          icon: require('@/assets/images/exchange/weixin@1x.png'),
          name: '微信',
          isActivate: true
        }
        // {
        //   icon: require('@/assets/images/exchange/zfb@1x.png'),
        //   name: '支付宝',
        //   isActivate: false
        // },
      ],
      pageList: {},
      payInfo: {},
      region: null,
      // fieldValue: '',
      // showArea: false,
      options: null,
      userLevel: '',
      code: '',
      show: false,
      cascaderValue: '',
      fieldNames: {
        text: 'value',
        value: 'id',
        children: 'children'
      },
      mark: '',
      isLink: false,
      AreaArray: []
    }
  },

  computed: {
    ...mapState(['userWeixinInfo', 'userInfo'])
  },
  created () {
    this.gettopuser()
    this.giftConfig()
    // this.userInfo.phone = this.userInfo.phone.replace(
    //   this.userInfo.phone.substring(3, 7),
    //   '****'
    // )
    // this.storeArea()
    // this.getArea()
  },

  methods: {
    // 根据code反查地址
    getArea (code) {
      this.$http.post(
        this.$apiUri.APP_STOREAREA_GET,
        {
          code: code || this.$lance.getData('townCode')
        },
        res => {
          if (code) {
            this.region = this.AreaArray.map(fieldNames => {
              let name = ''
              let key = 0
              for (key in res.data) {
                if (fieldNames === key.toString()) {
                  name = res.data[key].name
                }
              }
              return name
            }).join('-')
          } else {
            this.region = _.values(res.data)
              .map(item => item.name)
              .join('-')
            this.mark = _.values(res.data)
              .map(item => item.id)
              .join(',')
          }
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    // 根据区域ID获取下级分类
    getAreaList (workId) {
      this.$http.post(
        this.$apiUri.APP_STOREAREA_LIST,
        {
          workId: workId
        },
        res => {
          console.log(res.data)
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    fieldValueShow () {
      if (this.isLink) {
        this.show = true
        this.options = city
      }
    },
    // 全部选项选择完毕后，会触发 finish 事件
    onFinish ({ selectedOptions }) {
      // console.log(selectedOptions)
      this.show = false
      this.region = selectedOptions
        .map(fieldNames => fieldNames.value)
        .join('-')
      this.mark = selectedOptions.map(item => item.id).join(',')
      console.log(this.mark)
    },
    // 判断用户级别
    gettopuser () {
      this.$http.post(
        this.$apiUri.APP_GETTOPUSER,
        {},
        res => {
          if (res.data.agentArea) {
            // 有值，反显上级的地址，并禁用地区选择
            this.mark = res.data.agentArea
            this.AreaArray = res.data.agentArea.split(',')
            // this.getAreaList(arr[0])
            // this.getAreaList(arr[1])
            // this.getAreaList(arr[2])
            this.getArea(this.AreaArray[this.AreaArray.length - 1])
            this.isLink = false
          } else {
            // 空值，反显定位地址，并可以选择地区
            this.getArea()
            this.isLink = true
          }
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    // 获取礼包总配置列表
    giftConfig () {
      this.$http.post(this.$apiUri.APP_PAGELISTFIG, {}, res => {
        this.pageList = res.data.list[0]
      })
    },
    // 切换支付方式
    selectPayWay (row) {
      // console.log(row)
      this.payWay.forEach((item, index) => {
        item.isActivate = false
        if (row === index) {
          item.isActivate = true
        }
      })
    },
    depositOrder () {
      this.$http.post(
        this.$apiUri.APP_DEPOSITADD_TOW,
        {
          payType: 3,
          mark: this.mark,
          amount: this.pageList.payAmount,
          bsType: 'BS_A007'
        },
        res => {
          // console.log(22222, this.payInfo)
          this.payInfo = res.data
          this.payment()
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    payAdd () {
      this.$http.post(
        this.$apiUri.APP_PAYADD,
        {
          payType: 3,
          openId: this.userWeixinInfo.openid,
          orderNo: this.payInfo.orderNo,
          mark: this.mark,
          bsType: 'BS_A007'
        },
        res => {
          // console.log(res)
          this.$wxApi.wxPay(
            res.data,
            res => {
              this.$lance.setData('salePrice', this.pageList.payAmount)
              this.$router.push({
                path: '/accomplish',
                query: {
                  bsType: 'BS_A007'
                }
              })
            },
            err => {
              console.log(err)
              this.$toast('支付失败')
              // this.$router.push('/orderList')
            }
          )
        }
      )
    },
    // 支付
    payment () {
      // this.userLevel == 'P0'
      if (!this.region) {
        return this.$toast('地区不能为空')
      }
      return this.payAdd()
    }
  }
}
</script>

<style lang="less" scoped>
.giftBag {
  .van-cell__title {
    font-size: 14px;
    color: #666;
  }
  &-userInfo {
    display: flex;
    align-items: center;
    color: #666;
    &-phone {
      font-size: 15px;
      margin-left: 12px;
    }
  }
  &-num {
    width: 78px;
    height: 38px;
    font-size: 16px;
    line-height: 38px;
    text-align: center;
    background: url('~@/assets/images/exchange/gift@1x.png') no-repeat
      center/100%;
    color: #8a6824;
    font-weight: 700;
  }
  &-num::before {
    content: '¥';
    font-size: 70%;
    margin-right: 2px;
    font-weight: 300;
  }
  // &-num::after {
  //   content: 'x';
  //   font-size: 70%;
  //   margin-right: 2px;
  //   font-weight: 300;
  // }
  &-money {
    font-size: 16px;
    font-weight: 700;
  }
  &-pay {
    background-color: #fff;
    &-title {
      font-size: 14px;
      color: #666;
      padding: 14px;
    }
    &-way {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 23px;
      margin-left: 14px;
      padding-bottom: 23px;
      img {
        width: 132px;
        height: 64px;
      }
      &-details {
        // display: flex;
        // justify-content: center;
        // align-items: center;
        position: relative;
        width: 132px;
        height: 64px;
        border-radius: 8px;
        .img {
          position: relative;
          left: 26px;
          top: 16px;
        }
        span {
          position: relative;
          left: 26px;
          top: 10px;
          font-size: 14px;
          margin-left: 14px;
          color: #666;
        }
        .ok {
          width: 0;
          height: 0;
          border: 15px solid #eb6132;
          border-left: 15px solid transparent;
          border-top: 15px solid transparent;
          border-bottom-right-radius: 8px;
        }
        .wxOKClass {
          position: relative;
          left: 30px;
          width: 28px;
          height: 28px;
          bottom: -35px;
        }
        .zfbOKClass {
          position: relative;
          left: 14px;
          bottom: -17px;
        }
        .okimg {
          width: 14px;
          height: 10px;
        }
        .wxIconOKClass {
          position: relative;
          left: 114px;
          bottom: 15px;
        }
        .zfbIconOKClass {
          position: relative;
          left: 0px;
          bottom: -22px;
        }
      }
      .colorNO {
        border: 1px solid #999;
      }
      .colorOK {
        border: 1px solid #eb6132;
      }
      // &-details:first-child {
      //   margin-right: 38px;
      // }
    }
    &-but {
      width: 262px;
      margin: 0 auto;
    }
  }
}
</style>
