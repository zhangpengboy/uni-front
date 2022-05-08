<template>
  <div>
    <div>
      <van-form>
        <van-field
          label-width="100px"
          v-model="form.leaderPhone"
          maxlength="11"
          label="业务经理手机号"
          placeholder="请输入业务经理手机号"
          :rules="[{ required: true }]"
        />
        <van-field
          label-width="100px"
          v-model="form.salesmanPhone"
          maxlength="11"
          required
          label="业务员手机号"
          placeholder="请输入业务员手机号"
          :rules="[{ required: true }]"
        />
        <div class="but">
          <van-button @click="bindRelationByPhone" round block color="#eb6132"
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
      form: {
        leaderPhone: '',
        salesmanPhone: ''
      }
    }
  },
  created () {},
  methods: {
    bindRelationByPhone () {
      if (
        !/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/.test(
          this.form.leaderPhone
        )
      ) {
        this.$toast('请输入正确的手机号')
        return
      }

      if (
        !/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/.test(
          this.form.salesmanPhone
        )
      ) {
        this.$toast('请输入正确的手机号')
        return
      }

      this.$http.post(this.$apiUri.APP_ADD_UPDTA_BYPHONE, this.form, res => {
        console.log(res)
        if (res.success) {
          this.$toast('添加成功')
          this.$router.push('salesmanSetup')
        } else {
          this.$toast('当前用户已被绑定')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.but {
  margin: 30px 56px 0 56px;
}
</style>
