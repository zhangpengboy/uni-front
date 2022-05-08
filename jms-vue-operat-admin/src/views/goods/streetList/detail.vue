<!-- 街市商品详情 查看/修改 -->
<template>
  <div class="goods">
    <el-card class="box-card">
      <div slot="header">
        <span>街市商品信息</span>
      </div>
      <el-form class="goods-form"
               ref="goodsBaseForm"
               :model="form"
               label-width="112px"
               size="medium"
               label-suffix=":">
        <el-row :gutter="20">
          <el-col :span="24"
                  :md="24">
            <el-form-item label="商品分类"
                          required>
              <el-row>
                <el-col :span="8"
                        :xs="24">
                  <el-select v-model="form.primaryCategoryId"
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
                        :xs="24">
                  <el-select v-model="form.secondaryCategoryId"
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
                        :xs="24">
                  <el-select v-model="form.level3CategoryId"
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
          <el-col :span="24"
                  :md="8">
            <el-form-item label="商品名称"
                          prop="goodsName"
                          required
                          :rules="[{ required: true, message: '商品名称不能为空' }]">
              <el-input v-model="form.goodsName"
                        placeholder="请输入商品的名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24"
                  :md="8">
            <el-form-item label="商品副标题"
                          prop="goodsTitle"
                          required
                          :rules="[{ required: true, message: '商品副标题不能为空' }]">
              <el-input v-model="form.goodsTitle"
                        placeholder="请输入商品的副标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24"
                  :md="8">
            <el-form-item label="门店价(元)"
                          prop="marketPrice"
                          required
                          :rules="[
                { required: true, message: '门店价不能为空', trigger: 'blur' },
              ]">
              <el-input v-model="form.marketPrice"
                        type="number"
                        placeholder="请输入商品的原价">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24"
                  :md="8">
            <el-form-item label="销售价(元)"
                          prop="salePrice"
                          required
                          :rules="[
                { required: true, message: '销售价不能为空', trigger: 'blur' }
              ]">
              <el-input v-model="form.salePrice"
                        type="number"
                        placeholder="请输入商品的销售价">
                <!-- <template slot="append">元</template> -->
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24"
                  :md="8">
            <el-form-item label="vip价(元)"
                          prop="vipPrice"
                          required
                          :rules="[
                { required: true, message: 'vip价不能为空', trigger: 'blur' }
              ]">
              <el-input v-model="form.vipPrice"
                        type="number"
                        placeholder="请输入商品的vip价">
                <!-- <template slot="append">元</template> -->
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24"
                  :md="8">
            <el-form-item label="结算价(元)"
                          prop="settledPrice"
                          required
                          :rules="[
                { required: true, message: '结算价不能为空', trigger: 'blur' }
              ]">
              <el-input v-model="form.settledPrice"
                        type="number"
                        placeholder="请输入商品的结算价">
                <!-- <template slot="append">元</template> -->
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24"
                  :md="8">
            <el-form-item label="礼券规则"
                          required>
              <el-input :placeholder="`请输入商品${form.integralType ? '赠送': '抵扣' }的礼券`"
                        v-model.number="form.integral"
                        type="number"
                        class="input-with-select">
                <el-select v-model.number="form.integralType"
                           slot="prepend"
                           placeholder="请选择礼券方式"
                           style="width: 100px">
                  <el-option label="抵扣礼券"
                             :value="0"></el-option>
                  <el-option label="赠送礼券"
                             :value="1"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24"
                  :md="8">
            <el-form-item label="可用库存"
                          prop="saleQty"
                          required
                          :rules="[
                { required: true, message: '可用库存不能为空', trigger: 'blur' }
              ]">
              <el-input v-model="form.stockQty"
                        type="number"
                        placeholder="请输入商品的可用库存">
                <!-- <template slot="append">元</template> -->
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24"
                  :md="8">
            <el-form-item label="使用时间"
                          class=""
                          prop="useTime">
              <el-date-picker class="w-100"
                              v-model="form.useTime"
                              type="datetime"
                              placeholder="选择日期时间"
                              align="right"
                              :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24"
                  :md="12">
            <el-form-item label="套餐">
              <el-input v-model="form.specification"
                        type="textarea"
                        :rows="4"
                        placeholder="json格式">
                <!-- <template slot="append">元</template> -->
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24"
                  :md="12">
            <el-form-item label="注意事项">
              <el-input v-model="form.purchaseNotice"
                        type="textarea"
                        :rows="4"
                        placeholder="请输入注意事项，例如:一次只能消费...">
                <!-- <template slot="append">元</template> -->
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24"
                  :md="12">
            <el-form-item label="商品缩略图"
                          prop="goodsIcon"
                          required
                          :rules="[{ required: true, message: '缩略图不能为空' }]">
              <el-upload class="avatar-uploader"
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
          <el-col :span="24"
                  :md="24">
            <el-form-item label="商品轮播图"
                          prop="goodsBanner"
                          required
                          :rules="[{ required: true, message: '轮播图不能为空' }]">
              <el-upload action="#"
                         list-type="picture-card"
                         :limit="5"
                         :file-list="bannerFileList"
                         :on-preview="handlePictureCardPreview"
                         :on-remove="handleRemoveBanner"
                         :http-request="uploadImg1"
                         :before-upload="beforeAvatarUpload"
                         :data="{ type: 'banner' }">
                <i class="el-icon-plus"></i>
                <div slot="tip"
                     class="el-upload__tip">
                  建议尺寸750*750, 只能上传jpg/png文件，且不超过1M
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <!-- <el-button type="primary"
                     size="default"
                     block
                     @click="submitNextForm"
                     v-loading.fullscreen.lock="fullscreenLoading">{{ isEdit ? '修改' : '查看' }}<i class="el-icon-arrow-right el-icon--right"></i></el-button> -->
          <!-- <el-button type="primary"
                     size="default"
                     block
                     @click="submitNextForm"
                     v-loading.fullscreen.lock="fullscreenLoading">关闭<i class="el-icon-arrow-right el-icon--right"></i></el-button> -->
          <el-button type="primary"
                     size="default"
                     block
                     @click="handlerCheckGoods(2)"
                     v-loading.fullscreen.lock="fullscreenLoading"
                     v-if="form.status == 0">审核，通过<i class="el-icon-check el-icon--right"></i></el-button>
          <el-button type="danger"
                     size="default"
                     block
                     @click="handlerCheckGoods(5)"
                     v-loading.fullscreen.lock="fullscreenLoading"
                     v-if="form.status == 0">审核，拒绝<i class="el-icon-close el-icon--right"></i></el-button>
          <el-button type="success"
                     size="default"
                     block
                     @click="backGoodsList"
                     v-loading.fullscreen.lock="fullscreenLoading">{{ isEdit ? '修改' : '返回，商品列表'
            }}<i class="el-icon-arrow-right el-icon--right"></i></el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { uploadImg } from '@/api/upload'
