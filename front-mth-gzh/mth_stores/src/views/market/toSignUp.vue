<!-- 活动报名 -->
<template>
  <div class="toSignUp">
    <div class="activity">
      <van-cell-group>
        <van-cell title-clas="name" title="活动名称" :value="nick" />
        <van-cell
          title-clas="package"
          @click="popup = true"
          title="活动套餐"
          is-link
          :value="activityName == '' ? '请选择' : activityName"
        ></van-cell>
      </van-cell-group>
      <!-- <div class="name">
            <div>活动名称</div>
            <div>品牌兑换</div>
        </div>
        <div class="package">
            <div>活动套餐</div>
            <div @click="showPopup" ><span class="placeholder">请选择</span><van-icon style="vertical-align: middle" name="arrow" /></div>
        </div> -->
      <div class="information">
        <div>套餐信息</div>
        <div class="details">
          <div>
            开通价格：￥<span>{{ packInfo.price || 0 }}</span>
          </div>
          <div>
            开通积分：<span>{{ packInfo.integral || 0 }}积分</span>
          </div>
          <div>
            商品展示数量：<span>{{ packInfo.showAmount || 0 }}个</span>
          </div>
          <div>
            有效时长：<span>{{ packInfo.avilableTime || 0 | filterTime }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="button" @click="submitForm">立即报名</div>
    <van-popup v-model="popup" position="bottom" :style="{ height: '50%' }">
      <van-picker
        title=""
        show-toolbar
        :columns="columnList"
        value-key="actName"
        @confirm="onConfirm"
        @cancel="onCancel"
        @change="onChange"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'toSignUp',
  data () {
    return {
      // 店铺信息
      storeInfo: {},
      // 套餐弹出框
      popup: false,
      // 套餐列表
      columnList: [],
      // 选择套餐名称
      activityName: '',
      // 选择套餐packCode
      packCode: '',
      // 活动名称
      nick: '',
      // 活动code
      actCode: '',
      // 套餐配置
      packInfo: {}
    }
  },
  computed: {},
  watch: {},
  filters: {
    filterTime: (val) => {
      let diff = val / 1000
      if (diff < 60) return diff + '秒'
      if (diff < 60 * 60) return Math.ceil(diff / 60) + '分钟'
      if (diff < 60 * 60 * 24) return Math.ceil(diff / 3600) + '小时'
      return Math.ceil(diff / 3600 / 24) + '天'
    }
  },
  created () {
    this.storeInfo = this.$lance.getJson('storeInfo')
    this.nick = this.$route.query.nick
    this.actCode = this.$route.query.code
    this.getActBindPackList()
  },
  mounted () {},
  methods: {
    // 获取活动套餐
    getActBindPackList () {
      this.$http.post(
        this.$apiUri.APP_GOODS_ACT_BIND_PACK,
        {
          actCode: this.actCode
        },
        (res) => {
          this.columnList = res.data
        },
        (err) => {
          this.$toast(err.message)
        }
      )
    },
    // 获取套餐配置
    getActPackInfo () {
      this.$http.post(
        this.$apiUri.APP_GOODS_ACT_PACK,
        {
          packCode: this.packCode
        },
        (res) => {
          this.packInfo = res.data
        },
        (err) => {
          this.$toast(err.message)
        }
      )
    },
    // 确定选择套餐
    onConfirm (value) {
      // console.log(`当前值1：${value}, 当前索引：${index}`);
      this.activityName = value.actName
      this.packCode = value.packCode
      this.popup = false
      this.getActPackInfo()
    },
    // 切换套餐
    onChange (picker, value, index) {
      // console.log(`当前值：${value}, 当前索引：${index}`);
    },
    // 取消/关闭套餐弹框
    onCancel () {
      this.popup = false
      console.log('取消')
    },
    // 报名
    submitForm () {
      if (this.packCode === '') return this.$toast('请选择活动套餐')
      const _params = {
        storeId: this.storeInfo.storeId,
        storeName: this.storeInfo.storeName,
        actCode: this.actCode + ';' + this.packCode,
        totalAmount: this.packInfo.price || 0,
        payAmount: this.packInfo.price || 0,
        integralAmount: this.packInfo.integral
      }
      this.$http.post(
        this.$apiUri.APP_GOODS_ORDER_ACTPCK,
        _params,
        (res) => {
          this.$http.post(
            this.$apiUri.APP_GOODS_STORE_BUY_PACK,
            {
              orderNo: res.data,
              role: this.storeInfo.storeRoleCode
            },
            (res) => {
              this.$toast('报名成功')
              this.$router.push('market')
            },
            (err) => {
              this.$toast(err.message)
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
<style lang='scss' scoped>
// @import url(); 引入公共css类
.toSignUp {
  .activity {
    background-color: #fff;
    .name {
      font-size: 14px;
      font-weight: 300;
      color: #333333;
      opacity: 1;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #f6f6f6;
      div {
        margin-bottom: 14px;
      }
    }
    .package {
      font-size: 14px;
      font-weight: 300;
      color: #333333;
      opacity: 1;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #f6f6f6;
      div {
        margin: 14px 0px;
      }
    }
    .information {
      padding: 14px;
      font-size: 14px;
      font-weight: 300;
      color: #333333;
      opacity: 1;
      .details {
        display: flex;
        flex-wrap: wrap;
        margin-top: 20px;
        div {
          width: 50%;
          margin-bottom: 14px;
          font-size: 13px;
          font-weight: 300;
          line-height: 22px;
          color: #999;
          opacity: 1;
          span {
            font-size: 16px;
            font-weight: 300;
            color: #333;
          }
        }
      }
    }
  }
  .button {
    margin: 100px auto;
    // position: fixed;
    // bottom: 20px;
    width: 262px;
    height: 38px;
    text-align: center;
    line-height: 38px;
    background: linear-gradient(180deg, #f1722c 0%, #eb6133 100%);
    opacity: 1;
    border-radius: 41px;
    font-size: 14px;
    font-weight: 300;
    color: #ffffff;
  }
}
</style>
