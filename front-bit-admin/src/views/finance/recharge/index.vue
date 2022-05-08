<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-11 15:39:22
 * @Description : 充值管理
-->
<template>
  <div class="app-container">
    <el-form
      class="mb-8"
      :model="queryParams"
      ref="queryForm"
      label-width="60px"
      inline
      size="mini"
    >
      <el-form-item label="类型:">
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
      <el-form-item label="状态:">
        <el-select
          v-model="queryParams.status"
          clearable
          filterable
          @change="handleQuery"
        >
          <el-option
            v-for="(item, index) in Dict.RECHARGE_STATUS"
            :key="index"
            :label="item.value"
            :value="item.key"
          >
          </el-option>
        </el-select>
      </el-form-item>
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
            <span v-else-if="v.prop === 'img'">
              <el-image
                :src="scope.row.img"
                fit="fill"
                :lazy="true"
                :preview-src-list="[scope.row.img]"
              ></el-image>
            </span>
            <el-tag
              :type="Dict.RECHARGE_STATUS[scope.row[v.prop]].type"
              size="small"
              v-else-if="v.prop === 'status'"
            >
              {{ Dict.RECHARGE_STATUS[scope.row[v.prop]].value }}
            </el-tag>
            <span v-else>{{ scope.row[v.prop] }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding "
        width="180"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-check"
            @click="handleAgree(scope.row)"
            v-hasPermi="['']"
            :disabled="scope.row.status !== 1"
            >同意打款</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-close"
            @click="handleReject(scope.row)"
            :disabled="scope.row.status !== 1"
            v-hasPermi="['']"
            >拒绝打款</el-button
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
import { getRechargeOrderList, checkInRecharge } from "@/api/finance";

const defaultColumns = [
  {
    label: "订单号",
    show: true,
    prop: "orderNo",
    align: "center",
  },
  {
    label: "转账人",
    show: true,
    prop: "transUserName",
    align: "center",
  },
  {
    label: "手机号",
    show: true,
    prop: "phone",
    align: "center",
  },
  {
    label: "充值金额",
    show: true,
    prop: "money",
    align: "center",
  },
  {
    label: "充值类型",
    show: true,
    prop: "bitType",
    align: "center",
  },
  {
    label: "转账凭证",
    show: true,
    prop: "img",
    align: "center",
    width: 100,
  },
  {
    label: "订单状态",
    show: true,
    prop: "status",
    align: "center",
  },
  {
    label: "创建时间",
    show: true,
    prop: "createTime",
    align: "center",
  },
];

export default {
  name: "FinanceRecharge",
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
      getRechargeOrderList(this.queryParams).then((response) => {
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
    /** 拒绝打款按钮操作 */
    handleAgree(row) {
      this.$confirm(
        '确认收到用户打款？',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return checkInRecharge({ orderNo: row.orderNo, status: 2 });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("已充值成功到用户账上");
        })
        .catch(function () {});
    },
    /** 拒绝打款按钮操作 */
    handleReject(row) {
      this.$confirm(
        '确定未收到用户打款？',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return checkInRecharge({ orderNo: row.orderNo, status: 3 });
        })
        .then(() => {
          this.getList();
          this.msgError("已拒绝充值");
        })
        .catch(function () {});
    },
  },
};
</script>