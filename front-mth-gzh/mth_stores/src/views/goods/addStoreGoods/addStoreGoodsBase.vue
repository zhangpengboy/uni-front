<!-- 店铺商品添加导入 -->
<template>
  <div class='addStoreGoodsBase'>
    <van-nav-bar
      left-arrow
      fixed
      placeholder
      @click-left="$baseUtils.goBack(-1)"
    >
      <template #title>
        <form action="/">
          <van-search
            v-model="goodsName"
            placeholder="搜索"
            shape="round"
            @search="onSearch"
            @clear="onClear"
          />
        </form>
      </template>
    </van-nav-bar>

    <div class="d-flex" v-if="dataOK || categoryGoodsList.length > 0">
        <div class="sidebar" ref="leftList">
            <!-- <van-sidebar v-model="currentIndex" @change="onChange">
              <van-sidebar-item v-for="(item,i) in categoryGoodsList" :key="i" :title="item.categoryName" />
            </van-sidebar> -->
          <ul>
            <li
              v-for="(item,i) in categoryGoodsList"
              :class="[isActivateSidebar === i ? 'isFixed' : 'isHide']"
              :key="i"
               @click="onChange(i)"
              >
              {{ item.categoryName }}
            </li>
          </ul>
        </div>
      <div class="center" ref="rightList">
        <div id="scrollWapper">
          <div class="scrollText" v-for="(item,i) in categoryGoodsList" :key="i" ref="goodsList">
            <p class="fs-13 color-text mb-2 fw-700 mb-2">{{ item.categoryName }}</p>
              <div
                class="card"
                v-for="(v, index) in item.gooStoreGoodsBaseList"
                :key="index"

              >
                <div @click="toOrderDetails(v)">
                  <div class="d-flex">
                    <img class="goods-thumb" :src="v.goodsIcon" alt="">
                    <div class="goodsInfo">
                      <p class="title">{{ v.goodsName }}</p>
                      <div class="d-flex justify-content-between align-items-center">
                        <p>
                          <span class="fs-10 color-light">参考价</span>
                          <span class="price text-price text-main">{{ v.salePrice }}</span>
                        </p>
                        <div class="guige" @click="onOpenSku(v)">选规格</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
    <van-empty
      v-else
      class="custom-image"
      :image="require('@/assets/images/empty/no_goods@2x.png')"
      description="暂无商品"
    />
    <!-- <div class="d-flex">
      <div class="sidebar">
        <van-sidebar v-model="activeKey" @change="onChange">
          <van-sidebar-item v-for="(item,i) in sidebarList" :key="i" :title="item.name" />
        </van-sidebar>
      </div>
      <div>
        <van-list
          v-if="dataOK || goodsList.length > 0"
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          :immediate-check="false"
          @load="getStoreGoodsrList"
          class="center"
        >
          <p class="fs-13 color-text mb-2 fw-700 ml-1">{{ sidebarName }}</p>
          <div
            class="card"
            v-for="(item, index) in goodsList"
            :key="index"
          >
            <div @click="toOrderDetails(item)">
              <div class="d-flex">
                <img class="goods-thumb" :src="item.goodsIcon" alt="">
                <div class="goodsInfo">
                  <p class="title">{{ item.goodsName }}</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <p>
                      <span class="fs-10 color-light">参考价</span>
                      <span class="price text-price text-main">{{ item.salePrice }}</span>
                    </p>
                    <div class="guige" @click="onOpenSku(item)">选规格</div>
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
          description="暂无商品"
        />
      </div>
    </div> -->
    <!-- sku弹框 -->
    <van-popup
        v-model="openSku"
        round
        closeable
        position="bottom"
        :close-on-popstate="true"
      >
        <div class="skuname">
          <img :src="goodsDataSkuImg" @click="skuImgShowClick" />
          <div class="skutext">
            <p class="fs-14 color-text fw-700">{{ storeGoodsBaseData.goodsName }}</p>
            <div class="price text-price text-main">
              <span>{{ goodsDataSalePrice }}</span>
              <template v-if="goodsDataIntegral > 0">
                  <span class="text-xs">{{
                    goodsDataIntegralType | filterIntegralType
                  }}</span>
                  <span>{{ goodsDataIntegral }}</span>
                  <span class="text-xs">{{ $lance.getIntegralName() }}</span>
                </template>
            </div>
            <div class="skulist">
              已选择&nbsp;<span>{{ goodsDataSkuName }}</span>
            </div>
          </div>
        </div>
        <div class="ml-3">
          <div class="fs-14 color-text">
            选择规格:
          </div>
          <div
            v-for="(v, i) in goodsData"
            :key="i"
            class="vanbut"
            :class="[isActivate === i ? 'activeClass' : 'noActiveClass']"
            @click="cutSKU(i)"
          >
            {{ v.skuName }}
          </div>
        </div>
        <van-button
          color="linear-gradient(180deg, #F1722C 0%, #EB6133 100%)"
          block
          size="small"
          round
          @click="addStoreGoods"
          class="mt-8 mb-6 but"
          >添加</van-button
        >
      </van-popup>
     <!-- 规格图片预览 -->
    <van-image-preview
      v-model="skuImgShow"
      :images="skuImgList"
      @change="onChangeSKUImg"
      closeable
      :loop="false"
      :start-position="index"
      @close="closePreview"
    >
      <template v-slot:index>{{ goodsDataSkuName }}</template>
    </van-image-preview>
  </div>
