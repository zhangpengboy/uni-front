<!--
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2021-06-07 13:55:01
 * @Description : 代理商管理- 添加、修改弹窗组件
-->
<template>
  <el-dialog
    title="添加代理商"
    :visible="open"
    :width="width"
    append-to-body
    v-el-dialog-drag
    :before-close="cancel"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="cancel"
  >
    <el-form
      ref="AgentListDialog"
      :model="form"
      label-width="90px"
      label-suffix=":"
    >
      <el-row :gutter="20">
        <el-col :span="24" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item
            :rules="{
              required: true,
              message: '手机号不能为空',
              trigger: 'blur',
            }"
            label="手机号"
            prop="phone"
          >
            <el-input
              @blur="phoneValidationBlur"
              class="w-95"
              v-model="form.phone"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item
            :rules="{
              required: true,
              message: '请选择代理级别',
              trigger: 'blur',
            }"
            label="代理级别"
            prop="areaLevel"
          >
            <el-radio-group v-model="form.areaLevel" @change="radioChange">
              <el-radio :label="1">省</el-radio>
              <el-radio :label="2">市</el-radio>
              <el-radio :label="3">区</el-radio>
              <!-- <el-radio :label="4">街道</el-radio> -->
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item
            v-if="form.areaLevel"
            :rules="{
              required: true,
              message: '省不能为空',
              trigger: 'blur',
            }"
            label="省"
            prop="area1Id"
          >
            <el-select
              v-model="form.area1Id"
              placeholder="请选择省"
              class="w-95"
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
          </el-form-item>
        </el-col>
        <el-col :span="24" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item
            v-if="form.areaLevel > 1"
            :rules="{
              required: true,
              message: '市不能为空',
              trigger: 'blur',
            }"
            label="市"
            prop="area2Id"
          >
            <el-select
              v-model="form.area2Id"
              placeholder="请选择市"
              class="w-95"
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
          </el-form-item>
        </el-col>
        <el-col :span="24" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item
            v-if="form.areaLevel > 2"
            :rules="{
              required: true,
              message: '区不能为空',
              trigger: 'blur',
            }"
            label="区"
            prop="area3Id"
          >
            <el-select
              v-model="form.area3Id"
              placeholder="请选择区"
              class="w-95"
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
          </el-form-item>
        </el-col>
        <!-- <el-col :span="24" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item
            v-if="form.areaLevel > 3"
            :rules="{
              required: true,
              message: '街道不能为空',
              trigger: 'blur',
            }"
            label="街道"
            prop="area4Id"
          >
            <el-select
              v-model="form.area4Id"
              placeholder="请选择街道"
              class="w-95"
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
          </el-form-item>
        </el-col> -->
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" size="mini"
        >确 定</el-button
      >
      <el-button @click="cancel" size="mini">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  dlRegisterAdd,
  dlRegisterGetUserInfo,
  getStoreAreaList,
} from "@/api/stores";
export default {
  name: "AgentListDialog",
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
    // 是否是修改
    isEdit: {
      type: Boolean,
      default: false,
    },
    // 弹窗宽度
    width: {
      type: String,
      default: "500px",
    },
  },
  data() {
    return {
      // 省
      areaOption1: [],
      // 市
      areaOption2: [],
      // 区
      areaOption3: [],
      // 县/街道
      areaOption4: [],
      phoneValidation: false,
    };
  },
  created() {
    this.getStoreAreaList();
  },
  methods: {
    /** 获取区域列表 */
    getStoreAreaList(workId, level) {
      getStoreAreaList({ workId }).then((res) => {
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
      this.$set(this.form, "area1Id", value);
      this.$set(
        this.form,
        "area1Name",
        this.areaOption1
          .filter((v) => v.id == value)
          .map((v) => v.name)
          .toString()
      );
      this.resetAreaSelect(1);
      this.getStoreAreaList(value, 2);
    },
    /** 市选择 */
    handleChangeArea2(value) {
      this.$set(this.form, "area2Id", value);
      this.$set(
        this.form,
        "area2Name",
        this.areaOption2
          .filter((v) => v.id == value)
          .map((v) => v.name)
          .toString()
      );
      this.resetAreaSelect(2);
      this.getStoreAreaList(value, 3);
    },
    /** 区选择 */
    handleChangeArea3(value) {
      this.$set(this.form, "area3Id", value);
      this.$set(
        this.form,
        "area3Name",
        this.areaOption3
          .filter((v) => v.id == value)
          .map((v) => v.name)
          .toString()
      );
      this.resetAreaSelect(3);
      this.getStoreAreaList(value, 4);
    },
    /** 县/街道选择 */
    handleChangeArea4(value) {
      this.$set(this.form, "area4Id", value);
      this.$set(
        this.form,
        "area4Name",
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
        this.form.area2Id = null;
        delete this.form.area2Id;

        this.areaOption3 = [];
        this.form.area3Id = null;
        delete this.form.area3Id;

        this.areaOption4 = [];
        this.form.area4Id = null;
        delete this.form.area4Id;
      } else if (level == 2) {
        this.areaOption3 = [];
        this.form.area3Id = null;
        delete this.form.area3Id;

        this.areaOption4 = [];
        this.form.area4Id = null;
        delete this.form.area4Id;
      } else if (level == 3) {
        this.areaOption4 = [];
        delete this.form.area4Id;
        // this.form.area4Id = null;
      }
    },
    // 切换代理商级别
    radioChange(e) {
      console.log(e);
      console.log(this.form.areaLevel);
      // this.areaOption1 = [];
      this.form.area1Id = null;
      delete this.form.area1Id;
      this.areaOption2 = [];
      this.form.area2Id = null;
      delete this.form.area2Id;
      this.areaOption3 = [];
      this.form.area3Id = null;
      delete this.form.area3Id;
      this.areaOption4 = [];
      this.form.area4Id = null;
      delete this.form.area4Id;
    },
    // 验证是否注册
    phoneValidationBlur() {
      if(this.form.phone) {
        dlRegisterGetUserInfo({ phone: this.form.phone }).then((res) => {
          console.log(res);
          if (res.code == 200) {
            if (res.data.code == 200) {
              this.phoneValidation = true;
            } else {
              this.$message.error(res.data.msg);
              this.$refs["AgentListDialog"].resetFields();
              this.phoneValidation = false;
            }
          }
        });
      }
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["AgentListDialog"].validate((valid) => {
        if (valid) {
          var reg_tel =
            /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
          if (!reg_tel.test(this.form.phone)) {
            this.$message.error("请正确填写手机号码！");
            return false;
          }
          console.log(this.form);
          // if (!this.phoneValidation)
          //   return this.$message.error("当前用户已是代理");
          if (this.form.areaLevel == 1) {
            this.form.areaId = this.form.area1Id;
            this.form.areaName = this.form.area1Name;
          } else if (this.form.areaLevel == 2) {
            this.form.areaId = this.form.area2Id;
            this.form.areaName = this.form.area2Name;
          } else if (this.form.areaLevel == 3) {
            this.form.areaId = this.form.area3Id;
            this.form.areaName = this.form.area3Name;
          } else if (this.form.areaLevel == 4) {
            this.form.areaId = this.form.area4Id;
            this.form.areaName = this.form.area4Name;
          }
          dlRegisterAdd(this.form).then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.msgSuccess("新增成功");
              this.$emit("cancel");
              this.$emit("submit");
            }
          });
        }
      });
    },
    // 取消按钮
    cancel() {
      this.$refs["AgentListDialog"].resetFields();
      this.$emit("cancel");
    },
  },
};
</script>