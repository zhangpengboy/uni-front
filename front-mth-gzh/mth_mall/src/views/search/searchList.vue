<template>
  <div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <div class="gathers">
        <div
          :class="{ active: listIndex == index }"
          style="text-align: center;"
          v-for="(item, index) in navList"
          @click="clickSwitch(item, index)"
          :key="index"
        >
          <p>{{ item.name }}</p>
        </div>
      </div>
      <van-list
        v-if="isShow"
        v-model="loading"
        :finished="finished"
        finished-text="我是有底线的"
        @load="onLoad(listIndex)"
      >
        <div class="tabge">
          <!-- <van-tabs color="#fff" title-active-color="#EB6133">
        <van-tab> -->
          <div
            style="display: flex;flex-wrap: wrap;justify-content:space-between;margin-right: 0.32432rem; margin-left: 0.32432rem;"
          >
            <div
              class="boxlist"
              v-for="item in homeList"
              :key="item.id"
              @click="toGoods(item)"
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
                  <span>{{ item.goodsTitle }}</span>
                </div>
                <!-- <div class="formoney">
                  <span>￥</span><span>{{ item.salePrice }}</span
                  ><span
                    v-if="homeList.integralType == 0"
                    style="font-size:10px"
                  >
                    + </span
                  ><span v-else> 送 </span
                  ><span style="font-size:14px">{{ item.integral }}</span
                  ><span style="font-size:10px">礼券</span
                  ><del>{{ item.marketPrice }}</del>
                </div> -->
                <div class="ml-1 price text-price text-main">
                  <span>{{ item.salePrice }}</span>
                  <template v-if="item.integral > 0">
                    <span class="text-xs">{{
                      item.integralType | filterIntegralType
                    }}</span>
                    <span>{{ item.integral }}</span>
                    <span class="text-xs">{{ $lance.getIntegralName() }}</span>
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

      <!-- 店铺 -->
      <!--  class="goodsDp" -->
      <div v-else>
        <!-- <div class="user-header-top">
        <div class="left">
          <div class="avatar">
            <van-image
              class="avatar"
              :src="require('@/assets/images/logo.png')"
            />
          </div>
          <div class="content">
            <div>
              <div class="username">
                <span>{{ homeList[0].storeName }}</span>
              </div>
              <div class="userNub">8人关注</div>
            </div>
            <div class="buttom" @click="onClickMy">进店</div>
          </div>
        </div>
      </div>
      <div class="butImage">
        <van-image
          style="border-radius: 8px;overflow: hidden;"
          v-for="item in 3"
          :key="item.id"
          width="102"
          height="102"
          src="https://img01.yzcdn.cn/vant/cat.jpeg"
        />
      </div> -->

        <van-image
          class="imageSS"
          width="206"
          height="142"
          :src="require('@/assets/images/icon_lspwif.png')"
        />
        <p
          style="    margin-left: 35%;
    margin-top: 10px;
    color: #333333;
    font-weight: 300;"
        >
          暂时还没有商品
        </p>
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
      navList: [
        {
          name: '全部',
          id: 0
        },
        {
          name: '上新',
          id: 1
        },
        {
          name: '特卖',
          id: 2
        },
        {
          name: '店铺',
          id: 3
        }
      ],
      listIndex: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        goodsName: ''
      },
      homeList: [],
      isShow: true
    }
  },
  created () {
    this.queryParams.goodsName = this.$route.query.kwList
    this.queryParams.goodsName = this.$route.query.kw
    this.onLoad(this.listIndex)
  },
  methods: {
    onLoad (index) {
      if (this.refreshing) {
        this.homeList = []
        this.refreshing = false
      }
      this.loading = true
      if (index === 0) {
        this.$http.post(
          this.$apiUri.APP_NAMEGOODSLIST,
          this.queryParams,
          res => {
            // if (this.finished) return
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
          }
        )
        this.isShow = true
      } else if (index === 1) {
        this.$http.post(
          this.$apiUri.APP_NAMEGOODSLIST,
          this.queryParams,
          res => {
            // if (this.finished) return
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
          }
        )
        // this.isShow = true
        this.isShow = false
      } else if (index === 2) {
        this.$http.post(
          this.$apiUri.APP_NAMEGOODSLIST,
          this.queryParams,
          res => {
            // if (this.finished) return
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
          }
        )
        this.isShow = false
        // this.isShow = true
      } else if (index === 3) {
        this.$http.post(
          this.$apiUri.APP_NAMEGOODSLIST,
          this.queryParams,
          res => {
            // if (this.finished) return
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
          }
        )
        this.isShow = false
      }
    },
    onRefresh () {
      // 清空列表数据
      this.finished = false
      this.queryParams.pageNum = 1
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.onLoad(this.listIndex)
    },
    // 商品跳转
    toGoods (e) {
      this.$router.push({
        path: '/commodity',
        query: {
          dataIP: e.id
        }
      })
    },
    // 跳转店铺
    onClickMy () {
      this.$router.push({
        path: '/storeData',
        query: { storeId: this.homeList.storeId }
      })
    },
    // 切换导航列表
    clickSwitch (item, index) {
      this.listIndex = index
      this.finished = false
      this.queryParams.pageNum = 1
      this.homeList = []
      this.onLoad(this.listIndex)
    }
    // nameGoodsList (index) {
    //   if (index == 0) {
    //     this.$http.post(
    //       this.$apiUri.APP_NAMEGOODSLIST,
    //       this.queryParams,
    //       res => {
    //         console.log(res)
    //         this.homeList = res.data.list
    //       }
    //     )
    //     this.isShow = true
    //   } else if (index == 1) {
    //     this.$http.post(
    //       this.$apiUri.APP_NAMEGOODSLIST,
    //       this.queryParams,
    //       res => {
    //         console.log(res)
    //         this.homeList = res.data.list
    //       }
    //     )
    //     // this.isShow = true
    //     this.isShow = false
    //   } else if (index == 2) {
    //     this.$http.post(
    //       this.$apiUri.APP_NAMEGOODSLIST,
    //       this.queryParams,
    //       res => {
    //         console.log(res)
    //         this.homeList = res.data.list
    //       }
    //     )
    //     this.isShow = false
    //     // this.isShow = true
    //   } else if ((index = 3)) {
    //     this.$http.post(
    //       this.$apiUri.APP_NAMEGOODSLIST,
    //       this.queryParams,
    //       res => {
    //         console.log(res)
    //         this.homeList = res.data.list
    //       }
    //     )
    //     this.isShow = false
    //   }
    // }
  }
}
</script>

