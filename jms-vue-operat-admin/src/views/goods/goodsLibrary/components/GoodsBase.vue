<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-08-14 16:16:26
 * @Description  : 便利店商品基础信息
-->
<template>
  <div class="goods">
    <el-card class="box-card">
      <div slot="header">
        <span>商品基本信息</span>
      </div>
      <el-form
        class="goods-form"
        ref="goodsBaseForm"
        :model="form"
        label-width="110px"
        size="medium"
        label-suffix=":"
      >
        <el-row :gutter="20">
          <el-col :span="24" :md="8">
            <el-form-item label="商品分类" required>
              <el-row>
                <el-col :span="24" :xs="24">
                  <el-select
                    v-model="form.level1CategoryId"
                    placeholder="请选择一级分类"
                    class="w-100"
                  >
                    <el-option
                      v-for="(v, i) in goodsCateOneOptions"
                      :key="i"
                      :label="v.name"
                      :value="v.id"
                    >
                    </el-option>
                  </el-select>
                </el-col>
                <!-- <el-col :span="8" :xs="24">
                  <el-select
                    v-model="form.secondaryCategoryId"
                    placeholder="请选择二级分类"
                    class="w-95"
                  >
                    <el-option
                      v-for="(v, i) in goodsCateTwoOptions"
                      :key="i"
                      :label="v.title"
                      :value="v.id"
                    >
                    </el-option>
                  </el-select>
                </el-col> -->
                <!-- <el-col :span="8" :xs="24">
                  <el-select
                    v-model="form.level3CategoryId"
                    placeholder="请选择三级分类"
                    class="w-95"
                  >
                    <el-option
                      v-for="(v, i) in goodsCateThreeOptions"
                      :key="i"
                      :label="v.title"
                      :value="v.id"
                    >
                    </el-option>
                  </el-select>
                </el-col> -->
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="8">
            <el-form-item
              label="商品名称"
              prop="goodsName"
              required
              :rules="[{ required: true, message: '商品名称不能为空' }]"
            >
              <el-input
                v-model="form.goodsName"
                placeholder="请输入商品的名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24" :md="8">
            <el-form-item
              label="原价(元)"
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
              </el-input>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="24" :md="8">
            <el-form-item
              label="销售价(元)"
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
              </el-input>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="24" :md="8">
            <el-form-item
              label="邮费(元)"
              prop="postage"
              required
              :rules="[
                { required: true, message: '邮费不能为空', trigger: 'blur' },
              ]"
            >
              <el-input
                v-model="form.postage"
                type="number"
                placeholder="请输入商品的邮费"
              >
              </el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="24" :md="8">
            <el-form-item label="商品编号" prop="goodsNo">
              <el-input
                v-model="form.goodsNo"
                placeholder="请输入商品编号"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24" :md="8">
            <el-form-item label="商品库存" prop="stockQty">
              <el-input
                v-model="form.stockQty"
                placeholder="请输入商品库存"
              ></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="24" :md="8">
            <el-form-item
              label="商品描述"
              prop="goodsDesc"
              required
              :rules="[{ required: true, message: '商品描述不能为空' }]"
            >
              <el-input
                maxlength="200"
                type="textarea"
                :rows="1"
                v-model="form.goodsDesc"
                placeholder="请输入商品商品描述"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="商品缩略图"
              prop="goodsIcon"
              required
              :rules="[{ required: true, message: '缩略图不能为空' }]"
            >
              <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :http-request="uploadImg"
              >
                <img
                  v-if="form.goodsIcon"
                  :src="form.goodsIcon"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">
                  建议尺寸400*400, 只能上传jpg/png文件，且不超过500kb
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="24">
            <el-form-item
              label="商品轮播图"
              prop="goodsBanner"
              required
              :rules="[{ required: true, message: '轮播图不能为空' }]"
            >
              <el-upload
                action="#"
                list-type="picture-card"
                :limit="5"
                :file-list="bannerFileList"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemoveBanner"
                :http-request="uploadBannerImg"
                :before-upload="beforeAvatarUpload"
                :data="{ type: 'banner' }"
              >
                <i class="el-icon-plus"></i>
                <div slot="tip" class="el-upload__tip">
                  建议尺寸750*750, 只能上传jpg/png文件，且不超过1M
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button
            type="primary"
            size="default"
            block
            v-if="look"
            @click="lookNextForm"
            v-loading.fullscreen.lock="fullscreenLoading"
            >查看, 下一步<i class="el-icon-arrow-right el-icon--right"></i
          ></el-button>
          <el-button
            type="primary"
            size="default"
            block
            v-if="!look"
            @click="submitNextForm"
            v-loading.fullscreen.lock="fullscreenLoading"
            >保存，下一步<i class="el-icon-arrow-right el-icon--right"></i
          ></el-button>
        </el-form-item>
      </el-form>
      <el-dialog :visible.sync="dialogVisible" title="大图">
        <img width="100%" :src="dialogImageUrl" />
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import { uploadImg } from "@/api/upload";
import {
  storeGoodsBaseCateGory,
  storeGoodsBaseAdd,
  storeGoodsBaseUpdate,
} from "@/api/goods";
export default {
  props: {
    // 是否修改
    isEdit: {
      type: Boolean,
      default: false,
    },
    look: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      // 基础商品表单
      form: _.assign({}, this.value),
      // 商品分类 1 2 3 级
      goodsCateOneOptions: [],
      // goodsCateTwoOptions: [],
      // goodsCateThreeOptions: [],
      // 加载层
      fullscreenLoading: false,
      bannerFileList: [],
      dialogImageUrl: "",
      dialogVisible: false,
    };
  },
  watch: {
    // 监听异步获取表单信息赋值
    value: function (nVal, oVal) {
      this.form = nVal;
      console.log(this.form);
      // if (this.isEdit) {
      this.bannerFileList = [];
      const _list = _.split(this.form.goodsBanner, ",");
      _.each(_list, (v) => {
        const _imgObj = {
          name: Math.random(10000),
          url: v,
        };
        this.bannerFileList.push(_imgObj);
      });
      // }
    },
    // 一级分类监听
    "form.level1CategoryId": {
      handler: function (nVal, oVal) {
        if (nVal) {
          this.$set(this.form, "level1CategoryId", nVal);
          if (_.size(this.goodsCateOneOptions) > 0) {
            this.$set(
              this.form,
              "level1CategoryName",
              _.get(
                _.find(this.goodsCateOneOptions, (v) => {
                  return v.id == nVal;
                }),
                "name"
              )
            );
          }
          this.getGoodsCateList(nVal, "two");
        }
      },
      deep: true,
    },
  },
  created() {
    this.getGoodsCateList(0, "one");
  },
  methods: {
    //获取商品类别
    getGoodsCateList(pid, type) {
      storeGoodsBaseCateGory({}).then((res) => {
        this.goodsCateOneOptions = res.data;
      });
    },
    /** 图片上传之前判断 */
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isJPG) {
        this.$message.error("上传图片只能是JPG、PNG格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过1MB!");
      }
      return isJPG && isLt2M;
    },
    /** 自定义上传图片 */
    uploadImg(e) {
      uploadImg(e.file).then((res) => {
        if (res.code == 200) {
          this.$set(this.form, "goodsIcon", res.data);
        } else {
          this.$msgError("上传图片失败,请重新上传!");
        }
      });
    },
    /** 自定义上传banner图片 */
    uploadBannerImg(e) {
      uploadImg(e.file).then((res) => {
        if (res.code == 200) {
          const _file = {
            name: e.file.name,
            url: res.data,
          };
          this.bannerFileList = _.concat(this.bannerFileList, _file);
        } else {
          this.$msgError("上传图片失败,请重新上传!");
        }
      });
    },
    /** 移除banner图 */
    handleRemoveBanner(file, fileList) {
      _.remove(this.bannerFileList, (v) => {
        return v.url == file.url;
      });
    },
    /** 浏览图片 */
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 查看 下一步
    lookNextForm() {
      this.$emit("setValue", this.form);
      this.$emit("steps", "GOODS_SKU");
    },
    // 下一步
    submitNextForm() {
      console.log(this.form);
      // this.$emit("steps", "GOODS_INFO");
      // TODO 如以后运营后台可以更改数据打开
      // // 组装提交数据对象
      this.form.goodsBanner = [];
      _.map(this.bannerFileList, (v, i) => {
        this.form.goodsBanner += v.url;
        if (i !== this.bannerFileList.length - 1) {
          this.form.goodsBanner += ",";
        }
      });
      this.$refs["goodsBaseForm"].validate((valid) => {
        if (valid) {
          this.fullscreenLoading = true;
          if (this.form.id == undefined) {
            // 新增
            storeGoodsBaseAdd(this.form).then((res) => {
              this.fullscreenLoading = false;
              this.$set(this.form, "id", res.data);
              this.$emit("setValue", this.form);
              this.$emit("steps", "GOODS_SKU");
            });
          } else {
            // 修改
            storeGoodsBaseUpdate(this.form).then((res) => {
              this.fullscreenLoading = false;
              this.$emit("setValue", this.form);
              this.$emit("steps", "GOODS_SKU");
            });
          }
          setTimeout(() => {
            this.fullscreenLoading = false;
          }, 2000);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>