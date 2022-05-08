<template>
  <div class="app-container">
    <el-row :gutter="10" :span="24" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-view"
          size="mini"
          @click="handleSet"
          >设置代理等级</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-stopwatch"
          size="mini"
          @click="handleReview"
          >等级评测</el-button
        >
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" class="d-flex-algin-center mb8">
        <el-input
          v-model="queryParams.storeName"
          placeholder="请输入手机号进行查询"
          clearable
          size="small"
          class="mr5"
          @keyup.enter.native="handleQuery"
        />
        <el-date-picker
          class="w-100 mr5"
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="timeChange"
        ></el-date-picker>
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
      :height="tableHeight - 35"
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
            <span v-if="v.prop === 'userLevel'">{{
              scope.row[v.prop] == "M1"
                ? "区代理"
                : scope.row[v.prop] == "M1-1"
                ? "一星区代理"
                : scope.row[v.prop] == "M1-2"
                ? "二星区代理"
                : scope.row[v.prop] == "M1-3"
                ? "三星区代理"
                : scope.row[v.prop] == "M1-4"
                ? "四星区代理"
                : "五星区代理"
            }}</span>
            <span v-else-if="v.prop === 'nextIncomeDate'">{{
              parseTime(scope.row[v.prop])
            }}</span>
            <span v-else>{{ scope.row[v.prop] }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        label="操作"
        align="center"
        width="220"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-coin"
            @click="aKeySettlement(scope.row)"
            >立即结算</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleSettlementLook(scope.row)"
            >查看</el-button
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
    <BagSettlementDialog
      :isEdit="isEdit"
      :isShop="isShop"
      :open="open"
      :form="form"
      @submit="getList()"
      @cancel="cancels()"
    ></BagSettlementDialog>
    <SettlementList
      :openList="openList"
      :lookList="lookList"
      :lookTotal="lookTotal"
      @submit="getList()"
      @cancel="cancels()"
      @getSettlementDes="getSettlementDes($event)"
    ></SettlementList>
  </div>
</template>

<script>
import { relTreeUserList, settlementDesAgent, userLevelReview } from "@/api/user";
import { displayAgentIncomeDistribution } from "@/api/money";

import BagSettlementDialog from "../../components/bagSettlementDialog.vue";
import SettlementList from "../../components/settlementList.vue";

// 默认表格展示列
const defaultColumns = [
  {
    label: "手机号",
    show: true,
    prop: "phone",
    align: "left",
  },
  {
    label: "用户等级",
    show: true,
    prop: "userLevel",
    align: "left",
  },
  {
    label: "下次收益结算时间",
    show: true,
    prop: "nextIncomeDate",
    align: "center",
  },
];

export default {
  name: "BagSettlement",
  components: {
    BagSettlementDialog,
    SettlementList,
  },
  data() {
    return {
      // 遮罩层
      loading: false,
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
      lookTotal: 0,
      // 表格数据
      list: [],
      // 是否显示弹出层
      open: false,
      openList: false,
      // 店东
      isShop: false,
      // 是否是修改弹出层
      isEdit: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: _.cloneDeep(this.Dict.QUERY_PARAMS),
      listParams: _.cloneDeep(this.Dict.QUERY_PARAMS),
      // 表单参数
      form: {},
      lookList: [],
      // 表格key
      key: 1,
      // 自定义表格列表
      columns: _.cloneDeep(defaultColumns),
    };
  },
  created() {
    this.getList();
  },
  activated() {
    this.getList();
  },
  methods: {
    /** 查询商品列表 */
    getList() {
      this.loading = true;
      this.queryParams.userLevel = "M1";
      relTreeUserList(this.queryParams).then((response) => {
        this.list = response.data.list;
        this.total = Number.parseInt(response.data.total);
        this.loading = false;
      });
    },
    // 修改代理等级
    handleSet() {
      this.form = {};
      this.isEdit = false;
      this.open = true;
      this.isShop = true;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 时间筛选按钮操作 */
    timeChange(v) {
      if (v) {
        this.queryParams.beginTime = v[0];
        this.queryParams.endTime = v[1];
      } else {
        delete this.queryParams.beginTime;
        delete this.queryParams.endTime;
      }
      this.handleQuery();
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 一键结算导出Excel */
    aKeySettlement(row) {
      let obj = {
        phone: row.phone,
        userId: row.userId,
      };
      this.msg = this.$message({
        message: "正在导出Excel,请稍等",
        type: "warning",
        duration: 0,
      });
      displayAgentIncomeDistribution(obj)
        .then((res) => {
          if (res.code == 500) {
            this.msg.close();
            this.$message.error("没有待结算的奖励");
            return;
          }
          this.download("结算详情", res);
          this.msg.close();
          this.getList();
        })
        .catch((err) => {
          this.msg.close();
        });
    },
    // 查看
    handleSettlementLook(row) {
      this.listParams.userLevel = "M1";
      this.listParams.phone = row.phone;
      // this.listParams.endTime = this.parseTime(row.nextIncomeDate);
      this.getSettlementDes();
    },
    // 获取未结算数据
    getSettlementDes(v) {
      if (v) {
        this.listParams.pageNum = v.page;
        this.listParams.pageSize = v.limit;
      }
      this.loading = true;
      settlementDesAgent(this.listParams).then((res) => {
        if (res.code == 200) {
          this.lookList = res.data.list;
          this.lookTotal = Number.parseInt(res.data.total);
          this.openList = true;
          this.loading = false;
        }
      });
    },
    // 等级评测
    handleReview() {
      userLevelReview({ userLevel: "M1" }).then((res) => {
        if (res.code == 200) {
          this.msgSuccess("等级评测成功");
          this.getList();
        }
      });
    },
    // 取消按钮
    cancels() {
      this.open = false;
      this.openList = false;
    },
  },
};
</script>