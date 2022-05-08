<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-10-28 17:30:31
 * @Description  : 系统管理 - 支付宝解绑、删除、修改
-->

<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          >批量解绑</el-button
        >
      </el-col>
      <el-col :span="10" class="d-flex-algin-center">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入绑定的支付宝姓名"
          clearable
          size="small"
          class="mr5"
          @keyup.enter.native="handleQuery"
        />
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号进行查询"
          clearable
          size="small"
          class="mr5"
          @keyup.enter.native="handleQuery"
        />
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        :cols="columns"
        :grid="$route.name"
        :page="queryParams"
        @queryTable="getList"
        :showSearchBar="false"
        showRefreshBar
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="list"
      @selection-change="handleSelectionChange"
      border
      :key="key"
      :height="tableHeight + 10"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="序号" type="index" width="60" align="center" />
      <template v-for="(v, index) in columns">
        <el-table-column
          :label="v.label"
          :width="v.width"
          :prop="v.prop"
          :align="v.align"
          :key="index"
          v-if="v.show"
          header-align="center"
          show-overflow-tooltip
        >
          <!-- sortable="custom" -->
          <template slot-scope="scope">
            <el-tag
              :type="scope.row[v.prop] == 0 ? 'success' : 'danger'"
              v-if="v.prop === 'status'"
              >{{ scope.row[v.prop] == 0 ? "已绑定" : "解绑" }}</el-tag
            >
            <template v-else-if="v.prop === 'userType'">
              <el-tag type="warning" size="mini" v-if="scope.row.userType == 1">商家</el-tag>
              <el-tag type="info" size="mini" v-else>用户</el-tag>
            </template>
            <span v-else-if="v.prop === 'createTime'">{{
              parseTime(scope.row[v.prop])
            }}</span>
            <span v-else>{{ scope.row[v.prop] }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        label="操作"
        align="center"
        width="180"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-close"
            v-if="scope.row.status == 0"
            @click="handleDelete(scope.row)"
            >解绑</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-if="scope.row.status == 0"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <el-dialog
      title="支付宝绑定账户修改"
      :visible="open"
      width="600"
      append-to-body
      v-el-dialog-drag
      :before-close="cancel"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="cancel"
    >
      <el-form
        ref="StoreDiscountsDialog"
        :model="form"
        label-width="90px"
        label-suffix=":"
      >
        <el-form-item
          :rules="{
            required: true,
            message: '原绑定的支付宝账号不能为空',
            trigger: 'blur',
          }"
          label="原账号"
          prop="account"
        >
          <el-input
            v-model="form.account"
            placeholder="请输入原绑定的支付宝账号"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          :rules="{
            required: true,
            message: '新绑定的支付宝账号不能为空',
            trigger: 'blur',
          }"
          label="新账号"
          prop="nweAccount"
        >
          <el-input
            v-model="form.nweAccount"
            placeholder="请输入新绑定的支付宝账号"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" size="mini"
          >确 定</el-button
        >
        <el-button @click="cancel" size="mini">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  delMoneyBindAcct,
  getMoneyBindAcct,
  updateMoneyBindAcct,
} from "@/api/money";

const defaultColumns = [
  { label: "手机号", show: true, prop: "phone", align: "center", width: 140 },
  {
    label: "用户类型",
    show: true,
    prop: "userType",
    align: "center",
    width: 140,
  },
  { label: "支付宝姓名", show: true, prop: "userName", align: "center", width: 120 },
  {
    label: "支付宝账号",
    show: true,
    prop: "account",
    align: "center",
  },
  { label: "状态", show: true, prop: "status", align: "center", width: 100 },
  {
    label: "创建时间",
    show: true,
    prop: "createTime",
    align: "center",
    width: 180,
  },
];

export default {
  name: "ZfbSet",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 是否显示弹出层
      open: false,
      // 是否修改
      isEdit: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: _.cloneDeep(this.Dict.QUERY_PARAMS),
      // 表单参数
      form: {},
      // 表格key
      key: 1,
      // 默认表头
      columns: _.cloneDeep(defaultColumns),
      // 店铺角色列表
      storeRoleList: [],
      storeList: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询店铺分类列表 */
    getList() {
      this.loading = true;
      getMoneyBindAcct(this.queryParams).then((response) => {
        this.list = response.data.list;
        this.total = Number.parseInt(response.data.total);
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {};
      this.resetForm("unitForm");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.form = row ? _.assign({}, row) : _.assign({}, this.ids[0]);
      this.form["ids"] = [row.id];
      this.isEdit = true;
      this.open = true;
    },
    /** 解绑 */
    handleDelete(row) {
      let ids;
      if (row.id) {
        ids = [row.id];
      } else {
        ids = this.ids.map((item) => item.id);
      }
      const titles = row.account || this.ids.map((item) => item.account);
      this.$confirm('是否确认解除支付宝账户为"' + titles + '"的绑定?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delMoneyBindAcct({ ids: ids });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("解绑成功");
        })
        .catch(function () {});
    },
    // 提交
    submitForm: function () {
      this.$refs["StoreDiscountsDialog"].validate((valid) => {
        if (valid) {
          updateMoneyBindAcct(this.form).then((response) => {
            this.msgSuccess("修改成功");
            this.getList();
            this.open = false;
          });
        }
      });
    },
  },
};
</script>