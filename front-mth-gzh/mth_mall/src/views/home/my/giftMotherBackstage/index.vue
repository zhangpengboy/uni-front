<!--
 * @Description : 礼券妈妈后台
-->
<template>
  <div class="giftMotherBackstage">
    <van-nav-bar
      :title="$route.meta.title"
      left-arrow
      fixed
      :border="false"
      placeholder
      @click-left="$router.back()"
    />
    <div class="top">
      <div class="top-bg color-white">
        <p class="fs-18">惠哥/姐</p>
        <p class="fs-13">做亲朋好友身边最专业的匠心产品代理商</p>
        <p class="fs-16"><span class="mr-3">新匠人</span><span class="mr-3">新人设</span><span class="mr-3">新品质</span><span>新生活</span></p>
      </div>
      <div class="top-but">
        <div class="title"> <div class="before"></div> <div>个人云创业权益</div>  <div class="after"></div> </div>
        <div class="d-flex justify-content-between text-center txt1">
          <div v-for="item in interests.slice(0,2)" :key="item.id">
            <img :src="item.img" alt="">
            <p class="fs-14 color-muted3 fw-700 my-1">{{ item.title }}</p>
            <p class="fs-13 color-light state">{{ item.state }}</p>
          </div>
        </div>
        <div class="d-flex justify-content-between text-center txt1">
          <div v-for="item in interests.slice(2)" :key="item.id">
            <img :src="item.img" alt="">
            <p class="fs-14 color-muted3 fw-700 my-1">{{ item.title }}</p>
            <p class="fs-13 color-light state">{{ item.state }}</p>
          </div>
        </div>
      </div>
      <div class="but" @click="onClickOpen">立即开通</div>
    </div>
    <div class="bot">
      <p class="title">选择个人云创业的理由</p>
      <div class="reason" v-for="(item,i) in reason" :key="i">
        <img :src="item.img" alt="">
        <div class="d-flex flex-column justify-content-center">
          <p class="fs-15 color-muted3 mb-1">{{ item.title }}</p>
          <p class="fs-13 color-light">{{ item.state }}</p>
        </div>
      </div>
    </div>
    <!-- 支付弹框 -->
    <van-overlay :show="open" @click="open = false">
      <div class="wrapper" @click.stop>
        <div class="dialog">
        <div class="dialog-title">
          <p>{{ isVIP === '0' ? '开通个人云创业' : '充值个人云创业' }}</p>
          <van-icon name="cross" size="12" color="#D5D5D5" class="icon" @click="open = false"/>
        </div>
        <div class="dialog-text">
          <p class="title">服务类型</p>
          <div class="type">{{ `${rechargeNum}元/年` }}</div>
          <div><span class="fu">应付</span> <span class="num">{{ `${rechargeNum}元` }}</span> </div>
        </div>
        <div class="dialog-but" @click="subPay">立即支付</div>
      </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['userInfo', 'userWeixinInfo'])
  },
  data () {
    return {
      open: false,
      isVIP: '0',
      rechargeNum: 365,
      orderNo: '',
      interests: [
        { id: 1, img: require('@/assets/images/my/giftMotherBackstage/2698@2x.png'), title: '专享低价', state: 'vip专享价' },
        { id: 2, img: require('@/assets/images/my/giftMotherBackstage/2699@2x.png'), title: '分享奖励', state: '分享商品赚取收益' },
        { id: 3, img: require('@/assets/images/my/giftMotherBackstage/2696@2x.png'), title: '赠送福袋', state: '价值365，送1+5个' },
        { id: 4, img: require('@/assets/images/my/giftMotherBackstage/2694@2x.png'), title: '专属培训', state: '平台定期提供个人ip打造' }
      ],
      reason: [
        { img: require('@/assets/images/my/giftMotherBackstage/2700@2x.png'), title: '精选匠心品牌，厂家直接授权代理', state: '没有中间商，把利润让给消费者' },
        { img: require('@/assets/images/my/giftMotherBackstage/2702@2x.png'), title: '一键开店，轻松管理店铺', state: '专业培训指导，轻松创业' },
        { img: require('@/assets/images/my/giftMotherBackstage/2703@2x.png'), title: '平台扶持，流量赋能', state: '智能后台、会员系统、聊天系统、真正实现线上、线下打通' },
        { img: require('@/assets/images/my/giftMotherBackstage/2707@2x.png'), title: '产品齐全，全场景覆盖', state: '享受平台提供营销技能' }
      ]
    }
  },
  created () {
    this.getDredge()
    this.getstoreGiftMotherpay()
  },
  methods: {
    // 是否开通礼券妈妈
    getDredge () {
      this.$http.post(this.$apiUri.APP_GIFTMOTHER_BYPHONE, { phone: this.userInfo.phone }, res => {
        if (res.data) {
          this.isVIP = res.data.giftMotherFlag
        }
      })
    },
    // 获取礼券妈妈开通支付金额
    getstoreGiftMotherpay () {
      this.$http.post(this.$apiUri.APP_GIFTMOTHER_MONEY, null, res => {
        if (res.data) {
          this.rechargeNum = res.data
        }
      })
    },
    // 打开支付弹框
    onClickOpen () {
      let obj = {
        payType: 3,
        amount: this.money,
        bsType: 'BS_A012'
      }
      this.$http.post(this.$apiUri.APP_DEPOSITADD_TOW, obj,
        res => {
          if (res.data.successful) {
            this.$router.push('giftMotherEnter')
          } else {
            this.open = true
            this.orderNo = res.data.orderNo
          }
        },
        err => {
          // 店铺审核中会走这里
          this.$toast(err.message)
        })
    },
    // 立即支付
    subPay () {
      let dataObj = {
        openId: this.userWeixinInfo.openid,
        orderNo: this.orderNo,
        payType: 3,
        bsType: 'BS_A012'
      }
      this.$http.post(this.$apiUri.APP_PAYADD, dataObj, res => {
        this.$wxApi.wxPay(
          res.data,
          () => {
            this.open = false
            // if (flag === 0) return this.$router.push('giftMotherEnter')
            // this.$router.push('giftMother')
            this.$router.push('giftMotherEnter')
          },
          () => {
            this.$toast('支付取消或失败,请重新支付')
          }
        )
      }, err => {
        this.$toast(err.message)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.giftMotherBackstage {
  height: 100%;
  .van-nav-bar__placeholder {
    /deep/ .van-nav-bar {
      // background-color: #fff0 !important;
      background: #414141;
      .van-icon {
        color: #FFF;
      }
      .van-nav-bar__title {
        color: #FFF;
      }
    }
  }
  img {
    width: 52px;
    height: 52px;
  }
  .top {
    height: 100%;
    background: #fff;
    margin-bottom: 12px;
    padding-bottom: 32px;
    &-bg {
      width: 375px;
      height: 180px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: url('~@/assets/images/my/giftMotherBackstage/27112@1x.png') no-repeat;
      background-size:100% 100%;
      padding: 48px 0 36px 24px;
    }
    &-but {
      .txt1 {
        margin: 0 42px 32px 42px;
      }
      .txt2 {
        margin: 0 30px 32px 30px;
      }
      .state {
        width: 115px;
      }
      .title {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        margin: 24px 0;
        text-align: center;
        color: #8B5B04;
        font-weight: 700;
        .before {
          width: 42px;
          height: 1px;
          background: #8B5B04;
          margin-right: 16px;
        }
        .after {
          width: 42px;
          height: 1px;
          background: #8B5B04;
          margin-left: 16px;
        }
      }

    }
    .but {
      width: 262px;
      height: 38px;
      font-size: 14px;
      color: #fff;
      text-align: center;
      line-height: 38px;
      background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
      border-radius: 41px;
    }
  }
  .bot {
    height: 100%;
    background: #fff;
    padding: 32px 16px;
    .title {
      // width: 180px;
      height: 28px;
      font-size: 20px;
      font-weight: 700;
      line-height: 28px;
      color: #333333;
      // margin: 0 auto;
      text-align: center;
    }
    .reason {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-top: 32px;
      img {
        margin-right: 20px;
      }
    }
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    .dialog {
      width: 300px;
      height: 284px;
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

      &-text {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        .title {
          height: 20px;
          font-size: 14px;
          font-weight: 300;
          line-height: 20px;
          color: #999999;
          margin-bottom: 12px;
        }
        .type {
          width: 104px;
          height: 56px;
          border: 1px solid #EB6133;
          border-radius: 8px;
          line-height: 56px;
          font-size: 16px;
          text-align: center;
          color: #EB6133;
          margin-bottom: 20px;
        }
        .fu {
          height: 28px;
          font-size: 16px;
          line-height: 28px;
          color: #666;
          font-weight: 700;
        }
        .num {
          height: 28px;
          font-size: 20px;
          line-height: 28px;
          color: #EB6133;
          font-weight: 700;
        }
      }

      &-but {
        width: 262px;
        height: 38px;
        font-size: 16px;
        background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
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
