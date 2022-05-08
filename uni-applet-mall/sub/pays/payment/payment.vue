<template>
	<view class="pay">
		<!-- 订单信息 -->
		<view class="main-wrap margin-top">
			<view class="main-wrap-box pay-content">
				<view class="row">
					<view class="nominal">订单号:</view>
					<view class="text">{{ orderNo }}</view>
				</view>
				<view class="row">
					<view class="nominal">订单金额:</view>
					<view class="text text-price">
						<text>{{ formatMoney(sumAmount) }}</text>
						<template v-if="sumIntegral > 0">
							<text class="text-xs">+</text>
							<text>{{sumIntegral}}</text>
							<text class="text-xs">{{$queue.getIntegralName()}}</text>
						</template>
					</view>
				</view>
			</view>
		</view>

		<view class="main-wrap">
			<view class="main-wrap-box">
				<view class="pay-title">选择支付方式</view>
				<view class="pay-list">
					<view class="row" @tap="paytype = 'wxpay'">
						<view class="left">
							<image src="/sub/pays/static/img/wxpay.png"></image>
						</view>
						<view class="center">微信支付</view>
						<view class="right">
							<radio :checked="paytype == 'wxpay'" />
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="block">
			<view class="content">

			</view>
		</view>
		<view class="pay-footer">
			<button class="btn" @click.stop="doDeposit">立即支付</button>
		</view>
	</view>
</template>

