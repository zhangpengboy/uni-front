<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-21 17:41:59
 * @Description  : 各个代理列表数据
-->
<template>
  <div class="popedomList">
    <van-nav-bar
      :title="title"
      left-arrow
      fixed
      placeholder
      @click-left="$baseUtils.goBack(-1)"
    />
    <div class="count">{{ `${title}：${vlaue}` }}</div>
    <div class="content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-if="dataOK || popedomList.length > 0"
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div
            class="tab"
            v-for="(item, i) in popedomList"
            :key="i"
            @click="toPage(item)"
          >
            <div class="d-flex align-items-start text">
              <img
                :src="require('@/assets/images/logo.png')"
                alt=""
              />
              <div class="ml-2">
                <template v-if="type === 1 || type === 2">
                  <p class="fs-14 color-333 fw-700">
                    {{ `${item.areaName}代理` }}
                  </p>
                  <p class="fs-13 my-2 color-muted">
                    合伙人：{{ item.userName }}
                  </p>
                  <p class="fs-13 color-muted">
                    加盟时间：{{ $lance.parseTime(item.createTime) }}
                  </p>
                </template>
                <template v-if="type === 3 || type === 4 || type === 5">
                  <p class="fs-14 color-333 fw-700">{{ item.storeName }}</p>
                  <p class="fs-13 my-2 color-muted">
                    类型：{{ item.infoRoleCode | filterStoreTypeStatus }}
                  </p>
                  <p class="fs-13 color-muted">
                    注册时间：{{ $lance.parseTime(item.registerTime) }}
                  </p>
                </template>
                <template v-if="type === 6">
                  <p class="fs-14 color-333 fw-700">{{ item.storeName }}</p>
                  <p class="fs-13 my-2 color-muted name">
                    店东姓名：{{ item.storeOwnerName }}
                  </p>
                  <p class="fs-13 mb-2 color-muted">
                    业务员手机号：{{ item.salesmanPhone | filterPhone }}
                  </p>
                  <p class="fs-13 color-muted">
                    开通时间：{{ $lance.parseTime(item.registerTime) }}
                  </p>
                </template>
                <template v-if="type === 7">
                  <p class="fs-14 color-333 fw-700">{{ item.storeName }}</p>
                  <p class="fs-13 my-2 color-muted">
                    店东姓名：{{ item.storeOwnerName }}
                  </p>
                  <p class="fs-13 color-muted">
                    开通时间：{{ $lance.parseTime(item.registerTime) }}
                  </p>
                </template>
              </div>
            </div>
            <div v-if="type === 1 || type === 2" class="fs-13 color-main status">
              {{ filerStatus(item.status) }}
            </div>
            <div v-else class="fs-13 color-main status">
              {{ filerStatus(item.storeStatus) }}
            </div>
          </div>
        </van-list>
        <van-empty
          v-else
          class="mt-5"
          :image="require('@/assets/images/empty/no_data@2x.png')"
          description="还没有数据"
        />
      </van-pull-refresh>
    </div>
  </div>
</template>
<script>
let details = null
export default {
  data () {
    return {
      title: '',
      type: null,
      vlaue: null,
      dataOK: true,
      status: null,
      popedomList: [],
      loading: false,
      finished: false,
      refreshing: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: this.$lance.getData('userId'),
        areaId: this.$lance.getJson('areaId'),
        areaLevel: this.$lance.getJson('areaLevel'),
        storeRoleCode: null,
        isCloudStore: null
      }
    }
  },
  created () {
    details = this.$lance.getJson('details')
    if (details.type === 3 || details.type === 4 || details.type === 5) {
      this.title = '店铺'
    } else {
      this.title = details.name
    }
    this.type = details.type
    this.vlaue = details.count
    this.onLoad()
  },
  methods: {
    onRefresh () {
      // 清空列表数据
      this.finished = false
      this.queryParams.pageNum = 1
      this.popedomList = []
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.onLoad()
    },
    // 过滤状态
    filerStatus (i) {
      if (this.type === 1 || this.type === 2) {
        return ['禁用', '开通成功', '待审核'][i]
      } else {
        return ['开通成功', '待审核', '已拒绝', '禁用'][i]
      }
    },
    onLoad () {
      if (this.type === 1) {
        this.getCityList()
      }
      if (this.type === 2) {
        this.getDistrictList()
      }
      if (this.type === 3) {
        this.getStoreList(3)
      }
      if (this.type === 4) {
        this.getStoreList(5)
      }
      if (this.type === 5) {
        this.getStoreList(4)
      }
      if (this.type === 6) {
        this.getStoreList(0, 1)
      }
      if (this.type === 7) {
        this.getStoreList(1)
      }
    },
    // 获取市级代理列表
    getCityList () {
      this.getAxios(this.$apiUri.APP_INCOMEDETAIL_CITY, this.queryParams)
    },
    // 获取区级代理列表
    getDistrictList () {
      this.getAxios(this.$apiUri.APP_INCOMEDETAIL_DISTRICT, this.queryParams)
    },
    // 获取店铺、数字货架、礼券妈妈代理列表
    getStoreList (storeRoleCode, isCloudStore) {
      this.queryParams.storeRoleCode = storeRoleCode
      this.queryParams.isCloudStore = isCloudStore
      this.getAxios(this.$apiUri.APP_INCOMEDETAIL_STORE, this.queryParams)
    },
    getAxios (url, params) {
      this.loading = true
      this.$http.post(
        url,
        params,
        (res) => {
          if (this.finished) return
          this.dataOK = false
          this.popedomList = _.concat(this.popedomList, res.data.list)
          this.loading = false
          this.refreshing = false
          if (
            res.data.totalPage === 0 ||
            res.data.totalPage === this.queryParams.pageNum
          ) {
            this.finished = true
            return
          }
          this.queryParams.pageNum++
        },
        (err) => {
          this.loading = false
          this.dataOK = true
          this.finished = true
          this.refreshing = false
          this.$toast(err.message)
        }
      )
    },
    toPage (item) {
      this.$lance.setJson('popedom', item)
      this.$lance.setJson('routeDetails', details)
      this.$router.push('popedomDetails')
    }
  }
}
</script>
<style lang="scss" scoped>
.popedomList {
  min-height: calc(100vh - 0px);
  .count {
    width: 100%;
    height: 52px;
    font-size: 14px;
    background-image: url("~@/assets/images/tabbar/taber_bg@2x.png");
    background-size: cover;
    background-repeat: inherit;
    line-height: 52px;
    text-align: center;
    color: #fff;
    font-weight: 700;
  }
  .status {
    width: 58px;
    text-align: center;
  }
  .name {
    width: 210px;
    text-align: left;
  }
  .content {
    padding: 12px;
    .tab {
      height: 100%;
      display: flex;
      justify-content: space-between;
      background: #ffffff;
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 12px;
      .text {
        max-width: 268px;
      }
      img {
        width: 44px;
        height: 44px;
        border-radius: 50%;
      }
    }
  }
}
</style>
