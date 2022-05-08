<template>
  <div class="exchange">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <!-- 礼券兑主页导航 -->
      <div class="home" :style="{ background: backgroundColor }">
        <div class="box" :style="{ background: backgroundColor }">
          <div class="img">
            <img src="@/assets/images/meith.png" alt="" />
            <van-search
              class="search"
              v-model="search"
              @click="searchs"
              placeholder="搜索你想要兑换的商品"
            />
          </div>
        </div>
        <!-- 轮播图 -->
        <div class="swipe">
          <van-swipe
            class="my-swipe"
            :autoplay="2000"
            indicator-color="white"
            @change="onChange"
          >
            <van-swipe-item
              v-for="(item, index) in swiperList"
              :key="index"
              @click="toSwiper(item)"
            >
              <van-image
                :src="item.image"
                fit="fill"
                width="100%"
                height="4rem"
                lazy-load
              ></van-image>
              <!-- <img
                v-lazy="item.image"
                width="100%"
                height="100%"
                style="border-radius: 10px;"
                /> -->
            </van-swipe-item>
          </van-swipe>
        </div>
      </div>

      <!-- 品牌兑换 -->
      <div class="content">
        <div class="tag">
          <div
            v-for="(item, index) in taglist.slice(0, 3)"
            :key="index"
            @click="togoodsList(item, index)"
          >
            <van-image width="1.28rem" height="1.28rem" :src="item.icon" />
            <p>{{ item.name }}</p>
          </div>
        </div>
        <!-- 每日上新 -->
        <div v-if="everyday.length > 0">
          <div class="everyday">
            <div class="title">
              <p class="p">{{ everyday[0].actInfo.name }}</p>
              <p @click="gotoActivity(everyday[0].actInfo)" class="gd">
                查看更多<van-icon name="arrow" size="0.35135rem" />
              </p>
            </div>

            <div class="gather">
              <div
                class="image"
                v-for="(v, i) in everyday[0].actData"
                :key="i"
                @click="toDity(v)"
              >
                <van-image
                  width="1.94596rem"
                  height="1.94596rem"
                  :src="v.goodsIcon"
                />
                <!-- <div class="cash">
                  ￥{{ v.salePrice }}+{{ v.integral
                  }}<span style="font-size:8px;">礼券</span>
                </div>
                <del style="font-size: 10px; font-weight: 300;color: #999999;"
                  >￥{{ v.marketPrice }}</del
                > -->
                <div class="price text-price text-main fs-12 fw-700">
                  <span>{{ v.salePrice }}</span>
                  <template v-if="v.integral > 0">
                    <span class="text-xs">{{
                      v.integralType | filterIntegralType
                    }}</span>
                    <span>{{ v.integral }}</span>
                    <span class="text-xs">{{ $lance.getIntegralName() }}</span>
                  </template>
                </div>
                <!-- <span class="text-marketPrice">{{ `¥ ${v.marketPrice}` }}</span> -->
              </div>
            </div>
          </div>
          <!-- 热门兑换 -->
          <div class="everyday">
            <div class="title">
              <p class="p">{{ everyday[1].actInfo.name }}</p>
              <p @click="gotoActivity(everyday[1].actInfo)" class="gd">
                查看更多<van-icon name="arrow" size="0.35135rem" />
              </p>
            </div>
            <div
              class="gather"
              v-if="everyday.length > 1 && everyday[1].actData"
            >
              <div
                class="image"
                v-for="(v, i) in everyday[1].actData"
                :key="i"
                @click="toDity(v)"
              >
                <van-image
                  width="1.94595rem"
                  height="1.94595rem"
                  :src="v.goodsIcon"
                />
                <div class="mark" :style="markList[i].bg">
                  {{ markList[i].id }}
                </div>
                <div class="price text-price text-main fs-12 mtf fw-700">
                  <span>{{ v.salePrice }}</span>
                  <template v-if="v.integral > 0">
                    <span class="text-xs">{{
                      v.integralType | filterIntegralType
                    }}</span>
                    <span>{{ v.integral }}</span>
                    <span class="text-xs">{{ $lance.getIntegralName() }}</span>
                  </template>
                </div>
                <!-- <span class="text-marketPrice">{{ `¥ ${v.marketPrice}` }}</span> -->
              </div>
            </div>
            <!-- 大牌钜惠 -->
            <div class="two">
              <div
                class="left"
                v-if="everyday.length > 2 && everyday[2].actData"
                @click="gotoActivity(everyday[2].actInfo)"
              >
                <p>{{ everyday[2].actInfo.name }}</p>
                <div class="bt image">
                  <van-image
                    class="ml-1"
                    v-for="(v, i) in everyday[2].actData.slice(0, 2)"
                    :key="i"
                    width="1.94595rem"
                    height="1.94595rem"
                    :src="v.goodsIcon"
                  />
                </div>
              </div>
              <div
                class="right"
                v-if="everyday.length > 3 && everyday[3].actData"
                @click="gotoActivity(everyday[3].actInfo)"
              >
                <p>{{ everyday[3].actInfo.name }}</p>
                <div class="bt image">
                  <van-image
                    class="ml-1"
                    v-for="(v, i) in everyday[3].actData.slice(0, 2)"
                    :key="i"
                    width="1.94595rem"
                    height="1.94595rem"
                    :src="v.goodsIcon"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 推荐精品 -->
        <div>
          <van-sticky offset-top="1.28rem">
            <div class="gathers">
              <div
                style="text-align: center;"
                v-for="(item, index) in getlistTab"
                :key="index"
                @click="clickSwitch(item, index)"
              >
                <p class="top" :class="{ activeTop: listIndex === index }">
                  {{ item.name }}
                </p>
                <p class="bot" :class="{ activeBot: listIndex === index }">
                  {{ item.label }}
                </p>
                <van-image
                  v-show="listIndex === index"
                  width="0.43243rem"
                  height="0.43243rem"
                  :src="require('@/assets/images/5.png')"
                />
              </div>
            </div>
          </van-sticky>

          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <div class="changs">
              <!-- 品牌样式 -->
              <!-- <div
                class="changslist mb-3"
                v-for="(item, id) in homeList"
                :key="id"
              >
                <div class="d-flex justify-content-between align-items-center mb-3" @click="toBrand(item)">
                  <div class="d-flex align-items-center">
                    <img class="brand-img" :src="item.goodsBrand.brandIcon" alt="">
                    <div class="ml-2">
                      <p class="fs-16 fw-700 color-muted3 mb-1">{{ item.goodsBrand.brandName }}</p>
                      <div class="goodsTotal">{{ item.goodsBrand.goodsTotal }}款</div>
                    </div>
                    <p class="fs-16 fw-700 color-muted3 mb-1 ml-2">{{ item.goodsBrand.brandName }}</p>
                  </div>
                  <van-icon name="arrow" color="#666" size="12px"/>
                </div>
                <div class="d-flex justify-content-between">
                  <div class="goodsList-content" v-for="(v, i) in item.goodsList.slice(0,3)" :key="i" @click="toDity(v)">
                    <img class="goodsList-img" :src="v.goodsIcon" alt="">
                    <p class="text">{{ v.goodsName }}</p>
                    <div class="price text-price text-main mt-1 hidden">
                      <span>{{ v.salePrice }}</span>
                      <template v-if="v.integral > 0">
                        <span class="text-xs">{{
                          v.integralType | filterIntegralType
                        }}</span>
                        <span>{{ v.integral }}</span>
                        <span class="text-xs">{{
                          $lance.getIntegralName()
                        }}</span>
                      </template>
                      <span class="text-marketPrice">{{
                        `¥ ${v.marketPrice}`
                      }}</span>
                    </div>
                  </div>
                </div>
              </div> -->
              <div
                style="display: flex;flex-wrap: wrap;justify-content:space-between;"
              >
                <div
                  class="boxlist"
                  v-for="(item, id) in homeList"
                  :key="id"
                  @click="toDity(item)"
                >
                  <div class="images">
                    <img
                      style="border-radius: 8px 8px 0 0;;overflow: hidden;"
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
                      <span>{{ item.goodsTitle }}</span>
                    </div>
                    <div class="ml-1 price text-price text-main">
                      <span>{{ item.salePrice }}</span>
                      <template v-if="item.integral > 0">
                        <span class="text-xs">{{
                          item.integralType | filterIntegralType
                        }}</span>
                        <span>{{ item.integral }}</span>
                        <span class="text-xs">{{
                          $lance.getIntegralName()
                        }}</span>
                      </template>
                      <span class="text-marketPrice">{{
                        `¥ ${item.marketPrice}`
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-list>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      finished: false,
      refreshing: false,
      exchangeCode: 'mth_tcwbuu5v',
      search: '',
      swiperList: [],
      everyday: [],
      taglist: [],
      getlistTab: [],
      homeList: [],
      listIndex: 0,
      queryParams: {
        actCode: '',
        pageNum: 1,
        pageSize: 10
      },
      backgroundColor: '#eb6133', // 背景色
      markList: [
        {
          id: '01',
          bg: {
            background: 'linear-gradient(180deg, #FE8282 0%, #EF4444 100%)'
          }
        },
        {
          id: '02',
          bg: {
            background: 'linear-gradient(180deg, #FFC664 0%, #F87C30 100%)'
          }
        },
        {
          id: '03',
          bg: {
            background: 'linear-gradient(180deg, #7FB6FE 0%, #3889F2 100%)'
          }
        },
        {
          id: '04',
          bg: {
            background: 'linear-gradient(180deg, #FBE1BD 0%, #E9C387 100%)'
          }
        }
      ]
    }
  },

  created () {
    this.slideshow()
    this.listMall()
    this.byTapeAct()
  },
  methods: {
    // 轮播图切换事件
    onChange (index) {
      // console.log(index)
      this.backgroundColor = this.swiperList[index].topBarColor
    },
    // 切换tabs
    clickSwitch (item, index) {
      if (this.listIndex === index) return
      this.homeList = []
      this.finished = false
      this.listIndex = index
      this.queryParams = _.assign(
        {},
        {
          actCode: item.code,
          pageNum: 1,
          pageSize: 6
        }
      )
      this.onLoad()
    },
    onLoad () {
      // APP_GOODSACT_PAGELISTMALL_V2 品牌列表
      // APP_LISTMALL  商品推荐列表
      this.loading = true
      this.$http.post(this.$apiUri.APP_LISTMALL, this.queryParams, res => {
        if (this.finished) return
        this.homeList = _.concat(this.homeList, res.data.list)
        this.loading = false
        if (
          res.data.totalPage === 0 ||
          res.data.totalPage === this.queryParams.pageNum
        ) {
          return (this.finished = true)
        }
        this.queryParams.pageNum++
      })
    },
    // 下拉刷新
    onRefresh () {
      this.refreshing = true
      // 重新加载数据
      this.slideshow()
      this.listMall()
      this.byTapeAct()
      this.refreshing = false
    },
    // 获取活动相关数据（每日上新、热门兑换等）
    listMall () {
      this.$http.post(
        this.$apiUri.APP_ACTLIST,
        { code: this.exchangeCode },
        res => {
          this.everyday = res.data.act
          this.taglist = res.data.kingKong
        }
      )
    },
    // 商品推荐列表
    byTapeAct () {
      this.$http.post(
        this.$apiUri.APP_BYTYPE,
        {
          type: 4,
          code: this.exchangeCode
        },
        res => {
          if (res.data.length !== 0) {
            this.getlistTab = res.data
            this.queryParams = _.assign(
              {},
              {
                actCode: res.data[0].code,
                pageNum: 1,
                pageSize: 6
              }
            )
            this.onLoad()
          }
        }
      )
    },

    // 查看品牌跳转
    toBrand (item) {
      // this.$lance.setJson('items', item.goodsBrand)
      // this.$lance.setData('titleName', item.goodsBrand.brandName)
      this.$router.push({
        path: 'storeData',
        query: {
          storeId: item.goodsList[0].storeId,
          brandCode: item.goodsBrand.brandCode
        }
      })
    },
    // 查看更多跳转
    gotoActivity (item) {
      this.$lance.setJson('items', item)
      this.$lance.setData('titleName', item.name)
      this.$router.push({ path: 'recommend' })
    },
    // 兑换跳转
    togoodsList (item, index) {
      this.$lance.setJson('actCode', item)
      this.$lance.setData('titleName', item.name)
      this.$router.push({
        path: '/brand',
        query: {
          index: index
        }
      })
    },

    // 商品跳转
    toDity (e) {
      // this.$router.push({
      //   path: '/commodity',
      //   query: {
      //     dataIP: e.id,
      //     bsType: 'BS_A001'
      //   }
      // })
      // 商品跳转改成跳到店铺
      this.$router.push({
        path: '/storeData',
        query: {
          storeId: e.storeId,
          goodsId: e.id
        }
      })
      this.$lance.setJson('goodsInfo', e)
    },
    // 搜索跳转
    searchs () {
      this.$router.push('/search')
    },
    // 获取轮播图
    slideshow () {
      this.$http.post(
        this.$apiUri.APP_LBTLIST,
        { type: '1', actCode: this.exchangeCode },
        res => {
          console.log(res)
          this.swiperList = res.data
        }
      )
    },
    // 点击轮播图跳转
    toSwiper (e) {
      console.log(2, e)
      if (e.urlType === 1) {
        // 商品 先获取商品基础信息

        this.$router.push({
          path: '/commodity',
          query: {
            dataIP: e.url
          }
        })
      } else if (e.urlType === 2) {
        // 进店逛逛
        this.$router.push({
          path: '/storeData',
          query: {
            dataIP: e.url
          }
        })
      } else if (e.urlType === 3) {
        // 外部链接
        // this.$router.push({
        //   url: '../../webView/index.vue?webUrl=' + encodeURIComponent(e.url)
        // })
        window.location.href = e.url
      } else {
        if (e.urlType === 4) {
          let item = {
            name: e.urlName,
            code: e.url
          }
          console.log(item)
          this.$lance.setJson('actCode', item)
          this.$lance.setData('titleName', item.name)
          // this.$router.push('/brand?' + this.$lance.stringify(item))
          this.$router.push('/brand')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.exchange {
  /deep/ .van-image__img {
    border-radius: 8px;
    overflow: hidden;
  }
}
.formoney {
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
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  white-space: normal !important;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.text {
  width: 100%;
  margin-top: 8px;
  font-size: 13px;
  font-weight: 300;
  color: #333333;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  white-space: normal !important;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.hidden {
  width: 100%;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  white-space: normal !important;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.boxlist {
  width: 170px;
  height: 270px;
  background: #ffffff;
  box-shadow: 0px 1px 1px #efefef;
  opacity: 1;
  border-radius: 8px;
  margin: 8px 0 4px 0;
  .images {
    width: 170px;
    height: 170px;
    opacity: 1;
    border-radius: 8px 8px 0px 0px;
  }
}
.changs {
  min-height: 520px;
  margin: 12px;
  .changslist {
    width: 100%;
    height: 247px;
    background: #ffffff;
    border-radius: 8px;
    padding: 12px;
    .brand-img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }
    .goodsTotal {
      min-width: 40px;
      height: 16px;
      font-size: 11px;
      color: #eb6133;
      background: #ffeee8;
      border-radius: 4px;
      padding: 0 4px;
      line-height: 16px;
      text-align: center;
    }
    .goodsList-content {
      width: 104px;
      .goodsList-img {
        width: 104px;
        height: 104px;
        border-radius: 8px;
      }
    }
  }
}
.activeTop {
  color: #eb6132 !important;
  font-size: 18px !important;
}
.activeBot {
  color: #eb6132 !important;
}

.content {
  width: 100%;
  margin-top: -35px;
  background: #f3f3f3;
  border-radius: 16px 16px 0px 0px;
  padding-bottom: 50px;

  .tag {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding-top: 70px;
    overflow: hidden;
    margin-bottom: 16px;
    text-align: center;
    p {
      height: 18px;
      font-size: 13px;
      font-weight: 300;
      line-height: 18px;
      color: #333333;
      margin-top: 6px;
      text-align: center;
    }
  }
  .everyday {
    width: 351px;
    // height: 168px;
    background: #ffffff;
    opacity: 1;
    border-radius: 8px;
    margin-left: 12px;
    margin-bottom: 12px;
    .title {
      display: flex;
      justify-content: space-between;
      padding: 12px;
      color: #333333;
      .p {
        font-size: 15px;
        font-weight: 700;
      }
      .gd {
        display: flex;
        align-items: center;
        font-size: 11px;
      }
    }
    .two {
      display: flex;
      border-top: 1px solid #f6f6f6;
      p {
        font-size: 15px;
        padding: 12px;
        font-weight: 700;
        color: #333333;
      }
      .bt {
        display: flex;
        margin: 0 0 12px 12px;
      }
      .left {
        width: 50%;
        border-right: 1px solid #f6f6f6;
      }
    }
  }

  .hot {
    width: 351px;
    height: 306px;
    background: #ffffff;
    opacity: 1;
    border-radius: 8px;
    margin-left: 12px;
    margin-top: 12px;
    p {
      font-size: 16px;
      font-weight: 700;
      line-height: 22px;
      color: #333333;
      display: inline-block;
      padding: 12px 200px 12px 12px;
    }
  }
}
.swipe {
  width: 350px;
  height: 148px;
  position: absolute;
  margin-left: 13px;
  margin-top: 60px;
  .my-swipe {
    position: relative;
    color: #fff;
    font-size: 20px;
    text-align: center;
    border-radius: 10px;
    /deep/ .van-image__img {
      border-radius: 10px;
    }
  }
}

.gather {
  display: flex;
  justify-content: space-around;
  align-items: center;
  .mark {
    position: relative;
    width: 32px;
    height: 20px;
    font-size: 11px;
    top: -24px;
    left: 41px;
    color: #fff;
    // background: linear-gradient(180deg, #FE8282 0%, #EF4444 100%);
    line-height: 20px;
    text-align: center;
    border-radius: 8px 0px 8px 0px;
  }
  .mtf {
    margin-top: -20px;
  }
}

.gathers {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  padding-top: 10px;
  // align-items: center;
  // text-align: center;
  // position: fixed;
  // z-index: 999;
  margin-bottom: -15px;
  background-color: #f3f3f3;
  font-size: 16px;
  color: #333333;
  .top {
    font-size: 16px;
    color: #333;
    font-weight: 700;
  }
  .bot {
    font-size: 13px;
    color: #666;
  }
}
.image {
  // width: 72px;
  // height: 110px;
  text-align: center;
  margin-bottom: 12px;
}
.cash {
  font-size: 10px;
  font-weight: 300;
  line-height: 14px;
  margin: 8px 0 -8px 0;
  color: #eb6133;
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
  background-color: #fff;
  border-radius: 2px;
}
.box {
  width: 100%;
  height: 48px;
  // background: linear-gradient(180deg, #ff8744 0%, #eb6132 100%);
  line-height: 48px;
  z-index: 1;
  position: fixed;
  top: 0;
}
.home {
  width: 100%;
  height: 191px;
  // background: linear-gradient(180deg, #ff8744 0%, #eb6132 100%);
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
  // background: #ffffff;
  border: 1px solid #ec6033;
  opacity: 1;
  border-radius: 42px;
}
</style>
