<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-06-07 13:55:01
 * @Description  : 代理商管理 - 
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
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:role:edit']"
          >修改</el-button
        >
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="single"
          @click="handleDelete"
          v-hasPermi="['system:role:remove']"
          >删除</el-button
        >
      </el-col> -->
      <el-col :span="7" class="d-flex-algin-center">
        <!-- <el-input
          v-model="queryParams.phone"
          placeholder="请输入名称进行查询"
          clearable
          size="small"
          class="mr5"
          @keyup.enter.native="handleQuery"
        /> -->
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
          >查询</el-button
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
            <span v-if="v.prop === 'areaLevel'">{{
              Dict.AREA_LEVEL[scope.row[v.prop] - 1].value
            }}</span>
            <el-tag
              :type="scope.row[v.prop] == 0 ? 'danger' : scope.row[v.prop] == 1 ? 'success' : 'info'"
              v-else-if="v.prop === 'status'"
              >{{ scope.row[v.prop] == 0 ? "禁用" : scope.row[v.prop] == 1 ? "启用" : '待审核'}}</el-tag
            >
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
            icon="el-icon-coordinate"
            @click="Operating(scope.row,1)"
            >通过审核</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-close"
            @click="Operating(scope.row,2)"
            >拒绝审核</el-button
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

    <!-- 添加或修改店铺类型配置对话框 -->
    <AgentListDialog
      :isEdit="isEdit"
      :open="open"
      :form="form"
      :storeList="storeList"
      @submit="getList()"
      @cancel="cancel()"
    ></AgentListDialog>
  </div>
</template>

<script>
import AgentListDialog from "./components/AgentListDialog";
import { dlAccountList, dlCjeckDl } from "@/api/stores";

const defaultColumns = [
  {
    label: "账户手机号",
    show: true,
    prop: "phone",
    align: "center",
  },
  {
    label: "账户姓名",
    show: true,
    prop: "accountName",
    align: "center",
  },
  {
    label: "区域名称",
    show: true,
    prop: "areaName",
    align: "center",
  },
  {
    label: "代理级别",
    show: true,
    prop: "areaLevel",
    align: "center",
  },
  { label: "状态", show: true, prop: "status", align: "center" },
  {
    label: "创建时间",
    show: true,
    prop: "createTime",
    align: "center",
    width: 180,
  },
];

export default {
  name: "AgentList",
  components: {
    AgentListDialog,
  },
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
      dlAccountList(this.queryParams).then((response) => {
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
      this.form = {
        phone: undefined,
        area1Id: undefined,
        areaName: undefined,
        areaLevel: undefined,
      };
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.isEdit = false;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = this.ids[0];
      this.open = true;
      this.isEdit = true;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      // const ids = row.id || this.ids.map((item) => item.id);
      const ids = this.ids[0].id;
      const titles = row.title || this.ids.map((item) => item.title);
      this.$confirm("是否确认删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delRate({ workId: ids.toString() });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    //禁用 更改状态
    Operating(row,status) {
      let obj = {}
      obj.areaId = row.areaId
      if (status == 1) {
        obj.checkStatus = 1;
      } else {
        obj.checkStatus = 2;
      }
      this.$confirm(`是否确认${status == 1 ? '通过审核' : '拒绝审核'}?`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return dlCjeckDl(obj);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("操作成功");
        })
        .catch(function () {});
    },
  },
};
</script>