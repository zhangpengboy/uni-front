<template>
  <div>
    <div class="home">
      <div class="box">
        <div class="img">
          <img src="@/assets/images/meith.png" alt="" />
          <van-search
            class="search"
            v-model="search"
            @click="searchs"
            placeholder="搜索地区、商品名称"
          />
        </div>
      </div>
    </div>
    <!-- 轮播图 -->
    <div class="swipe">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item
          v-for="(item, index) in swiperList"
          :key="index"
          @click="toSwiper(item)"
        >
          <van-image :src="item.image"></van-image>
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="componet">
      <div class="tabge">
        <van-tabs
          @change="change"
          color="#fff"
          v-model="name"
          title-active-color="#EB6133"
        >
          <div class="right" @click="$router.push('/screenapi')">
            <van-icon name="wap-nav" />
          </div>
          <van-tab v-for="item in tabList" :key="item.id" :title="item.name">
            <div
              style="display: flex;flex-wrap: wrap;justify-content:space-between;margin: 12px;"
            >
              <div
                class="boxlist"
                v-for="item in homeList"
                :key="item.id"
                @click="toDity(item)"
              >
                <div class="image">
                  <van-image
                    style="border-radius: 8px;;overflow: hidden;"
                    width="100%"
                    height="100%"
                    :src="item.goodsIcon"
                  />
                  <div class="text">
                    {{ item.goodsName }}
                  </div>
                  <div class="forson">
                    <span>{{ item.primaryCategoryName }}</span> |
                    <span>{{ item.secondaryCategoryName }}</span>
                  </div>
                  <div class="formoney">
                    <span>￥</span><span>{{ item.salePrice }}</span
                    ><del>{{ item.marketPrice }}</del>
                  </div>
                </div>
              </div>
            </div>
          </van-tab>
          <van-divider
            :style="{
              color: '#EB6132',
              borderColor: '#EB6132',
              padding: '0 16px'
            }"
          >
            没有更多了
          </van-divider>
        </van-tabs>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: '',
      hometowmCode: 'mth_2uyow1nn',
      search: '',
      swiperList: [],
      name: 0,
      tabList: [],
      homeList: [],
      queryParams: {
        code: '',
        pcode: 'mth_2uyow1nn',
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  watch: {
    $route (to, form) {
      if (form.path === '/screenapi') {
        this.tabList.map((item, index) => {
          if (item.code === this.$lance.getJson('code_key')) {
            this.queryParams.code = this.$lance.getData('code_key')
            console.log(333, this.$lance.getJson('code_key'))
            this.name = index
            console.log(555, this.name)
            this.$lance.clearStorage('code_key')
            this.getHomeGoodsList()
          }
        })
      }
    }
  },
  created () {
    this.slideshow()
    this.getHometownList()
  },

  methods: {
    // 点击跳转商品详情
    toDity (e) {
      this.$router.push({
        path: '/commodity',
        query: {
          dataIP: e.id
        }
      })
    },
    change (e) {
      this.queryParams.code = this.tabList[e].code
      this.getHomeGoodsList()
    },
    searchs () {
      this.$router.push('/search')
    },
    slideshow () {
      this.$http.post(
        this.$apiUri.APP_MIDLIST,
        { actCode: this.pcode, type: '1' },
        res => {
          this.swiperList = res.data
        }
      )
    },
    // 省
    getHometownList () {
      this.$http.post(
        this.$apiUri.APP_TOWNLIST,
        { actCode: this.hometowmCode },
        res => {
          if (res.success) {
            // res.data.unshift()
            this.tabList = res.data
            this.tabList.unshift({
              name: '推荐',
              code: '',
              pcode: 'mth_2uyow1nn'
            })
            this.queryParams.code = this.tabList[0].code
            this.queryParams.pcode = this.tabList[0].pcode
            this.getHomeGoodsList()
          }
        }
      )
    },
    // 商品列表
    getHomeGoodsList () {
      this.$http.post(this.$apiUri.APP_GOODSLIST, this.queryParams, res => {
        console.log(res)
        if (res.success) {
          this.homeList = res.data.list
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.van-icon {
  position: relative;
  display: inline-block;
  font: normal normal normal 0.37333rem/1 'vant-icon';
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  background-color: #fff;
  border-left: 1px solid #dedede;

  width: 41px;
}
.right {
  width: 40px;
  height: 32px;
  font-size: 28px;
  background-color: #fff;
  margin-top: -36px;
  margin-left: 334px;
}
.formoney {
  width: 28px;
  height: 21px;
  font-size: 15px;
  font-weight: 500;
  line-height: 21px;
  color: #eb6133;
  text-indent: 5px;

  opacity: 1;
  span:nth-child(1) {
    font-size: 12px;
  }
  del {
    margin-left: 5px;
    font-size: 11px;
    font-weight: 300;
    line-height: 16px;
    color: #999999;
    opacity: 1;
  }
}
.forson {
  font-size: 12px;
  font-weight: 300;
  line-height: 17px;
  color: #999999;
  opacity: 1;
  margin-top: 5px;
  text-indent: 5px;
  margin-bottom: 5px;
}
.text {
  width: 100%;
  height: 36px;
  padding-left: 5px;
  margin-top: 8px;
  font-size: 13px;
  font-weight: 300;
  color: #333333;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  white-space: normal !important;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.boxlist {
  width: 170px;
  height: 270px;
  background: #ffffff;
  box-shadow: 0px 1px 1px #efefef;
  opacity: 1;
  border-radius: 8px;
  margin: 8px 0 0px 0;
  .image {
    width: 170px;
    height: 170px;
    background: #ffc9e1;
    opacity: 1;
    border-radius: 8px 8px 0px 0px;
  }
}

.componet {
  width: 375px;
  height: 100%;
  margin-top: -48px;
  background: #f3f3f3;
  opacity: 1;
  border-radius: 16px 16px 0px 0px;
  .tabge {
    width: 100%;
    padding-top: 65px;
    margin-bottom: 60px;
  }
}

.swipe {
  width: 350px;
  height: 148px;
  margin-left: 13px;
  margin-top: -130px;
  .my-swipe {
    color: #fff;
    font-size: 20px;
    text-align: center;
    border-radius: 10px;
  }
}
.box {
  width: 100%;
  height: 48px;
  background: linear-gradient(180deg, #fee5e1 0%, #e4a8a5 100%);
  line-height: 48px;
  position: fixed;
  z-index: 99999;
}
.home {
  width: 100%;
  height: 191px;
  background: linear-gradient(180deg, #fee5e1 0%, #e4a8a5 100%);
  opacity: 1;
}
.img {
  width: 56px;
  height: 28px;
  margin-left: 12px;
  line-height: 1.77667rem;
}
.search {
  margin-left: 70px;
  width: 278px;
  margin-top: -60px;
  height: 38px;
  background: #ffffff;
  border: 1px solid #ec6033;
  opacity: 1;
  border-radius: 42px;
}
</style>
