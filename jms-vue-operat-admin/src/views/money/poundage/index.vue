<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >添加</el-button
        >
      </el-col>
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
      <!-- <el-col :span="4">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号进行查询"
          clearable
          size="small"
          class="mr5"
          @keyup.enter.native="handleQuery"
        />
      </el-col> -->
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
            <span v-else-if="v.prop === 'type'">
              <span>{{ scope.row[v.prop] == 1 ? "百分比" : "固定金额" }}</span>
            </span>
            <span v-else>{{ scope.row[v.prop] }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        label="操作"
        align="center"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="handleIntegralSend(scope.row)"
            >手续费配置修改</el-button
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
    <StoresDialog
      :isEdit="isEdit"
      :open="open1"
      :form="form1"
      @submit="getList()"
      @cancel="cancel1()"
    ></StoresDialog>
    <!-- 手续费配置弹出框 -->
    <el-dialog
      title="手续费配置"
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
        <el-form-item label="费率类型" prop="type">
          <el-select
            v-model="form.type"
            clearable
            placeholder="请选择费率类型"
            class="w-100 mr5"
          >
            <el-option label="百分比" :value="1"></el-option>
            <el-option label="固定金额" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="费率" prop="rate">
          <el-input
            placeholder="请输入费率"
            v-model="form.rate"
            clearable
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
import { moneyDrawList, moneyRateAdd } from "@/api/money";
import StoresDialog from "../components/storesDialog";
import StoreSelectDialog from "../components/StoreSelectDialog";

// 默认表格展示列
const defaultColumns = [
  {
    label: "店铺名称",
    show: true,
    prop: "storeName",
    align: "center",
    width: 300,
  },
  {
    label: "费率类型",
    show: true,
    prop: "type",
    align: "center",
    width: 150,
  },
  {
    label: "费率/金额",
    show: true,
    prop: "rate",
    align: "center",
    width: 200,
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
  name: "Poundage",
  components: {
    StoresDialog,
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
      open1: false,
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
      form1: {},
      // 表格key
      key: 1,
      // 默认表头
      columns: _.cloneDeep(defaultColumns),
      // 店铺角色列表
      storeList: [],
      openStore: false,
      tempRowIndex: false,
      rules: {
        storeName: [
          { required: true, message: "请选择店铺", trigger: "change" },
        ],
        type: [
          { required: true, message: "请选择费率类型", trigger: "change" },
        ],
        rate: [
          { required: true, message: "请输入费率", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询店铺配置列表 */
    getList() {
      this.loading = true;
      moneyDrawList(this.queryParams).then((response) => {
        this.list = response.data.list;
        this.total = Number.parseInt(response.data.total);
        this.loading = false;
        this.list.map((item) => {
          item.type = JSON.parse(item.drawType)[0].type;
          item.rate = JSON.parse(item.drawType)[0].rate;
        });
      });
    },
    // 添加
    handleAdd() {
      this.open = true;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 店铺选择 */
    handleStoreSelect(row) {
      this.form.storeId = row.id;
      this.form.storeName = row.storeName;
      this.openStore = false;
      // this.$refs['rulesForm'].resetFields();
    },
    /** 确认按钮操作 */
    handleCheckSuccess() {
      let that = this;
      that.stopClick(`stopClickLogin`).then(() => {
        that.$refs["rulesForm"].validate((valid) => {
          if (valid) {
            // var value = /^(0+)|[^\d]+/g;
            // if (value.test(that.form.rate))
            //   return that.$message.error("格式错误");
            moneyRateAdd({
              storeId: that.form.storeId,
              storeName: that.form.storeName,
              type: that.form.type,
              rate: that.form.rate,
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
    // 添加 取消按钮
    cancel() {
      this.open = false;
      this.form.storeId = "";
      this.form.storeName = "";
      this.form.quantity = "";
      this.$refs["rulesForm"].resetFields();
    },
    // 修改 取消按钮
    cancel1() {
      this.open1 = false;
      this.form1 = {};
    },
    // 手续费配置
    handleIntegralSend(row) {
      let obj = JSON.parse(row.drawType);
      this.form1 = row;
      this.form1.type = obj[0].type
      this.form1.rate = +obj[0].rate
      this.open1 = true;
    },
  },
};
</script>