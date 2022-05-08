<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-24 18:46:32
 * @Description : 视频播放组件
-->
<template>
  <div class="video-layout">
    <el-row :gutter="24">
      <el-col :span="8" class="video-item" v-for="(v, i) in items" :key="i">
        <div class="video-item-cover">
          <img
            class="video-item-cover__pic"
            src="@/assets/images/home/news-one.png"
          />
          <div class="video-item-caption">
            <i class="el-icon-video-play" @click="handlerPlay(v.url)"></i>
          </div>
        </div>
        <div class="video-item-title">
          {{ v.title }}
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { VideoConf } from '@/types/VideoConf';
export default Vue.extend({
  name: 'VideoPicker',
  props: {
    items: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  computed: {
    list() {
      return this.items as VideoConf[];
    },
  },
  methods: {
    handlerPlay(url: string): void {
      this.$emit('play', url);
    },
  },
});
</script>
<style lang="less" scoped>
.video-layout {
  .video-item {
    position: relative;
    margin-bottom: 48px;
    overflow: hidden;

    &-cover {
      background: #1e74e4;
      height: 224px;
      overflow: hidden;
      transition: all 0.3s;
      cursor: pointer;
      margin-bottom: 12px;

      &__pic {
        position: relative;
        opacity: 1;
        transition: all 0.4s;
        overflow: hidden;
      }
      &:hover {
        .video-item-cover__pic {
          opacity: 0.7;
          transform: scale(1.3);
        }
        .video-item-caption i {
          opacity: 1;
        }
      }
    }
    &-caption {
      position: absolute;
      width: 100%;
      height: 80%;
      transition: all 0.4s;
      top: 0;
      left: 0;

      i {
        position: absolute;
        font-size: 40px;
        color: #fff;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 1;
        transition: all 0.3s;
      }
    }
  }
}
</style>
