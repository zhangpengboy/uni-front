<!-- 我的 -->
<template>
  <div class="user">
    <!-- 用户信息 -->
    <div class="user-header">
      <div class="user-header-top">
        <div class="left">
          <div class="avatar" @click="toPage('/userInfo')">
            <img
              :src="
                userWeixinInfo.headImgUrl
                  ? userWeixinInfo.headImgUrl
                  : require('@/assets/images/logo.png')
              "
              alt=""
              class="avatar"
            />
          </div>
          <div class="content">
            <div class="top">
              <div class="username">
                <!-- <span>{{ 'userWeixinInfo.nickname' }}</span> -->
                <span>{{ userWeixinInfo.nickname }}</span>
              </div>
              <div v-if="isVIP === '0'" class="usertype">普通用户</div>
              <img v-else src="@/assets/images/my/vip@2x.png" class="vip" />
            </div>

            <div class="invite-code">
              <span>邀请码：{{ userInviteCode }}</span>
            </div>
            <span
              class="copy"
              v-clipboard:copy="userInviteCode"
              v-clipboard:success="spanPaste"
              >复制</span
            >
          </div>
        </div>
        <div class="right span-white" @click="toPage('/myQR')">
          <img
            class="icon"
            src="@/assets/images/my/icon_share@2x.png"
            mode=""
          />
        </div>
        <!-- <div style="margin-top: 20px;">邀请码</div> -->
      </div>
      <div class="user-header-bottom">
        <!-- <div class="tag">关注 <span class="padding-left-sm">{{ favorStores }}</span></div>
				<div class="line"></div>
				<div class="tag" @tap="toPage('/sub/goods/favorite/favorite')">收藏 <span
						class="padding-left-sm">{{ favorGoods }}</span></div> -->
        <div class="focusOn" @click="toPage('/storeList')">
          <div class="">{{ favorStores }}</div>
          <div class="">店铺关注</div>
        </div>
        <div class="collection" @click="toPage('/favorite')">
          <div class="">{{ favorGoods }}</div>
          <div class="">商品收藏</div>
        </div>
        <!-- <div class="browse">
					<div class="">5</div>
					<div class="">浏览记录</div>
				</div> -->
      </div>
    </div>

    <!-- 主体 -->
    <div class="user-content">
      <div class="user-content-money">
        <div class="user-content-money__item" @click="toPage('/wallet')">
          <div class="box">
            <div class="num">{{ userMoney }}</div>
            <div class="span">红包（元）</div>
          </div>
          <img src="@/assets/images/my/money-icon1@2x.png" class="img" />
        </div>
        <div class="line"></div>
        <div class="user-content-money__item" @click="toPage('/giftCer')">
          <div class="box">
            <div class="num">{{ userIntegral }}</div>
            <div class="span">{{ $lance.getIntegralName() }}（个）</div>
          </div>
          <img src="@/assets/images/my/money-icon2@2x.png" class="img" />
        </div>
      </div>

      <!-- 占位  -->
      <div class="user-palce"></div>

      <!-- 我的订单 -->
      <div class="user-wrap">
        <div>
          <van-cell
            title="我的订单"
            is-link
            value="全部订单"
            to="/orderList"
            :border="false"
          />
          <van-grid :border="false">
            <van-grid-item
              v-for="(v, i) in mybarList"
              :key="i"
              @click="toPage(v.url, v.code)"
              :icon="v.icon"
              :text="v.text"
            />
          </van-grid>
        </div>
      </div>
      <div class="user-wrap">
        <div class="user-wrap-title">我的服务</div>
        <van-grid :border="false" :column-num="5">
          <template v-for="(v, i) in myServiceList">
            <van-grid-item
              v-if="v.type === 'to'"
              :key="i"
              :to="v.url"
              :icon="v.icon"
              :text="v.text"
            />

            <van-grid-item
              v-else-if="v.gift"
              :key="i"
              @click="show = true"
              :icon="v.icon"
              :text="v.text"
            />
            <van-grid-item
              v-else-if="v.giftMother"
              :key="i"
              @click="toPageGiftMother"
              :icon="v.icon"
              :text="v.text"
            />
            <van-grid-item
              v-else-if="v.login"
              :key="i"
              @click="toLogin"
              :icon="v.icon"
              :text="v.text"
            />
            <van-grid-item
              v-else-if="v.flag"
              :key="i"
              @click="flagClick"
              :icon="v.icon"
              :text="v.text"
            />
            <van-grid-item
              v-else-if="v.agent"
              :key="i"
              @click="clickAgent"
              :icon="v.icon"
              :text="v.text"
            />
            <van-grid-item
              v-else-if="v.team"
              :key="i"
              @click="clickTeam"
              :icon="v.icon"
              :text="v.text"
            />
            <van-grid-item
              v-else
              :key="i"
              :url="v.url"
              :icon="v.icon"
              :text="v.text"
            />
          </template>
        </van-grid>
      </div>
    </div>
    <van-popup v-model="showPicker" round position="bottom">
      <van-picker
        show-toolbar
        :columns="columnsList"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
    <van-popup v-model="show">
      <div class="popup">
        <div @click="show = false" class="popup-icon">
          <van-icon name="cross" />
        </div>
        <div class="popup_title">开通数字货架</div>

        <div class="popup-text">
          <van-form>
            <div style=" display: flex; ">
              <van-image
                style="margin-top:0.2702rem"
                width="0.54054rem"
                height="0.54054rem"
                :src="require('@/assets/images/my/iphone.png')"
              />
              <van-field
                v-model="mobile"
                maxlength="11"
                type="number"
                :rules="rules.mobile"
                placeholder="请输入业务员手机号码"
              />
            </div>
            <div class="van-hairline--top"></div>
            <div class="popup-text-but">
              <van-button
                round
                block
                type="info"
                style="border: 1px solid #F1722C; background: #F1722C;margin-left: -0.27027rem;"
                @click="submitForm"
                >下一步</van-button
              >
            </div>
          </van-form>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Toast } from 'vant'
