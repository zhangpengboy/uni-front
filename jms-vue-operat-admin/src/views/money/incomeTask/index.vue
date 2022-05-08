<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-05-11 17:45:03
 * @Description  : 资金管理 - 分润任务列表
-->
<template>
  <div class="app-container">
    <el-table
      v-loading="loading"
      :data="list"
      border
      :key="key"
      :height="tableHeight + 5"
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
          header-align="center"
          show-overflow-tooltip
        >
            <template slot-scope="scope">
                <el-tag
                :type="scope.row[v.prop] == 0 ? 'danger' : 'success'"
                v-if="v.prop === 'genStatus'"
                >{{ scope.row[v.prop] == 0 ? "待生成" : "已生成" }}</el-tag
                >
                <template v-else-if="v.prop === 'incomeType'">
                <el-tag type="warning" size="mini" v-if="scope.row.incomeType == 1">红包</el-tag>
                <el-tag type="info" size="mini" v-else>积分</el-tag>
                </template>
                <el-tag
                    :type="Dict.EXEC_STATUS[scope.row[v.prop]].type"
                    size="small"
                    v-else-if="v.prop === 'execStatus'"
                    >{{ Dict.EXEC_STATUS[scope.row[v.prop]].value }}</el-tag
                    >
                <span v-else-if="v.prop === 'execTime'">{{
                parseTime(scope.row[v.prop])
                }}</span>
                <span v-else>{{ scope.row[v.prop] }}</span>
            </template>
        </el-table-column>
      </template>
      <el-table-column
        label="操作"
        align="center"
        width="120"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="updateStatus(scope.row)"
            >更新状态</el-button
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
import { getIncomeTaskPageList, incomeTaskUpdateStatus } from "@/api/money";

const defaultColumns = [
  {
    label: "业务编号",
    show: true,
    prop: "bsType",
    align: "center",
  },
  {
    label: "订单编号",
    show: true,
    prop: "orderNo",
    align: "center",
  },
  {
    label: "分润金额",
    show: true,
    prop: "amount",
    align: "center",
  },
  {
    label: "分润配置",
    show: true,
    prop: "incomeConfig",
    align: "center",
  },
  {
    label: "分润详情",
    show: true,
    prop: "incomeInfo",
    align: "center",
  },
  {
    label: "分润类型",
    show: true,
    prop: "incomeType",
    align: "center",
  },
  {
    label: "执行状态",
    show: true,
    prop: "execStatus",
    align: "center",
  },
  {
    label: "分润详情状态",
    show: true,
    prop: "genStatus",
    align: "center",
  },
  {
    label: "备注",
    show: true,
    prop: "remark",
    align: "center",
  },
  {
    label: "执行时间",
    show: true,
    prop: "execTime",
    align: "center",
    width: 180,
  },
];

export default {
  name: "userGiftList",
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
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询店铺分类列表 */
    getList() {
      this.loading = true;
      getIncomeTaskPageList(this.queryParams).then((response) => {
        this.list = response.data.list;
        this.total = Number.parseInt(response.data.total);
        this.loading = false;
      });
    },
    /** 更新状态操作 */
    updateStatus(row) {
        incomeTaskUpdateStatus({ids: [row.id]}).then(res => {
            this.getList()
        })
    },
  },
};
</script>
