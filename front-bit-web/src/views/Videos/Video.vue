<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-20 18:55:24
 * @Description : 视频中心
-->
<template>
  <div class="video">
    <div class="video-banner">
      <p>video</p>
      <h1>视频中心</h1>
    </div>

    <div class="container">
      <!-- tabs 导航 -->
      <div class="container-wrap jms-tabs">
        <span
          class="jms-tabs-bar"
          :class="i === active ? 'active' : ''"
          v-for="(v, i) in navList"
          :key="i"
          @click="hanlderTab(i)"
        >
          {{ v.name }}
        </span>
      </div>

      <!-- 视频列表 -->
      <VideoPicker :items="navList[active].items" @play="playVideo" />
    </div>

    <!-- 视频弹窗 -->
    <el-dialog
      class="video-dialog"
      :visible.sync="dialogVisible"
      width="1200px"
      @close="closeVideo"
    >
      <video
        :src="videoUrl"
        autoplay="false"
        controls="controls"
        width="1200"
        height="675"
        class="video"
        ref="player"
      ></video>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import VideoPicker from '@/views/Videos/components/VideoPicker.vue';
import { TabsConf } from '@/types/TabsConf';
import { VideoConf } from '@/types/VideoConf';
export default Vue.extend({
  name: 'Video',
  components: {
    VideoPicker,
  },
  data() {
    return {
      active: 0 as number,
      navList: [
        {
          name: '公司介绍',
          items: [
            {
              url:
                'http://lzjt.kjsuo.cn/%E7%9F%BF%E9%87%91%E6%89%80%E5%AE%A3%E4%BC%A0%E7%89%87.mp4',
              title: '公司介绍',
            },
            {
              url:
                'http://lzjt.kjsuo.cn/%E7%9F%BF%E9%87%91%E6%89%80%E5%AE%A3%E4%BC%A0%E7%89%87.mp4',
              title: '公司介绍',
            },
          ] as VideoConf[],
        },
        {
          name: '产品简介',
          items: [
            {
              url: 'http://lzjt.kjsuo.cn/%E7%9F%BF%E9%87%91%E6%89%80%E5%AE%A3%E4%BC%A0%E7%89%87.mp4',
              title: '产品简介',
            },
            {
              url: 'http://lzjt.kjsuo.cn/%E7%9F%BF%E9%87%91%E6%89%80%E5%AE%A3%E4%BC%A0%E7%89%87.mp4',
              title: '产品简介',
            },
            {
              url: 'http://lzjt.kjsuo.cn/%E7%9F%BF%E9%87%91%E6%89%80%E5%AE%A3%E4%BC%A0%E7%89%87.mp4',
              title: '产品简介',
            },
            {
              url: 'http://lzjt.kjsuo.cn/%E7%9F%BF%E9%87%91%E6%89%80%E5%AE%A3%E4%BC%A0%E7%89%87.mp4',
              title: '产品简介',
            },
            {
              url: 'http://lzjt.kjsuo.cn/%E7%9F%BF%E9%87%91%E6%89%80%E5%AE%A3%E4%BC%A0%E7%89%87.mp4',
              title: '产品简介',
            },
          ] as VideoConf[],
        },
        {
          name: '矿产视频',
          items: [
            {
              url: 'http://lzjt.kjsuo.cn/%E7%9F%BF%E9%87%91%E6%89%80%E5%AE%A3%E4%BC%A0%E7%89%87.mp4',
              title: '矿产视频',
            },
            {
              url: 'http://lzjt.kjsuo.cn/%E7%9F%BF%E9%87%91%E6%89%80%E5%AE%A3%E4%BC%A0%E7%89%87.mp4',
              title: '矿产视频',
            },
            {
              url: 'http://lzjt.kjsuo.cn/%E7%9F%BF%E9%87%91%E6%89%80%E5%AE%A3%E4%BC%A0%E7%89%87.mp4',
              title: '矿产视频',
            },
          ] as VideoConf[],
        },
        {
          name: 'APP操作指南',
          items: [
            {
              url: 'http://lzjt.kjsuo.cn/%E7%9F%BF%E9%87%91%E6%89%80%E5%AE%A3%E4%BC%A0%E7%89%87.mp4',
              title: 'APP操作指南',
            },
            {
              url: 'http://lzjt.kjsuo.cn/%E7%9F%BF%E9%87%91%E6%89%80%E5%AE%A3%E4%BC%A0%E7%89%87.mp4',
              title: 'APP操作指南',
            },
            {
              url: 'http://lzjt.kjsuo.cn/%E7%9F%BF%E9%87%91%E6%89%80%E5%AE%A3%E4%BC%A0%E7%89%87.mp4',
              title: 'APP操作指南',
            },
            {
              url: 'http://lzjt.kjsuo.cn/%E7%9F%BF%E9%87%91%E6%89%80%E5%AE%A3%E4%BC%A0%E7%89%87.mp4',
              title: 'APP操作指南',
            },
            {
              url: 'http://lzjt.kjsuo.cn/%E7%9F%BF%E9%87%91%E6%89%80%E5%AE%A3%E4%BC%A0%E7%89%87.mp4',
              title: 'APP操作指南',
            },
            {
              url: 'http://lzjt.kjsuo.cn/%E7%9F%BF%E9%87%91%E6%89%80%E5%AE%A3%E4%BC%A0%E7%89%87.mp4',
              title: 'APP操作指南',
            },
            {
              url: 'http://lzjt.kjsuo.cn/%E7%9F%BF%E9%87%91%E6%89%80%E5%AE%A3%E4%BC%A0%E7%89%87.mp4',
              title: 'APP操作指南',
            },
            {
              url: 'http://lzjt.kjsuo.cn/%E7%9F%BF%E9%87%91%E6%89%80%E5%AE%A3%E4%BC%A0%E7%89%87.mp4',
              title: 'APP操作指南',
            },
            {
              url: 'http://lzjt.kjsuo.cn/%E7%9F%BF%E9%87%91%E6%89%80%E5%AE%A3%E4%BC%A0%E7%89%87.mp4',
              title: 'APP操作指南',
            },
            {
              url: 'http://lzjt.kjsuo.cn/%E7%9F%BF%E9%87%91%E6%89%80%E5%AE%A3%E4%BC%A0%E7%89%87.mp4',
              title: 'APP操作指南',
            },
            {
              url: 'http://lzjt.kjsuo.cn/%E7%9F%BF%E9%87%91%E6%89%80%E5%AE%A3%E4%BC%A0%E7%89%87.mp4',
              title: 'APP操作指南',
            },
            {
              url: 'http://lzjt.kjsuo.cn/%E7%9F%BF%E9%87%91%E6%89%80%E5%AE%A3%E4%BC%A0%E7%89%87.mp4',
              title: 'APP操作指南',
            },
            {
              url: 'http://lzjt.kjsuo.cn/%E7%9F%BF%E9%87%91%E6%89%80%E5%AE%A3%E4%BC%A0%E7%89%87.mp4',
              title: 'APP操作指南',
            },
          ] as VideoConf[],
        },
      ] as TabsConf[],
      dialogVisible: false,
      videoUrl: '' as string,
    };
  },
  methods: {
    /** tab切换 */
    hanlderTab(index: number) {
      this.active = index;
    },
    /** 立即播放 */
    playVideo(url: string) {
      this.dialogVisible = true;
      this.videoUrl = url;
    },
    /** 关闭视频 */
    closeVideo() {
      this.videoUrl = '';
      this.startVideo();
    },
    /** 视频播放\暂停 */
    startVideo() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const player = this.$refs.player as any;
      if (player.paused) {
        player.play();
      } else {
        player.pause();
      }
    },
  },
});
</script>
<style lang="less" scoped>
.video {
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
  .container {
    margin-bottom: 60px;
  }

  &-dialog {
    /deep/ .el-dialog__header,
    /deep/ .el-dialog__body {
      padding: 0;
    }
    /deep/ .el-dialog__headerbtn {
      z-index: 5000;
    }
  }
}
</style>
