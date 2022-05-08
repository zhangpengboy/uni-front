<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-05 16:16:26
 * @Description  : 商品基础信息
-->
<template>
  <div class="goods">
    <el-card class="box-card">
      <div slot="header">
        <span>产品基本信息</span>
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
          <el-col :span="24" :md="12" :lg="8">
            <el-form-item
              label="产品名称"
              prop="productName"
              required
              :rules="[{ required: true, message: '产品名称不能为空' }]"
            >
              <el-input
                v-model="form.productName"
                placeholder="请输入产品的名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="12" :lg="8">
            <el-form-item
              label="矿机类型"
              prop="machineType"
              required
              :rules="[{ required: true, message: '矿机类型不能为空' }]"
            >
              <el-select
                v-model="form.machineType"
                placeholder="矿机类型"
                clearable
                class="w-100"
                @change="handleChangeBitType"
              >
                <el-option
                  v-for="(item, index) in bitTypeList"
                  :key="index"
                  :label="item.machineTypeDes"
                  :value="item.machineType"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="12" :lg="8">
            <el-form-item
              label="总数量"
              prop="allNum"
              required
              :rules="[
                { required: true, message: '总数量不能为空' },
                { type: 'number', message: '价格必须为数字' },
              ]"
            >
              <el-input
                type="number"
                v-model.number="form.allNum"
                placeholder="请输入产品总数量"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24" :md="12" :lg="8">
            <el-form-item
              label="可售数量"
              prop="num"
              required
              :rules="[
                { required: true, message: '可售数量不能为空' },
                { type: 'number', message: '价格必须为数字' },
              ]"
            >
              <el-input
                type="number"
                v-model.number="form.num"
                placeholder="请输入产品剩余总数量"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="12" :lg="8">
            <el-form-item
              label="算力"
              prop="hash"
              required
              :rules="[
                { required: true, message: '算力不能为空' },
                { type: 'number', message: '价格必须为数字' },
              ]"
            >
              <el-input
                type="number"
                v-model.number="form.hash"
                placeholder="请输入算力大小"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="12" :lg="8">
            <el-form-item
              label="算力单位"
              prop="hashUnit"
              required
              :rules="[{ required: true, message: '算力单位不能为空' }]"
            >
              <el-input
                v-model="form.hashUnit"
                placeholder="请输入算力单位"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24" :md="12" :lg="8">
            <el-form-item
              label="功耗"
              prop="power"
              required
              :rules="[
                { required: true, message: '功耗不能为空' },
                { type: 'number', message: '价格必须为数字' },
              ]"
            >
              <el-input
                type="number"
                v-model.number="form.power"
                placeholder="请输入功耗"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="12" :lg="8">
            <el-form-item
              label="功耗单位"
              prop="powerUnit"
              required
              :rules="[{ required: true, message: '功耗单位不能为空' }]"
            >
              <el-input
                v-model="form.powerUnit"
                placeholder="请输入功耗单位"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="12" :lg="8">
            <el-form-item
              label="管理费"
              prop="serivceReate"
              required
              :rules="[
                { required: true, message: '管理费不能为空' },
                { type: 'number', message: '价格必须为数字' },
              ]"
            >
              <el-input
                v-model.number="form.serivceReate"
                type="number"
                placeholder="请输入管理费"
              >
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24" :md="12" :lg="8">
            <el-form-item
              label="回报率"
              prop="expectRate"
              required
              :rules="[
                { required: true, message: '预计回报率不能为空' },
                { type: 'number', message: '价格必须为数字' },
              ]"
            >
              <el-input
                v-model.number="form.expectRate"
                type="number"
                placeholder="请输入预计回报率"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="12" :lg="8">
            <el-form-item
              label="矿机价"
              prop="price"
              required
              :rules="[
                { required: true, message: '矿机价不能为空' },
                { type: 'number', message: '价格必须为数字' },
              ]"
            >
              <el-input
                v-model.number="form.price"
                type="number"
                placeholder="请输入矿机的价格"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="12" :lg="8">
            <el-form-item
              label="电费单价"
              prop="powerPrice"
              required
              :rules="[
                { required: true, message: '电费单价不能为空' },
                { type: 'number', message: '价格必须为数字' },
              ]"
            >
              <el-input
                v-model.number="form.powerPrice"
                type="number"
                placeholder="1为默认电费,0为免电费"
              >
              </el-input>
            </el-form-item>
          </el-col>

          <!-- <el-col :span="24" :md="12" :lg="8">
            <el-form-item
              label="日收益"
              prop="dayUsdt"
              required
              :rules="[
                { required: true, message: '预计日收益不能为空' },
                { type: 'number', message: '价格必须为数字' },
              ]"
            >
              <el-input
                v-model.number="form.dayUsdt"
                type="number"
                placeholder="请输入预计日收益(UDST)"
              >
                <template slot="append">USDT</template>
              </el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="24" :md="12" :lg="8">
            <el-form-item
              label="上架时间"
              prop="prepareTime"
              required
              :rules="[
                { required: true, message: '上架准备时间不能为空' },
                { type: 'number', message: '价格必须为数字' },
              ]"
            >
              <el-input
                v-model.number="form.prepareTime"
                type="number"
                placeholder="请输入上架准备时间（天）"
              >
                <template slot="append">天</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="12" :lg="8">
            <el-form-item
              label="服务周期"
              prop="serviceTime"
              required
              :rules="[{ required: true, message: '服务周期不能为空' }]"
            >
              <el-input
                v-model.number="form.serviceTime"
                placeholder="请输入服务周期（-1表示永久）"
              >
                <template slot="append">天</template>
              </el-input>
            </el-form-item>
          </el-col>
          
          <el-col :span="24" :md="12" :lg="8">
            <el-form-item
              label="商品缩略图"
              prop="img"
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
                <img v-if="form.img" :src="form.img" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">
                  建议尺寸268*388, 只能上传jpg/png文件，且不超过500kb
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
            @click="submitNextForm"
            v-loading.fullscreen.lock="fullscreenLoading"
            >提交，下一步<i class="el-icon-arrow-right el-icon--right"></i
          ></el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { uploadImg } from "@/api/upload";
