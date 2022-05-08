<!-- 身份证表单项 -->
<template>
  <div class="userCard backgroundWhite">
    <van-form validate-first>
      <van-field
        label-class="color-333"
        clickable
        v-model="form.userCardNo"
        input-align="right"
        :readonly="readonly"
        placeholder="请输入身份证号"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>法人身份证号</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        clickable
        v-model="form.userName"
        input-align="right"
        :readonly="readonly"
        placeholder="请输入姓名"
        @blur="onBlur"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>法人姓名</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        clickable
        v-model="form.userPhone"
        input-align="right"
        type="tel"
        :readonly="readonly"
        placeholder="请输入手机号"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>法人手机号</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        clickable
        v-model="form.periodValidity"
        input-align="right"
        :readonly="readonly"
        placeholder="格式：20150101-20200101"
      >
        <template #label>
          <span>身份证有效期</span>
        </template>
      </van-field>
      <van-cell title="身份证照片">
        <template #icon>
          <span class="color-danger">*</span>
        </template>
        <template #label>
          <div class="d-flex">
            <van-uploader
              v-model="uploader1"
              :max-count="1"
              :max-size="1024 * 1024 * 10"
              @oversize="onOversize1"
              :after-read="afterReadUploader1"
              @delete="deleteUploader1"
              :deletable="!readonly"
            >
              <template #default>
                <img
                  class="uploader-bgImg mr-1"
                  :src="require('@/assets/images/iboxPay/front@2x.png')"
                  alt=""
                />
              </template>
            </van-uploader>
            <van-uploader
              v-model="uploader2"
              :max-count="1"
              :max-size="1024 * 1024 * 10"
              @oversize="onOversize2"
              :after-read="afterReadUploader2"
              @delete="deleteUploader2"
              :deletable="!readonly"
            >
              <template #default>
                <img
                  class="uploader-bgImg"
                  :src="require('@/assets/images/iboxPay/contrary@2x.png')"
                  alt=""
                />
              </template>
            </van-uploader>
          </div>
          <p class="fs-13 color-c1">（只能上传jpg/png文件，且不超过10M）</p>
        </template>
      </van-cell>
      <van-cell title="法人手持身份证照片">
        <template #icon>
          <span class="color-danger">*</span>
        </template>
        <template #label>
          <van-uploader
            v-model="uploader3"
            :max-count="1"
            :max-size="1024 * 1024 * 10"
            @oversize="onOversize3"
            :after-read="afterReadUploader3"
            @delete="deleteUploader3"
            :deletable="!readonly"
          />
          <p class="fs-13 color-c1">（只能上传jpg/png文件，且不超过10M）</p>
        </template>
      </van-cell>
    </van-form>
    <van-button class="but my-4" round block type="info" @click="submitForm"
      >下一步</van-button
    >
  </div>
</template>

<script>
export default {
  name: 'userCard',
  props: {
    form: {
      type: Object,
      default: function () {
        return {}
      }
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      uploader1: [],
      uploader2: [],
      uploader3: [],
      regPhone: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
      regSFZ: /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0[1-9]|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/
      // form: {
      //   imgList: []
      // }
    }
  },
  watch: {
    form (newName, oldName) {
      if (
        newName.imgList.filter(item => item.name === 'idCardFront').length > 0
      ) {
        this.uploader1 = [
          {
            url: newName.imgList.filter(item => item.name === 'idCardFront')[0]
              .url
          }
        ]
      }
      if (
        newName.imgList.filter(item => item.name === 'idCardBack').length > 0
      ) {
        this.uploader2 = [
          {
            url: newName.imgList.filter(item => item.name === 'idCardBack')[0]
              .url
          }
        ]
      }
      if (
        newName.imgList.filter(item => item.name === 'personWithIdCard')
          .length > 0
      ) {
        this.uploader3 = [
          {
            url: newName.imgList.filter(
              item => item.name === 'personWithIdCard'
            )[0].url
          }
        ]
      }
    }
  },
  methods: {
    //
    onBlur () {
      if (this.$lance.getData('mchType') === '3') {
        this.form.mchtName = `商户_${this.form.userName}`
      }
    },
    // 身份证正面
    onOversize1 (file) {
      this.$toast('身份证正面图片大小不能超过 10MB')
    },
    // 身份证反面
    onOversize2 (file) {
      this.$toast('身份证反面图片大小不能超过 10MB')
    },
    // 手持身份证
    onOversize3 (file) {
      this.$toast('手持身份证图片大小不能超过 10MB')
    },
    // 身份证正面
    afterReadUploader1 (File) {
      if (Array.isArray(File)) {
        return this.$toast('只能上传一张图片')
      }
      this.afterReadUploader(File, 1, 'idCardFront')
    },
    // 身份证反面
    afterReadUploader2 (File) {
      if (Array.isArray(File)) {
        return this.$toast('只能上传一张图片')
      }
      this.afterReadUploader(File, 2, 'idCardBack')
    },
    // 手持身份证
    afterReadUploader3 (File) {
      if (Array.isArray(File)) {
        return this.$toast('只能上传一张图片')
      }
      this.afterReadUploader(File, 3, 'personWithIdCard')
    },
    deleteUploader1 () {
      this.form.imgList = _.assign(
        [],
        this.form.imgList.filter(item => item.name !== 'idCardFront')
      )
      // console.log(this.form.imgList)
    },
    deleteUploader2 () {
      this.form.imgList = _.assign(
        [],
        this.form.imgList.filter(item => item.name !== 'idCardBack')
      )
    },
    deleteUploader3 () {
      this.form.imgList = _.assign(
        [],
        this.form.imgList.filter(item => item.name !== 'personWithIdCard')
      )
    },
    submitForm () {
      if (!this.form.userCardNo) return this.$toast('法人身份证号不能为空')
      if (!this.regSFZ.test(this.form.userCardNo)) {
        return this.$toast('法人身份证号不正确')
      }
      if (!this.form.userName) return this.$toast('法人姓名不能为空')
      if (!this.form.userPhone) {
        return this.$toast('法人手机号不能为空')
      }
      if (!this.regPhone.test(this.form.userPhone)) {
        return this.$toast('法人手机号不正确')
      }
      if (
        this.form.imgList.filter(item => item.name === 'idCardFront').length ===
        0
      ) {
        return this.$toast('请上传身份证正面')
      }
      if (
        this.form.imgList.filter(item => item.name === 'idCardBack').length ===
        0
      ) {
        return this.$toast('请上传身份证反面')
      }
      if (
        this.form.imgList.filter(item => item.name === 'personWithIdCard')
          .length === 0
      ) {
        return this.$toast('请上传手持身份证')
      }
      this.$emit('userCardFormData', this.form)
      this.$lance.setData('userName', this.form.userName)
    }
  }
}
</script>
<style lang="scss" scoped>
// @import url(); 引入公共css类
</style>
