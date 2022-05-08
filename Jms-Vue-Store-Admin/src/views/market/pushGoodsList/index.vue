<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-03 14:03:38
 * @Description  : 数字货架-货架商品列表
-->
<template>
  <div class="app-container">
    <el-row :gutter="10" :span="24" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-if="store.storeRoleCode != 2"
          type="success"
          icon="el-icon-s-data"
          size="mini"
          :disabled="multiple"
          @click="handleGoodsDown"
          >商品陈列</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-download"
          size="mini"
          @click="handledownloadGoodsImg"
          >批量导出商品码</el-button
        >
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          :loading="loadingExportExcel"
          type="primary"
          icon="el-icon-download"
          size="mini"
          @click="handledownloadExl"
          >导出excel</el-button
        >
      </el-col>
      <el-col v-if="store.storeRoleCode == 2" :span="1.5">
        <el-button
          :loading="loadingExportStore"
          type="primary"
          icon="el-icon-download"
          size="mini"
          @click="downloadStoreZIP"
          >批量导出店铺码</el-button
        >
      </el-col>
    </el-row>
    <el-row :gutter="10" :span="24" class="mb8">
      <el-col :span="14" class="d-flex-algin-center">
        <el-input
          v-model="queryParams.goodsName"
          placeholder="请输入商品名称进行查询"
          clearable
          size="small"
          class="mr5"
          @keyup.enter.native="handleQuery"
        />
        <el-input
          v-model="queryParams.storeName"
          :placeholder="
            store.storeRoleCode == 2
              ? '请输入店铺名称查询'
              : '请输入供应商名称查询'
          "
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
      :height="tableHeight-35"
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
            <span size="small" v-if="v.prop === 'goods'">{{
              scope.row.goods.goodsName
            }}</span>
            <span size="small" v-else-if="v.prop === 'cloudStore'">{{
              scope.row.cloudStore == null
                ? "大海"
                : scope.row.cloudStore.storeName
            }}</span>
            <span size="small" v-else-if="v.prop === 'salePrice'">{{
              scope.row.goods.salePrice
            }}</span>
            <el-tag
              :type="Dict.CLOUD_STORE_GOODS_STATUS[scope.row[v.prop]].type"
              size="small"
              v-else-if="v.prop === 'status'"
              >{{
                Dict.CLOUD_STORE_GOODS_STATUS[scope.row[v.prop]].value
              }}</el-tag
            >
            <span v-else-if="v.prop === 'createTime'">{{
              parseTime(scope.row[v.prop])
            }}</span>
            <span v-else-if="v.prop === 'endTime'">{{
              parseTime(scope.row[v.prop])
            }}</span>
            <span v-else>{{ scope.row[v.prop] }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        width="180"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            :disabled="disabledDownload"
            @click="handledownload(scope.row)"
            >导出商品二维码</el-button
          >
          <el-button
            v-if="store.storeRoleCode != 2"
            :disabled="scope.row.status == 1 || scope.row.status == 2"
            size="mini"
            type="text"
            icon="el-icon-s-data"
            @click="handleGoodsDown(scope.row)"
            >陈列</el-button
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
import {
  getPushGoodsList,
  delPushGoods,
  updateCloudStoreStatus,
} from "@/api/goods";
// 默认表格展示列
const defaultColumns = [
  {
    label: "供应商名称",
    show: true,
    prop: "supplierName",
    align: "center",
  },
  {
    label: "店铺名称",
    show: true,
    prop: "cloudStore",
    align: "center",
  },
  {
    label: "商品名称",
    show: true,
    prop: "goods",
    align: "center",
  },
  {
    label: "商品价格",
    show: true,
    prop: "salePrice",
    align: "center",
    width: 150,
  },
  {
    label: "状态",
    show: true,
    prop: "status",
    align: "center",
    width: 100,
  },
  {
    label: "结束时间",
    show: true,
    prop: "endTime",
    align: "center",
    width: 160,
  },
];
import { mapGetters } from "vuex";
import { downloadQRImg, downloadExl } from "@/api/upload";
import { downLoadZip } from "@/utils/zipdownload";
import Qs from "qs";
// import PushGoodsDialog from "../components/PushGoodsDialog";
export default {
  name: "PushGoodsList",
  // components: {
  //   PushGoodsDialog,
  // },
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
      // 自定义表格列表
      columns: _.cloneDeep(defaultColumns),
      loadingExportExcel: false,
      loadingExportStore: false,
      disabledDownload: false
    };
  },
  computed: {
    ...mapGetters(["store"]),
  },
  mounted() {
    this.getList();
  },
  methods: {
    /** 查询商品列表 */
    getList() {
      this.loading = true;
      if (this.store.storeRoleCode == 2) {
        this.queryParams.supplierId = this.store.id;
        delete this.queryParams.storeId;
      } else {
        this.queryParams.storeId = this.store.id;
      }
      getPushGoodsList(this.queryParams).then((response) => {
        this.list = response.data.list;
        this.total = Number.parseInt(response.data.total);
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      // 供应商
      if (this.store.storeRoleCode != 2) {
        this.queryParams.supplierName = this.queryParams.storeName;
        delete this.queryParams.storeName;
      }
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 单独导出商品二维码
    handledownload(row) {
      this.disabledDownload = true
      this.msg = this.$message({
        message: "正在下载,请稍等",
        type: "warning",
        duration: 0,
      });
      downloadQRImg({ path: "sub/goods/detail/detail", scene: row.uuid }).then(
        (res) => {
          let raw = window.atob(res.data);
          let rawLength = raw.length;
          let uInt8Array = new Uint8Array(rawLength);
          for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
          }
          let blob = new Blob([uInt8Array], { type: "image/png" });
          console.log(blob);
          let aLink = document.createElement("a");
          let evt = document.createEvent("HTMLEvents");
          // console.log("点击下载", evt);
          evt.initEvent("click", true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
          aLink.download = row.goods.goodsName + ".png";
          aLink.href = URL.createObjectURL(blob);
          aLink.click();
          this.msg.close();
          this.disabledDownload = false
        }
      ).catch(err => {
        this.msg.close();
        this.disabledDownload = false
      })
    },
    // 批量导出商品二维码
    handledownloadGoodsImg() {
      console.log("暂无");
    },
    //批量导出店铺码 数字货架商品下载.Zip
    // downloadStoreZIP() {
    //   let obj = _.cloneDeep(this.queryParams);
    //   obj.path = "sub/goods/detail/detail";
    //   delete obj.storeId;
    //   downLoadZip("/api-goods/cloudStore/download?" + Qs.stringify(obj));
    // },
    /** 导出店铺码,数字货架商品下载.Zip */
    async downloadStoreZIP() {
      this.loadingExportStore = true
      this.msg = this.$message({
        message: "正在导出店铺码,请稍等",
        type: "warning",
        duration: 0,
      });
      let obj = _.cloneDeep(this.queryParams)
      obj.path = 'sub/goods/detail/detail'
      delete obj.storeId
      await downLoadZip("/api-goods/cloudStore/download?"+ Qs.stringify(obj))
      this.msg.close();
      this.loadingExportStore = false
    },
    // 导出exl表
    handledownloadExl() {
      this.loadingExportExcel = true
      this.msg = this.$message({
        message: "正在下载,请稍等",
        type: "warning",
        duration: 0,
      });
      let obj = _.cloneDeep(this.queryParams);
      obj.path = "sub/goods/detail/detail";
      if (this.store.storeRoleCode == 2) {
        obj.supplierId = this.store.id;
      }
      downloadExl(obj, "supplier").then((res) => {
        this.download("数字货架表格", res);
        this.msg.close();
        this.loadingExportExcel = false
      }).catch(() => {
        this.msg.close();
        this.loadingExportExcel = false
      })
    },
    /** 商品陈列 */
    handleGoodsDown(row) {
      let ids;
      if (row.id) {
        ids = [row.id];
      } else {
        ids = this.ids.filter((v) => v.status == 0).map((item) => item.id);
      }
      if (ids.length <= 0) {
        return this.msgError("选择的商品没有可陈列商品");
      }
      this.$confirm("是否确认陈列商品?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return updateCloudStoreStatus({ ids: ids, status: 1 });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("陈列成功");
        })
        .catch(function () {});
    },
  },
};
</script>
