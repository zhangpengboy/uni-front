<template>
  <div>
    <div class="CollarDrop">
      <van-popup
        class="bg-f6"
        v-model="Dropshows"
        round
        position="bottom"
        :style="{ height: '75%' }"
      >
        <div class="CollarDropHd">
          <div class="Cotitle">领水滴</div>
          <div @click="onCross">
            <van-icon name="cross" />
          </div>
        </div>
        <div class="CollarDropCon">
          <ul>
            <!-- 早中晚限时水滴 -->
            <li class="LimitedWater bg-ff">
              <ul>
                <li>
                  <img width="100%" height="100%" :src="xianhsi" alt srcset />
                </li>
                <li>
                  <h3>早中晚限时水滴</h3>
                  <div class="watimes">5点20分；13点14分；20点20分</div>
                  <div>
                    每次生成20g水滴，请您及时领取，否则好友可能会代您领取
                  </div>
                </li>
                <li>
                  <!-- 倒计时 -->
                  <div v-if="waTimeOff" class="watButton" @click="watReceive">
                    领取
                  </div>
                  <div v-else class="waTimeBt">
                    <van-count-down @finish="wafinish" :time="watime" />
                  </div>
                  <div>
                    剩余
                    <span class="co-lan">4g</span>水滴
                  </div>
                </li>
              </ul>
            </li>
            <!-- 3 -->
            <li class="waBox">
              <ul>
                <li>
                  <img width="100%" height="100%" :src="yaoqing" alt srcset />
                </li>
                <li class="waBoxCon">
                  <div>我要打赏</div>
                  <div>制作不易，谢谢的你支持</div>
                </li>
                <li @click="Jump">
                  <div class="BoxBt">去打赏</div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </van-popup>
    </div>
    <!-- 弹窗 -->
    <van-popup class="Washows" v-model="Washow">
      <div class="WashowBox">
        <img src="@/assets/images/CollarDrop/水滴.png" alt />
        <div class="co-lan">领取到10g水滴</div>
        <div class="WashowBoxBt" @click="WashowPup">
          <van-button round type="info">确定</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'vaCollarDrop',
  components: {},
  props: {
    Dropshows: Boolean
  },
  data () {
    return {
      waTimeOff: true,
      watime: 3 * 60 * 60 * 1000,
      Washow: false,
      Dropshow: this.Dropshows,
      xianhsi: require('@/assets/images/CollarDrop/icon_guoyuan_xianhsi.png'),
      yaoqing: require('@/assets/images/CollarDrop/icon_guoyuan_yaoqing.png'),
      yiqishow: require('@/assets/images/CollarDrop/icon_guoyuan_yiqishow.png')
    }
  },
  watch: {
    Dropshows (val, newval) {
      if (newval) {
        this.$emit('onCross', false)
      }
    }
  },
  methods: {
    onCross () {
      this.$emit('onCross', false)
    },
    watReceive () {
      this.Washow = true
    },
    // 弹窗确认
    WashowPup () {
      this.Washow = false
      // 时间开关
      this.waTimeOff = false
    },
    // 倒计时结束
    wafinish () {
      this.waTimeOff = true
    },
    // 打赏几分钱也可以
    Jump () {
      this.$router.push({ path: '/home' })
    }
  }
}
</script>
<style lang='scss' scoped>
// 水滴弹窗
.van-popup--bottom.van-popup--round {
  border-radius: 0.36rem 0.36rem 0 0;
}
.CollarDropHd {
  position: fixed;
  width: 375px;
  height: 47px;
  line-height: 47px;
  background: rgba(246, 246, 246, 1);
  text-align: center;
}
.CollarDropHd > .Cotitle {
  font-size: 14px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}
.CollarDropHd > div:last-child {
  position: absolute;
  top: 0.1rem;
  right: 16px;
  font-size: 20px;
  color: #999999;
}
// 内容
.CollarDropCon {
  margin-top: 47px;
  width: 100%;
}
// 早中晚限时水滴
.LimitedWater {
  width: 343px;
  height: 99px;
  background: rgba(255, 255, 255, 1);
  border-radius: 12px;
  margin: 0 auto 16px;
  box-sizing: border-box;
  padding: 10px;
}
.LimitedWater > ul {
  display: flex;
  height: 100%;
}
.LimitedWater > ul > li:first-child {
  margin-right: 8px;
  margin-top: 7px;
  img {
    display: block;
    width: 40px;
    height: 40px;
  }
}
.LimitedWater > ul > li:nth-child(2) {
  width: 200px;
  height: 34px;
  line-height: 17px;
  h3 {
    height: 22px;
    font-size: 16px;
    font-family: PingFang-SC-Bold, PingFang-SC;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    line-height: 22px;
  }
}
.LimitedWater > ul > li:nth-child(2) > .watimes {
  height: 17px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #666666;
  line-height: 17px;
  margin: 4px 0 2px;
}
.LimitedWater > ul > li:nth-child(2) > div:last-child {
  width: 200px;
  height: 34px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(240, 177, 140, 1);
  line-height: 17px;
}
// 按钮
.LimitedWater > ul > li:last-child {
  margin-top: 28px;
  margin-left: 0.2333rem;
}
.LimitedWater > ul > li:last-child > div:last-child {
  height: 17px;
  font-size: 11px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 17px;
}
//
.watButton {
  height: 24px;
  background: rgba(0, 167, 240, 1);
  border-radius: 14px;
  line-height: 24px;
  text-align: center;
  color: #fff;
  cursor: pointer;
  margin: 0 auto 2px;
}
// time
.waTimeBt {
  width: 64px;
  height: 24px;
  background: rgba(0, 167, 240, 0.2);
  border-radius: 14px;
  text-align: center;
}
.waTimeBt .van-count-down {
  font-size: 11px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(0, 167, 240, 0.7);
  line-height: 24px;
}
// 邀请新用户
.waBox {
  width: 343px;
  height: 73px;
  background: rgba(255, 255, 255, 1);
  border-radius: 12px;
  margin: 0 auto 16px;
  box-sizing: border-box;
  padding: 15px 10px;
}
.waBox > ul {
  display: flex;
}
.waBox > ul > li:first-child {
  width: 40px;
  height: 40px;
  margin-top: 2px;
  margin-right: 14px;
}
.waBoxCon {
  width: 200px;
  box-sizing: border-box;
}
.waBoxCon > div:first-child {
  height: 22px;
  font-size: 16px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  line-height: 22px;
  margin-bottom: 4px;
  span {
    height: 17px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 17px;
  }
}
.waBoxCon > div:last-child {
  height: 17px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  line-height: 17px;
}
.BoxBt {
  width: 64px;
  height: 24px;
  background: rgba(241, 132, 27, 1);
  border-radius: 14px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 24px;
  text-align: center;
  cursor: pointer;
  margin-top: 10px;
}
.Washows {
  width: 280px;
  height: 280px;
  background: rgba(255, 255, 255, 1);
  border-radius: 12px;
  box-sizing: border-box;
  margin: 0 auto;
  text-align: center;
  padding: 23px 0;
}
// 弹窗
.WashowBox {
}
.WashowBox > img {
  display: block;
  width: 120px;
  height: 121px;
  margin: 0 auto 10px;
}
.WashowBox > .co-lan {
  height: 22px;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 167, 240, 1);
  line-height: 22px;
  margin: 0 auto 34px;
}
.WashowBoxBt {
  width: 128px;
  height: 40px;
  margin: 0 auto;
}
.WashowBoxBt .van-button--round {
  width: 100%;
  height: 100%;
  line-height: 100%;
  font-size: 16px;
}
</style>
