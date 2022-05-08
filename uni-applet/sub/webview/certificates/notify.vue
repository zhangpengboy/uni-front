<template>
	<view class="liquan">
		<view class="recharge-wrap">
			<view class="recharge-wrap-title">开通条件</view>
			<view class="recharge-wrap-content">
				<view class="item text-center" :class="{ active: styIndex == index }" v-for="(item, index) in typeList"
					:key="item" @click="choiceType(item, index)">
					<view>{{item.name}}</view>
					<view class="feature">享受{{item.rate}}折礼券权益</view>
				</view>
			</view>
		</view>
		<view class="recharge-wrap">
			<view class="recharge-wrap-title">支付方式</view>
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
		<button @click="submit" class="recharge-btn" type="info" round block>
			确认支付{{ "￥" + pay }}
		</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 礼券类型列表
				typeList: [],
				styIndex: 0,
				//支付金额
				pay: 0,
				// 店铺id
				storeId: "",
				//礼券码类型
				typeId: -1,
				storeName: "",
				packCode: "",
			};
		},
		onLoad(options) {
			if (options.storeId) {
				this.storeId = options.storeId;
				this.roleCode = options.roleCode;
				this.storeName = options.storeName;
			}
			this.getIntegralPack();
		},
		methods: {
			//获取礼券类型
			getIntegralPack() {
				this.typeList = [];
				uni.showLoading({
					title: "加载中",
				});
				this.$http
					.getIntegralListPack()
					.then((res) => {
						if (res.code == 200) {
							uni.hideLoading();
							this.typeList = res.data.list;
							this.typeList.map((item, index) => {
								if (this.styIndex == index) {
									this.typeId = item.id;
									this.packCode = item.code;
									this.pay = item.price;
								}
							});
						}
					});
			},
			// 选择礼券类型
			choiceType(item, index) {
				this.typeId = item.id;
				this.styIndex = index;
				this.pay = item.price;
				this.packCode = item.code;
			},
			// 更新店铺信息
			getStoreInfoByStoreId() {
				let that = this
				//更改礼券开通状态并更新本地存储数据
				that.$http
					.getStoreInfoByStoreId({
						storeId: that.storeId,
					})
					.then((res) => {
						if (res.code == 200) {
							that.$queue.setJson("store", res.data);
							setTimeout(() => {
								uni.redirectTo({
									url: "/sub/webview/certificates/certificates",
								});
							}, 700);
						}
					});
			},
			//支付
			async submit() {
				let that = this;
				uni.showLoading({
					title: "加载中",
				});
				// let result = await this.$http.getIntegralRate({
				// 	roleCode: this.roleCode,
				// });
				// if (result.code == 200) {
				// 	if (result.data.length == 0) {
				// 		uni.hideLoading();
				// 		uni.showToast({
				// 			title: "暂未获取到充值配置",
				// 			icon: "none",
				// 		});
				// 		return;
				// 	}
					let obj = {
						// rateRoleCode: result.data[0].code,
						storeRoleCode: +this.roleCode,
						packCode: this.packCode,
						storeId: this.storeId,
						storeName: this.storeName,
					};
					this.$http.createOpenQrCodeOrder(obj).then((res) => {
						if (res.code == 200) {
							if (!res.data) {
								this.getStoreInfoByStoreId()
								return
							}
							let orderNo = res.data;
							let dataObj = {
								openId: this.$queue.getData("openId"),
								orderNo: orderNo,
								payType: "2",
								bsType: "BS_A004",
							};
							this.$http.createPayOrder(dataObj).then((backdata) => {
								uni.requestPayment({
									provider: "wxpay",
									appId: backdata.data.appid,
									nonceStr: backdata.data.nonceStr,
									package: backdata.data.package,
									paySign: backdata.data.paySign,
									signType: backdata.data.signType,
									timeStamp: backdata.data.timeStamp,
									success: (result) => {
										uni.hideLoading();
										uni.showToast({
											title: "支付成功",
										});

										//更改礼券开通状态并更新本地存储数据
										this.getStoreInfoByStoreId()
										//   that.$http
										//     .getStoreInfoByStoreId({
										//       storeId: that.storeId,
										//     })
										//     .then((res) => {
										//       if (res.code == 200) {
										//         let storeList = that.$queue.getJson("storeList");
										//         storeList.forEach((item, index) => {
										//           if (that.storeId === item.id) {
										//             storeList.splice(index, 1, res.data);
										//           }
										//         });
										//         that.$queue.setJson("storeList", storeList);
										//         setTimeout(() => {
										//           uni.redirectTo({
										//             url: "/sub/webview/certificates/certificates",
										//           });
										//         }, 700);
										//       }
										//     });
									},
									fail: (err) => {
										setTimeout(() => {
											uni.hideLoading();
											uni.showToast({
												title: "支付取消或失败,请重新支付",
												icon: "none",
											});
										}, 700);
									},
								});
							});
						} else {
							uni.hideLoading();
							this.$queue.showToast(res.message);
						}
					});
					uni.hideLoading();
				// } else {
				// 	uni.hideLoading();
				// 	this.$queue.showToast("失败");
				// }
			},
		},
	};
</script>

<style lang="scss">
	.active {
		color: #eb6132 !important;
		border: 2rpx solid #eb6132 !important;
	}

	.liquan {
		padding: 12px;

		.recharge-wrap {
			background: #ffffff;
			border-radius: 8px;
			margin-bottom: 12px;

			.recharge-wrap-title {
				color: #666666;
				font-size: 24rpx;
				padding: 24rpx;
				border-bottom: 2rpx solid #f7df29;
			}

			.recharge-wrap-content {
				padding: 24rpx;
				display: flex;
				flex-wrap: wrap;

				.item {
					margin: 6rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-content: center;
					width: calc(50% - 55rpx);
					color: #ccc;
					border: 2rpx solid #ccc;
					border-radius: 16rpx;
					font-size: 32rpx;
					padding: 20rpx;

					.feature {
						font-size: 24rpx;
						margin-top: 10rpx;
					}
				}
			}
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
		background-color: #eb6132;
		color: #ffffff;
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
</style>
