<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-10-30 15:09:54
 * @Description  : 商户入驻列表
-->
<template>
  <div class="app-container">
    <el-row :gutter="10"
            class="mb8">
      <el-col :span="1.5">
        <el-button type="primary"
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd">创建自营店</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success"
                   icon="el-icon-check"
                   size="mini"
                   :disabled="multiple"
                   @click="handleCheckSuccess">审核通过</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger"
                   icon="el-icon-close"
                   size="mini"
                   :disabled="multiple"
                   @click="handleCheckError">审核拒绝</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success"
                   icon="el-icon-warning-outline"
                   size="mini"
                   :disabled="multiple"
                   @click="handleOnDisable">启用</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning"
                   icon="el-icon-warning-outline"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDisable">禁用</el-button>
      </el-col>
      <el-col :span="7"
              class="d-flex-algin-center">
        <el-input v-model="queryParams.keyword"
                  placeholder="请输入手机号等进行查询"
                  clearable
                  size="small"
                  class="mr5"
                  @keyup.enter.native="handleQuery" />
        <el-button type="cyan"
                   icon="el-icon-search"
                   size="mini"
                   @click="handleQuery">搜索</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch"
                     :cols="columns"
                     :grid="$route.name"
                     :page="queryParams"
                     @queryTable="getList"
                     :showSearchBar="false"
                     showRefreshBar></right-toolbar>
    </el-row>

    <el-table v-loading="loading"
              :data="list"
              @selection-change="handleSelectionChange"
              border
              :key="key"
              :height="tableHeight + 10">
      <el-table-column type="selection"
                       width="50"
                       align="center" />
      <el-table-column label="序号"
                       type="index"
                       width="60"
                       align="center" />
      <template v-for="(v, index) in columns">
        <el-table-column :label="v.label"
                         :width="v.width"
                         :prop="v.prop"
                         :align="v.align"
                         :key="index"
                         v-if="v.show"
                         header-align="center"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="v.prop === 'createTime'">{{
              parseTime(scope.row[v.prop])
            }}</span>
            <el-tag v-else-if="v.prop === 'status'"
                    :type="Dict.ACCOUNT_STATUS[scope.row[v.prop]].type"
                    size="small">{{ Dict.ACCOUNT_STATUS[scope.row[v.prop]].value }}</el-tag>
            <span v-else>{{ scope.row[v.prop] }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column label="操作"
                       align="center"
                       width="180"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-refresh"
                     @click="resetPwd(scope.row)">重置登录密码</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <OwnStoreDialog :isEdit="isEdit"
                    v-if="open"
                    :open="open"
                    :form="form"
                    @submit="getList()"
                    @cancel="cancel()"></OwnStoreDialog>

  </div>
</template>

<script>
import OwnStoreDialog from "./components/OwnStoreDialog";
import { getStoreList, updateStoreAuditStatus, resetPwd } from "@/api/stores";
const defaultColumns = [
  { label: "手机号", show: true, prop: "phone", align: "center", width: 150 },
  { label: "状态", show: true, prop: "status", align: "center", width: 120 },
  {
    label: "注册时间",
    show: true,
    prop: "createTime",
    align: "left",
    width: 180,
  },
];

export default {
  name: "StoresAccount",
  components: {
    OwnStoreDialog,
  },
  data () {
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
  created () {
    this.getList();
  },
  methods: {
    /** 查询商品单位列表 */
    getList () {
      this.loading = true;
      getStoreList(this.queryParams).then((response) => {
        this.list = response.data.list;
        this.total = Number.parseInt(response.data.total);
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.ids = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 表单重置
    reset () {
      this.form = {
        id: undefined,
        storeName: undefined,
        phone: undefined,
        storeCategoryId: undefined,
        storeCategoryName: undefined,
        storeAddress: undefined,
        goodsCateList: [],
        storeBg: '',
        storeLogo: ''
      };
    },
    handleSubmitAppBrand () {
      this.open = false;
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.reset();
      this.open = true;
      this.isEdit = false;
    },
    /** 审核通过按钮操作 */
    handleCheckSuccess (row) {
      const ids =
        row.id || this.ids.filter((v) => v.status == 2).map((item) => item.id);
      this.updateStoreAuditStatus(ids, 0);
    },
    /** 审核拒绝按钮操作 */
    handleCheckError (row) {
      const ids =
        row.id || this.ids.filter((v) => v.status == 2).map((item) => item.id);
      this.updateStoreAuditStatus(ids, 3);
    },
    /** 启用按钮操作 */
    handleOnDisable (row) {
      const ids =
        row.id || this.ids.filter((v) => v.status == 1).map((item) => item.id);
      this.updateStoreAuditStatus(ids, 0);
    },
    /** 禁用按钮操作 */
    handleDisable (row) {
      const ids =
        row.id || this.ids.filter((v) => v.status == 0).map((item) => item.id);
      this.updateStoreAuditStatus(ids, 1);
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      const ids =
        row.id ||
        this.ids
          .filter((v) => v.status == 1 || v.status == 3)
          .map((item) => item.id);
      this.updateStoreAuditStatus(ids, 4);
    },
    /** 修改状态 */
    updateStoreAuditStatus (ids, status) {
      if (ids.length <= 0) {
        this.msgInfo("勾选中，暂无满足条件的商户");
        return;
      }
      updateStoreAuditStatus({
        ids: ids,
        status: status,
      }).then((res) => {
        this.getList();
        this.msgSuccess("操作成功");
      });
    },
    // 取消按钮
    cancel () {
      this.open = false;
      this.reset();
    },
    // 重置密码
    resetPwd (row) {
      console.log(row);
      this.$confirm("是否重置登录密码?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return resetPwd({ workId: row.id });
        })
        .then((res) => {
          this.getList();
          this.msgSuccess(res.message);
        })
        .catch(function () { });
    },
  },
};
</script>