<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-10-30 15:09:54
 * @Description  : 环迅商户
-->
<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-check"
          size="mini"
          :disabled="multiple"
          @click="handleCheckSuccess"
          >同步状态</el-button
        >
      </el-col>
      <el-col :span="7" class="d-flex-algin-center">
        <el-input
          v-model="queryParams.keyword"
          placeholder="请输入手机号等进行查询"
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
      :height="tableHeight + 10"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="序号" type="index" width="60" align="center" />
      <template v-for="(v, index) in columns">
        <el-table-column
          :label="v.label"
          :width="v.width"
          :prop="v.prop"
          :align="v.align"
          :key="index"
          header-align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="v.prop === 'createTime'">{{
              parseTime(scope.row[v.prop])
            }}</span>
            <el-tag
              v-else-if="v.prop === 'status'"
              :type="Dict.IBOX_ACCOUNT_STATUS[scope.row[v.prop]*1-1].type"
              size="small"
              >{{ Dict.IBOX_ACCOUNT_STATUS[scope.row[v.prop]*1-1].value }}</el-tag
            >
            <el-tag
              v-else-if="v.prop === 'accountType'"
              :type="Dict.ACCOUNTYPE[scope.row[v.prop]*1].type"
              size="small"
              >{{ Dict.ACCOUNTYPE[scope.row[v.prop]*1].value }}</el-tag
            >
            <el-tag
              v-else-if="v.prop === 'licenceType'"
              :type="Dict.IBOX_LICENCE_TYPE[scope.row[v.prop]*1].type"
              size="small"
              >{{ Dict.IBOX_LICENCE_TYPE[scope.row[v.prop]*1].value }}</el-tag
            >
            <span v-else>{{ scope.row[v.prop] }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        label="操作"
        align="center"
        width="180"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            icon="el-icon-check"
            size="mini"
            type="text"
            @click="handleCheckSuccess(scope.row)"
            >同步状态</el-button
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
import { getIboxMchPageList, syncMchtAudit } from "@/api/stores";
const defaultColumns = [
  { label: "开户名",  prop: "accountName", align: "center", width: 150 },
  { label: "银行卡号",  prop: "accountNo", align: "center", width: 150 },
  { label: "银行预留手机号",  prop: "resserveMobile", align: "center", width: 150 },
  { label: "账户类型",  prop: "accountType", align: "center", width: 80 },
  { label: "商户类型",  prop: "channelKind", align: "center", width: 80 },
  { label: "商户名称",  prop: "mchtName", align: "center", width: 150 },
  { label: "商户简称",  prop: "mchtCnShortName", align: "center", width: 150 },
  { label: "商户号",  prop: "mchtNo", align: "center", width: 150 },
  { label: "经营地区区域码",  prop: "areaNo", align: "center", width: 150 },
  { label: "商户门店地址",  prop: "address", align: "center", width: 150 },
  { label: "经营范围",  prop: "businessId", align: "center", width: 150 },
  { label: "营业执照类型",  prop: "licenceType", align: "center", width: 150 },
  { label: "营业执照号",  prop: "licNo", align: "center", width: 150 },
  { label: "营业执照有效期",  prop: "businessTerm", align: "center", width: 150 },
  { label: "商户法人身份证号",  prop: "userCardNo", align: "center", width: 150 },
  { label: "商户法人姓名",  prop: "userName", align: "center", width: 150 },
  { label: "身份证有效期",  prop: "periodValidity", align: "center", width: 150 },
  { label: "法人手机号",  prop: "userPhone", align: "center", width: 150 },
  { label: "微信子商户号",  prop: "wechatPartnerNo", align: "center", width: 150 },
  { label: "开户银行支行号",  prop: "zbankNo", align: "center", width: 150 },
  { label: "开户银行支行区域码",  prop: "zbankRegionCode", align: "center", width: 150 },
  { label: "审核说明",  prop: "reason", align: "center", width: 150 },
  { label: "状态",  prop: "status", align: "center", width: 120 },
  {
    label: "注册时间",
    show: true,
    prop: "createTime",
    align: "left",
    width: 180,
  },
];

export default {
  name: "StoresIboxAccount",
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
    /** 查询环迅商户列表 */
    getList() {
      this.loading = true;
      getIboxMchPageList(this.queryParams).then((response) => {
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 同步状态按钮操作 */
    handleCheckSuccess(row) {
      const ids =
        [row.mchtNo] || this.ids.map((item) => item.mchtNo);
      this.updateStoreAuditStatus(ids);
    },
    /** 修改状态 */
    updateStoreAuditStatus(ids) {
      if (ids.length <= 0) {
        this.msgInfo("勾选中，暂无满足条件的商户");
        return;
      }
      syncMchtAudit({
        mchtNo: ids
      }).then((res) => {
        this.getList();
        this.msgSuccess("操作成功");
      });
    },
  },
};
</script>