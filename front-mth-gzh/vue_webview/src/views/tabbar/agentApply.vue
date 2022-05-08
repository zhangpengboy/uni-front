<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-21 17:41:59
 * @Description  : 代理商申请
-->
<template>
  <div class="agentApply">
    <van-nav-bar
      v-if="isApp"
      :title="$route.meta.title"
      left-arrow
      fixed
      placeholder
      @click-left="$baseUtils.goBack(-1)"
    />
    <van-nav-bar
      v-if="isH5"
      :title="$route.meta.title"
      left-arrow
      fixed
      placeholder
      @click-left="$baseUtils.goBack(-1)"
    />
    <van-form validate-first>
      <van-field
        label-class="color-333"
        readonly
        v-model="form.areaLevelName"
        right-icon="arrow"
        input-align="right"
        placeholder="请选择代理商类型"
        @click="onAreaLevel"

      >
        <template #label>
          <span class="color-danger">*</span>
          <span>代理商类型</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        readonly
        clickable
        v-model="form.areaName"
        right-icon="arrow"
        input-align="right"
        placeholder="请选择区域"
        @click="onArea"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>区域名称</span>
        </template>
      </van-field>
      <!-- <van-field
        label-class="color-333"
        v-model="form.detailed"
        clickable
        input-align="right"
        placeholder="请输入代理商详细地址"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>详细地址</span>
        </template>
      </van-field> -->
      <van-field
        label-class="color-333"
        v-model="form.accountName"
        clearable
        input-align="right"
        placeholder="请输入联系人"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>联系人</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        v-model="form.phone"
        type="tel"
        clearable
        input-align="right"
        placeholder="请输入联系人电话"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>联系电话</span>
        </template>
      </van-field>

      <van-cell title="身份证正面">
        <template #icon>
          <span class="color-danger">*</span>
        </template>
        <template #label>
          <div class="d-flex" v-if="isAndroid">
            <div v-if="form.idcard1" class="appImg mr-1">
              <img
                :src="form.idcard1"
                class="camera-bgImg"
                alt=""
                @click="ImagePreview1"
              />
              <div class="icon" @click="deleteUploader1">
                <van-icon name="cross" color="#fff" size="10px" />
              </div>
            </div>
            <img
              v-else
              class="camera-bgImg"
              :src="require('@/assets/images/camera@2x.png')"
              alt=""
              @click="androidUpload('idcard1')"
            />
          </div>
          <van-uploader
            v-else
            v-model="uploader1"
            :max-count="1"
            :max-size="1024 * 1024 * 10"
            @oversize="onOversize1"
            :after-read="afterReadUploader1"
            @delete="deleteUploader1"
            :disabled="disabled"
            :deletable="deletable"
          />
          <p class="fs-13 color-c1">（只能上传jpg/png文件，且不超过10M）</p>
        </template>
      </van-cell>
      <van-cell title="身份证反面">
        <template #icon>
          <span class="color-danger">*</span>
        </template>
        <template #label>
          <div class="d-flex" v-if="isAndroid">
            <div v-if="form.idcard2" class="appImg mr-1">
              <img
                :src="form.idcard2"
                class="camera-bgImg"
                alt=""
                @click="ImagePreview2"
              />
              <div class="icon" @click="deleteUploader2">
                <van-icon name="cross" color="#fff" size="10px" />
              </div>
            </div>
            <img
              v-else
              class="camera-bgImg"
              :src="require('@/assets/images/camera@2x.png')"
              alt=""
              @click="androidUpload('idcard2')"
            />
          </div>
          <van-uploader
            v-else
            v-model="uploader2"
            :max-count="1"
            :max-size="1024 * 1024 * 10"
            @oversize="onOversize2"
            :after-read="afterReadUploader2"
            @delete="deleteUploader2"
            :disabled="disabled"
            :deletable="deletable"
          />
          <p class="fs-13 color-c1">（只能上传jpg/png文件，且不超过10M）</p>
        </template>
      </van-cell>
      <van-cell title="合同">
        <template #icon>
          <span class="color-danger">*</span>
        </template>
        <template #label>
          <div class="d-flex" v-if="isAndroid">
            <div v-if="imgUrlList.length > 0 && imgUrlList.length < 6" class="d-flex">
              <div
                v-for="(item,index) in imgUrlList"
                :key="index"
                class="appImg mr-1"
                >
                <img
                  :src="item"
                  class="camera-bgImg"
                  alt=""
                  @click="ImagePreview3"
                />
                <div class="icon" @click="deleteAndroidUploader3(index)">
                  <van-icon name="cross" color="#fff" size="10px" />
                </div>
              </div>
            </div>
            <img
               v-if="imgUrlList.length >= 0 && imgUrlList.length < 5"
              class="camera-bgImg"
              :src="require('@/assets/images/camera@2x.png')"
              alt=""
              @click="androidUpload('contanct')"
            />
          </div>
          <van-uploader
            v-else
            v-model="uploader3"
            multiple
            :max-count="5"
            :max-size="1024 * 1024 * 10"
            @oversize="onOversize3"
            :after-read="afterReadUploader3"
            @delete="deleteUploader3"
            :disabled="disabled"
            :deletable="deletable"
          />
          <p class="fs-13 color-c1">（只能上传jpg/png文件，且不超过10M，且最多5张）</p>
        </template>
      </van-cell>
      <br />
    </van-form>
    <van-button class="but mb-8" round block type="info" @click="submitForm" :disabled="disabled"
      >提交资料</van-button
    >
    <!-- 代理商类型 -->
    <van-popup
      v-model="showType"
      position="bottom"
      round
      :close-on-popstate="false"
      :safe-area-inset-bottom="true"
    >
      <van-picker
        title=""
        show-toolbar
        :columns="columns"
        @confirm="onConfirmType"
        @cancel="showType = false"
      />
    </van-popup>
    <!-- 地址 -->
    <van-popup v-model="showArea" position="bottom">
      <!-- <van-area
        :area-list="areaList"
        @confirm="onConfirmAddress"
        @cancel="showArea = false"
      />
      <van-picker
        show-toolbar
        title=""
        :columns="areaList"
        @confirm="onConfirmAddress"
        @cancel="showArea = false"
      /> -->
      <van-cascader
        v-model="cascaderValue"
        title="请选择所在地区"
        :options="options"
        @close="showArea = false"
        @finish="onFinish"
        :field-names="fieldNames"
    />
    </van-popup>
  </div>
