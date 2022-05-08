<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-05-11 17:45:03
 * @Description  : 统计报表 - 礼券赠送配置
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
        <el-input
          v-model="queryParams.storeName"
          placeholder="请输入店铺名称进行查询"
          clearable
          size="small"
          class="mr5"
          @keyup.enter.native="handleQuery"
        />
        </el-col>
      <el-col :span="4">
        <el-input
          v-model="queryParams.phone"
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
            <span v-if="v.prop === 'createTime'">{{
              parseTime(scope.row[v.prop])
            }}</span>
            <span v-else-if="v.prop === 'config'">
                <span v-for="(item,i) in scope.row[v.prop]" :key="i">{{'(区间' + item.limit +'比例' + item.rate + '),'}}</span>
            </span>
            <el-tag :type="scope.row[v.prop] == 1 ? 'success' : 'danger'" v-else-if="v.prop === 'status'">{{
              scope.row[v.prop] == 1 ? '启用' : '禁用'
            }}</el-tag>
            <span v-else>{{ scope.row[v.prop] }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        label="操作"
        align="center"
        width="200"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="handleIntegralSend(scope.row)"
            >礼券赠送配置</el-button
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
    <StoresIntegralSendDialog
      :isEdit="isEdit"
      :open="open"
      :form="form"
      @submit="getList()"
      @cancel="cancel()"
    ></StoresIntegralSendDialog>
  </div>
</template>

<script>
import { getAllStoreIntegralSend } from "@/api/statistical";
import StoresIntegralSendDialog from "../components/storesIntegralSendDialog";

// 默认表格展示列
const defaultColumns = [
  {
    label: "用户手机号",
    show: true,
    prop: "phone",
    align: "center",
  },
  {
    label: "店铺名称",
    show: true,
    prop: "storeName",
    align: "center",
  },
  {
    label: "每天在每家店铺扫码获取礼券上限",
    show: true,
    prop: "storeMax",
    align: "center",
    width: 250,
  },
  {
    label: "每月上限值",
    show: true,
    prop: "storeMaxMonth",
    align: "center",
    width: 120,
  },
  {
    label: "赠送配置",
    show: true,
    prop: "config",
    align: "right",

  },
  {
    label: "状态",
    show: true,
    prop: "status",
    align: "center",
    width: 120,

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
  name: "GiftComplimentaryConfiguration",
  components: {
    StoresIntegralSendDialog
  },
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
      // 店铺角色列表
      storeList: [],
      loadingExportExcel: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询店铺礼券赠送配置列表 */
    getList() {
      this.loading = true;
      getAllStoreIntegralSend(this.queryParams).then((response) => {
        this.list = response.data.list;
        this.total = Number.parseInt(response.data.total);
        this.loading = false;
        this.list.map(item => {
            item.config = JSON.parse(item.config)
        })
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 取消按钮
    cancel() {
      this.form = {};
      this.open = false;
    },
    // 礼券赠送配置
    handleIntegralSend(row) {
      this.open = true;
      this.form = row
    }
  },
};
</script>