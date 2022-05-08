<!--
 * @Description : 商铺注册
-->
<template>
  <div class="giftMotherEnter">
    <van-form validate-first>
      <van-field v-model="storeReq.storeName"
                 input-align="right"
                 maxlength="10"
                 placeholder="请输入店铺名称">
        <template #label>
          <span class="color-danger">*</span>
          <span class="color-333">店铺名称</span>
        </template>
      </van-field>
      <van-field v-model="storeReq.storeOwnerName"
                 input-align="right"
                 clearable
                 maxlength="10"
                 placeholder="请输入店东姓名">
        <template #label>
          <span class="color-danger">*</span>
          <span class="color-333">店东姓名</span>
        </template>
      </van-field>
      <!-- <van-field
        v-model="storeReq.salesmanPhone"
        input-align="right"
        type="tel"
        clearable
        placeholder="请输入业务员手机号"
      >
        <template #label>
          <span class="color-333">业务员手机号</span>
        </template>
      </van-field> -->

      <van-field input-align="right"
                 readonly
                 clickable
                 v-model="storeReq.storeRoleName"
                 right-icon="arrow"
                 placeholder="请选择店铺角色"
                 @click="showRolePicker = true">
        <template #label>
          <span class="color-danger">*</span>
          <span class="color-333">店铺角色</span>
        </template>
      </van-field>
      <!-- <van-field v-if="showDigitalShelves" name="isCloudStore" label="数字货架">
        <template #input>
          <van-radio-group
            v-model="storeReq.isCloudStore"
            direction="horizontal"
          >
            <van-radio checked-color="#ed6133" :name="1">是</van-radio>
            <van-radio checked-color="#ed6133" :name="0">否</van-radio>
          </van-radio-group>
        </template>
      </van-field> -->
      <van-field input-align="right"
                 readonly
                 clickable
                 v-model="storeReq.storeCategoryName"
                 right-icon="arrow"
                 placeholder="请选择店铺类别"
                 @click="showCatePicker = true">
        <template #label>
          <span class="color-danger">*</span>
          <span class="color-333">店铺类别</span>
        </template>
      </van-field>
      <van-field input-align="right"
                 readonly
                 clickable
                 v-model="storeReq.storeAddre"
                 right-icon="arrow"
                 placeholder="请选择店铺区域"
                 @click="showArea = true">
        <template #label>
          <span class="color-danger">*</span>
          <span class="color-333">店铺区域</span>
        </template>
      </van-field>
      <van-field v-model="storeReq.storeAddress"
                 input-align="right"
                 maxlength="100"
                 placeholder="请输入店铺详情地址（精确到门牌号）">
        <template #label>
          <span class="color-danger">*</span>
          <span class="color-333">详情地址</span>
        </template>
      </van-field>
      <van-field v-model="storeReq.storeBusiness"
                 input-align="right"
                 clearable
                 maxlength="100"
                 placeholder="请输入经营范围">
        <template #label>
          <span class="color-333">经营范围</span>
        </template>
      </van-field>
      <van-cell title="身份证">
        <template #icon>
          <span class="color-danger">*</span>
        </template>
        <template #label>
          <div class="d-flex"
               v-if="isAndroid">
            <div v-if="storeReq.idcard1"
                 class="appImg mr-1">
              <img :src="storeReq.idcard1"
                   class="uploader-bgImg"
                   alt=""
                   @click="ImagePreview1" />
              <div class="icon"
                   @click="deleteUploader1">
                <van-icon name="cross"
                          color="#fff"
                          size="10px" />
              </div>
            </div>
            <img v-else
                 class="uploader-bgImg mr-1"
                 :src="require('@/assets/images/front@2x.png')"
                 alt=""
                 @click="androidUpload('idcard1')" />
            <div v-if="storeReq.idcard2"
                 class="appImg mr-1">
              <img :src="storeReq.idcard2"
                   class="uploader-bgImg"
                   alt=""
                   @click="ImagePreview2" />
              <div class="icon"
                   @click="deleteUploader2">
                <van-icon name="cross"
                          color="#fff"
                          size="10px" />
              </div>
            </div>
            <img v-else
                 class="uploader-bgImg"
                 :src="require('@/assets/images/contrary@2x.png')"
                 alt=""
                 @click="androidUpload('idcard2')" />
          </div>
          <div v-else
               class="d-flex">
            <van-uploader v-model="uploader1"
                          :max-count="1"
                          :max-size="1024 * 1024 * 10"
                          @oversize="onOversize1"
                          :after-read="afterReadUploader1"
                          @delete="deleteUploader1"
                          :disabled="disabled">
              <template #default>
                <img class="uploader-bgImg mr-1"
                     :src="require('@/assets/images/front@2x.png')"
                     alt="" /> </template>
            </van-uploader>
            <van-uploader v-model="uploader2"
                          :max-count="1"
                          :max-size="1024 * 1024 * 10"
                          @oversize="onOversize2"
                          :after-read="afterReadUploader2"
                          @delete="deleteUploader2"
                          :disabled="disabled">
              <template #default>
                <img class="uploader-bgImg"
                     :src="require('@/assets/images/contrary@2x.png')"
                     alt="" />
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
          <div class="d-flex"
               v-if="isAndroid">
            <div v-if="storeReq.licence"
                 class="appImg mr-1">
              <img :src="storeReq.licence"
                   class="camera-bgImg"
                   alt=""
                   @click="ImagePreview3" />
              <div class="icon"
                   @click="deleteUploader3">
                <van-icon name="cross"
                          color="#fff"
                          size="10px" />
              </div>
            </div>
            <img v-else
                 class="camera-bgImg"
                 :src="require('@/assets/images/camera@2x.png')"
                 alt=""
                 @click="androidUpload('licence')" />
          </div>
          <div v-else
               class="d-flex">
            <van-uploader v-model="uploader3"
                          :max-count="1"
                          :max-size="1024 * 1024 * 10"
                          @oversize="onOversize3"
                          :after-read="afterReadUploader3"
                          @delete="deleteUploader3"
                          :disabled="disabled"
                          preview-size="60px">
            </van-uploader>
          </div>
          <p class="fs-13 color-c1">（只能上传jpg/png文件，且不超过10M）</p>
        </template>
      </van-cell>
      <van-cell title="店铺详情背景图">
        <template #icon>
          <span class="color-danger">*</span>
        </template>
        <template #label>
          <div class="d-flex"
               v-if="isAndroid">
            <div v-if="storeReq.licence"
                 class="appImg mr-1">
              <img :src="storeReq.storeBg"
                   class="camera-bgImg"
                   alt=""
                   @click="ImagePreview6" />
              <div class="icon"
                   @click="deleteUploader6">
                <van-icon name="cross"
                          color="#fff"
                          size="10px" />
              </div>
            </div>
            <img v-else
                 class="camera-bgImg"
                 :src="require('@/assets/images/camera@2x.png')"
                 alt=""
                 @click="androidUpload('storeBg')" />
          </div>
          <div v-else
               class="d-flex">
            <van-uploader v-model="uploader6"
                          :max-count="1"
                          :max-size="1024 * 1024 * 10"
                          @oversize="onOversize4"
                          :after-read="afterReadUploader6"
                          @delete="deleteUploader6"
                          :disabled="disabled"
                          preview-size="60px">
            </van-uploader>
          </div>
          <p class="fs-13 color-c1">（只能上传jpg/png文件，且不超过10M）</p>
        </template>
      </van-cell>
      <van-cell title="店铺LOGO">
        <template #icon>
          <span class="color-danger">*</span>
        </template>
        <template #label>
          <div class="d-flex"
               v-if="isAndroid">
            <div v-if="storeReq.licence"
                 class="appImg mr-1">
              <img :src="storeReq.storeLogo"
                   class="camera-bgImg"
                   alt=""
                   @click="ImagePreview5" />
              <div class="icon"
                   @click="deleteUploader5">
                <van-icon name="cross"
                          color="#fff"
                          size="10px" />
              </div>
            </div>
            <img v-else
                 class="camera-bgImg"
                 :src="require('@/assets/images/camera@2x.png')"
                 alt=""
                 @click="androidUpload('storeLogo')" />
          </div>
          <div v-else
               class="d-flex">
            <van-uploader v-model="uploader5"
                          :max-count="1"
                          :max-size="1024 * 1024 * 10"
                          @oversize="onOversize5"
                          :after-read="afterReadUploader5"
                          @delete="deleteUploader5"
                          :disabled="disabled"
                          preview-size="60px">
            </van-uploader>
          </div>
          <p class="fs-13 color-c1">（只能上传jpg/png文件，且不超过10M）</p>
        </template>
      </van-cell>
      <van-cell title="门头照"
                v-if="storeReq.isCloudStore === 1">
        <template #icon>
          <span class="color-danger">*</span>
        </template>
        <template #label>
          <div class="d-flex"
               v-if="isAndroid">
            <div v-if="storeReq.storesImg"
                 class="appImg mr-1">
              <img :src="storeReq.storesImg"
                   class="uploader-bgImg"
                   alt=""
                   @click="ImagePreview4" />
              <div class="icon"
                   @click="deleteUploader4">
                <van-icon name="cross"
                          color="#fff"
                          size="10px" />
              </div>
            </div>
            <img v-else
                 class="camera-bgImg"
                 :src="require('@/assets/images/camera@2x.png')"
                 alt=""
                 @click="androidUpload('storesImg')" />
          </div>
          <div v-else
               class="d-flex">
            <van-uploader v-model="uploader4"
                          :max-count="1"
                          :max-size="1024 * 1024 * 10"
                          @oversize="onOversize4"
                          :after-read="afterReadUploader4"
                          @delete="deleteUploader4"
                          :disabled="disabled"
                          preview-size="60px"></van-uploader>
          </div>
          <p class="fs-13 color-c1">（只能上传jpg/png文件，且不超过10M）</p>
        </template>
      </van-cell>
      <br />
    </van-form>
    <van-checkbox label-disabled
                  v-model="storeReq.buyCoupons"
                  checked-color="#EB6133"
                  class="checked fs-13">
      <span>我已阅读并同意</span>
      <span class="color-main"
            @click="showProtocol = true">《商户通入驻协议》</span>
    </van-checkbox>
    <van-button color="linear-gradient(180deg, #F1722C 0%, #EB6133 100%)"
                block
                size="small"
                @click="submitForm"
                class="buttom">提交</van-button>

    <!-- 地址 -->
    <van-popup v-model="showArea"
               position="bottom">
      <van-cascader v-model="cascaderValue"
                    title="请选择所在地区"
                    :options="options"
                    @close="showArea = false"
                    @finish="onFinish"
                    :field-names="fieldNames" />
    </van-popup>
    <!-- 角色 -->
    <van-popup v-model="showRolePicker"
               round
               position="bottom">
      <van-picker show-toolbar
                  :columns="storeRoleNameList"
                  @confirm="confirmStoreRole"
                  @cancel="showRolePicker = false" />
    </van-popup>
    <!-- 类别 -->
    <van-popup v-model="showCatePicker"
               round
               position="bottom">
      <van-picker show-toolbar
                  :columns="categoryList"
                  @confirm="categoryFirm"
                  @cancel="showCatePicker = false" />
    </van-popup>
    <van-dialog v-model="showProtocol"
                title="隐私协议"
                show-cancel-button
                width="90%"
                @confirm="confirmProtocol">
      <div class="protocol-dialg">
        <!-- <iframe :src="$apiUri.WEBSITE_URL + '/protocol/store_policy.html'" frameborder="0"></iframe> -->
        <iframe :src="'https://lz.wap.seprain.com/protocol/store_policy.html'"
                frameborder="0"></iframe>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import city from '@/utils/city.json'
