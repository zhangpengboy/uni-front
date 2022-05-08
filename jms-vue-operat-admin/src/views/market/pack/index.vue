<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-27 14:23:35
 * @Description  : 营销管理 - 模块管理
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
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
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
      :height="tableHeight + 10"
    >
      <el-table-column type="selection" width="50" align="center" fixed="left"/>
      <el-table-column
        label="序号"
        type="index"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column
        label="名称"
        align="left"
        prop="name"
        header-align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="开通价格"
        align="right"
        prop="price"
        header-align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="开通积分"
        align="right"
        prop="integral"
        header-align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="展示数量"
        align="right"
        prop="showAmount"
        header-align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="有效时间"
        align="center"
        prop="avilableTime"
        width="120"
      >
        <template slot-scope="scope">
          {{ scope.row.avilableTime | filterTime }}
        </template>
      </el-table-column>
      <el-table-column
        label="权重规则"
        align="center"
        prop="weightPrinciple"
      >
        <template slot-scope="scope">
          <el-tag
            type="success"
            size="small"
            v-if="scope.row.weightPrinciple == 1"
            >金额+积分</el-tag
          >
          <el-tag
            type="warning"
            size="small"
            v-if="scope.row.weightPrinciple == 2"
            >金额</el-tag
          >
          <el-tag type="info" size="small" v-if="scope.row.weightPrinciple == 3"
            >积分</el-tag
          >
        </template>
      </el-table-column>
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
        width="180"
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

    <!-- 添加或修改活动对话框 -->
    <PackDialog
      :isEdit="isEdit"
      :open="open"
      :form="form"
      @submit="getList()"
      @cancel="cancel()"
    ></PackDialog>
  </div>
</template>

<script>
import {
  getActCommonPackList,
  getActCommonPack,
  delActCommonPack,
} from "@/api/goods";
import PackDialog from "../components/PackDialog";
export default {
  name: "MarketPack",
  components: {
    PackDialog,
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
      id: 0,
      // 查询参数
      queryParams: _.cloneDeep(this.Dict.QUERY_PARAMS),
    };
  },
  filters: {
    filterTime: (val) => {
      let diff = val / 1000;
      if (diff < 60) return diff + "秒";
      if (diff < 60 * 60) return Math.ceil(diff / 60) + "分钟";
      if (diff < 60 * 60 * 24) return Math.ceil(diff / 3600) + "小时";
      return Math.ceil(diff / 3600 / 24) + "天";
    },
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询商品分类列表 */
    getList() {
      this.loading = true;
      getActCommonPackList(this.queryParams).then((response) => {
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
      this.id = 0;
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
        id: undefined,
        code: undefined,
        name: undefined,
        price: undefined,
        integral: undefined,
        weightPrinciple: "1",
        showAmount: 1,
        avilableTime: undefined,
      };
      this.open = true;
      this.isEdit = false;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const id = row.id || this.ids.map((item) => item.id);
      getActCommonPack({ workId: id.toString() }).then((response) => {
        this.form = response.data;
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
      const names = row.name || this.ids.map((item) => item.name);
      this.$confirm('是否确认删除名称为"' + names + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delActCommonPack({ ids: ids });
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