<script>
	import {
		formatMoney
	} from '@/common/utils/MoneyUtils.js';
	export default {
		data() {
			return {
				orderNo: '',
				amount: 0,
				payOrder: [], // 下单数组对象
				paytype: 'wxpay', //支付类型
				actCode: '',
				pageType: null,// 是否是从订单列表页面过来的 1-是 ;其他值则是从购物车过来的
			};
		},
		onLoad(e) {
			console.log(e.pageType)
			this.pageType = e.pageType
			this.payOrder = this.$queue.getJson("pay_order");
			// console.log('this.payOrder[0].omsOrder',this.payOrder[0].omsOrder)
			if (e.actCode) {
				this.actCode = e.actCode
			}
			if (this.pageType == 1) {
				this.orderNo = this.payOrder[0].omsOrder.orderNo || '';
			} else {
				this.orderNo = this.payOrder[0].omsOrder.orderParent || '';
			}
			// if (_.size(this.payOrder) > 1) {
			// 	this.orderNo = this.payOrder[0].omsOrder.orderParent;
			// }
			// this.orderNo = this.payOrder[0].omsOrder != undefined ? this.payOrder[0].omsOrder.orderNo : this.payOrder[0]
			// 	.orderParent
			// if (_.size(this.payOrder) > 1) {
			// 	this.orderNo = this.payOrder[0].omsOrder != undefined ? this.payOrder[0].omsOrder.orderParent : this
			// 		.payOrder[0].orderParent
			// }
		},
		computed: {
			// 总金额
			sumAmount: function() {
				// const amount = _.sum(this.payOrder.map(v => v.omsOrderDetail.salePrice * v.omsOrderDetail.goodsNum));
				// if(this.payOrder[0].omsOrder != undefined) {
				const amount = _.sum(this.payOrder.map(v => v.omsOrder != undefined ? v.omsOrder.payAmount : v
					.payAmount));
				// } else {
				// const amount = _.sum(this.payOrder.map(v => v.omsStreetOrder.payAmount));
				// }
				return amount;
			},
			// 总积分
			sumIntegral: function() {
				// if(this.payOrder[0].omsOrder != undefined) {
				const integral = _.sum(this.payOrder.filter(v => v.omsOrderDetail != undefined ? v.omsOrderDetail
					.integralType == 0 : v.integralType == 0).map(v => v.omsOrderDetail != undefined ? v
					.omsOrderDetail.integral * v.omsOrderDetail.goodsNum : v.integral * v.goodsNum));
				// } else {
				// const integral = _.sum(this.payOrder.filter(v => v.omsStreetOrderDetail.integralType == 0).map(v => v.omsStreetOrderDetail.integral *
				// 	v.omsStreetOrderDetail.goodsNum));
				// }

				return integral;
			},
		},
		methods: {
			formatMoney,
			doDeposit() {
				// 发起小程序支付
				this.$queue.showLoading("支付中...");
				let params = {
					openId: this.$queue.getData("openId"),
					bsType: this.payOrder[0].omsOrder != undefined ? this.payOrder[0].omsOrder.bsType : this.payOrder[
						0].bsType,
					payType: "2",
				};
				// if (this.$queue.getData('bsType') != undefined) {
				// 	params.bsType = this.$queue.getData('bsType')
				// }
				// if (this.actCode != '') {
				// 	params.bsType = 'BS_A008'
				// }
				// if (_.size(this.payOrder) > 1 || this.payOrder[0].omsOrder == undefined) { // 合并订单
				// 	params.parentNo = this.payOrder[0].omsOrder != undefined ? this.payOrder[0].omsOrder.orderParent : this
				// 		.payOrder[0].orderParent;
				// } else {
				// 	params.orderNo = this.orderNo;
				// }
				if(this.pageType == 1) {
					params.orderNo = this.orderNo
				}else {
					params.parentNo = this.orderNo
				}
				
				this.$http.createPayOrder(params).then(res => {
					if (!res.success) {
						uni.hideLoading();
						return this.$queue.showToast(res.message);
					}
					if (res.data.status) {
						uni.hideLoading();
						this.$queue.remove("giftselectList");
						this.$queue.remove("selectprice");
						uni.showToast({
							title: '兑换成功'
						});
						setTimeout(() => {
							uni.redirectTo({
								url: '/sub/pays/success/success?amount=' + 0
							});
						}, 700);
						return
					}
					uni.requestPayment({
						provider: 'wxpay',
						appId: res.data.appid,
						nonceStr: res.data.nonceStr,
						package: res.data.package,
						paySign: res.data.paySign,
						signType: res.data.signType,
						timeStamp: res.data.timeStamp,
						success: result => {
							uni.hideLoading();
							this.$queue.remove("bsType");
							this.$queue.remove("saleStoreId");
							this.$queue.remove("saleStoreName");
							this.$queue.remove("giftselectList");
							this.$queue.remove("selectprice");
							uni.showToast({
								title: '支付成功'
							});
							setTimeout(() => {
								uni.redirectTo({
									url: '/sub/pays/success/success?amount=' + this
										.sumAmount
								});
							}, 700);
						},
						fail: err => {
							setTimeout(() => {
								uni.hideLoading();
								uni.showToast({
									title: '支付取消或失败,请重新支付',
									icon: 'none'
								});
							}, 700);
						}
					});
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.pay {
		&-content {
			.row {
				width: 100%;
				padding: 20upx 5upx 24upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 28upx;
				border-bottom: 1upx solid $border-color-light;

				&:last-child {
					border-bottom: none;
				}

				.nominal {
					flex-shrink: 0;
					font-size: 28upx;
					color: $uni-text-color-muted;
				}

				.text {
					font-size: 26upx;
					color: $uni-color-main;
				}
			}
		}

		&-title {
			font-size: 28upx;
			margin-bottom: 20upx;
		}

		&-list {
			width: 100%;

			.row {
				border-bottom: solid 1upx $border-color-base;
				width: 100%;
				height: 120upx;
				display: flex;
				align-items: center;

				&:last-child {
					border-bottom: none;
				}

				.left {
					width: 100upx;
					flex-shrink: 0;
					display: flex;
					align-items: center;

					image {
						width: 80upx;
						height: 80upx;
					}
				}

				.center {
					width: 100%;
					font-size: 30upx;
				}

				.right {
					width: 100upx;
					flex-shrink: 0;
					display: flex;
					justify-content: flex-end;
				}
			}
		}

		&-footer {
			position: fixed;
			bottom: 20upx;
			left: 0;
			right: 0;
			width: 100%;
			display: flex;
			justify-content: center;
			flex-wrap: wrap;

			.btn {
				width: 88%;
				height: 80upx;
				border-radius: 80upx;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #fff;
				background-color: $uni-color-main;
				box-shadow: 0upx 5upx 10upx rgba(0, 0, 0, 0.2);
				font-size: 30upx;
			}
		}
	}
</style>
