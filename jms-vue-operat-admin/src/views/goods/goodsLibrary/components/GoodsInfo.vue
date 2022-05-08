<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-05 16:16:26
 * @Description  : 商品详情信息
-->
<template>
  <div class="goods">
    <el-card class="box-card">
      <div slot="header">
        <span>商品详情信息</span>
      </div>
      <el-form
        class="goods-form"
        ref="goodsInfoForm"
        :model="form"
        label-width="110px"
        size="medium"
        label-suffix=":"
      >
        <el-row :gutter="20">
          <el-col :span="24" :md="24">
            <el-form-item
              label="商品标签"
              prop="goodsLabel"
              required
              :rules="[{ required: true, message: '商品标签不能为空' }]"
            >
              <el-input
                type="textarea"
                :rows="5"
                v-model="form.goodsLabel"
                placeholder="请输入商品商品标签"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24" :md="24">
            <el-form-item
              label="商品轮播图"
              prop="bannerImg"
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
                :http-request="uploadImg"
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

          <!-- <el-col :span="24" :md="24">
            <el-form-item
              label="商品详情图"
              prop="detailImg"
              required
              :rules="[{ required: true, message: '请添加详情图' }]"
            >
              <Tinymce ref="editor" v-model="form.detailImg" :height="400" />
            </el-form-item>
          </el-col> -->
          <el-col :span="24" :md="24">
            <el-form-item
              label="商品详情图"
              prop="detailImg"
              required
              :rules="[{ required: true, message: '请添加详情图' }]"
            >
              <el-upload
                action="#"
                list-type="picture-card"
                :limit="5"
                :file-list="detailsFileList"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemoveDetail"
                :http-request="uploadImgDetail"
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
            type="info"
            size="default"
            block
            @click="backPrefixForm"
            icon="el-icon-arrow-left el-icon--left"
            >返回，上一步</el-button
          >
          <el-button
            type="primary"
            size="default"
            block
            @click="submitNextForm"
            v-loading.fullscreen.lock="fullscreenLoading"
            >查看，下一步<i class="el-icon-arrow-right el-icon--right"></i
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
import Tinymce from "@/components/Tinymce";
import { uploadImg } from "@/api/upload";
import { addGoodsDetail, updateGoodsDetail } from "@/api/goods";
export default {
  name: "GoodsInfoForm",
  props: {
    // 是否修改
    isEdit: {
      type: Boolean,
      default: false,
    },
    // 商品详情对象
    value: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 商品基础信息
    goodsBase: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: { Tinymce },
  data() {
    return {
      // 基础商品表单
      form: _.assign({}, this.value),
      // 加载层
      fullscreenLoading: false,
      // 是否显示大图浏览
      dialogVisible: false,
      // banner图列表
      bannerFileList: [],
      detailsFileList: [],
      // 浏览大图URL
      dialogImageUrl: "",
    };
  },
  watch: {
    // 监听异步获取表单信息赋值
    value: function (nVal, oVal) {
      this.form = nVal;
      if (this.isEdit) {
        this.bannerFileList = [];
        const _list = _.split(this.form.bannerImg, ";");
        _.each(_list, (v) => {
          const _imgObj = {
            name: Math.random(10000),
            url: v,
          };
          this.bannerFileList.push(_imgObj);
        });
        this.detailsFileList = [];
        const _list1 = _.split(this.form.detailImg, ",");
        _.each(_list1, (v) => {
          const _imgObj = {
            name: Math.random(10000),
            url: v,
          };
          this.detailsFileList.push(_imgObj);
        });
      }
    },
  },
  methods: {
    /** 图片上传之前判断 */
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isJPG) {
        this.$message.error("上传图片只能是JPG、PNG格式!");
      }
      if (!isLt1M) {
        this.$message.error("上传图片大小不能超过1MB!");
      }
      return isJPG && isLt1M;
    },
    /** 自定义上传banner图片 */
    uploadImg(e) {
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
    /** 自定义上传详情图图片 */
    uploadImgDetail(e) {
      uploadImg(e.file).then((res) => {
        if (res.code == 200) {
          const _file = {
            name: e.file.name,
            url: res.data,
          };
          this.detailsFileList = _.concat(this.detailsFileList, _file);
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
    /** 移除banner图 */
    handleRemoveDetail(file, fileList) {
      _.remove(this.bannerFileList, (v) => {
        return v.url == file.url;
      });
    },
    /** 浏览图片 */
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    /** 下一步 */
    submitNextForm() {
      this.$emit("steps", "GOODS_SKU");
      // TODO 如以后运营后台可以更改数据打开
      // // 组装提交数据对象
      // this.form.bannerImg = [];
      // _.map(this.bannerFileList, (v, i) => {
      //   this.form.bannerImg += v.url;
      //   if (i !== this.bannerFileList.length - 1) {
      //     this.form.bannerImg += ";";
      //   }
      // });
      // this.form = _.assign(this.form, {
      //   goodsId: this.goodsBase.id,
      //   goodsName: this.goodsBase.goodsName,
      // });
      // this.fullscreenLoading = true;
      // if (this.form.id == undefined) {
      //   // 新增
      //   addGoodsDetail(this.form).then((res) => {
      //     this.fullscreenLoading = false;
      //     this.$set(this.form, "id", res.data);
      //     this.$emit("setValue", this.form);
      //     this.$emit("steps", "GOODS_SKU");
      //   });
      // } else {
      //   // 修改
      //   updateGoodsDetail(this.form).then((res) => {
      //     this.fullscreenLoading = false;
      //     this.$emit("setValue", this.form);
      //     this.$emit("steps", "GOODS_SKU");
      //   });
      // }
      // setTimeout(() => {
      //   this.fullscreenLoading = false;
      // }, 2000);
    },
    // 上一步
    backPrefixForm() {
      this.$emit("steps", "GOODS_BASE");
    },
  },
};
</script>
<style lang="scss" scoped>
</style>