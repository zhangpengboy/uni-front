<template>
  <div>
    <van-cell title="头像" center>
      <template #right-icon>
        <van-image
          round
          width="1.28rem"
          height="1.28rem"
          :src="
            userWeixinInfo.headImgUrl
              ? userWeixinInfo.headImgUrl
              : require('@/assets/images/logo.png')
          "
        />
      </template>
    </van-cell>
    <br />
    <van-cell-group>
      <van-cell title="手机号" :value="userInfo.phone" />
      <van-cell title="昵称" :value="userWeixinInfo.nickname" />
      <van-cell title="性别" :value="userWeixinInfo.sex | filterSex" />
      <van-cell title="绑定微信" value="已绑定" />
      <!-- <van-cell
        title="生日"
        is-link
        :value="
          userInfo.birthday
            ? $lance.parseTime(userInfo.birthday, '{y}-{m}-{d}')
            : ''
        "
        @click="openBirthday = true"
      /> -->
      <van-cell title="收货地址" is-link to="/site" />
      <!--v-if="ispartner == 4" -->
      <!-- <van-cell title="业务员设置" is-link to="/salesmanSetup" /> -->
      <van-cell center title="数字货架设置" v-if="issaleman">
        <template #right-icon>
          <van-switch
            v-model="isStatus"
            @change="change"
            size="0.64865rem"
            active-color="#eb6133"
          />
        </template>
      </van-cell>
      <!-- <van-cell title="手机号" :value="userInfo.phone" />
      <van-cell title="昵称" is-link :value="userInfo.userName" @click="openUserName=true"/>
      <van-cell title="性别" is-link :value="userInfo.sex | filterSex" @click="openSex=true"/>
      <van-cell title="生日" is-link :value="userInfo.birthday ? $lance.parseTime(userInfo.birthday, '{y}-{m}-{d}') : ''" @click="openBirthday=true"/>
      <van-cell title="收货地址" is-link to="/site" /> -->
    </van-cell-group>
    <!-- <van-button
      color="linear-gradient(180deg, #F1722C 0%, #EB6133 100%)"
      block
      size="small"
      round
      @click="loginOut"
      class="mt-8 but"
      >退出登录</van-button
    > -->
    <!-- 昵称弹框 -->
    <van-popup v-model="openUserName" round position="bottom" closeable>
      <h3 class="mt-8 ml-3">修改昵称</h3>
      <van-field
        v-model="userName"
        label="昵称"
        placeholder="请输入昵称"
        clearable
      />
      <van-button
        color="linear-gradient(180deg, #F1722C 0%, #EB6133 100%)"
        block
        size="small"
        round
        @click="updateName"
        class="my-6 but"
        >确认</van-button
      >
    </van-popup>
    <!-- 性别弹框 -->
    <van-popup v-model="openSex" round position="bottom">
      <van-picker
        title="修改性别"
        show-toolbar
        :columns="columns"
        :default-index="defaultSex"
        @cancel="openSex = false"
        @confirm="onConfirmSex"
      />
    </van-popup>
    <!-- 生日弹框 -->
    <van-popup v-model="openBirthday" round position="bottom">
      <van-datetime-picker
        v-model="birthday"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="openBirthday = false"
        @confirm="onConfirmBirthday"
      />
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['userWeixinInfo', 'userInfo'])
  },
  data () {
    return {
      openUserName: false,
      openSex: false,
      openBirthday: false,
      userName: '',
      columns: ['保密', '男', '女'],
      defaultSex: 0,
      birthday: new Date(),
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(),
      isStatus: false,
      issaleman: false,
      ispartner: 0
    }
  },
  created () {
    this.userName = this.userInfo.userName
    this.defaultSex = this.userInfo.sex
    this.birthday = this.userInfo.birthday || new Date()
    this.getDigitalShelves()
    this.getUsermallUser()
  },
  methods: {
    change (e) {
      console.log(111, e)
      let status = e ? 1 : 0
      this.$http.post(this.$apiUri.APP_UPDATESHELVES, { status }, res => {
        setTimeout(function () {
          this.isStatus = !this.isStatus
        }, 800)
      })
    },
    getDigitalShelves () {
      this.$http.post(
        this.$apiUri.APP_SHELVES,
        {},
        res => {
          this.issaleman = res.data.salesman
          this.isStatus = !!res.data.status
        },
        err => {
          this.$toast(err.message)
        }
      )
    },

    // 获取用户信息
    getUsermallUser () {
      this.$http.post(this.$apiUri.APP_USERGET, {}, res => {
        console.log('wwwww', res)
        if (res.success) {
          this.ispartner = res.data.roleCode
        }
      })
    },
    loginOut () {
      this.$store.dispatch('loginOut')
    },
    // 修改昵称
    updateName () {
      this.$http.post(
        this.$apiUri.APP_USEREDITINFO,
        { userName: this.userName },
        res => {
          this.openUserName = false
          this.$toast('昵称修改成功')
          const token = {
            token: res.data.split(' ')[1],
            tokenHead: res.data.split(' ')[0] + ' '
          }
          this.$store.dispatch('author', {
            token: token
          })
          this.getUserInfo()
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    // 修改性别
    onConfirmSex (value, index) {
      this.$http.post(
        this.$apiUri.APP_USEREDITINFO,
        { sex: index },
        res => {
          this.openSex = false
          this.$toast('性别修改成功')
          const token = {
            token: res.data.split(' ')[1],
            tokenHead: res.data.split(' ')[0] + ' '
          }
          this.$store.dispatch('login', {
            token: token
          })
          this.getUserInfo()
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    // 修改生日
    onConfirmBirthday () {
      this.$http.post(
        this.$apiUri.APP_USEREDITINFO,
        { birthday: this.$lance.parseTime(this.birthday, '{y}-{m}-{d}') },
        res => {
          this.openBirthday = false
          this.$toast('生日修改成功')
          const token = {
            token: res.data.split(' ')[1],
            tokenHead: res.data.split(' ')[0] + ' '
          }
          this.$store.dispatch('login', {
            token: token
          })
          this.getUserInfo()
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    /* 获取用户资料信息 */
    getUserInfo () {
      this.$http.post(
        this.$apiUri.APP_MALLUSER_GET,
        null,
        res => {
          this.$lance.setJson('userInfo', res.data)
          this.$store.dispatch('setUserInfo', {
            userInfo: res.data
          })
        },
        err => {
          this.$toast(err.message)
        }
      )
    }
  }
}
</script>
