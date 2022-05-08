<template>
  <div>
    <van-nav-bar
      :title="$route.meta.title"
      left-arrow
      fixed
      placeholder
      @click-right="onClickRight"
      @click-left="onClickLeft"
    >
      <template #right v-if="giftbagList.length !== 0 && listShow">
        <van-image
          v-if="isUserSign"
          width="62"
          height="24"
          :src="require('@/assets/images/my/icon_zun.png')"
        />
        <van-image
          v-if="!isUserSign"
          width="62"
          height="24"
          :src="require('@/assets/images/my/70@2x.png')"
        />
      </template>
    </van-nav-bar>
    <div class="taber">
      <div
        v-for="(item, index) in activeList"
        :key="index"
        @click="clickSwitch(item, index)"
      >
        <div :class="{ activeTop: listIndex === index }">
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="van-hairline--bottom"></div>
    <div class="giftBag" v-if="listIndex == 0 && listShow">
      <div v-for="item in giftbagList" :key="item.id">
        <div
          class="image"
          @click="gogiftcolumn(item)"
          :style="{ backgroundImage: 'url(' + backUrl[item.isActivate] + ')' }"
        >
          <div class="content">
            <div class="content_list">
              <div
                class="content_list_top"
                :style="{
                  backgroundColor: item.isActivate == 1 ? '#FFDCCF' : '#DDDDDD',
                  color: item.isActivate == 1 ? '#B83E15' : '#fff'
                }"
              >
                {{ item.isActivate == 1 ? '礼券福袋' : '未激活福袋' }}
              </div>
              <div
                class="content_list_texts"
                :style="{ color: item.isActivate == 1 ? '#EB6133' : '#fff' }"
              >
                <span>￥</span
                ><span style="font-size:40px">{{ item.giftAmount }}</span>
              </div>
              <div
                v-if="item.isActivate == 1"
                style="border-right:2px dashed #EB6133;height: 2.48648rem; margin-top: -2.10810rem;"
              ></div>
              <div
                v-if="item.isActivate !== 1"
                style="border-right:2px dashed #ffffff;height: 2.48648rem; margin-top: -2.10810rem;"
              ></div>
            </div>
            <div class="content_center">
              <div
                class="content_center_top"
                :style="{ color: item.isActivate == 1 ? '#EB6133' : '#666' }"
              >
                限福袋专区
              </div>
              <div class="content_center_bottom" v-if="item.isActivate">
                有效期至
                {{ $lance.parseTime(item.giftValidityEnd, '{y}-{m}-{d}') }}之前
              </div>
              <div class="content_center_bottoms" v-else>
                有效期至
                {{ $lance.parseTime(item.giftValidityEnd, '{y}-{m}-{d}') }}之前
              </div>
            </div>
            <div class="content_right">
              {{ item.isActivate == 1 ? '去使用' : '未激活' }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="giftBag" v-if="listIndex !== 0 && listShow">
      <div v-for="item in giftbagList" :key="item.id">
        <div
          class="image"
          :style="{
            backgroundImage: 'url(' + backUrl[listIndex + 1] + ')'
          }"
        >
          <div class="content">
            <div class="content_list">
              <div
                class="content_list_bottom"
                style="color: #fff;margin-top: 0.54054rem;"
              >
                <span
                  style="font-size: 20px; width: 1.35135rem; height: 0.05405rem;"
                  >￥</span
                >{{ item.giftAmount }}
              </div>
              <div class="text">礼券福袋</div>
            </div>
            <div class="content_center">
              <div
                class="content_center_top"
                :style="{ color: item.isActivate == 1 ? '#EB6133' : '#666' }"
              >
                限福袋专区
              </div>
              <div class="contentBottom" style="color: #999999;">
                {{ item.giftValidityStart }} 至 {{ item.giftValidityEnd }}之前
              </div>
              <van-image
                style="margin-top: -2.02702rem;
    margin-left: 2.83783rem;"
                width="90"
                height="90"
                :src="require('../../../../assets/images/my/tag_used@2x.png')"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="imageLength" v-if="giftbagList.length == 0 && listShow">
      <van-image
        width="206"
        height="142"
        :src="require('../../../../assets/images/my/icon_null.png')"
      />
      <div class="imageLength_text">还没有礼券福袋</div>
      <!-- <van-button
        round
        v-if="listIndex == 0"
        type="info"
        @click="torecharge"
        class="buttom_info"
        color="#ed6133"
        >去充值</van-button
      > -->
    </div>
    <div>
      <van-popup class="signIn" v-model="show">
        <van-image
          width="164"
          style="margin-top:24px"
          height="164"
          :src="require('../../../../assets/images/my/pic_paid@2x.png')"
        />
        <div class="signIn_text">
          已连续签到<span style="color: #ed6133;">{{
            currentsign.signCount
          }}</span
          >天
        </div>
        <van-button
          @click="toretroactive"
          round
          type="info"
          class="signIn_info"
          color="#ed6133"
          >确定</van-button
        >
        <div class="signIn_bon">
          累计签到{{ currentsigns.signDay }}天激活一张礼券福袋
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      backUrl: [
        'https://app-static.meitianhui.com/images/560d8705f37ffc2e250b719f403f3da7-2as2f72cj3.png',
        'https://app-static.meitianhui.com/images/5164406bf508fea1c227e9551bedd610-qxwmh4x0d4.png',
        'https://app-static.meitianhui.com/images/c6e7b92406fe0983e18d2339bd4eb0a6-ulfx6898tc.png',
        'https://app-static.meitianhui.com/images/a38898c1187e0f5fcc71e827dad8a7ea-pp687qfb1u.png'
      ],
      active: 0,
      activeList: [
        {
          name: '未使用',
          index: 1
        },
        {
          name: '使用记录',
          index: 2
        },
        {
          name: '已过期',
          index: 3
        }
      ],
      listIndex: 0,
      giftbagList: [],
      listShow: false,
      show: false,
      isUserSign: false,
      currentsign: {},
      currentsigns: {}
    }
  },
  created () {
    this.getGiftUse(this.listIndex)
    this.UserSign()
  },
  methods: {
    // 跳转查看
    toretroactive () {
      this.$router.push('/retroactive')
      this.show = false
    },
    userGiftSign () {
      var repaiTime = new Date().getTime()
      this.$http.post(
        this.$apiUri.APP_ISFIRSTIMESIGN,
        { repaiTime: repaiTime },
        res => {
          this.$toast('签到成功')
          this.userGift()
        }
      )
    },
    userGift () {
      this.$http.post(this.$apiUri.APP_GIFT, {}, res => {
        console.log(1, res)
        this.currentsign = res.data
        this.currentsigns = res.data.config
        // this.isUserSign = false
      })
    },
    // 是否签到
    UserSign () {
      this.$http.post(this.$apiUri.APP_ISUSERSIGN, {}, res => {
        if (res.success) {
          this.isUserSign = res.data
        }
      })
    },
    // 签到
    onClickRight () {
      if (this.isUserSign) {
        this.userGiftSign()
        return (this.show = true)
      } else {
        this.$toast('你已签到，无需重复签到')
        this.toretroactive()
      }
    },
    // 跳转购买
    torecharge () {
      this.$router.push('/recharge')
    },
    // 跳转礼包商城
    gogiftcolumn (v) {
      if (v.isActivate === 0) return
      let actCode = {
        code: 'mth_l3kra9zp'
      }
      this.$lance.setJson('actCode', actCode)
      this.$lance.setData('titleName', '福袋')

      this.$router.push('/brand')
    },
    // 查看使用和未使用和过期的礼包卷
    getGiftUse (index) {
      this.giftbagList = []
      console.log(1, index)
      this.$http.post(this.$apiUri.APP_GETGIFTUSE, { type: index }, res => {
        console.log(res)
        this.listShow = true
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
      })
    },
    onClickLeft () {
      this.$router.push('/my')
    },

    // 切换tabs
    clickSwitch (item, index) {
      if (this.listIndex === index) return
      this.listIndex = index
      this.listShow = false
      this.getGiftUse(this.listIndex)
    }
  }
}
</script>

