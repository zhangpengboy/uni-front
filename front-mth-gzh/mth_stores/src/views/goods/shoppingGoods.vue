<!-- 商城商品管理 -->
<template>
  <div class='shoppingGoods'>
    <!-- <van-nav-bar
      right-text="添加"
      left-arrow
      fixed
      placeholder
      @click-left="onClickLeft"
      @click-right="onClickRight"
    >
      <template #title>
        <van-tabs
          v-model="titleActive"
          color="#EB6133"
          title-active-color="#EB6133"
          title-inactive-color="#666"
          line-height="0"
          @click="onTitleClick"
        >
          <van-tab class="fw-700" title="商品" title-style="width: 100px;font-weight: 700;"></van-tab>
        </van-tabs>
      </template>
    </van-nav-bar> -->
    <van-nav-bar left-arrow
                 fixed
                 placeholder
                 @click-left="$baseUtils.goBack(-1)">
      <template #title>
        <form action="/">
          <van-search v-model="queryParams.goodsName"
                      placeholder="搜索"
                      shape="round"
                      @search="onSearch"
                      @clear="onClear" />
        </form>
      </template>
      <template #right>
        <div class="add"
             @click="onClickRight">
          <van-icon name="plus"
                    size="12"
                    color="#EB6133" />
        </div>
      </template>
    </van-nav-bar>
    <van-sticky offset-top="1.22667rem">
      <van-tabs v-model="active"
                @click="onClick"
                sticky
                color="#EB6133"
                title-active-color="#EB6133"
                title-inactive-color="#666">
        <van-tab v-for="index in statusList"
                 :key="index"
                 :title="index"></van-tab>
      </van-tabs>
    </van-sticky>
    <van-list v-if="dataOK || goodsList.length > 0"
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              :immediate-check="false"
              @load="getGoodsList"
              class="center">
      <div class="card"
           v-for="(item, index) in goodsList"
           :key="index">
        <div class="d-flex"
             @click="toGoodsDetails(item)">
          <img class="goods-thumb"
               :src="item.goodsIcon"
               alt="">
          <div class="d-flex justify-content-between goodsInfo">
            <div class="mr-2">
              <p class="title">{{ item.goodsName }}</p>
              <div class="d-flex align-items-center my-2">
                <span class="fs-13 color-light">库存：{{ item.stockQty }}</span>
                <template v-if="item.status === 3">
                  <div class="line"></div>
                  <span class="fs-13 color-light">已售：{{ item.salesVolume }}</span>
                </template>
              </div>
              <div class="price text-price text-main">
                <span>{{ item.vipPrice }}</span>
                <template v-if="item.integral > 0">
                  <span class="text-xs">{{
                    item.integralType | filterIntegralType
                  }}</span>
                  <span>{{ item.integral }}</span>
                  <span class="text-xs">{{ $lance.getIntegralName() }}</span>
                </template>
                <span class="text-marketPrice">{{ `¥ ${item.marketPrice}` }}</span>
              </div>
            </div>
            <div v-if="item.status === 3 && goodsType == 0"
                 class="copy"
                 @click.stop="copyGoods(item)">
              <img class="copy-icon"
                   src="@/assets/images/goods/icon_copy@2x.png"
                   alt="">
              <p class="fs-10 color-main">复制</p>
            </div>
          </div>
        </div>
        <div class="bottom">
          <!-- <div class="act" v-if="item.actGoodsStatus === 3"> -->
          <div class="act"
               v-if="item.actived === 1 && item.actGoodsStatus === 3">
            <span>{{ item.actName }}</span>
          </div>
          <div v-else></div>
          <div>
            <van-button v-if="item.status !== 3 && item.actived !== 1"
                        color="#666"
                        plain
                        round
                        class="px-5 ml-1"
                        size="mini"
                        @click.stop="delGoods(item)">删除</van-button>
            <van-button v-if="goodsType === 2 ? (item.status === 3) : (item.status === 0 || item.status === 2 || item.status === 4) "
                        color="#eb6133"
                        plain
                        round
                        class="px-5 ml-1"
                        size="mini"
                        @click.stop="editGoods(item)">编辑</van-button>
            <van-button v-if="item.status === 3"
                        color="#666"
                        plain
                        round
                        class="px-5 ml-1"
                        size="mini"
                        @click.stop="downGoods(item)">下架</van-button>
            <van-button v-if="item.status === 2 || item.status === 4"
                        color="#eb6133"
                        plain
                        round
                        class="px-5 ml-1"
                        size="mini"
                        @click.stop="upGoods(item)">上架</van-button>
          </div>
        </div>
      </div>
    </van-list>
    <van-empty v-else
               class="custom-image"
               :image="require('@/assets/images/empty/no_goods@2x.png')"
               description="暂无商品" />
    <!-- 编辑弹框 -->
    <van-overlay :show="open"
                 @click="open = false">
      <div class="wrapper"
           @click.stop>
        <div class="dialog">
          <div class="dialog-title">
            <p>编辑</p>
            <van-icon name="cross"
                      size="12"
                      color="#D5D5D5"
                      class="icon"
                      @click="open = false" />
          </div>
          <van-field v-model="form.stock"
                     type="number"
                     label="库存数量："
                     placeholder="请输入库存数量" />
          <van-field v-model="form.salePrice"
                     type="number"
                     label="商品金额："
                     placeholder="请输入商品金额" />
          <div class="dialog-but"
               @click="update">确认</div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
