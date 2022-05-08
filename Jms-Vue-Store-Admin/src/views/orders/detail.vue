<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-12-15 16:29:50
 * @Description  : 订单管理 - 订单详情
-->
<template>
  <div class="app-container order">
    <!-- 收货人信息 -->
    <el-card shadow="never"
             class="order-card"
             v-if="orderAddress">
      <div slot="header">
        <span>收货人信息</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="8"
                class="order-wrap">
          <div class="label">收货人：</div>
          <div class="value">{{ orderAddress.userName }}</div>
        </el-col>
        <el-col :span="8"
                class="order-wrap">
          <div class="label">电话：</div>
          <div class="value">{{ orderAddress.phone }}</div>
        </el-col>
        <el-col :span="8"
                class="order-wrap">
          <div class="label">收货地址：</div>
          <div class="value">{{ orderAddress.address }}</div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 商品信息 -->
    <el-card shadow="never"
             class="order-card"
             v-if="orderDetail">
      <div slot="header">
        <span>商品信息</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="24"
                class="order-wrap">
          <div class="label">商品图片：</div>
          <div class="value">
            <el-image style="width: 100px; height: 100px"
                      :src="orderDetail.goodsSkuIcon"
                      :preview-src-list="[orderDetail.goodsSkuIcon]">
            </el-image>
          </div>
        </el-col>
        <el-col :span="8"
                class="order-wrap">
          <div class="label">商品名称：</div>
          <div class="value">{{ orderDetail.goodsName }}</div>
        </el-col>
        <el-col :span="8"
                class="order-wrap">
          <div class="label">规格：</div>
          <div class="value">{{ orderDetail.goodsSkuName }}</div>
        </el-col>
        <el-col :span="8"
                class="order-wrap">
          <div class="label">商品数量：</div>
          <div class="value">{{ orderDetail.goodsNum }}</div>
        </el-col>
        <el-col :span="8"
                class="order-wrap">
          <div class="label">市场价：</div>
          <div class="value">&yen;{{ orderDetail.marketPrice }}</div>
        </el-col>
        <el-col :span="8"
                class="order-wrap">
          <div class="label">销售价：</div>
          <div class="value">&yen;{{ orderDetail.salePrice }}</div>
        </el-col>
        <el-col :span="8"
                class="order-wrap">
          <div class="label">运费：</div>
          <div class="value">&yen;{{ order.postage }}</div>
        </el-col>
        <el-col :span="8"
                class="order-wrap">
          <div class="label">
            {{ Dict.INTEGRAL_TYPE[orderDetail.integralType].value }}积分：
          </div>
          <div class="value">{{ orderDetail.integral }}</div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 订单信息 -->
    <el-card shadow="never"
             class="order-card"
             v-if="order">
      <div slot="header">
        <span>订单信息</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="8"
                class="order-wrap">
          <div class="label">店铺名称：</div>
          <div class="value">{{ order.storeName }}</div>
        </el-col>

        <el-col :span="8"
                class="order-wrap">
          <div class="label">订单编号：</div>
          <div class="value">{{ order.orderNo }}</div>
        </el-col>

        <el-col :span="8"
                class="order-wrap"
                v-if="orderApply">
          <div class="label">退款状态：</div>
          <div class="value">
            <el-tag :type="Dict.RETURN_APPLY_STATUS[orderApply.status].type"
                    size="small">{{ Dict.RETURN_APPLY_STATUS[orderApply.status].value }}</el-tag>
          </div>
        </el-col>
        <el-col :span="8"
                class="order-wrap"
                v-else>
          <div class="label">订单状态：</div>
          <div class="value">
            <el-tag :type="Dict.ORDERS_STATUS[order.status].type"
                    size="small">{{ Dict.ORDERS_STATUS[order.status].value }}</el-tag>
          </div>
        </el-col>
        <el-col :span="8"
                class="order-wrap">
          <div class="label">用户名称：</div>
          <div class="value">{{ order.userName }}</div>
        </el-col>
        <el-col :span="8"
                class="order-wrap">
          <div class="label">商品总价：</div>
          <div class="value">&yen;{{ order.totalAmount }}</div>
        </el-col>
        <el-col :span="8"
                class="order-wrap">
          <div class="label">实际支付：</div>
          <div class="value">&yen;{{ order.payAmount }}</div>
        </el-col>

        <el-col :span="24"
                class="order-wrap">
          <div class="label">订单备注：</div>
          <div class="value">{{ order.note }}</div>
        </el-col>

        <el-col :span="8"
                class="order-wrap"
                v-if="orderApply">
          <div class="label">退款时间：</div>
          <div class="value">{{ parseTime(orderApply.handleTime) }}</div>
        </el-col>
        <el-col :span="8"
                class="order-wrap"
                v-if="orderApply">
          <div class="label">操 作 人：</div>
          <div class="value">{{ orderApply.handleMan }}</div>
        </el-col>
        <el-col :span="8"
                class="order-wrap"
                v-if="orderApply">
          <div class="label">退款备注：</div>
          <div class="value">{{ orderApply.handleNote }}</div>
        </el-col>
        <el-col :span="24"
                class="order-wrap"
                v-if="orderApply">
          <div class="label">退款原因：</div>
          <div class="value">{{ orderApply.reason }}</div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 物流信息 -->
    <el-card shadow="never"
             class="order-card"
             v-if="orderDelivery">
      <div slot="header">
        <span>物流信息</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="8"
                class="order-wrap">
          <div class="label">物流名称：</div>
          <div class="value">{{ orderDelivery.deliveryName }}</div>
        </el-col>
        <el-col :span="8"
                class="order-wrap">
          <div class="label">物流单号：</div>
          <div class="value">{{ orderDelivery.deliveryNo }}</div>
        </el-col>
        <el-col :span="8"
                class="order-wrap">
          <div class="label">物流状态：</div>
          <div class="value">
            <el-tag :type="Dict.DELIVERY_STATUS[orderDelivery.status].type"
                    size="small">{{ Dict.DELIVERY_STATUS[orderDelivery.status].value }}</el-tag>
          </div>
        </el-col>
        <el-col :span="8"
                class="order-wrap">
          <div class="label">收货人姓名：</div>
          <div class="value">{{ orderDelivery.contactPerson }}</div>
        </el-col>
        <el-col :span="8"
                class="order-wrap">
          <div class="label">收货人电话：</div>
          <div class="value">{{ orderDelivery.contactTel }}</div>
        </el-col>
        <el-col :span="8"
                class="order-wrap">
          <div class="label">收货人地址：</div>
          <div class="value">{{ orderDelivery.contactAddress }}</div>
        </el-col>
        <el-col :span="8"
                class="order-wrap">
          <div class="label">发货时间：</div>
          <div class="value">{{ parseTime(orderDelivery.createTime) }}</div>
        </el-col>
        <el-col :span="8"
                class="order-wrap">
          <div class="label">签收时间：</div>
          <div class="value">{{ parseTime(orderDelivery.signInTime) }}</div>
        </el-col>
        <el-col :span="8"
                class="order-wrap">
          <div class="label">改签时间：</div>
          <div class="value">{{ parseTime(orderDelivery.modifiedTime) }}</div>
        </el-col>
        <el-col :span="24"
                class="order-wrap">
          <div class="label">物流备注：</div>
          <div class="value">{{ orderDelivery.note }}</div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 操作按钮 -->
    <div class="order-footer">
      <el-button type="primary"
                 size="small"
                 @click="handleSendOut"
                 v-if="order && order.status == 1 && !orderApply">订单发货</el-button>
      <el-button type="primary"
                 size="small"
                 @click="handleReturnApply(1)"
                 v-if="order && order.status == 7">订单退款</el-button>
      <el-button type="primary"
                 size="small"
                 @click="handleReturnApply(0)"
                 v-if="order && order.status == 7">拒绝退款</el-button>
    </div>

    <!-- 发货弹窗 -->
    <DeliveryDialog v-if="open"
                    :open="open"
                    :form="form"
                    @submit="submit"
                    @cancel="cancel" />
  </div>