export default {
  data () {
    return {
      mobile: '',
      isVIP: '0',
      showPicker: false,
      show: false,
      columns: [],
      columnsList: [],
      favorStores: 0, // 关注
      favorGoods: 0, // 收藏
      userInviteCode: '',
      username: '',
      imgAuth: '',
      // 积分
      userIntegral: 0,
      // 红包
      userMoney: 0,
      url: {
        storeUrl: '',
        agentUrl: '',
        myTeamUrl: ''
      },
      // 我的订单列表
      mybarList: [
        {
          url: '/orderList',
          text: '待付款',
          code: 0,
          icon: require('@/assets/images/my/wait-pay@2x.png')
        },
        {
          url: '/orderList',
          text: '待发货',
          code: 1,
          icon: require('@/assets/images/my/wait-send@2x.png')
        },
        {
          url: '/orderList',
          text: '待收货',
          code: 2,
          icon: require('@/assets/images/my/wait-get@2x.png')
        },
        {
          url: '/orderList',
          text: '退换货',
          code: 6,
          icon: require('@/assets/images/my/apply@2x.png')
        }
      ],
      // 我的服务
      myServiceList: [
        {
          url: '/site',
          text: '地址管理',
          type: 'to',
          icon: require('@/assets/images/my/wode-tribe@2x.png')
        },
        // {
        //   url: '/set',
        //   text: '设置',
        //   type: 'to',
        //   icon: require('@/assets/images/my/set@2x.png')
        // },
        {
          url: '/fukubukuro',
          text: '福袋',
          type: 'to',
          icon: require('@/assets/images/my/giftbag.png')
        },
        {
          url: `${this.$apiUri.WEBSITE_URL}/business`,
          text: '商务合作',
          type: 'url',
          icon: require('@/assets/images/my/icon-busines.png')
        },
        {
          url: 'https://wpa1.qq.com/SVEwR648?_type=wpa&qidian=true',
          text: '官方客服',
          type: 'url',
          icon: require('@/assets/images/my/customerservice.png')
        },
        {
          // url: `${this.$apiUri.WEBSITE_URL}/store?inWay=default`,
          // url: `${this.url.storeUrl}?inWay=default`,
          text: '后台登录',
          // type: 'url',
          icon: require('@/assets/images/my/store-icon.png'),
          login: true
        },
        {
          // url: '/signIn',
          text: '我的云店',
          icon: require('@/assets/images/my/store-goods@2x.png'),
          flag: true
        },
        // {
        //   // url: '/gift',
        //   text: '数字货架',
        //   // type: 'to',
        //   gift: true,
        //   icon: require('@/assets/images/my/QrCode.png')
        // },
        // {
        //   url: '/giftMother',
        //   text: '云创业',
        //   // type: 'to',
        //   giftMother: true,
        //   icon: require('@/assets/images/my/star@2x.png')
        // },
        {
          text: '代理商',
          // type: 'url',
          agent: true,
          icon: require('@/assets/images/my/agent@2x.png')
        },
        {
          // url: `${this.$apiUri.WEBSITE_URL}/agent/myTeam?userId=${
          //   this.$lance.getJson('userInfo').id
          // }&isH=1`,
          // url: `${this.url.myTeamUrl}?userId=${
          //   this.$lance.getJson('userInfo').id
          // }&isH=1`,
          text: '我的邀请',
          // type: 'url',
          team: true,
          icon: require('@/assets/images/my/team@2x.png')
        }
      ],
      rules: {
        mobile: [
          { required: true, trigger: 'onBlur' },
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[35678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '请输入正确的手机号',
            trigger: 'onBlur'
          }
        ]
      },
      // 商家服务
      // storeServiceList: [
      //   {
      //     url: '/sub/webview/storeLogin/storeLogin',
      //     text: '我的店铺',
      //     icon: '/assets/images/user/store-goods@2x.png'
      //   }
      // ]
      phone: ''
    }
  },
  computed: {
    ...mapState(['userInfo', 'userWeixinInfo'])
  },
  // created () {
  //   this.getAppSite()
  // },
  activated () {
    // this.phone = this.$lance.getJson('userInfo')
    // console.log(111222, this.userWeixinInfo)
    this.showPicker = false
    this.show = false
    this.getAppSite()
    this.getUserDetail()
    this.getUsermallUser()
  },
  methods: {
    getAppSite () {
      let webEnv = ''
      if (process.env.NODE_ENV === 'production') {
        webEnv = 'production'
      }
      if (process.env.NODE_ENV === 'development') {
        webEnv = 'test'
      }
      this.$http.post(this.$apiUri.APP_SITE_LIST, { webEnv: webEnv }, res => {
        this.$lance.setJson('h5Url', res.data)
        res.data.forEach(element => {
          if (element.webCode === 'H5_A001') this.url.agentUrl = element.webUrl
          if (element.webCode === 'H5_A002') this.url.myTeamUrl = element.webUrl
          if (element.webCode === 'H5_S001') this.url.storeUrl = element.webUrl
        })
      })
    },
    flagClick () {
      this.storephone()
    },
    submitForm () {
      if (this.mobile === '') {
        return Toast('请输入手机号')
      } else {
        this.getDigitalShelves()
      }
    },
    // 后台登录跳转
    toLogin () {
      window.location.href = `${this.url.storeUrl}?inWay=default`
    },
    // 我的团队跳转
    clickTeam () {
      window.location.href = `${this.url.myTeamUrl}?userId=${
        this.$lance.getJson('userInfo').id
      }&isH=1`
    },
    // 代理商跳转前判断
    clickAgent () {
      // 判断是否注册过代理商
      this.$http.post(
        this.$apiUri.APP_DLACCOUNT_ISDL,
        { userId: this.$lance.getJson('userInfo').id },
        res => {
          if (!res.data) {
            // window.location.href = `${
            //   this.$apiUri.WEBSITE_URL
            // }/agent/agentApply?userId=${this.$lance.getJson('userInfo').id}&isH=1`
            window.location.href = `${this.url.agentUrl}agentApply?userId=${
              this.$lance.getJson('userInfo').id
            }&isH=1`
          } else {
            // 已注册过代理商且待审核状态，
            this.$http.post(
              this.$apiUri.APP_DLACCOUNT_DLSTATUS,
              { userId: this.$lance.getJson('userInfo').id },
              res => {
                if (res.data) {
                  window.location.href = `${this.url.agentUrl}?userId=${
                    this.$lance.getJson('userInfo').id
                  }&isH=1`
                } else {
                  // 被拒绝，跳申请页面
                  window.location.href = `${
                    this.url.agentUrl
                  }agentApply?userId=${
                    this.$lance.getJson('userInfo').id
                  }&isH=1`
                }
              },
              err => {
                Toast(err.message)
              }
            )
          }
        },
        err => {
          Toast(err.message)
        }
      )
    },
    // 礼券妈妈跳转前判断
    toPageGiftMother () {
      this.$http.post(
        this.$apiUri.APP_GIFTMOTHER_HASOPEN,
        { phone: this.userInfo.phone },
        res => {
          if (res.data) {
            this.$router.push('giftMother')
            // this.$router.push({
            //   name: 'giftMother',
            //   query: {
            //     data: res.data
            //   }
            // })
          } else {
            this.$router.push('giftMotherBackstage')
          }
        },
        err => {
          Toast(err.message)
        }
      )
    },
    getDigitalShelves () {
      this.$http.post(
        this.$apiUri.APP_SHELVES,
        { mobile: this.mobile },
        res => {
          if (res.success) {
            this.show = false
            // if (this.isFree.isFree == false) {
            this.$router.push({
              path: '/gift',
              query: {
                isFree: res.data.isFree ? 0 : 1
              }
            })
            // }
          }
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    // 根据手机号查询店铺
    storephone () {
      this.$http.post(
        this.$apiUri.APP_STOREINFOPHONE,
        { phone: this.userInfo.phone },
        res => {
          console.log(11, res.data)
          let arr = []
          res.data.map(item => {
            if (
              item.status === 0 &&
              (item.storeRoleCode === 3 ||
                item.storeRoleCode === 4 ||
                item.storeRoleCode === 5)
            ) {
              arr.push(item)
            }
          })

          this.columns = arr
          this.columnsList = arr.map(v => v.storeName)
          if (_.size(arr) > 0) {
            this.value = arr[0].storeName
            this.showPicker = true
          } else {
            this.$toast('当前账户没有云店')
          }
        }
      )
    },

    spanPaste () {
      // this.$toast(`${this.$lance.getIntegralName()}号已复制到剪切板`)
      this.$toast('邀请码已复制到剪切板')
    },
    // 确定
    onConfirm (value, index) {
      this.showPicker = false

      this.$router.push({
        path: '/storeData',
        query: {
          storeId: this.columns[index].id
        }
      })
    },
    // 取消
    onCancel () {
      this.showPicker = false
    },
    /* 获取用户积分等信息 */
    getUserDetail () {
      this.$http.post(
        this.$apiUri.APP_MALLUSER_DETAIL,
        null,
        res => {
          if (res.data.barCode) {
            this.$lance.setData('userInviteCode', res.data.barCode.code)
            this.userInviteCode = res.data.barCode.code
          }
          if (res.data.integral != null || res.data.integral != null) {
            if (Object.keys(res.data.integral).length > 0) {
              this.userIntegral = res.data.integral.allAmount
            }
            if (Object.keys(res.data.money).length > 0) {
              this.userMoney = res.data.money.allAmount
            }
            // if (Object.keys(res.data.barCode).length > 0) {
            //   // this.isVIP = res.data.barCode.allAmount
            // }
          }
          if (res.data.favorStores != null) {
            this.favorStores = res.data.favorStores
          }
          if (res.data.favorGoods != null) this.favorGoods = res.data.favorGoods
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    // 获取用户信息（365礼包）
    getUsermallUser () {
      this.$http.post(this.$apiUri.APP_USERGET, {}, res => {
        if (res.success) {
          this.isVIP = res.data.vip365
        }
      })
    },
    /* 前往指定url页面 */
    toPage (url, query) {
      this.$router.push({
        path: url,
        query: {
          status: query
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.popup_title {
  font-size: 16px;
  font-weight: 300;
  line-height: 16px;
  color: #333333;
  opacity: 1;
  margin-left: 102px;
  padding-top: 25px;
}
.van-popup--center {
  top: 50%;
  left: 50%;
  -webkit-transform: translate3d(-50%, -50%, 0);
  transform: translate3d(-50%, -50%, 0);
  border-radius: 8px;
}
.popup {
  width: 300px;
  height: 230px;
  background: #ffffff;
  opacity: 1;
  border-radius: 8px;
  &-icon {
    float: right;
    margin-right: 15px;
    margin-top: 10px;
    color: #ccc;
  }
  &-text {
    margin-top: 8%;
    margin-left: 10%;
    &-but {
      width: 262px;
      margin-top: 40px;
    }
  }
}

.user {
  // 顶部
  &-header {
    height: 196px;
    background: linear-gradient(180deg, #ffebd5 0%, #ffaf81 100%);
    display: flex;
    flex-direction: column;
    padding: 15px 12px 15px 12px;
    color: #ffffff;

    &-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .left {
        display: flex;
        align-items: center;
        flex: 1;

        .avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          overflow: hidden;
        }

        .content {
          padding-left: 14px;
          padding-right: 14px;

          .top {
            display: flex;
            align-items: center;
            margin-bottom: 7px;
            .username {
              max-width: 140px;
              color: #333333;
              font-size: 18px;
              vertical-align: top;
              font-weight: 500;
              display: inline-block;
              overflow: hidden; //超出的文本隐藏
              text-overflow: ellipsis; //溢出用省略号显示
              white-space: nowrap; //溢出不换行
            }

            .usertype {
              width: 62px;
              height: 18px;
              color: #000;
              font-size: 10px;
              font-weight: 300;
              border-radius: 9px;
              background: #ffffff;
              text-align: center;
              line-height: 18px;
              margin: 0px 2px;
            }
            .vip {
              width: 62px;
              height: 18px;
              margin: 0px 2px;
            }
          }

          .invite-code {
            display: inline-block;
            height: 22px;
            background: linear-gradient(270deg, #ef3516 0%, #fb5d26 100%);
            opacity: 1;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 300;
            line-height: 22px;
            padding: 0px 23px 0px 8px;
          }

          .copy {
            font-size: 12px;
            font-weight: 300;
            margin-left: -20px;
            text-align: center;
            width: 44px;
            height: 22px;
            line-height: 22px;
            display: inline-block;
            background: linear-gradient(270deg, #fb7f07 0%, #fb9c26 100%);
            opacity: 1;
            border-radius: 20px;
          }
        }
      }

      .right {
        flex-shrink: 0;
        width: 40px;
        height: 40px;
        margin-left: 5vw;
        border-radius: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
        // background: linear-gradient(to left, #fbbb37 0%, #fcf0d0 105%);
        background: #fff;

        .icon {
          width: 40px;
          height: 40px;
        }
      }
    }

    &-bottom {
      display: flex;
      justify-content: space-around;
      text-align: center;
      font-size: 12px;
      color: #333333;
      opacity: 1;
      margin-bottom: 12px;
      .focusOn {
        width: 30%;
      }

      .collection {
        width: 30%;
      }

      .browse {
        width: 30%;
      }
    }
  }

  // 主体
  &-content {
    min-height: 350px;
    border-radius: 34px 34px 0 0;
    position: relative;
    top: -28px;
    background: #f7f7f7;
    margin-bottom: 30px;
    &-money {
      // box-sizing: border-box;
      background: #ffffff;
      display: flex;
      width: 94%;
      // height: 78px;
      border-radius: 8px;
      position: absolute;
      top: -35px;
      left: 50%;
      transform: translateX(-50%);

      &__item {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 15px;

        .box {
          flex: 1;
          text-align: center;

          .num {
            font-size: 18px;
            font-weight: 600;
            line-height: 22px;
            margin-bottom: 2px;
          }

          .span {
            font-size: 12px;
            line-height: 18px;
            color: #666666;
          }
        }

        .img {
          width: 46px;
          height: 46px;
          margin-right: 15px;
        }
      }

      .line {
        position: absolute;
        width: 1px;
        height: 36px;
        background: #eeeeee;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }

  // 占位
  &-palce {
    height: 54px;
  }

  // 列表
  &-wrap {
    width: 94%;
    border-radius: 8px;
    margin-bottom: 100px;
    box-sizing: border-box;
    margin: 0 auto;
    background: #ffffff;
    padding: 8px;
    &:not(:last-child) {
      margin-bottom: 12px;
    }
    .van-cell {
      padding: 6px;
    }
    // &-grid {
    //   .van-grid-item__content--center {
    //     border-radius: 8px;
    //   }
    // }
    .van-cell__title {
      font-size: 14px;
      font-weight: 700;
      color: #333333;
    }
    &-title {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      font-weight: 700;
      color: #333333;
      line-height: 18px;
      padding: 6px;
    }
  }
}
</style>
