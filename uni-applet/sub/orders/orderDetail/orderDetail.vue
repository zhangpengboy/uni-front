<template>
	<view class="order">
		<view class="" v-if="orderNo">
			<!-- 顶部 -->
			<view class="order-top" v-if="applyStatus == null">
				<view class="order-top-content">
					<view class="">{{ status | filterOrderStatus }}</view>
				</view>
				<view class="order-top-right">
					<image :src="getImg(status)" class="order-img" mode="widthFix"></image>
				</view>
			</view>
			<view class="order-top" v-else>
				<view class="order-top-content">
					<view class="">{{ applyStatus | filterApplyStatus }}</view>
				</view>
				<view class="order-top-right">
					<image :src="getApplyImg(applyStatus)" class="order-img" mode="widthFix"></image>
				</view>
			</view>

			<!-- 收货地址 -->
			<view class="main-wrap margin-top">
				<view class="main-wrap-box user-address">
					<view class="delivery" v-if="orderData.omsOrderDelivery">
						<view class="text-xxl text-main">
							<text class="cuIcon-taxi"></text>
						</view>
						<view class="margin-left text-sm flex-sub">
							<view class="margin-tb-xs">
								<text>物流公司：</text>
								<text>{{orderData.omsOrderDelivery.deliveryName}}</text>
							</view>
							<view class="margin-tb-xs">
								<text>物流单号：</text>
								<text>{{orderData.omsOrderDelivery.deliveryNo}}</text>
							</view>
						</view>
						<view class="copy">
							<text class="copytxt" @click="handleClipboard">复制单号</text>
						</view>
					</view>
					<view class="base">
						<text class="name">{{orderData.omsOrderAddress.userName}}</text>
						<text class="phone">{{orderData.omsOrderAddress.phone}}</text>
					</view>
					<view class="detail">
						<text class="tips">默认</text>
						<text class="address">{{orderData.omsOrderAddress.address}}</text>
					</view>
				</view>
			</view>

			<!-- 商品信息 -->
			<view class="main-wrap" v-if="orderData.omsOrderDetail">
				<view class="main-wrap-box order-goods">
					<view class="order-goods-box">
						<view class="order-goods-box__left">
							<image :src="orderData.omsOrderDetail.goodsSkuIcon" class="goods-img"></image>
						</view>
						<view class="order-goods-box__right">
							<view class="title">{{orderData.omsOrderDetail.goodsName}}</view>
							<view class="margin-bottom-xs">
								<text class="spec">{{orderData.omsOrderDetail.goodsSkuName}} x
									{{orderData.omsOrderDetail.goodsNum}} </text>
							</view>
							<view class="price text-price">
								<text>{{ orderData.omsOrderDetail.salePrice }}</text>
								<template v-if="orderData.omsOrderDetail.integral > 0">
									<text
										class="text-xs">{{ orderData.omsOrderDetail.integralType | filterIntegralType }}</text>
									<text>{{ orderData.omsOrderDetail.integral }}</text>
									<text class="text-xs">{{ $queue.getIntegralName() }}</text>
								</template>
							</view>
						</view>
					</view>
				</view>
				<view class="cu-list menu">
					<view class="cu-item">
						<view class="content text-gray"><text class="text-df">商品总额</text></view>
						<view class="action text-price">
							<text>{{ orderData.omsOrderDetail.salePrice * orderData.omsOrderDetail.goodsNum }}</text>
							<template v-if="orderData.omsOrderDetail.integral > 0">
								<text
									class="text-xs">{{ orderData.omsOrderDetail.integralType | filterIntegralType }}</text>
								<text>{{ orderData.omsOrderDetail.integral * orderData.omsOrderDetail.goodsNum }}</text>
								<text class="text-xs">{{ $queue.getIntegralName() }}</text>
							</template>
						</view>
					</view>
					<view class="cu-item">
						<view class="content text-gray"><text class="text-df">优惠券</text></view>
						<view class="action" style="color: #EB6133;" v-if="orderData.deductionAmount">
							-{{orderData.deductionAmount}}</view>
						<view class="action" v-else>无</view>
					</view>
					<view class="cu-item">
						<view class="content text-gray"><text class="text-df">邮费</text></view>
						<view class="action text-price">
							{{ orderData.omsOrder.postage * orderData.omsOrderDetail.goodsNum }}
						</view>
						<!-- <view class="action text-price">0</view> -->
					</view>
					<view class="cu-item">
						<view class="content"><text class="text-df">{{status == 0 || status == 4? '需付款' : '已付款'}}</text>
						</view>
						<view class="action text-price text-main">
							<!-- <text v-if="status == 0 || status == 4">{{ orderData.omsOrderDetail.salePrice * orderData.omsOrderDetail.goodsNum }}</text> -->
							<text>{{ orderData.omsOrder.payAmount }}</text>
							<template v-if="orderData.omsOrderDetail.integral > 0">
								<text
									class="text-xs">{{ orderData.omsOrderDetail.integralType | filterIntegralType }}</text>
								<text>{{ orderData.omsOrderDetail.integral * orderData.omsOrderDetail.goodsNum }}</text>
								<text class="text-xs">{{ $queue.getIntegralName() }}</text>
							</template>
						</view>
					</view>
				</view>
			</view>

			<!-- 订单信息 -->
			<view class="main-wrap" v-if="orderData.omsOrder">
				<view class="cu-list menu">
					<view class="cu-item">
						<view class="content text-gray"><text class="text-df">订单编号</text></view>
						<view class="action"><text>{{ orderData.omsOrder.orderNo }}</text><text @click="textPaste"
								style="margin-left: 24upx; color: #EB6133;">复制</text></view>
					</view>
					<view class="cu-item">
						<view class="content text-gray"><text class="text-df">下单时间</text></view>
						<view class="action"><text>{{ parseTime(orderData.omsOrder.createTime) }}</text></view>
					</view>
					<view class="cu-item">
						<view class="content text-gray"><text class="text-df">购买数量</text></view>
						<view class="action"><text>{{ orderData.omsOrderDetail.goodsNum }}</text></view>
					</view>
					<view class="cu-item">
						<view class="content text-gray"><text class="text-df">留言</text></view>
						<view class="action"><text>{{ orderData.omsOrder.note || "" }}</text></view>
					</view>
				</view>
			</view>
		</view>

		<!-- 便利店订单 -->
		<view class="" v-if="orderParent">
			<!-- 顶部 -->
			<view class="order-top" v-if="applyStatus == null">
				<view class="order-top-content">
					<view class="">{{ status | filterOrderStatus }}</view>
				</view>
				<view class="order-top-right">
					<image :src="getImg(status)" class="order-img" mode="widthFix"></image>
				</view>
			</view>
			<view class="order-top" v-else>
				<view class="order-top-content">
					<view class="">{{ applyStatus | filterApplyStatus }}</view>
				</view>
				<view class="order-top-right">
					<image :src="getApplyImg(applyStatus)" class="order-img" mode="widthFix"></image>
				</view>
			</view>
			<template v-if="storeOrderDetail[0].receivingWay && (storeOrderDetail[0].status == 1)">
				<view class="main-wrap qrCode">
					<view class="verification">
						核销码: {{storeOrderDetail[0].loadedCode}}
					</view>
					<view style="">
						<canvas style="margin: 0 auto;width: 352upx;height: 352upx;" canvas-id="couponQrcode"></canvas>
					</view>
					<view class="but" @click="cancelOfOrder('v')">
						自主核销
					</view>
				</view>
			</template>
			<!-- 收货地址 -->
			<view class="main-wrap margin-top">
				<view class="cu-list menu" v-if="storeOrderDetail[0].receivingWay">
					<view class="cu-item" v-if="storeOrderDetail[0].status === 3">
						<view class="content text-gray"><text class="text-df">核销码</text></view>
						<view class="action">
							<text>{{storeOrderDetail[0].loadedCode}}</text>
						</view>
					</view>
					<view class="cu-item">
						<view class="content text-gray"><text class="text-df">自取时间</text></view>
						<view class="action">
							<text>{{ pickuptime }}</text>
						</view>
					</view>
					<view class="cu-item">
						<view class="content text-gray"><text class="text-df">取货人</text></view>
						<view class="action">
							<text>{{ storeOrderDetail[0].userName }}</text>
						</view>
					</view>
					<view class="cu-item">
						<view class="content text-gray"><text class="text-df">取货电话</text></view>
						<view class="action" style="color: #333;">
							{{storeOrderDetail[0].userPhone}}
						</view>
					</view>
					<view class="cu-item">
						<view class="content text-gray"><text class="text-df">提货地址</text></view>
						<view class="action" style="color: #333; width: 72%;text-align: right;">
							{{storeAddress}}
						</view>
					</view>
					<view class="cu-item">
						<view class="content text-gray"><text class="text-df">联系电话</text></view>
						<view class="action" style="color: #333;">
							{{storePhone}}
						</view>
					</view>
				</view>
				<view class="cu-list menu" v-if="!storeOrderDetail[0].receivingWay">
					<view class="cu-item">
						<view class="content text-gray"><text class="text-df">配送地址</text></view>
						<view class="action" style="width: 72%;text-align: right;">
							<text>{{ storeOrderDetail[0].address }}</text>
						</view>
					</view>
					<view class="cu-item">
						<view class="content text-gray"><text class="text-df">联系人</text></view>
						<view class="action" style="color: #333;">
							{{storeOrderDetail[0].userName}}
						</view>
					</view>
					<view class="cu-item">
						<view class="content text-gray"><text class="text-df">联系电话</text></view>
						<view class="action" style="color: #333;">
							{{storeOrderDetail[0].userPhone}}
						</view>
					</view>
				</view>
			</view>
			<!-- 商品信息 -->
			<view class="main-wrap">
				<view class="main-wrap-box order-goods">
					<view class="order-goods-box" style="margin-bottom: 12rpx;" v-for="item in storeOrderDetail"
						:key="item">
						<view class="order-goods-box__left">
							<image :src="item.goodsImg" class="goods-img"></image>
						</view>
						<view class="order-goods-box__right">
							<view class="title">{{item.goodsName}}</view>
							<view class="margin-bottom-xs">
								<text class="spec"> x {{item.goodsNum}} </text>
							</view>
							<view class="price text-price">
								<text>{{ (item.salePrice * item.goodsNum).toFixed(2) }}</text>
								<template v-if="item.integral > 0">
									<text class="text-xs">{{ item.integralType | filterIntegralType }}</text>
									<text>{{ item.integral * item.goodsNum }}</text>
									<text class="text-xs">{{ $queue.getIntegralName() }}</text>
								</template>
							</view>
						</view>
					</view>
				</view>
				<view class="cu-list menu">
					<view class="cu-item">
						<view class="content text-gray"><text class="text-df">商品总额</text></view>
						<view class="action text-price">
							<text>{{ sumObj.amount }}</text>
							<template>
								<text class="text-xs">{{ sumObj.integral > 0 ? 1 : 0 | filterIntegralType }}</text>
								<text>{{ Math.abs(sumObj.integral) }}</text>
								<text class="text-xs">{{ $queue.getIntegralName() }}</text>
							</template>
						</view>
					</view>
					<view class="cu-item">
						<view class="content text-gray"><text class="text-df">优惠券</text></view>
						<view class="action" style="color: #EB6133;" v-if="orderData.deductionAmount">
							-{{orderData.deductionAmount}}</view>
						<view class="action" v-else>无</view>
					</view>
					<view class="cu-item">
						<view class="content text-gray"><text class="text-df">邮费</text></view>
						<view class="action text-price">
							{{ 0 }}
						</view>
						<!-- <view class="action text-price">0</view> -->
					</view>
					<view class="cu-item">
						<view class="content"><text class="text-df">{{status == 0 || status == 4? '需付款' : '已付款'}}</text>
						</view>
						<view class="action text-price text-main">
							<!-- <text v-if="status == 0 || status == 4">{{ orderData.omsOrderDetail.salePrice * orderData.omsOrderDetail.goodsNum }}</text> -->
							<text>{{ sumObj.amount }}</text>
							<template>
								<text class="text-xs">{{ sumObj.integral > 0 ? 1 : 0  | filterIntegralType }}</text>
								<text>{{ Math.abs(sumObj.integral) }}</text>
								<text class="text-xs">{{ $queue.getIntegralName() }}</text>
							</template>
						</view>
					</view>
				</view>
			</view>

			<!-- 订单信息 -->
			<view class="main-wrap">
				<view class="cu-list menu">
					<view class="cu-item">
						<view class="content text-gray"><text class="text-df">订单编号</text></view>
						<view class="action"><text>{{ storeOrderDetail[0].orderParent }}</text><text @click="textPaste"
								style="margin-left: 24upx; color: #EB6133;">复制</text></view>
					</view>
					<view class="cu-item">
						<view class="content text-gray"><text class="text-df">下单时间</text></view>
						<view class="action"><text>{{ time }}</text></view>
					</view>
					<view class="cu-item">
						<view class="content text-gray"><text class="text-df">购买数量</text></view>
						<view class="action"><text>{{ storeOrderDetail[0].goodsNum }}</text></view>
					</view>
					<view class="cu-item">
						<view class="content text-gray"><text class="text-df">留言</text></view>
						<view class="action"><text>{{ storeOrderDetail[0].note || "" }}</text></view>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部操作栏 -->
		<view class="order-goods-footer"
			v-if="(status == 0 || (status == 1 && orderNo) || status == 2) && applyStatus == null">
			<text v-if="status == 0" class="cbtn" @click="cancelOfOrder('c')">取消订单</text>
			<text v-if="status == 0" class="cbtn main" @click="toPayment">立即付款</text>
			<text v-if="status == 1" class="cbtn" @click="showReasonFlag = true">申请退款</text>
			<!-- <text v-if="status == 1" class="cbtn" :class="{main: status == 1}" @click="remindDeliver">提醒发货</text> -->
			<text v-if="status == 2" class="cbtn main" @click="confirmOrder">确认收货</text>
		</view>
		<!-- 退款弹窗 -->
		<view class="cu-modal" :class="showReasonFlag ? 'show' : ''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">退款理由</view>
					<view class="action" @tap="showReasonFlag = false"><text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding">
					<view class="cu-dialog text-left">
						<textarea maxlength="100" v-model="reason" placeholder="请输入退款理由"></textarea>
					</view>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<view class="cu-btn line-red text-red radius" @tap="showReasonFlag = false">取消</view>
						<view class="cu-btn bg-red margin-left radius" @tap="refundGoodsOrder">确定</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		parseTime,
		getLocalTime
	} from '@/common/utils/DateUtils.js';
	const qrCode = require('@/common/utils/weapp-qrcode.js')
	export default {
		filters: {
			filterPayType(type) {
				return ['未支付', '支付宝支付', '微信支付'][type];
			},
			// 订单状态过滤
			filterOrderStatus(status) {
				return ['待付款', '待发货', '待收货', '订单已完成', '交易关闭', '无效的订单', '已退款'][status]
			},
			filterApplyStatus(status) {
				return ['退款处理中', '商品退货中', '已退款', '拒绝退款'][status]
			}
		},
		data() {
			return {
				// 0->待付款；1->待发货；2->已发货；3->已完成；4->已关闭；5->无效订单
				status: 0,
				// 申请状态：0->待处理；1->退货中；2->已完成；3->已拒绝
				applyStatus: null,
				orderNo: null,
				orderParent: null,
				orderData: {},
				storeOrderDetail: [],
				showReasonFlag: false,
				reason: null,
				storeAddress: '',
				storePhone: '',
				sumObj: {
					amount: 0,
					integral: 0
				},
				time: '',
				pickuptime: ''
			};
		},
		onLoad(options) {
			if (options.orderNo) {
				this.orderNo = options.orderNo;
			} else {
				this.orderParent = options.orderParent;
			}
			this.getGoodsOrderDetail();
		},
		methods: {
			parseTime,
			// 二维码生成工具
			couponQrCode() {
				new qrCode('couponQrcode', {
					text: this.storeOrderDetail[0].orderParent,
					width: 176,
					height: 176,
					colorDark: "#333333",
					colorLight: "#FFFFFF",
					correctLevel: qrCode.CorrectLevel.H
				})
			},
			/* 获取退款订单信息 */
			async getRefundOrderDetail() {
				const res = await this.$http.getRefundOrderDetail({
					orderNo: this.orderNo
				})
				if (res.success && res.data) {
					this.applyStatus = res.data.status;
				}
			},
			/* 获取订单详情 */
			async getGoodsOrderDetail() {
				if (this.orderNo) {
					const result = await this.$http.getGoodsOrderDetail({
						orderNo: this.orderNo
					});
					if (!result.success) {
						return this.$queue.showToast("获取订单信息失败");
					}
					// 订单信息
					this.orderData = result.data;
					// 订单状态
					this.status = result.data.omsOrder.status;
					if (this.status == 7) {
						this.getRefundOrderDetail();
					}
				} else {
					const result = await this.$http.getStreetOrderByOrderNo({
						parentNo: this.orderParent
					});
					if (!result.success) {
						return this.$queue.showToast("获取订单信息失败");
					}
					// 订单信息
					this.storeOrderDetail = result.data;
					this.time = this.parseTime(this.storeOrderDetail[0].createTime)
					this.pickuptime = this.parseTime(this.storeOrderDetail[0].createTime + 60*60*1000, '{y}-{m}-{d} {h}:{i}')
					this.getStoreMessage(this.storeOrderDetail[0].storeId)
					this.sumAmount()
					this.couponQrCode()
					// 订单状态
					this.status = result.data[0].status;
					if (this.status == 7) {
						this.getRefundOrderDetail();
					}
				}
			},
			//获取店铺信息
			getStoreMessage(storeId) {
				this.$http.storeinfoDetail({
					storeId
				}).then(res => {
					this.storeAddress = res.data.area1Name + ' ' + res.data.area2Name + ' ' + res.data.area3Name +
						' ' + res.data.storeAddress
					this.storePhone = res.data.phone
				})
			},
			// 总价格， 总积分
			sumAmount() {
				this.storeOrderDetail.map(item => {
					if (item.integralType == 0) {
						this.sumObj.integral -= item.integral * item.goodsNum
					} else {
						this.sumObj.integral += item.integral * item.goodsNum
					}
					this.sumObj.amount += item.salePrice * item.goodsNum
					this.sumObj.amount.toFixed(2)
				})
			},
			/* 取消订单 */
			cancelOfOrder(e) {
				uni.showModal({
					title: e == 'c' ? '取消' : '核销' + '订单',
					content: '确定' + (e == 'c' ? '取消' : '核销') + '此订单？',
					success: res => {
						if (res.confirm && this.orderNo) {
							this.$http.concelGoodsOrder({
								orderNo: this.orderNo
							}).then(result => {
								if (result.success) {
									this.$queue.showToast("取消成功");
									this.getGoodsOrderDetail();
								}
							})
						} else if (res.confirm && this.orderParent) {
							// 核销
							if(e == 'v') {
								this.$http.orderVerification({
									parentNo: this.orderParent
								}).then(result => {
									if (!result.success) {
										return this.$queue.showToast(result.message);
									}
									this.$queue.showToast("核销成功");
									this.getGoodsOrderDetail();
								})
							} else {
								this.$http.streetOrderCancel({
									parentNo: this.orderParent
								}).then(result => {
									if (!result.success) {
										return this.$queue.showToast(result.message);
									}
									this.$queue.showToast("取消成功");
									this.getGoodsOrderDetail();
								})
							}
							
						}
					}
				});
			},
			// h
			/* 根据状态获取图片 */
			getImg(status) {
				return '../static/img/' + ['wait_pay@2x.png', 'wait_send@2x.png', 'wait_confirm@2x.png', 'finished@2x.png',
					'finished@2x.png'
				][status];
			},
			getApplyImg(status) {
				return '../static/img/' + ['wait@2x.png', 'wait_send@2x.png', 'success@2x.png', 'refusedto.png'][status];
			},
			/* 去支付 */
			toPayment() {
				if (this.orderNo) {
					this.$queue.setJson("pay_order", [this.orderData]);
					uni.navigateTo({
						url: "/sub/pays/payment/payment"
					})
				} else {
					this.$queue.setJson("pay_order", this.storeOrderDetail);
					uni.navigateTo({
						url: "/sub/pays/payment/payment"
					})
				}
			},
			/* 申请退款 */
			async refundGoodsOrder() {
				if (this.reason == null) {
					return this.$queue.showToast("请填写退款理由!");
				}
				const res = await this.$http.refundGoodsOrder({
					orderNo: this.orderNo,
					reason: this.reason
				});
				if (!res.success) {
					return this.$queue.showToast(res.message);
				}
				this.$queue.showToast("退款申请成功!");
				this.showReasonFlag = false;
				this.getGoodsOrderDetail();
			},
			/* 确认订单 */
			confirmOrder() {
				uni.showModal({
					title: '确认收货',
					content: '是否确定收货？',
					success: res => {
						if (res.confirm && this.orderNo) {
							this.$http.confirmGoodsOrder({
								orderNo: this.orderNo
							}).then(result => {
								if (!result.success) {
									return this.$queue.showToast(result.message);
								}
								this.$queue.showToast("确认成功");
								this.getGoodsOrderDetail();
							})
						} else if (res.confirm && this.orderParent) {
							this.$http.streetOrderConfirm({
								parentNo: this.orderParent
							}).then(result => {
								if (!result.success) {
									return this.$queue.showToast(result.message);
								}
								this.$queue.showToast("确认成功");
								this.getGoodsOrderDetail();
							})
						}
					}
				});
			},
			/* 提醒商家发货 */
			remindDeliver() {
				this.$queue.showLoading("加载中...");
				setTimeout(() => {
					this.$queue.showToast("已提醒商家发货");
					uni.hideLoading();
				}, 1000);
			},
			textPaste() {
				const _that = this;
				setTimeout(() => {
					uni.setClipboardData({
						data: _that.orderNo ? _that.orderNo : _that.orderParent,
						success() {
							_that.$queue.showToast("复制成功!")
						},
						fail() {
							_that.$queue.showToast("复制失败!")
						}
					})
				}, 300)
			},
			/* 复制单号 */
			handleClipboard() {
				const _that = this;
				setTimeout(() => {
					uni.setClipboardData({
						data: _that.orderData.omsOrderDelivery.deliveryNo,
						success() {
							_that.$queue.showToast("物流单号复制成功!")
						},
						fail() {
							_that.$queue.showToast("物流单号复制失败!")
						}
					})
				}, 300)
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import '../static/css/order-detail.scss';

	.qrCode {
		margin: 24rpx;
		text-align: center;

		.verification {
			font-size: 28upx;
			font-weight: 300;
			color: #333333;
			margin: 28upx 0 20upx 0;
		}

		.but {
			margin: 0upx auto 20upx;
			width: 160upx;
			height: 56upx;
			background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
			border-radius: 35upx;
			font-size: 28upx;
			font-weight: 300;
			line-height: 56upx;
			color: #FFFFFF;
		}
	}
</style>
