<template>
  <div>
    <!-- 用户信息 -->
    <div class="user-header">
      <div class="user-header-top">
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
                <span>{{ storeInfo.storeName }}</span>
              </div>
              <div class="userNub">{{ favorCount }}人关注</div>
            </div>
          </div>
        </div>
        <div class="Ttonsis" :class="[isFavor ? 'yes' : 'no']">
          <div v-if="isFavor" @click="delStore">已关注</div>
          <div v-else @click="addStore">
            <van-image
              width="12"
              height="12"
              :src="require('@/assets/images/store_icon.png')"
            />
            <span> 关注</span>
          </div>
        </div>
      </div>
      <!-- tgs -->
      <!-- <div class="gathers">
        <div
          v-for="(item, index) in navList"
          :class="{ active: listIndex === item.name }"
          class="tagName"
          @click="clickSwitch(item)"
          :key="index"
        >
          <p v-if="item.isShow">{{ item.name }}</p>
          <van-image
            v-show="listIndex === item.name"
            width="16"
            height="16"
            :src="require('@/assets/images/5.png')"
          />
        </div>
      </div> -->
    </div>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="">
      <van-list
        v-if="dataOK || homeList.length > 0"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="changs">
          <div class="componet">
            <div v-if="goodsId" class="imgList" @click="toGoods(goodsInfo)">
              <div>
                <van-image
                  style="border-radius: 4px;margin-top: 0.32432rem;border-radius: 0.21621rem;
