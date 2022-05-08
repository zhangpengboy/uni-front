<template>
  <div>
    <van-nav-bar title="支付成功" left-arrow @click-left="onClickLeft" />
    <div class="home">
      <div class="imgae">
        <van-image
          style="margin-top: 0.35135rem;margin-left:0.40540rem;margin-right:0.32432rem"
          :src="require('../../assets/images/payok.png')"
        />
      </div>
      <div class="payment">支付成功</div>
      <div class="money">
        <span style="font-size:14px">￥</span><span>{{ payInfo }}</span>
      </div>
      <div class="buttom">
        <van-button @click="toHome" class="one" color="#999999" plain
          >返回首页</van-button
        >
        <van-button
          v-if="!type"
          @click="toorDer"
          class="two"
          color="#EB6133"
          plain
          >{{ bsType === 'BS_A007' ? '查看福袋' : '查看订单' }}</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      type: 0
    }
  },
  created () {
    this.bsType = this.$route.query.bsType
    this.type = this.$route.query.type
    this.payInfo = this.$lance.getData('salePrice')
    // console.log(1, this.settleAmount)
  },
  methods: {
    onClickLeft () {
      this.$router.push('my')
    },
    toorDer () {
      if (this.bsType === 'BS_A007') {
        this.$dialog.confirm({
          title: '',
          message: '是否免费开通个人云创业？',
          confirmButtonText: '是',
          cancelButtonText: '否'
        })
          .then(() => {
            this.$router.push('giftMotherEnter')
          })
          .catch(() => {
            this.$router.push('/fukubukuro')
          })
      } else {
        this.$router.push({
          path: '/orderList',
          query: {
            status: 1
          }
        })
      }
    },
    toHome () {
      this.$router.push('/exchange')
    }
  }
}
</script>

<style lang="less" scoped>
.buttom {
  display: flex;
  justify-content: space-evenly;
  .one {
    width: 132px;
    height: 38px;
    border: 1px solid #eb6133;
    opacity: 1;
    border-radius: 79px;
  }
  .two {
    width: 132px;
    height: 38px;
    border: 1px solid #eb6133;
    opacity: 1;
    border-radius: 79px;
  }
}
.money {
  height: 30px;
  font-size: 22px;
  font-weight: 600;
  margin-left: 158px;
  margin-bottom: 40px;
  line-height: 30px;
  color: #333333;
  opacity: 1;
}
.payment {
  height: 25px;
  margin-left: 152px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 300;
  line-height: 25px;
  color: #333333;
  opacity: 1;
}
.imgae {
  width: 200px;
  height: 200px;
  background: #ffffff;
  opacity: 1;
  margin-left: 75px;
  padding-top: 20px;
}
.home {
  width: 100%;
  min-height: calc(100vh - 0px);
  background-color: #fff;
}
</style>
