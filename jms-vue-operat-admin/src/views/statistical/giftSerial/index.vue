<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-05-11 17:45:03
 * @Description  : 统计报表 - 礼券流水
-->
<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:role:add']"
          >新增</el-button
        >
      </el-col> -->

      <el-col :span="4">
        <!-- <el-input
          v-model="queryParams.phone"
          placeholder="请输入名称进行查询"
          clearable
          size="small"
          class="mr5"
          @keyup.enter.native="handleQuery"
        /> -->
        <el-input
          v-model="queryParams.mobile"
          placeholder="请输入手机号进行查询"
          clearable
          size="small"
          class="mr5"
          @keyup.enter.native="handleQuery"
        />
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
    <el-table
      v-loading="loading"
      :data="list"
      border
      :key="key"
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
            <span v-if="v.prop === 'payTime'">{{
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
        width="160"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            @click="lookGiftWaterList(scope.row)"
            icon="el-icon-view"
            type="text"
            >查看流水</el-button
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
    <el-dialog title="流水表" width="1000px" :visible.sync="dialogTableVisible">
      <!-- <el-col :span="6">
        <el-input
          v-model="integralParams.orderNo"
          placeholder="请输入订单号进行查询"
          clearable
          size="small"
          class="mr5"
          @keyup.enter.native="handleIntegra"
        />
      </el-col>
      <el-col :span="6">
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          class="mr5"
          @click="handleIntegra"
          >查询</el-button
        >
      </el-col> -->
      <el-table
        v-loading="loading"
        :data="giftWaterList"
        border
        :key="key"
        :height="500"
      >
        <el-table-column label="序号" type="index" width="60" align="center" />
        <template v-for="(v, index) in integraWater">
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
              <span v-if="v.prop === 'freeStatus'">{{
                scope.row.freeStatus == 0 ? "冻结" : "解冻"
              }}</span>
              <el-tag
                :type="scope.row.status == 0 ? 'danger' : 'success'"
                v-else-if="v.prop === 'status'"
                >{{ scope.row.status == 0 ? "转出" : "转入" }}</el-tag
              >
              <span v-else-if="v.prop === 'type'">{{
                scope.row.type == 0
                  ? "商城订单"
                  : scope.row.type == 1
                  ? "线下扫码"
                  : "系统赠送"
              }}</span>
              <span v-else-if="v.prop === 'createTime'">{{
                parseTime(scope.row[v.prop])
              }}</span>
              <span v-else>{{ scope.row[v.prop] }}</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <pagination
        :total="integraltotal"
        :page.sync="integralParams.pageNum"
        :limit.sync="integralParams.pageSize"
        @pagination="getIntegralList"
      />
    </el-dialog>
  </div>
</template>

<script>
import { getIntegralPushList, downloadGiftSerialExl } from "@/api/statistical";
import { integralList } from "@/api/money";

// 默认表格展示列
const defaultColumns = [
  {
    label: "用户手机号",
    show: true,
    prop: "mobile",
    align: "center",
  },
  {
    label: "订单号",
    show: true,
    prop: "orderNo",
    align: "right",
  },
  {
    label: "店铺名称",
    show: true,
    prop: "storeName",
    align: "center",
  },
  {
    label: "消费金额",
    show: true,
    prop: "payAmount",
    align: "right",
  },
  {
    label: "赠送礼券",
    show: true,
    prop: "amount",
    align: "right",
  },
  {
    label: "付款时间",
    show: true,
    prop: "payTime",
    align: "center",
    width: 180,
  },
];
// 流水表
const integraColumns = [
  {
    label: "订单编号",
    show: true,
    prop: "orderNo",
    align: "center",
    width: 190,
  },
  {
    label: "交易描述",
    show: true,
    prop: "des",
    align: "center",
    width: 200,
  },
  {
    label: "积分数量",
    show: true,
    prop: "amount",
    align: "center",
  },
  {
    label: "积分状态",
    show: true,
    prop: "freeStatus",
    align: "center",
  },
  {
    label: "状态",
    show: true,
    prop: "status",
    align: "center",
  },
  {
    label: "类型",
    show: true,
    prop: "type",
    align: "center",
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
  name: "GiftSerial",
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
      integralParams: _.cloneDeep(this.Dict.QUERY_PARAMS),
      // 表单参数
      form: {},
      // 表格key
      key: 1,
      // 默认表头
      columns: _.cloneDeep(defaultColumns),
      integraWater: _.cloneDeep(integraColumns),
      // 店铺角色列表
      storeList: [],
      loadingExportExcel: false,
      dialogTableVisible: false,
      giftWaterList: [],
      integraltotal: 0,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询店铺分类列表 */
    getList() {
      this.loading = true;
      getIntegralPushList(this.queryParams).then((response) => {
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
    // 查看流水
    lookGiftWaterList(row) {
      this.dialogTableVisible = true;
      this.integralParams.mobile = row.mobile;
      this.getIntegralList();
    },
    /** 流水表搜索按钮操作 */
    handleIntegra() {
      this.integralParams.pageNum = 1;
      this.getIntegralList();
    },
    // 获取流水数据
    getIntegralList() {
      this.giftWaterList = [];
      // this.loading = true;
      integralList(this.integralParams).then((res) => {
        if (res.code == 200) {
          this.giftWaterList = res.data.list;
          this.integraltotal = Number.parseInt(res.data.total);
          this.loading = false;
        }
      });
    },
    // 导出execl表
    handledownloadExl() {
      this.loadingExportExcel = true;
      this.msg = this.$message({
        message: "正在下载,请稍等",
        type: "warning",
        duration: 0,
      });
      this.queryParams.pageSize = 10;
      downloadGiftSerialExl(this.queryParams)
        .then((res) => {
          this.download("礼券流水", res);
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