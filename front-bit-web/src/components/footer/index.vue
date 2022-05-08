<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-22 12:44:43
 * @Description : 顶部Footer
-->
<template>
  <div class="app-footer">
    <div class="app-footer-content">
      <div class="links">
        <div class="title">友情链接：</div>
        <div class="links-list">
          <a
            :href="v.href"
            :target="v.isBlank ? '_blank' : ''"
            v-for="(v, i) in linkList"
            :key="i"
          >
            {{ v.name }}
          </a>
        </div>
      </div>
      <div class="homepage">
        <div class="homepage-services">
          <div class="main-wrap">
            <span class="main-wrap-title">关于我们</span>
            <a href="//" target="_blank" class="main-wrap-link">公司介绍</a>
            <a href="//" target="_blank" class="main-wrap-link">企业文化</a>
            <a href="//" target="_blank" class="main-wrap-link">发展历程</a>
          </div>
          <div class="main-wrap">
            <span class="main-wrap-title">产品中心</span>
            <a href="//" target="_blank" class="main-wrap-link">合租挖矿</a>
            <a href="//" target="_blank" class="main-wrap-link">合租算力</a>
            <a href="//" target="_blank" class="main-wrap-link">挖矿租赁</a>
          </div>
          <div class="main-wrap">
            <span class="main-wrap-title">新闻动态</span>
            <a href="//" target="_blank" class="main-wrap-link">公司新闻</a>
            <a href="//" target="_blank" class="main-wrap-link">行业动态</a>
          </div>
          <div class="main-wrap">
            <span class="main-wrap-title">APP下载</span>
            <img
              src="~@/assets/images/download@2x.png"
              class="main-wrap-code"
            />
          </div>
          <div class="main-wrap">
            <span class="main-wrap-title">添加客服号</span>
            <img
              src="~@/assets/images/download@2x.png"
              class="main-wrap-code"
            />
          </div>
        </div>
        <div class="homepage-consult">
          <h3 class="telphone">400-800-8820</h3>
          <p>客服工作时间：10:00~19:00</p>
        </div>
      </div>
    </div>
    <div class="app-footer-copyright">
      <span>
        Copyright © 2020-{{ new Date().getFullYear() }} www.Lanceyi.com All
        Rights Reserved.
      </span>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'AppFooter',
  data() {
    return {
      linkList: [
        { name: '掘金所', href: '/', isBlank: false },
        { name: '掘金所', href: '/product', isBlank: false },
        { name: '掘金所', href: '/', isBlank: false },
        { name: '掘金所', href: '/', isBlank: false },
        { name: '掘金所', href: '/', isBlank: false },
        { name: '掘金所', href: '/', isBlank: false },
        { name: '掘金所', href: '/', isBlank: false },
        { name: '掘金所', href: '/', isBlank: false },
      ],
    };
  },
});
</script>
<style lang="less">
.app-footer {
  position: relative;
  background: #ffffff;
  width: 100%;
  min-width: 1200px;
  height: auto;

  &-content {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    font-size: 14px;
    padding-top: 30px;
    padding-bottom: 30px;
    .links {
      display: flex;
      color: #666666;
      padding-bottom: 20px;
      border-bottom: 2px solid #e6e6e6;
      .title {
        width: 80px;
        padding-top: 5px;
      }
      &-list {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        a {
          color: #666666;
          text-decoration: none;
          padding: 5px 15px;
          &:hover {
            color: #1e74e4;
          }
        }
      }
    }

    .homepage {
      padding-top: 40px;
      display: flex;
      &-services {
        flex: 1;
        min-height: 100px;
        overflow: hidden;
        display: flex;
        padding-right: 80px;
        .main-wrap {
          width: 20%;
          &-title {
            display: block;
            text-align: left;
            line-height: 18px;
            font-size: 16px;
            color: #333333;
            font-weight: 550;
            letter-spacing: 0.44px;
            margin-bottom: 16px;
          }
          &-link {
            display: block;
            text-align: left;
            line-height: 22px;
            font-size: 13px;
            color: #999999;
            letter-spacing: 0.43px;
            text-decoration: none;
            transition: color 0.3s;
            &:hover {
              color: #1e74e4;
            }
          }
          &-code {
            display: block;
            width: 90px;
            height: 90px;
          }
        }
      }

      &-consult {
        width: 250px;
        .telphone {
          font-size: 36px;
          line-height: 50px;
          font-weight: 400;
        }
        p {
          font-size: 14px;
          line-height: 20px;
        }
      }
    }
  }
  // 版权
  &-copyright {
    background: #f6f6f6;
    height: 68px;
    line-height: 68px;
    text-align: center;
    color: #666;
    font-family: Arial;
    font-size: 14px;
    letter-spacing: 1px;
  }
}
</style>
