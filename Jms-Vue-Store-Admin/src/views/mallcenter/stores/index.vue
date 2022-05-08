<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-03 14:03:38
 * @Description  : 商户中心 - 店铺列表
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
          >修改</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          >删除</el-button
        >
      </el-col> -->
      <!-- <el-col :span="7" class="d-flex-algin-center">
        <el-input
          v-model="queryParams.quickQuery"
          placeholder="请输入名称/手机号等进行查询"
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
      </el-col> -->
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
      :height="tableHeight"
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
          <template slot-scope="scope">
            <el-tag
              v-if="v.prop === 'status'"
              :type="Dict.STORE_STATUS[scope.row[v.prop]].type"
              size="small"
              >{{ Dict.STORE_STATUS[scope.row[v.prop]].value }}</el-tag
            >
            <span v-else-if="v.prop === 'createTime'">{{
              parseTime(scope.row[v.prop])
            }}</span>
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

    <!-- 添加或修改对话框 -->
    <StoreDialog
      :isEdit="isEdit"
      :open="open"
      :form="form"
      @submit="getList()"
      @cancel="cancel()"
      v-if="open"
    ></StoreDialog>
  </div>
</template>

<script>
import StoreDialog from "../components/StoreDialog";
import {
  getStoreInfoPageList,
  getStoreInfo,
  deleteStoreInfo,
} from "@/api/stores";

const defaultColumns = [
  {
    label: "店铺名称",
    show: true,
    prop: "storeName",
    align: "left",
    width: 180,
  },
  {
    label: "店铺角色",
    show: true,
    prop: "storeRoleName",
    align: "left",
    width: 180,
  },
  {
    label: "店铺分类",
    show: true,
    prop: "storeCategoryName",
    align: "left",
    width: 180,
  },
  {
    label: "店铺地址",
    show: true,
    prop: "storeAddress",
    align: "left",
    width: 280,
  },
  {
    label: "经营范围",
    show: true,
    prop: "storeBusiness",
    align: "left",
  },
  {
    label: "店铺状态",
    show: true,
    prop: "status",
    align: "center",
    width: 100,
  },
];

export default {
  name: "StoresList",
  components: {
    StoreDialog,
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
      // 是否是修改弹出层
      isEdit: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: _.cloneDeep(this.Dict.QUERY_PARAMS),
      // 表单参数
      form: {},
      // 表格key
      key: 1,
      // 自定义表格列表
      columns: _.cloneDeep(defaultColumns),
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询店铺列表 */
    getList() {
      this.loading = true;
      getStoreInfoPageList(this.queryParams).then((response) => {
        this.list = response.data;
        console.log(this.list)
        this.total = Number.parseInt(response.data.length);
        this.loading = false;
      });
    },
    /** 自定义列排序查询 */
    HandleSortChange(col) {
      this.queryParams.order = col.prop;
      this.queryParams.direction = this.filterKeyToValue(col.order, "ORDER");
      this.handleQuery();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        storeName: undefined,
        storeCategoryId: undefined,
        storeCategoryName: undefined,
        storeOwnerName: undefined,
        storeBusiness: undefined,
        storeAddress: undefined,
        storeRoleCode: undefined,
        storeRoleName: undefined,
      };
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
      const id = row.id || this.ids.map((item) => item.id);
      getStoreInfo({ storeId: id.toString() }).then((response) => {
        this.isEdit = true;
        this.form = _.assign({}, response.data);
        this.open = true;
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = this.ids.map((item) => item.id);
      const names = row.storeName || this.ids.map((item) => item.storeName);
      this.$confirm('是否确认删除店铺为"' + names + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return deleteStoreInfo({ ids: ids });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
  },
};
</script>