<template>
  <div>
    <van-nav-bar
      :title="title"
      left-arrow
      fixed
      placeholder
      @click-left="$router.push('fukubukuro')"
    />
    <div class="retroactive">
      <div class="period">
        <div>查看签到日期</div>
        <div>
          有效期至{{
            $lance.parseTime(currentsign.giftValidityEnd, '{y}-{m}-{d}')
          }}
        </div>
      </div>
      <van-calendar
        :readonly="true"
        :show-title="false"
        :show-subtitle="false"
        :poppable="false"
        :show-confirm="false"
        type="multiple"
        @select="select"
        color="#eb6133"
        row-height="50"
        :min-date="minDate"
        :max-date="maxDate"
        :default-date="defaultDate"
        class="mx-1"
        :style="{ height: '300px' }"
      />
      <div class="sige">
        已累计签到
        <span style="color:#EB6133">{{ currentsign.signCount }}</span> 天
      </div>
      <div class="buttom">
        <van-button class="btn" type="primary" block>已签到</van-button>
      </div>
      <van-divider class="divider">
        签到规则
      </van-divider>
      <div class="text">
        1、每日签到一次，{{ currentsigns.signCycle }}天内累计签到{{
          currentsigns.signDay
        }}天后自动激活一张礼券福袋
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentsign: {},
      currentsigns: {},
      defaultDate: [],
      minDate: null,
      maxDate: new Date(),
      title: '签到记录'
    }
  },
  created () {
    this.minDate = new Date(this.$lance.getDate('month', -6))
    this.userGift()
  },
  methods: {
    userGift () {
      this.$http.post(this.$apiUri.APP_GIFT, {}, res => {
        // console.log(res)
        this.currentsign = res.data
        this.currentsigns = res.data.config
        let dateList = res.data.signDate.split(',').slice(0, -1)
        dateList.forEach(item => {
          this.defaultDate.push(new Date(item))
        })
      })
    },
    // onConfirm (date) {
    //   console.log(11, date)
    //   // this.text = `选择了 ${date.length} 个日期`
    //   date = this.currentsign.signDate
    // },
    formatter (date) {
      if ((date.type = this.currentsign.giftValidityStart)) {
      } else if ((date.type = this.currentsign.giftValidityEnd)) {
      }

      return date
    },
    select (date) {
      console.log(2222, date)
      date = this.currentsign.signDate
      // date = this.currentsign.giftValidityEnd
    }
  }
}
</script>

<style lang="less" scoped>
.text {
  width: 338px;
  height: 40px;
  padding: 0 14px;
  font-size: 13px;
  font-weight: 300;
  line-height: 22px;
  color: #666666;
  opacity: 1;
}
.divider {
  font-weight: 300;
  padding: '0 16px';
  color: #666666;
  font-size: 16px;
}
.buttom {
  background-color: #fff;
  padding-bottom: 20px;
}
.btn {
  width: 315px;
  height: 40px;
  margin: 0 auto;
  background: #f2f2f2;
  opacity: 1;
  border: 1px solid #f2f2f2;
  color: #333333;
  border-radius: 35px;
}
.sige {
  text-align: center;
  background-color: #fff;
  padding-top: 12px;
  padding-bottom: 12px;
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  opacity: 1;
}
// /deep/.van-calendar__day {
//   position: relative;
//   width: 14.285%;
//   height: 1.70667rem;
//   font-size: 0.42667rem;
//   cursor: pointer;
//   margin-left: 5px;
//   margin-top: 5px;
// }

.period {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 14px;

  font-size: 14px;
  font-weight: 300;
  color: #333333;
}
</style>
