<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-03 14:03:38
 * @Description  : 订单管理 - 订单列表
-->
<template>
  <div class="app-container">
    <el-row :gutter="10"
            class="mb8">
      <el-col :span="23"
              class="d-flex-algin-center">
        <el-col :span="3">
          <el-input v-model="queryParams.phone"
                    placeholder="请输入手机号"
                    clearable
                    size="small"
                    class="mr5"
                    @keyup.enter.native="handleQuery" />
        </el-col>
        <el-col :span="4">
          <el-input v-model="queryParams.orderNo"
                    placeholder="请输入订单号"
                    clearable
                    size="small"
                    class="mr5"
                    @keyup.enter.native="handleQuery" />
        </el-col>
        <el-col :span="3">
          <el-select clearable
                     class="mr5"
                     v-model="queryParams.status"
                     placeholder="请选择订单状态"
                     @change="handleQuery">
            <el-option v-for="item in Dict.ORDERS_STATUS"
                       :key="item.key"
                       :label="item.value"
                       :value="item.key">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select clearable
                     class="mr5"
                     v-model="queryParams.bsType"
                     placeholder="请选择订单类型"
                     @change="handleQuery">
            <el-option v-for="item in Dict.BUS_TYPE_DICT"
                       :key="item.key"
                       :label="item.value"
                       :value="item.key">
            </el-option>
          </el-select>
        </el-col>
        <el-date-picker v-model="dateRange"
                        size="small"
                        style="width: 310px"
                        class="mr5"
                        value-format="yyyy-MM-dd HH:mm"
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"></el-date-picker>
        <el-button type="cyan"
                   icon="el-icon-search"
                   size="mini"
                   @click="handleQuery">搜索</el-button>
        <el-button type="success"
                   icon="el-icon-download"
                   size="mini"
                   :loading="loadingExportExcel"
                   @click="handledownloadExl">导出excel</el-button>
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
              :height="tableHeight"
              @row-dblclick="handleViews">
      <!-- <el-table-column type="selection" width="50" align="center" fixed /> -->
      <el-table-column label="序号"
                       type="index"
                       width="60"
                       align="center"
                       fixed />
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
            <!-- <span v-if="v.prop === 'status'">{{
              filterKeyToValue(scope.row[v.prop], "GOODS_STATUS")
            }}</span> -->
            <el-tag v-if="v.prop === 'status'"
                    :type="Dict.ORDERS_STATUS[scope.row[v.prop]].type"
                    size="small">{{ Dict.ORDERS_STATUS[scope.row[v.prop]].value }}</el-tag>
            <el-tag v-else-if="v.prop === 'integralType'"
                    :type="
                scope.row[v.prop] == null
                  ? ''
                  : Dict.INTEGRAL_TYPE[scope.row[v.prop]].type
              "
                    size="small">{{
                scope.row[v.prop] == null
                  ? ""
                  : Dict.INTEGRAL_TYPE[scope.row[v.prop]].value
              }}</el-tag>
            <span v-else-if="v.prop === 'createTime'">{{
              parseTime(scope.row[v.prop])
            }}</span>
            <span v-else>{{ scope.row[v.prop] }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column fixed="right"
                       label="操作"
                       align="center"
                       width="180"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-view"
                     @click="handleViews(scope.row)">订单详情</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-position"
                     @click="handleSendOut(scope.row)"
                     v-if="scope.row.status == 1">发货</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-position"
                     @click="handleEditSendOut(scope.row)"
                     v-if="scope.row.status == 2">修改物流</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     v-if="scope.row.status == 0"
                     @click="updateAmount(scope.row)">修改金额</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <el-dialog title="金额修改"
               :visible.sync="dialogVisible"
               width="30%"
               :before-close="handleClose">
      <el-form label-width="100px"
               :model="updateAmountForm"
               class="demo-form-inline">
        <el-form-item label="修改订单金额">
          <el-input type="number"
                    v-model="updateAmountForm.payAmount"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- <el-button type="primary" @click="onSubmit">查询</el-button> -->
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="orderUpdateAmount">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 发货弹窗 -->
    <DeliveryDialog v-if="open"
                    :open="open"
                    :isEdit="isEdit"
                    :form="form"
                    @submit="submit"
                    @cancel="cancel" />
  </div>
</template>

<script>
import { getOrdersPageList, orderUpdateAmount, getOrdersDetail, orderDelivery, getOrderAdminList } from "@/api/orders";
import { appBusinessDictList } from "@/api/login";
import { downloadOrderExl } from "@/api/upload";
import DeliveryDialog from "./components/DeliveryDialog";
// 默认表格展示列
const defaultColumns = [
  {
    label: "订单号",
    show: true,
    prop: "orderNo",
    align: "center",
    width: 200,
  },
  {
    label: "用户名称",
    show: true,
    prop: "userName",
    align: "left",
    width: 140,
  },
  {
    label: "商品名称",
    show: true,
    prop: "goodsName",
    align: "left",
  },
  {
    label: "数量",
    show: true,
    prop: "goodsNum",
    align: "right",
    width: 60,
  },
  {
    label: "销售价",
    show: true,
    prop: "salePrice",
    align: "right",
    width: 90,
  },
  {
    label: "结算价",
    show: true,
    prop: "settlePrice",
    align: "right",
    width: 100,
  },
  {
    label: "积分类型",
    show: true,
    prop: "integralType",
    align: "center",
    width: 100,
  },
  {
    label: "积分",
    show: true,
    prop: "integral",
    align: "right",
    width: 80,
  },

  {
    label: "创建时间",
    show: true,
    prop: "createTime",
    align: "center",
    width: 170,
  },
  {
    label: "订单状态",
    show: true,
    prop: "status",
    align: "center",
    width: 100,
  },
];

export default {
  name: "OrdersIndex",
  components: {
    DeliveryDialog,
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
      // 浏览图
      previewSrcList: [],
      // 修改金额弹框
      dialogVisible: false,
      dialogExecl: false,
      updateAmountForm: {},
      loadingExportExcel: false,
      // 收货人信息
      orderAddress: null,
      orderNo: null,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    };
  },
  created () {
    this.getList();
  },
  methods: {
    // 订单发货
    async handleSendOut (row) {
      // console.log(row)
      this.orderAddress = await this.getOrderDetail(row.orderNo);
      // console.log(this.orderAddress)
      this.form = {
        orderNo: row.orderNo,
        deliveryNo: null,
        deliveryName: null,
        contactTel: this.orderAddress.phone,
        contactPerson: this.orderAddress.userName,
        contactAddress: this.orderAddress.address,
      };
      this.open = true;
      this.isEdit = false;
    },
    async handleEditSendOut (row) {
      console.log(row);
      let delivery = await this.orderDelivery(row.orderNo);
      // console.log(this.orderAddress)
      this.form = {
        orderNo: delivery.orderNo,
        deliveryNo: delivery.deliveryNo,
        deliveryName: delivery.deliveryName,
        contactTel: delivery.contactTel,
        contactPerson: delivery.contactPerson,
        contactAddress: delivery.contactAddress,
      };
      this.open = true;
      this.isEdit = true
    },
    /** 发货成功 */
    submit () {
      this.getList();
      this.open = false;
    },
    /** 关闭弹窗 */
    cancel () {
      this.open = false;
      this.form = {}
    },
    /** 获取订单详情 */
    getOrderDetail (orderNo) {
      return new Promise((resolve, reject) => {
        getOrdersDetail({ orderNo: orderNo }).then(res => {
          // this.orderAddress = res.data.omsOrderAddress;
          resolve(res.data.omsOrderAddress)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /** 获取物流详情 */
    orderDelivery (orderNo) {
      return new Promise((resolve, reject) => {
        orderDelivery({ orderNo: orderNo }).then(res => {
          // this.orderAddress = res.data.omsOrderAddress;
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /** 查询商品列表 */
    getList () {
      this.loading = true;
      this.queryParams.beginTime = '';
      this.queryParams.stopTime = '';
      delete this.queryParams.endTime
      if (null != this.dateRange && '' != this.dateRange) {
        this.queryParams.beginTime = this.dateRange[0];
        this.queryParams.stopTime = this.dateRange[1];
      }
      // this.queryParams.storeId = '';
      console.log(this.queryParams)

      getOrderAdminList(this.queryParams).then((response) => {
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
    /** 多选框选中数据 */
    handleSelectionChange (selection) {
      this.ids = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 查看订单按钮操作 */
    handleViews (row) {
      // console.log(row)
      const orderNo = row.orderNo || this.ids.map((item) => item.orderNo);
      const orderParent = row.orderParent || this.ids.map((item) => item.orderParent);
      this.$router.push({ name: "OrdersDetail", query: { orderNo: orderNo, orderParent: orderParent } });
    },
    // 修改金额弹框
    updateAmount (row) {
      this.dialogVisible = true;
      this.updateAmountForm = row;
      console.log(777, row);
    },
    // 确定修改
    orderUpdateAmount () {
      let obj = {
        amount: this.updateAmountForm.payAmount,
        id: this.updateAmountForm.id,
      };
      console.log(obj);
      orderUpdateAmount(obj).then((res) => {
        if (res.code == 200) {
          this.dialogVisible = false;
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.getList();
        }
      });
    },
    // 修改金额弹框关闭
    handleClose (done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => { });
    },
    // 导出exl表
    handledownloadExl () {
      this.loadingExportExcel = true
      this.msg = this.$message({
        message: "正在下载,请稍等",
        type: "warning",
        duration: 0,
      });

      // this.addDateRange(this.queryParams, this.dateRange)
      delete this.queryParams.stopTime
      downloadOrderExl(this.addDateRange(this.queryParams, this.dateRange)).then((res) => {
        this.download("订单列表Excel", res);
        this.msg.close();
        this.loadingExportExcel = false
      }).catch(err => {
        this.msg.close();
        this.loadingExportExcel = false
      });
    },
  },
};
</script>