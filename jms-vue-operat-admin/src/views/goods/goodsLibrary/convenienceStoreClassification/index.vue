<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-08-14 15:15:17
 * @Description  : 商品管理 - 商品分类
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
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="single"
          @click="handleDelete"
          >删除</el-button
        >
      </el-col>
      <right-toolbar
        :page="queryParams"
        @queryTable="resetQuery"
        :showSearchBar="false"
        showRefreshBar
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="list"
      @selection-change="handleSelectionChange"
      border
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column
        label="序号"
        type="index"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column
        label="标题"
        align="center"
        prop="name"
        header-align="center"
        :show-overflow-tooltip="true"
        width="300"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          {{ parseTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="200"
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
      style="text-align: left"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改商品分类对话框 -->
    <CategoryDialog
      :isEdit="isEdit"
      :open="open"
      :form="form"
      @submit="getList()"
      @cancel="cancel()"
    ></CategoryDialog>
  </div>
</template>

<script>
import { goodsCategoryList, goodsCategoryUpdate } from "@/api/goods";
import CategoryDialog from "../components/CategoryDialog";
export default {
  name: "GoodsCategory",
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
      // 用户表格数据
      list: null,
      // 总条数
      total: 0,
      // 弹出层标题
      title: "",
      // 类型树选项
      typeOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 是否修改
      isEdit: false,
      // 类型名称
      typeName: undefined,
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "categoryNameEx",
      },
      // 查询列表ID
      categoryId: 0,
      // 查询参数
      queryParams: _.cloneDeep(this.Dict.QUERY_PARAMS),
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询商品分类列表 */
    getList() {
      this.loading = true;
      goodsCategoryList(this.queryParams).then((response) => {
        this.list = response.data.list;
        this.total = Number.parseInt(response.data.total);
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.categoryId = 0;
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.form = {
        parentTitle: row.title || "主类目",
        title: undefined,
      };
      this.open = true;
      this.isEdit = false;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row);
      const categoryId = row.id || this.ids.map((item) => item.id);
      const categoryName = row.name || this.ids.map((item) => item.name);
      this.form.id = categoryId;
      this.form.name = categoryName;
      this.$set(this.form, "parentTitle", "主类目");
      this.open = true;
      this.isEdit = true;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids.map((item) => item.id);
      const codes = row.name || this.ids.map((item) => item.name);
      this.$confirm('是否确认删除类别为"' + codes + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return goodsCategoryUpdate({ id: ids.toString(), status: 2 });
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