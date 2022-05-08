<template>
  <div>
    <van-nav-bar
      :title="title"
      :right-text="rightText"
      left-arrow
      fixed
      placeholder
      @click-left="$router.go(-1)"
      @click-right="onClickRight"
    />
    <van-form validate-first>
      <van-field
        v-model="userName"
        label="收货人"
        colon
        placeholder="请输入收货人姓名"
      />
      <van-field
        v-model="phone"
        type="tel"
        colon
        center
        clearable
        label="手机号"
        name="pattern"
        placeholder="请输入收货人电话"
      >
        <template #button>
          <button class="bzh" @click.stop="account">使用本账号</button>
        </template>
      </van-field>
      <van-field
        readonly
        clickable
        colon
        v-model="region"
        label="地区选择"
        right-icon="arrow"
        placeholder="点击选择省市区"
        @click="showArea = true"
      />
      <van-field
        v-model="detailed"
        colon
        label="详细地址"
        placeholder="街道、楼道号等"
      />
    </van-form>
    <van-cell-group class="mt-2">
      <van-cell
        title="设置为默认地址"
        label="提醒：每次下单会默认推荐使用该地址"
        center
      >
        <template #right-icon>
          <van-switch
            v-model="isDefault"
            size="0.64865rem"
            active-color="#EB6133"
          />
        </template>
      </van-cell>
    </van-cell-group>

    <van-button
      color="linear-gradient(180deg, #F1722C 0%, #EB6133 100%)"
      block
      size="small"
      round
      @click="save"
      class="but footer"
      >保存</van-button
    >
    <van-popup v-model="showArea" position="bottom">
      <!-- <van-area
        :area-list="areaList"
        @confirm="onConfirm"
        @cancel="showArea = false"
      /> -->
      <van-cascader
        v-model="cascaderValue"
        title="请选择所在地区"
        :options="options"
        @close="showArea = false"
        @finish="onFinish"
        :field-names="fieldNames"
      />
    </van-popup>
  </div>
</template>

<script>
// import area from '@/utils/area.js'
import city from '@/utils/city.json'
export default {
  data () {
    return {
      rightText: '',
      title: '新增收货地址',
      id: '',
      userName: '',
      phone: '',
      detailed: '',
      isDefault: false,
      region: '',
      showArea: false,
      // areaList: area,
      cascaderValue: '',
      options: null,
      fieldNames: {
        text: 'value',
        value: 'id',
        children: 'children'
      },
      regStr: /^[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\\A9|\\AE]\u3030|\uA9|\uAE|\u3030$/
      // pattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/
    }
  },
  created () {
    this.options = city
    this.id = this.$route.query.id === 'undefined' ? '' : this.$route.query.id
    console.log('id', this.id)
    if (this.id) {
      this.title = '修改收货地址'
      this.rightText = '删除'
      this.getAddressInfo(this.id)
    }
  },
  methods: {
    // 根据ID获取地址详情
    getAddressInfo (id) {
      console.log(id)
      this.$http.post(
        this.$apiUri.APP_ADDRESSDETAIL,
        { workId: id },
        result => {
          console.log('qwe', result)
          let addrArr = _.split(result.data.address, '-')
          this.userName = result.data.userName
          this.phone = result.data.phone
          this.detailed = addrArr[3]
          this.isDefault = !!result.data.status
          this.region = `${addrArr[0]}-${addrArr[1]}-${addrArr[2]}`
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    // 选择地区
    onConfirm (values) {
      this.region = values
        .filter(item => !!item)
        .map(item => item.name)
        .join('-')
      this.showArea = false
    },
    // 选择地区
    onFinish ({ selectedOptions }) {
      this.showArea = false
      this.regionList = selectedOptions
      this.region = selectedOptions.map(item => item.value).join('-')
    },
    // 保存地址
    save () {
      if (!this.userName) return this.$toast('收货人姓名不能为空')
      if (!this.phone) {
        return this.$toast('收货人电话不能为空')
      }
      if (
        !/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/.test(
          this.phone
        )
      ) {
        return this.$toast('收货人电话不正确')
      }
      if (!this.region) return this.$toast('地区不能为空')
      if (!this.detailed) return this.$toast('详细地址不能为空')
      if (this.regStr.test(this.detailed)) return this.$toast('详细地址不能输入表情字符')
      let data = {
        userName: this.userName,
        phone: this.phone,
        address: this.region + '-' + this.detailed,
        status: this.isDefault ? 1 : 0
      }
      if (this.id) {
        // 修改
        data.id = this.id
        this.updateSite(data)
      } else {
        // 新增
        this.addSite(data)
      }
      // this.$router.back()
      // this.getAddressInfo()

      // this.$router.push({
      //   path: '/site',
      // })
    },
    // 新增地址
    addSite (data) {
      this.$http.post(
        this.$apiUri.APP_ADDRESS_ADD,
        data,
        res => {
          this.$toast('新增成功')
          // this.$router.push('site')
          console.log(112, res)
          // this.$router.replace('site')
          this.$baseUtils.goBack(-1)
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    // 修改地址
    updateSite (data) {
      this.$http.post(
        this.$apiUri.APP_ADDRESS_UPDATE,
        data,
        res => {
          this.$toast('修改成功')
          // this.$router.replace('site')
          // this.$router.push('site')
          this.$baseUtils.goBack(-1)
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    // 删除
    onClickRight () {
      this.$http.post(
        this.$apiUri.APP_ADDRESS_DEL,
        { workId: this.id },
        res => {
          this.$toast('删除成功')
          // this.$router.replace('site')
          // this.$router.push('site')
          // this.$router.back()
          this.$baseUtils.goBack(-1)
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    // 使用本账号
    account () {
      this.phone = this.$store.state.userInfo.phone
    }
  }
}
</script>

<style lang="scss" scoped>
.bzh {
  width: 72px;
  height: 23px;
  border: 1px solid #eb6133;
  opacity: 1;
  border-radius: 60px;
  font-size: 12px;
  color: #eb6133;
  line-height: 23px;
  text-align: center;
}
</style>
