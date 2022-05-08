<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-12-24 19:48:11
 * @Description  : 代理商 添加 | 修改组件
-->
<template>
  <el-form
    class="agent-form"
    ref="agentForm"
    :model="form"
    label-width="150px"
    size="medium"
    label-suffix=":"
  >
    <el-form-item
      label="代理商手机号"
      prop="phone"
      required
      :rules="[{ required: true, message: '代理商手机号不能为空' }]"
    >
      <el-input
        v-model="form.phone"
        placeholder="请输入代理商手机号"
      ></el-input>
    </el-form-item>
    <el-form-item label="代理区域" required>
      <el-row>
        <el-col :span="24">
          <el-select
            v-model="form.area1Code"
            placeholder="请选择省"
            class="w-95 mb8"
            @change="handleChangeArea1"
          >
            <el-option
              v-for="(v, i) in areaOption1"
              :key="i"
              :label="v.name"
              :value="v.id"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="24" v-if="form.area1Code">
          <el-select
            v-model="form.area2Code"
            placeholder="请选择市"
            class="w-95 mb8"
            @change="handleChangeArea2"
          >
            <el-option
              v-for="(v, i) in areaOption2"
              :key="i"
              :label="v.name"
              :value="v.id"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="24" v-if="form.area2Code">
          <el-select
            v-model="form.area3Code"
            placeholder="请选择区"
            class="w-95 mb8"
            @change="handleChangeArea3"
          >
            <el-option
              v-for="(v, i) in areaOption3"
              :key="i"
              :label="v.name"
              :value="v.id"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="24" v-if="form.area3Code">
          <el-select
            v-model="form.area4Code"
            placeholder="请选择县/街道"
            class="w-95 mb8"
            @change="handleChangeArea4"
          >
            <el-option
              v-for="(v, i) in areaOption4"
              :key="i"
              :label="v.name"
              :value="v.id"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item
      label="身份证正面"
      prop="idcard1"
      required
      :rules="[{ required: true, message: '身份证正面不能为空' }]"
    >
      <el-upload
        class="card-uploader"
        action="#"
        :show-file-list="false"
        :before-upload="beforeUploadImage"
        :http-request="uploadImgCard1"
      >
        <img v-if="form.idcard1" :src="form.idcard1" class="image" />
        <i v-else class="el-icon-plus card-uploader-icon"></i>
        <div slot="tip" class="el-upload__tip">
          只能上传jpg/png文件，且不超过1M
        </div>
      </el-upload>
    </el-form-item>
    <el-form-item
      label="身份证反面"
      prop="idcard2"
      required
      :rules="[{ required: true, message: '身份证反面不能为空' }]"
    >
      <el-upload
        class="card-uploader"
        action="#"
        :show-file-list="false"
        :before-upload="beforeUploadImage"
        :http-request="uploadImgCard2"
      >
        <img v-if="form.idcard2" :src="form.idcard2" class="image" />
        <i v-else class="el-icon-plus card-uploader-icon"></i>
        <div slot="tip" class="el-upload__tip">
          只能上传jpg/png文件，且不超过1M
        </div>
      </el-upload>
    </el-form-item>
    <el-form-item
      label="合同签字页"
      prop="contanct"
      required
      :rules="[{ required: true, message: '合同签字页不能为空' }]"
    >
      <el-upload
        class="avatar-uploader"
        action="#"
        :show-file-list="false"
        :before-upload="beforeUploadImage"
        :http-request="uploadImgContanct"
      >
        <img v-if="form.contanct" :src="form.contanct" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        <div slot="tip" class="el-upload__tip">
          只能上传jpg/png文件，且不超过1M
        </div>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        size="default"
        block
        @click="submitForm"
        v-loading.fullscreen.lock="fullscreenLoading"
        >保 存</el-button
      >
    </el-form-item>
  </el-form>
