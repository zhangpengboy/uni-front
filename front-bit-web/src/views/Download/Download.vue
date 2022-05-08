<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-22 11:38:17
 * @Description : APP下载
-->
<template>
  <div class="download">
    <section class="download-wrap wrap-one">
      <div class="container">
        <h1 class="wrap-one-title">
          全球领先的 <br />
          矿机租赁 | 算力交易平台
        </h1>
        <el-row :gutter="20" class="wrap-one-data">
          <el-col :span="8">
            <h2>10W <span>+</span></h2>
            <p>总用户</p>
          </el-col>
          <el-col :span="8">
            <h2>1.3亿 <span>+</span></h2>
            <p>交易额</p>
          </el-col>
          <el-col :span="8">
            <h2>10W <span>+</span></h2>
            <p>成交笔数</p>
          </el-col>
        </el-row>

        <div class="wrap-one-ewm">
          <img src="@/assets/images/download@2x.png" alt="" />
          <p>扫码下载移动端</p>
        </div>
      </div>
    </section>

    <section class="download-wrap wrap-two">
      <div class="container">
        <div class="wrap-two-content">
          <h1>合租挖矿</h1>
          <p>周期灵活 收益发放机智透明</p>
        </div>
      </div>
    </section>

    <section class="download-wrap wrap-three">
      <div class="container">
        <div class="wrap-three-content">
          <h1>合租挖矿</h1>
          <p>随存随取资金灵活周转 平台24小时服务保障</p>
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'Download',
  data() {
    return {};
  },
});
</script>
<style lang="less" scoped>
.download {
  &-wrap {
    height: 560px;

    &.wrap-one {
      background: #f6f6f6;

      .container {
        margin-bottom: 0;
        height: 100%;
        background-image: url('~@/assets/images/download/wrap-pic1@2x.png');
        background-repeat: no-repeat;
        background-size: 516px 532px;
        background-position: bottom right 50px;
      }

      .wrap-one-title {
        padding-top: 80px;
        font-size: 36px;
        line-height: 65px;
        font-weight: 600;
        margin-bottom: 20px;
      }
      .wrap-one-data {
        color: #1e74e4;
        padding-bottom: 22px;
        border-bottom: 2px solid #1e74e4;
        max-width: 480px;
        h2 {
          font-size: 36px;
          line-height: 60px;
        }
        p {
          font-size: 20px;
          line-height: 28px;
          padding-left: 10px;
        }
      }
      .wrap-one-ewm {
        margin-top: 30px;
        max-width: 100px;
        text-align: center;
        p {
          padding-top: 10px;
          font-size: 13px;
          line-height: 18px;
        }
      }
    }

    &.wrap-two {
      background-image: url('~@/assets/images/download/wrap-bg2@2x.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;

      .container {
        position: relative;
        margin-bottom: 0;
        height: 100%;
        background-image: url('~@/assets/images/download/wrap-pic2@2x.png');
        background-repeat: no-repeat;
        background-size: 438px 470px;
        background-position: bottom left 34px;
      }

      .wrap-two-content {
        max-width: 600px;
        position: absolute;
        right: 220px;
        top: 50%;
        transform: translateY(-50%);
        text-align: center;
        color: #fff;
        h1 {
          font-size: 40px;
          line-height: 56px;
          font-weight: 600;
          margin-bottom: 16px;
        }
        p {
          font-size: 36px;
          line-height: 50px;
        }
      }
    }

    &.wrap-three {
      background-image: url('~@/assets/images/download/wrap-bg3@2x.png');
      background-repeat: no-repeat;
      background-size: 222px 100%;
      background-position: left center;

      .container {
        position: relative;
        margin-bottom: 0;
        height: 100%;
        background-image: url('~@/assets/images/download/wrap-pic3@2x.png');
        background-repeat: no-repeat;
        background-size: 592px 504px;
        background-position: bottom right 34px;
      }

      .wrap-three-content {
        max-width: 450px;
        text-align: center;
        padding-top: 200px;
        h1 {
          font-size: 40px;
          line-height: 56px;
          font-weight: 600;
          margin-bottom: 16px;
        }
        p {
          font-size: 36px;
          line-height: 50px;
        }
      }
    }
  }
}
</style>
