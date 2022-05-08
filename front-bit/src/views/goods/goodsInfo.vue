<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-24 15:10:39
 * @Description  : BTC ETH 商品详情
-->
<template>
  <div class="goods">
    <!-- 商品基础信息 -->
    <div class="goods-base">
      <div class="goods-base-top">
        <div class="image">
          <van-image
            :src="goods.img"
            fit="contain"
          />
        </div>
        <div class="info">
          <div class="d-flex color-light mb-2">
            <span class="w-65">功耗:</span>
            <span>算力:</span>
          </div>
          <div class="d-flex mb-5">
            <span class="w-65">{{ goods.power }} {{ goods.powerUnit }}</span>
            <span>{{ goods.hash }} {{ goods.hashUnit }}</span>
          </div>

          <div class="d-flex color-light mb-2">预计日产出:</div>
          <div class="mb-8">
            <span>{{ nissanOut }}{{ goods.bitType | filterBitType }}</span>
            <span> ≈ </span>
            <span>{{ nissanOutCny }}</span>
            <span> CNY/台</span>
          </div>

          <div class="number">
            <div class="prog">
              <div
                class="prog-pivot"
                :style="{ width: (goods.num / goods.allNum) * 100 + '%' }"
              ></div>
            </div>
            <div class="remain">
              <span class="mr-2">剩余:</span>
              <span class="color-main">{{ goods.num }}</span>
              <span>台</span>
            </div>
          </div>
        </div>
      </div>
      <div class="goods-base-foot">
        <h2 class="title">{{ goods.productName }}</h2>
        <div class="d-flex">
          <div class="w-50 color-main fs-22">
            <span>{{ goods.price }}</span>
            <span class="ml-1 fs-13">CNY/台</span>
          </div>
          <div class="flex-1 color-light fs-14 text-right">
            <span class="color-dark">电费：</span>
            <span>{{ goods.powerPrice }}</span>
            <span> CNY/度</span>
          </div>
        </div>
        <div class="pt-3 bb-1"></div>
      </div>
    </div>

    <!-- 产出规则 -->
    <div class="goods-wrap">
      <div class="goods-wrap-bar">
        <div class="icon"></div>
        <div class="name">产出规则</div>
      </div>
      <div class="goods-rules">
        <div class="d-flex color-light fs-12 mb-2">
          <span class="w-25">{{
            $lance.parseTime(goods.createTime, "{y}-{m}-{d}")
          }}</span>
          <span class="w-25">{{
            $lance.parseTime(prepareTime, "{y}-{m}-{d}")
          }}</span>
          <span class="flex-1 text-right">{{ serviceTime }}</span>
        </div>
        <div class="d-flex color-light fs-12 mb-2">
          <span class="w-25">购买日</span>
          <span class="w-25">上架时间</span>
          <span class="flex-1 text-right">服务器结束</span>
        </div>
        <div class="progress">
          <span class="w-25 one"></span>
          <span class="flex-1 two"></span>
        </div>
      </div>
    </div>

    <!-- 产品规格|产品详情|风险提示 -->
    <van-tabs
      animated
      color="#1E74E4"
      title-active-color="#1E74E4"
      class="goods-tabs"
      sticky
    >
      <van-tab title="产品规格">
        <div class="goods-tabs-spec">
          <van-row>
            <van-col
              class="van-hairline--surround p-2 text-center bg-gray"
              span="5"
              >矿机型号</van-col
            >
            <van-col class="van-hairline--surround p-2 van-ellipsis" span="7">{{
              goods.productName
            }}</van-col>
            <van-col
              class="van-hairline--surround p-2 text-center bg-gray"
              span="5"
              >产出币种</van-col
            >
            <van-col class="van-hairline--surround p-2 van-ellipsis" span="7">{{
              goods.bitType | filterBitType
            }}</van-col>
          </van-row>
          <van-row>
            <van-col
              class="van-hairline--surround p-2 text-center bg-gray"
              span="5"
              >额定算力</van-col
            >
            <van-col class="van-hairline--surround p-2 van-ellipsis" span="7"
              >{{ goods.hash }}{{ goods.hashUnit }}</van-col
            >
            <van-col
              class="van-hairline--surround p-2 text-center bg-gray"
              span="5"
              >功耗</van-col
            >
            <van-col class="van-hairline--surround p-2 van-ellipsis" span="7"
              >{{ goods.power }}{{ goods.powerUnit }}</van-col
            >
          </van-row>
          <van-row>
            <van-col
              class="van-hairline--surround p-2 text-center bg-gray"
              span="5"
              >预计产出</van-col
            >
            <van-col class="van-hairline--surround p-2 van-ellipsis" span="19">
              <span>{{ nissanOut }} {{ goods.bitType | filterBitType }}</span>
              <span> ≈ </span>
              <span>{{ nissanOutCny }}</span>
              <span> CNY/台</span>
            </van-col>
          </van-row>
          <van-row>
            <van-col
              class="van-hairline--surround p-2 text-center bg-gray"
              span="5"
              >服务周期</van-col
            >
            <van-col class="van-hairline--surround p-2 van-ellipsis" span="7">{{
              serviceTime
            }}</van-col>
            <van-col
              class="van-hairline--surround p-2 text-center bg-gray"
              span="5"
              >管理费</van-col
            >
            <van-col class="van-hairline--surround p-2 van-ellipsis" span="7"
              >{{ (goods.serivceReate * 100).toFixed(2) }}%</van-col
            >
          </van-row>
          <van-row>
            <van-col
              class="van-hairline--surround py-2 text-center bg-gray"
              span="5"
              >预计回报率</van-col
            >
            <van-col class="van-hairline--surround p-2 van-ellipsis" span="7"
              >{{ goods.expectRate * 100 }}%</van-col
            >
            <van-col
              class="van-hairline--surround p-2 text-center bg-gray"
              span="5"
              >上架时间</van-col
            >
            <van-col class="van-hairline--surround p-2 van-ellipsis" span="7"
              >{{ goods.prepareTime }}天</van-col
            >
          </van-row>
        </div>
      </van-tab>
      <van-tab title="产品详情">
        <div class="goods-tabs-detail" v-html="goodsInfo.detail"></div>
      </van-tab>
      <van-tab title="风险提示">
        <div class="goods-tabs-detail" v-html="goodsInfo.warning"></div>
      </van-tab>
    </van-tabs>
    <!-- 商品购买 -->
    <div class="goods-buybtn">
      <van-button type="info" block square @click="isShowPopup"
        >立即购买</van-button
      >
    </div>
    <!-- 弹窗窗 -->
    <van-popup
      v-model="show"
      closeable
      round
      safe-area-inset-bottom
      close-on-popstate
      position="bottom"
    >
      <div class="goods-popup">
        <h2 class="mb-4 fs-15">{{ goods.productName }}</h2>
        <div class="d-flex mb-5">
          <p class="w-50 fs-13">
            <span class="color-light mr-1">有效算力</span>
            <span class="fs-15 color-main"
              >{{ goods.hash }}{{ goods.hashUnit }}</span
            >
          </p>
          <p class="w-50 fs-13">
            <span class="color-light mr-1">有效时间</span>
            <span class="fs-15 color-main">{{ serviceTime }}</span>
          </p>
        </div>

        <div
          class="d-flex justify-content-between align-items-center fs-14 py-3"
        >
          <div>购买台数</div>
          <van-stepper
            v-model="quota"
            :max="maxNum"
            :min="minNum"
            @change="handleChangeQuota"
            integer
          />
        </div>

        <div class="fs-14 py-3">
          <div class="mb-2">预交电费</div>
          <div class="goods-popup-pack">
            <div class="pack-boxs" :style="{ width: sumPackWidth }">
              <div
                class="pack-item text-center"
                :class="i == active ? 'on' : ''"
                @click="handleSelectPack(i)"
                v-for="(v, i) in packList"
                :key="i"
              >
                <van-badge :content="v.rebate < 1 ? v.rebate * 10 + '折' : ''">
                  <p class="fs-14">{{ v.name }}</p>
                  <p class="fs-12">
                    <span>{{ v.price }}</span>
                    <span> CNY/台</span>
                  </p>
                </van-badge>
              </div>
            </div>
          </div>
        </div>

        <van-submit-bar
          :price="sumPrice"
          text-align="left"
          button-type="info"
          button-text="立即购买"
          @submit="onSubmit"
        />
      </div>
    </van-popup>

    <!--短信验证码 -->
    <!-- <van-popup
      v-model="showTrad"
      close-icon-position="top-left"
      closeable
      round
      safe-area-inset-bottom
      close-on-popstate
      :close-on-click-overlay="false"
      position="bottom"
    >
      <div class="px-2 pt-8 pb-5 d-flex align-items-center">
        <div class="w-70">
          <h3 class="fw-b mt-3 mb-2 ml-2">请输入短信验证码</h3>
          <van-field
            type="digit"
            placeholder="请输入短信验证码"
            v-model="msgCode"
            autofocus
          >
            <template #right-icon>
              <span @click="onSendMsg" class="color-main">
                {{ textMsg }}
              </span>
            </template>
          </van-field>
        </div>
        <van-button
          class="flex-1"
          block
          type="info"
          size="small"
          round
          @click="handlePayOrder"
        >
          确定
        </van-button>
      </div>
    </van-popup> -->

    <!--交易密码 -->
    <van-popup
      v-model="showTrad"
      close-icon-position="top-left"
      closeable
      round
      safe-area-inset-bottom
      close-on-popstate
      :close-on-click-overlay="false"
      position="bottom"
      @close="password = null"
    >
      <div class="px-2 pt-8 pb-5 d-flex align-items-center">
        <div class="w-70">
          <h3 class="fw-b mt-3 mb-2 ml-2">请输入交易密码</h3>
          <van-field
            :type="showRePwd ? 'text' : 'password'"
            placeholder="请输入交易密码"
            v-model="password"
            autofocus
          >
            <template #right-icon>
              <van-icon
                size="22"
                name="eye-o"
                v-if="showRePwd"
                @click="showRePwd = false"
              />
              <van-icon
                size="22"
                name="closed-eye"
                v-else
                @click="showRePwd = true"
              />
            </template>
          </van-field>
          <router-link to="resetPayPasswords" class="forgetPaw pl-3"
            >忘记密码?</router-link
          >
        </div>
        <van-button
          class="flex-1"
          block
          type="info"
          size="small"
          round
          @click="handlePayOrder"
        >
          确定
        </van-button>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Decimal from 'decimal.js-light'
