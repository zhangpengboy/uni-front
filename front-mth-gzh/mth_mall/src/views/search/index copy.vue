<template>
  <div>
    <div class="search">
      <van-icon
        @click="tohome"
        style="width: 16px;height: 16px;margin: 21px 15px 0 5px;font-size:20px"
        name="arrow-left"
      />
      <van-search
        v-model="value"
        show-action
        placeholder="搜索你想要兑换的商品"
      >
        <template #action>
          <div @click="onSearch">搜索</div>
          <div>
            <div
              class="item"
              v-for="item in searchList"
              :key="item"
              @click="searchHistorys(item)"
            >
              <div class="items"></div>
            </div>
          </div>
        </template>
      </van-search>
    </div>
    <div>
      <div class="search_i">搜索历史</div>
      <div class="tags">
        <span>牙刷</span><span>电饭煲</span><span>无线蓝牙耳机</span
        ><span>洗衣液</span><span>洗衣液</span><span>洗衣液</span
        ><span>洗衣液</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: '',
      searchList: []
    }
  },
  methods: {
    onSearch () {
      this.$http.post(
        this.$apiUri.APP_NAMELIST,
        {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        res => {
          console.log(res)
        }
      )
    },
    tohome () {
      this.$router.push('/exchange')
    },
    searchHistorys (item) {
      this.searchText = item
    }
  }
}
</script>

<style lang="less" scoped>
.tags {
  margin-left: 10px;
  span {
    display: inline-block;
    padding: 5px;
    background: #f2f2f2;
    margin-right: 10px;
    border-radius: 78px;
    margin-top: 10px;
    font-size: 13px;
    color: #333333;
  }
}
.item {
  margin: 26px 28px;
  display: flex;
  flex-wrap: wrap;

  .items {
    padding: 0px 10px 32px 0px;
    box-sizing: border-box;
    width: 319px;
    font-size: 26px;
    font-weight: 300;
    color: #000;
  }
}
.search_i {
  width: 60px;
  height: 21px;
  margin: 14px 14px 6px 14px;
  font-size: 15px;
  font-weight: 500;
  line-height: 21px;
  color: #333333;
  opacity: 1;
}
.search {
  width: 375px;
  height: 64px;
  background: #ffffff;
  opacity: 1;
}
.van-search__content {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  padding-left: 0.32rem;
  background-color: #f7f8fa;
  border-radius: 25px;
}
.van-search {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  box-sizing: border-box;
  padding: 10px 0.32rem;
  background-color: #fff;
  margin-top: -35px;
  margin-left: 30px;
}
</style>
