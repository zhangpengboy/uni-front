<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-03 14:03:38
 * @Description  : 订单管理 - 订单列表
-->
<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="7" class="d-flex-algin-center">
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
      :height="tableHeight"
      @row-dblclick="handleViews"
    >
      <!-- <el-table-column type="selection" width="50" align="center" fixed /> -->
      <el-table-column
        label="序号"
        type="index"
        width="60"
        align="center"
        fixed
      />
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
            <!-- <span v-if="v.prop === 'status'">{{
              filterKeyToValue(scope.row[v.prop], "GOODS_STATUS")
            }}</span> -->
            <el-tag
              v-if="v.prop === 'status'"
              :type="Dict.RETURN_APPLY_STATUS[scope.row[v.prop]].type"
              size="small"
              >{{ Dict.RETURN_APPLY_STATUS[scope.row[v.prop]].value }}</el-tag
            >
            <span v-else-if="v.prop === 'createTime'">{{
              parseTime(scope.row[v.prop])
            }}</span>
            <span v-else>{{ scope.row[v.prop] }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        width="100"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleViews(scope.row)"
            >订单详情</el-button
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
  </div>
</template>

<script>
import { getOrdersApplyPageList } from "@/api/orders";

// 默认表格展示列
const defaultColumns = [
  {
    label: "订单号",
    show: true,
    prop: "orderNo",
    align: "center",
    width: 200,
  },
  {
    label: "用户名称",
    show: true,
    prop: "userName",
    align: "left",
  },
  {
    label: "退款理由",
    show: true,
    prop: "reason",
    align: "left",
  },
  {
    label: "退款金额",
    show: true,
    prop: "returnAmount",
    align: "right",
    width: 100,
  },
  {
    label: "申请时间",
    show: true,
    prop: "createTime",
    align: "center",
    width: 180,
  },
  {
    label: "订单状态",
    show: true,
    prop: "status",
    align: "center",
    width: 100,
  },
];

export default {
  name: "OrdersApply",
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
  methods: {
    /** 查询商品列表 */
    getList() {
      this.loading = true;
      getOrdersApplyPageList(this.queryParams).then((response) => {
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
    /** 查看订单按钮操作 */
    handleViews(row) {
      const orderNo = row.orderNo || this.ids.map((item) => item.orderNo);
      this.$router.push({ name: "OrdersDetail", query: { orderNo: orderNo } });
    },
  },
};
</script>