<style lang="less" scoped>
.imageSS {
  margin-left: 20%;
  margin-top: 35%;
}
.butImage {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.buttom {
  width: 52px;
  height: 26px;
  border: 1px solid #eb6133;
  opacity: 1;
  color: #eb6133;
  text-align: center;
  border-radius: 309px;
  position: absolute;
  left: 78%;
  top: 20%;
}
.username {
  color: #333333;
  font-size: 16px;
  vertical-align: top;
  font-weight: 500;
  margin-bottom: 8px;
  display: inline-block;
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示
  white-space: nowrap; //溢出不换行
  width: 130px;
}
.left {
  display: flex;
  align-items: center;
  flex: 1;
}
.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
}
.content {
  padding-left: 14px;
  padding-right: 14px;
  display: flex;
}
.userNub {
  font-size: 12px;
  font-weight: 300;
  color: #333333;
}
.user-header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 10px 16px 11px;
}
.goodsDp {
  width: 351px;
  height: 200px;
  background: #fff;
  opacity: 1;
  border-radius: 8px;
  margin-left: 12px;
  margin-top: 12px;
}
.van-image__img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}
.head {
  width: 375px;
  height: 64px;
  border-bottom: 1px solid #f6f6f6;
  background: #ffffff;
  opacity: 1;
  line-height: 64px;
  display: flex;
  padding-top: 10px;
  position: fixed;
  z-index: 999;
  margin-bottom: 10px;
  .brand {
    margin-left: 32%;
  }
}
.van-icon {
  position: relative;
  display: inline-block;
  font: normal normal normal 0.37333rem/1 'vant-icon';
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  background-color: #fff;
  border-left: 1px solid #dedede;

  width: 60px;
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
    border-radius: 8px;
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
.gathers {
  height: 50px;
  background-color: #fff;
  display: flex;
  line-height: 50px;
  justify-content: space-around;
  font-size: 16px;
  color: #333333;
}
.active {
  color: #eb6132 !important;
  font-size: 18px !important;
}
</style>
