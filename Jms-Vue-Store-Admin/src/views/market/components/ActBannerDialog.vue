<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-03 14:20:04
 * @Description  : 广告图-弹窗组件
-->
<template>
  <el-dialog
    title="添加广告图"
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
      label-width="90px"
      label-suffix=":"
    >
      <el-form-item
        label="广告图"
        prop="image"
        required
        :rules="[{ required: true, message: '缩略图不能为空' }]"
      >
        <el-upload
          class="banner-uploader"
          action="#"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :http-request="uploadImg"
        >
          <img v-if="form.image" :src="form.image" class="image" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div slot="tip" class="el-upload__tip">
            建议尺寸 700*280, 只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="背景色值">
        <el-input
          v-model="form.topBarColor"
          placeholder="请输入顶部导航栏背景色（如：#FFFFFF）"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item
        label="图片位置"
        prop="actCode"
        :rules="[
          { required: true, message: '请选择广告图位置', trigger: 'blur' },
        ]"
      >
        <el-select
          v-model="form.actCode"
          placeholder="请选择广告图位置"
          filterable
          class="w-100"
          @change="handleChangeImgLoc"
        >
          <el-option
            v-for="(o, i) in bannerLocList"
            :key="i"
            :label="o.name"
            :value="o.code"
          >
          </el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item
        label="链接类型"
        prop="urlType"
        :rules="[
          { required: true, message: '请选择链接类型', trigger: 'blur' },
        ]"
      >
        <el-select
          v-model="form.urlType"
          placeholder="请选择链接类型"
          filterable
          class="w-100"
          @change="handleChangeUrlType"
        >
          <el-option
            v-for="(o, i) in Dict.URL_TYPE"
            :key="i"
            :label="o.value"
            :value="o.key"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="选择商品"
        prop="url"
        required
        v-if="form.urlType == 1"
      >
        <el-input
          v-model="form.goodsName"
          readonly
          @focus.stop="openGoods = true"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="链接地址"
        prop="url"
        required
        v-if="form.urlType == 3"
      >
        <el-input v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item
        label="活动栏目"
        v-if="form.urlType == 4"
        prop="url"
        required
      >
        <el-select
          v-model="form.url"
          placeholder="请选择活动栏目"
          filterable
          class="w-100"
        >
          <el-option
            v-for="(o, i) in columnList"
            :key="i"
            :label="o.actName"
            :value="o.actCode"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" size="mini"
        >添 加</el-button
      >
      <el-button @click="cancel" size="mini">取 消</el-button>
    </div>

    <!-- 选择活动商品弹窗 -->
    <GoodsSelectDialog
      v-if="openGoods"
      :key="'goodsSelect_' + tempRowIndex"
      :open="openGoods"
      type="goods"
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
import {
  addActAdvertise,
  getActStorePackColumnList,
  getActCommonAllList,
} from "@/api/goods";
import { uploadImg } from "@/api/upload";
import { mapGetters } from "vuex";
import GoodsSelectDialog from "../components/GoodsSelectDialog";

export default {
  name: "StoreDialog",
  props: {
    // 是否打开
    open: {
      type: Boolean,
      default: false,
    },
    // 绑定的表单对象
    form: {
      type: Object,
      default: function () {
        return {};
      },
    },
    // 弹窗宽度
    width: {
      type: String,
      default: "505px",
    },
  },
  components: {
    GoodsSelectDialog,
  },
  data() {
    return {
      // 弹窗标题
      title: "",
      // 商品弹窗
      openGoods: false,
      tempRowIndex: false,
      bannerLocList: [],
      columnList: [],
    };
  },
  computed: {
    ...mapGetters(["store"]),
  },
  created() {
    this.getActCommonAllList();
    this.getActStorePackColumnList();
  },
  methods: {
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
          this.$set(this.form, "image", res.data);
        } else {
          this.$msgError("上传图片失败,请重新上传!");
        }
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["actBannerForm"].validate((valid) => {
        if (valid) {
          const _params = _.assign(this.form, {
            storeId: this.store.id,
            storeName: this.store.storeName,
          });
          // 判断如果是进店逛逛
          if (_params.urlType == 2) _params.url = this.store.id;
          addActAdvertise(_params).then((response) => {
            this.msgSuccess("添加成功!");
            this.$emit("submit");
          });
        }
      });
    },
    // 取消按钮
    cancel() {
      this.$emit("cancel");
    },
    /** 商品选择 */
    handleGoodsSelect(row) {
      this.$set(this.form, "url", row.id);
      this.$set(this.form, "goodsName", row.goodsName);
      this.openGoods = false;
    },
    /** 获取商家参与的活动栏目列表 */
    getActStorePackColumnList() {
      getActStorePackColumnList({ storeId: this.store.id }).then((res) => {
        this.columnList = res.data;
      });
    },
    /** 获取获取栏目广告图位置 */
    getActCommonAllList() {
      getActCommonAllList({ actType: 0 }).then((res) => {
        this.bannerLocList = res.data;
      });
    },
    /** 链接类型切换 */
    handleChangeUrlType(value) {
      this.$set(this.form, "url", null);
    },
    /** 图片位置切换 */
    handleChangeImgLoc(value) {
      this.$set(
        this.form,
        "actName",
        this.bannerLocList
          .filter((v) => v.code == value)
          .map((v) => v.name)
          .toString()
      );
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