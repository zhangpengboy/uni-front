<!--
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-27 14:43:47
 * @Description : 系统配置 - 活动表配置
-->
<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:role:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:role:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:role:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="7" class="d-flex-algin-center">
        <el-input
          v-model="queryParams.quickQuery"
          placeholder="请输入名称/Key进行查询"
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
      :height="tableHeight"
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
          <template slot-scope="scope">
            <span v-if="v.prop === 'createTime'">
              {{ parseTime(scope.row.createTime) }}
            </span>
            <span v-else>{{ scope.row[v.prop] }}</span>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <pagination
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="550px"
      append-to-body
      v-el-dialog-drag
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="cancel"
    >
      <el-form
        ref="reftableForm"
        :model="form"
        label-width="90px"
        label-suffix=":"
      >
        <el-form-item
          label="活动"
          prop="actCode"
          required
          :rules="[{ required: true, message: '请选择活动' }]"
        >
          <el-select
            v-model="form.actCode"
            clearable
            @change="handleActChange"
            class="w-100"
            :disabled="isEdit"
          >
            <el-option
              v-for="v in actList"
              :key="v.id"
              :label="v.name"
              :value="v.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="表名" prop="refName">
          <el-input v-model="form.refName" placeholder="请输入表名" />
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
  getActRefTableList,
  addActRefTable,
  delActRefTable,
  updateActRefTable,
  getActRefTable,
} from "@/api/goods";
import { getActCommonList } from "@/api/goods";

const defaultFrom = {
  id: undefined,
  actCode: undefined,
  actName: undefined,
  refName: undefined,
};

const defaultColumns = [
  {
    label: "活动编号",
    show: true,
    prop: "actCode",
    align: "left",
    width: 180,
  },
  {
    label: "活动名称",
    show: true,
    prop: "actName",
    align: "left",
    width: 180,
  },
  {
    label: "活动表",
    show: true,
    prop: "refName",
    align: "left",
    width: 220,
  },
  {
    label: "创建时间",
    show: true,
    prop: "createTime",
    align: "center",
    width: 180,
  },
];

export default {
  name: "SystemReftable",
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
      // 弹窗标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否是修改弹出层
      isEdit: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: _.cloneDeep(this.Dict.QUERY_PARAMS),
      // 表单参数
      form: _.assign({}, defaultFrom),
      // 自定义表单列表
      columns: _.cloneDeep(defaultColumns),
      // 活动列表
      actList: [],
    };
  },
  created() {
    this.getList();
    // 获取活动列表
    getActCommonList({
      pageNum: 1,
      pageSize: 100
    }).then((res) => {
      this.actList = res.data.list;
    });
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      getActRefTableList(this.queryParams).then((response) => {
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
      this.form = _.assign({}, defaultFrom);
      this.resetForm("reftableForm");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "活动表配置-添加";
      this.isEdit = false;
    },
    /** 修改按钮操作 */
    handleUpdate() {
      this.reset();
      this.form = this.ids[0];
      this.open = true;
      this.title = "活动表配置-修改";
      this.isEdit = true;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids.map((item) => item.id);
      const codes = row.actCode || this.ids.map((item) => item.actCode);
      this.$confirm('是否确认删除编号为"' + codes + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delActRefTable({ ids: ids.toString() });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["reftableForm"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateActRefTable(this.form).then((response) => {
              if (response.code == 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addActRefTable(this.form).then((response) => {
              if (response.code == 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 活动筛选改变 */
    handleActChange(value) {
      const ACT = _.find(this.actList, (v) => v.code == value);
      this.form.actName = ACT.name;
    },
  },
};
</script>