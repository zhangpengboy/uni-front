<!-- 营业执照相关表单项 -->
<template>
  <div class="business backgroundWhite">
    <van-form validate-first>
      <van-field
        label-class="color-333"
        v-model="form.licNo"
        clickable
        :readonly="readonly"
        input-align="right"
        placeholder="请输入营业执照号"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>营业执照号</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        clickable
        :readonly="readonly"
        v-model="form.businessTerm"
        input-align="right"
        placeholder="格式：20200101-20300101"
      >
        <template #label>
          <!-- <span class="color-danger">*</span> -->
          <span>营业执照有效期</span>
        </template>
      </van-field>
      <van-cell title="营业执照">
        <template #icon>
          <span class="color-danger">*</span>
        </template>
        <template #label>
          <van-uploader
            v-model="uploader"
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
export default {
  name: 'business',
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
      uploader: []
      // form: {
      //   imgList: []
      // }
    }
  },
  watch: {
    form (newName, oldName) {
      if (newName.imgList.filter(item => item.name === 'license').length > 0) {
        this.uploader = [
          {
            url: newName.imgList.filter(item => item.name === 'license')[0].url
          }
        ]
      }
    }
  },
  methods: {
    // 营业执照
    onOversize1 (file) {
      this.$toast('营业执照图片大小不能超过 10MB')
    },
    // 营业执照
    afterReadUploader1 (File) {
      if (Array.isArray(File)) {
        return this.$toast('只能上传一张图片')
      }
      this.afterReadUploader(File, 7, 'license')
    },
    deleteUploader1 (file, detail) {
      this.form.imgList = _.assign(
        [],
        this.form.imgList.filter(item => item.name !== 'license')
      )
    },
    submitForm () {
      if (!this.form.licNo) return this.$toast('营业执照号不能为空')
      if (
        this.form.imgList.filter(item => item.name === 'license').length === 0
      ) {
        return this.$toast('请上传营业执照')
      }
      this.$emit('businessFormData', this.form)
      // this.$lance.setJson('businessFormData', this.form)
    },
    lastStep () {
      this.$emit('businessLastStep')
    }
  }
}
</script>
<style lang="scss" scoped>
// @import url(); 引入公共css类
</style>
