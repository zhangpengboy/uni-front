<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-10 11:33:52
 * @Description : 商户登录
-->
<template>
  <div>
    <div class="imgs">
      <img src="@/assets/images/logo.png" alt="" />
    </div>
    <div class="p">引客·留客·锁客专家</div>
    <div class="form">
      <van-form>
        <div class="phone">
          手机号
          <van-field
            v-model="form.phone"
            maxlength="11"
            placeholder="请输入您的手机号"
            size="large"
            class="py-3"
            type="digit"

          />
        </div>
        <div class="password">
          密码
          <van-field
            v-model="form.password"
            type="password"
            placeholder="请输入您的密码"
            size="large"
            class="py-3"
          />
        </div>

        <router-link tag="p" class="edit" to="/edit">重置登录密码</router-link>
        <div class="but">
          <van-button
            style="background: #eb6133; border: 1px solid #eb6133; color: #fff"
            round
            block
            @click="submitForm"
            >登录</van-button
          >
        </div>
        <div @click="register" class="register">注册</div>
      </van-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      phone: '',
      storeId: '',
      form: {
        phone: '',
        password: ''
      },
      userList: {} // 当前选择店铺
    }
  },
  created () {},
  methods: {
    // 获取店铺
    getStoreInfoByPhone () {
      this.$http.post(
        this.$apiUri.APP_ADD_UPDTA_SROREINFO_PHONE,
        { phone: this.form.phone },
        (res) => {
          this.userList = res.data
          let arr = this.userList.length > 0
            ? this.userList.sort(this.compare('status'))
            : [{ status: 0 }]
          const obj = arr[0]
          if (obj.status === 0) {
            this.$router.push({
              path: 'storeSelect',
              query: {
                phone: this.form.phone
              }
            })
          } else if (obj.status === 1) {
            this.$router.push({
              name: 'waitReview',
              query: {
                storeId: obj.id
              }
            })
          } else if (obj.status === 2) {
            this.$router.push({
              path: 'refuse',
              query: {
                storeId: obj.id,
                phone: this.form.phone
              }
            })
          } else if (obj.status === 3) {
            this.$router.push({
              path: 'close',
              query: {
                storeId: obj.id
              }
            })
          }
        }
      )
    },

    // 注册
    register () {
      // this.$toast.loading({ message: '加载中...', forbidClick: true })
      this.$router.push('/register')
    },
    compare (property) {
      return (a, b) => {
        var value1 = a[property]
        var value2 = b[property]
        return value1 - value2
      }
    },
    // * 登录
    submitForm () {
      if (this.$baseUtils.isPhone(this.form.phone) !== '') {
        return this.$toast(this.$baseUtils.isPhone(this.form.phone))
      }
      if (!this.form.password) return this.$toast('密码不能为空')
      const _params = _.assign({
        phone: this.form.phone,
        password: this.form.password
      })
      this.$http.post(
        this.$apiUri.APP_LOGIN,
        _params,
        (res) => {
          this.$toast('登录成功~')
          this.$store.dispatch('login', {
            token: res.data,
            shop: this.userList
          })
          this.getStoreInfoByPhone()
        },
        (err) => {
          this.$toast(err.message)
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
.reg {
  text-align: center;
  margin-top: -20px;
  font-size: 14px;
  font-weight: 300;
  line-height: 20px;
  color: #eb6133;
  opacity: 1;
}
.edit {
  margin-top: 10px;
  text-align: right;
  margin-bottom: 20px;
  margin-right: 20px;
  color: #ed6133;
}
.register {
  margin: 0 auto;

  font-size: 14px;
  color: #ed6133;

  text-align: center;
}
.picker {
  background-color: #fff;
  border-bottom: 1px solid #f3f3f3;
  text-indent: 1em;
  padding-top: 30px;
  color: #333333;
  font-weight: 400;
  font-size: 16px;
}
.password {
  background-color: #fff;
  border-bottom: 1px solid #f3f3f3;
  text-indent: 1em;
  padding-top: 30px;
  color: #333333;
  font-weight: 400;
  font-size: 16px;
}
.phone {
  background-color: #fff;
  border-bottom: 1px solid #f3f3f3;
  text-indent: 1em;
  padding-top: 30px;
  border-radius: 8px 8px 0px 0px;
  color: #333333;
  font-weight: 400;
  font-size: 16px;
}
.imgs {
  width: 100%;
  width: 66px;
  height: 58px;
  opacity: 1;
  margin-left: 40%;
  padding-top: 20px;
}
.text {
  width: 72px;
  height: 22px;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  color: #333333;
  opacity: 1;
  margin-left: 14px;
}
.p {
  width: 140px;
  height: 20px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #eb6133;
  opacity: 1;
  margin-top: 10%;
  margin-left: 33%;
  margin-bottom: 43px;
}
.form {
  margin-top: 12px;
}
.but {
  width: 262px;
  margin: 20px auto;
}
</style>