</template>
<script>
import {
  getOrdersDetail,
  getReturnApplyDetail,
  confirmReturnApply,
  rejectReturnApply,
} from "@/api/orders";
import DeliveryDialog from "./components/DeliveryDialog";
export default {
  name: "OrdersDetail",
  components: {
    DeliveryDialog,
  },
  data () {
    return {
      // 订单号
      orderNo: null,
      // 订单信息
      order: null,
      // 收货人信息
      orderAddress: null,
      // 订单详情
      orderDetail: null,
      // 订单物流
      orderDelivery: null,
      // 是否显示弹窗
      open: false,
      // 发货表单
      form: {},
      // 退款单信息
      orderApply: null,
      orderParent: null
    };
  },
  mounted () {
    this.orderNo = this.$route.query.orderNo;
    this.orderParent = this.$route.query.orderParent;
    this.getOrderDetail();
  },
  methods: {
    /** 获取订单详情 */
    getOrderDetail () {
      getOrdersDetail({ orderNo: this.orderNo }).then((res) => {
        this.order = res.data.omsOrder;
        this.orderAddress = res.data.omsOrderAddress;
        this.orderDetail = res.data.omsOrderDetail;
        this.orderDelivery = res.data.omsOrderDelivery;
        if (this.order.status == 1) {
          this.getReturnApplyDetail();
        }
      });
    },
    /** 获取退款单信息 */
    getReturnApplyDetail () {
      getReturnApplyDetail({ orderNo: this.orderNo }).then((res) => {
        console.log(res);
        this.orderApply = res.data;
      });
    },
    /** 发货 */
    handleSendOut () {
      this.form = {
        orderNo: this.orderNo,
        deliveryNo: null,
        deliveryName: null,
        contactTel: this.orderAddress.phone,
        contactPerson: this.orderAddress.userName,
        contactAddress: this.orderAddress.address,
      };
      this.open = true;
    },
    /** 确定退款 */
    handleReturnApply (index) {
      this.$prompt(`请输入${index == 0 ? "拒绝退款" : "退款"}说明`, "提示", {
        confirmButtonText: `${index == 0 ? "拒绝" : "确定"}退款`,
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          if (index == 0) {
            if (this.orderNo == this.orderParent) {
              orderType = 0
            } else {
              orderType = 1
            }
            rejectReturnApply({ orderNo: this.orderNo, note: value, orderType: orderType }).then(
              (res) => {
                if (res.success) {
                  this.msgSuccess("已拒绝退款");
                  this.$router.push({ name: "OrdersIndex" });
                }
              }
            );
          } else {
            confirmReturnApply({ orderNo: this.orderNo, note: value, orderType: orderType }).then(
              (res) => {
                if (res.success) {
                  this.msgSuccess("退款成功");
                  this.$router.push({ name: "OrdersIndex" });
                }
              }
            );
          }
        })
        .catch(() => { });
    },
    /** 发货成功 */
    submit () {
      this.getOrderDetail();
      this.open = false;
    },
    /** 关闭弹窗 */
    cancel () {
      this.open = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.order {
  &-card {
    margin-bottom: 20px;
  }
  &-wrap {
    display: flex;
    align-items: center;
    font-size: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
    .label {
      white-space: nowrap;
      color: #999;
      margin-right: 10px;
    }
    .value {
      color: #444;
    }
  }
  &-footer {
    padding-top: 10px;
    padding-bottom: 20px;
    padding-left: 20px;
  }
}
</style>