overflow: hidden;"
                  width="120"
                  height="108"
                  :src="goodsInfo.goodsIcon"
                />
              </div>
              <div style="margin-top:0.32432rem;">
                <div class="text">{{ goodsInfo.goodsName }}</div>
                <div class="texttwo">
                  <span>{{ goodsInfo.goodsTitle }}</span>
                </div>
                <!-- <div > -->
                <span class="textbuttom">￥</span
                ><span class="textbuttoms">{{ goodsInfo.salePrice }}</span
                ><span
                  style="font-size:10px;color: #eb6133;"
                  v-if="goodsInfo.integralType == 0"
                >
                  + </span
                ><span v-else style="font-size:10px;color: #eb6133;"> 送 </span
                ><span style="color: #eb6133;">{{ goodsInfo.integral }}</span
                ><span style="font-size:8px;color: #eb6133;">礼券</span
                ><del class="buttoms">{{ goodsInfo.marketPrice }}</del>
                <!-- </div> -->
              </div>
            </div>
          </div>
          <div>
            <div
              style="display: flex;flex-wrap: wrap;justify-content:space-between;"
            >
              <div
                class="boxlist"
                v-for="(item, index) in homeList"
                :key="index"
                @click="toGoods(item)"
              >
                <div class="images">
                  <van-image width="100%" height="100%" :src="item.goodsIcon" />
                  <div class="text">
                    {{ item.goodsName }}
                  </div>
                  <div class="forson">
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
        </div>
      </van-list>
      <van-empty
        v-else
        class="custom-image"
        :image="require('@/assets/images/empty/no_goods@2x.png')"
        description="还没有商品哦~"
      />
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
          name: '数字货架',
          id: 0,
          isShow: false
        },
        {
          name: '推荐',
          id: 1,
          isShow: true
        },
        {
          name: '宝贝',
          id: 2,
          isShow: true
        },
        {
          name: '活动',
          id: 3,
          isShow: true
        },
        {
          name: '新品',
          id: 4,
          isShow: true
        },
        {
          name: '便利店',
          id: 5,
          isShow: false
        }
      ],
      listIndex: '',
      storeInfo: {},
      favorCount: '',
      // 是否关注该店铺
      isFavor: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        storeId: ''
      },
      homeList: [],
      pushGoodsList: [],
      storeId: '',
      goodsInfo: {},
      goodsId: '',
      dataOK: true,
      cloudStoreList: []
    }
  },
  watch: {
    $route (to, from) {
      if (from.name === 'storeGoodsBaby') {
        this.getStoreInfoAndFavor()
      }
    }
  },
  created () {
    this.storeId = this.$route.query.storeId
    this.goodsId = this.$route.query.goodsId
    this.goodsInfo = this.$lance.getJson('goodsInfo')
    this.queryParams.storeId = this.storeId
    if (this.$route.query.brandCode) {
      this.queryParams.brandCode = this.$route.query.brandCode
    }
    this.getStoreInfoAndFavor()
  },
  methods: {
    // 获取数字货架商品
    getDigitalShelves () {
      this.$http.post(this.$apiUri.APP_STOREPAGELIST, this.queryParams, res => {
        if (res.data.list.length) {
          this.navList.filter(item => item.id === 0)[0].isShow = true
          this.listIndex = this.navList.filter(item => item.id === 0)[0].name
        }
      })
    },
    onLoad () {
      if (!this.listIndex) return
      this.loading = true
      this.dataOK = true
      this.postStoreData(this.$apiUri.APP_RECOMLUVETEB)
    },
    onLoad1 () {
      if (!this.listIndex) return
      this.loading = true
      this.dataOK = true
      if (this.listIndex === '数字货架') {
        this.$http.post(
          this.$apiUri.APP_STOREPAGELIST,
          this.queryParams,
          res => {
            if (this.finished) return
            this.loading = false
            this.dataOK = false
            this.refreshing = false
            this.pushGoodsList = res.data
            let arrList = this.pushGoodsList.list
            let arr = []
            arrList.map((item, i) => {
              arr.push(item.goods)
            })
            this.homeList = _.concat(this.homeList, arr)
            if (
              res.data.totalPage === 0 ||
              res.data.totalPage === this.queryParams.pageNum
            ) {
              this.finished = true
              return
            }
            this.queryParams.pageNum++
          },
          err => {
            this.loading = false
            this.dataOK = true
            this.finished = true
            this.$toast(err.message)
          }
        )
      } else if (this.listIndex === '推荐') {
        // 推荐
        this.postStoreData(this.$apiUri.APP_RECOMMEND)
      } else if (this.listIndex === '宝贝') {
        // 宝贝
        this.postStoreData(this.$apiUri.APP_RECOMLUVETEB)
      } else if (this.listIndex === '活动') {
        // 活动
        this.postStoreData(this.$apiUri.APP_RECOMTEB)
      } else if (this.listIndex === '新品') {
        // 新品
        this.postStoreData(this.$apiUri.APP_RECOMNEWS)
      } else if (this.listIndex === '便利店') {
        this.listIndex = ''
        // 新品
        this.$router.push({
          path: '/storeGoodsBaby?storeId=' + this.storeId
        })
      }
    },
    // 请求
    postStoreData (url) {
      this.$http.post(
        url,
        this.queryParams,
        res => {
          if (this.finished) return
          this.loading = false
          this.dataOK = false
          this.refreshing = false
          this.homeList = _.concat(this.homeList, res.data.list)
          if (
            res.data.totalPage === 0 ||
            res.data.totalPage === this.queryParams.pageNum
          ) {
            this.finished = true
            return
          }
          this.queryParams.pageNum++
        },
        err => {
          this.loading = false
          this.dataOK = true
          this.finished = true
          this.$toast(err.message)
        }
      )
    },
    // 加载中
    onRefresh () {
      // debugger
      // 清空列表数据
      this.homeList = []
      this.refreshing = false
      this.finished = false
      this.queryParams.pageNum = 1
      this.onLoad()
    },
    // 商品跳转
    toGoods (e) {
      this.$router.push({
        path: '/commodity',
        query: {
          dataIP: e.id,
          bsType: 'BS_A001'
        }
      })
      // if (this.listIndex === '数字货架') {
      //   let obj = {}
      //   this.pushGoodsList.list.map(item => {
      //     if (item.goodsId === e.id) {
      //       obj.bsType = item.bsType || 'BS_A010'
      //       obj.uuid = item.uuid
      //       obj.storeId = item.cloudStore.storeId
      //       obj.storeName = item.cloudStore.storeName
      //     }
      //   })
      //   // console.log(obj)
      //   this.$router.push({
      //     path: '/commodity',
      //     query: {
      //       // dataIP: e.id,
      //       bsType: obj.bsType,
      //       uuid: obj.uuid,
      //       isFlag: 'cloudGoods'
      //     }
      //   })
      // } else {
      //   this.$router.push({
      //     path: '/commodity',
      //     query: {
      //       dataIP: e.id,
      //       bsType: 'BS_A001'
      //     }
      //   })
      // }
    },

    // 切换导航列表
    clickSwitch (item) {
      this.listIndex = item.name
      this.finished = false
      this.refreshing = false
      this.queryParams.pageNum = 1
      this.homeList = []
      this.dataOK = true
      this.onLoad()
    },
    // 是否关注店铺
    getStoreInfoAndFavor () {
      this.$http.post(
        this.$apiUri.APP_FOANDFAVOR,
        { storeId: this.storeId },
        res => {
          this.isFavor = res.data.isFavor
          this.favorCount = res.data.favorCount
          if (res.data.storeInfo.isCloudStore === 1) {
            this.navList.filter(item => item.id === 0)[0].isShow = true
            this.listIndex = this.navList.filter(item => item.id === 0)[0].name
          } else {
            this.listIndex = '推荐'
          }
          this.storeInfo = res.data.storeInfo
          if (
            this.storeInfo.storeRoleCode === 3 ||
            this.storeInfo.storeRoleCode === 5
          ) {
            this.navList.map(item => {
              if (item.name === '便利店') {
                item.isShow = true
              }
            })
          }
          this.onLoad()
          this.$lance.setData('saleStoreId', res.data.storeInfo.id)
          this.$lance.setData('saleStoreName', res.data.storeInfo.storeName)
        }
      )
    },
    // 获取店铺详情
    getStoreInfo () {
      this.storeId = this.$route.query.storeId
      return new Promise((resolve, reject) => {
        this.$http.post(
          this.$apiUri.APP_STOREINFO,
          { storeId: this.storeId },
          res => {
            // console.log(res.data)
            this.storeInfo = res.data
            // this.$lance.setData('saleStoreId',res.data.storeInfo.id)
            // this.$lance.setData('saleStoreName',res.data.storeInfo.storeName)
            resolve(res.data)
          },
          err => {
            reject(err)
          }
        )
      })
    },
    // 添加收藏
    addStore () {
      let obj = {}
      obj.storeId = this.storeInfo.id
      obj.storeName = this.storeInfo.storeName
      this.$http.post(this.$apiUri.APP_ADDSTORE, obj, res => {
        // console.log(res)
        if (res.success) {
          this.isFavor = true
          this.favorCount++
        }
      })
    },
    // 取消收藏
    delStore () {
      this.$http.post(
        this.$apiUri.APP_DELSTORE,
        { storeId: this.storeId },
        res => {
          console.log(res)
          this.isFavor = false
          this.favorCount--
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
.componet {
  width: 351px;
  background-color: #fff;
  border-radius: 8px;
  .imgList {
    display: flex;
    margin: 12px 12px 16px 12px;
    background-color: #fff;
  }
  .text {
    margin-left: 12px;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #333333;
  }
  .texttwo {
    font-size: 12px;
    margin-left: 12px;
    font-weight: 300;
    color: #999999;
    margin-bottom: 20px;
  }
  .textbuttom {
    margin-left: 12px;
    color: #eb6133;
    font-size: 10px;
  }
  .textbuttoms {
    color: #eb6133;
    font-size: 16px;
    font-weight: 500;
  }
  .buttoms {
    font-size: 11px;
    font-weight: 300;
    color: #999999;
    margin-left: 8px;
  }
}
.custom-image {
  margin-top: 166px;
}
.Ttonsis {
  width: 68px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  border-radius: 309px;
}
.yes {
  background: #f2f2f2;
  color: #666666;
}
.no {
  background: linear-gradient(180deg, #f1722c 0%, #eb6133 100%);
  color: #fff;
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
  margin: 8px 0 4px 0;
  .images {
    width: 170px;
    height: 170px;
    background: #ffc9e1;
    opacity: 1;
    border-radius: 8px 8px 0px 0px;
  }
}
.changs {
  width: 351px;
  margin: 12px;
  margin-top: 126px;
}
.active {
  color: #eb6132 !important;
  font-size: 18px !important;
}
.gathers {
  display: flex;
  // justify-content: space-around;
  // align-items: center;
  // text-align: center;
  // margin-left: -20px;
  margin-top: 20px;
  font-size: 14px;
  color: #333333;

  .tagName {
    text-align: center;
    margin-right: 16px;
  }
}
.buttomtop {
  margin-left: 80px;
  margin-top: 8px;

  width: 60px;
  height: 28px;
  background: linear-gradient(180deg, #f1722c 0%, #eb6133 100%);
  opacity: 1;
  border-radius: 309px;
}
// 顶部
.user-header {
  width: 100%;
  // height: 166px;
  background: #fff;
  display: flex;
  flex-direction: column;
  padding: 15px 14px;
  color: #ffffff;
  position: fixed;
  top: 45px;
  z-index: 1;
}

.user-header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
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
.username {
  max-width: 180px;
  font-size: 16px;
  color: #333333;
  vertical-align: top;
  font-weight: 700;
  margin-bottom: 8px;
  display: inline-block;
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示
  white-space: nowrap; //溢出不换行
}
</style>
