<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-05-11 17:45:03
 * @Description  : 营销管理 - 提现审核
-->
<template>
  <div class="app-container">
    <div class="app-container">
      <!-- 按钮 -->
      <el-row :gutter="10" class="mb5">
        <el-col :span="20" class="d-flex-algin-center">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="  ">
              <el-button style="font-size: 14px" type="text" size="small"
                >可用金额: {{ moneyForm.moneyTotal }} (元)</el-button
              >
            </el-form-item>
            <el-form-item label="  ">
              <el-button style="font-size: 14px" type="text" size="small"
                >提现金额: {{ moneyForm.drawTotal }} (元)</el-button
              >
            </el-form-item>
            <el-form-item label="  ">
              <el-button style="font-size: 14px" type="text" size="small"
                >转移金额: {{ moneyForm.transFerTotal }} (元)</el-button
              >
            </el-form-item>
            <el-form-item label="  " v-if="moneyForm.storeAmountTotal">
              <el-button style="font-size: 14px" type="text" size="small"
                >店铺总收入: {{ moneyForm.storeAmountTotal }} (元)</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-table
        v-loading="loading"
        :data="listMoney"
        border
        :height="500"
        :key="key"
      >
        <el-table-column type="selection" width="50" align="center" fixed />
        <el-table-column
          label="序号"
          type="index"
          width="60"
          align="center"
        ></el-table-column>
        <template v-for="(v, index) in columnsMoney">
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
                v-if="v.prop === 'freeStatus'"
                :type="scope.row.freeStatus == 0 ? 'danger' : 'success'"
                size="small"
                >{{ scope.row.freeStatus == 0 ? "冻结" : "解冻" }}</el-tag
              >
              <el-tag
                v-else-if="v.prop === 'status'"
                :type="scope.row.status == 0 ? 'danger' : 'success'"
                >{{ scope.row.status == 0 ? "转出" : "转入" }}</el-tag
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
        :total="moneytotal"
        :page.sync="moneyQueryParams.pageNum"
        :limit.sync="moneyQueryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>
<script>
import { userMoneyList, countMoneyTotal } from "@/api/money";
// 默认表格展示列
const defaultColumnsMoney = [
  {
    label: "订单编号",
    show: true,
    prop: "orderNo",
    align: "center",
  },
  {
    label: "交易描述",
    show: true,
    prop: "des",
    align: "center",
    // width: 250,
  },
  {
    label: "资金状态",
    show: true,
    prop: "freeStatus",
    align: "center",
    // width: 100,
  },
  {
    label: "状态",
    show: true,
    prop: "status",
    align: "center",
    // width: 100,
  },
  {
    label: "金额",
    show: true,
    prop: "amount",
    align: "center",
    // width: 100,
  },
  {
    label: "创建时间",
    show: true,
    prop: "createTime",
    align: "center",
  },
];
export default {
  name: "UserMoneyList",
  data() {
    return {
      loading: true,
      key: 1,
      // 资金来源
      moneytotal: 0,
      moneyForm: {},
      listMoney: [],
      moneyOpen: false,
      columnsMoney: _.cloneDeep(defaultColumnsMoney),
      moneyQueryParams: _.cloneDeep(this.Dict.QUERY_PARAMS),
      isEdit: false,
      tempRowIndex: false,
    };
  },
  mounted() {
    this.getList();
    this.getcountMoneyTotal(this.$route.query);
  },
  methods: {
    // 取消按钮
    cancel() {
      this.moneyForm = {};
      this.moneyOpen = false;
    },
    getList() {
      this.loading = true;
      this.moneyQueryParams.status = 1;
      this.moneyQueryParams.accountId = this.$route.query.accountId;
      userMoneyList(this.moneyQueryParams).then((response) => {
        this.listMoney = response.data.list;
        this.moneytotal = Number.parseInt(response.data.total);
        this.loading = false;
      });
    },
    getcountMoneyTotal(query) {
      countMoneyTotal({
        accountId: query.accountId,
        userType: query.userType,
      }).then((res) => {
        if (res.code == 200) {
          this.moneyForm = res.data;
        }
      });
    },
  },
};
</script>