</template>

<script>
// import BScroll from 'better-scroll'
export default {
  name: 'addStoreGoodsBase',
  data () {
    return {
      active: 0,
      isActivateSidebar: 0,
      currentIndex: 0,
      sidebarName: '',
      sidebarList: [],
      loading: false,
      finished: false,
      goodsList: [],
      dataOK: true,
      goodsName: '',
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        level1CategoryId: null,
        goodsName: null
      },
      storeGoodsBaseData: {}, // 店铺商品基础数据
      goodsData: [], // 规格
      detailImgList: [],
      goodsDataSkuImg: '',
      goodsDataSalePrice: null,
      goodsDataIntegral: null,
      goodsDataAmount: null,
      goodsDataSkuName: null,
      goodsDataIntegralType: null,
      quota: 1, // 限购数量
      skuColor: '', // #EB6133
      isActivate: 0,
      skuImgList: [], // 规格图片预览图列表
      skuImgShow: false,
      index: 0,
      openSku: false,
      categoryGoodsList: [], // 分类商品列表
      heightList: [0] // 存储某个分类下的商品高度列表

    }
  },
  computed: {},
  watch: {
  },
  created () {
    // this.get()
    this.getCategoryGoods()
  },
  mounted () {
    this.$nextTick(() => {
      this.scrollInit()
    })
  },
  destroyed () {
    this.rightBox.removeEventListener('scroll', this.scrollInit)
  },
  updated () {
    this.heightList = [0]
    this.$refs.goodsList.forEach((el, index) => {
      this.heightList.push(el.offsetHeight + this.heightList[index])
    })
  },
  methods: {
    // 初始化
    scrollInit () {
      this.rightBox = this.$refs.rightList
      this.rightBox.addEventListener('scroll', () => {
        this.heightList.filter((item, i) => {
          if (this.$refs.rightList.scrollTop >= this.heightList[i] && this.$refs.rightList.scrollTop < this.heightList[i + 1]) {
            this.isActivateSidebar = i
          }
        })
      })
    },
    // 搜索
    onSearch () {
      this.dataOK = true
      this.categoryGoodsList = []
      this.getCategoryGoods()
    },
    // 取消搜索
    onClear () {
      this.dataOK = true
      this.categoryGoodsList = []
      this.goodsName = null
      this.getCategoryGoods()
    },
    // 切换侧边栏
    onChange (index) {
      this.isActivateSidebar = index
      this.$nextTick(() => {
        this.$refs.rightList.scrollTop = this.heightList[index]
        // this.$refs.rightList.scrollTo(0, this.heightList[index], 600)
      })
    },
    // 打开sku弹框
    onOpenSku (item) {
      this.goodsDataSkuImg = ''
      this.openSku = true
      this.storeGoodsBaseData = _.assign({}, item)
      this.$http.post(
        this.$apiUri.APP_STORE_GOODS_BASESKU,
        { goodsId: item.id },
        res => {
          this.goodsData = res.data
          if (this.goodsData.length > 0) {
            this.goodsDataSkuImg = this.goodsData[0].skuImg
            this.goodsDataSalePrice = this.goodsData[0].salePrice
            this.goodsDataIntegral = this.goodsData[0].integral
            this.goodsDataAmount = this.goodsData[0].amount
            this.goodsDataSkuName = this.goodsData[0].skuName
            this.quota = this.goodsData[0].quota
            this.goodsDataIntegralType = this.goodsData[0].integralType
            this.isActivate = 0
            this.skuImgList = this.goodsData.map(item => item.skuImg)
          }
        }, err => {
          this.$toast(err.message)
        }
      )
    },
    // 点击缩略图打开规格预览图
    skuImgShowClick () {
      if (this.skuImgList.length > 0) {
        this.skuImgShow = true
      }
    },
    // 预览规格图片切换
    onChangeSKUImg (index) {
      // console.log(index);
      this.goodsDataSkuName = this.goodsData.map(item => item.skuName)[index]
    },
    // 关闭规格预览图,切换规格数据
    closePreview (i) {
      this.isActivate = i.index
      this.goodsDataSkuImg = this.goodsData[i.index].skuImg
      this.goodsDataSalePrice = this.goodsData[i.index].salePrice
      this.goodsDataIntegral = this.goodsData[i.index].integral
      this.goodsDataIntegralType = this.goodsData[i.index].integralType
      this.goodsDataAmount = this.goodsData[i.index].amount
      this.goodsDataSkuName = this.goodsData[i.index].skuName
      this.quota = this.goodsData[i.index].quota
      this.index = i.index
    },
    // 切换商品规格
    cutSKU (i) {
      this.isActivate = i
      this.goodsDataSkuImg = this.goodsData[i].skuImg
      this.goodsDataSalePrice = this.goodsData[i].salePrice
      this.goodsDataIntegral = this.goodsData[i].integral
      this.goodsDataIntegralType = this.goodsData[i].integralType
      this.goodsDataAmount = this.goodsData[i].amount
      this.goodsDataSkuName = this.goodsData[i].skuName
      this.quota = this.goodsData[i].quota
      this.index = i
    },
    // 获取分类商品列表
    getCategoryGoods () {
      this.$http.post(
        this.$apiUri.APP_STORE_GOODS_CATEGORY_LIST,
        { goodsName: this.goodsName },
        res => {
          this.categoryGoodsList = res.data
          this.dataOK = false
        }, err => {
          this.dataOK = true
          this.$toast(err.message)
        }
      )
    },
    // 获取侧边栏数据
    get () {
      this.$http.post(
        this.$apiUri.APP_STORE_GOODS_CATEGORY,
        {},
        res => {
          this.sidebarList = res.data
          this.sidebarName = this.sidebarList[0].name
          this.queryParams.level1CategoryId = this.sidebarList[0].id
          this.getStoreGoodsrList()
        }, err => {
          this.$toast(err.message)
        }
      )
    },
    // 获取店铺商品列表数据
    getStoreGoodsrList () {
      this.loading = true
      this.$http.post(
        this.$apiUri.APP_STORE_GOODS_PAGELIST,
        this.queryParams,
        res => {
          if (this.finished) return
          this.dataOK = false
          this.goodsList = _.concat(this.goodsList, res.data.list)
          this.loading = false
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
    // 添加店铺商品
    addStoreGoods () {
      let queryParams = { ...this.storeGoodsBaseData }
      queryParams.storeId = this.$lance.getJson('storeInfo').storeId
      queryParams.storeName = this.$lance.getJson('storeInfo').storeName
      queryParams.ids = [this.goodsData[this.isActivate].id]
      this.$http.post(
        this.$apiUri.APP_STORE_GOODSADD,
        queryParams,
        res => {
          this.$toast('添加成功')
          this.openSku = false
        }, err => {
          this.$toast(err.message)
        }
      )
    },
    toOrderDetails (v) {}
  }
}
</script>
<style lang='scss' scoped>
.core-container {

  .scroll-wrapper {
    width: 100px;
    height: calc(100vh - 46px);
    position: relative;
    overflow: hidden;
    .scroll-item {
      height: 50px;
      line-height: 50px;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
    }
  }
}
// @import url(); 引入公共css类
.addStoreGoodsBase {
  /deep/ .van-nav-bar__title {
    font-weight: 300;
    max-width: 100%;
    .van-search {
      padding: 0;
    }
  }
  /deep/ .van-tabs__wrap {
    height: 100%;
    .van-tabs__nav {
      display: flex;
      flex-direction: column;
      .van-tab {
        width: 100px;
        font-size: 13px;
        font-weight: 700;
        padding: 16px 14px;
      }
    }
  }
  /deep/ .van-sidebar {
    width: 100px;
    .van-sidebar-item__text {
      font-size: 13px;
    }
    .van-sidebar-item--select {
      color: #eb6133;
    }
    .van-sidebar-item {
      padding-right: 0;
    }
  }
  // .list {
  //   height: calc(100vh - 46px);
  //   overflow-y:scroll;
  //   .sidebar {
  //     width: 100px;
  //   }
  // }
  .sidebar {
    width: 100px;
    height: calc(100vh - 46px);
    overflow-y:scroll;
    position: fixed;
    ul {
      width: 100px;
      li {
        font-size: 13px;
        padding: 15px 12px;
        font-weight: 700;
      }
    }
  }
  .isFixed {
    background: #fff;
    color: #eb6133;
  }
  .isHide {
    background: #f8f8f8;
    color: #333;
  }
  .center {
    padding: 14px;
    background: #FFFFFF;
    margin-left: 100px;
    height: calc(100vh - 46px);
    overflow-y:scroll;
  }
  .scrollText {
    padding: 10px 0 16px;
  }
  .card {
    width: 100%;
    height: 100%;
    padding-bottom: 16px;
    .goods-thumb {
      width: 88px;
      height: 88px;
      border-radius: 4px;
      margin-right: 12px;
    }
    .goodsInfo {
      width: 158px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .title {
      font-size: 14px;
      color: #333;
      font-weight: 700;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .guige {
      width: 56px;
      height: 20px;
      font-size: 11px;
      background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
      border-radius: 19px;
      line-height: 20px;
      color: #fff;
      text-align: center;

    }
  }
    .skutext {
    margin-top: 18px;
    margin-left: 12px;
  }

  .skulist {
    margin-top: 12px;
    font-size: 14px;
    color: #999999;
  }
  .skuname {
    display: flex;
    margin: 60px 14px 14px 14px;

    img {
      width: 100px;
      height: 100px;
      border-radius: 4px;
    }
  }
  .vanbut {
    max-width: 140px;
    height: 32px;
    font-size: 13px;
    margin: 12px 20px 0 0;
    border-radius: 30px;
    text-align: center;
    line-height: 32px;
    padding: 0 12px;
    display: inline-block;
    overflow: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
  }

  .activeClass {
    border: 1px solid #eb6133;
    background: #ffebe4;
    color: #eb6133;
  }

  .noActiveClass {
    background: #f2f2f2;
    color: #666;
  }
}
</style>
