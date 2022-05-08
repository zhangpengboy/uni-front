<!--
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-29 08:55:14
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-11-17 19:16:16
 * @FilePath    : \src\views\components\UnitDialog\index.vue
 * @Description : 设置下级代理的弹窗组件
-->
<template>
  <el-dialog
    :title="title"
    :visible="open"
    :width="isDifference ? '500px' : width"
    append-to-body
    v-el-dialog-drag
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="cancel"
  >
    <el-form
      v-if="!stateArea"
      ref="userSetForm"
      :model="form"
      :rules="rules"
      label-width="120px"
      label-suffix=":"
    >
      <el-form-item label="上级用户" prop="parentPhone" v-if="isDifference">
        <el-input
          v-model="form.parentPhone"
          placeholder="请填写上级用户手机号"
        ></el-input>
      </el-form-item>
      <el-form-item label="下级用户" prop="phone" v-if="isDifference">
        <el-input
          v-model="form.phone"
          placeholder="请填写下级用户手机号"
        ></el-input>
      </el-form-item>
      <el-form-item label="上级用户" prop="userId" v-if="!isDifference">
        <el-input
          v-model="form.userPhone"
          placeholder="请选择上级用户"
          @focus.stop="openSupplier = true"
        ></el-input>
      </el-form-item>
      <el-form-item label="下级用户" prop="childrenId" v-if="!isDifference">
        <el-input
          v-model="form.childrenPhone"
          placeholder="请选择下级用户"
          @focus.stop="openSupplierC = true"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="角色类型" prop="roleType" v-if="!isDifference">
        <el-select
          v-model="form.roleType"
          placeholder="请选择角色类型"
          style="width: 100%"
        >
          <el-option label="业务员" value="C"> </el-option>
          <el-option label="业务经理" value="L"> </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form
      v-if="stateArea"
      ref="userSetForm"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-suffix=":"
    >
      <el-form-item
        label="用户手机号"
        prop="areaPhone"
        :rules="[{ required: true, message: '请输入手机号', trigger: 'blur' }]"
      >
        <el-input
          v-model="form.areaPhone"
          placeholder="请填写用户手机号"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="省"
        prop="area1Id"
        :rules="[
          {
            required: true,
            message: '请选择省',
            trigger: 'blur',
          },
        ]"
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
      <el-form-item
        label="市"
        prop="area2Id"
        :rules="[
          {
            required: true,
            message: '请选择市',
            trigger: 'blur',
          },
        ]"
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
      <el-form-item
        label="区"
        prop="area3Id"
        :rules="[
          {
            required: true,
            message: '请选择区',
            trigger: 'blur',
          },
        ]"
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
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" size="mini"
        >确 定</el-button
      >
      <el-button @click="cancel" size="mini">取 消</el-button>
    </div>

    <!-- 上级用户 -->
    <UserSelectDialog
      v-if="openSupplier"
      :key="'supplierSelect_' + tempRowIndex"
      :open="openSupplier"
      @cancel="
        openSupplier = false;
        tempRowIndex = null;
      "
      @submit="handleSupplierSelect"
    />
    <!-- 下级用户 -->
    <UserSelectDialog
      v-if="openSupplierC"
      :key="'supplierSelect_' + tempRowIndex"
      :open="openSupplierC"
      userRole="1"
      @cancel="
        openSupplierC = false;
        tempRowIndex = null;
      "
      @submit="handleSupplierSelectC"
    />
  </el-dialog>
