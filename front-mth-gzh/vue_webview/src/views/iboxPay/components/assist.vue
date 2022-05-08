<!-- 辅助证明材料表单（被委托人信息、委托协议书等） -->
<template>
  <div class="assist backgroundWhite">
    <van-form validate-first>
      <van-cell title="委托结算授权书">
        <template #icon>
          <span class="color-danger">*</span>
        </template>
        <template #label>
          <p class="fs-14 mb-2 color-primary" v-if="isH5">
            <a href="/authorization.docx" download="对私非法人结算授权书.docx"
              >下载委托结算授权书填写范例</a
            >
          </p>
          <p class="fs-14 mb-2 color-primary" v-else>
            <a
              :href="require('@/assets/images/iboxPay/front@2x.png')"
              target="_blank"
              >查看委托结算授权书填写范例</a
            >
          </p>
          <van-uploader
            v-model="uploader1"
            :max-count="1"
            :max-size="1024 * 1024 * 10"
            @oversize="onOversize1"
            :after-read="afterReadUploader1"
            @delete="deleteUploader1"
            :deletable="!readonly"
          />
          <p class="fs-13 color-c1">（只能上传jpg/png文件，且不超过10M）</p>
        </template>
      </van-cell>
      <van-cell title="法人手持委托结算授权书合影">
        <template #icon>
          <span class="color-danger">*</span>
        </template>
        <template #label>
          <van-uploader
            v-model="uploader2"
            :max-count="1"
            :max-size="1024 * 1024 * 10"
            @oversize="onOversize2"
            :after-read="afterReadUploader2"
            @delete="deleteUploader2"
            :deletable="!readonly"
          />
          <p class="fs-13 color-c1">（只能上传jpg/png文件，且不超过10M）</p>
        </template>
      </van-cell>
      <van-cell title="被委托人身份证照片">
        <template #icon>
          <span class="color-danger">*</span>
        </template>
        <template #label>
          <div class="d-flex">
            <van-uploader
              v-model="uploader3"
              :max-count="1"
              :max-size="1024 * 1024 * 10"
              @oversize="onOversize3"
              :after-read="afterReadUploader3"
              @delete="deleteUploader3"
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
              v-model="uploader4"
              :max-count="1"
              :max-size="1024 * 1024 * 10"
              @oversize="onOversize4"
              :after-read="afterReadUploader4"
              @delete="deleteUploader4"
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
      <van-cell title="被委托人手持身份证照片">
        <template #icon>
          <span class="color-danger">*</span>
        </template>
        <template #label>
          <van-uploader
            v-model="uploader5"
            :max-count="1"
            :max-size="1024 * 1024 * 10"
            @oversize="onOversize5"
            :after-read="afterReadUploader5"
            @delete="deleteUploader5"
            :deletable="!readonly"
          />
          <p class="fs-13 color-c1">（只能上传jpg/png文件，且不超过10M）</p>
        </template>
      </van-cell>
    </van-form>
    <van-button class="but mt-4" round block type="info" @click="submitForm"
      >下一步</van-button
    >
    <van-button
      class="but bg-primary ball my-4"
      round
      block
      type="info"
      @click="lastStep"
      >上一步</van-button
    >
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'assist',
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
      uploader4: [],
      uploader5: []
      // form: {
      //   imgList: []
      // }
    }
  },
  computed: {
    ...mapState(['isH5'])
  },
  watch: {
    form (newName, oldName) {
      if (
        newName.imgList.filter(item => item.name === 'priLicAgreement').length >
        0
      ) {
        this.uploader1 = [
          {
            url: newName.imgList.filter(
              item => item.name === 'priLicAgreement'
            )[0].url
          }
        ]
      }
      if (
        newName.imgList.filter(item => item.name === 'agentProtocol').length > 0
      ) {
        this.uploader2 = [
          {
            url: newName.imgList.filter(
              item => item.name === 'agentProtocol'
            )[0].url
          }
        ]
      }
      if (
        newName.imgList.filter(item => item.name === 'agentIdCardFront')
          .length > 0
      ) {
        this.uploader3 = [
          {
            url: newName.imgList.filter(
              item => item.name === 'agentIdCardFront'
            )[0].url
          }
        ]
      }
      if (
        newName.imgList.filter(item => item.name === 'agentIdCardBack').length >
        0
      ) {
        this.uploader4 = [
          {
            url: newName.imgList.filter(
              item => item.name === 'agentIdCardBack'
            )[0].url
          }
        ]
      }
      if (
        newName.imgList.filter(item => item.name === 'agentCardIdPicture')
          .length > 0
      ) {
        this.uploader4 = [
          {
            url: newName.imgList.filter(
              item => item.name === 'agentCardIdPicture'
            )[0].url
          }
        ]
      }
    }
  },
  methods: {
    // 委托结算授权书
    onOversize1 (file) {
      this.$toast('委托结算授权书图片大小不能超过 10MB')
    },
    // 法人手持委托结算授权书合影
    onOversize2 (file) {
      this.$toast('法人手持委托结算授权书合影图片大小不能超过 10MB')
    },
    // 被委托人身份证正面照
    onOversize3 (file) {
      this.$toast('被委托人身份证正面照大小不能超过 10MB')
    },
    // 被委托人身份证反面照
    onOversize4 (file) {
      this.$toast('被委托人身份证反面照片大小不能超过 10MB')
    },
    // 被委托人手持身份证照片
    onOversize5 (file) {
      this.$toast('被委托人手持身份证照片大小不能超过 10MB')
    },
    // 委托结算授权书
    afterReadUploader1 (File) {
      if (Array.isArray(File)) {
        return this.$toast('只能上传一张图片')
      }
      this.afterReadUploader(File, 13, 'priLicAgreement')
    },
    // 法人手持委托结算授权书合影
    afterReadUploader2 (File) {
      if (Array.isArray(File)) {
        return this.$toast('只能上传一张图片')
      }
      this.afterReadUploader(File, 13, 'agentProtocol')
    },
    // 被委托人身份证正面照
    afterReadUploader3 (File) {
      if (Array.isArray(File)) {
        return this.$toast('只能上传一张图片')
      }
      this.afterReadUploader(File, 1, 'agentIdCardFront')
    },
    // 被委托人身份证反面照
    afterReadUploader4 (File) {
      if (Array.isArray(File)) {
        return this.$toast('只能上传一张图片')
      }
      this.afterReadUploader(File, 2, 'agentIdCardBack')
    },
    // 被委托人手持身份证照片
    afterReadUploader5 (File) {
      if (Array.isArray(File)) {
        return this.$toast('只能上传一张图片')
      }
      this.afterReadUploader(File, 3, 'agentCardIdPicture')
    },
    deleteUploader1 (file, detail) {
      this.form.imgList = _.assign(
        [],
        this.form.imgList.filter(item => item.name !== 'priLicAgreement')
      )
    },
    deleteUploader2 (file, detail) {
      this.form.imgList = _.assign(
        [],
        this.form.imgList.filter(item => item.name !== 'agentProtocol')
      )
    },
    deleteUploader3 (file, detail) {
      this.form.imgList = _.assign(
        [],
        this.form.imgList.filter(item => item.name !== 'agentIdCardFront')
      )
    },
    deleteUploader4 (file, detail) {
      this.form.imgList = _.assign(
        [],
        this.form.imgList.filter(item => item.name !== 'agentIdCardBack')
      )
    },
    deleteUploader5 (file, detail) {
      this.form.imgList = _.assign(
        [],
        this.form.imgList.filter(item => item.name !== 'agentCardIdPicture')
      )
    },
    submitForm () {
      if (
        this.form.imgList.filter(item => item.name === 'priLicAgreement')
          .length === 0
      ) {
        return this.$toast('请上传委托结算授权书')
      }
      if (
        this.form.imgList.filter(item => item.name === 'agentProtocol')
          .length === 0
      ) {
        return this.$toast('请上传法人手持委托结算授权书合影')
      }
      if (
        this.form.imgList.filter(item => item.name === 'agentIdCardFront')
          .length === 0
      ) {
        return this.$toast('请上传被委托人身份证正面照')
      }
      if (
        this.form.imgList.filter(item => item.name === 'agentIdCardBack')
          .length === 0
      ) {
        return this.$toast('请上传被委托人身份证反面照')
      }
      if (
        this.form.imgList.filter(item => item.name === 'agentCardIdPicture')
          .length === 0
      ) {
        return this.$toast('请上传被委托人手持身份证照片')
      }
      this.$emit('assistFormData', this.form)
    },
    lastStep () {
      this.$emit('assistLastStep')
    }
  }
}
</script>
<style lang="scss" scoped>
// @import url(); 引入公共css类
</style>
