<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-26 18:56:15
 * @Description : 资产统计报表
-->
<template>
  <div class="app-container">
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
  </div>
</template>

<script>
import { getAllMoneyList } from "@/api/report";

const defaultColumns = [
  {
    label: "账号类型",
    show: true,
    prop: "bitType",
    align: "center",
    width: 100,
  },
  {
    label: "总金额",
    show: true,
    prop: "allAmount",
    align: "right",
    width: 200,
  },
  {
    label: "可用金额",
    show: true,
    prop: "freeAmount",
    align: "right",
    width: 200,
  },
  {
    label: "冻结金额",
    show: true,
    prop: "frozenAmount",
    align: "right",
    width: 200,
  },
  {
    label: "提现额度",
    show: true,
    prop: "drawAmount",
    align: "right",
    width: 180,
  },
];

export default {
  name: "ReportMoney",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 表格数据
      list: [],
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
      getAllMoneyList(this.queryParams).then((response) => {
        this.list = response.data;
        this.loading = false;
      });
    },
  },
};
</script>