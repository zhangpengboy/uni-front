<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-02-22 16:25:57
 * @Description : 收货地址列表
-->
<template>
  <div class="user">
    <van-address-list
      v-model="chosenAddressId"
      :list="list"
      default-tag-text="默认"
      @add="onAdd"
      @edit="onEdit"
      @select="onSelect"
    />
  </div>
</template>
<script>
export default {
  data () {
    return {
      chosenAddressId: null,
      list: [],
      isSelect: false
    }
  },
  mounted () {
    this.isSelect = !!(this.$route.query.isSelect || false)
    this.chosenAddressId = this.$route.query.chosenAddressId || null
  },
  methods: {
    /** 获取收货地址列表 */
    getStoreAddressList () {
      this.$http.post(this.$apiUri.APP_STORE_ADDRESS_LIST, null, (res) => {
        this.list = res.data.map((v) =>
          _.assign(v, {
            name: v.userName,
            tel: v.phone,
            isDefault: !!v.status
          })
        )
      })
    },
    /** 添加地址 */
    onAdd () {
      this.$router.push('addressEdit')
    },
    /** 修改地址 */
    onEdit (item) {
      this.$router.push({
        name: 'addressEdit',
        query: {
          isEdit: true,
          addressId: item.id
        }
      })
    },
    /** 选择地址 */
    onSelect (item) {
      if (!this.isSelect) return
      this.$lance.setJson('select-address', item)
      this.$router.back()
    }
  },
  activated () {
    this.getStoreAddressList()
  }
}
</script>
