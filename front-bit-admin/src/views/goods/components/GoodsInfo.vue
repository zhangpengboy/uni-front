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
          <!-- <el-col :span="24" :md="24">
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
          </el-col> -->

          <el-col :span="24" :md="24">
            <el-form-item
              label="产品说明"
              prop="detail"
              required
              :rules="[{ required: true, message: '请添加产品说明' }]"
            >
              <Tinymce ref="editor" v-model="form.detail" :height="200" />
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="24">
            <el-form-item
              label="风险提示"
              prop="warning"
              required
              :rules="[{ required: true, message: '请添加风险提示' }]"
            >
              <Tinymce ref="editor" v-model="form.warning" :height="200" />
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
            >提交，下一步<i class="el-icon-arrow-right el-icon--right"></i
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
import { uploadImg } from "@/api/commom";
import { addUpdateGoodsDetail } from "@/api/goods";
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
    /** 自定义上传图片 */
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
    /** 下一步 */
    submitNextForm() {
      // 组装提交数据对象
      // this.form.bannerImg = [];
      // _.map(this.bannerFileList, (v, i) => {
      //   this.form.bannerImg += v.url;
      //   if (i !== this.bannerFileList.length - 1) {
      //     this.form.bannerImg += ";";
      //   }
      // });
      // 产品说明
      console.log(this.goodsBase.productNo);
      this.form = _.assign(this.form, {
        productNo: this.goodsBase.productNo,
      });
      this.fullscreenLoading = true;
      if (this.form.id == undefined) {
        // 新增
        addUpdateGoodsDetail(this.form).then((res) => {
          this.fullscreenLoading = false;
          this.$set(this.form, "id", res.data);
          this.$emit("setValue", this.form);
          this.$emit("steps", "GOODS_SKU");
        });
      } else {
        delete this.form.createTime;
        // 修改
        addUpdateGoodsDetail(this.form).then((res) => {
          this.fullscreenLoading = false;
          this.$emit("setValue", this.form);
          this.$emit("steps", "GOODS_SKU");
        });
      }
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 2000);
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