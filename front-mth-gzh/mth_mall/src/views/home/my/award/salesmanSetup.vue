<template>
  <div>
    <van-nav-bar title="业务员设置" left-arrow @click-left="onClickLeft">
      <template #right>
        <van-icon @click="clickright" name="setting-o" size="18" />
      </template>
    </van-nav-bar>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div class="list" v-for="item in userList" :key="item.id">
        <div class="list_box">
          <div class="image">
            <van-image
              width="44"
              height="44"
              :src="
                item.headerImg != ''
                  ? item.headerImg
                  : require('@/assets/images/logo.png')
              "
            />
          </div>
          <div class="list_center">
            <div style="margin-bottom:8px">昵称：{{ item.nickname }}</div>
            <div>手机号：{{ item.phone }}</div>
          </div>
          <div class="list_bottom" v-if="item.roleCode == 2">
            业务经理
          </div>
          <div class="list_bottom" v-if="item.roleCode == 1">
            业务员
          </div>
        </div>
      </div>
    </van-list>

    <div class="buttom">
      <van-button
        round
        widht="140px"
        @click="addSalesman"
        color="#eb6132"
        type="info"
        >添加业务员</van-button
      >
      <van-button
        round
        widht="140px"
        @click="addmanager"
        color="#eb6132"
        type="info"
        >添加业务经理</van-button
      >
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['userInfo'])
  },
  data () {
    return {
      loading: false,
      finished: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        isfinish: false,
        userRole: ''
      },
      userList: []
    }
  },
  created () {
    this.queryParams.userRole = this.userInfo.roleCode
    this.pageListByUser()
  },
  methods: {
    pageListByUser () {
      this.$http.post(
        this.$apiUri.APP_ADD_UPDTA_BYUSER,
        this.queryParams,
        res => {
          console.log(res)
          this.userList = res.data.list
        }
      )
    },
    onClickLeft () {
      this.$router.go(-1)
    },
    clickright () {
      console.log(1)
    },
    onLoad () {
      this.finished = true

      console.log(1)
    },
    addSalesman () {
      this.$router.push('/addSalesman')
    },
    addmanager () {
      this.$router.push('/addmanager')
    }
  }
}
</script>

<style lang="less" scoped>
.van-button {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  height: 1.17333rem;
  margin: 0;
  padding: 0;
  font-size: 0.42667rem;
  line-height: 1.2;
  text-align: center;
  cursor: pointer;
  -webkit-transition: opacity 0.2s;
  transition: opacity 0.2s;
  -webkit-appearance: none;
  width: 140px;
}
.buttom {
  width: 100%;
  position: fixed;
  bottom: 0;
  height: 56px;
  line-height: 56px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.list_center {
  font-size: 14px;
  font-weight: 300;
  margin-top: 15px;
  color: #333333;
}
.image {
  border-radius: 50%;
  overflow: hidden;
  margin-left: 14px;
  margin-top: 16px;
  margin-right: 12px;
}
.list_bottom {
  width: 56px;
  height: 20px;
  background: #eb6132;
  color: #fff;
  border: 1px solid #eb6132;
  opacity: 1;
  text-align: center;
  border-radius: 32px;
  font-size: 12px;
  margin-left: 90px;
}
.list_box {
  display: flex;
  background-color: #fff;
  align-items: center;
  border-bottom: 1px solid #f6f6f6;
  padding-bottom: 5px;
}
.list {
  background-color: #fff;
}
</style>
