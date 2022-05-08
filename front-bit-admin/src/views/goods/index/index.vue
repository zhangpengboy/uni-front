<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-03 14:03:38
 * @Description  : 商户中心 - 店铺列表
-->
<template>
  <div class="app-container">
    <!-- 按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['']"
          >新增</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
        showRefreshBar
      ></right-toolbar>
    </el-row>
    <!-- 搜索 -->
    <el-form
      class="mb-8"
      :model="queryParams"
      ref="queryForm"
      label-width="80px"
      inline
      size="mini"
      v-show="showSearch"
    >
      <el-form-item label="矿机类型:">
        <el-select
          v-model="queryParams.machineType"
          clearable
          filterable
          @change="handleQuery"
        >
          <el-option
            v-for="(item, index) in bitTypeList"
            :key="index"
            :label="item.machineTypeDes"
            :value="item.machineType"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态:">
        <el-select
          v-model="queryParams.status"
          clearable
          filterable
          @change="handleQuery"
        >
          <el-option
            v-for="(item, index) in Dict.GOODS_STATUS"
            :key="index"
            :label="item.value"
            :value="item.key"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="queryParams.keyword"
          placeholder="请输入关键字进行查询"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="list"
      @selection-change="handleSelectionChange"
      border
      :key="key"
      :height="tableHeight - 30"
      @row-dblclick="handleUpdate"
    >
      <!-- <el-table-column type="selection" width="50" align="center" fixed /> -->
      <el-table-column label="序号" type="index" width="60" align="center" />
      <el-table-column
        prop="productName"
        label="产品名称"
        header-align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="digType"
        label="产品类型"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          {{ filterBitType(row.digType) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="machineType"
        label="矿机类型"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          {{ filterMachineType(row.machineType) }}
        </template>
      </el-table-column>
      <el-table-column
        label="算力"
        align="right"
        header-align="center"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <span>{{ row.hash }}{{ row.hashUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="功耗"
        align="right"
        header-align="center"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <span>{{ row.power }}{{ row.powerUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="num"
        label="剩余数量(台)"
        align="right"
        header-align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="price"
        label="矿机价(CNY)"
        align="right"
        header-align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="powerPrice"
        label="电费单价"
        align="right"
        header-align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="预计日收益" width="280" align="right" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ row.dayNum }}</span>
          <span>≈{{ row.dayUsdt }}USDT</span>
          <span>≈{{ row.dayCny }}CNY</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="prepareTime"
        label="准备天数"
        align="right"
        header-align="center"
      ></el-table-column>
      <!-- <el-table-column label="服务周期" width="100" align="center" header-align="center">
        <template slot-scope="{row}">
          <span>{{row.serviceTime == -1 ? '永久': row.serviceTime}}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="serivceReate" label="管理费" width="80" align="right" header-align="center"></el-table-column> -->
      <!-- <el-table-column prop="expectRate" label="回报率" width="80" align="right" header-align="center"></el-table-column> -->
      <el-table-column
        label="状态"
        align="center"
        header-align="center"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <el-tag :type="Dict.GOODS_STATUS[row.status].type" size="small">
            {{ Dict.GOODS_STATUS[row.status].value }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="创建时间"
        width="160"
        align="center"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ parseTime(row.createTime) }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="操作"
        align="center"
        width="220"
        class-name="small-padding"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleUpdate(scope.row)"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-check"
            @click="handleGoodsPass(scope.row)"
            v-show="scope.row.status == 0"
            >通过</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-close"
            @click="handleGoodsReject(scope.row)"
            v-show="scope.row.status == 0"
            >驳回</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-sell"
            @click="handleGoodsUp(scope.row)"
            v-show="scope.row.status == 2 || scope.row.status == 4"
            >上架</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-sold-out"
            @click="handleGoodsDown(scope.row)"
            v-show="scope.row.status == 3"
            >下架</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            v-show="
              scope.row.status != 2 ||
              scope.row.status != 3 ||
              scope.row.status != 4
            "
            @click="handleDelete(scope.row)"
            >删除</el-button
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
import { getGoodsPageList, updateGoodsStatus } from "@/api/goods";
import { getBitTypeList } from "@/api/system";

export default {
  name: "GoodsIndex",
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
      form: {},
      // 表格key
      key: 1,
      // 浏览图
      previewSrcList: [],
      // 挖矿类型
      bitTypeList: [],
    };
  },
  created() {
    this.getList();

    // 获取挖矿类型列表
    getBitTypeList({ status: 1 }).then((res) => {
      this.bitTypeList = res.data;
    });
  },
  methods: {
    /** 查询产品列表 */
    getList() {
      this.loading = true;
      getGoodsPageList(this.queryParams).then((response) => {
        this.list = response.data.list;
        this.total = Number.parseInt(response.data.total);
        this.loading = false;
      });
    },
    // 筛选矿机类型
    filterMachineType(val) {
      return this.bitTypeList
        .filter((v) => v.machineType == val)
        .map((v) => v.machineTypeDes)
        .toString();
    },
    // 筛选挖矿类型
    filterBitType(val) {
      return this.bitTypeList
        .filter((v) => v.digType == val)
        .map((v) => v.digTypeDes)[0];
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams = _.cloneDeep(this.Dict.QUERY_PARAMS);

      this.handleQuery();
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({ name: "GoodsDetail" });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const productNo = row.productNo || this.ids.map((item) => item.productNo);
      this.$router.push({ name: "GoodsDetail", query: { productNo } });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids.map((item) => item.id);
      this.$confirm('是否确认产品ID为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return updateGoodsStatus({ productId: ids.toString(), status: 6 });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 产品审核通过 */
    handleGoodsPass(row) {
      const ids = row.id || this.ids.map((v) => v.id);
      this.$confirm('是否确认审核产品ID为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return updateGoodsStatus({ productId: ids.toString(), status: 2 });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("审核成功");
        });
    },
    /** 产品审核驳回 */
    handleGoodsReject(row) {
      const ids = row.id || this.ids.map((v) => v.id);
      this.$confirm('是否确认驳回产品ID为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return updateGoodsStatus({ productId: ids.toString(), status: 5 });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("审核成功");
        });
    },
    /** 产品上架 */
    handleGoodsUp(row) {
      const ids = row.id || this.ids.map((v) => v.id);
      this.$confirm('是否确认上架产品ID为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return updateGoodsStatus({ productId: ids.toString(), status: 3 });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("上架成功");
        });
    },
    /** 产品下架 */
    handleGoodsDown(row) {
      const ids = row.id || this.ids.map((v) => v.id);
      this.$confirm('是否确认下架产品ID为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return updateGoodsStatus({ productId: ids.toString(), status: 4 });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("下架成功");
        });
    },
  },
};
</script>