import { mapState } from 'vuex'
import { ImagePreview } from 'vant'
export default {
  data () {
    return {
      fieldNames: {
        text: 'value',
        value: 'id',
        children: 'children'
      },
      cascaderValue: '',
      options: null,
      index: -1,
      showDigitalShelves: false,
      regionList: [], // 选择地区后未处理的数据
      buyCoupons: false,
      showArea: false,
      uploader1: [],
      uploader2: [],
      uploader3: [],
      uploader4: [],
      uploader5: [],
      uploader6: [],
      storeRoleNameList: [], // 角色
      categoryList: [], // 类别
      storeRoleName: '',
      disabled: false,
      showRolePicker: false,
      showCatePicker: false,
      storeReq: {
        storeName: '',
        storeOwnerName: '',
        salesmanPhone: '',
        storeRoleCode: '',
        storeCategoryId: '',
        storeAddre: '',
        storeAddress: '',
        storeBusiness: '',
        area3Id: '',
        area1Id: '',
        area2Id: '',
        area4Id: '',
        idcard1: null,
        idcard2: null,
        licence: null, // 营业执照
        storesImg: null, // 门头照
        storeBg: null,
        storeLogo: null,
        isCloudStore: ''
      },
      userReq: {
        phone: '',
        code: '',
        signNo: ''
      },
      flag: 'default', // 默认 default 数字货架 digitalShelves
      regStr:
        /^[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\\A9|\\AE]\u3030|\uA9|\uAE|\u3030$/,
      storeId: '',
      phone: null,
      isAndroid: !!window.jsObj,
      showProtocol: false
    }
  },
  computed: {
    ...mapState(['storeQuery', 'isApp'])
  },
  mounted () {
    this.storeId = this.$route.query.storeId
    this.phone = this.$route.query.phone
    // 获取店铺资料
    if (this.storeId) {
      this.storeinfo()
    }
    // 获取店铺角色
    this.getStoreRoleList()
    this.userReq.phone = this.$lance.getData('phone')

    // ? Android 回调方法挂载到Window下
    window.androidResponse = this.androidResponse
    this.options = city
    this.flag = this.$route.query.type

    // 注册赋值
    if (this.flag === 'register') {
      this.userReq = _.assign({}, this.$lance.getJson('user-req'))
    }

    // 修改资料
    if (this.flag === 'update') {
      this.storeId = this.$route.query.storeId
      this.phone = this.$route.query.phone
    }
    // 小程序创建进入判断
    if (!_.isEmpty(this.storeQuery)) {
      this.flag = this.storeQuery.type
      this.storeReq.storeAccountId = this.storeQuery.storeAccountId || null
    }
  },
  methods: {
    confirmProtocol () {
      this.storeReq.buyCoupons = true
    },
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
        this.$set(this.storeReq, 'idcard1', obj.imgPath)
        this.uploader1 = [{ url: obj.imgPath }]
      } else if (obj.type === 'idcard2') {
        this.$set(this.storeReq, 'idcard2', obj.imgPath)
        this.uploader2 = [{ url: obj.imgPath }]
      } else if (obj.type === 'licence') {
        this.$set(this.storeReq, 'licence', obj.imgPath)
        this.uploader3 = [{ url: obj.imgPath }]
      } else if (obj.type === 'storesImg') {
        this.$set(this.storeReq, 'storesImg', obj.imgPath)
        this.uploader4 = [{ url: obj.imgPath }]
      } else if (obj.type === 'storeLogo') {
        this.$set(this.storeReq, 'storeLogo', obj.imgPath)
        this.uploader5 = [{ url: obj.imgPath }]
      } else if (obj.type === 'storeBg') {
        this.$set(this.storeReq, 'storeBg', obj.imgPath)
        this.uploader6 = [{ url: obj.imgPath }]
      }
    },
    // app端身份证正面图片预览
    ImagePreview1 () {
      ImagePreview([this.storeReq.idcard1])
    },
    ImagePreview2 () {
      ImagePreview([this.storeReq.idcard2])
    },
    ImagePreview3 () {
      ImagePreview([this.storeReq.licence])
    },
    ImagePreview4 () {
      ImagePreview([this.storeReq.storesImg])
    },
    ImagePreview5 () {
      ImagePreview([this.storeReq.storeLogo])
    },
    ImagePreview6 () {
      ImagePreview([this.storeReq.storeBg])
    },
    // 获取店铺详情
    storeinfo () {
      this.$http.post(
        this.$apiUri.APP_ADD_UPDTA_SROREINFO_DETAIL,
        { storeId: this.storeId },
        (res) => {
          console.log(res)
          this.storeReq = res.data
          this.storeReq.storeAddre =
            res.data.area1Name +
            '-' +
            res.data.area2Name +
            '-' +
            res.data.area3Name
          this.regionList = [
            { id: res.data.area1Id, value: res.data.area1Name },
            { id: res.data.area2Id, value: res.data.area2Name },
            { id: res.data.area3Id, value: res.data.area3Name }
          ]
          this.uploader1 = [{ url: res.data.idcard1 }]
          this.uploader2 = [{ url: res.data.idcard2 }]
          this.uploader3 = [{ url: res.data.licence }]
          this.uploader4 = [{ url: res.data.storesImg }]
          this.uploader5 = [{ url: res.data.storeLogo }]
          this.uploader6 = [{ url: res.data.storeBg }]
          if (
            this.storeReq.storeRoleCode === 3 ||
            this.storeReq.storeRoleCode === 5
          ) {
            this.showDigitalShelves = true
          } else {
            this.showDigitalShelves = false
          }
          // 获取店铺类别
          this.ShopCategoryList()
        }
      )
    },
    // 类别
    ShopCategoryList () {
      this.$http.post(
        this.$apiUri.APP_ADD_UPDTA_SRORELIST,
        { roleCode: this.storeReq.storeRoleCode },
        (res) => {
          this.columns = res.data
          this.categoryList = res.data.map((v) => v.title)
          if (_.size(res.data) > 0) {
            this.value = res.data[0].title
          }
        }
      )
    },
    // 角色
    getStoreRoleList () {
      this.$http.post(this.$apiUri.APP_STORE_ROLE_LIST, {}, (res) => {
        this.storeRoleList = res.data
        // 数字货架
        if (this.storeQuery.inWay === 'digitalShelves') {
          this.storeRoleNameList = res.data
            .filter((v) => v.code === 5)
            .map((v) => v.name)
          this.showDigitalShelves = true
        } else {
          // 默认
          this.storeRoleNameList = res.data.map((v) => v.name)
        }
      })
    },

    // 角色选择确定
    confirmStoreRole (values, index) {
      this.storeReq.storeCategoryName = null
      this.storeReq.storeCategoryId = null
      this.storeReq.isCloudStore = null
      this.storeRoleList.map((item) => {
        if (values === item.name) {
          this.storeReq.storeRoleName = item.name
          this.storeReq.storeRoleCode = item.code
        }
      })
      this.ShopCategoryList()
      this.showRolePicker = false
      if (
        this.storeQuery.inWay === 'digitalShelves' ||
        this.storeReq.storeRoleCode === 3 ||
        this.storeReq.storeRoleCode === 5
      ) {
        this.showDigitalShelves = true
      } else {
        this.showDigitalShelves = false
      }
    },
    // 类别 确定
    categoryFirm (values, index) {
      this.showCatePicker = false
      this.storeReq.storeCategoryName = values
      this.storeReq.storeCategoryId = index
    },
    // 地区
    onFinish ({ selectedOptions }) {
      this.showArea = false
      this.regionList = selectedOptions
      // console.log(33, this.regionList)
      this.storeReq.storeAddre = selectedOptions
        .map((item) => item.value)
        .join('-')
    },
    // 身份证
    onOversize1 (file) {
      this.$toast('身份证正面图片大小不能超过 10MB')
    },
    deleteUploader1 () {
      this.storeReq.idcard1 = null
      this.$toast('已删除图片')
    },
    afterReadUploader1 (File) {
      if (Array.isArray(File)) {
        return this.$toast('只能上传一张图片')
      }
      this.afterReadUploader(File, 1)
    },
    // 身份证反面
    onOversize2 (file) {
      this.$toast('身份证反面图片大小不能超过 10MB')
    },
    deleteUploader2 () {
      this.storeReq.idcard2 = null
      this.$toast('已删除图片')
    },
    afterReadUploader2 (File) {
      if (Array.isArray(File)) {
        return this.$toast('只能上传一张图片')
      }
      this.afterReadUploader(File, 2)
    },
    // 营业执照
    onOversize3 (file) {
      this.$toast('营业执照图片大小不能超过 10MB')
    },
    deleteUploader3 () {
      this.storeReq.licence = null
      this.$toast('已删除图片')
    },
    afterReadUploader3 (File) {
      if (Array.isArray(File)) {
        return this.$toast('只能上传一张图片')
      }
      this.afterReadUploader(File, 3)
    },
    // 门照
    onOversize4 (file) {
      this.$toast('门头照图片大小不能超过 10MB')
    },
    deleteUploader4 () {
      this.storeReq.storesImg = null
      this.$toast('已删除图片')
    },
    afterReadUploader4 (File) {
      if (Array.isArray(File)) {
        return this.$toast('只能上传一张图片')
      }
      this.afterReadUploader(File, 4)
    },
    // 门店详情背景图
    onOversize6 (file) {
      this.$toast('店铺详情背景图大小不能超过 10MB')
    },
    deleteUploader6 () {
      this.storeReq.storeBg = null
      this.$toast('已删除图片')
    },
    afterReadUploader6 (File) {
      if (Array.isArray(File)) {
        return this.$toast('只能上传一张图片')
      }
      this.afterReadUploader(File, 5)
    },
    // 店铺logo
    onOversize5 (file) {
      this.$toast('店铺logo大小不能超过 10MB')
    },
    deleteUploader5 () {
      this.storeReq.storeLogo = null
      this.$toast('已删除图片')
    },
    afterReadUploader5 (File) {
      if (Array.isArray(File)) {
        return this.$toast('只能上传一张图片')
      }
      this.afterReadUploader(File, 6)
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
            if (i === 1) this.storeReq.idcard1 = res.data
            if (i === 2) this.storeReq.idcard2 = res.data
            if (i === 3) this.storeReq.licence = res.data
            if (i === 4) this.storeReq.storesImg = res.data
            if (i === 5) this.storeReq.storeLogo = res.data
            if (i === 6) this.storeReq.storeBg = res.data
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
    // 提交表单
    submitForm () {
      if (!this.storeReq.storeName) return this.$toast('店铺名称不能为空')
      if (!this.storeReq.storeOwnerName) {
        return this.$toast('店东名称不能为空')
      }
      if (this.storeReq.salesmanPhone) {
        if (
          !/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/.test(
            this.storeReq.salesmanPhone
          )
        ) {
          return this.$toast('业务员电话不正确')
        }
        // 业务员手机号和登录注册的手机号不能一样
        if (this.storeReq.salesmanPhone === this.userReq.phone) {
          return this.$toast('业务员电话不能和账户的手机号一样')
        }
      }

      if (!this.storeReq.storeRoleName) return this.$toast('请选择店铺角色')
      if (!this.storeReq.storeCategoryName) {
        return this.$toast('请选择店铺类别')
      }
      if (!this.storeReq.storeAddre) return this.$toast('店铺区域不能为空')
      if (!this.storeReq.storeAddress) return this.$toast('详细地址不能为空')
      if (this.regStr.test(this.storeReq.storeAddress)) {
        return this.$toast('详细地址不能输入表情字符')
      }
      if (!this.storeReq.idcard1) return this.$toast('请上传身份证正面')
      if (!this.storeReq.idcard2) return this.$toast('请上传身份证反面')
      if (!this.storeReq.licence) return this.$toast('请上传营业执照')
      if (this.storeReq.isCloudStore && !this.storeReq.storesImg) {
        return this.$toast('请上传门头照')
      }
      if (!this.storeReq.storeBg) return this.$toast('请上传店铺详情背景图')
      if (!this.storeReq.storeLogo) return this.$toast('请上传店铺logo')
      if (!this.storeReq.buyCoupons) {
        return this.$toast('请阅读并勾选商户入驻协议')
      }

      this.storeReq.area1Id = this.regionList[0].id
      this.storeReq.area1Name = this.regionList[0].value
      this.storeReq.area2Id = this.regionList[1].id
      this.storeReq.area2Name = this.regionList[1].value
      this.storeReq.area3Id = this.regionList[2].id
      this.storeReq.area3Name = this.regionList[2].value
      this.storeReq.area4Id = this.regionList[3].id
      this.storeReq.area4Name = this.regionList[3].value

      // 注册店铺
      if (this.flag === 'register') {
        this.registerStoreInfo()
      }
      // 创建店铺
      if (this.flag === 'create') {
        this.createStoreInfo()
      }
      // 店铺资料修改
      if (this.flag === 'update') {
        this.modifyStoreInfo()
      }
    },
    // 首次注册店铺
    registerStoreInfo () {
      this.$http.post(
        this.$apiUri.APP_ADD_UPDTA_SEGIST,
        {
          userReq: this.userReq,
          storeReq: this.storeReq
        },
        (res) => {
          this.$toast('入驻成功')
          this.$router.back()
        },
        (err) => {
          this.$toast(err.message)
        }
      )
    },
    // 创建店铺
    createStoreInfo () {
      this.storeReq.phone = this.storeQuery.phone
      this.$http.post(
        this.$apiUri.APP_ADD_UPDTA_SEGISTADD,
        this.storeReq,
        (res) => {
          this.$toast('入驻成功')
          this.$router.push({
            path: '/storeSelect',
            query: {
              phone: this.userReq.phone
            }
          })
        },
        (err) => {
          this.$toast(err.message)
        }
      )
    },
    // 资料修改审核
    modifyStoreInfo () {
      // if (this.flag === 'update') {
      //   this.storeReq.area1Id = this.regionList[0].id
      //   this.storeReq.area1Name = this.regionList[0].value
      //   this.storeReq.area2Id = this.regionList[1].id
      //   this.storeReq.area2Name = this.regionList[1].value
      //   this.storeReq.area3Id = this.regionList[2].id
      //   this.storeReq.area3Name = this.regionList[2].value
      // }
      this.$http.post(
        this.$apiUri.APP_ADD_UPDTA_SROREINFO_LNFO,
        this.storeReq,
        (res) => {
          this.$toast('提交成功')
          this.$router.push({
            path: '/storeSelect',
            query: {
              phone: this.phone
            }
          })
          this.$toast('提交成功')
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
/deep/.van-uploader__preview-image {
  display: block;
  width: 166px;
  height: 106px;
  overflow: hidden;
}
/deep/.van-field__control--custom {
  display: flex;

  align-items: center;
  min-height: 0.64rem;

  margin-left: 135px;
}
/deep/.van-picker__confirm {
  color: #eb6133;
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
.buttom {
  text-align: center;
  margin: 0 auto;
  width: 262px;
  height: 38px;
  background: linear-gradient(180deg, #f1722c 0%, #eb6133 100%);
  opacity: 1;
  border-radius: 41px;
}
.previewSize {
  width: 166px;
  height: 106px;
}
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
    margin: 12px 0 32px 15px;
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
    }
    .activeClass {
      border: 1px solid #eb6133;
      background: #eb6133;
      color: #fff;
    }
  }
}
.protocol-dialg {
  width: 100%;
  height: 400px;
  iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
