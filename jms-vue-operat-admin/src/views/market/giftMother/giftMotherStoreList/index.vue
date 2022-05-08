<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-03 14:03:38
 * @Description  : 云店管理 - 云店列表
-->
<template>
  <div class="app-container">
    <el-row :gutter="10" :span="24" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >添加</el-button
        >
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          >修改</el-button
        >
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          >批量删除</el-button
        >
      </el-col> -->
      <el-col :span="6" class="d-flex-algin-center">
        <el-input
          v-model="queryParams.storeName"
          placeholder="请输入店铺名称进行查询"
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
            <el-image
              style="height: 60px"
              v-if="v.prop === 'storesImg'"
              :src="scope.row[v.prop]"
              fit="fill"
              
              :preview-src-list="[scope.row[v.prop]]"
            >
              <div slot="error" class="image-slot">
                <p>暂无图片</p> 
              </div>
            </el-image>
            <el-tag
              :type="Dict.STATE[scope.row[v.prop]].type"
              size="small"
              v-else-if="v.prop === 'status'"
              >{{ Dict.STATE[scope.row[v.prop]].value }}</el-tag
            >
            <span v-else-if="v.prop === 'motherStartTime'">{{
              parseTime(scope.row[v.prop])
            }}</span>
            <span v-else-if="v.prop === 'motherEndTime'">{{
              parseTime(scope.row[v.prop])
            }}</span>
            <span v-else-if="v.prop === 'storeAddress'">{{
              addressHand(scope.row)
            }}</span>
            <span v-else>{{ scope.row[v.prop] }}</span>
          </template>
        </el-table-column>
      </template>
      <!-- <el-table-column
        label="操作"
        align="center"
        width="140"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 添加或修改云店对话框 -->
    <CloudStoreBindDialog
      :isEdit="isEdit"
      :open="open"
      :form="form"
      @submit="getList()"
      @cancel="cancel()"
    ></CloudStoreBindDialog>
  </div>
</template>

<script>
import {
  getStoreGiftMotherList,
  delBindStore,
} from "@/api/goods";

// 默认表格展示列
const defaultColumns = [
  // {
  //   label: "店铺头像",
  //   show: true,
  //   prop: "headPic",
  //   align: "center",
  //   width: 120,
  // },
  // {
  //   label: "店东姓名",
  //   show: true,
  //   prop: "storeOwnerName",
  //   align: "center",
  //   width: 120,
  // },
  {
    label: "手机号",
    show: true,
    prop: "phone",
    align: "center",
    width: 110,
  },
  {
    label: "店铺名称",
    show: true,
    prop: "storeName",
    align: "left",
  },
  {
    label: "礼券妈妈开始时间",
    show: true,
    prop: "motherStartTime",
    align: "center",
    width: 180,
  },
  {
    label: "礼券妈妈结束时间",
    show: true,
    prop: "motherEndTime",
    align: "center",
    width: 180,
  },
];
import CloudStoreBindDialog from "../components/CloudStoreBindDialog";
export default {
  name: "GiftMotherStoreList",
  components: {
    CloudStoreBindDialog,
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
      // 是否是修改弹出层
      isEdit: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: _.cloneDeep(this.Dict.QUERY_PARAMS),
      // 表单参数
      form: {
        area1Id: null,
        area1Name: null,
        area2Id: null,
        area2Name: null,
        area3Id: null,
        area3Name: null,
        area4Id: null,
        area4Name: null,
        latitude: null,
        longitude : null,
        storePhone: null,
        storeCategoryId: null,
        storeCategoryName: null,
        storeId: null,
        storeName: null,
        storeOwnerName: null,
        storeAddress: null,
      },
      // 表格key
      key: 1,
      // 自定义表格列表
      columns: _.cloneDeep(defaultColumns),
      // 浏览图
      previewSrcList: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询商品列表 */
    getList() {
      this.loading = true;
      getStoreGiftMotherList(this.queryParams).then((response) => {
        this.list = response.data.list;
        this.total = Number.parseInt(response.data.total);
        this.loading = false;
      });
    },
    // 地址处理
    addressHand(row) {
      return `${row.area1Name}-${row.area2Name}-${row.area3Name}-${row.storeAddress}`
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 添加按钮操作 */
    handleAdd() {
      this.form = {
        status: 1
      };
      this.open = true;
      this.isEdit = false;
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.form = row ? _.assign({},row) : _.assign({},this.ids[0]);
      this.isEdit = true;
      this.open = true;
    },
    /** 云店删除 */
    handleDelete(row) {
      let ids;
      if (row.id) {
        ids = [row.id];
      } else {
        ids = this.ids.map((item) => item.id);
      }
      const storeName = row.storeName || this.ids.map((item) => item.storeName);
      this.$confirm('是否确认删除店铺名称为"' + storeName + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delBindStore({ ids: ids });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
  },
};
</script>