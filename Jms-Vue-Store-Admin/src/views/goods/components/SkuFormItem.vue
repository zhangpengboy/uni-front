<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-09 19:13:25
 * @Description  : SKU 套餐组件
-->
<template>
  <el-form
    class="goods-form form-header"
    :ref="'goodsSkuForm_' + skuKey"
    :model="skuItem"
    label-width="110px"
    size="medium"
    label-suffix=":"
  >
    <el-row :gutter="20">
      <el-col :span="24" :md="8">
        <el-form-item
          label="套餐名称"
          prop="skuName"
          required
          :rules="[{ required: true, message: '套餐名称不能为空' }]"
        >
          <el-input
            :disabled="look"
            v-model="skuItem.skuName"
            placeholder="请输入套餐名称"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" :md="8">
        <el-form-item
          label="库存数量"
          prop="amount"
          required
          :rules="[{ required: true, message: '库存数量不能为空' }]"
        >
          <el-input
            @keyup.native="keyup($event)"
            :disabled="look"
            type="number"
            v-model.number="skuItem.amount"
            placeholder="请输入库存数量"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" :md="8">
        <el-form-item
          label="原价"
          prop="marketPrice"
          required
          :rules="[
            { required: true, message: '原价不能为空', trigger: 'blur' },
          ]"
        >
          <el-input
            :disabled="look"
            v-model="skuItem.marketPrice"
            type="number"
            placeholder="请输入商品的原价"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- <el-col :span="24" :md="24"> -->
    <el-row :gutter="20">
      <el-col :span="24" :md="8">
        <el-form-item
          label="销售价"
          prop="salePrice"
          required
          :rules="[
            { required: true, message: '销售价不能为空', trigger: 'blur' },
          ]"
        >
          <el-input
            :disabled="look"
            v-model="skuItem.salePrice"
            type="number"
            placeholder="请输入商品的销售价"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" :md="8">
        <el-form-item
          label="限购数量"
          prop="quota"
          required
          :rules="[
            { required: true, message: '限购数量不能为空', trigger: 'blur' },
          ]"
        >
          <el-input
            @keyup.native="keyup($event)"
            :disabled="look"
            type="number"
            v-model.number="skuItem.quota"
            placeholder="请输入商品的限购数量"
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" :md="8">
        <el-form-item label="礼券规则" required>
          <el-input
            :disabled="look"
            :placeholder="`请输入商品${
              skuItem.integralType ? '赠送' : '抵扣'
            }的礼券`"
            v-model="skuItem.integral"
            type="number"
            class="input-with-select"
            onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
          >
            <el-select
              v-model="skuItem.integralType"
              slot="prepend"
              placeholder="请选择礼券方式"
              style="width: 105px"
            >
              <el-option label="抵扣礼券" :value="0"></el-option>
              <el-option label="赠送礼券" :value="1"></el-option>
            </el-select>
            <!-- <el-button slot="append">礼券</el-button> -->
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <!-- </el-col> -->
      <!-- <el-col :span="24" :md="8">
        <el-form-item
          label="佣金(元)"
          prop="rewardPrice"
          required
          :rules="[
            { required: true, message: '佣金不能为空', trigger: 'blur' }
          ]"
        >
          <el-input
            v-model="skuItem.rewardPrice"
            type="number"
            placeholder="请输入商品的佣金"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
      </el-col> -->
      <el-col :span="24" :md="8">
        <el-form-item
          label="vip价(元)"
          prop="vipPrice"
          required
          :rules="[{ required: true, message: '商品vip价不能为空' }]"
        >
          <el-input
            :disabled="look"
            type="number"
            v-model="skuItem.vipPrice"
            placeholder="请输入商品的vip价"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" :md="7">
        <el-form-item
          label="商品缩略图"
          prop="skuImg"
          required
          :rules="[{ required: true, message: '缩略图不能为空' }]"
        >
          <el-upload
            :disabled="look"
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="uploadImg"
          >
            <img v-if="skuItem.skuImg" :src="skuItem.skuImg" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              建议尺寸400*400, 只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-col>
      <el-col :span="24" :offset="0">
        <el-form-item>
          <el-button
            :disabled="look"
            type="success"
            size="small"
            block
            @click="addSku"
            >新增套餐</el-button
          >
          <el-button
            :disabled="look"
            type="danger"
            size="small"
            block
            @click="delSku"
            v-if="skuKey > 0"
            >删除套餐</el-button
          >
          <!-- <el-radio-group style="margin-left: 30px" @change='skuChange' v-model="skuItem.checked"> -->
          <el-checkbox
            style="margin-left: 30px"
            @change="skuChange"
            v-model="ischecked"
            :label="skuItem.checked"
            :disabled="disabled"
            >选择当前套餐为主sku</el-checkbox
          >
          <!-- </el-radio-group> -->
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import { uploadImg } from "@/api/upload";
export default {
  props: {
    // SKU 套餐信息
    skuItem: {
      type: Object,
      default: () => {
        return {
          ss: true,
        };
      },
    },
    look: {
      type: Boolean,
      default: false,
    },
    // 当前表单Key
    skuKey: Number,
    disabled: Boolean,
  },
  data() {
    return {
      ischecked: false,
    };
  },
  methods: {
    keyup(e) {
      var keyNum = window.event ? e.keyCode : e.which;
      var keyChar = String.fromCharCode(keyNum);
      if (keyNum == 189 || keyNum == 190 || keyNum == 110 || keyNum == 109) {
        this.$message.warning("禁止输入小数");
        e.target.value = "";
      }
    },
    skuChange(e) {
      this.ischecked = e;
      this.$emit("skuChange", this.skuKey, e);
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
          this.$set(this.skuItem, "skuImg", res.data);
        } else {
          this.$msgError("上传图片失败,请重新上传!");
        }
      });
    },
    /** 添加套餐 */
    addSku() {
      this.ischecked = false;
      this.$emit("addSku");
    },
    /** 删除套餐 */
    delSku() {
      this.$emit("delSku", this.skuKey);
    },
    // number() {
    //   console.log(this.skuItem.integral);
    //   this.skuItem.integral = this.skuItem.integral.replace(/[^\.\d]/g, "");
    //   // this.famount = this.famount.replace(".", "");
    // },
  },
};
</script>
<style lang="scss">
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>