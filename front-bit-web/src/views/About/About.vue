<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-20 18:55:24
 * @Description : 关于我们
-->
<template>
  <div class="about">
    <div class="about-banner">
      <p>ABOUT US</p>
      <h1>关于我们</h1>
    </div>

    <!-- 公司简介 -->
    <section class="about-section bg-white">
      <div class="container">
        <div class="container-wrap">
          <h1 class="about-title">PLATFORM PROFILE</h1>
          <h1 class="about-title">公司简介</h1>
          <div class="about-body">
            <img src="@/assets/images/about/platform.jpg" />
            <p>
              掘金所——链正集团旗下全球领先的矿机租赁、算力交易平台，全球合作矿场八家，国内矿场主要分布在四川、新疆、内蒙古、云南等地，矿场总投资规模超10亿元，服务客户矿机数量超十万台。未来，矿金所将继续利用实体矿场结合互联网平台的技术优势，通过共享挖矿，提供客户更加丰富的资产管理服务，满足用户个性化需求，让更多人享受到简单、快捷、安全、放心的投资租赁服务。矿金所致力于为广大用户提供多种优质的矿机、算力、电力租赁组合产品，灵活实现个人资产配置，实现财富稳定增长。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 企业文化 -->
    <section class="about-section">
      <div class="container">
        <div class="container-wrap">
          <h1 class="about-title">COMPANY PROFILE</h1>
          <h1 class="about-title">企业文化</h1>
          <div class="about-body">
            <el-row>
              <el-col :span="6" v-for="(v, i) in companyItems" :key="i">
                <div class="bg-white about-company" v-if="!v.isTop">
                  {{ v.tag }}
                </div>
                <div class="bg-white about-company">
                  <img :src="v.pic" />
                </div>
                <div class="bg-white about-company" v-if="v.isTop">
                  {{ v.tag }}
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </section>

    <!-- 联系我们 -->
    <section class="about-section bg-white">
      <div class="container">
        <div class="container-wrap">
          <h1 class="about-title">CONTACT US</h1>
          <h1 class="about-title">联系我们</h1>
          <div class="about-body">
            <div class="about-form">
              <el-form ref="form" :model="form" label-width="0">
                <el-form-item>
                  <el-input v-model="form.name" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input
                    v-model="form.phone"
                    placeholder="手机号"
                  ></el-input>
                </el-form-item>

                <el-form-item>
                  <el-input
                    type="textarea"
                    v-model="form.desc"
                    :autosize="{ minRows: 8, maxRows: 10 }"
                    placeholder="需求描述"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <span class="about-form-btn">提交信息</span>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
interface CompanyConf {
  /** 标签 */
  tag: string;
  /** 图片 */
  pic: string;
  /** 图片位置 */
  isTop: boolean;
}
export default Vue.extend({
  name: 'About',
  components: {},
  data() {
    return {
      companyItems: [
        {
          tag: '诚笃务实',
          pic: require('@/assets/images/about/company-1.png'),
          isTop: false,
        },
        {
          tag: '开放包容',
          pic: require('@/assets/images/about/company-2.png'),
          isTop: true,
        },
        {
          tag: '以人为本',
          pic: require('@/assets/images/about/company-3.png'),
          isTop: false,
        },
        {
          tag: '共创共享',
          pic: require('@/assets/images/about/company-4.png'),
          isTop: true,
        },
      ] as CompanyConf[],
      form: {
        name: null,
        phone: null,
        desc: null,
      },
    };
  },
  mounted() {},
  methods: {},
});
</script>
<style lang="less" scoped>
.about {
  &-banner {
    height: 420px;
    background: url('~@/assets/images/video/bg-banner.png') no-repeat;
    background-size: cover;
    color: #fff;
    text-align: center;
    p {
      padding-top: 200px;
      font-size: 22px;
      color: #f8f8f8;
      margin-bottom: 14px;
    }
    h1 {
      font-size: 42px;
    }
  }

  .about-title {
    text-align: center;
    font-size: 24px;
    line-height: 33px;
    margin-bottom: 10px;
  }
  .about-body {
    padding-top: 60px;
    padding-bottom: 60px;
    font-size: 14px;
    line-height: 26px;

    p {
      text-indent: 2em;
      text-align: justify;
    }
  }

  img + p {
    margin-top: 12px;
  }

  &-section {
    padding-top: 80px;
    padding-bottom: 20px;
    margin-bottom: 0;
  }

  &-company {
    height: 168px;
    font-size: 34px;
    text-align: center;
    line-height: 168px;
    font-weight: 600;
  }

  &-form {
    width: 800px;
    height: 480px;
    background: #ffffff;
    border: 1px solid #e6e6e6;
    box-shadow: 4px 4px 10px #e8ebf1;
    opacity: 1;
    border-radius: 4px;
    margin: 0 auto;
    padding: 60px 80px;
    text-align: center;

    &-btn {
      height: 48px;
      line-height: 48px;
      background: #1e74e4;
      opacity: 1;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 300;
      line-height: 20px;
      color: #ffffff;
      text-align: center;
      padding: 14px 52px;
      cursor: pointer;
    }
  }
}
</style>
