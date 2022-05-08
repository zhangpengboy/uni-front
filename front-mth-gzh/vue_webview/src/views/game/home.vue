<template>
  <div class="vaHome">
    <transition name="van-fade">
      <div
        v-if="BgSwitch"
        class="bgs"
        :style="'background-image:url(' + BgImg + ');'"
      ></div>
    </transition>
    <transition name="van-fade">
      <div
        v-if="!BgSwitch"
        class="bgs"
        :style="'background-image:url(' + BgImg2 + '); '"
      ></div>
    </transition>
    <!-- 文本内容 -->
    <div class="vaHomeCon">
      <div class="vaHomeTop">
        <div class="vaHomeTopIcon">
          <van-icon name="arrow-left" />
        </div>
        <div class="vaTitles">用户昵称的果园</div>
      </div>
      <!-- 芒果树/5200g -->
      <div class="vaHomeG">
        <div class="vaHomeG2">
          <div>
            <img width="100%" height="100%" :src="payImg" alt srcset />
          </div>
          <div>
            <span>爱情果/5200g</span>
          </div>
        </div>
      </div>
      <!-- 云 -->
      <transition v-if="BgSwitch" name="van-fade">
        <div class="vacloud">
          <img
            width="100%"
            height="100%"
            src="@/assets/images/cloud/云1.png"
            alt
            srcset
          />
        </div>
      </transition>
      <transition v-if="BgSwitch" name="van-fade">
        <div class="vacloud2">
          <img
            width="100%"
            height="100%"
            src="@/assets/images/cloud/云2.png"
            alt
            srcset
          />
        </div>
      </transition>
      <transition v-if="BgSwitch" name="van-fade">
        <div class="vacloud3">
          <img
            width="100%"
            height="100%"
            src="@/assets/images/cloud/云3.png"
            alt
            srcset
          />
        </div>
      </transition>
      <!-- 能量球 -->
      <vaBall></vaBall>
      <!-- 树 -->
      <div class="vatree">
        <div class="vatreeHd">
          <img
            width="100%"
            height="100%"
            src="@/assets/images/FruitTree/FruitTrees/树-中树（爱情树）.png"
            alt
          />
          <!-- 小草 -->
          <div class="vagrass">
            <img
              width="100%"
              height="100%"
              src="@/assets/images/icons/小草.png"
              alt
            />
          </div>
          <div class="horse">
            <img width="100%" height="100%" :src="imgs" alt srcset />
          </div>
          <!-- 浇水水壶  -->
          <div class="hofadeBox">
            <transition name="hofade">
              <div class="bottle" v-if="bottleFadeIns">
                <img
                  width="100%"
                  height="100%"
                  src="@/assets/images/icons/WateringCan/浇水水壶.png"
                  alt
                />
              </div>
            </transition>
            <div class="Waterings" v-if="bottleFadeInsWater">
              <img src="@/assets/gif/浇水动效.gif" alt />
            </div>
          </div>
        </div>
        <!-- 进度条 -->
        <div class="vatreeProgress" @click="BgIm">
          <div>
            <van-progress pivot-text color="#FEE90E" :percentage="70" />
          </div>
          <div :class="BgSwitch ? '' : 'co-fff'">
            您的果树还需浇
            <span :class="BgSwitch ? '' : 'co-yell'">38</span>
            次水就结果了
          </div>
        </div>
      </div>
      <!-- 底部 -->
      <div class="vaHomeFooter">
        <!-- 拜访好友 -->
        <div class="vaHomeFooterHd">
          <img src="@/assets/images/icons/拜访好友.png" alt />
        </div>
        <div class="vaHomeFooterFt">
          <ul>
            <li class="vaHomeFirst"  @click="DropshowPopup">
              <img
                width="100%"
                height="100%"
                src="@/assets/images/icons/种树-功能-领水滴.png"
                alt
              />
            </li>
            <li class="vaHomeLi">
              <div>
                <span>1080g</span>
              </div>
              <div @click="DropFadeIns">
                <img
                  width="100%"
                  height="100%"
                  src="@/assets/images/icons/种树-浇水.png"
                  alt
                />
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 水滴 -->
      <vaCollarDrop
        class="bg-f6"
        @onCross="onCross"
        :Dropshows="Dropshow"
      ></vaCollarDrop>
    </div>
  </div>
