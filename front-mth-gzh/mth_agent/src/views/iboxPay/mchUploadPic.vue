<!-- 影音件上传 -->
<template>
  <div class="assist backgroundWhite">
    <van-form validate-first>
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
      <van-cell title="营业执照">
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
          />
          <p class="fs-13 color-c1">（只能上传jpg/png文件，且不超过10M）</p>
        </template>
      </van-cell>
      <van-cell title="手持身份证照片">
        <template #icon>
          <span class="color-danger">*</span>
        </template>
        <template #label>
          <van-uploader
            v-model="uploader4"
            :max-count="1"
            :max-size="1024 * 1024 * 10"
            @oversize="onOversize4"
            :after-read="afterReadUploader4"
            @delete="deleteUploader4"
          />
          <p class="fs-13 color-c1">（只能上传jpg/png文件，且不超过10M）</p>
        </template>
      </van-cell>
    </van-form>
    <van-button class="but mt-4" round block type="info" @click="submitForm"
      >提交</van-button
    >
  </div>
</template>

<script>
export default {
  name: 'mchUploadPic',
  data () {
    return {
      uploader1: [],
      uploader2: [],
      uploader3: [],
      uploader4: [],
      copyType: '',
      form: {
        mediaInfo: []
      }
    }
  },
  methods: {
    // 身份证正面照
    onOversize1 (file) {
      this.$toast('身份证正面照大小不能超过 10MB')
    },
    // 身份证反面照片
    onOversize2 (file) {
      this.$toast('身份证反面照片大小不能超过 10MB')
    },
    // 营业执照
    onOversize3 (file) {
      this.$toast('营业执照大小不能超过 10MB')
    },
    // 手持身份证照
    onOversize4 (file) {
      this.$toast('手持身份证照大小不能超过 10MB')
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
    // 营业执照
    afterReadUploader3 (File) {
      if (Array.isArray(File)) {
        return this.$toast('只能上传一张图片')
      }
      this.afterReadUploader(File, 7, 'license')
    },
    // 手持身份证照
    afterReadUploader4 (File) {
      if (Array.isArray(File)) {
        return this.$toast('只能上传一张图片')
      }
      this.afterReadUploader(File, 3, 'personWithIdCard')
    },
    deleteUploader1 (file, detail) {
      this.form.mediaInfo = _.assign(
        [],
        this.form.mediaInfo.filter(item => item.name !== 'idCardFront')
      )
    },
    deleteUploader2 (file, detail) {
      this.form.mediaInfo = _.assign(
        [],
        this.form.mediaInfo.filter(item => item.name !== 'idCardBack')
      )
    },
    deleteUploader3 (file, detail) {
      this.form.mediaInfo = _.assign(
        [],
        this.form.mediaInfo.filter(item => item.name !== 'license')
      )
    },
    deleteUploader4 (file, detail) {
      this.form.mediaInfo = _.assign(
        [],
        this.form.mediaInfo.filter(item => item.name !== 'personWithIdCard')
      )
    },
    submitForm () {
      if (
        this.form.mediaInfo.filter(item => item.name === 'idCardFront')
          .length === 0
      ) {
        return this.$toast('请上传身份证正面照')
      }
      if (
        this.form.mediaInfo.filter(item => item.name === 'agentProtocol')
          .length === 0
      ) {
        return this.$toast('请上传身份证反面照')
      }
      if (
        this.form.mediaInfo.filter(item => item.name === 'agentIdCardFront')
          .length === 0
      ) {
        return this.$toast('请上传营业执照')
      }
      if (
        this.form.mediaInfo.filter(item => item.name === 'agentIdCardBack')
          .length === 0
      ) {
        return this.$toast('请上传手持身份证')
      }
      this.form.userId = this.$lance.getData('userId')
      console.log(this.form)
      this.$http.post(
        this.$apiUri.APP_IBOXPAY_MCHUPLOADPIC,
        this.form,
        res => {
          this.$toast({
            message: '影音资料提交成功，请耐心等待审核~',
            duration: 5000
          })
          this.disabled = true
        },
        err => {
          this.$toast(err.message)
        }
      )
    }
  }
}
</script>
<style lang="scss" scoped>
// @import url(); 引入公共css类
</style>
