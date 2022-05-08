<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-21 17:41:59
 * @Description  : 代理、店铺、数字货架、礼券妈妈的数据详情页
-->
<template>
  <div class="popedomDetails">
    <van-nav-bar
      :title="title"
      left-arrow
      fixed
      placeholder
      @click-left="$baseUtils.goBack(-1)"
    />
    <!-- 代理详情 -->
    <div class="content" v-if="type === 1 || type === 2">
      <div class="tab mb-2">
        <p class="fs-16 color-333 fw-700 mb-2">基本信息</p>
        <div class="d-flex align-items-center fs-14">
          <div class="name">登录账号：</div>
          <div class="right"><span class="vlaue">{{ popedomDetails.phone | filterPhone }}</span></div>
        </div>
        <div class="d-flex align-items-center fs-14">
          <div class="name">代理区域：</div>
          <div class="right"><span class="vlaue">{{ popedomDetails.areaName + '代理' }}</span></div>
        </div>
      </div>
      <div class="tab">
        <p class="fs-16 color-333 fw-700 mb-2">详细信息</p>
        <div class="d-flex align-items-center fs-14">
          <div class="name">联系人：</div>
          <div class="right"><span class="vlaue">{{ popedomDetails.userName }}</span></div>
        </div>
        <div class="d-flex align-items-center fs-14">
          <div class="name">联系电话：</div>
          <div class="right"><span class="vlaue">{{ popedomDetails.phone | filterPhone }}</span></div>
        </div>
        <div class="d-flex align-items-center fs-14">
          <div class="name">详细地址：</div>
          <div class="right"><span class="vlaue">{{ popedomDetails.storeAddress }}</span></div>
        </div>
      </div>
    </div>
    <!-- 店铺、数字货架、礼券妈妈详情 -->
    <div class="content" v-if="type != 1 && type != 2">
      <div class="tab">
        <p class="fs-16 color-333 fw-700 mb-2">详细信息</p>
        <div class="d-flex align-items-center fs-14">
          <div class="name">店铺名称：</div>
          <div class="right"><span class="vlaue">{{ popedomDetails.storeName }}</span></div>
        </div>
        <div class="d-flex align-items-center fs-14">
          <div class="name">联系人：</div>
          <div class="right"><span class="vlaue">{{ popedomDetails.storeOwnerName }}</span></div>
        </div>
        <div class="d-flex align-items-center fs-14">
          <div class="name">联系电话：</div>
          <div class="right"><span class="vlaue">{{ popedomDetails.storeOwnerPhone | filterPhone  }}</span></div>
        </div>
        <div class="d-flex align-items-center fs-14">
          <div class="name">店铺类型：</div>
          <div class="right"><span class="vlaue">{{ popedomDetails.infoRoleCode | filterStoreTypeStatus }}</span></div>
        </div>
        <div class="d-flex align-items-center fs-14">
          <div class="name">详细地址：</div>
          <div class="right"><span class="vlaue">{{ address }}</span></div>
        </div>
        <div v-if="type === 6" class="d-flex align-items-center fs-14">
          <div class="name">门头照：</div>
          <div class="right"><img v-if="popedomDetails.storesImg" :src="popedomDetails.storesImg" alt="" @click="imagePreview"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ImagePreview } from 'vant'
let details = null
export default {
  data () {
    return {
      title: '',
      type: null,
      popedomDetails: {
        areaName: ''
      },
      areaId: null,
      userId: null,
      address: ''
    }
  },

  created () {
    this.areaId = this.$lance.getJson('popedom').areaId
    this.userId = this.$lance.getJson('popedom').userId
    details = this.$lance.getJson('routeDetails')
    // console.log(details)
    if (details.type === 3 || details.type === 4 || details.type === 5) {
      this.title = '店铺详情'
    } else {
      this.title = details.name + '详情'
    }
    this.type = details.type
    if (this.type === 1 || this.type === 2) {
      this.getCityDetailsList()
    } else {
      this.getStoreDetailsList()
    }
  },
  methods: {
    // 门头照预览
    imagePreview () {
      ImagePreview([this.popedomDetails.storesImg])
    },
    // 获取市级、区级代理详情
    getCityDetailsList () {
      this.$http.post(
        this.$apiUri.APP_REGISTER_DLUSERINFO,
        { userId: this.userId, areaId: this.areaId },
        (res) => {
          this.dataOK = false
          this.popedomDetails = res.data || {}
        },
        (err) => {
          this.dataOK = true
          this.$toast(err.message)
        }
      )
    },
    // 获取店铺、数字货架、礼券妈妈代理详情
    getStoreDetailsList () {
      this.$http.post(
        this.$apiUri.APP_REGISTER_DLSTOREINFO,
        { storeId: this.$lance.getJson('popedom').storeId },
        (res) => {
          this.dataOK = false
          this.popedomDetails = res.data || {}
          this.address = `${res.data.area1Name}-${res.data.area2Name}-${res.data.area3Name}-${res.data.storeAddress}`
        },
        (err) => {
          this.dataOK = true
          this.$toast(err.message)
        }
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.popedomDetails {
  min-height: calc(100vh - 0px);
  .content {
    padding: 14px;
    .tab {
      width: 100%;
      height: 100%;
      background: #fff;
      border-radius: 8px;
      padding: 14px;
      .name {
        width: 85px;
        height: 50px;
        line-height: 50px;
        color: #999;
      }
      .right {
        width: 240px;
        border-bottom: 1px solid #dfdfdf;
        padding: 14px 14px 14px 24px;
        .vlaue {
          height: 20px;
          line-height: 20px;
          color: #333;
          font-weight: 700;
        }
        img {
          width: 44px;
          height: 44px;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
