<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-02-22 13:41:19
 * @Description : 添加收货地址
-->
<template>
  <div calss="user">
    <van-address-edit
      :area-list="areaList"
      :show-delete="isEdit"
      show-set-default
      :address-info="addressInfo"
      show-search-result
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
    />
  </div>
</template>
<script>
import areaList from '@/utils/area'
export default {
  data () {
    return {
      areaList,
      isEdit: false, // 是否修改
      isSelect: false, // 是否选择地址
      addressInfo: {} // 收货地址默认信息
    }
  },
  mounted () {
    this.isEdit = !!(this.$route.query.isEdit || false)
    this.isSelect = !!(this.$route.query.isSelect || false)
    this.getAddressInfo()
  },
  methods: {
    getAddressInfo (addressId) {
      if (!this.isEdit) return
      this.$http.post(this.$apiUri.APP_STORE_ADDRESS_INFO, {
        addressId: this.$route.query.addressId
      }, res => {
        this.addressInfo = _.assign(res.data, {
          id: res.data.id,
          name: res.data.userName,
          tel: res.data.phone,
          province: _.split(res.data.address, '-')[0],
          city: _.split(res.data.address, '-')[1],
          county: _.split(res.data.address, '-')[2],
          addressDetail: _.split(res.data.address, '-')[3],
          areaCode: _.findKey(this.areaList.county_list, v => v === _.split(res.data.address, '-')[2]),
          isDefault: !!res.data.status
        })
      })
    },
    /** 保存地址 */
    onSave (content) {
      const params = {
        userName: content.name,
        phone: content.tel,
        address: content.province + '-' + content.city + '-' + content.county + '-' + content.addressDetail,
        status: this.isSelect ? 1 : (content.isDefault ? 1 : 0)
      }
      if (!this.isEdit) { // 新增
        this.$http.post(this.$apiUri.APP_STORE_ADDRESS_ADD, params, res => {
          this.$toast('保存成功')
          setTimeout(() => {
            this.$router.back()
          }, 800)
        })
      } else {
        this.$http.post(this.$apiUri.APP_STORE_ADDRESS_EDIT, params, res => {
          this.$toast('保存成功')
          setTimeout(() => {
            this.$router.back()
          }, 800)
        })
      }
    },
    /** 删除地址 */
    onDelete (content) {
      if (!this.isEdit) return
      this.$http.post(this.$apiUri.APP_STORE_ADDRESS_DEL, {
        addressId: content.id
      }, res => {
        this.$toast('删除成功')
        setTimeout(() => {
          this.$router.back()
        }, 800)
      })
    }
  }
}
</script>
