<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-26 18:56:15
 * @Description : 资金流水统计报表
-->
<template>
  <div class="app-container">
    <el-form
      class="mb-8"
      :model="queryParams"
      ref="queryForm"
      label-width="80px"
      inline
      size="mini"
    >
      <el-form-item label="金额类型:">
        <el-select
          v-model="queryParams.bitType"
          clearable
          filterable
          @change="handleQuery"
        >
          <el-option
            v-for="(item, index) in Dict.BIT_TYPE"
            :key="index"
            :label="item.value"
            :value="item.key"
            v-show="index > 0"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务类型:">
        <el-select
          v-model="queryParams.busType"
          clearable
          filterable
          @change="handleQuery"
        >
          <el-option
            v-for="(item, index) in Dict.BUS_TYPE"
            :key="index"
            :label="item.value"
            :value="item.key"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="状态:">
        <el-select
          v-model="queryParams.status"
          clearable
          filterable
          @change="handleQuery"
        >
          <el-option
            v-for="(item, index) in Dict.MONEY_STATUS"
            :key="index"
            :label="item.value"
            :value="item.key"
          >
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-input
          v-model="queryParams.keyword"
          placeholder="请输入关键字进行查询"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>

      <right-toolbar
        @queryTable="getList"
        :showSearchBar="false"
        showRefreshBar
      ></right-toolbar>
    </el-form>

    <el-table
      v-loading="loading"
      :data="list"
      @selection-change="handleSelectionChange"
      border
      :height="tableHeight"
    >
      <!-- <el-table-column type="selection" width="50" align="center" /> -->
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
            <el-link
              :type="Dict.BIT_TYPE[scope.row[v.prop]].type"
              :underline="false"
              v-else-if="v.prop === 'bitType'"
            >
              {{ filterKeyToValue(scope.row.bitType, "BIT_TYPE") }}
            </el-link>
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
  </div>
</template>

<script>
import { getMoneyList } from "@/api/report";

const defaultColumns = [
  {
    label: "交易类型",
    show: true,
    prop: "bitType",
    align: "center",
  },
  {
    label: "交易流水号",
    show: true,
    prop: "transNo",
    align: "center",
  },
  {
    label: "付款账户",
    show: true,
    prop: "accountIdFrom",
    align: "center",
  },
  {
    label: "金额",
    show: true,
    prop: "money",
    align: "right",
    width: 150,
  },
  {
    label: "交易描述",
    show: true,
    prop: "des",
    align: "left",
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
  name: "ReportMoney",
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
      // 自定义表单列表
      columns: _.cloneDeep(defaultColumns),
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      getMoneyList(this.queryParams).then((response) => {
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
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams = _.cloneDeep(this.Dict.QUERY_PARAMS);
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
  },
};
</script>