</template>

<script>
import vaBall from './components/vaBall'
import vaCollarDrop from './components/vaCollarDrop'
export default {
  components: {
    vaBall,
    vaCollarDrop
  },
  data () {
    return {
      images: [],
      imgs: require('@/assets/images/马-抬头.png'),
      payImg: require('@/assets/images/CollarDrop/icon_guoyuan_aitaolun.png'),
      // 水壶
      bottleFadeIns: false,
      bottleFadeInsWater: false,
      bottleFadeIn: true,
      BgImg: require('@/assets/images/背景.png'),
      BgImg2: require('@/assets/images/背景-夜晚.png'),
      // 早上为true
      BgSwitch: true,
      Dropshow: false
    }
  },
  created () {
    this.BgImgs()
  },
  methods: {
    DropshowPopup () {
      this.Dropshow = true
    },
    onCross (val) {
      this.Dropshow = val
    },
    // 夜景
    BgImgs () {
      var obj = new Date()
      var hour = obj.getHours()
      if (hour > 12) {
        this.BgSwitch = !this.BgSwitch
      }
    },
    // 切换
    BgIm () {
      this.BgSwitch = !this.BgSwitch
    },
    // 水壶
    DropFadeIns () {
      var that = this
      if (that.bottleFadeIn) {
        // 拒绝点击频繁
        that.bottleFadeIn = !that.bottleFadeIn
        that.bottleFadeIns = !that.bottleFadeIns
        setTimeout(() => {
          that.bottleFadeInsWater = !that.bottleFadeInsWater
          setTimeout(() => {
            that.bottleFadeInsWater = !that.bottleFadeInsWater
            that.bottleFadeIns = !that.bottleFadeIns
            that.bottleFadeIn = !that.bottleFadeIn
          }, 1200)
        }, 400)
      }
    },
    // 打赏几分钱也可以
    Jump () {
      this.$router.push({ path: '/home' })
    }
  }
}
</script>
<style lang='scss' scoped>
.bg-cc {
  background: #cccccc;
}
.vaHomeTop {
  position: relative;
  top: 0;
  width: 100%;
  height: 44px;
  line-height: 44px;
  padding: 10px 16px;
  font-size: 24px;
  box-sizing: border-box;
  color: #fff;
}
.vaHomeTopIcon {
  position: absolute;
  top: 0.1rem;
  z-index: 10000;
}
.vaTitles {
  position: relative;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 22px;
  text-align: center;
}