</template>
<script>
import { getAreaList, uploadImg } from "@/api/commom";
import { addStoreAgent } from "@/api/agent";
export default {
  name: "AgentDetailComp",
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
      // 表单
      form: _.assign({}, this.form),
      // loading
      fullscreenLoading: false,
      // 省
      areaOption1: [],
      // 市
      areaOption2: [],
      // 区
      areaOption3: [],
      // 县/街道
      areaOption4: [],
    };
  },
  created() {
    // 获取省列表
    this.getAreaList();
  },
  methods: {
    /** 图片上传之前判断 */
    beforeUploadImage(file) {
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
    uploadImgCard1(e) {
      this.uploadImg(e, "idcard1");
    },
    uploadImgCard2(e) {
      this.uploadImg(e, "idcard2");
    },
    uploadImgContanct(e) {
      this.uploadImg(e, "contanct");
    },
    /** 自定义上传图片 */
    uploadImg(e, type) {
      uploadImg(e.file).then((res) => {
        if (res.code == 200) {
          if (type == "idcard1") {
            this.$set(this.form, "idcard1", res.data);
          } else if (type == "idcard2") {
            this.$set(this.form, "idcard2", res.data);
          } else if (type == "contanct") {
            this.$set(this.form, "contanct", res.data);
          }
        } else {
          this.$msgError("上传图片失败,请重新上传!");
        }
      });
    },
    /** 获取区域列表 */
    getAreaList(areaId, level) {
      getAreaList({ areaId }).then((res) => {
        console.log(res);
        if (level == 1) {
          this.areaOption1 = res.data;
        } else if (level == 2) {
          this.areaOption2 = res.data;
        } else if (level == 3) {
          this.areaOption3 = res.data;
        } else if (level == 4) {
          this.areaOption4 = res.data;
        } else {
          this.areaOption1 = res.data;
        }
      });
    },
    /** 省选择 */
    handleChangeArea1(value) {
      this.$set(this.form, "areaLevel", 1);
      this.$set(this.form, "areaId", value);
      this.$set(
        this.form,
        "areaName",
        this.areaOption1
          .filter((v) => v.id == value)
          .map((v) => v.name)
          .toString()
      );
      this.resetAreaSelect(1);
      this.getAreaList(value, 2);
    },
    /** 市选择 */
    handleChangeArea2(value) {
      this.$set(this.form, "areaLevel", 2);
      this.$set(this.form, "areaId", value);
      this.$set(
        this.form,
        "areaName",
        this.areaOption2
          .filter((v) => v.id == value)
          .map((v) => v.name)
          .toString()
      );
      this.resetAreaSelect(2);
      this.getAreaList(value, 3);
    },
    /** 区选择 */
    handleChangeArea3(value) {
      this.$set(this.form, "areaLevel", 3);
      this.$set(this.form, "areaId", value);
      this.$set(
        this.form,
        "areaName",
        this.areaOption3
          .filter((v) => v.id == value)
          .map((v) => v.name)
          .toString()
      );
      this.resetAreaSelect(3);
      this.getAreaList(value, 4);
    },
    /** 县/街道选择 */
    handleChangeArea4(value) {
      this.$set(this.form, "areaLevel", 4);
      this.$set(this.form, "areaId", value);
      this.$set(
        this.form,
        "areaName",
        this.areaOption4
          .filter((v) => v.id == value)
          .map((v) => v.name)
          .toString()
      );
    },
    /** 重置数据 */
    resetAreaSelect(level) {
      if (level == 1) {
        this.areaOption2 = [];
        this.form.area3Code = null;
        this.areaOption3 = [];
        this.form.area4Code = null;
        this.areaOption4 = [];
      } else if (level == 2) {
        this.areaOption3 = [];
        this.form.area4Code = null;
        this.areaOption4 = [];
      } else if (level == 3) {
        this.areaOption4 = [];
      }
    },
    /** 提交表单 */
    submitForm() {
      console.log(this.form);
      this.$refs["agentForm"].validate((valid) => {
        if (valid) {
          if (this.form.areaId == null) {
            return this.msgError("请选择代理区域");
          }
          addStoreAgent(this.form).then((res) => {
            this.msgSuccess("添加成功");
            this.form = _.assign({}, {});
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.agent {
  &-form {
    width: 650px;
  }
}
</style>