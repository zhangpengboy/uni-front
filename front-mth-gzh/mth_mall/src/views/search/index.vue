<template>
  <div>
    <!-- vant搜索 -->
    <van-search
      @search="onSearch"
      autofocus
      show-action
      shape="round"
      v-model="kw"
      placeholder="请输入搜索关键词"
    >
      <template #left>
        <van-icon
          @click="back"
          style="margin-right: 0.13513rem;"
          size="0.59459rem"
          name="arrow-left"
        />
      </template>

      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
    </van-search>

    <!-- 搜索历史 -->
    <div v-show="isShow">
      <div class="search_i">
        <span>搜索历史</span>
        <van-icon class="del" name="delete-o" @click="del" />
      </div>

      <div>
        <van-tag v-for="item in kwList" :key="item" @click="searchTs(item)">{{
          item
        }}</van-tag>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      kw: '',
      isShow: true,
      list: [], // 所有数据
      showList: [], // 搜索提示数据
      kwList: [] // 搜索记录,
    }
  },
  created () {
    // 初始化保存
    let kwlist = localStorage.kwList
    if (kwlist) {
      this.kwList = JSON.parse(kwlist)
    }
  },

  methods: {
    back () {
      // 返回
      this.$router.back()
    },
    searchTs (item) {
      this.kw = item
      console.log(11, item)
      if (!this.kwList.includes(item)) {
        // 不会重复添加相同搜索记录
        this.kwList.push(item)
        localStorage.kwList = JSON.stringify(this.kwList)
      }
      this.onSearch()
    },
    onSearch () {
      // 确定搜索或点击搜索时触发
      if (this.kw.trim() === '') {
        // 判断内容是否为空
        return
      }
      if (!this.kwList.includes(this.kw.trim())) {
        // 不会重复添加相同搜索记录
        this.kwList.push(this.kw)
        localStorage.kwList = JSON.stringify(this.kwList)
      }
      this.$router.push({
        name: 'searchList',
        query: {
          kwList: this.kwList[0],
          kw: this.kw
        }
      })
    },
    del () {
      // 删除搜索记录
      this.$dialog
        .confirm({
          message: '确定要清空搜索记录吗？'
        })
        .then(() => {
          this.kwList = []
          localStorage.kwList = JSON.stringify(this.kwList)
        })
        .catch(() => {
          // on cancel
        })
    }
  }
}
</script>

<style lang="less" scoped>
.search_i {
  height: 21px;
  margin: 14px 14px 6px 14px;
  font-size: 15px;
  font-weight: 500;
  line-height: 21px;
  color: #333333;
  align-items: flex-end;
  opacity: 1;

  .del {
    margin-left: 72%;
    font-size: 18px;
  }
}
.van-tag {
  position: relative;
  display: inline-block;
  -webkit-box-align: center;
  align-items: center;
  color: #f2f2f2;
  margin: 10px;
  font-size: 13px;
  line-height: 21px;
  border-radius: 15px;
  padding-left: 10px;
  padding-right: 10px;
}
</style>
