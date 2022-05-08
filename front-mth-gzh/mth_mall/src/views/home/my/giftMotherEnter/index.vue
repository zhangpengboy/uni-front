<!--
 * @Description : 礼券妈妈入驻
-->
<template>
  <div class="giftMotherEnter">
    <!-- <div class="card">
        <van-field
          v-model="giftMother.storeName"
          clearable
          label="店铺简称"
          label-width="1.892rem"
          :left-icon="
            require('@/assets/images/my/giftMotherBackstage/icon_abbreviation@2x.png')
          "
          placeholder="输入店铺简称，用户平台店铺展示"
          input-align="right"
        />
        <van-field
          v-model="giftMother.storeCategoryName"
          label="主营类目"
          label-width="1.892rem"
          :left-icon="
            require('@/assets/images/my/giftMotherBackstage/icon_category@2x.png')
          "
          right-icon="arrow"
          readonly
          clickable
          @click="showStoreType = true"
          placeholder="请选择"
          input-align="right"
        />
        <van-field
          v-model="giftMother.phone"
          label-width="1.892rem"
          input-align="right"
          type="tel"
          clearable
          label="联系电话"
          placeholder="请输入入驻人手机号"
          :left-icon="
            require('@/assets/images/my/giftMotherBackstage/icon_phone@2x.png')
          "
        >
        </van-field>
        <van-field
          label-width="1.892rem"
          input-align="right"
          readonly
          clickable
          v-model="region"
          label="店铺地址"
          placeholder="请选择店铺地址"
          @click="showArea = true"
          :left-icon="
            require('@/assets/images/my/giftMotherBackstage/902@2x.png')
          "
          right-icon="arrow"
        />
        <van-field
          v-model="giftMother.storeAddress"
          label=""
          placeholder="请输入详细地址（精确到门牌号）"
          input-align="left"
          rows="1"
          autosize
          clearable
          type="textarea"
        />
      </div> -->
    <van-form validate-first>
      <van-field
        v-model="giftMother.storeName"
        input-align="right"
        clearable
        placeholder="输入用户昵称，用户平台店铺展示"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span class="color-muted3">用户昵称</span>
        </template>
      </van-field>
      <van-field
        v-model="giftMother.phone"
        input-align="right"
        clearable
        placeholder="输入联系电话"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span class="color-muted3">联系电话</span>
        </template>
      </van-field>
      <van-field
        readonly
        clickable
        v-model="giftMother.storeCategoryName"
        right-icon="arrow"
        input-align="right"
        placeholder="请选择"
        @click="showStoreType = true"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span class="color-muted3">主营类目</span>
        </template>
      </van-field>
      <van-field input-align="right">
        <template #input>
          <van-radio-group v-model="giftMother.storeSex" direction="horizontal">
            <van-radio name="惠哥" checked-color="#EB6133">惠哥</van-radio>
            <van-radio name="惠姐" checked-color="#EB6133">惠姐</van-radio>
          </van-radio-group>
        </template>
        <template #label>
          <span class="color-danger">*</span>
          <span class="color-muted3">角色选择</span>
        </template>
      </van-field>
      <van-field
        input-align="right"
        readonly
        clickable
        v-model="region"
        right-icon="arrow"
        placeholder="请选择店铺地址"
        @click="showArea = true"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span class="color-muted3">店铺地址</span>
        </template>
      </van-field>
      <van-field
        v-model="giftMother.storeAddress"
        clearable
        input-align="right"
        placeholder="请输入店铺详情地址（精确到门牌号）"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span class="color-muted3">详情地址</span>
        </template>
      </van-field>
      <van-cell title="身份证">
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
              :disabled="disabled"
            >
              <template #default>
                <img
                  class="uploader-bgImg mr-1"
                  :src="
                    require('@/assets/images/my/giftMotherBackstage/front@2x.png')
                  "
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
              :disabled="disabled"
            >
              <template #default>
                <img
                  class="uploader-bgImg"
                  :src="
                    require('@/assets/images/my/giftMotherBackstage/contrary@2x.png')
                  "
                  alt=""
                />
              </template>
            </van-uploader>
          </div>
          <p class="fs-13 color-c1">（只能上传jpg/png文件，且不超过10M）</p>
        </template>
      </van-cell>
      <br />
    </van-form>
    <van-checkbox
      v-model="checked"
      label-disabled
      checked-color="#EB6133"
      class="checked fs-13"
    >
      <span>我已阅读并同意</span>
      <span class="color-main" @click="$router.push('protocol')"
        >《个人云创业入驻协议》</span
      >
    </van-checkbox>
    <van-button
      color="linear-gradient(180deg, #F1722C 0%, #EB6133 100%)"
      block
      size="small"
      round
      @click="save"
      class="but"
      >下一步</van-button
    >
    <!-- 类目 -->
    <van-popup
      v-model="showStoreType"
      position="bottom"
      closeable
      round
      :close-on-popstate="false"
      :safe-area-inset-bottom="true"
    >
      <div class="pt-3 pl-3 pb-3">
        <p class="fs-16 color-muted3 text-center mt-3 mb-5">主营类目</p>
        <p class="fs-14 color-muted3 fw-700 text-left mb-3">一级类目</p>
        <div class="butgroup">
          <div
            v-for="(item, i) in typeList"
            :key="i"
            class="type"
            :class="[index === i ? 'activeClass' : '']"
            @click="clickTo(item, i)"
          >
            <span>{{ item.title }}</span>
          </div>
        </div>
        <div class="ok" @click="ok">确认</div>
      </div>
    </van-popup>
    <!-- 地址 -->
    <van-popup v-model="showArea" position="bottom">
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
export default {
  computed: {
    ...mapState(['userInfo'])
  },
  data () {
    return {
      index: -1,
      region: '', // 处理后的地区数据
      regionList: [], // 选择地区后未处理的数据
      checked: false,
      showStoreType: false,
      showArea: false,
      // areaList: area,
      typeList: [], // 主营类目
      cilckName: '',
      uploader1: [],
      uploader2: [],
      disabled: false,
      cascaderValue: '',
      options: null,
      fieldNames: {
        text: 'value',
        value: 'id',
        children: 'children'
      },
      // imgUrlList: [], // 身份证图片URL
      giftMother: {
        phone: '',
        storeName: '',
        storeAddress: '',
        storeCategoryId: '',
        storeCategoryName: '',
        storeSex: '',
        idcard1: null,
        idcard2: null
      },
      regStr: /^[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\\A9|\\AE]\u3030|\uA9|\uAE|\u3030$/
    }
  },
  created () {
    this.options = city
    this.giftMother.phone = this.userInfo.phone
    this.getStoreCateList()
  },
  methods: {
    // 选择地区
    onConfirm (values) {
      // console.log(values);
      this.regionList = values
      this.region = values
        .filter(item => !!item)
        .map(item => item.name)
        .join('-')
      this.showArea = false
    },
    // 选择地区
    onFinish ({ selectedOptions }) {
      this.showArea = false
      this.regionList = selectedOptions
      this.region = selectedOptions.map(item => item.value).join('-')
    },
    // 身份证
    onOversize1 (file) {
      this.$toast('身份证正面图片大小不能超过 10MB')
    },
    deleteUploader1 () {
      this.giftMother.idcard1 = null
    },
    afterReadUploader1 (File) {
      if (Array.isArray(File)) {
        return this.$toast('只能上传一张图片')
      }
      this.afterReadUploader(File, 1)
    },
    onOversize2 (file) {
      this.$toast('身份证反面图片大小不能超过 10MB')
    },
    deleteUploader2 () {
      this.giftMother.idcard2 = null
    },
    afterReadUploader2 (File) {
      if (Array.isArray(File)) {
        return this.$toast('只能上传一张图片')
      }
      this.afterReadUploader(File, 2)
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
        res => {
          if (res.success) {
            this.$toast.clear()
            this.$toast('图片上传成功')
            // console.log(this.uploader3)
            if (i === 1) this.giftMother.idcard1 = res.data
            if (i === 2) this.giftMother.idcard2 = res.data
            // if (i === 3) this.imgUrlList.push(res.data)
          } else {
            this.$toast.clear()
            this.$toast('图片上传失败，请重新上传')
          }
        },
        err => {
          this.$toast.clear()
          this.$toast(err.message)
        }
      )
    },
    // 获取主营类目
    getStoreCateList () {
      this.$http.post(
        this.$apiUri.APP_STORECATELIST,
        { roleCode: 1 },
        res => {
          // this.typeList = res.data.forEach((element,index) => {
          //   element.code = index
          // });
          this.typeList = res.data
          // console.log(this.typeList);
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    ok () {
      if (!this.cilckName) return this.$toast('请选择主营类目')
      this.giftMother.storeCategoryName = this.cilckName
      this.showStoreType = false
    },
    clickTo (item, i) {
      this.index = i
      this.cilckName = item.title
      this.giftMother.storeCategoryId = item.id
    },
    // 下一步
    save () {
      console.log(this.giftMother)
      if (!this.giftMother.storeName) return this.$toast('店铺简称不能为空')
      if (!this.giftMother.phone) {
        return this.$toast('联系电话不能为空')
      }
      if (
        !/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/.test(
          this.giftMother.phone
        )
      ) {
        return this.$toast('联系电话不正确')
      }
      if (!this.giftMother.storeCategoryName) {
        return this.$toast('主营类目不能为空')
      }
      if (!this.giftMother.storeSex) return this.$toast('请选择店铺角色')
      if (!this.region) return this.$toast('店铺地址不能为空')
      if (!this.giftMother.storeAddress) return this.$toast('详细地址不能为空')
      if (this.regStr.test(this.giftMother.storeAddress)) {
        return this.$toast('详细地址不能输入表情字符')
      }
      if (!this.giftMother.idcard1) return this.$toast('请上传身份证正面')
      if (!this.giftMother.idcard2) return this.$toast('请上传身份证反面')
      if (!this.checked) return this.$toast('请阅读并勾选云创业入驻协议')

      this.giftMother.area1Id = this.regionList[0].id
      this.giftMother.area1Name = this.regionList[0].value
      this.giftMother.area2Id = this.regionList[1].id
      this.giftMother.area2Name = this.regionList[1].value
      this.giftMother.area3Id = this.regionList[2].id
      this.giftMother.area3Name = this.regionList[2].value
      this.$http.post(
        this.$apiUri.APP_GIFTMOTHER_CREATE,
        this.giftMother,
        res => {
          this.$toast('入驻成功，店铺正在审核')
          this.$router.push('my')
        },
        err => {
          this.$toast(err.message)
        }
      )
    }
  }
  // beforeRouteEnter (to, from, next) {
  //   if (!from.name) {
  //     next(vm => {
  //       vm.$router.push("my")
  //     })
  //   }
  //   next()
  // }
}
</script>

<style lang="scss" scoped>
.giftMotherEnter {
  min-height: calc(100vh - 46px);
  background: #ffffff;
  padding-bottom: 35px;
  .card {
    width: 100%;
    height: 100%;
    background: #ffffff;
    opacity: 1;
    border-radius: 8px;
    padding: 4px 0;
  }
  .checked {
    margin: 12px 0 32px 26px;
  }
  .uploader-bgImg {
    width: 166px;
    height: 106px;
  }
  .butgroup {
    display: flex;
    flex-flow: row wrap;
    .type {
      width: 105px;
      height: 32px;
      font-size: 14px;
      border: 1px solid #f2f2f2;
      border-radius: 28px;
      color: #666;
      line-height: 32px;
      text-align: center;
      margin-right: 14px;
      margin-bottom: 20px;
      padding: 0 8px;
      display: inline-block;
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
    }
    .activeClass {
      border: 1px solid #eb6133;
      background: #eb6133;
      color: #fff;
    }
  }
  .ok {
    width: 262px;
    height: 38px;
    font-size: 14px;
    line-height: 38px;
    color: #fff;
    margin: 18px auto 0;
    background: linear-gradient(180deg, #f1722c 0%, #eb6133 100%);
    border-radius: 48px;
    text-align: center;
  }
}
</style>
