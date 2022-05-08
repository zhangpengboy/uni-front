<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-21 17:41:59
 * @Description  : 商户进件-注册
-->
<template>
  <div class="mchRegister">
    <van-nav-bar
      v-if="isApp || isH5"
      :title="$route.meta.title"
      left-arrow
      fixed
      placeholder
      @click-left="$baseUtils.goBack(-1)"
    />
    <van-form validate-first>
      <van-field
        label-class="color-333"
        clickable
        v-model="form.mchtName"
        input-align="right"
        placeholder="请输入商户名称"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>商户名称</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        clickable
        v-model="form.mchtCnShortName"
        input-align="right"
        placeholder="请输入商户简称"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>商户简称</span>
        </template>
      </van-field>
      <!-- <van-field
        label-class="color-333"
        clickable
        v-model="form.mchtNo"
        input-align="right"
        placeholder="请输入商户号"
      >
        <template #label>
          <span>商户号</span>
        </template>
      </van-field> -->
      <van-field
        label-class="color-333"
        readonly
        clickable
        v-model="form.channelKindName"
        right-icon="arrow"
        input-align="right"
        placeholder="请选择商户类型"
        @click="onChannelKind=true"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>商户类型</span>
        </template>
      </van-field>
      <template v-if="form.channelKind !== '000001'">
        <van-field
          label-class="color-333"
          readonly
          clickable
          v-model="form.licenceTypeName"
          right-icon="arrow"
          input-align="right"
          placeholder="请选择营业执照类型"
          @click="onLicenceType=true"
        >
          <template #label>
            <span class="color-danger">*</span>
            <span>营业执照类型</span>
          </template>
        </van-field>
        <van-field
          label-class="color-333"
          v-model="form.licNo"
          clickable
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
          v-model="form.businessTerm"
          input-align="right"
          placeholder="格式：20200101-20300101"
        >
          <template #label>
            <!-- <span class="color-danger">*</span> -->
            <span>营业执照有效期</span>
          </template>
        </van-field>
      </template>
      <van-field
        label-class="color-333"
        clickable
        v-model="form.userCardNo"
        input-align="right"
        placeholder="请输入身份证号"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>{{ userCardType }}身份证号</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        clickable
        v-model="form.userName"
        input-align="right"
        placeholder="请输入姓名"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>{{ userCardType }}姓名</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        clickable
        v-model="form.userPhone"
        input-align="right"
        type="tel"
        placeholder="请输入手机号"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>{{ userCardType }}手机号</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        clickable
        v-model="form.periodValidity"
        input-align="right"
        placeholder="格式：20150101-20200101"
      >
        <template #label>
          <span>身份证有效期</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        readonly
        clickable
        v-model="form.areaNo"
        right-icon="arrow"
        input-align="right"
        placeholder="请选择经营区域"
        @click="onArea"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>经营地区区域码</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        v-model="form.address"
        clickable
        input-align="right"
        placeholder="请输入商户门店地址"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>商户门店地址</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        readonly
        clickable
        v-model="form.businessName"
        right-icon="arrow"
        input-align="right"
        placeholder="请选择经营范围"
        @click="onStoreCate"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>经营范围</span>
        </template>
      </van-field>
      <van-field input-align="right">
        <template #label>
          <span class="color-danger">*</span>
          <span class="color-muted3">账户类型</span>
        </template>
        <template #input>
          <van-radio-group v-model="form.accountType" direction="horizontal" @change="onChangeAccountType">
            <van-radio name="1" checked-color="#EB6133">对私</van-radio>
            <van-radio name="0" checked-color="#EB6133">对公</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <!-- <van-field
        label-class="color-333"
        v-model="form.brh"
        clickable
        input-align="right"
        placeholder="请输入机构号"
      >
        <template #label>
          <span>机构号</span>
        </template>
      </van-field> -->
      <template  v-if="!((form.licenceType === '0' && form.accountType === '0') || form.licenceType === '2')">
        <van-divider content-position="left">结算账户信息</van-divider>
        <van-field
          label-class="color-333"
          v-model="form.accountName"
          clearable
          input-align="right"
          placeholder="请输入开户名(账户名称)"
        >
          <template #label>
            <span class="color-danger">*</span>
            <span>开户名</span>
          </template>
        </van-field>
        <van-field
          label-class="color-333"
          v-model="form.zbankNo"
          clearable
          input-align="right"
          placeholder="请选择开户银行支行"
          readonly
          right-icon="arrow"
          @click="onZbank=true"
        >
          <template #label>
            <span class="color-danger">*</span>
            <span>开户银行支行号</span>
          </template>
        </van-field>
        <van-field
          label-class="color-333"
          v-model="form.zbankRegionCode"
          clearable
          readonly
          input-align="right"
          placeholder="请选择开户银行支行区域码"
        >
          <template #label>
            <span class="color-danger">*</span>
            <span>开户银行支行区域码</span>
          </template>
        </van-field>
        <!-- <van-field
          label-class="color-333"
          v-model="form.taxNo"
          clearable
          input-align="right"
          placeholder="请输入税务登记号"
        >
          <template #label>
            <span>税务登记号</span>
          </template>
        </van-field> -->
        <van-field
          label-class="color-333"
          v-model="form.accountNo"
          clearable
          input-align="right"
          placeholder="请输入银行卡号"
        >
          <template #label>
            <span class="color-danger">*</span>
            <span>银行卡号</span>
          </template>
        </van-field>
        <van-field
          label-class="color-333"
          v-model="form.resserveMobile"
          type="tel"
          clearable
          input-align="right"
          placeholder="请输入银行预留手机号"
        >
          <template #label>
            <span>银行预留手机号</span>
          </template>
        </van-field>
        <van-cell title="银行卡正面照">
        <template #icon>
          <span class="color-danger">*</span>
        </template>
        <template #label>
          <van-uploader
            v-model="uploader6"
            :max-count="1"
            :max-size="1024 * 1024 * 10"
            @oversize="onOversize6"
            :after-read="afterReadUploader6"
            @delete="deleteUploader6"
            :disabled="disabled"
            :deletable="deletable"
          />
          <p class="fs-13 color-c1">（只能上传jpg/png文件，且不超过10M）</p>
        </template>
      </van-cell>
      </template>
      <template  v-if="(form.licenceType === '0' && form.accountType === '0') || form.licenceType === '2'">
        <van-divider content-position="left">开户许可证信息</van-divider>
        <van-field
          label-class="color-333"
          v-model="form.openBankAccName"
          clearable
          input-align="right"
          placeholder="请输入开户许可证-开户名"
        >
          <template #label>
            <span class="color-danger">*</span>
            <span>开户名</span>
          </template>
        </van-field>
        <van-field
          label-class="color-333"
          v-model="form.openBankAccout"
          type="tel"
          clearable
          input-align="right"
          placeholder="请输入开户许可证-银行卡号"
        >
          <template #label>
            <span class="color-danger">*</span>
            <span>银行卡号</span>
          </template>
        </van-field>
        <van-field
          label-class="color-333"
          v-model="form.openBankRegionCode"
          clearable
          input-align="right"
          placeholder="请输入开户许可证-银行地区码"
        >
          <template #label>
            <span class="color-danger">*</span>
            <span>银行地区码</span>
          </template>
        </van-field>
        <van-field
          label-class="color-333"
          v-model="form.openCollectBankCode"
          clearable
          input-align="right"
          placeholder="请输入开户许可证-银行代码"
        >
          <template #label>
            <span class="color-danger">*</span>
            <span>银行代码</span>
          </template>
        </van-field>
        <van-field
          label-class="color-333"
          v-model="form.openUnionNo"
          clearable
          label-width="150"
          input-align="right"
          placeholder="请输入开户许可证-开户支行"
        >
          <template #label>
            <span class="color-danger">*</span>
            <span>开户支行</span>
          </template>
        </van-field>
      </template>
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
              :disabled="disabled"
              :deletable="deletable"
            >
              <template #default>
                <img
                  class="uploader-bgImg mr-1"
                  :src="
                    require('@/assets/images/iboxPay/front@2x.png')
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
              :deletable="deletable"
            >
              <template #default>
                <img
                  class="uploader-bgImg"
                  :src="
                    require('@/assets/images/iboxPay/contrary@2x.png')
                  "
                  alt=""
                />
              </template>
            </van-uploader>
          </div>
          <p class="fs-13 color-c1">（只能上传jpg/png文件，且不超过10M）</p>
        </template>
      </van-cell>
      <van-cell title="手持身份证照片" v-if="form.licenceType === '1' || form.licenceType === '3' || form.channelKind === '000001'">
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
            :disabled="disabled"
            :deletable="deletable"
          />
          <p class="fs-13 color-c1">（只能上传jpg/png文件，且不超过10M）</p>
        </template>
      </van-cell>
      <van-cell title="营业执照" v-if="form.channelKind !== '000001'">
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
            :disabled="disabled"
            :deletable="deletable"
          />
          <p class="fs-13 color-c1">（只能上传jpg/png文件，且不超过10M）</p>
        </template>
      </van-cell>
      <van-cell title="店铺照片">
        <template #icon>
          <span class="color-danger">*</span>
        </template>
        <template #label>
          <van-uploader
            v-model="uploader5"
            multiple
            :max-count="1"
            :max-size="1024 * 1024 * 10"
            @oversize="onOversize5"
            :after-read="afterReadUploader5"
            @delete="deleteUploader5"
            :disabled="disabled"
            :deletable="deletable"
          />
          <p class="fs-13 color-c1">（只能上传jpg/png文件，且不超过10M，且包含门头、收银台、内景含商品及合伙人合影）</p>
        </template>
      </van-cell>
      <br />
    </van-form>
    <van-button class="but mb-8" round block type="info" @click="submitForm" :disabled="disabled"
      >立即注册</van-button
    >
    <!-- 商户类型 -->
    <van-popup
      v-model="onChannelKind"
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
        @cancel="onChannelKind = false"
      />
    </van-popup>
    <!-- 开户银行支行信息查询弹框 -->
    <van-popup
      v-model="onZbank"
      position="bottom"
      round
      :close-on-popstate="false"
      :safe-area-inset-bottom="true"
    >
      <form action="/">
        <van-search v-model="value" placeholder="请输入支行名称" @search="onSearch"/>
      </form>
      <van-picker
        title=""
        show-toolbar
        :columns="columnsZbank"
        @confirm="onConfirmZbank"
        @cancel="onZbank = false"
      />
    </van-popup>
    <!-- 营业执照类型 -->
    <van-popup
      v-model="onLicenceType"
      position="bottom"
      round
      :close-on-popstate="false"
      :safe-area-inset-bottom="true"
    >
      <van-picker
        title=""
        show-toolbar
        :columns="columnsLicenceType"
        @confirm="onConfirmLicenceType"
        @cancel="onLicenceType = false"
      />
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
    <!-- 经营范围 -->
    <van-popup v-model="showStoreCate" position="bottom">
      <van-cascader
        v-model="storeCateValue"
        title="请选择所在地区"
        :options="optionsStoreCate"
        @close="showStoreCate = false"
        @finish="onFinishStoreCate"
        :field-names="fieldNamesStoreCate"
    />
    </van-popup>
  </div>