import Tinymce from '@/components/Tinymce'
import {
  getStreetGoodsCategory,
  updateStreetGoods,
  updateStreetGoodsStatus,
  getStreetGoodsDetail,
  getAppBrandPageList
} from '@/api/goods'
export default {
  data () {
    return {
      // 街市商品表单
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
      // 是否显示大图浏览
      dialogVisible: false,
      // banner图列表
      bannerFileList: [],
      // detailsFileList: [],
      // 浏览大图URL
      dialogImageUrl: '',
      streetGoodsId: '',
      isEdit: '',
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
      this.bannerFileList = []
      const _list = _.split(this.form.bannerImg, ';')
      _.each(_list, v => {
        const _imgObj = {
          name: Math.random(10000),
          url: v
        }
        this.bannerFileList.push(_imgObj)
      })
      this.detailsFileList = []
      const _list1 = _.split(this.form.detailImg, ',')
      _.each(_list1, v => {
        const _imgObj = {
          name: Math.random(10000),
          url: v
        }
        this.detailsFileList.push(_imgObj)
      })
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
          this.getStreetGoodsCategory(nVal, 'two')
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
          this.getStreetGoodsCategory(nVal, 'three')
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
    this.streetGoodsId = this.$route.query.goodsId
    this.isEdit = this.$route.query.isEdit
    // console.log(this.isEdit);
    this.getStreetGoodsCategory(0, 'one')
    this.getStreetGoodsDetail()
  },
  methods: {
    // 获取街市商品详情
    getStreetGoodsDetail () {
      getStreetGoodsDetail({ goodsId: this.streetGoodsId }).then(res => {
        this.form = res.data
        res.data.goodsBanner.split(';').map(item => {
          this.bannerFileList.push({
            url: item
          })
        })
      })
    },
    /** 图片上传之前判断 */
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isJPG) {
        this.$message.error('上传图片只能是JPG、PNG格式!')
      }
      if (!isLt1M) {
        this.$message.error('上传图片大小不能超过1MB!')
      }
      return isJPG && isLt1M
    },
    /** 自定义上传banner图片 */
    uploadImg1 (e) {
      uploadImg(e.file).then(res => {
        if (res.code == 200) {
          const _file = {
            name: e.file.name,
            url: res.data
          }
          this.bannerFileList = _.concat(this.bannerFileList, _file)
        } else {
          this.$msgError('上传图片失败,请重新上传!')
        }
      })
    },
    /** 移除banner图 */
    handleRemoveBanner (file, fileList) {
      _.remove(this.bannerFileList, v => {
        return v.url == file.url
      })
    },
    /** 移除banner图 */
    handleRemoveDetail (file, fileList) {
      _.remove(this.bannerFileList, v => {
        return v.url == file.url
      })
    },
    /** 浏览图片 */
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    /** 获取商品类别 */
    getStreetGoodsCategory (pid, type) {
      getStreetGoodsCategory({
        workId: pid
      }).then(res => {
        if (type == 'one') {
          this.goodsCateOneOptions = res.data
          // this.getStreetGoodsCategory(this.form.primaryCategoryId, 'two')
        }
        if (type == 'two') {
          this.goodsCateTwoOptions = res.data
          // this.getStreetGoodsCategory(this.form.secondaryCategoryId, 'three')
        }
        if (type == 'three') {
          this.goodsCateThreeOptions = res.data
        }
      })
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
    /** 审核通过：2 审核拒接：5 */
    handlerCheckGoods (status) {
      this.$refs['goodsBaseForm'].validate(valid => {
        if (valid) {
          updateStreetGoodsStatus({ ids: [this.form.id], status: status, actCode: this.form.actCode, type: 1 }).then(res => {
            if (status == 2) {
              this.msgSuccess('审核通过')
            }
            if (status == 5) {
              this.msgError('审核拒绝')
            }
            this.backGoodsList()
          })
        }
      })
    },
    /** 返回列表 */
    backGoodsList () {
      if (!this.isEdit) {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.push({ name: 'streetGoodsList' })
      } else {
        // 修改
        this.submitNextForm()
      }
    },
    // 下一步
    submitNextForm () {
      // this.$router.push({
      //   name: 'streetGoodsList',
      // })
      this.$refs['goodsBaseForm'].validate(valid => {
        if (valid) {
          updateStreetGoods(this.form).then(res => {
            this.fullscreenLoading = false
            this.msgSuccess('修改成功')
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
