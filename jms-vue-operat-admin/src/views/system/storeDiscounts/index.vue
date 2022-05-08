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
        <el-input
          v-model="queryParams.quickQuery"
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
            <span v-if="v.prop === 'storeRole'">{{
              filterStoreRole(scope.row[v.prop])
            }}</span>
            <el-tag
              :type="scope.row[v.prop] == 0 ? 'danger' : 'success'"
              v-else-if="v.prop === 'status'"
              >{{ scope.row[v.prop] == 0 ? "禁用" : "启用" }}</el-tag
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
            icon="el-icon-close"
            v-if="scope.row.status == 1"
            @click="Operating(scope.row)"
            >禁用</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-check"
            v-if="scope.row.status == 0"
            @click="Operating(scope.row)"
            >启用</el-button
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
    <StoreDiscountsDialog
      :isEdit="isEdit"
      :open="open"
      :form="form"
      :storeList="storeList"
      @submit="getList()"
      @cancel="cancel()"
    ></StoreDiscountsDialog>
  </div>
</template>

<script>
import StoreDiscountsDialog from "./components/StoreDiscountsDialog";
import {
  getListRate,
  storeRoleList,
  editRate,
  delRate,
} from "@/api/stores";

const defaultColumns = [
  {
    label: "店铺类型",
    show: true,
    prop: "storeRole",
    align: "left",
    width: 200,
  },
  { label: "折扣", show: true, prop: "rate", align: "center", width: 100 },
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
  name: "StoreDiscounts",
  components: {
    StoreDiscountsDialog,
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
      storeRoleList: [],
      storeList: [],
    };
  },
  created() {
    storeRoleList().then((res) => {
      console.log(999, res);
      if (res.code == 200) {
        this.storeRoleList = res.data;
        this.getList();
      }
    });
  },
  methods: {
    /** 查询店铺分类列表 */
    getList() {
      this.loading = true;
      getListRate(this.queryParams).then((response) => {
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
        id: undefined,
        storeRole: undefined,
        rate: undefined,
        status: undefined,
      };
      this.resetForm("unitForm");
    },
    // 过滤店铺角色列表
    filterStoreRole(e) {
       return this.storeRoleList.filter(item => e === item.code.toString())[0].name
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
      let arr = [];
      this.storeRoleList.map((item) => {
        if (item.code == 3 || item.code == 4 || item.code == 5) {
          arr.push(item);
        }
      });
      this.storeList = _.cloneDeep(arr);
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = this.ids[0];
      this.form.storeRole = +this.form.storeRole;
      this.open = true;
      this.isEdit = true;
      let arr = [];
      this.storeRoleList.map((item) => {
        if (item.code == 3 || item.code == 4 || item.code == 5) {
          arr.push(item);
        }
      });
      this.storeList = _.cloneDeep(arr);
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      // const ids = row.id || this.ids.map((item) => item.id);
      const ids = this.ids[0].id;
      const titles = row.title || this.ids.map((item) => item.title);
      this.$confirm('是否确认删除类别为"' + titles + '"的数据项?', "警告", {
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
    //更改状态
    Operating(row) {
      console.log(row);
      if(row.status == 1) {
        row.status = 0
      }else {
        row.status = 1
      }
      editRate(row).then(res => {
        if(res.code == 200) {
          this.msgSuccess("修改成功");
          this.getList()
        }
      })
    }
  },
};
</script>