<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-05-11 17:45:03
 * @Description  : 营销管理 - 提现审核
-->
<template>
  <div class="app-container">
    <el-row :gutter="10" :span="24">
      <el-col :span="22" class="d-flex-algin-center">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          v-show="showSearch"
          label-width="48px"
        >
          <ElFormItem label="账号">
            <el-input
              v-model="queryParams.cardNo"
              placeholder="请输入账号进行查询"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </ElFormItem>
          <ElFormItem label="状态">
            <el-select
              style="width: 100%"
              size="small"
              clearable
              v-model="queryParams.withdrawStatus"
              placeholder="请选择提现状态"
              @change="handleQuery"
            >
              <el-option
                v-for="item in Dict.MONEY_DRAW_STATUS"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              >
              </el-option>
            </el-select>
          </ElFormItem>
          <ElFormItem label="时间">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleQuery"
            ></el-date-picker>
          </ElFormItem>
          <ElFormItem>
            <el-button
              type="cyan"
              icon="el-icon-search"
              size="small"
              @click="handleQuery"
            >
              搜索
            </el-button>
            <el-button style="font-size: 14px" type="text" size="small"
              >可用余额:
              {{ availableAmount ? availableAmount : 0 }} (元)</el-button
            >
          </ElFormItem>
        </el-form>
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        :cols="columns"
        :grid="$route.name"
        :page="queryParams"
        @queryTable="getMoneyDrawPageList"
        :showSearchBar="false"
        showRefreshBar
      ></right-toolbar>
    </el-row>
    <el-table
      v-loading="loading"
      :data="list"
      ref="table"
      border
      :summary-method="getSummaries"
      show-summary
      :key="key"
      :height="tableHeight"
    >
      <el-table-column label="序号" type="index" width="60" align="center" />
      <template v-for="(v, index) in columns">
        <el-table-column
          :label="v.label"
          :width="v.width"
          :prop="v.prop"
          :align="v.align"
          :key="index"
          v-if="v.show"
          :sortable="v.sort"
          header-align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="v.prop === 'cardType'" size="small">{{
              scope.row.type == 0 ? "银行卡" : "支付宝"
            }}</span>
            <span v-else-if="v.prop === 'withdrawStatus'">
              <el-tag v-if="scope.row.withdrawStatus == 0" type="primary"
                >待审核...</el-tag
              >
              <el-tag v-if="scope.row.withdrawStatus == 1" type="success"
                >提现成功</el-tag
              >
              <el-tag v-if="scope.row.withdrawStatus == 2" type="danger"
                >提现失败</el-tag
              >
            </span>
            <span v-else-if="v.prop === 'userType'">{{
              scope.row.userType == 1 ? "商家" : "用户"
            }}</span>
            <span v-else-if="v.prop === 'transTime'">{{
              parseTime(scope.row[v.prop])
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
        fixed="right"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <!-- <el-button
            @click="drawAlipay(scope.row)"
            :disabled="!scope.row.withdrawStatus == 0"
            icon="el-icon-edit"
            type="text"
            >提现待审核</el-button
          > -->
          <el-button
            @click="stateAudit(scope.row, 1)"
            :disabled="!scope.row.withdrawStatus == 0"
            icon="el-icon-circle-check"
            type="text"
            >同意</el-button
          >
          <el-button
            @click="stateAudit(scope.row, 0)"
            :disabled="!scope.row.withdrawStatus == 0"
            icon="el-icon-circle-close"
            type="text"
            >拒绝</el-button
          >
          <el-button
            @click="seeBalance(scope.row)"
            icon="el-icon-view"
            type="text"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getMoneyDrawPageList"
    />

    <el-dialog title="提现审核" :visible.sync="dialogTableVisible" width="65%">
      <el-form :model="userForm" class="demo-form-inline">
        <el-form-item label="提现类型:">
          <span>{{ userForm.cardType == 0 ? "银行卡" : "支付宝" }}</span>
        </el-form-item>
        <el-form-item label="提现金额:">
          <el-tag>{{ userForm.money }}</el-tag>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-check" @click="throughReview">
            通过审核
          </el-button>
          <el-button type="danger" icon="el-icon-close" @click="refusedReview">
            拒绝审核
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  moneyDrawPageList,
  drawAlipay,
  noApply,
  alipayBalance,
  userMoneyList,
  countMoneyTotal,
} from "@/api/money";
// 默认表格展示列
const defaultColumns = [
  {
    label: "姓名",
    show: true,
    prop: "cardName",
    align: "center",
    width: 100,
    sort: false,
  },
  {
    label: "提现帐号",
    show: true,
    prop: "cardNo",
    align: "center",
    sort: false,
  },
  {
    label: "类型",
    show: true,
    prop: "userType",
    align: "center",
    width: 80,
    sort: false,
  },
  {
    label: "提现金额",
    show: true,
    prop: "money",
    align: "right",
    width: 100,
    sort: false,
  },
  {
    label: "手续费",
    show: true,
    prop: "fei",
    align: "right",
    width: 90,
    sort: false,
  },
  // {
  //   label: "提现类型",
  //   show: true,
  //   prop: "cardType",
  //   align: "center",
  //   width: 120,
  // },
  {
    label: "状态",
    show: true,
    prop: "withdrawStatus",
    align: "center",
    width: 100,
    sort: false,
  },
  {
    label: "申请时间",
    show: true,
    prop: "createTime",
    align: "center",
    width: 160,
    sort: false,
  },
  {
    label: "审核时间",
    show: true,
    prop: "transTime",
    align: "center",
    width: 160,
    sort: true,
  },
  {
    label: "备注",
    show: true,
    prop: "mark",
    align: "center",
    sort: false,
  },
];
export default {
  name: "MarketMoneyDraw",
  data() {
    return {
      loading: true,
      key: 1,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      columns: _.cloneDeep(defaultColumns),
      queryParams: _.cloneDeep(this.Dict.QUERY_PARAMS),
      userForm: {},
      dialogTableVisible: false,
      // 显示搜索条件
      showSearch: true,
      availableAmount: 0,
      dateRange: [],
    };
  },
  mounted() {
    this.getMoneyDrawPageList();
    this.getalipayBalance();
  },
  updated() {
    this.$nextTick(() => {
      this.$refs["table"].doLayout();
    });
  },
  methods: {
    getMoneyDrawPageList() {
      moneyDrawPageList(
        this.addDateRange(this.queryParams, this.dateRange)
      ).then((res) => {
        if (res.code == 200) {
          this.loading = false;
          this.list = res.data.list;
          this.total = +res.data.total;
        }
      });
    },
    // 查看用户的资金来源
    seeBalance(row) {
      this.$router.push({
        name: "UserMoneyList",
        query: { accountId: row.accountId, userType: row.userType },
      });
    },
    // 获取对公账户余额
    getalipayBalance() {
      alipayBalance().then((res) => {
        if (res.code == 200) {
          this.availableAmount = res.data.availableAmount;
        }
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getMoneyDrawPageList();
    },
    //提现审核
    drawAlipay(row) {
      this.dialogTableVisible = true;
      console.log(row);
      this.userForm = row;
    },
    //
    stateAudit(row, status) {
      let that = this;
      this.$confirm(`是否${status == 1 ? "通过审核" : "拒绝审核"}?`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          if (status) {
            return drawAlipay(row);
          } else {
            return noApply(row);
          }
        })
        .then(() => {
          if (status) {
            that.msgSuccess("审核通过");
            that.getalipayBalance();
            that.getMoneyDrawPageList();
          } else {
            that.msgSuccess("已拒绝");
            that.getMoneyDrawPageList();
          }
        })
        .catch(function () {});
    },
    // 通过审核
    throughReview() {
      let that = this;
      that.stopClick(`stopClickLogin`).then(() => {
        drawAlipay(this.userForm).then((res) => {
          if (res.code == 200) {
            this.$message({
              message: "审核通过",
              type: "success",
            });
            this.getalipayBalance();

            this.dialogTableVisible = false;
            this.getMoneyDrawPageList();
          }
        });
      });
    },
    getSummaries(param) {
      console.log("param", param);
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (index === 4 || index === 5) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = sums[index].toFixed(2) + " 元";
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
    //拒绝审核
    refusedReview() {
      noApply(this.userForm).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: "已拒绝",
            type: "success",
          });
          this.dialogTableVisible = false;
          this.getMoneyDrawPageList();
        }
      });
    },
  },
};
</script>