.vaHomeG {
  position: absolute;
  top: 44px;
  left: 18px;
  width: 146px;
  box-sizing: border-box;
}
.vaHomeG1 {
  display: flex;
  justify-content: flex-end;
}
.vaHomeG2 {
  width: 146px;
  height: 32px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 22px;
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 4px;
}
.vaHomeG2 > div:first-child {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 1);
  overflow: hidden;
  opacity: 0.8;
  margin-right: 3px;
}
.vaHomeG2 > div:last-child > span {
  font-size: 14px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(43, 134, 73, 1);
}
// 云
.vacloud,
.vacloud2,
.vacloud3 {
  position: absolute;
  z-index: -11;
}
.vacloud {
  top: 120px;
  left: 50%;
  width: 84px;
  height: 47px;
}
.vacloud2 {
  top: 200px;
  left: 0;
  width: 59px;
  height: 38px;
}
.vacloud3 {
  top: 260px;
  left: 80%;
  width: 50px;
  height: 29px;
}
// 树
.vatree {
  position: fixed;
  top: 50%;
  left: 50%;
  margin-left: -111px;
  margin-top: -100px;
  width: 222px;
  height: 205px;
  text-align: center;
  z-index: 1;
}
// 树边草
.vatreeHd {
  position: relative;
  z-index: 10;
  .vagrass {
    position: absolute;
    left: 86px;
    bottom: -0.5px;
    width: 26px;
    height: 13px;
  }
  .vagrass2 {
    position: absolute;
    left: 100px;
    bottom: -1px;
    width: 26px;
    height: 13px;
    z-index: -10;
    opacity: 0.9;
  }
  .horse {
    position: absolute;
    bottom: 1px;
    left: -8px;
    width: 34px;
    height: 38px;
  }
}
// 浇树
.vaWaters {
  z-index: 100;
  position: absolute;
  top: 160px;
  right: 100px;
}
.bottle {
  position: absolute;
  top: 146px;
  right: 0.5rem;
  width: 65px;
  height: 65px;
  transform: rotate(-45deg);
}
.hofade-enter,
.hofade-leave-to {
  opacity: 0;
  transform: translateX(120px);
  top: 50px;
}
.hofade-enter-active,
.hofade-leave-active {
  transition: all 0.4s ease;
}
// 水壶的水
.Waterings {
  position: absolute;
  bottom: -20px;
  right: 25px;
  width: 100px;
  height: 80px;
}
.Waterings > img {
  width: 100px;
  height: 100px;
  z-index: 1;
}
// 进度条
.vatreeProgress {
  margin-top: 41px;
}
.vatreeProgress > div:first-child {
  width: 120px;
  height: 10px;
  background: rgba(131, 75, 40, 1);
  border-radius: 10px;
  margin: 0 auto;
  padding: 2px;
  box-sizing: border-box;
}
.vatreeProgress > div:first-child > div {
  height: 100%;
  background: rgba(131, 75, 40, 1);
}
.vatreeProgress > div:last-child {
  height: 16px;
  font-size: 11px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(131, 75, 40, 1);
  line-height: 16px;
  margin-top: 4px;
}

// 底部
.vaHomeFooter {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 150px;
  padding: 2px 16px 18px;
  box-sizing: border-box;
  z-index: 2;
}
.vaHomeFooterHd {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 22px;
}
.vaHomeFooterHd > img {
  display: block;
  width: 80px;
  height: 100%;
}
.vaHomeFooterFt > ul {
  display: flex;
  justify-content: space-between;
}
.vaHomeFooterFt > ul > li {
  min-width: 50px;
  height: 55px;
}
.vaHomeFooterFt .vaHomeFirst > img{
  width: 54px;
  height: 54px;
}
.vaHomeLi {
  position: relative;
  width: 110px;
  min-width: 210px;
  max-width: 260px;
}
.vaHomeLi > div:first-child {
  position: absolute;
  top: 17px;
  height: 23px;
  line-height: 20px;
  padding-left: 10px;
  padding-right: 20px;
  background: rgba(45, 209, 244, 1);
  border-radius: 14px;
  border: 2px solid rgba(1, 155, 187, 1);
  z-index: -10;
  font-size: 12px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
  box-sizing: border-box;
}
.vaHomeLi > div:last-child {
  width: 64px;
  height: 64px;
  position: absolute;
  right: 0;
  top: -10px;
}
.vaHomeG1 > span {
  display: block;
  // width: 98px;
  padding: 0 12px;
  height: 20px;
  background: linear-gradient(
    180deg,
    rgba(255, 161, 201, 1) 0%,
    rgba(224, 67, 134, 1) 100%
  );
  border-radius: 10px;
  line-height: 20px;
  text-align: center;
  font-size: 12px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(255, 218, 234, 1);
  line-height: 16px;
}
.bgs {
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  left: 0;
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: -1000;
}
</style>
