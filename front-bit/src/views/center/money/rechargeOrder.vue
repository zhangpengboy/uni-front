<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-06 14:57:05
 * @Description : 汇款订单
-->

<template>
  <div class="center recharge">
    <!-- <van-nav-bar
      title="汇款订单"
      right-text="取消订单"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
      fixed
      placeholder
    /> -->

    <div class="recharge-order">
      <h2 class="fs-18 fw-b py-2">请在30分钟内完成转账</h2>
      <p class="fs-13 color-main">建议使用本人名下的银行卡进行转账</p>

      <div class="info mt-3">
        <div class="item">
          <p class="fs-12 fw-b">订单总金额</p>
          <h2 class="fw-b mt-2">
            <span class="fs-12">&yen;</span>
            <span class="fs-20">{{ order.money }}</span>
          </h2>
        </div>
        <div class="item">
          <p
            class="d-flex justify-content-between align-items-center mb-2 fs-12 van-ellipsis"
          >
            <span class="color-light">单价</span>
            <span>{{ !order.bitPrice ? 1 : order.bitPrice  }} CNY</span>
          </p>
          <p
            class="d-flex justify-content-between align-items-center fs-12 van-ellipsis"
          >
            <span class="color-light">数量</span>
            <span>{{ order.money }} CNY</span>
          </p>
        </div>
      </div>
    </div>

    <!-- 对公账号  -->
    <div class="recharge-bank">
      <h2 class="fs-18 fs-b p-3 d-flex align-items-center">
        <van-icon name="card" class="color-main fs-22" />
        <span class="ml-1">对公账号</span>
      </h2>
      <van-cell-group>
        <van-cell center>
          <template #title>
            <span class="color-light">收款方户名</span>
          </template>
          <template #default>
            <span class="fs-12">{{ card.cardName }}</span>
          </template>
          <template #right-icon>
            <span
              v-clipboard:copy="card.cardName"
              v-clipboard:success="onCopy"
              class="ml-2 color-main"
              >复制</span
            >
          </template>
        </van-cell>
        <van-cell center>
          <template #title>
            <span class="color-light">收款方账号</span>
          </template>
          <template #default>
            <span class="fs-12">{{ card.cardNo }}</span>
          </template>
          <template #right-icon>
            <span
              v-clipboard:copy="card.cardNo"
              v-clipboard:success="onCopy"
              class="ml-2 color-main"
              >复制</span
            >
          </template>
        </van-cell>
        <van-cell center>
          <template #title>
            <span class="color-light">收款方银行</span>
          </template>
          <template #default>
            <span class="fs-12">{{ card.bankName }}</span>
          </template>
          <template #right-icon>
            <span
              v-clipboard:copy="card.bankName"
              v-clipboard:success="onCopy"
              class="ml-2 color-main"
              >复制</span
            >
          </template>
        </van-cell>
        <van-cell center>
          <template #title>
            <span class="color-light">开户行</span>
          </template>
          <template #default>
            <span class="fs-12">{{ card.bankAddress }}</span>
          </template>
          <template #right-icon>
            <span
              v-clipboard:copy="card.bankAddress"
              v-clipboard:success="onCopy"
              class="ml-2 color-main"
              >复制</span
            >
          </template>
        </van-cell>
        <van-cell center>
          <template #title>
            <span class="color-light">订单号</span>
          </template>
          <template #default>
            <span class="fs-12">{{ order.orderNo }}</span>
          </template>
          <template #right-icon>
            <span
              v-clipboard:copy="order.orderNo"
              v-clipboard:success="onCopy"
              class="ml-2 color-main"
              >复制</span
            >
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <!-- 转卡卡主姓名 -->
    <div class="mt-2">
      <van-field
        label-class="fw-b"
        v-model="recName"
        placeholder="请输入卡主姓名"
        label="转款卡主姓名"
        input-align="right"
      >
      </van-field>
      <van-field
        name="uploader"
        label-class="fw-b"
        label="打款凭证"
        input-align="right"
      >
        <template #input>
          <van-uploader
            v-model="uploader"
            :after-read="afterReadUploader"
            :max-count="1"
          />
        </template>
      </van-field>
      <div class="color-light px-3 fs-12 py-2">
        <p class="fs-12 mb-1">温馨提示：</p>
        <p class="color-red fs-12 mb-1">
          1、请在转账时备注账户手机号码（请勿备注含矿机、数字货币、比特币、以太坊或者英文BTC、ETH等字眼），如有铭感字眼的备注将不做充值处理，七天后所转账金额按原路返回；
        </p>
        <p class="fs-12 mb-1">
          2、如有任何疑问请联系官方客服（请在工作日9:00~18:00之间完成充值）；
        </p>
        <p class="fs-12 mb-1">3、仅支持储蓄卡充值。</p>
      </div>
    </div>

    <!-- 底部 -->
    <div class="m-1">
      <van-button
        block
        type="info"
        @click="submitFinished"
        :disabled="!recName"
      >
        我已成功付款
      </van-button>
    </div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      order: {},
      card: {},
      active: 0,
      recName: null,
      payway: 1,
      orderNo: null,
      uploader: [],
      imgUrl: null
    }
  },
  mounted () {
    this.orderNo = this.$route.query.orderNo
    this.getRechargeOrder()
    this.getCompanyCard()
  },
  methods: {
    /** 获取订单详情 */
    getRechargeOrder () {
      this.$http.post(
        this.$apiUri.APP_RECHARGE_ORDER_INFO,
        {
          orderNo: this.orderNo
        },
        (res) => {
          this.order = res.data
          console.log(this.order)
        }
      )
    },
    /** 获取对公账号 */
    getCompanyCard () {
      this.$http.post(this.$apiUri.APP_COMPANY_CARD_LIST, null, (res) => {
        this.card = res.data[Math.floor(Math.random() * res.data.length)]
      })
    },
    /** 复制 */
    onCopy () {
      this.$toast('复制成功')
    },
    /** 返回 */
    onClickLeft () {
      this.$router.back()
    },
    afterReadUploader (File) {
      this.$toast.loading({
        message: '图上传中...',
        forbidClick: true,
        duration: 0
      // mask: true
      })
      var formData = new FormData()
      formData.append('file', File.file)
      // console.log(File.file)
      // alert(File.file.size)
      this.$http.post(this.$apiUri.APP_UPLOAD_IMG, formData, (res) => {
        // console.log(res)
        // alert(res.data)
        if (res.success) {
          this.$toast.clear()
          this.$toast('图片上传成功')
          this.imgUrl = res.data
        } else {
          this.$toast.clear()
          this.$toast('图片上传失败，请重新上传')
        }
      })
    },
    /** 取消订单 */
    onClickRight () {},
    /** 我已成功充值 */
    submitFinished () {
      if (this.imgUrl == null) {
        return this.$toast('请上传打款凭证')
      }
      if (this.recName == null) {
        return this.$toast('请输入打款账号真实姓名')
      }
      this.$dialog
        .confirm({
          title: '确认转账?',
          message:
            '请确认已完成向平台转账，如您多次在未付款情况下点击“我已付款”将可能影响您的账户安全。',
          confirmButtonText: '确认已付',
          cancelButtonText: '我再想想',
          confirmButtonColor: '#1E74E4'
        })
        .then(() => {
          this.$http.post(
            this.$apiUri.APP_RECHARGE_FINISHED,
            {
              transUserName: this.recName,
              orderNo: this.orderNo,
              img: this.imgUrl
            },
            () => {
              this.$router.push({
                name: 'rechargeStatus',
                query: { orderNo: this.orderNo }
              })
            },
            (err) => {
              this.$toast(err.message)
            }
          )
        })
    }
  }
}
</script>
