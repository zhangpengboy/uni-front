<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-10-30 15:09:54
 * @Description  : 礼券赠送
-->
<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="open = true"
          >赠送礼券</el-button
        >
      </el-col>
      <el-col :span="16" class="d-flex-algin-center">
        <el-input
          v-model="queryParams.storeName"
          placeholder="店铺名称查询赠送礼券明细"
          clearable
          size="small"
          class="mr5"
          @keyup.enter.native="handleQuery"
        />
        <el-input
          v-model="queryParams.phone"
          placeholder="手机号查询"
          clearable
          size="small"
          class="mr5"
          @keyup.enter.native="handleQuery"
        />
        <el-select
            v-model="queryParams.storeRoleCode"
            clearable
            placeholder="请选择店铺类型"
            class="w-100 mr5"
            @focus="getStoreRoleList"
            @change="handleQuery"
          >
          <el-option v-for="(v,i) in storeRoleList" :key="i" :label="v.name" :value="v.code" ></el-option>
        </el-select>
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
          v-if="v.show"
          header-align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="v.prop === 'pushTime'">{{
              parseTime(scope.row[v.prop])
            }}</span>
            <el-tag
              :type="Dict.STORE_STATUS[scope.row[v.prop]].type"
              size="mini"
              v-else-if="v.prop === 'status'"
              >{{ Dict.STORE_STATUS[scope.row[v.prop]].value }}</el-tag
            >
            <!-- <el-button
            v-else-if="v.prop === 'operation'"
            size="mini"
            type="text"
            icon="el-icon-present"
            @click="open = true"
            >赠送</el-button
          > -->
            <span v-else>{{ scope.row[v.prop] }}</span>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <pagination
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 礼券赠送弹出框 -->
    <el-dialog
      title="礼券赠送"
      :visible.sync="open"
      width="600px"
      append-to-body
      v-el-dialog-drag
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="cancel"
    >
      <el-form :model="form" label-width="100px" ref="rulesForm" :rules="rules">
        <el-form-item label="选择店铺" prop="storeName">
          <el-input
            v-model="form.storeName"
            readonly
            placeholder="请点击选择店铺"
            @focus.stop="openStore = true"
          ></el-input>
        </el-form-item>
        <el-form-item label="赠送数量">
          <el-input
            placeholder="请输入礼券赠送数量"
            v-model="form.quantity"
            onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
            clearable
            maxlength="6"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="handleCheckSuccess">确认</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
      <!-- 店铺选择 -->
      <StoreSelectDialog
        v-if="openStore"
        :key="'stroeSelect_' + tempRowIndex"
        :open="openStore"
        :multiple="false"
        @cancel="
          openStore = false;
          tempRowIndex = null;
        "
        @submit="handleStoreSelect"
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  getIntegralPushList,
  getIntegralPushByName,
  updateIntegralPushStatus,
  storeRoleList
} from "@/api/stores";
import StoreSelectDialog from "../../market/components/StoreSelectDialog";
const defaultColumns = [
  {
    label: "手机号",
    show: true,
    prop: "phone",
    align: "center",
    width: 120,
  },
  {
    label: "店铺名称",
    show: true,
    prop: "storeName",
    align: "left",
  },
  {
    label: "店铺类型",
    show: true,
    prop: "storeRoleName",
    align: "center",
  },
  {
    label: "赠送数量",
    show: true,
    prop: "quantity",
    align: "right",
  },
  {
    label: "描述",
    show: true,
    prop: "des",
    align: "left",
  },
  {
    label: "操作人",
    show: true,
    prop: "adminName",
    align: "left",
  },
  {
    label: "赠送时间",
    show: true,
    prop: "pushTime",
    align: "left",
    width: 180,
  },
];

export default {
  name: "StoresIntegral",
  components: {
    StoreSelectDialog,
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
      form: {
        storeId: 0,
        storeName: "",
        quantity: "",
      },
      // 表格key
      key: 1,
      // 默认表头
      columns: _.cloneDeep(defaultColumns),
      openStore: false,
      tempRowIndex: false,
      storeRoleList: [],
      rules: {
        storeName: [
          { required: true, message: "请选择店铺", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
        // 获取店铺角色列表
    getStoreRoleList() {
      storeRoleList().then((response) => {
        this.storeRoleList = response.data;
      });
    },
    /** 查询礼券发放列表 */
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
      this.loading = true;
      this.queryParams.pageNum = 1;
      getIntegralPushList(this.queryParams).then((response) => {
        this.list = response.data.list;
        this.total = Number.parseInt(response.data.total);
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection;
      const ids = this.ids.filter((v) => v.status == 1).map((item) => item.id);
      if (ids.length > 0) {
        this.single = selection.length != 1;
      } else {
        this.single = true;
      }
      this.multiple = !selection.length;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.form.storeId = "";
      this.form.storeName = "";
      this.form.quantity = ''
      this.$refs["rulesForm"].resetFields();
    },
    /** 店铺选择 */
    handleStoreSelect(row) {
      this.form.storeId = row.id;
      this.form.storeName = row.storeName;
      this.openStore = false;
      // this.$refs['rulesForm'].resetFields();
    },
    /** 礼券赠送确认按钮操作 */
    handleCheckSuccess() {
      let that = this;
      that.stopClick(`stopClickLogin`).then(() => {
        that.$refs["rulesForm"].validate((valid) => {
          if (valid) {
            var value = /^(0+)|[^\d]+/g;
            if (value.test(that.form.quantity))
              return that.$message.error("礼券格式错误");
            updateIntegralPushStatus({
              storeId: that.form.storeId,
              storeName: that.form.storeName,
              quantity: +that.form.quantity,
            }).then((res) => {
              if (res.code == 200) {
                that.open = false;
                that.getList();
              }
            });
          }
        });
      });
    },
    /** 修改状态 */
    updateStoreInfoStatus(storeId, status) {
      updateStoreInfoStatus({
        storeId: storeId,
        status: status,
      }).then((res) => {
        this.open = false;
        this.getList();
        this.msgSuccess("操作成功");
      });
    },
  },
};
</script>