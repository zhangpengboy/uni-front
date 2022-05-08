<template>
  <div>
    <router-view />

    <van-tabbar route safe-area-inset-bottom>
      <van-tabbar-item replace to="/exchange">
        <img
          class="img"
          slot="icon"
          slot-scope="props"
          :src="
            props.active
              ? require(`@/assets/images/exchange.png`)
              : require(`@/assets/images/dh.png`)
          "
        />
        兑换中心
      </van-tabbar-item>
      <!-- <van-tabbar-item replace to="/downtown">本地街市</van-tabbar-item> -->
      <!-- <van-tabbar-item replace to="/hometown">
        <img
          class="img"
          slot="icon"
          slot-scope="props"
          :src="
            props.active
              ? require(`@/assets/images/hg.png`)
              : require(`@/assets/images/hgs.png`)
          "
        />家乡王牌
      </van-tabbar-item> -->
      <van-tabbar-item replace to="/shopping">
        <img
          class="img"
          slot="icon"
          slot-scope="props"
          :src="
            props.active
              ? require(`@/assets/images/scs.png`)
              : require(`@/assets/images/sc.png`)
          "
        />精品商城
        <!-- 品牌特卖 -->
      </van-tabbar-item>
      <van-tabbar-item replace to="/my">
        <img
          class="img"
          slot="icon"
          slot-scope="props"
          :src="
            props.active
              ? require(`@/assets/images/mys.png`)
              : require(`@/assets/images/my.png`)
          "
        />我的
      </van-tabbar-item>
    </van-tabbar>
    <!-- 定位 -->
    <!-- <baidu-map id="map" @ready="handler" /> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0,
      longitude: '',
      latitude: ''
    }
  },
  methods: {
    // *  进入定位
    handler ({ BMap }) {
      this.BMap = BMap
      //! 百度原始方案定位 不准确 目前废弃 只做参考
      this.geolocation = new BMap.Geolocation()
      this.locationCity()
      // this.getTencentLocation()
    },
    //* 定位
    locationCity () {
      let _this = this
      _this.geolocation.getCurrentPosition(
        function (r) {
          console.log('百度定位的数据：', r)
          let _point = new _this.BMap.Point(r.point.lng, r.point.lat)
          _this.getBMapGeocoder(_point)
          // let _point = r.point.lat + ',' + r.point.lng
          _this.getLocation(r.point.lat, r.point.lng)
        },
        { enableHighAccuracy: true }
      )
    },
    // * 获取
    getLocation (lat, lng) {
      this.$http.post(
        this.$apiUri.APP_STORELOCATION_INFO_GET,
        { lat: lat.toString(), lng: lng.toString() },
        (res) => {
          console.log(res)
          // console.log(res);
          this.$lance.setData('townCode', res.data.addressComponent.town_code)
        },
        (err) => {
          this.$toast(err.message)
        }
      )
    },
    // *  百度地图获取当前定位信息
    getBMapGeocoder (point) {
      const _this = this
      let geocoder = new _this.BMap.Geocoder()
      let _point = new _this.BMap.Point(point.lng, point.lat)
      _this.getLocation(_point)
      geocoder.getLocation(_point, (r) => {
        // 保存其他页面需要的数据
        console.log('ssssssssss', r)
        let center = {
          lng: r.point.lng,
          lat: r.point.lat,
          province: r.addressComponents.province,
          city: r.addressComponents.city, // 市
          district: r.addressComponents.district, // 区
          street: r.addressComponents.street // 街道
        }
        _this.$store.dispatch('setLotCenter', center)
        // _this.getJieShiShopIsExit();
      })
    }
  }
}
</script>

<style lang="less" scoped>
.van-tabbar-item--active {
  color: #eb6132;
}
.img {
  width: 24px !important;
  height: 24px !important;
}
</style>
