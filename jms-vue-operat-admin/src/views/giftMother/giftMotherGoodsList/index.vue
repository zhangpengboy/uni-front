<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-03 14:03:38
 * @Description  : 礼券妈妈-商品列表
-->
<template>
  <div class="app-container">
    <el-row :gutter="10" :span="24" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-sell"
          size="mini"
          @click="handleGoodsPush"
          >推送商品</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="multiple"
          @click="handleUpdate"
          >批量修改</el-button
        >
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-coin"
          size="mini"
          :disabled="multipleEarnings"
          :loading="loadingEarnings"
          @click="handleEarningsDown"
          >收益发放</el-button
        >
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-upload2"
          size="mini"
          :loading="loadingExportExcel"
          @click="handleExport"
          >导出Excel</el-button
        >
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-upload2"
          size="mini"
          :loading="loadingExportStore"
          @click="handleStoreExport"
          >导出店铺码</el-button
        >
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-s-operation"
          size="mini"
          @click="handleSumConfig"
          >分润总配置</el-button
        >
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          >批量删除</el-button
        >
      </el-col>
    </el-row>
    <el-row :span="24" class="mb8">
      <el-col :span="18" class="d-flex-algin-center">
        <el-input
          v-model="queryParams.goodsName"
          placeholder="请输入商品名称进行查询"
          clearable
          size="small"
          class="mr5"
          @keyup.enter.native="handleQuery"
        />
        <el-input
          v-model="queryParams.supplierName"
          placeholder="请输入供应商名称进行查询"
          clearable
          size="small"
          class="mr5"
          @keyup.enter.native="handleQuery"
        />
        <el-input
          v-model="queryParams.storeName"
          placeholder="请输入店铺名称进行查询"
          clearable
          size="small"
          class="mr5"
          @keyup.enter.native="handleQuery"
        />
        <el-select
          style="width:100%;"
          class="mr5"
          clearable
          v-model="queryParams.status"
          placeholder="请根据商品状态进行搜索"
          @change="handleQuery"
        >
          <el-option
            v-for="item in Dict.GIFT_MOTHER_STORE_GOODS_STATUS"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          >
          </el-option>
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
    <!-- @row-dblclick="handleUpdate" -->
    <el-table
      v-loading="loading"
      :data="list"
      @selection-change="handleSelectionChange"
      border
      :key="key"
      :height="tableHeight - 28"
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
            <span size="small" v-if="scope.row.cloudStore && v.prop === 'cloudStore'">{{
              scope.row.cloudStore.storeName

            }}</span>
            <span size="small" v-else-if="v.prop === 'goods'">{{
              scope.row.goods.goodsName
            }}</span>
            <el-tag
              :type="Dict.GIFT_MOTHER_STORE_GOODS_STATUS[scope.row[v.prop]].type"
              size="small"
              v-else-if="v.prop === 'status'"
              >{{
                Dict.GIFT_MOTHER_STORE_GOODS_STATUS[scope.row[v.prop]].value
              }}</el-tag
            >
            <span v-else-if="v.prop === 'incomeTime'">{{
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
        label="操作"
        align="center"
        width="280"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleGoodsDetails(scope.row)"
            >详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            :disabled="disabledDownload"
            @click="handleGoodsExport(scope.row)"
            >下载商品码</el-button
          > -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-operation"
            @click="handleConfig(scope.row)"
            >分润配置</el-button
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
    <!-- 添加或修改分润配置对话框 -->
    <IncomeConfigDialog
      :isEdit="isEdit"
      :open="openIncomeConfig"
      :form="formIncomeConfig"
      
      @submit="getList()"
      @cancel="cancel()"
    ></IncomeConfigDialog>
    <!-- 推送商品到礼券妈妈对话框 -->
    <PushGoodsDialog
      :isEdit="isEdit"
      :open="open"
      :form="form"
      @submit="getList()"
      @cancel="cancel()"
    ></PushGoodsDialog>
    <!-- 添加或修改收益发放对话框 -->
    <EarningsDialog
      :isEdit="isEdit"
      :open="openEarnings"
      :form="formEarnings"
      :multiple="false"
      @submit="getList()"
      @cancel="cancel()"
    ></EarningsDialog>
    <!-- 详情弹框 -->
    <el-dialog
      title="商品详情"
      :visible.sync="detailDialog"
      width="60%"
      v-el-dialog-drag
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="text" v-if="rowDetail">
        <p>
          <span class="font-weight-7">供应商：</span
          ><span class="mr20">{{ rowDetail.supplierName }}</span>
          <span class="font-weight-7">状态：</span>
          <el-tag
            :type="Dict.GIFT_MOTHER_STORE_GOODS_STATUS[rowDetail.status || 0].type"
            size="small"
            >{{
              Dict.GIFT_MOTHER_STORE_GOODS_STATUS[rowDetail.status || 0].value
            }}</el-tag
          >
          <span class="font-weight-7 m20">结束时间：</span
          ><span>{{ parseTime(rowDetail.endTime) }}</span>
        </p>
        <el-tabs v-model="activeName">
          <el-tab-pane label="店铺详情" name="store">
            <el-form label-width="100px" label-suffix=":">
              <!-- <el-col :span="12">
                <el-form-item label="店东姓名">
                  <el-input
                    :value="rowDetail.cloudStore.storeOwnerName"
                    readonly
                  ></el-input>
                </el-form-item>
              </el-col> -->
              <!-- <el-col :span="12">
                <el-form-item label="商户手机号">
                  <el-input
                    :value="rowDetail.cloudStore.storePhone"
                    readonly
                  ></el-input>
                </el-form-item>
              </el-col> -->
              <!-- <el-col :span="12">
                <el-form-item label="店铺类别">
                  <el-input
                    :value="rowDetail.cloudStore.storeCategoryName"
                    readonly
                  ></el-input>
                </el-form-item>
              </el-col> -->
              <el-col :span="12">
                <el-form-item label="店铺名称">
                  <el-input
                    :value="rowDetail.storeName"
                    readonly
                  ></el-input>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="24">
                <el-form-item label="店铺地址">
                  <el-input
                    readonly
                    :value="addressHand(rowDetail.cloudStore)"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="店铺状态">
                  <el-tag
                    :type="Dict.STATE[rowDetail.cloudStore.status].type"
                    size="small"
                    >{{
                      Dict.STATE[rowDetail.cloudStore.status].value
                    }}</el-tag
                  >
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="店铺门店照">
                  <img
                    v-if="rowDetail.cloudStore.storesImg"
                    :src="rowDetail.cloudStore.storesImg"
                    class="avatar"
                  />
                </el-form-item>
              </el-col> -->
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="商品详情" name="goods">
            <el-form label-width="120px" label-suffix=":">
              <el-col :span="12">
                <el-form-item label="商品编号">
                  <el-input
                    :value="rowDetail.goods.goodsNo"
                    readonly
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品名称">
                  <el-input
                    :value="rowDetail.goods.goodsName"
                    readonly
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品标题">
                  <el-input
                    :value="rowDetail.goods.goodsTitle"
                    readonly
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品角标">
                  <el-input
                    :value="
                      filterKeyToValue(rowDetail.goods.goodsMark, 'GOODS_MARK')
                    "
                    readonly
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="商品类别">
                  <el-input
                    :value="goodsHand(rowDetail.goods)"
                    readonly
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="店铺角色">
                  <el-input
                    :value="
                      filterKeyToValue(rowDetail.goods.roleCode, 'ROLECODE')
                    "
                    readonly
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="市场价">
                  <el-input :value="rowDetail.goods.marketPrice" readonly
                    ><template slot="append">元</template></el-input
                  >
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="
                    filterKeyToValue(
                      rowDetail.goods.integralType,
                      'INTEGRAL_TYPE'
                    ) + '礼券'
                  "
                >
                  <el-input
                    :value="rowDetail.goods.integral"
                    readonly
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="销售价">
                  <el-input :value="rowDetail.goods.salePrice" readonly
                    ><template slot="append">元</template></el-input
                  >
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="邮费">
                  <el-input :value="rowDetail.goods.postage" readonly
                    ><template slot="append">元</template></el-input
                  >
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="商品状态">
                  <el-tag
                    YES_NO
                    :type="
                      Dict.GOODS_STATUS[
                        rowDetail.goods.status ? rowDetail.goods.status  : 1
                      ].type
                    "
                    size="small"
                    >{{
                      Dict.GOODS_STATUS[
                        rowDetail.goods.status ? rowDetail.goods.status  : 1
                      ].value
                    }}</el-tag
                  >
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="是否参与活动">
                  <el-tag
                    :type="
                      Dict.YES_NO[
                        rowDetail.goods.actived ? rowDetail.goods.actived : 0
                      ].type
                    "
                    size="small"
                    >{{
                      Dict.YES_NO[
                        rowDetail.goods.actived ? rowDetail.goods.actived : 0
                      ].value
                    }}</el-tag
                  >
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="rowDetail.goods.actived === 1">
                <el-form-item label="活动名称">
                  <el-input
                    :value="activedHand(rowDetail.goods)"
                    readonly
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品缩略图">
                  <img
                    v-if="rowDetail.goods.goodsIcon"
                    :src="rowDetail.goods.goodsIcon"
                    class="avatar"
                  />
                </el-form-item>
              </el-col>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getGoodsGiftMotherList,
  delGiftMotherGoods,
  exportCloudStoreExcel,
  downloadGoodsQrcode,
  getIncomeGiftMotherDetail,
  incomeDistribution
} from "@/api/goods";
import { downLoadZip } from "@/utils/zipdownload";
import Qs from 'qs'
// 默认表格展示列
const defaultColumns = [
  {
    label: "店铺名称",
    show: true,
    prop: "storeName",
    align: "center",
  },
  {
    label: "商品名称",
    show: true,
    prop: "goods",
    align: "center",
  },
  {
    label: "供应商名称",
    show: true,
    prop: "supplierName",
    align: "center",
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
import PushGoodsDialog from "../components/PushGoodsDialog";
import IncomeConfigDialog from "../components/IncomeConfigDialog";
import EarningsDialog from "../components/EarningsDialog";
export default {
  name: "GiftMotherGoodsList",
  components: {
    PushGoodsDialog,
    IncomeConfigDialog,
    EarningsDialog
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
      multipleEarnings: true, // 收益发放禁用
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 是否显示弹出层
      open: false,
      openIncomeConfig: false, // 分润配置弹框开关
      openEarnings: false, // 收益发放弹框开关
      // 是否是修改弹出层
      isEdit: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: _.cloneDeep(this.Dict.QUERY_PARAMS),
      // 表单参数
      form: {},
      formIncomeConfig: {
        config: {
          C:{amount:null,desc:null},
          S:{amount:null,desc:null},
          M1:{amount:null,desc:null},
          M2:{amount:null,desc:null},
          M3:{amount:null,desc:null}
        },
      }, // 分润配置表单数据
      // :{'type':'1','amount':'0.1','transNow':true,'incomeType':'1','desc':'礼券妈妈'},
          // M1:{'type':'1','amount':'0.01','transNow':true,'incomeType':'1','desc':'区代理'},
          // M2:{'type':'1','amount':'0.005','transNow':true,'incomeType':'1','desc':'市代理'},
          // M3:{'type':'1','amount':'0.001','transNow':true,'incomeType':'1','desc':'省代理'}
      formEarnings: {}, // 收益发放表单数据
       
      // 表格key
      key: 1,
      // 自定义表格列表
      columns: _.cloneDeep(defaultColumns),
      detailDialog: false,
      rowDetail: null, //商品详情
      activeName: "store",
      integralName: "", // 积分名称
      loadingExportExcel: false, // 导出Excel按钮加载状态
      loadingExportStore: false, // 导出店铺码按钮加载状态
      disabledDownload: false, // 下载商品码按钮加载状态
      loadingEarnings: false, // 收益发放按钮加载状态
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询商品列表 */
    getList() {
      this.loading = true;
      getGoodsGiftMotherList(this.queryParams).then((response) => {
        this.list = response.data.list;
        this.total = Number.parseInt(response.data.total);
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.openIncomeConfig = false;
      this.openEarnings = false;
      this.form = {}
      this.formIncomeConfig.config = {
        C:{amount:null,desc:null},
        S:{amount:null,desc:null},
        M1:{amount:null,desc:null},
        M2:{amount:null,desc:null},
        M3:{amount:null,desc:null}
      };
    },
    // 地址处理
    addressHand(row) {
      if (row) {
        return `${row.area1Name}-${row.area2Name}-${row.area3Name}-${row.storeAddress}`;
      }
    },
    // 商品类别处理
    goodsHand(row) {
      if (row) {
        return `${row.primaryCategoryName}-${row.secondaryCategoryName}-${row.level3CategoryName}`;
      }
    },
    // 活动名称处理
    activedHand(row) {
      if (row && row.parentActName) {
        return row.actName
          ? `${row.parentActName}-${row.actName}`
          : `${row.parentActName}`;
      } else {
        return row.actName
      }
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
      if(selection.length != 0 && selection[0].status === 1) {
        this.multipleEarnings = !selection.length 
      }else {
        this.multipleEarnings = true
      }
    },
    /** 推送商品到云店 */
    handleGoodsPush() {
      this.form = {
        weight: 1,
      };
      this.open = true;
      this.isEdit = false;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // const goodsId = row.id || this.ids.map((item) => item.id).toString();
      // this.$router.push({ name: "GoodsDetail", query: { goodsId: goodsId } });
      this.form = _.assign({}, row);
      this.isEdit = true;
      this.open = true;
    },
    /** 删除操作 */
    handleDelete(row) {
      let ids;
      let goodsName
      if (row.id) {
        ids = [row.id];
        goodsName = row.goods.goodsName 
      } else {
        ids = this.ids.filter((v) => v.status != 3).map((item) => item.id);
        goodsName = this.ids.map((item) => item.goods.goodsName);
      }
      if (ids.length <= 0) {
        return this.msgError("选择的数据没有可删除的商品");
      }
      this.$confirm(
        '是否确认删除商品名称为"' + goodsName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delGiftMotherGoods({ ids: ids });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },

    /** 分润单个配置 */
    handleConfig(row) {
      // console.info(row)
      this.openIncomeConfig = true;
      this.isEdit = false;
      getIncomeGiftMotherDetail({goodsId: row.goodsId}).then(res => {
        // this.formIncomeConfig.goodsId = row.goodsId
        if(res.data) {
          this.formIncomeConfig = res.data
          this.formIncomeConfig.config = _.assign({},JSON.parse(res.data.config))
          // console.log(this.formIncomeConfig);
        }
      })
    },

    /** 导出Excel */
    handleExport() {
      this.loadingExportExcel = true
      this.msg = this.$message({
        message: "正在导出Excel,请稍等",
        type: "warning",
        duration: 0,
      });
      let obj = _.cloneDeep(this.queryParams);
      obj.path = "sub/goods/detail/detail";
      // if (this.store.storeRoleCode == 2) {
      //   obj.supplierId = this.store.id;
      // } // obj.storeId
      exportCloudStoreExcel(obj, "operator").then((res) => {
        this.download("数字货架表格", res);
        this.msg.close();
        this.loadingExportExcel = false
      });
    },
    
    /** 查看详情 */
    handleGoodsDetails(row) {
      this.detailDialog = true;
      this.rowDetail = row;
    },

    /** 导出商品码 */
    handleGoodsExport(row) {
      this.disabledDownload = true
      this.msg = this.$message({
        message: "正在下载,请稍等",
        type: "warning",
        duration: 0,
      });
      downloadGoodsQrcode({ path: "sub/goods/detail/detail", scene: row.uuid }).then(
        (res) => {
          let raw = window.atob(res.data);
          let rawLength = raw.length;
          let uInt8Array = new Uint8Array(rawLength);
          for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
          }
          let blob = new Blob([uInt8Array], { type: "image/jpg" });
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

    /** 导出店铺码,数字货架商品下载.Zip */
    async handleStoreExport() {
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
  },
};
</script>
