<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-03 14:20:04
 * @Description  : 广告图-弹窗组件
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
      label-width="90px"
      label-suffix=":"
      :rules="rules"
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
      <el-form-item label="背景色值"
        prop="topBarColor"
        >
        <el-input
          v-model="form.topBarColor"
          placeholder="请输入顶部导航栏背景色（如：#FFFFFF）"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item
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
      </el-form-item>
      <el-form-item
        label="活动模块"
        prop="actCode"
        :rules="[
          { required: true, message: '请选择参与的活动模块', trigger: 'blur' },
        ]"
      >
        <el-select
          v-model="form.actCode"
          placeholder="请选择参与的活动模块"
          filterable
          class="w-100"
          @change="handleChangeImgAct"
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
        label="活动类型"
        prop="type"
        :rules="[
          { required: true, message: '请选择参与的活动类型', trigger: 'blur' },
        ]"
      >
        <el-select
          v-model="form.type"
          placeholder="请选择参与的活动类型"
          filterable
          class="w-100"
        >
          <el-option
            label="顶部轮播广告图"
            :value="1"
          >
          </el-option>
          <el-option
            label="活动区广告图"
            :value="2"
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
          v-model="form.url"
          readonly
          @focus.stop="openGoods = true"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="选择店铺"
        prop="url"
        required
        v-if="form.urlType == 2"
      >
        <el-input
          v-model="form.url"
          readonly
          @focus.stop="openStore = true"
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
            :label="o.name"
            :value="o.code"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" size="mini"
        >{{ isEdit ? '修改' : '添加' }}</el-button
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
    <!-- 选择活动店铺弹窗 -->
    <StoreSelectDialog
      v-if="openStore"
      :key="'stroeSelect_' + tempRowIndex"
      :open="openStore"
      :multiple="false"
      @cancel="
        openStore = false;
        tempRowIndex = null;
      "
      @submit="handleStoreSelect"
    />
  </el-dialog>
</template>
<script>
import { addActAdvertise, getActCommonAllList, updateActAdvertise } from "@/api/goods";
import { uploadImg } from "@/api/upload";
import GoodsSelectDialog from "../components/GoodsSelectDialog";
import StoreSelectDialog from "../components/StoreSelectDialog";

export default {
  name: "ActBannerDialog",
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
    StoreSelectDialog
  },
  data() {
    let validatePass = (rule, value, callback) => {
      if (value) {
        if (!/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(value)) {
          return callback(new Error('请输入正确的颜色值'));
        } else {
          return callback()
        }
      }else {
        return callback()
      }
    }
    return {
      // 弹窗标题
      title: "",
      // 商品弹窗
      openGoods: false,
      openStore: false, // 店铺弹框
      tempRowIndex: false,
      bannerLocList: [],
      columnList: [],
      rules: {
        topBarColor:[
          { validator: validatePass, trigger: 'blur' },
        ]
      }
    };
  },
  created() {
    this.getActCommonAllList(-1);
    if (this.isEdit) {
      this.title = "广告图-修改";
    } else {
      this.title = "广告图 - 添加";
    }
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
          const _params = _.assign({}, this.form);
          if (this.isEdit) {
            // console.log('修改未做');
            // console.log(this.columnList.filter(item => item.code === this.form.url))
            const _data = this.columnList.filter(item => item.code === this.form.url)
            _params.urlName = _data.length > 0 ? _data[0].name : ''
            updateActAdvertise(_params).then(res => {
              this.msgSuccess("修改成功!");
              this.$emit("submit");
            })
          } else {
            addActAdvertise(_params).then((response) => {
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
    /** 商品选择 */
    handleGoodsSelect(row) {
      this.$set(this.form, "url", row.id);
      this.$set(this.form, "goodsName", row.goodsName);
      this.openGoods = false;
    },
    /** 商户选择 */
    handleStoreSelect(row) {
      this.$set(this.form, "url", row.id);
      this.$set(this.form, "storeName", row.storeName);
      this.openStore = false;
    },
    /** 获取栏目广告图位置 */
    getActCommonAllList(actType) {
      getActCommonAllList({ actType }).then((res) => {
        this.bannerLocList = res.data;
        if (actType == -1) {
          this.columnList = res.data.filter(item => item.actType != 1);
        }
      });
    },
    /** 链接类型切换 */
    handleChangeUrlType(value) {
      this.$set(this.form, "url", null);
    },
    /** 图片位置切换 */
    handleChangeImgLoc(value) {
      // 获取活动栏目列表
      this.getActCommonAllList(value);
      this.form.actCode = null;
    },
    /** 活动模块切换 */
    handleChangeImgAct(value) {
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