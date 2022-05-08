<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-24 13:48:47
 * @Description : 新闻常规组件
-->

<template>
  <div class="news-layout">
    <div class="news-layout-time">
      <p class="month">{{ month }}</p>
      <p class="day">{{ day }}</p>
    </div>
    <div class="news-layout-body">
      <h3 class="news-title">{{ title }}</h3>
      <p class="news-desc">{{ desc }}</p>
    </div>
    <div class="news-layout-btn"><i class="el-icon-plus"></i></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import moment from 'moment';
export default Vue.extend({
  name: 'NewsWrap',
  props: {
    time: {
      type: Number,
      required: true,
      default: 0,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
  },
  computed: {
    month() {
      if (this.time === 0) {
        return '最近';
      }
      return moment(this.time).month() + 1 + '月';
    },
    day() {
      if (this.time === 0) {
        return '最新';
      }
      return moment(this.time).date();
    },
  },
});
</script>

<style lang="less" scoped>
.news-layout {
  width: 585px;
  min-height: 98px;
  position: relative;
  padding: 16px 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    transition: all 0.3s ease-in;
    transform: translateY(-3px);
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    .news-title {
      color: #1e74e4;
    }
    .news-layout-btn {
      color: #1e74e4;
      border: 1px solid #1e74e4;
    }
  }

  &-time {
    padding-right: 20px;
    border-right: 1px solid #e6e6e6;
    font-size: 13px;
    white-space: nowrap;
    text-align: center;
    .month {
      font-size: 13px;
      line-height: 18px;
      font-weight: 300;
    }
    .day {
      font-size: 24px;
      line-height: 44px;
      font-weight: 400;
    }
  }

  &-body {
    flex: 1;
    padding-left: 24px;
    margin-right: 10px;
    position: relative;
    overflow: hidden;
    .news-title {
      display: block;
      color: #535353;
      font-size: 16px;
      transition: color 0.15s;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      text-align: justify;
      margin-bottom: 16px;
    }
    .news-desc {
      display: block;
      color: #999;
      font-size: 14px;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-align: justify;
      overflow: hidden;
    }
  }

  &-btn {
    width: 24px;
    height: 24px;
    line-height: 22px;
    text-align: center;
    border: 1px solid #999;
    color: #999;
    transition: color 0.15s;
  }
}
</style>
