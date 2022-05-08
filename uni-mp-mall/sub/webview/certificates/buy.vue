<template>
	<view class="payment">
		<view class="payment-wrap">
			<view class="payment-wrap-title">
				<text>可得礼券数量：</text>
				<text style="color: #eb6132" class="fs-18 ml-1">{{ countGift }}</text>
			</view>

			<view class="payment-wrap-content">
				<text style="line-height: 36px">充值金额：</text>
				<input v-model="amount" type="number" @input="CalculationIntegral" placeholder="请输入充值金额" size="large"
					class="" />
			</view>
			<view class="payment-wrap-discount" v-if="isDiscount">
				{{ errorMsg }}
			</view>
			<view class="payment-wrap-content">
				礼券仅用于商家引流锁客使用，严禁商家自己刷礼券，一经发现从严处理。
			</view>
		</view>
		<view class="payment-wrap">
			<view class="payment-wrap-title">支付方式</view>
			<view class="recharge-wrap">
				<!-- <view class="recharge-wrap-title">支付方式</view> -->
				<view class="pay-list">
					<view class="row" @tap="paytype = 'wxpay'">
						<view class="left">
							<image src="../../../static/img/wxpay.png"></image>
						</view>
						<view class="center">微信支付</view>
						<view class="right">
							<radio :checked="true" />
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="payment-wrap">
			<view class="payment-wrap-title" @click="record">充值记录 <text
					style="float: right;margin-right: 20rpx;">></text></view>
			<view class="payment-wrap-title" @click="gotoconfig">配制送券比例 <text
					style="float: right;margin-right: 20rpx;">></text></view>
		</view>
		<button @click="submit" class="recharge-btn" type="info" round block>确认支付</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				countGift: 0,
				errorMsg: '',
				amount: null,
				money: 0,
				storeId: '',
				storeName: '',
				statu: true,
				// 角色类型
				roleCode: '',
				percentage: 0,
				rateRoleCode: '',
				isDiscount: false,//是否显示折扣
			};
		},
		onLoad(options) {

			this.storeId = options.storeId
			this.storeName = options.storeName
			this.storeRoleCode = options.storeRoleCode
			this.getIntegralRate()
		},
		methods: {
			// 店铺角色获取充值积分比列
			async getIntegralRate() {
				let result = await this.$http.getIntegralBuyRate({
					storeId: this.storeId
				})
				if (result.code == 200) {
					this.isDiscount = true
					this.percentage = result.data.rate
					this.rateRoleCode = result.data.rateCode
					this.errorMsg = `充值折扣：${result.data.rate}折 (100元：${100 / (result.data.rate/10)}礼券)`
				}
			},
			//充值记录
			record() {
				uni.navigateTo({
					url: './record?storeId=' + this.storeId
				})
			},
			// 配置比例
			gotoconfig() {
				uni.navigateTo({
					url: './config?storeId=' + this.storeId
				})
			},
			// 充值
			submit() {
				// if (this.money < 100) {
				// 	return this.$queue.showToast('充值金额不能低于100元')
				// }
				uni.showLoading({
				  title: "加载中",
				});
				let obj = {
					amount: this.money,
					userId: this.storeId,
					userName: this.storeName,

				}
				this.$http.createRechargeOrder(obj).then(res => {
					if (!res.success) {
						uni.hideLoading();
						return this.$queue.showToast(res.message);
					}
					let dataObj = {
						openId: this.$queue.getData("openId"),
						orderNo: res.data,
						payType: '2',
						bsType: 'BS_A005'
					}
					this.$http.createPayOrder(dataObj).then(resPay => {
						if (!resPay.success) {
							uni.hideLoading();
							return this.$queue.showToast(resPay.message);
						}
						this.$queue.showLoading("支付中...");
						uni.requestPayment({
							provider: 'wxpay',
							appId: resPay.data.appid,
							nonceStr: resPay.data.nonceStr,
							package: resPay.data.package,
							paySign: resPay.data.paySign,
							signType: resPay.data.signType,
							timeStamp: resPay.data.timeStamp,
							success: result => {
								uni.hideLoading();
								uni.showToast({
									title: '支付成功'
								});
								setTimeout(() => {
									uni.redirectTo({
										url: './certificates'
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

					})

				})

			},
			CalculationIntegral(e) {
				let num = 0
				this.money = e.detail.value
				num = e.detail.value
				this.countGift = this.percentage === 0 ? 0 : num / (this.percentage/10)
			},
		}
	};
</script>

<style lang="scss">
	.payment {
		padding: 24rpx;

		&-wrap {
			background: #ffffff;
			border-radius: 16rpx;
			margin-bottom: 24rpx;
			overflow: hidden;

			&-title {
				color: #666666;
				font-size: 28rpx;
				padding: 24rpx;
				border-bottom: 2rpx solid #f7f7f7;
			}

			&-content {
				padding: 24rpx;
				color: #666666;
				font-size: 24rpx;
				border-bottom: 2rpx solid #f7f7f7;

				input {
					display: inline-block;
					vertical-align: middle;
					margin-left: 26rpx;
					margin-top: -10rpx;
				}
			}

			&-discount {
				color: #eb6132;
				font-size: 24rpx;
				padding: 12rpx 24rpx;
				border-bottom: 2rpx solid #f7f7f7;
			}
		}

		.pay-list {
			width: 100%;
			margin: 0rpx 24rpx;

			.row {
				border-bottom: solid 1upx $border-color-base;
				width: 94%;
				height: 120upx;
				display: flex;
				align-items: center;
				background-color: #fff;

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
					font-size: 24upx;
				}

				.right {
					width: 100upx;
					flex-shrink: 0;
					display: flex;
					justify-content: flex-end;
				}
			}
		}

		.recharge-btn {
			background-color: #EB6132;
			color: #FFFFFF;
			font-size: 24rpx;
			width: 93%;
			height: 80rpx;
			line-height: 80rpx;
			border-radius: 46rpx;
			margin: 0rpx 24rpx;
			position: fixed;
			left: 0rpx;
			bottom: 40rpx;
		}
	}
</style>
