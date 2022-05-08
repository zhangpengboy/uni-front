<template>
  <div class="giftMother">
    <van-nav-bar
      :title="$route.meta.title"
      left-arrow
      fixed
      :border="false"
      placeholder
      @click-left="$router.back()"
    />
    <div class="user" @click="goBackstage">
      <img
        :src="headPic ? headPic : require('@/assets/images/logo.png')"
        class="img"
      />
      <div class="content">
        <div class="top">
          <div class="username">
            <span>{{ nickname }}</span>
          </div>
          <div class="flag">
            <!-- <div v-if="isVIP === '0'" class="usertype">普通用户</div> -->
            <img
              src="@/assets/images/my/giftMotherBackstage/gift_vip@2x.png"
              class="vip"
            />
            <div class="profession">
              <img
                src="@/assets/images/my/giftMotherBackstage/profession@2x.png"
              />
              <div class="storeCategoryName">{{ storeCategoryName }}</div>
            </div>
            <img
              :src="
                storeSex === '惠哥'
                  ? require('@/assets/images/my/giftMotherBackstage/man@2x.png')
                  : require('@/assets/images/my/giftMotherBackstage/woman@2x.png')
              "
              class="storeSex"
            />
          </div>
        </div>
        <!-- <div class="bot" @click="goBackstage">
          <span class="backstage">礼券妈妈后台</span>
          <van-icon name="arrow" color="#FFF2D6" size="14"/>
        </div> -->
      </div>
    </div>
    <div class="inform">
      <div class="left">
        <!-- <div v-if="isVIP === '0'">开通礼券妈妈</div> -->
        <div class="d-flex align-items-center">
          <!-- <van-icon name="volume" color="#fff" /> -->
          <img src="@/assets/images/my/volume@2x.png" class="img" />
          <span class="ml-1">{{ `${time}到期` }}</span>
        </div>
      </div>
      <!-- <div class="right" @click="open=true">{{ isVIP === '0' ? '立即开通' : '立即续费' }}</div> -->
      <div class="right" @click="onClickOpen">立即续费</div>
    </div>
    <!-- 商品 -->
    <div class="goods">
      <van-list
        v-if="dataOK || homeList.length > 0"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="dateil">
          <div
            class="boxlist"
            v-for="(item, index) in homeList"
            :key="index"
            @click="toGoods(item)"
          >
            <div class="images">
              <img
                width="100%"
                height="100%"
                :src="item.goods.goodsIcon"
                class="img"
              />
              <div class="text">
                {{ item.goods.goodsName }}
              </div>
              <div class="forson">
                <span>{{ item.goods.goodsTitle }}</span>
              </div>
              <div class="ml-1 price text-price text-main">
                <span>{{ item.goods.salePrice }}</span>
                <template v-if="item.goods.integral > 0">
                  <span class="text-xs">{{
                    item.goods.integralType | filterIntegralType
                  }}</span>
                  <span>{{ item.goods.integral }}</span>
                  <span class="text-xs">{{ $lance.getIntegralName() }}</span>
                </template>
                <span class="text-marketPrice">{{
                  `¥ ${item.goods.marketPrice}`
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </van-list>
      <van-empty
        v-else
        class="custom-image"
        :image="require('@/assets/images/empty/no_goods@2x.png')"
        description="还没有商品哦~"
      />
    </div>
    <!-- 充值弹框 -->
    <!-- <van-dialog v-model="open" :title="isVIP === '0' ? '开通礼券妈妈' : '充值礼券妈妈'" theme='round-button' >
      <div class="dialog">
        <p class="title">服务类型</p>
        <div class="type">{{ `${rechargeNum}元/年` }}</div>
        <div><span class="fu">应付</span> <span class="num">{{ `${rechargeNum}元` }}</span> </div>
      </div>
    </van-dialog> -->
    <van-overlay :show="open" @click="open = false">
      <div class="wrapper" @click.stop>
        <div class="dialog">
          <div class="dialog-title">
            <p>{{ isVIP === "0" ? "开通个人云创业" : "充值个人云创业" }}</p>
            <van-icon
              name="cross"
              size="12"
              color="#D5D5D5"
              class="icon"
              @click="open = false"
            />
          </div>
          <div class="dialog-text">
            <p class="title">服务类型</p>
            <div class="type">{{ `${rechargeNum}元/年` }}</div>
            <div>
              <span class="fu">应付</span>
              <span class="num">{{ `${rechargeNum}元` }}</span>
            </div>
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
      isVIP: '0',
      nickname: '', // 名称
      storeCategoryName: '', // 类目
      storeSex: '', // 惠哥，惠姐
      time: '',
      headPic: '', // 头像
      dataOK: true,
      open: false,
      homeList: [],
      loading: false,
      finished: false,
      orderNo: '',
      rechargeNum: 365, // 支付金额
      queryParams: {
        storeId: '',
        pageNum: 1,
        pageSize: 10
      },
      storeId: ''
    }
  },
  created () {
    // this.isVIP = this.$route.query.data
    // if (this.$route.query.data) {
    //   this.isVIP = this.$route.query.data.giftMotherFlag
    //   this.headPic = this.$route.query.data.headPic
    //   this.time = this.$lance.parseTime(this.$route.query.data.motherEndTime, '{y}-{m}-{d}')
    //   this.nickname = this.$route.query.data.storeName
    //   this.queryParams.storeId = this.$route.query.data.storeId
    // } else {
    //   this.getDredge()
    // }
    this.getDredge()
    this.getstoreGiftMotherpay()
  },
  methods: {
    // 获取开通礼券妈妈信息
    getDredge () {
      this.$http.post(
        this.$apiUri.APP_GIFTMOTHER_BYPHONE,
        { phone: this.userInfo.phone },
        (res) => {
          if (res.data) {
            // console.log(res)
            this.isVIP = res.data.giftMotherFlag
            this.headPic = res.data.headPic
            this.time = this.$lance.parseTime(
              res.data.motherEndTime,
              '{y}-{m}-{d}'
            )
            const name = res.data.storeName.split('-')
            this.storeCategoryName = name[0]
            this.nickname = name[1]
            this.storeSex = name[2]
            this.storeId = res.data.storeId
            this.onLoad()
          }
        }
      )
    },
    // 获取礼券妈妈开通支付金额
    getstoreGiftMotherpay () {
      this.$http.post(this.$apiUri.APP_GIFTMOTHER_MONEY, null, (res) => {
        if (res.data) {
          this.rechargeNum = res.data
        }
      })
    },
    // 跳转礼券妈妈后台
    goBackstage () {
      this.$router.push({
        path: '/giftMotherBackstage'
        // query: {
        //   storeId: this.columns[index].id
        // }
      })
    },
    onLoad () {
      if (this.storeId) {
        this.loading = true
        this.queryParams.storeId = this.storeId
        this.$http.post(
          this.$apiUri.APP_GIFTMOTHER_GOODSLIST,
          this.queryParams,
          (res) => {
            if (this.finished) return
            this.dataOK = false
            this.homeList = _.concat(this.homeList, res.data.list)
            this.loading = false
            if (
              res.data.totalPage === 0 ||
              res.data.totalPage === this.queryParams.pageNum
            ) {
              this.finished = true
              return
            }
            this.queryParams.pageNum++
          },
          (err) => {
            this.loading = false
            this.dataOK = true
            this.finished = true
            this.$toast(err.message)
          }
        )
      }
    },
    toGoods (item) {
      // console.log(item)
      // this.$lance.setData('saleStoreId', item.storeId)
      this.$router.push({
        path: '/commodity',
        query: {
          bsType: item.bsType,
          uuid: item.uuid,
          isFlag: 'giftMother'
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
          if (!res.data.successful) {
            this.open = true
            this.orderNo = res.data.orderNo
          }
        },
        err => {
          // vip未过期继续充值会走这里
          this.$toast(err.message)
        })
    },
    // 立即支付-充值续费
    subPay () {
      let dataObj = {
        openId: this.userWeixinInfo.openid,
        orderNo: this.orderNo,
        payType: 3,
        bsType: 'BS_A012'
      }
      this.$http.post(
        this.$apiUri.APP_PAYADD,
        dataObj,
        (res) => {
          this.$wxApi.wxPay(
            res.data,
            (res) => {
              this.open = false
              // if (flag === 0) return this.$router.push('giftMotherEnter')
              this.getDredge()
            },
            () => {
              this.$toast('支付取消或失败,请重新支付')
            }
          )
        },
        (err) => {
          this.$toast(err.message)
        }
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.giftMother {
  height: 100%;
  .van-nav-bar__placeholder {
    /deep/ .van-nav-bar {
      // background-color: #fff0 !important;
      background: linear-gradient(90deg, #e8cb8e 0%, #d1a068 100%);
      .van-icon {
        color: #fff;
      }
      .van-nav-bar__title {
        color: #fff;
      }
    }
  }
  // 空状态
  .custom-image {
    margin-top: 50px;
  }
  .user {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: linear-gradient(90deg, #e8cb8e 0%, #d1a068 100%);
    padding: 24px 12px;
    .img {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 12px;
    }
    .content {
      display: flex;
      flex-direction: column;
      align-content: center;
      .top {
        display: flex;
        flex-direction: column;
        align-content: center;
        margin-bottom: 7px;
        .username {
          max-width: 250px;
          color: #fff2d6;
          font-size: 18px;
          font-weight: 700;
          display: inline-block;
          overflow: hidden; //超出的文本隐藏
          text-overflow: ellipsis; //溢出用省略号显示
          white-space: nowrap; //溢出不换行
          margin-bottom: 5px;
        }
        .usertype {
          width: 66px;
          height: 20px;
          color: #8b5b04;
          font-size: 10px;
          font-weight: 300;
          border-radius: 9px;
          background: #ffe8c3;
          text-align: center;
          line-height: 20px;
          // margin: 0px 4px;
        }
        .flag {
          display: flex;
          align-items: center;
          .vip {
            width: 66px;
            height: 20px;
            margin-right: 8px;
          }
          .profession {
            display: flex;
            align-items: center;
            img {
              width: 18px;
              height: 18px;
              margin-right: -10px;
              z-index: 100;
            }
            .storeCategoryName {
              max-width: 120px;
              height: 18px;
              font-size: 10px;
              line-height: 18px;
              background: linear-gradient(180deg, #FC9840 0%, #F15F2D 100%);
              border-radius: 0px 9px 9px 0px;
              padding: 0 10px;
              color: #fff;
              margin-right: 8px;
              display: inline-block;
              overflow: hidden; //超出的文本隐藏
              text-overflow: ellipsis; //溢出用省略号显示
              white-space: nowrap; //溢出不换行
            }
          }
          .storeSex {
            width: 46px;
            height: 20px;
          }
        }
      }
      .bot {
        display: flex;
        align-items: center;

        .backstage {
          font-size: 14px;
          color: #fff2d6;
          margin-right: 6px;
        }
      }
    }
  }
  .inform {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 52px;
    font-size: 14px;
    padding: 0 12px;
    background: linear-gradient(85deg, #ebd4a3 0%, #d1a068 100%);
    .left {
      color: #fff;
      .img {
        width: 20px;
        height: 20px;
      }
    }
    .right {
      width: 80px;
      height: 28px;
      background: #d1a068;
      border: 1px solid #fff2d6;
      opacity: 1;
      border-radius: 85px;
      line-height: 28px;
      text-align: center;
      font-size: 14px;
      color: #fff2d6;
    }
  }
  .goods {
    padding: 12px;
    .dateil {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .boxlist {
        width: 170px;
        height: 270px;
        background: #ffffff;
        box-shadow: 0px 1px 1px #efefef;
        opacity: 1;
        border-radius: 8px;
        margin: 8px 0 4px 0;
        .images {
          width: 170px;
          height: 170px;
          .img {
            border-radius: 8px 8px 0 0;
            overflow: hidden;
          }
          .forson {
            font-size: 12px;
            font-weight: 300;
            line-height: 17px;
            color: #999999;
            opacity: 1;
            margin-top: 5px;
            text-indent: 5px;
            margin-bottom: 5px;
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-wrap: break-word;
            white-space: normal !important;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
          }
          .text {
            width: 100%;
            padding-left: 5px;
            margin-top: 8px;
            font-size: 13px;
            font-weight: 300;
            color: #333333;
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-wrap: break-word;
            white-space: normal !important;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
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
          border: 1px solid #eb6133;
          border-radius: 8px;
          line-height: 56px;
          font-size: 16px;
          text-align: center;
          color: #eb6133;
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
          color: #eb6133;
          font-weight: 700;
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
