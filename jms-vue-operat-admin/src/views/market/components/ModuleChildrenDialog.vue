<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-04-20 19:31:32
 * @Description : 活动模块子模块修改店铺角色关系 修改、删除
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
      ref="MarketModuleChildrenForm"
      :model="form"
      :rules="rules"
      label-width="90px"
      label-suffix=":"
    >
      <el-form-item label="活动板块" prop="actCode">
        <el-select
          v-model="form.actCode"
          class="w-100"
          @change="handleChangeActCode"
        >
          <el-option
            v-for="(v, i) in actList"
            :key="i"
            :label="v.name"
            :value="v.code"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="店铺角色" prop="roles">
        <el-select
          v-model="form.roles"
          multiple
          placeholder="请选择可参与活动的店铺角色"
          class="w-100"
        >
          <el-option
            v-for="item in roleList"
            :key="item.code"
            :label="item.name"
            :value="item.code.toString()"
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
  </el-dialog>
</template>
<script>
import {
  getActCommonChildrenList,
  editActCommonChildrenRole,
} from "@/api/goods";
export default {
  name: "MarketModuleChildrenDialog",
  props: {
    // 是否打开
    open: {
      type: Boolean,
      default: false,
    },
    actCode: {
      type: String,
      default: null,
    },
    // 弹窗宽度
    width: {
      type: String,
      default: "500px",
    },
    roleList: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      // 弹窗标题
      title: "店铺角色 - 编辑",
      // 表单校验
      rules: {
        roles: [
          { required: true, message: "店铺角色不能为空", trigger: "blur" },
        ],
        actType: [
          { required: true, message: "活动类型不能为空", trigger: "blur" },
        ],
      },
      // 活动模板列表
      actList: [],
      form: {
        roles: [],
        actCode: null,
      },
    };
  },
  created() {
    // 获取顶部栏目区列表
    getActCommonChildrenList({ actCode: this.actCode }).then((res) => {
      this.actList = res.data;
    });
  },
  methods: {
    /** 选择子店铺 */
    handleChangeActCode(val) {
      this.form.roles = this.actList
        .filter((v) => v.code == val)
        .map((v) => v.role)
        .toString()
        .split(",");
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["MarketModuleChildrenForm"].validate((valid) => {
        if (valid) {
          const _params = _.assign({}, this.form);
          _params.ids = _params.roles;
          editActCommonChildrenRole(_params).then((response) => {
            this.msgSuccess("修改成功");
            this.$emit("cancel");
            this.$emit("submit");
          });
        }
      });
    },
    // 取消按钮
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>