<style lang="less" scoped>
.signIn_bon {
  height: 18px;
  font-size: 13px;
  font-weight: 300;
  line-height: 22px;
  color: #666666;
  opacity: 1;
}
.signIn_info {
  width: 248px;
  height: 40px;
  opacity: 1;
  margin-bottom: 12px;
}
.signIn_text {
  margin-top: 12px;
  margin-bottom: 12px;
}
.signIn {
  text-align: center;
  width: 300px;
  height: 324px;
  background: #ffffff;
  opacity: 1;
  border-radius: 8px;
}
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
  // min-height: calc(100vh - 0px);

  background-color: #fff;
  text-align: center;
  padding-top: 92px;
  padding-bottom: 180px;
}
.text {
  font-weight: 300;
  color: #fff;
  font-size: 14px;
  text-align: center;
}
.content_right {
  width: 16px;
  height: 62px;
  font-size: 16px;
  font-weight: 300;
  line-height: 20px;
  color: #ffffff;
  opacity: 1;
  margin-left: 66px;
  margin-top: 30px;
}
.content_center_bottoms {
  font-size: 12px;
  font-weight: 300;
  color: #666666;
}
.content_center_bottom {
  font-size: 12px;
  font-weight: 300;
  color: #b83e15;
}
.contentBottom {
  font-size: 12px;
  font-weight: 300;
  color: #b83e15;
}
.content_center_top {
  color: #eb6133;
  margin-bottom: 15px;
  font-weight: 500;
  font-size: 16px;
}
.content_center {
  margin-left: 20px;
  margin-top: 32px;
}
.content_list_texts {
  width: 92px;
  height: 56px;
  font-size: 20px;
  font-weight: 500;
  line-height: 56px;
  color: #eb6133;
  opacity: 1;
  margin-top: 15px;
  margin-left: 13px;
}
.content_list_bottom {
  width: 92px;
  height: 56px;
  font-size: 40px;
  font-weight: 500;
  line-height: 56px;
  color: #eb6133;
  opacity: 1;
  margin-top: 15px;
  margin-left: 13px;
}
.content_list_top {
  width: 86px;
  height: 19px;
  line-height: 19px;
  text-align: center;
  background-color: #ffdccf;
  color: #b83e15;
  font-size: 12px;
  font-weight: 300;
  opacity: 1;
  border-radius: 8px 0px 0px 0px;
}
.content_list {
  width: 120px;
}
.content {
  display: flex;
}
.giftBag {
  background-color: #fff;
  margin-bottom: 10px;
  margin-top: 12px;
}
.image {
  margin: 0 auto;
  width: 347px;
  height: 118px;
  background-size: cover;
  background-repeat: inherit;
  position: relative;
  color: #666;
  margin-bottom: 10px;
}
.taber {
  margin-top: -46px;
  height: 46px;
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.activeTop {
  color: #eb6132 !important;
  font-size: 18px !important;
  // border-bottom: 2px solid #eb6132 !important;
}
</style>