</template>
<script>
// import area from '@/utils/area.js'
import city from '@/utils/city.json'
import { mapState } from 'vuex'
import { ImagePreview } from 'vant'
export default {
  data () {
    return {
      form: {},
      uploader1: [],
      uploader2: [],
      uploader3: [],
      showArea: false,
      showType: false,
      options: null,
      imgUrlList: [],
      regPhone:
        /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
      columns: ['省代', '市代', '区县代'],
      fieldNames: {
        text: 'value',
        value: 'id',
        children: 'children'
      },
      cascaderValue: '',
      disabled: false,
      ShowBarFlag: false,
      deletable: true, // 是否展示删除按钮
      isAndroid: !!window.jsObj
    }
  },
  computed: {
    ...mapState(['isApp', 'isH5'])
  },
  mounted () {
    window.androidResponse = this.androidResponse
  },
  methods: {
    // * android upload
    androidUpload (type) {
      let obj = {
        type: type
      }
      this.$baseUtils.toAppBaseFun('uploadImg', obj)
    },
    // * Android 回调函数
    androidResponse (obj) {
      if (obj.type === 'idcard1') {
        this.$set(this.form, 'idcard1', obj.imgPath)
        this.uploader1 = [{ url: obj.imgPath }]
      } else if (obj.type === 'idcard2') {
        this.$set(this.form, 'idcard2', obj.imgPath)
        this.uploader2 = [{ url: obj.imgPath }]
      } else if (obj.type === 'contanct') {
        // this.$set(this.form, 'contanct', obj.imgPath)
        // this.uploader3 = [{ url: obj.imgPath }]
        this.imgUrlList.push(obj.imgPath)
      }
    },
    // app端身份证正面图片预览
    ImagePreview1 () {
      ImagePreview([this.form.idcard1])
    },
    ImagePreview2 () {
      ImagePreview([this.form.idcard2])
    },
    ImagePreview3 () {
      ImagePreview(this.imgUrlList)
    },
    // ImagePreview4 () {
    //   ImagePreview([this.storeReq.storesImg])
    // },
    // 点击代理商
    onAreaLevel () {
      this.showType = true
      this.form.areaLevelName = null
      this.form.areaLevel = null
      this.form.areaName = null
    },
    // 确认代理商类型
    onConfirmType (value, index) {
      this.form.areaLevelName = value
      this.form.areaLevel = index + 1
      this.showType = false
    },
    // 点击地区
    onArea () {
      if (!this.form.areaLevelName) return this.$toast('请先选择代理商类型')
      this.showArea = true
      // console.log(this.form.areaLevel)
      this.options = city
      if (this.form.areaLevel === 1) {
        this.options = city
      }
    },
    // 选择地区
    onFinish ({ selectedOptions }) {
      this.showArea = false
      this.form.areaId = selectedOptions[this.form.areaLevel - 1].id
      this.form.areaName = selectedOptions[this.form.areaLevel - 1].value
    },
    afterReadUploader1 (File) {
      if (Array.isArray(File)) {
        return this.$toast('只能上传一张图片')
      }
      this.afterReadUploader(File, 1)
    },
    afterReadUploader2 (File) {
      if (Array.isArray(File)) {
        return this.$toast('只能上传一张图片')
      }
      this.afterReadUploader(File, 2)
    },
    afterReadUploader3 (File, detail) {
      // console.log(detail)
      this.afterReadUploader(File, 3)
    },
    deleteUploader1 () {
      this.form.idcard1 = null
    },
    deleteUploader2 () {
      this.form.idcard2 = null
    },
    // 安卓的图片删除
    deleteAndroidUploader3 (index) {
      this.imgUrlList.splice(index, 1)
    },
    deleteUploader3 (file, detail) {
      this.imgUrlList.splice(detail.index, 1)
    },
    afterReadUploader (File, i) {
      //   console.log(File)
      this.$toast.loading({
        message: '图上传中...',
        forbidClick: true,
        duration: 0
        // mask: true
      })
      if (Array.isArray(File)) {
        for (let index = 0; index < File.length; index++) {
          this.get(File[index], i)
        }
      } else {
        this.get(File, i)
      }
    },
    get (File, i) {
      var formData = new FormData()
      formData.append('file', File.file)
      this.$http.post(
        this.$apiUri.APP_UPLOAD_IMG,
        formData,
        (res) => {
          if (res.success) {
            this.$toast.clear()
            this.$toast('图片上传成功')
            if (i === 1) this.form.idcard1 = res.data
            if (i === 2) this.form.idcard2 = res.data
            if (i === 3) {
              this.imgUrlList.push(res.data)
            }
          } else {
            this.$toast.clear()
            this.$toast('图片上传失败，请重新上传')
          }
        },
        (err) => {
          this.$toast.clear()
          this.$toast(err.message)
        }
      )
    },
    // 身份证正面
    onOversize1 (file) {
      this.$toast('身份证正面图片大小不能超过 10MB')
    },
    // 身份证正面
    onOversize2 (file) {
      this.$toast('身份证反面图片大小不能超过 10MB')
    },
    // 合同
    onOversize3 (file) {
      this.$toast('合同图片大小不能超过 10MB')
    },
    submitForm () {
      // alert('22222222222', this.$lance.getData('userId'))
      // this.$toast('userId:', this.$lance.getData('userId'))
      // if (!this.isAndroid) {
      //   this.form.contanct = this.imgUrlList.join(';')
      // }
      this.form.contanct = this.imgUrlList.join(';')
      if (!this.form.areaLevel) return this.$toast('代理商类型不能为空')
      if (!this.form.areaName) return this.$toast('区域名称不能为空')
      //   if (!this.form.detailed) return this.$toast('代理商详细地址不能为空')
      if (!this.form.accountName) return this.$toast('联系人不能为空')
      if (!this.form.phone) {
        return this.$toast('联系电话不能为空')
      }
      if (!this.regPhone.test(this.form.phone)) {
        return this.$toast('联系电话不正确')
      }
      if (!this.form.idcard1) return this.$toast('请上传身份证正面')
      if (!this.form.idcard2) return this.$toast('请上传身份证反面')
      if (!this.form.contanct) return this.$toast('请上传合同')
      this.form.userId = this.$lance.getData('userId')
      this.$http.post(
        this.$apiUri.APP_DLAPPLYFORDL,
        this.form,
        () => {
          this.$toast({ message: '代理商资料提交成功，请耐心等待审核~', duration: 3000 })
          this.disabled = true
          this.deletable = false
          // this.form = {}
          // this.$router.push('/')
        },
        (err) => {
          this.$toast(err.message)
        }
      )
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'region') {
      return next(vm => {
        vm.ShowBarFlag = true
      })
    }
    next()
  }
}
</script>
<style lang="scss" scoped>
.agentApply {
  background: #fff;
}
.camera-bgImg {
  width: 60px;
  height: 60px;
}

.appImg {
  position: relative;
  .icon {
    position: absolute;
    top: 0;
    right: 0;
    width: 16px;
    height: 16px;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 0 0 0 0.32rem;
    line-height: 16px;
    text-align: center;
  }
}
</style>