</template>
<script>
// import area from '@/utils/area.js'
import city from '@/utils/city.json'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      form: {
        accountType: '0',
        imgList: []
      },
      uploader1: [],
      uploader2: [],
      uploader3: [],
      uploader4: [],
      uploader5: [],
      uploader6: [],
      value: '',
      onZbank: false,
      columnsZbank: [],
      zbankList: [],
      showArea: false,
      showStoreCate: false,
      onChannelKind: false,
      onLicenceType: false,
      options: null,
      optionsStoreCate: null,
      regPhone:
        /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
      regSFZ: /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0[1-9]|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
      regBankNo: /^[1-9]\d{9,29}$/,
      columns: ['有执照', '无执照'],
      columnsLicenceType: ['企业法人', '个体工商户', '党政，机关及事业单位', '其他组织'], // 0-企业法人营业执照1-个体工商户营业执照2-党 政，机关及事业单位3-其他组织
      fieldNames: {
        text: 'value',
        value: 'id',
        children: 'children'
      },
      fieldNamesStoreCate: {
        text: 'name',
        value: 'id',
        children: 'children'
      },
      cascaderValue: '',
      storeCateValue: '',
      disabled: false,
      userCardType: '法人',
      deletable: true // 是否展示删除按钮
    }
  },
  computed: {
    ...mapState(['isApp', 'isH5'])
  },
  mounted () {

  },
  methods: {
    // 切换账户类型
    onChangeAccountType (value) {
      this.$set(this.form, 'accountType', value)
    },
    // 确认商户类型
    onConfirmType (value, index) {
      const typeV = ['000002', '000001']
      this.form.channelKindName = value
      this.$set(this.form, 'channelKind', typeV[index])
      // this.form.channelKind = typeV[index]
      this.onChannelKind = false
      this.userCardType = value === '无执照' ? '申请人' : '法人'
      if (value === '无执照') {
        this.form.licNo = null
        this.form.licenceType = null
        this.form.licenceTypeName = null
        this.form.businessTerm = null
      }
    },
    // 确认营业执照类型
    onConfirmLicenceType (value, index) {
      this.form.licenceTypeName = value
      this.$set(this.form, 'licenceType', index.toString())
      this.onLicenceType = false
    },
    // 点击地区
    onArea () {
      this.showArea = true
      this.options = city
    },
    // 点击经营范围
    onStoreCate () {
      this.$http.post(
        this.$apiUri.APP_IBOXPAY_STORECATELIST,
        null,
        (res) => {
          this.showStoreCate = true
          this.optionsStoreCate = res.data
        },
        (err) => {
          this.$toast(err.message)
        }
      )
    },
    // 选择地区
    onFinish ({ selectedOptions }) {
      // console.log(selectedOptions)
      this.showArea = false
      this.form.areaNo = selectedOptions[selectedOptions.length - 1].id
      this.form.zbankRegionCode = this.form.areaNo
      // this.form.areaName = selectedOptions[-1].value
    },
    // 选择经营范围
    onFinishStoreCate ({ selectedOptions }) {
      // console.log(selectedOptions)
      this.showStoreCate = false
      this.form.businessId = selectedOptions[selectedOptions.length - 1].id
      this.form.businessName = selectedOptions[selectedOptions.length - 1].name
    },
    // 搜索查询开户银行支行信息
    onSearch (val) {
      this.$http.post(
        this.$apiUri.APP_IBOXPAY_QUERY_BRANCHBANK,
        { name: val },
        (res) => {
          this.zbankList = res.data
          this.columnsZbank = res.data.map(item => item.branchName)
        },
        (err) => {
          this.$toast(err.message)
        }
      )
    },
    // 确认开户银行支行号
    onConfirmZbank (value, index) {
      // this.form.zbankNo = value
      this.form.zbankNo = this.zbankList[index].branchCode
      this.form.zbankRegionCode = this.form.areaNo
      this.onZbank = false
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
    // 营业执照
    afterReadUploader4 (File) {
      if (Array.isArray(File)) {
        return this.$toast('只能上传一张图片')
      }
      this.afterReadUploader(File, 7, 'license')
    },
    // 场景店铺-合伙人合影
    afterReadUploader5 (File) {
      this.afterReadUploader(File, 12, 'operatorMcht')
    },
    // 结算账户-银行卡照片
    afterReadUploader6 (File) {
      this.afterReadUploader(File, 4, 'bankCard')
    },
    deleteUploader1 () {
      this.form.imgList = _.assign([], this.form.imgList.filter(item => item.name !== 'idCardFront'))
      // console.log(this.form.imgList)
    },
    deleteUploader2 () {
      this.form.imgList = _.assign([], this.form.imgList.filter(item => item.name !== 'idCardBack'))
    },
    deleteUploader3 () {
      this.form.imgList = _.assign([], this.form.imgList.filter(item => item.name !== 'personWithIdCard'))
    },
    deleteUploader4 (file, detail) {
      this.form.imgList = _.assign([], this.form.imgList.filter(item => item.name !== 'license'))
    },
    deleteUploader5 (file, detail) {
      this.form.imgList = _.assign([], this.form.imgList.filter(item => item.name !== 'operatorMcht'))
    },
    deleteUploader6 (file, detail) {
      this.form.imgList = _.assign([], this.form.imgList.filter(item => item.name !== 'bankCard'))
    },
    afterReadUploader (File, i, name) {
      //   console.log(File)
      this.$toast.loading({
        message: '图片上传中...',
        forbidClick: true,
        duration: 0
        // mask: true
      })
      if (Array.isArray(File)) {
        for (let index = 0; index < File.length; index++) {
          this.get(File[index], i, name)
        }
      } else {
        this.get(File, i, name)
      }
    },
    get (File, i, name) {
      var formData = new FormData()
      formData.append('file', File.file)
      formData.append('fileType', i)
      this.$http.post(
        this.$apiUri.APP_IBOXPAY_FILEUPLOAD,
        formData,
        (res) => {
          if (res.success) {
            this.$toast.clear()
            this.$toast('图片上传成功')
            this.form.imgList.push({
              name: name,
              url: res.data.url,
              value: res.data.code
            })
            // console.log(this.form.imgList)
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
    // 身份证反面
    onOversize2 (file) {
      this.$toast('身份证反面图片大小不能超过 10MB')
    },
    // 手持身份证
    onOversize3 (file) {
      this.$toast('营业执照图片大小不能超过 10MB')
    },
    // 营业执照
    onOversize4 (file) {
      this.$toast('营业执照图片大小不能超过 10MB')
    },
    // 门店
    onOversize5 (file) {
      this.$toast('门店图片大小不能超过 10MB')
    },
    // 银行卡
    onOversize6 (file) {
      this.$toast('银行卡图片大小不能超过 10MB')
    },
    submitForm () {
      // console.log(this.form.imgList.filter(item => item.name === 'idCardFront'))
      if (!this.form.mchtName) return this.$toast('商户名称不能为空')
      if (!this.form.mchtCnShortName) return this.$toast('商户简称不能为空')
      if (!this.form.channelKindName) return this.$toast('商户类型不能为空')
      if (!this.form.licenceTypeName && this.form.channelKind !== '000001') return this.$toast('营业执照类型不能为空')
      if (!this.form.licNo && this.form.channelKind !== '000001') return this.$toast('营业执照号不能为空')
      if (!this.form.userCardNo) return this.$toast(`${this.userCardType}身份证号不能为空`)
      if (!this.regSFZ.test(this.form.userCardNo)) {
        return this.$toast(`${this.userCardType}身份证号不正确`)
      }
      if (!this.form.userName) return this.$toast(`${this.userCardType}姓名不能为空`)
      if (!this.form.userPhone) {
        return this.$toast(`${this.userCardType}手机号不能为空`)
      }
      if (!this.regPhone.test(this.form.userPhone)) {
        return this.$toast(`${this.userCardType}手机号不正确`)
      }
      if (!this.form.areaNo) return this.$toast('经营地区区域码不能为空')
      if (!this.form.address) return this.$toast('商户门店地址不能为空')
      if (!this.form.businessId) return this.$toast('经营范围不能为空')
      if (!this.form.accountType) return this.$toast('账户类型不能为空')
      if (!((this.form.licenceType === '0' && this.form.accountType === '0') || this.form.licenceType === '2')) {
        if (!this.form.accountName) return this.$toast('开户名不能为空')
        if (!this.form.zbankNo) return this.$toast('开户银行支行号不能为空')
        if (!this.form.zbankRegionCode) return this.$toast('开户银行支行区域码不能为空')
        if (!this.form.accountNo) return this.$toast('银行卡号不能为空')
        if (!this.regBankNo.test(this.form.userCardNo)) {
          return this.$toast('银行卡号不正确')
        }
        if (this.form.channelKind === '000001' && !this.form.resserveMobile) return this.$toast('银行预留手机号不能为空')
        if (this.form.imgList.filter(item => item.name === 'bankCard').length === 0) return this.$toast('请上传银行卡照片')
      } else {
        if (!this.form.openBankAccName) return this.$toast('开户许可证-开户名不能为空')
        if (!this.form.openBankAccout) return this.$toast('开户许可证-银行卡号不能为空')
        if (!this.form.openBankRegionCode) return this.$toast('开户许可证-银行地区码不能为空')
        if (!this.form.openCollectBankCode) return this.$toast('开户许可证-银行代码不能为空')
        if (!this.form.openUnionNo) return this.$toast('开户许可证-开户支行不能为空')
      }

      if (this.form.imgList.filter(item => item.name === 'idCardFront').length === 0) return this.$toast('请上传身份证正面')
      if (this.form.imgList.filter(item => item.name === 'idCardBack').length === 0) return this.$toast('请上传身份证反面')
      if (this.form.imgList.filter(item => item.name === 'personWithIdCard').length === 0) return this.$toast('请上传手持身份证')
      if (!this.form.licenceTypeName && this.form.channelKind !== '000001' && this.form.imgList.filter(item => item.name === 'license').length === 0) return this.$toast('请上传营业执照')
      if (this.form.imgList.filter(item => item.name === 'operatorMcht').length === 0) return this.$toast('请上传店铺照片')

      this.form.storeId = this.$lance.getData('storeId')
      this.$http.post(
        this.$apiUri.APP_IBOXPAY_MCHREGISTER,
        this.form,
        () => {
          this.$toast({ message: '商户注册资料提交成功，请耐心等待审核~', duration: 5000 })
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
  }
}
</script>
<style lang="scss" scoped>
.mchRegister {
  background: #fff;
  /deep/ .van-field__label {
    width: 140px;
  }
  /deep/ .van-uploader__preview-image {
    width: 166px;
    height: 106px;
  }
}
.uploader-bgImg {
  width: 166px;
  height: 106px;
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
