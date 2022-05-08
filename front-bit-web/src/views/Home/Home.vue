<!--
 * @Author: Gmsoft - WeiHong Ran
 * @Date: 2021-03-21 12:42:47
 * @LastEditors : Please set LastEditors
 * @LastEditTime: 2021-03-27 14:19:56
 * @Description: Nothing
-->
<template>
  <div class="home">
    <!-- 轮播图 -->
    <el-carousel :interval="5000" arrow="always" height="640px">
      <el-carousel-item
        v-for="(v, i) in bannerList"
        :key="i"
        :style="{
          background: `url(${v.bg}) no-repeat`,
          backgroundSize: 'cover',
        }"
      >
        <div class="inner">
          <h2 class="title">{{ v.title }}</h2>
          <h3 class="sub-title">{{ v.subTitle }}</h3>
          <p class="desc">{{ v.desc }}</p>
          <router-link tag="span" :to="v.link" class="btn">
            立即购买
          </router-link>
          <img :src="v.img" class="img" />
        </div>
      </el-carousel-item>
    </el-carousel>

    <!-- 优势展示 -->
    <div class="container">
      <el-row class="container-wrap home-row">
        <el-col
          :span="6"
          class="home-col"
          v-for="(v, i) in advantageList"
          :key="i"
        >
          <div class="home-col-icon"><img :src="v.icon" /></div>
          <h3 class="home-col-title">{{ v.title }}</h3>
          <p class="home-col-desc">{{ v.desc }}</p>
        </el-col>
      </el-row>
    </div>

    <!-- 限时抢购 -->
    <div class="container">
      <div class="jms-title">限时抢购</div>
      <div class="container-wrap jms-flex">
        <div class="jms-left-box">
          <div class="bg-img">
            <img src="@/assets/images/home/bg-new@2x.png" alt="" />
          </div>
          <div class="content">
            <p class="title">新人专享</p>
            <span class="btn">立即注册</span>
          </div>
        </div>
        <div class="jms-right-box">
          <div class="content">
            <div class="name">
              合租挖矿新手体验包
              <span class="tips">限投一次</span>
              <span class="tips">新手包</span>
            </div>
            <div class="product">
              <div class="product-item">
                <p class="label">预期年化收益</p>
                <h2 class="value income color-main">6.00%</h2>
                <div class="line"></div>
                <p class="label">服务期限</p>
                <h2 class="value">30天</h2>
              </div>
              <div class="product-item">
                <p class="label">起投金额</p>
                <h2 class="value money">1000CNY</h2>
                <div class="line"></div>
                <p class="label">已售：40%</p>
                <div class="progress">
                  <el-progress
                    :show-text="false"
                    :stroke-width="6"
                    :percentage="40"
                    status="warning"
                  ></el-progress>
                </div>
              </div>
            </div>
          </div>
          <div class="from">
            <div class="from-label">认证金额</div>
            <el-input
              placeholder="起购金额为1000且是100的倍数"
              size="large"
            ></el-input>
            <el-button
              type="primary"
              :disabled="!checked"
              class="btn-buy"
              size="large"
              >立即购买</el-button
            >
            <p>
              <el-checkbox v-model="checked">
                我已阅读并同意
                <el-link type="primary">《主要链接》</el-link>
              </el-checkbox>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 投标专区 -->
    <div class="container">
      <div class="jms-title">投标专区</div>
      <div class="container-wrap jms-flex">
        <div class="jms-left-box">
          <div class="tender-bg-img">
            <img src="@/assets/images/home/bg-bit@2x.png" alt="" />
          </div>
          <div class="content">
            <p class="title">合租挖矿</p>
            <span class="btn">查看更多</span>
          </div>
        </div>
        <div class="jms-right-box tender-layout">
          <goods-picker
            :title="'矿场720精选合租挖矿'"
            :tags="['押金保障', '押金保障2']"
            :yieldRate="'18.50%'"
            :desc="'预期年化收益率'"
            :progress="25"
            :footerContent="'1000起投'"
            :footerActive="false"
          />
          <goods-picker
            :title="'矿场720精选合租挖矿'"
            :tags="'押金保障'"
            :yieldRate="'18.50%'"
            :desc="'预期年化收益率'"
            :progress="75"
            :footerContent="'1000起投'"
          />
          <goods-picker
            :title="'矿场720精选合租挖矿'"
            :tags="'押金保障'"
            :yieldRate="'18.50%'"
            :desc="'预期年化收益率'"
            :progress="50"
            :footerContent="'1000起投'"
          />
        </div>
      </div>
    </div>

    <!-- 云算力 -->
    <div class="cloud-bg" :style="style">
      <div class="container">
        <cloud-calc :items="calcItems" />
      </div>
    </div>

    <!-- 新闻咨询 -->
    <div class="home-news">
      <div class="container">
        <div class="jms-title">
          <span>投标专区</span>
          <el-link type="info" :underline="false" class="jms-title-link">
            查看更多 <i class="el-icon-arrow-right"></i>
          </el-link>
        </div>
        <div class="container-wrap">
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="home-news-one">
                <el-image
                  :src="require('@/assets/images/home/news-one.png')"
                  fit="fill"
                  :lazy="true"
                ></el-image>
                <div class="content">
                  <p class="content-time">
                    {{ moment().format('YYYY.MM.DD') }}
                  </p>
                  <h3 class="content-title">热列庆祝公司新网站完成更新！</h3>
                  <p class="content-desc">
                    热列庆祝公司新网站完成更新！热列庆祝公司新网站完成更新！热列热列庆祝公司新网站完成更新！热列庆祝公司新网站完成更新！热列
                  </p>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <NewsWrap
                :time="1616568106291"
                title="热列庆祝公司新网站完成更新！"
                desc="热列庆祝公司新网站完成更新！热列庆祝公司新网站完成更新！热列庆祝公司新网站完成更新！"
                v-for="(v, i) in 5"
                :key="i"
              />
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <!-- app 下载 -->
    <div class="home-app">
      <div class="container">
        <div class="jms-title">APP下载</div>
        <div class="container-wrap" :style="appStyle">
          <div class="home-app-content">
            <div class="home-app-links">
              <div class="home-app-ios">
                <img src="@/assets/images/iphone@2x.png" alt="" />
                <span>App Store 下载</span>
              </div>
              <div class="home-app-android">
                <img src="@/assets/images/android@2x.png" alt="" />
                <span>Android 下载</span>
              </div>
            </div>
            <div class="home-app-tips">
              全新版本、全新界面、全新产品，只为让您的财富稳定增长
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import moment from 'moment';
import GoodsPicker from '@/views/Home/components/GoodsPicker.vue';
import NewsWrap from '@/views/Home/components/NewsWrap.vue';
import CloudCalc from '@/views/Home/components/CloudCalc.vue';
import { BannerType } from '@/types/BannerType';
import { CloudItem } from '@/types/CloudItem';
export default Vue.extend({
  name: 'Home',
  components: {
    GoodsPicker,
    NewsWrap,
    CloudCalc,
  },
  data() {
    return {
      advantageList: [
        {
          icon: require('@/assets/images/home/icon-1@2x.png'),
          title: '专业运营',
          desc: '提供更多增值服务',
        },
        {
          icon: require('@/assets/images/home/icon-2@2x.png'),
          title: '技术护航',
          desc: '提供产品专业维护',
        },
        {
          icon: require('@/assets/images/home/icon-3@2x.png'),
          title: '集团支持',
          desc: '链正集团财务支撑',
        },
        {
          icon: require('@/assets/images/home/icon-4@2x.png'),
          title: '实力保障',
          desc: '大型矿场电力优势',
        },
      ] as CloudItem[],
      style: {
        backgroundImage: `url(${require('@/assets/images/home/bg-hashrate@2x.png')})`,
      },
      bannerList: [
        {
          bg: require('@/assets/images/banner@2x.png'),
          title: 'S19云矿机1',
          subTitle: '性能之王  全新升级',
          desc: '全新的固件设计，使矿机启动速度更快、性能更稳、调控机制更智能',
          link: '/product?id=1',
          img: require('@/assets/images/product@2x.png'),
        },
        {
          bg: require('@/assets/images/banner@2x.png'),
          title: 'S19云矿机2',
          subTitle: '性能之王  全新升级',
          desc: '全新的固件设计，使矿机启动速度更快、性能更稳、调控机制更智能',
          link: '/product?id=2',
          img: require('@/assets/images/product@2x.png'),
        },
        {
          bg: require('@/assets/images/banner@2x.png'),
          title: 'S19云矿机3',
          subTitle: '性能之王  全新升级',
          desc: '全新的固件设计，使矿机启动速度更快、性能更稳、调控机制更智能',
          link: '/product?id=3',
          img: require('@/assets/images/product@2x.png'),
        },
      ] as BannerType[],
      calcItems: [
        {
          icon: require('@/assets/images/home/guid.png'),
          title: '对于新手玩家',
          desc: '快速入门、价格低廉、操作便捷',
        },
        {
          icon: require('@/assets/images/home/profession.png'),
          title: '对于专业玩家',
          desc: '稳定运营、专业服务、高挖矿收益',
        },
        {
          icon: require('@/assets/images/home/expert.png'),
          title: '对于挖矿大户',
          desc: '平台高保障，提供一键式代理挖矿服务',
        },
      ] as CloudItem[],
      checked: false,
      appStyle: {
        backgroundImage: `url(${require('@/assets/images/home/app-bg@2x.png')})`,
        backgroundSize: 'cover',
        height: '337px',
        position: 'relative',
      },
    };
  },
  computed: {},
  mounted() {},
  methods: {
    moment,
  },
});
</script>
<style lang="less" scoped>
@import '~@/assets/less/home';
</style>