import { addUpdateGoodsBase } from "@/api/goods";
import { getBitTypeList } from "@/api/system";
export default {
  props: {
    // 是否修改
    isEdit: {
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
      // 加载层
      fullscreenLoading: false,
      bitTypeList: [],
      bitUsdtList: [],
    };
  },
  watch: {
    // 监听异步获取表单信息赋值
    value: function (nVal, oVal) {
      this.form = nVal;
    },
  },
  created() {
    // 获取挖矿类型列表
    getBitTypeList({ status: 1 }).then((res) => {
      this.bitTypeList = res.data;
    });
  },
  methods: {
    /** 矿机类型选择 */
    handleChangeBitType(val) {
      const _type = _.find(this.bitTypeList, (v) => v.machineType == val);
      this.form.digType = _type.digType; // 挖矿类型
      this.form.bitType = _type.bitType; // 产出类型
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
          this.$set(this.form, "img", res.data);
        } else {
          this.$msgError("上传图片失败,请重新上传!");
        }
      });
    },
    // 下一步
    submitNextForm() {
      this.$refs["goodsBaseForm"].validate((valid) => {
        if (valid) {
          this.fullscreenLoading = true;
          if (this.form.id == undefined) {
            // 新增
            addUpdateGoodsBase(this.form).then((res) => {
              this.fullscreenLoading = false;
              this.$set(this.form, "productNo", res.data);
              this.$emit("setValue", this.form);
              this.$emit("steps", "GOODS_INFO");
            });
          } else {
            // 修改
            delete this.form.createTime;
            addUpdateGoodsBase(this.form).then((res) => {
              this.fullscreenLoading = false;
              this.$emit("setValue", this.form);
              this.$emit("steps", "GOODS_INFO");
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