<template>
  <div>
    <div>
      <van-form>
        <van-field
          label-width="100px"
          v-model="leaderPhone"
          required
          label="业务经理手机号"
          placeholder="请输入业务经理手机号"
          :rules="[{ required: true }]"
        />
        <div class="but">
          <van-button @click="submit" round block type="info" color="#eb6132"
            >提交</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      leaderPhone: ''
    }
  },
  methods: {
    submit () {
      if (
        !/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/.test(
          this.leaderPhone
        )
      ) {
        this.$toast('请输入正确的手机号')
        return
      }
      this.$http.post(
        this.$apiUri.APP_ADD_UPDTA_BYPHONE,
        { leaderPhone: this.leaderPhone },
        res => {
          console.log(res)
          if (res.success) {
            this.$toast('添加成功')
            this.$router.push('salesmanSetup')
          } else {
            this.$toast('当前用户已被绑定')
          }
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
.but {
  margin: 30px 56px 0 56px;
}
</style>