export default {
  name: 'shoppingGoods',
  data () {
    return {
      loading: false,
      finished: false,
      active: 3,
      titleActive: 0,
      goodsList: [],
      dataOK: true,
      value: '',
      statusList: ['待审核', '审核中', '待上架', '在售中', '已下架', '未通过'],
      queryParams: {
        status: null, // 订单状态 0->待审核；1->审核中；2->待上架；3->在售中；4->已下架；5->未通过
        pageNum: 1,
        pageSize: 10,
        storeId: '',
        goodsName: ''
      },
      open: false,
      goodsType: null, // 0->商城商品；1->街市商品；2->店铺商品
      goodsData: {},
      form: {
        stock: null,
        salePrice: null
      },
      updateUrl: null,
      deleteUrl: null,
      goodsListUrl: null
    }
  },
  computed: {},
  watch: {},
  created () {
    this.queryParams.storeId = this.$lance.getData('storeId')
    this.goodsType = this.$route.query.goodsType * 1
    if (this.$route.query.status) {
      this.active = this.$route.query.status * 1
    }
    if (this.$route.query.active) {
      this.active = this.$route.query.active * 1
    }
    if (this.goodsType === 0) {
      this.updateUrl = this.$apiUri.APP_STORE_GOODS_UPDATE_STATUS
      this.deleteUrl = this.$apiUri.APP_STORE_GOODS_DELETE
      this.goodsListUrl = this.$apiUri.APP_STORE_GOODSLIST
    }
    if (this.goodsType === 1) {
      this.goodsListUrl = this.$apiUri.APP_STREET_GOODS_PAGELIST
      this.updateUrl = this.$apiUri.APP_STREET_GOODS_UPDATE_STATUS
      this.deleteUrl = this.$apiUri.APP_STREET_GOODS_DELETE
    }
    if (this.goodsType === 2) {
      this.updateUrl = this.$apiUri.APP_STORE_GOODSUPDATE
      this.deleteUrl = this.$apiUri.APP_STORE_GOODSDELETE
      this.goodsListUrl = this.$apiUri.APP_STORE_GOODS_V2_LIST
    }
    this.queryParams.status = this.active
  },
  activated () {
    this.reset()
    this.getGoodsList()
  },
  methods: {
    // 搜索
    onSearch () {
      this.reset()
      this.queryParams.status = this.active
      this.queryParams.pageNum = 1
      this.getGoodsList()
    },
    // 清除搜索
    onClear () {
      this.reset()
      this.queryParams.status = this.active
      this.queryParams.goodsName = null
      this.getGoodsList()
    },
    // 切换标题tabs
    onTitleClick (name) {
      this.titleActive = name
      this.onClick(this.active)
    },
    // 切换tabs
    onClick (name) {
      this.active = name
      this.reset()
      this.queryParams = _.assign(
        {},
        {
          status: name,
          pageNum: 1,
          pageSize: 10,
          storeId: this.$lance.getData('storeId')
        }
      )
      this.getGoodsList()
    },
    // 重置
    reset () {
      this.goodsList = []
      this.finished = false
      this.loading = false
      this.dataOK = true
      this.queryParams.pageNum = 1
    },
    // 获取商城商品/街市商品/店铺商品列表
    getGoodsList () {
      this.loading = true
      this.$http.post(
        this.goodsListUrl,
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
    // 跳转商品详情
    toGoodsDetails (v) {
      this.$router.push({
        name: 'goodsDetails',
        query: {
          goodsId: v.id,
          goodsType: this.goodsType
        }
      })
    },
    // 复制
    copyGoods (v) {
      this.dialogHttp('复制', this.$apiUri.APP_STORE_GOODS_COPY, { goodsId: v.id })
    },
    // 删除商品
    delGoods (v) {
      this.dialogHttp('删除', this.deleteUrl, { ids: [v.id], actCode: v.actCode, type: 1 })
    },
    // 编辑商品
    editGoods (v) {
      // 商城商品编辑
      if (this.goodsType === 0) {
        this.$router.push({
          name: 'addGoodsBase',
          query: {
            goodsId: v.id
          }
        })
      }
      // 街市商品编辑
      if (this.goodsType === 1) {
        this.$router.push({
          name: 'addStreetGoodsIndex',
          query: {
            goodsId: v.id
          }
        })
      }
      // 店铺商品编辑
      if (this.goodsType === 2) {
        this.open = true
        this.goodsData = v
        this.form.stock = this.goodsData.stockQty
        this.form.salePrice = this.goodsData.salePrice
      }
    },
    // 店铺商品编辑操作
    update () {
      if (!this.form.stock) return this.$toast('库存数量不能为空')
      const numzz = /(^[1-9]\d*$)/
      if (!numzz.test(this.form.stock)) return this.$toast('请输入正确库存数量')
      if (!this.form.salePrice) return this.$toast('商品金额不能为空')
      const zz = /(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0)$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/
      if (!zz.test(this.form.salePrice)) {
        return this.$toast('请输入正确的价格')
      }
      this.form.goodsId = this.goodsData.id
      this.$http.post(
        this.$apiUri.APP_STORE_GOODS_SKUUPDATE,
        this.form,
        () => {
          this.open = false
          this.$toast('修改成功')
          this.form.salePrice = null
          this.form.stock = null
          this.queryParams.pageNum = 1
          this.reset()
          this.getGoodsList()
        }, err => {
          this.$toast(err.message)
        }
      )
    },
    // 上架商品
    upGoods (v) {
      this.dialogHttp('上架', this.updateUrl, { ids: [v.id], status: 3, actCode: v.actCode, type: 1 })
    },
    // 下架商品
    downGoods (v) {
      this.dialogHttp('下架', this.updateUrl, { ids: [v.id], status: 4, actCode: v.actCode, type: 1 })
    },
    // 弹框请求方法
    dialogHttp (typeName, url, parameters) {
      let _this = this
      _this.$dialog.confirm({
        title: '',
        message: `是否${typeName}商品？`,
        confirmButtonText: '是',
        cancelButtonText: '否'
      })
        .then(() => {
          _this.$http.post(
            url,
            parameters,
            () => {
              _this.$toast(`${typeName}成功`)
              _this.reset()
              _this.queryParams = _.assign(
                {},
                {
                  status: _this.active,
                  pageNum: 1,
                  pageSize: 10,
                  storeId: this.$lance.getData('storeId')
                }
              )
              _this.getGoodsList()
            }, err => {
              _this.$toast(err.message)
            }
          )
        })
        .catch(() => {
          _this.$toast(`已取消商品${typeName}`)
        })
    },
    onClickLeft () {
      this.$router.push('storeSelect')
    },
    onClickRight () {
      if (this.goodsType === 0) {
        this.$router.push('addGoodsBase')
      }
      if (this.goodsType === 1) {
        this.$router.push('addStreetGoodsIndex')
      }
      if (this.goodsType === 2) {
        this.$router.push('addStoreGoodsBase')
      }
    }
  }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
.shoppingGoods {
  /deep/ .van-nav-bar__title {
    font-weight: 300;
    max-width: 100%;
    .van-search {
      padding: 0;
    }
  }
  .add {
    width: 22px;
    height: 22px;
    background: #ffeee8;
    border-radius: 4px;
    line-height: 22px;
    text-align: center;
  }
  .center {
    padding: 12px;
  }
  .card {
    width: 100%;
    height: 100%;
    background: #ffffff;
    border-radius: 8px;
    padding: 14px;
    margin-bottom: 12px;
    .goods-thumb {
      width: 94px;
      height: 94px;
      border-radius: 4px;
      margin-right: 12px;
    }
    .goodsInfo {
      // min-width: 210px;
      // max-width: 240px;
      width: 230px;
    }
    .title {
      width: 184px;
      font-size: 14px;
      color: #333;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .line {
      width: 1px;
      height: 14px;
      background: #eeeeee;
      margin: 0 8px;
    }
    .copy {
      width: 24px;
      text-align: center;
      .copy-icon {
        width: 14px;
        height: 14px;
      }
    }
    .bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 14px;
      .act {
        min-width: 76px;
        height: 28px;
        font-size: 12px;
        color: #eb6133;
        background: #ffeee8;
        border-radius: 0px 18px 18px 0px;
        line-height: 28px;
        text-align: center;
        margin-left: -14px;
        padding: 0 14px;
      }
    }
  }
  // 弹框样式
  .van-overlay {
    z-index: 100;
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    .dialog {
      width: 300px;
      height: 210px;
      padding: 24px 14px 16px 14px;
      background: #fff;
      border-radius: 8px;

      &-title {
        p {
          height: 22px;
          font-size: 16px;
          font-weight: 300;
          line-height: 16px;
          text-align: center;
          color: #333333;
        }
        .icon {
          position: relative;
          top: -32px;
          left: 260px;
        }
      }

      &-but {
        width: 262px;
        height: 38px;
        font-size: 16px;
        background: linear-gradient(180deg, #f1722c 0%, #eb6133 100%);
        border-radius: 19px;
        margin: 16px auto;
        line-height: 38px;
        text-align: center;
        color: #fff;
      }
    }
  }
}
</style>