</template>
<script>
import {
  bindRelationUser,
  bindUserRelation,
  correctAgentArea,
} from "@/api/user";
import { getStoreAreaList } from "@/api/stores";
// import StoresSelectDialog from "./StoresSelectDialog";
import UserSelectDialog from "./UserSelectDialog";
export default {
  name: "UserSetDialog",
  components: {
    UserSelectDialog,
  },
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
    // 进入区分
    isDifference: {
      type: Boolean,
      default: false,
    },
    // 进入区分
    stateArea: {
      type: Boolean,
      default: false,
    },
    // 弹窗宽度
    width: {
      type: String,
      default: "700px",
    },
  },
  data() {
    return {
      // 弹窗标题
      title: "",
      // 省
      areaOption1: [],
      // 市
      areaOption2: [],
      // 区
      areaOption3: [],
      // 县/街道
      areaOption4: [],
      // 表单校验
      rules: {
        parentPhone: [
          {
            required: true,
            message: "上级用户手机号不能为空",
            trigger: "change",
          },
        ],
        // phone: [
        //   { required: true, message: "下级用户手机号不能为空", trigger: "change" },
        // ],
        userId: [
          { required: true, message: "上级用户不能为空", trigger: "change" },
        ],
        childrenId: [
          {
            required: true,
            message: "下级用户不能为空",
            trigger: "change",
          },
        ],
        roleType: [
          { required: true, message: "请选择角色类型", trigger: "change" },
        ],
      },
      // 店铺列表
      storeList: [],
      loading: false,
      timeout: null,
      openSupplier: false,
      openSupplierC: false,
      tempRowIndex: false,
    };
  },
  created() {
    if (!this.stateArea) {
      if (this.isEdit) {
        this.title = "绑定用户关系";
      } else {
        this.title = "绑定用户关系";
      }
    } else {
      this.title = "矫正服务区域";
    }

    this.getStoreAreaList();

    // this.getStoreList();
  },
  methods: {
    /** 用户选择 */
    handleSupplierSelect(row) {
      this.$set(this.form, "userId", row.id);
      this.$set(this.form, "userPhone", row.phone);
      this.openSupplier = false;
    },
    handleSupplierSelectC(row) {
      this.$set(this.form, "childrenId", row.id);
      this.$set(this.form, "childrenPhone", row.phone);
      this.openSupplierC = false;
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["userSetForm"].validate((valid) => {
        if (valid) {
          if (this.stateArea) {
            let objReg = /^(?:(?:\+|00)86)?1\d{10}$/;
            if (!objReg.test(this.form.areaPhone)) {
              return this.msgError("手机号有误");
            }
            let obj = {
              phone: this.form.areaPhone,
              agentArea:
                this.form.area1Id +
                "," +
                this.form.area2Id +
                "," +
                this.form.area3Id,
            };
            correctAgentArea(obj).then((response) => {
              this.msgSuccess("矫正成功成功");
              this.$emit("cancel");
              this.$emit("submit");
            });
            return
          }
          if (this.isDifference) {
            let objReg = /^(?:(?:\+|00)86)?1\d{10}$/;
            if (!objReg.test(this.form.phone)) {
              return this.msgError("下级手机号有误");
            }
            if (!objReg.test(this.form.parentPhone)) {
              return this.msgError("上级手机号有误");
            }
            let obj = {
              parentPhone: this.form.parentPhone,
              phone: this.form.phone,
            };
            bindUserRelation(obj).then((response) => {
              this.msgSuccess("绑定成功");
              this.form.phone = "";
              // this.$emit("cancel");
              // this.$emit("submit");
            });
          } else {
            const _params = _.assign({}, this.form);
            bindRelationUser(_params).then((response) => {
              this.msgSuccess("绑定成功");
              this.$emit("cancel");
              this.$emit("submit");
            });
          }
        }
      });
    },
    /** 获取区域列表 */
    getStoreAreaList(workId, level) {
      getStoreAreaList({ workId }).then((res) => {
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
        this.form.area2Id = "";
        this.form.area2Name = null;
        this.areaOption3 = [];
        this.form.area3Id = null;
        this.form.area3Name = null;
        this.areaOption4 = [];
        this.form.area4Id = null;
        this.form.area4Name = null;
      } else if (level == 2) {
        this.areaOption3 = [];
        delete this.form.area3Id;
        delete this.form.area3Name;
        this.areaOption4 = [];
        this.form.area4Id = null;
        this.form.area4Name = null;
      } else if (level == 3) {
        this.areaOption4 = [];
        delete this.form.area4Id;
        delete this.form.area4Name;

        // this.form.area4Id = null;
      }
    },
    // 取消按钮
    cancel() {
      this.$refs.userSetForm.resetFields();
      this.$emit("cancel");
    },
  },
};
</script>