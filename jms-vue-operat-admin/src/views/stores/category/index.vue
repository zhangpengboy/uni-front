<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-10-28 17:30:31
 * @Description  : 商户管理 - 经营类别
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
          >禁用</el-button
        >
      </el-col>
      <el-col :span="7" class="d-flex-algin-center">
        <el-input
          v-model="queryParams.keyword"
          placeholder="请输入名称进行查询"
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
      @row-dblclick="handleUpdate"
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
            <!-- <span v-if="v.prop === 'status'">{{
              filterKeyToValue(scope.row[v.prop], "STATUS")
            }}</span> -->
            <el-tag
              :type="Dict.STATE[scope.row[v.prop]].type"
              size="mini"
              v-if="v.prop === 'status'"
              >{{ Dict.STATE[scope.row[v.prop]].value }}</el-tag
            >
            <span v-else-if="v.prop === 'roleCode'">{{
              filterRoleCode(scope.row[v.prop])
            }}</span>
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
        width="120"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.level == 2"
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAddSecondary(scope.row)"
            >添加下级分类</el-button
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
    <CategoryDialog
      :isEdit="isEdit"
      :open="open"
      :secondary="secondary"
      :form="form"
      @submit="getList()"
      @cancel="cancel()"
    ></CategoryDialog>
  </div>
</template>

<script>
import CategoryDialog from "./components/CategoryDialog";
import {
  getStoreCategoryList,
  getStoresCategoryDetail,
  deleteStoresCategory,
  storeAllRoleList,
} from "@/api/stores";

const defaultColumns = [
  { label: "名称", show: true, prop: "title", align: "left", width: 200 },
  {
    label: "店铺类型",
    show: true,
    prop: "roleCode",
    align: "left",
    width: 200,
  },
  { label: "状态", show: true, prop: "status", align: "center", width: 200 },
  {
    label: "创建时间",
    show: true,
    prop: "createTime",
    align: "center",
    width: 180,
  },
];

export default {
  name: "StoreCategory",
  components: {
    CategoryDialog,
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
      secondary: false,
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
      storeRoleList: [], // 店铺角色
    };
  },
  created() {
    this.getStoreRoleList();
  },
  methods: {
    // 获取店铺角色列表
    getStoreRoleList() {
      storeAllRoleList().then((response) => {
        this.storeRoleList = response.data;
        this.getList();
      });
    },
    // 过滤店铺角色
    filterRoleCode(code) {
      return this.storeRoleList
        .filter((item) => item.code == code)
        .map((item) => item.name)[0];
    },
    /** 查询店铺分类列表 */
    getList() {
      this.loading = true;
      getStoreCategoryList(this.queryParams).then((response) => {
        this.list = response.data.list;
        this.total = Number.parseInt(response.data.total);
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.secondary = false;
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
    /** 添加二级分类操作 */
    handleAddSecondary(row) {
      this.reset();
      console.log(row);
      this.form = {
        status: 1,
        level: row.level + 1,
        roleCode: row.roleCode,
        pid: row.id,
        ptitle: row.title,
      };
      this.secondary = true;
      this.open = true;
      this.isEdit = false;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.form = {
        status: 1,
      };
      this.secondary = false;
      this.open = true;
      this.isEdit = false;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids.map((item) => item.id);
      getStoresCategoryDetail({ workId: id.toString() }).then((response) => {
        this.form = response.data;
        this.secondary = false;
        this.open = true;
        this.isEdit = true;
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      let ids;
      if (row.id) {
        ids = [row.id];
      } else {
        ids = this.ids.map((item) => item.id);
      }
      const titles = row.title || this.ids.map((item) => item.title);
      this.$confirm('是否确认禁用类别为"' + titles + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return deleteStoresCategory({ ids: ids, status: 0 });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("禁用成功");
        })
        .catch(function () {});
    },
    /** 自定义列排序查询 */
    HandleSortChange(col) {
      this.queryParams.order = col.prop;
      this.queryParams.direction = this.filterKeyToValue(col.order, "ORDER");
      this.handleQuery();
    },
  },
};
</script>