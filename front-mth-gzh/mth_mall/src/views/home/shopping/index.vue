<template>
  <div class="shopping">
    <van-pull-refresh v-model="refreshings" @refresh="onRefreshs">
      <!-- 礼券兑主页导航 -->
      <div class="home" :style="{ background: backgroundColor }">
        <div class="box" :style="{ background: backgroundColor }">
          <div class="img">
            <img src="@/assets/images/meith.png" alt="" />
            <van-search
              class="search"
              v-model="search"
              @click="searchs"
              placeholder="搜索你想要购买的商品"
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
            </van-swipe-item>
          </van-swipe>
        </div>
      </div>

      <!-- 金刚区 -->
      <div class="content">
        <div class="tag">
          <div
            class="tagList"
            v-for="(item, id) in taglist"
            :key="id"
            @click="togoodsList(item)"
          >
            <van-image width="1.28rem" height="1.28rem" :src="item.icon" />
            <p>{{ item.name }}</p>
          </div>
        </div>
        <!-- 推荐 -->
        <div class="swipes">
          <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
            <van-swipe-item
              v-for="(item, index) in swiperLists"
              :key="index"
              @click="toSwiper(item)"
            >
              <van-image :src="item.image"></van-image>
            </van-swipe-item>
          </van-swipe>
        </div>
        <!-- 精选 特卖 -->
        <div v-for="(item, id) in everyday" :key="id">
          <div class="everyday">
            <!-- <p>{{ item.actInfo.name }}</p>
            <span
              @click="gotoActivity(item.actInfo)"
              style="font-size: 12px; font-weight: 300; color: #333333"
              >查看更多<van-icon name="arrow"
            /></span> -->
            <div class="title">
              <p class="p">{{ item.actInfo.name }}</p>
              <p @click="gotoActivity(item.actInfo)" class="gd">
                查看更多<van-icon name="arrow" size="0.35135rem" />
              </p>
            </div>
            <div class="gather">
              <div
                class="image"
                v-for="(v, i) in item.actData"
                :key="i"
                @click="toDity(v)"
              >
                <van-image
                  width="1.94595rem"
                  height="1.94595rem"
                  :src="v.goodsIcon"
                />
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
        </div>

        <!-- 推荐 -->
        <div class="shopping-list">
          <van-sticky offset-top="1.28rem">
            <div class="gathers">
              <div
                style="text-align: center"
                v-for="(item, index) in getlistTab"
                :key="index"
                @click="clickSwitch(item, index)"
              >
                <p class="top" :class="{ activeTop: listIndexs === index }">
                  {{ item.name }}
                </p>
                <p class="bot" :class="{ activeBot: listIndexs === index }">
                  {{ item.label }}
                </p>
                <van-image
                  v-show="listIndexs === index"
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
            @load="onLoads"
          >
            <!-- 品牌特卖样式 -->
            <!-- <div class="changs">
              <div
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
              </div>
            </div> -->
            <!-- 精品商城样式 -->
            <div class="changs">
              <div>
                <div
                  style="
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                  "
                >
                  <div
                    class="boxlist"
                    v-for="(item, i) in homeList"
                    :key="i"
                    @click="toDity(item)"
                  >
                    <div class="images">
                      <img
                        style="border-radius: 8px 8px 0 0; overflow: hidden"
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
                      <div class="formoney">
                        <span>￥</span><span>{{ item.salePrice }}</span
                        ><span style="font-size: 10px">送</span
                        >{{ item.integral
                        }}<span style="font-size: 8px">礼券</span
                        ><del>{{ item.marketPrice }}</del>
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
      refreshings: false,
      exchangeCode: 'mth_lwcrtiej',
      search: '',
      swiperList: [],
      swiperLists: [],
      everyday: [],
      taglist: [],
      getlistTab: [],
      homeList: [],
      listIndexs: 0,
      queryParams: {
        actCode: '',
        pageNum: 1,
        pageSize: 10
      },
      backgroundColor: '#eb6133' // 背景色
    }
  },
  created () {
    this.slideshow()
    this.listMall()
    this.byTapeAct()
    this.getActBannerLists()
  },
  methods: {
    // 轮播图切换事件
    onChange (index) {
      // console.log(index)
      this.backgroundColor = this.swiperList[index].topBarColor
    },
    onLoads () {
      //  APP_LISTMALL 精品商城推荐列表
      // APP_GOODSACT_PAGELISTMALL_V2 品牌特卖列表
      this.loading = true
      this.$http.post(this.$apiUri.APP_LISTMALL, this.queryParams, res => {
        if (this.finished) return
        this.homeList = _.concat(this.homeList, res.data.list)
        this.loading = false
        if (
          res.data.totalPage === 0 ||
          res.data.totalPage === this.queryParams.pageNum
        ) {
          this.finished = true
          return
        }
        this.queryParams.pageNum++
      })
    },
    onRefreshs () {
      this.refreshings = true
      this.slideshow()
      this.listMall()
      this.byTapeAct()
      this.getActBannerLists()
      this.refreshings = false
    },
    listMall () {
      this.$http.post(
        this.$apiUri.APP_ACTLIST,
        { code: this.exchangeCode },
        res => {
          console.log(555555, res)
          this.everyday = res.data.act
          this.taglist = res.data.kingKong
          this.taglist.push({
            name: '全部商品',
            code: '0000',
            icon:
              'https://app-static.meitianhui.com/images/e2a2e9a68755bcc7216a0c162039c448-n4d4ybgjgl.png'
          })
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
    // 商品列表
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
            this.onLoads()
          }
        }
      )
    },
    clickSwitch (item, index) {
      if (this.listIndexs === index) return
      this.homeList = []
      this.finished = false
      this.listIndexs = index
      this.queryParams = _.assign(
        {},
        {
          actCode: item.code,
          pageNum: 1,
          pageSize: 6
        }
      )
      this.onLoads()
    },
    // 跳转店铺
    onClickMy () {
      this.$router.push({
        path: '/storeData',
        query: { storeId: this.goodsObj.storeId }
      })
    },
    // 活动跳转
    gotoActivity (item) {
      this.$lance.setJson('items', item)
      this.$lance.setData('titleName', item.name)
      console.log(234, item.name)
      this.$router.push({ path: 'recommend' })
    },
    // 金刚区跳转
    togoodsList (item) {
      this.$lance.setJson('actCode', item)
      this.$lance.setData('titleName', item.name)
      this.$router.push({ path: 'homeList' })
    },
    // 商品跳转
    // toGoods (e) {
    //   this.$lance.setJson('dataLp', e)
    //   console.log(222, e)
    //   this.$router.push('/commodity')
    // },
    // 商品跳转
    toDity (e) {
      // this.$lance.setJson('dataLp', e)
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
        this.$apiUri.APP_MIDLIST,
        {
          type: '1',
          actCode: this.exchangeCode
        },
        res => {
          // console.log(res)
          this.swiperList = res.data
        }
      )
    },
    // 推荐图
    getActBannerLists () {
      this.$http.post(
        this.$apiUri.APP_MIDLIST,
        {
          type: '2',
          actCode: this.exchangeCode
        },
        res => {
          // console.log(res)
          this.swiperLists = res.data
        }
      )
    },
    // 点击轮播图跳转
    toSwiper (e) {
      console.log(2, e)
      if (e.urlType === 1) {
        // 商品 先获取商品基础信息
        this.$router.push({
          path: '/recommend',
          query: {
            dataIP: e.url,
            name: e.actName,
            code: e.url,
            bsType: 'BS_A001'
          }
        })
      } else if (e.urlType === 2) {
        // 进店逛逛
        // this.$router.push('/storeData')
        this.$router.push({
          path: '/storeData?storeId=' + e.url
        })
      } else if (e.urlType === 3) {
        // 外部链接
        // this.$router.push({
        //   url: '../../webView/index.vue?webUrl=' + encodeURIComponent(e.url)
        // })
        window.location.href = e.url
      } else if (e.urlType === 4) {
        let item = {
          name: e.urlName,
          code: e.url
        }
        // this.$router.push('/recommend?' + this.$lance.stringify(item))
        this.$lance.setJson('actCode', item)
        this.$lance.setData('titleName', item.name)
        this.$router.push('/brand')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.shopping {
  /deep/ .van-image__img {
    border-radius: 8px;
    overflow: hidden;
  }
}
.swipes {
  width: 351px;
  height: 88px;
  margin-left: 12px;
  margin-bottom: 12px;
  border-radius: 8px;
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

.major_gight {
  width: 174px;
  height: 100%;
  border-top: 1px solid #f6f6f6;
  background-color: #fff;
}
.major_left {
  width: 174px;
  height: 100%;
  border-right: 1px solid #f6f6f6;
  border-top: 1px solid #f6f6f6;
  background-color: #fff;
}

.content {
  width: 375px;
  margin-top: -35px;
  background: #f3f3f3;
  border-radius: 16px 16px 0px 0px;
  padding-bottom: 50px;

  .tag {
    padding-top: 60px;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 16px;
    .tagList {
      margin-left: 18px;
      margin-top: 10px;
      text-align: center;
    }
    p {
      height: 18px;
      font-size: 13px;
      font-weight: 300;
      line-height: 18px;
      color: #333333;
      margin-top: 6px;
    }
  }
  .everyday {
    width: 351px;
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
  margin-left: 13px;
  margin-top: 60px;
  position: absolute;
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
}
.shopping-list {
  .gathers {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    padding-top: 10px;
    // align-items: center;
    // text-align: center;
    // position: fixed;
    // z-index: 1000;
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
}
.image {
  height: 110px;
  text-align: center;
  margin-bottom: 10px;
}
.cash {
  font-size: 10px;
  font-weight: 300;
  line-height: 14px;
  margin: 8px 0 -8px 0;
  color: #eb6133;
  opacity: 1;
}

.box {
  width: 100%;
  height: 48px;
  // background: linear-gradient(180deg, #ff8744 0%, #eb6132 100%);
  line-height: 48px;
  position: fixed;
  z-index: 1;
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
  background: #ffffff;
  border: 1px solid #ec6033;
  opacity: 1;
  border-radius: 42px;
}
</style>
