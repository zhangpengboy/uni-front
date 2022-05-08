<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-05 16:16:26
 * @Description  : 商品基础信息
-->
<template>
  <div class="goods">
    <el-card class="box-card">
      <div slot="header">
        <span>商品基本信息</span>
      </div>
      <el-form class="goods-form"
               ref="goodsBaseForm"
               :model="form"
               label-width="110px"
               size="medium"
               label-suffix=":">
        <el-row :gutter="20">
          <el-col :span="24"
                  :md="12">
            <el-form-item label="商品名称"
                          prop="goodsName"
                          required
                          :rules="[{ required: true, message: '商品名称不能为空' }]">
              <el-input :disabled="look"
                        v-model="form.goodsName"
                        placeholder="请输入商品的名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24"
                  :md="12">
            <el-form-item label="商品副标题"
                          prop="goodsTitle"
                          required
                          :rules="[{ required: true, message: '商品副标题不能为空' }]">
              <el-input :disabled="look"
                        v-model="form.goodsTitle"
                        placeholder="请输入商品的副标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24"
                  :md="24">
            <el-form-item label="商品分类"
                          required>
              <el-row>
                <el-col :span="8"
                        :xs="24"
                        :sm="8"
                        :md="8"
                        :lg="8"
                        :xl="8">
                  <el-select :class="{ pointer: look }"
                             v-model="form.primaryCategoryId"
                             placeholder="请选择一级分类"
                             class="w-95">
                    <el-option v-for="(v, i) in goodsCateOneOptions"
                               :key="i"
                               :label="v.title"
                               :value="v.id">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="8"
                        :xs="24"
                        :sm="8"
                        :md="8"
                        :lg="8"
                        :xl="8">
                  <el-select :class="{ pointer: look }"
                             v-model="form.secondaryCategoryId"
                             placeholder="请选择二级分类"
                             class="w-95">
                    <el-option v-for="(v, i) in goodsCateTwoOptions"
                               :key="i"
                               :label="v.title"
                               :value="v.id">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="8"
                        :xs="24"
                        :sm="8"
                        :md="8"
                        :lg="8"
                        :xl="8">
                  <el-select :class="{ pointer: look }"
                             v-model="form.level3CategoryId"
                             placeholder="请选择三级分类"
                             class="w-95">
                    <el-option v-for="(v, i) in goodsCateThreeOptions"
                               :key="i"
                               :label="v.title"
                               :value="v.id">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>

          <!-- <el-col :span="24" :md="12">
            <el-form-item
              label="原价"
              prop="marketPrice"
              required
              :rules="[
                { required: true, message: '原价不能为空', trigger: 'blur' },
              ]"
            >
              <el-input
                v-model="form.marketPrice"
                type="number"
                placeholder="请输入商品的原价"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="24" :md="12">
            <el-form-item
              label="销售价"
              prop="salePrice"
              required
              :rules="[
                { required: true, message: '销售价不能为空', trigger: 'blur' },
              ]"
            >
              <el-input
                v-model="form.salePrice"
                type="number"
                placeholder="请输入商品的销售价"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="24"
                  :md="8">
            <el-form-item label="邮费(元)"
                          prop="postage"
                          required
                          :rules="[
                { required: true, message: '邮费不能为空', trigger: 'blur' }
              ]">
              <el-input :disabled="look"
                        v-model="form.postage"
                        placeholder="请输入邮费">
                <!-- <template slot="append">元</template> -->
              </el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24" :md="12">
            <el-form-item label="积分规则">
              <el-input
                :placeholder="`请输入商品${
                  form.integralType ? '赠送' : '抵扣'
                }的积分`"
                v-model.number="form.integral"
                type="number"
                class="input-with-select"
              >
                <el-select
                  v-model.number="form.integralType"
                  slot="prepend"
                  placeholder="请选择积分方式"
                  style="width: 150px"
                >
                  <el-option label="抵扣积分" :value="0"></el-option>
                  <el-option label="赠送积分" :value="1"></el-option>
                </el-select>
                <el-button slot="append">积分</el-button>
              </el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="24"
                  :md="8">
            <el-form-item label="商品编号"
                          prop="goodsNo">
              <el-input :disabled="look"
                        v-model="form.goodsNo"
                        placeholder="请输入商品编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24"
                  :md="8">
            <el-form-item label="商品角标"
                          prop="goodsMark">
              <el-select :class="{ pointer: look }"
                         v-model="form.goodsMark"
                         placeholder="请选择商品角标"
                         class="w-95">
                <el-option v-for="(v, i) in goodsMarkOptions"
                           :key="i"
                           :label="v.name"
                           :value="v.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24"
                  :md="8">
            <el-form-item label="商品品牌"
                          prop="goodsName"
                          required
                          :rules="[{ required: true, message: '商品品牌不能为空' }]">
              <el-select v-model="form.brandName"
                         placeholder="请选择商品品牌"
                         class="w-100"
                         @change="onBrandChange">
                <el-option v-for="(v, i) in goodsBrandOptions"
                           :key="i"
                           :label="v.brandName"
                           :value="v.brandCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24"
                  :md="8">
            <el-form-item label="活动结束时间"
                          class=""
                          prop="pullOffTime">
              <el-date-picker class="w-100"
                              v-model="form.pullOffTime"
                              type="datetime"
                              placeholder="选择日期时间"
                              align="right"
                              :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12"
                  :md="8">
            <el-form-item label="商品缩略图"
                          prop="goodsIcon"
                          required
                          :rules="[{ required: true, message: '缩略图不能为空' }]">
              <el-upload :disabled="look"
                         class="avatar-uploader"
                         action="#"
                         :show-file-list="false"
                         :before-upload="beforeAvatarUpload"
                         :http-request="uploadImg">
                <img v-if="form.goodsIcon"
                     :src="form.goodsIcon"
                     class="avatar" />
                <i v-else
                   class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip"
                     class="el-upload__tip">
                  建议尺寸400*400, 只能上传jpg/png文件，且不超过500kb
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary"
                     size="default"
                     block
                     v-if="look"
                     @click="lookNextForm"
                     v-loading.fullscreen.lock="fullscreenLoading">查看, 下一步<i class="el-icon-arrow-right el-icon--right"></i></el-button>
          <el-button type="primary"
                     size="default"
                     block
                     v-if="!look"
                     @click="submitNextForm"
                     v-loading.fullscreen.lock="fullscreenLoading">保存，下一步<i class="el-icon-arrow-right el-icon--right"></i></el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { uploadImg } from '@/api/upload'
import { addGoods, updateGoods, getAppBrandList } from '@/api/goods'
import { getStoreGoodsCateList } from '@/api/stores'
import { mapGetters } from 'vuex'
export default {
  props: {
    // 是否修改
    isEdit: {
      type: Boolean,
      default: false
    },
    look: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters(['store'])
  },
  data () {
    return {
      // 基础商品表单
      form: _.assign({}, this.value),
      // 商品分类 1 2 3 级
      goodsCateOneOptions: [],
      goodsCateTwoOptions: [],
      goodsCateThreeOptions: [],
      // 商品角标
      goodsMarkOptions: [
        { id: 0, name: '不显示' },
        { id: 1, name: '折扣' },
        { id: 2, name: '直降' },
        { id: 3, name: '特卖价' }
      ],
      // 加载层
      fullscreenLoading: false,
      goodsBrandOptions: [],
      // 查询参数
      queryParams: _.cloneDeep(this.Dict.QUERY_PARAMS),
      pickerOptions: {
        shortcuts: [{
          text: '一周后',
          onClick (picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }, {
          text: '一个月后',
          onClick (picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30);
            picker.$emit('pick', date);
          }
        }, {
          text: '三个月后',
          onClick (picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 90);
            picker.$emit('pick', date);
          }
        }]
      },
    }
  },
  watch: {
    // 监听异步获取表单信息赋值
    value: function (nVal, oVal) {
      this.form = nVal
    },
    // 一级分类监听
    'form.primaryCategoryId': {
      handler: function (nVal, oVal) {
        if (nVal) {
          this.$set(this.form, 'primaryCategoryId', nVal)
          if (_.size(this.goodsCateOneOptions) > 0) {
            this.$set(
              this.form,
              'primaryCategoryName',
              _.get(
                _.find(this.goodsCateOneOptions, v => {
                  return v.id == nVal
                }),
                'title'
              )
            )
          }
          this.getStoreGoodsCateList(nVal, 'two')
        }
        if (oVal && nVal != oVal) {
          this.$set(this.form, 'secondaryCategoryId', '')
          this.$set(this.form, 'secondaryCategoryName', '')
          this.$set(this.form, 'level3CategoryId', '')
          this.$set(this.form, 'level3CategoryName', '')
        }
      },
      deep: true
    },
    // 二级分类监听
    'form.secondaryCategoryId': {
      handler: function (nVal, oVal) {
        if (nVal) {
          this.$set(this.form, 'secondaryCategoryId', nVal)
          if (_.size(this.goodsCateTwoOptions) > 0) {
            this.$set(
              this.form,
              'secondaryCategoryName',
              _.get(
                _.find(this.goodsCateTwoOptions, v => {
                  return v.id == nVal
                }),
                'title'
              )
            )
          }
          this.getStoreGoodsCateList(nVal, 'three')
        }
        if (oVal && nVal != oVal) {
          this.$set(this.form, 'level3CategoryId', '')
          this.$set(this.form, 'level3CategoryName', '')
        }
      },
      deep: true
    },
    // 三级分类监听
    'form.level3CategoryId': {
      handler: function (nVal, oVal) {
        if (nVal) {
          this.$set(this.form, 'level3CategoryId', nVal)
          if (_.size(this.goodsCateThreeOptions) > 0) {
            this.$set(
              this.form,
              'level3CategoryName',
              _.get(
                _.find(this.goodsCateThreeOptions, v => {
                  return v.id == nVal
                }),
                'title'
              )
            )
          }
        }
      },
      deep: true
    }
  },
  created () {
    this.getStoreGoodsCateList(0, 'one')
    this.getBrandList()
  },
  methods: {
    /** 获取商品类别 */
    getStoreGoodsCateList (pid, type) {
      getStoreGoodsCateList({
        roleCode: this.store.storeRoleCode,
        storeId: this.store.id,
        pid: pid
      }).then(res => {
        if (type == 'one') {
          this.goodsCateOneOptions = res.data
        }
        if (type == 'two') {
          this.goodsCateTwoOptions = res.data
        }
        if (type == 'three') {
          this.goodsCateThreeOptions = res.data
        }
      })
    },
    // 获取商品品牌
    getBrandList () {
      getAppBrandList().then(res => {
        // this.goodsBrandOptions = res.data
        this.goodsBrandOptions = res.data
      })
    },
    onBrandChange (v) {
      this.$set(this.form, 'brandCode', v)
      this.form.brandName = this.goodsBrandOptions.filter(item => item.brandCode === v)[0].brandName
    },
    /** 图片上传之前判断 */
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isJPG) {
        this.$message.error('上传图片只能是JPG、PNG格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过1MB!')
      }
      return isJPG && isLt2M
    },
    /** 自定义上传图片 */
    uploadImg (e) {
      uploadImg(e.file).then(res => {
        if (res.code == 200) {
          this.$set(this.form, 'goodsIcon', res.data)
        } else {
          this.$msgError('上传图片失败,请重新上传!')
        }
      })
    },

    check (v) {
      var a = /^[0-9]*(\.[0-9]{1,2})?$/
      if (!a.test(v)) {
        return false
      } else {
        return true
      }
    },

    // 下一步
    submitNextForm () {
      this.$refs['goodsBaseForm'].validate(valid => {
        if (valid) {
          if (!this.form.primaryCategoryId)
            return this.$message.error('商品分类不能为空!')
          if (!this.check(this.form.postage))
            return this.msgError('请输入正确的邮费')
          this.form.storeId = this.store.id
          this.form.storeName = this.store.storeName
          this.form.status = 0
          this.form.roleCode = this.store.storeRoleCode
          this.fullscreenLoading = true
          if (this.form.id == undefined) {
            // 新增
            addGoods(this.form).then(res => {
              this.fullscreenLoading = false
              this.$set(this.form, 'id', res.data)
              this.$emit('setValue', this.form)
              this.$emit('steps', 'GOODS_INFO')
            })
          } else {
            // 修改
            updateGoods(this.form).then(res => {
              this.fullscreenLoading = false
              this.$emit('setValue', this.form)
              this.$emit('steps', 'GOODS_INFO')
            })
          }
          setTimeout(() => {
            this.fullscreenLoading = false
          }, 2000)
        }
      })
    },
    // 查看 下一步
    lookNextForm () {
      this.$emit('setValue', this.form)
      this.$emit('steps', 'GOODS_INFO')
    }
  }
}
</script>
<style lang="scss" scoped>
.pointer {
  pointer-events: none;
}
</style>
