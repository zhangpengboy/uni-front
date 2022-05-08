<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-21 17:41:59
 * @Description  : 区域选择
-->
<template>
  <div class="region">
      <van-radio-group v-if="dataOK || reginList.length > 0" v-model="radio">
        <van-cell-group>
          <van-cell v-for="(item, i) in reginList" :key="i" :title="item.areaName" clickable @click="onClick(item)">
            <template #right-icon>
              <van-radio :name="item.areaId" checked-color="#EB6133"/>
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>

    <van-empty
      v-else
      class="custom-image"
      :image="require('@/assets/images/empty/no_data@2x.png')"
      description="还没有数据"
    />
    <van-button
      color="linear-gradient(180deg, #F1722C 0%, #EB6133 100%)"
      block
      size="small"
      round
      @click="toAgent"
      :to="{ name: 'agentApply', query: { userId: $lance.getData('userId') }}"
      class="but footer"
      >代理商申请</van-button
    >
  </div>
</template>
<script>
export default {
  data () {
    return {
      dataOK: true,
      reginList: [],
      radio: null
    }
  },
  created () {
    this.getList()
  },
  methods: {
    toAgent () {
    },
    getList () {
      this.$http.post(
        this.$apiUri.APP_DLCUT,
        { userId: this.$lance.getData('userId') },
        (res) => {
          this.dataOK = false
          this.reginList = res.data.filter(item => item.status === 1) || []
          this.radio = this.$lance.getJson('areaId')
        },
        (err) => {
          this.dataOK = true
          this.$toast(err.message)
        }
      )
    },
    // 点击
    onClick (item) {
      this.radio = item.areaId
      this.$lance.setJson('areaLevel', item.areaLevel)
      this.$lance.setJson('areaId', item.areaId)
      console.log(this.$lance.getData('userId'))
      this.$router.push({
        name: 'center',
        query: {
          userId: this.$lance.getData('userId')
        }
      })
    },
    toPage () {
      this.$router.push('region')
    }
  }
}
</script>
<style lang="scss" scoped>
.region {
  background: #fff;
}
</style>