export default {
  data () {
    return {
      productNo: null, // 产品编号
      goods: {},
      goodsInfo: {},
      packList: [],
      show: false,
      quota: 1, // 购买数量
      maxNum: 1, // 购买最大数量
      minNum: 1, // 购买最小数量
      active: 0, // 选择的套餐序号
      oneSumPrice: 0, // 单个选择总价
      sumPrice: 0, // 总价
      // msgCode: null,
      password: null,
      signNo: null,
      timer: null,
      second: 90,
      // textMsg: '发送验证码',
      showTrad: false,
      showRePwd: false
    }
  },
  activated () {
    this.getUserInfo()
  },
  mounted () {
    this.productNo = this.$route.query.productNo
    this.getGoodsBase()
  },
  computed: {
    ...mapState(['user']),
    // 上架时间
    prepareTime: function () {
      return (
        this.goods.createTime + this.goods.prepareTime * 24 * 60 * 60 * 1000
      )
    },
    // 服务结束时间
    serviceTime: function () {
      if (this.goods.serviceTime === '-1') {
        return '永久'
      }
      return this.goods.serviceTime + '天'
    },
    // 计算width
    sumPackWidth: function () {
      return 145 * _.size(this.packList) + 'px'
    },
    // 计算日产出CNY
    nissanOutCny: function () {
      if (!_.isEmpty(this.goods)) {
        return new Decimal(this.goods.hash).mul(this.goods.dayCny).toFixed(2)
      }
      return 0
    },
    // 计算日产出bit
    nissanOut: function () {
      if (!_.isEmpty(this.goods)) {
        return new Decimal(this.goods.hash).mul(this.goods.dayNum).toFixed(8)
      }
      return 0
    }
  },
  methods: {
    /** 获取产品基础信息 */
    getGoodsBase () {
      this.$http.post(
        this.$apiUri.APP_PRODUCT_GET,
        {
          productNo: this.productNo
        },
        (res) => {
          this.goods = res.data
          // sku 默认显示的图片
          this.goods.picture = res.data.goodsIcon
          // 获取产品详情
          this.getGoodsInfo()
          // 获取电力套餐
          this.getGoodsPackList()
        }
      )
    },
    /** 获取商品详情详细 */
    getGoodsInfo () {
      this.$http.post(
        this.$apiUri.APP_PRODUCT_INFO,
        {
          productNo: this.productNo
        },
        (res) => {
          this.goodsInfo = res.data
        }
      )
    },
    // 立即购买弹框判断
    isShowPopup () {
      if (!this.$store.state.hasLogin) {
        return this.$router.push('login')
      }
      this.show = true
    },
    /** 获取登录信息 */
    getUserInfo () {
      this.$http.post(this.$apiUri.APP_USER_INFO, null, (res) => {
        this.$store.dispatch('login', res.data)
      })
    },
    /** 获取电力套餐列表 */
    getGoodsPackList () {
      this.$http.post(
        this.$apiUri.APP_PRODUCT_PACK_LIST,
        {
          productNo: this.productNo
        },
        (res) => {
          this.packList = _.concat(this.packList, res.data)
          // 计算1台电费 电费时价*每小时功耗*24小时*租赁周期*套餐折扣*数量
          if (!_.isEmpty(this.goods)) {
            _.map(this.packList, (v) => {
              v.price = new Decimal(this.goods.powerPrice)
                .mul(this.goods.power)
                .mul(24)
                .mul(v.day)
                .mul(v.rebate)
                .toFixed(2)
            })
            this.minNum = this.packList[0].minNum
            this.maxNum = this.packList[0].maxNum
            this.handleSelectPack(0)
          }
        }
      )
    },
    /** 发送短信 */
    onSendMsg () {
      this.$http.post(
        this.$apiUri.APP_PORDER_SEND_SIGN,
        {
          productNo: this.productNo,
          packNo: this.packList[this.active].packNo,
          num: this.quota
        },
        (res) => {
          this.signNo = res.data
          this.$http.post(
            this.$apiUri.APP_COMMON_SEND_MSG,
            {
              mobile: this.user.phone,
              signNo: this.signNo
            },
            () => {
              this.$toast('发送成功,请注意查收!')
              this.timer = setInterval(() => {
                this.second--
                this.textMsg = `已发送 ${this.second} s`
                if (this.second <= 0) {
                  this.second = 90
                  clearInterval(this.timer)
                  this.textMsg = '重新发送验证码'
                }
              }, 1000)
            }
          )
        }
      )
    },
    /** 立即购买 提交订单 */
    onSubmit () {
      if (this.active === null) return this.$toast('请选择预交电费数')
      this.show = false
      // TODO 创建订单 暂无
      this.showTrad = true
    },
    /** 验证短信码并支付 */
    handlePayOrder () {
      if (this.password == null || this.password === '') {
        return this.$toast('请输入交易密码')
      }
      this.$http.post(
        this.$apiUri.APP_PORDER_ADD,
        {
          productNo: this.productNo,
          packNo: this.packList[this.active].no,
          num: this.quota,
          password: this.$md5(this.password),
          bitType: 1,
          signNo: this.signNo
        },
        (res) => {
          if (res.success) {
            this.$toast('购买成功')
            this.$router.replace({
              name: 'orderList'
            })
          }
        },
        (err) => {
          this.showTrad = false
          this.password = null
          this.$toast(err.message)
        }
      )
    },
    /** 套餐选择 */
    handleSelectPack (i) {
      this.active = i
      // 计算总价 (矿机费用+租赁电费) * 台数
      const _price = Decimal(this.goods.price)
        .add(this.packList[i].price)
        .toNumber()
      this.oneSumPrice = Decimal(_price).mul(100).toNumber()
      this.sumPrice = Decimal(this.quota).mul(this.oneSumPrice).toNumber()
    },
    /** 购买数量变化 */
    handleChangeQuota (val) {
      if (val) {
        this.sumPrice = Decimal(val).mul(this.oneSumPrice).toNumber()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.forgetPaw {
  font-size:12px;
  margin-top:6px;
  color:rgb(30,116,228);
}
</style>
