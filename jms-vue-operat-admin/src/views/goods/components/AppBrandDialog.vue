<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-03 14:20:04
 * @Description  : 品牌管理-弹窗组件
-->
<template>
  <el-dialog
    :title="title"
    :visible="open"
    :width="width"
    append-to-body
    v-el-dialog-drag
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="cancel"
  >
    <el-form
      ref="actBannerForm"
      :model="form"
      label-width="110px"
      label-suffix=":"
    >
      <el-form-item
        label="品牌LOGO"
        prop="brandLogo"
        required
        :rules="[{ required: true, message: '品牌图片不能为空' }]"
      >
        <el-upload
          class="banner-uploader"
          action="#"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :http-request="uploadImg"
        >
          <img v-if="form.brandLogo" :src="form.brandLogo" class="image" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div slot="tip" class="el-upload__tip">
            建议尺寸 400*400, 只能上传jpg/png文件，且不超过1MB
          </div>
        </el-upload>
      </el-form-item>
      <!-- <el-form-item label="品牌编码"
        prop="brandCode"
        required
        :rules="[{ required: true, message: '品牌编码不能为空' }]"
        >
        <el-input
          v-model="form.brandCode"
          placeholder="请输入品牌编码"
          clearable
        ></el-input>
      </el-form-item> -->
      <el-form-item label="品牌名称"
        prop="brandName"
        required
        :rules="[{ required: true, message: '品牌名称不能为空' }]"
        >
        <el-input
          v-model="form.brandName"
          placeholder="请输入品牌名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌介绍"
        prop="brandDesc"
        required
        :rules="[{ required: true, message: '品牌介绍不能为空' }]"
        >
        <el-input
          v-model="form.brandDesc"
          placeholder="请输入品牌介绍"
          clearable
          type="textarea"
          :rows="3"
        ></el-input>
      </el-form-item>
      <el-form-item label="检索首字母"
        prop="firstLatter"
        >
        <el-input
          v-model="form.firstLatter"
          placeholder="请输入检索首字母"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="排序"
        prop="sort"
        >
        <el-input
          v-model="form.sort"
          placeholder="排序: 值越大,越靠前"
          clearable
        ></el-input>
      </el-form-item>

      <!-- <el-form-item
        label="图片位置"
        prop="actType"
        :rules="[
          { required: true, message: '请选择广告图位置', trigger: 'blur' },
        ]"
      >
        <el-select
          v-model="form.actType"
          placeholder="请选择广告图位置"
          filterable
          class="w-100"
          @change="handleChangeImgLoc"
        >
          <el-option
            v-for="(o, i) in Dict.ACT_TYPE"
            :key="i"
            :label="o.value"
            :value="o.key"
          >
          </el-option>
        </el-select>
      </el-form-item> -->

      <!-- <el-form-item
        label="选择父级品牌"
        prop="parentBrandName"
      >
        <el-input
          v-model="form.parentBrandName"
          readonly
          @focus.stop="openGoods = true"
        ></el-input>
      </el-form-item> -->
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" size="mini"
        >{{ isEdit ? '修改' : '添加' }}</el-button
      >
      <el-button @click="cancel" size="mini">取 消</el-button>
    </div>

        <!-- 选择父级品牌弹窗 -->
    <ParentBrandSelectDialog
      v-if="openGoods"
      :key="'goodsSelect_' + tempRowIndex"
      :open="openGoods"
      :multiple="false"
      @cancel="
        openGoods = false;
        tempRowIndex = null;
      "
      @submit="handleGoodsSelect"
    />
  </el-dialog>
</template>
<script>
import { updateAppBrand, addAppBrand } from "@/api/goods";
import { uploadImg } from "@/api/upload";
import ParentBrandSelectDialog from "./ParentBrandSelectDialog";
export default {
  name: "AppBrandDialog",
  components: {
    ParentBrandSelectDialog
  },
  props: {
    // 是否打开
    open: {
      type: Boolean,
      default: false,
    },
    // 是否编辑
    isEdit: {
      type: Boolean,
      default: false,
    },
    // 绑定的表单对象
    form: {
      type: Object,
      default: function () {
        return {
          status: 1
        };
      },
    },
    // 弹窗宽度
    width: {
      type: String,
      default: "505px",
    },
  },
  data() {
    return {
      // 弹窗标题
      title: "",
      // 品牌弹窗
      openGoods: false,
      tempRowIndex: false,
      columnList: [],
    };
  },
  created() {
    if (this.isEdit) {
      this.title = "品牌 - 修改";
      this.form.oldBrandCode = this.form.brandCode;
    } else {
      this.title = "品牌 - 添加";
    }
  },
  methods: {
    /** 图片上传之前判断 */
    beforeAvatarUpload(file) {
      // console.log(file);
      const isJPG = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/webp";
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isJPG) {
        this.$message.error("上传图片只能是JPG、PNG、webp格式!");
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
          this.$set(this.form, "brandLogo", res.data);
        } else {
          this.$msgError("上传图片失败,请重新上传!");
        }
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["actBannerForm"].validate((valid) => {
        if (valid) {
          const _params = _.assign({}, this.form);
          if (this.isEdit) {
            // const _data = this.columnList.filter(item => item.code === this.form.url)
            // _params.urlName = _data.length > 0 ? _data[0].name : ''
            updateAppBrand(_params).then(res => {
              this.msgSuccess("修改成功!");
              this.$emit("submit");
            })
          } else {
            addAppBrand(_params).then((response) => {
              this.msgSuccess("添加成功!");
              this.$emit("submit");
            });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.$emit("cancel");
    },
    /** 父级品牌选择 */
    handleGoodsSelect(row) {
      this.$set(this.form, "parentBrandCode", row.brandCode);
      this.$set(this.form, "parentBrandName", row.brandName);
      this.openGoods = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.banner-uploader {
  /deep/ .el-upload {
    display: block;
    width: 100%;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .image {
    width: 100%;
    height: 150px;
  }
}
</style>