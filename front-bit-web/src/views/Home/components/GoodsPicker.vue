<!--
 * @Author: Gmsoft - WeiHong Ran
 * @Date: 2021-03-23 20:34:12
 * @LastEditors : Please set LastEditors
 * @LastEditTime: 2021-03-24 11:33:25
 * @Description: Nothing
-->

<template>
  <div class="goods-layout">
    <div class="picker-body">
      <div class="goods-title">{{ title }}</div>
      <div class="goods-tags">
        <div v-for="tag in tagsStr" :key="tag" class="tags">{{ tag }}</div>
      </div>
      <div class="yield-rate">{{ yieldRate }}</div>
      <div class="yield-desc">{{ desc }}</div>
      <div class="progress-layout">
        <div class="progress-content">
          <el-progress
            :percentage="progress"
            :show-text="false"
            status="warning"
          ></el-progress>
        </div>
        <div class="progress-desc">已售：{{ progress }}%</div>
      </div>
    </div>
    <div class="picker-footer" :class="{ active: footerActive }">
      {{ footerContent }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'GoodsPicker',
  props: {
    title: {
      type: String,
      required: true,
    },
    tags: {
      type: [Array, String],
      required: true,
    },
    yieldRate: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    progress: {
      type: Number,
      required: true,
    },
    footerContent: {
      type: String,
      required: true,
    },
    footerActive: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    tagsStr() {
      if (typeof this.tags === 'string') {
        return [this.tags];
      }
      return this.tags;
    },
  },
});
</script>

<style lang="less" scoped>
.goods-layout {
  position: relative;
  margin: 0 10px;
  width: 33.3%;
  background-color: white;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  &:hover {
    transition: all 0.3s ease-in;
    transform: translateY(-4px);
    .picker-footer {
      transition: color .1s ease-in;
      background-color: #1e74e4;
      color: white;
    }
  }
  .picker-body {
    padding: 25px;
    .goods-title {
      padding-bottom: 20px;
      margin-bottom: 30px;
      border-bottom: 1px solid #e6e6e6;
      font-size: 18px;
      color: #333;
      text-align: center;
    }
    .goods-tags {
      text-align: center;
      .tags {
        display: inline-block;
        margin: 0 3px;
        background: #fb8e44;
        border-radius: 16px 16px 16px 0px;
        color: #fff;
        padding: 4px 12px;
        font-size: 14px;
        margin-left: 12px;
      }
    }
    .yield-rate {
      margin: 40px 0 20px;
      font-size: 30px;
      color: #1e74e4;
      text-align: center;
    }
    .yield-desc {
      font-size: 16px;
      color: #999;
      text-align: center;
      margin-bottom: 40px;
    }
    .progress-layout {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .progress-content {
        display: block;
        width: 60%;
      }
      .progress-desc {
        width: 35%;
        font-size: 14px;
        text-align: right;
      }
    }
  }
  .picker-footer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 24px;
    text-align: center;
    letter-spacing: 0.1em;
    color: #333;
    border-top: 1px solid #e9e9e9;
    cursor: pointer;
    transition: color .3s;
    &:hover,
    &.active {
      color: white;
      background-color: #1e74e4;
    }
  }
}
</style>
