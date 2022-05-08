<!-- 福袋选择 -->
<template>
  <div>
    <div>
      <div class="giftbag" v-if="dataOK || giftbagList.length > 0">
        <van-checkbox-group v-model="result" @change="checkboxChange">
          <div class="chgroup" v-for="item in giftbagList" :key="item.id">
            <div class="radio">
              <van-checkbox
                :name="item"
                v-model="checked"
                :disabled="!item.isActivate"
                checked-color="#eb6133"
              ></van-checkbox>
            </div>
            <div>
              <div
                class="giftItem"
                :style="{
                  backgroundImage: 'url(' + backUrl[item.isActivate] + ')'
                }"
              >
                <div class="content">
                  <div class="content_list">
                    <div class="content_list_top">
                      <span class="icon">￥</span>{{ item.giftAmount }}
                    </div>
                    <div class="content_list_bottom">礼券福袋</div>
                  </div>
                  <div class="content_center">
                    <div class="content_center_top">
                      限福袋专区
                    </div>
                    <div class="content_center_bottom">
                      {{ item.giftValidityStart }}至{{ item.giftValidityEnd }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bottom">
              <div class="text">
                已选{{ selectnum }}张，可减
                <span style="font-size: 10px;color:#EB6133">￥ </span>
                <span style="font-size: 18px;color:#EB6133">{{
                  selectprice
                }}</span>
              </div>

              <van-button
                round
                type="info"
                @click="submitOrder"
                class="info"
                color="#ed6133"
                >确定</van-button
              >
            </div>
          </div>
        </van-checkbox-group>
      </div>
      <div v-else class="imageLength">
        <van-image
          width="206"
          height="142"
          :src="require('@/assets/images/my/icon_null.png')"
        />
        <div class="imageLength_text">还没有礼券福袋</div>
        <!-- <van-button
          round
          type="info"
          @click="torecharge"
          class="buttom_info"
          color="#ed6133"
          >去充值</van-button
        > -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      backUrl: [
        'https://app-static.meitianhui.com/images/a38898c1187e0f5fcc71e827dad8a7ea-pp687qfb1u.png',
        'https://app-static.meitianhui.com/images/c6e7b92406fe0983e18d2339bd4eb0a6-ulfx6898tc.png'
      ],
      result: [],
      giftbagList: [],
      giftselectList: [],
      selectnum: 0,
      selectprice: 0,
      checked: false,
      dataOK: true,
      note: '',
      bsType: ''
    }
  },
  created () {
    this.value = this.$route.query.Numb
    this.note = this.$route.query.notes
    // console.log(this.note)
    this.bsType = this.$route.query.bsType
    this.getGiftUse()
  },
  methods: {
    checkboxChange (e) {
      this.selectnum = e.length

      let arr = e
      let giftarr = []
      let price = 0
      this.giftbagList.map((item, index) => {
        arr.map(its => {
          if (item.giftCode === its.giftCode) {
            giftarr.push(item.giftCode)
            price += item.giftAmount
          }
        })
      })
      this.giftselectList = giftarr
      this.selectprice = price
    },

    // 确定
    submitOrder () {
      // if (this.selectnum === 0) return
      // this.$lance.setJson('giftselectList', this.giftselectList)
      // this.$lance.setData('selectprice', this.selectprice)
      // console.log(223, this.selectprice)
      // this.$router.go(-1)
      // this.$lance.setJson('giftbag', {
      //   Numb: this.value,
      //   note: this.note,
      //   bsType: this.bsType
      // })
      this.$router.push({
        path: '/submitOrder',
        query: {
          selectnum: this.selectnum, // 选择的礼券数量
          selectprice: this.selectprice,
          note: this.note,
          bsType: this.bsType,
          giftselectList: this.giftselectList,
          Numb: this.value
        }
      })
    },
    // 跳转购买
    torecharge () {
      this.$router.push('/recharge')
    },
    // 查看使用和未使用和过期的礼包卷
    getGiftUse (index) {
      this.giftbagList = []
      this.$http.post(
        this.$apiUri.APP_GETGIFTUSE,
        { type: 0 },
        res => {
          this.dataOK = false
          this.giftbagList = res.data.list
          this.giftbagList.map(item => {
            item.giftValidityStart = this.$lance.parseTime(
              item.giftValidityStart,
              '{y}-{m}-{d}'
            )
            item.giftValidityEnd = this.$lance.parseTime(
              item.giftValidityEnd,
              '{y}-{m}-{d}'
            )
          })
        },
        err => {
          this.dataOK = true
          this.$toast(err.message)
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
.buttom_info {
  width: 112px;
  height: 36px;
  background: linear-gradient(180deg, #f1722c 0%, #eb6133 100%);
  opacity: 1;
  border-radius: 24px;
}
.imageLength_text {
  height: 22px;
  font-size: 16px;
  font-weight: 300;
  line-height: 22px;
  color: #999999;
  opacity: 1;
  margin-top: 24px;
  margin-bottom: 24px;
}
.imageLength {
  background-color: #fff;
  text-align: center;
  padding-top: 92px;
  padding-bottom: 180px;
}
.icon {
  font-size: 20px;
  color: #fff;
  width: 1.35135rem;
  height: 0.05405rem;
}
.bottom {
  width: 375px;
  height: 49px;
  background: #ffffff;
  bottom: 0;
  position: fixed;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  opacity: 1;
  text-align: center;
  .text {
    width: 150px;
    height: 25px;
    font-size: 14px;
    font-weight: 500;
    line-height: 25px;
    color: #333333;
    opacity: 1;
  }
  .info {
    width: 110px;
    height: 38px;
    opacity: 1;
    border-radius: 41px;
  }
}
.content_list_bottom {
  height: 24px;
  text-align: center;
  color: #fff;
  font-size: 14px;
  font-weight: 300;
  margin-left: 10px;
}
.content {
  display: flex;
}

.content_center_bottom {
  font-size: 12px;
  font-weight: 300;

  color: #999999;
}

.content_center_top {
  color: #666666;
  margin-bottom: 15px;
  font-weight: 500;
  font-size: 16px;
}
.content_center {
  margin-left: 40px;
  margin-top: 32px;
}
.content_list_top {
  width: 92px;
  height: 56px;
  font-size: 40px;
  font-weight: 500;
  line-height: 56px;
  color: #ffffff;
  opacity: 1;
  margin-top: 20px;
  margin-left: 13px;
}
.radio {
  display: flex;
  width: 20px;
  height: 20px;
  margin-left: 12px;
}
.giftbag {
  display: flex;
  background-color: #fff;
}
.chgroup {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.chgroup:last-child {
  margin-bottom: 50px;
}
.giftItem {
  width: 315px;
  height: 107px;
  margin: 8px 14px;
  background-size: cover;
  background-repeat: inherit;
  position: relative;
  color: #666;
}
</style>
