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
      ref="MarketModuleForm"
      :model="form"
      :rules="rules"
      label-width="120px"
      label-suffix=":"
    >
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="设置等级" prop="userLevel" v-if="!isEdit">
        <el-select v-model="form.userLevel" class="w-100">
          <el-option
            v-for="(v, i) in level"
            :key="i"
            :label="v.value"
            :value="v.key"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="升级|降级原因" prop="mark" v-if="!isEdit">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入原因"
          v-model="form.mark"
        >
        </el-input>
      </el-form-item>
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
import { userLevelUpdate } from "@/api/user";
export default {
  name: "MarketModuleDialog",
  props: {
    // 是否打开
    open: {
      type: Boolean,
      default: false,
    },
    // 是否店东
    isShop: {
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
      // 弹窗标题
      title: "",
      // 等级
      level: [],
      // 表单校验
      rules: {
        phone: [{ required: true, message: "手机号不能为空", trigger: "blur" }],
        userLevel: [
          { required: true, message: "请选择用户等级", trigger: "blur" },
        ],
        mark: [{ required: true, message: "理由不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    if (this.isShop) {
      this.title = "设置店东等级";
      this.level = this.Dict.MONEY_HOMEOWNER_STATUS;
    } else {
      this.title = "设置代理等级";
      this.level = this.Dict.MONEY_AGENT_STATUS;
    }
  },
  methods: {
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["MarketModuleForm"].validate((valid) => {
        if (valid) {
          const _params = _.assign({}, this.form);
          if (this.isEdit) {
            //结算
          } else {
            // 设置等级
            if (this.isShop) {
              userLevelUpdate(_params).then((response) => {
                this.msgSuccess("设置成功");
                this.$emit("cancel");
                this.$emit("submit");
              });
            } else {
              userLevelUpdate(_params).then((response) => {
                this.msgSuccess("设置成功");
                this.$emit("cancel");
                this.$emit("submit");
              });
            }
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.$refs["MarketModuleForm"].clearValidate();
      this.$emit("cancel");
    },
  },
};
</script>