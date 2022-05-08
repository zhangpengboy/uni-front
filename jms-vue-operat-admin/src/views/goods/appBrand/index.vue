<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-03 14:03:38
 * @Description  : 商品管理 - 品牌管理
-->
<template>
  <div class="app-container">
    <el-row :gutter="10" :span="24" class="mb8">
      <el-col :span="1.5">
        <el-button
          class="mb8"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          >修改</el-button
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
      :height="tableHeight - 35"
      @row-dblclick="handleUpdate"
    >
      <el-table-column type="selection" width="50" align="center" fixed />
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
            <el-image
              style="height: 80px"
              v-if="v.prop === 'brandIcon'"
              :src="scope.row[v.prop]"
              fit="fill"
              
              :preview-src-list="[scope.row[v.prop]]"
            ></el-image>
            <el-tag
              :type="Dict.STATE[scope.row[v.prop]].type"
              size="small"
              v-else-if="v.prop === 'status'"
              >{{ Dict.STATE[scope.row[v.prop]].value }}</el-tag
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
        width="140"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
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
    <!-- 添加品牌弹窗 -->
    <AppBrandDialog
      v-if="open"
      :open="open"
      :isEdit="isEdit"
      :form="form"
      @cancel="open = false"
      @submit="handleSubmitAppBrand"
    />
  </div>
</template>
<script>
import { getAppBrandPageList, deleteAppBrand } from "@/api/goods";
import AppBrandDialog from "../components/AppBrandDialog";
// 默认表格展示列
const defaultColumns = [
  {
    label: "品牌LOGO",
    show: true,
    prop: "brandLogo",
    align: "center",
    width: 120,
  },
  {
    label: "品牌名称",
    show: true,
    prop: "brandName",
    align: "center",
  },
  {
    label: "品牌编码",
    show: true,
    prop: "brandCode",
    align: "center",
    width: 100,
  },
  {
    label: "品牌介绍",
    show: true,
    prop: "brandDesc",
    align: "center",
    width: 200,
  },
  {
    label: "检索首字母",
    show: true,
    prop: "firstLatter",
    align: "center",
    width: 100,
  },
  {
    label: "排序(权重)",
    show: true,
    prop: "sort",
    align: "center",
    width: 100,
  },
  {
    label: "状态",
    show: true,
    prop: "status",
    align: "center",
    width: 100,
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
  name: "AppBrand",
  components: {
    AppBrandDialog,
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
      // 浏览图
      previewSrcList: [],
    };
  },
  created() {
    this.getList();
  },
  activated() {
    this.getList();
  },
  methods: {
    /** 查询品牌列表 */
    getList() {
      this.loading = true;
      getAppBrandPageList(this.queryParams).then((response) => {
        this.list = response.data.list;
        this.total = Number.parseInt(response.data.total);
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.form = {
        status: 1
      };
      this.open = true;
      this.isEdit = false;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.form = _.assign({}, row);
      this.open = true;
      this.isEdit = true;
    },
    handleSubmitAppBrand () {
      this.open = false;
      this.handleQuery();
    },
    // 删除
    handleDelete(row) {
      const ids = row.id || this.ids.map((item) => item.id);
      const codes = row.brandName || this.ids.map((item) => item.brandName);
      this.$confirm('是否确认删除品牌为"' + codes + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return deleteAppBrand({ workId: ids });
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