<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-25 09:53:09
 * @Description  : 商品分类列表
-->
<template>
  <div class="goods">
    <!-- vant搜索 -->
    <div class="goods-list-nav">
      <van-search v-model="kw" shape="round" placeholder="请输入搜索关键词">
        <template #left>
          <van-icon
            @click="back"
            style="margin-right: 5px"
            size="22px"
            name="arrow-left"
          />
        </template>
      </van-search>
    </div>
    <!-- 排序 -->
    <!-- <div class="goods-list-sort">
      <div @click="onSort" :class="{ active: isActive == 0 }">综合排序</div>
      <div @click="saleSort" :class="{ active: isActive == 1 }">销量</div>
      <div @click="priceSort" class="d-flex align-items-center">
        <div :class="{ active: isActive == 2 || isActive == 3 }">价格</div>
        <div class="d-flex flex-column" style="margin-left: 5px">
          <van-icon
            name="arrow-up"
            size="10"
            class="js-scale"
            :class="{ active: isActive == 2 }"
            style="position: relative; top: 2px"
          />
          <van-icon
            name="arrow-down"
            size="10"
            class="js-scale"
            :class="{ active: isActive == 3 }"
            style="position: relative; bottom: 2px"
          />
        </div>
      </div>
      <div>
        <van-dropdown-menu>
          <van-dropdown-item
            v-model="value1"
            :options="option1"
            @change="screen"
          />
        </van-dropdown-menu>
      </div>
    </div> -->

    <!-- vant骨架屏 -->
    <van-skeleton
      v-for="i in 10"
      :key="i"
      title
      :row="3"
      :loading="list.length <= 0"
      class="pb-2"
      style="background-color: white"
    />

    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :immediate-check="false"
      class="goods-list-cards"
    >
      <!-- 商品卡片 -->
      <van-card
        v-for="(item, index) in list"
        :key="index"
        :price="item.salePrice.toFixed(2)"
        :title="item.goodsName"
        :desc="item.goodsTitle"
        :thumb="item.goodsIcon"
        :origin-price="item.marketPrice"
        @click="toDetails(item.id)"
        class="card-item"
      >
        <template #num>
          <van-icon name="cart" size="20" class="color-main" />
        </template>
      </van-card>
    </van-list>
  </div>
</template>
<script>
export default {
  data () {
    return {
      kw: '',
      list: [],
      value1: -1,
      option1: [
        { text: '店铺类型', value: -1 },
        { text: '供应商', value: 0 },
        { text: '自营店', value: 1 }
      ],
      isActive: 0, // 0综合排序，1销量，2价格升序，3价格降序
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        categoryId: null,
        kw: ''
      },
      loading: false,
      finished: false // 是否加载完毕
    }
  },
  mounted () {
    this.kw = this.$route.query.kw // 把搜索页面搜索的值传过来
    let categoryId = this.$route.query.categoryId
    if (categoryId) {
      this.queryParams.categoryId = categoryId
      this.getCategoryGoodsList()
    }
  },
  methods: {
    // 获取分类商品
    getCategoryGoodsList () {
      this.loading = true
      this.$http.post(
        this.$apiUri.APP_CATEGORY_GOODS_LIST,
        this.queryParams,
        (res) => {
          if (this.finished) return
          this.list = _.concat(this.list, res.data.list)
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
    },
    back () {
      // 返回分类页面
      this.$router.back(-1)
    },
    toSearch () {
      // 跳转到搜索页面
      this.$router.push({
        path: '/search'
      })
    },
    toDetails (id) {
      // 跳转到详情页面
      this.$router.push({
        path: '/goodsInfo',
        query: {
          goodsId: id
        }
      })
    },
    priceSort () {
      // 价格排序
      if (this.isActive < 2) {
        this.isActive = 2
        this.list.sort((a, b) => {
          return a.actualPrice - b.actualPrice
        })
      } else if (this.isActive === 2) {
        this.isActive = 3
        this.list.sort((a, b) => {
          return b.actualPrice - a.actualPrice
        })
      } else if (this.isActive === 3) {
        this.isActive = 2
        this.list.sort((a, b) => {
          return a.actualPrice - b.actualPrice
        })
      }
    },
    onSort () {
      // 综合排序
      this.isActive = 0
      this.list.sort((a, b) => {
        return b.shopLevel - a.shopLevel
      })
    },
    saleSort () {
      // 销量排序
      this.isActive = 1
      this.list.sort((a, b) => {
        return b.monthSales - a.monthSales
      })
    },
    screen (value) {
      // 筛选
      this.isActive = -1
      this.list = []

      if (value === -1) {
        this.$axios.get('http://api.kudesoft.cn/tdk/goods').then((res) => {
          this.list = res.data.data.data.list
        })
      } else {
        this.$axios.get('http://api.kudesoft.cn/tdk/goods').then((res) => {
          let list = res.data.data.data.list
          list.map((item) => {
            if (item.shopType === value) {
              this.list.push(item)
            }
          })
        })
      }
    }
  }
}
</script>
