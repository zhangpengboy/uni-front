<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-05-11 17:45:03
 * @Description  : 统计报表 - 礼券流水
-->
<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="4">
        <!-- <el-input
          v-model="queryParams.phone"
          placeholder="请输入名称进行查询"
          clearable
          size="small"
          class="mr5"
          @keyup.enter.native="handleQuery"
        /> -->
        <!-- <el-input
          v-model="queryParams.mobile"
          placeholder="请输入手机号进行查询"
          clearable
          size="small"
          class="mr5"
          @keyup.enter.native="handleQuery"
        /> -->
        <el-date-picker
          v-model="time"
          align="right"
          type="date"
          class="w-100"
          placeholder="选择日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-col>
      <el-button
        type="cyan"
        icon="el-icon-search"
        size="mini"
        @click="handleQuery"
        >查询</el-button
      >
      <el-button
        :loading="loadingExportExcel"
        type="primary"
        icon="el-icon-download"
        size="mini"
        @click="handledownloadExl"
        >导出excel</el-button
      >
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

    <el-row :gutter="20">
      <el-col :span="12" :offset="0">
        <el-table
          v-loading="statsLoading"
          :data="giftStats"
          border
          :key="key + 1"
          height="75"
        >
          <template v-for="(v, index) in giftStatsColumns">
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
                <span v-if="v.prop === 'time'">{{
                  parseTime(time, "{y}-{m}-{d}")
                }}</span>
                <span v-else-if="v.prop === 'gatheringMoney'">{{
                  scope.row[v.prop] ? scope.row[v.prop] : 0
                }}</span>
                <span v-else-if="v.prop === 'giveIntegral'">{{
                  scope.row[v.prop] ? scope.row[v.prop] : 0
                }}</span>
                <span v-else>{{ scope.row[v.prop] }}</span>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12" :offset="0">
        <h3>用户礼券区间人数统计：</h3>
        <el-table
          v-loading="loading"
          :data="todayList"
          border
          :key="key"
          :height="tableHeight - 85"
        >
          <el-table-column
            label="序号"
            type="index"
            width="60"
            align="center"
          />
          <template v-for="(v, index) in todayListColumns">
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
            </el-table-column>
          </template>
        </el-table>
      </el-col>
      <el-col :span="12" :offset="0">
        <h3>用户礼券排行榜：</h3>
        <el-table
          v-loading="loading"
          :data="list"
          border
          :key="key"
          :height="tableHeight - 85"
        >
          <el-table-column
            label="序号"
            type="index"
            width="60"
            align="center"
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
            </el-table-column>
          </template>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getUserIntegralMax,
  getStoreMoneyList,
  downloadUserIntegralMaxExport,
  getUserTodayIntegralList,
} from "@/api/statistical";

// 默认表格展示列-礼券排名
const defaultColumns = [
  {
    label: "手机号",
    show: true,
    prop: "phone",
    align: "center",
  },
  {
    label: "用户名称",
    show: true,
    prop: "userName",
    align: "center",
  },
  {
    label: "礼券数量",
    show: true,
    prop: "allAmount",
    align: "right",
  },
];
// 默认表格展示列-礼券统计
const giftStatsColumns = [
  {
    label: "日期",
    show: true,
    prop: "time",
    align: "center",
  },
  {
    label: "收银金额",
    show: true,
    prop: "gatheringMoney",
    align: "center",
  },
  {
    label: "赠送礼券",
    show: true,
    prop: "giveIntegral",
    align: "right",
  },
  {
    label: "收银笔数",
    show: true,
    prop: "gatheringCount",
    align: "right",
  },
];
// 默认表格展示列-礼券统计
const todayListColumns = [
  {
    label: "日期",
    show: true,
    prop: "time",
    align: "center",
  },
  {
    label: "区间",
    show: true,
    prop: "interval",
    align: "center",
  },
  {
    label: "人数",
    show: true,
    prop: "userTotal",
    align: "right",
  },
];

export default {
  name: "assetStatistical",
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
      giftStatsColumns: _.cloneDeep(giftStatsColumns),
      todayListColumns: _.cloneDeep(todayListColumns),
      giftStats: [], // 用户礼券统计
      statsLoading: true,
      loadingExportExcel: false,
      time: new Date(),
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
      todayList: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询店铺分类列表 */
    getList() {
      this.loading = true;
      this.statsLoading = true;
      this.queryParams.pageSize = 11;
      getUserIntegralMax(this.queryParams).then((response) => {
        this.list = response.data.list;
        this.total = Number.parseInt(response.data.total);
        this.loading = false;
      });
      // 获取收银统计
      getStoreMoneyList({
        time: this.parseTime(this.time, "{y}-{m}-{d}"),
      }).then((res) => {
        this.giftStats = res.data;
        this.statsLoading = false;
      });

      // 获取日志列表
      getUserTodayIntegralList({
        time: this.parseTime(this.time, "{y}-{m}-{d}"),
      }).then((res) => {
        this.todayList = res.data;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 导出execl表
    handledownloadExl() {
      this.loadingExportExcel = true;
      this.msg = this.$message({
        message: "正在下载,请稍等",
        type: "warning",
        duration: 0,
      });
      this.queryParams.pageSize = 11;
      downloadUserIntegralMaxExport(this.queryParams)
        .then((res) => {
          this.download("用户礼券统计", res);
          this.msg.close();
          this.loadingExportExcel = false;
        })
        .catch((err) => {
          this.msg.close();
          this.loadingExportExcel = false;
        });
    },
  },
};
</script>