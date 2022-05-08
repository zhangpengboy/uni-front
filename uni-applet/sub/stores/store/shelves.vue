<template>
	<view class="shelves">
		<view class="shelves-head">
			数字货架说明
		</view>
		<view class="shelves-instructions">
			<!-- <view class="shelves-instructions-1">
				一、数字货架说明
			</view> -->
			<view class="text">
				<view>
					依托实体店闲置的空间及货架，优化陈列00后用户群喜欢的匠心产品，用户能直观触摸到商品，用户体验后，直接用手机扫标签上的二维码进入实体店云 店页面直接下单购买。
				</view>
				<view>1.让货架不再闲置。</view>
				<view>2.上架产品就能挣钱。</view>
				<view>3.智能优化店铺SKU。</view>
				<view>4.推广1次，终身挣钱。</view>
				<view>5.让电商真正的来到身边。</view>
			</view>
		</view>
	<!-- 	<view class="shelves-interests">
			<view class="shelves-interests-2">
				二、365礼包权益
			</view>
			<view class="text">
				<view>
					欢迎您下载和使用我们的APP,依照相关法规规定，为了
					您正常使用惠有福APP，你的身份信息、联系方式、交易信
					息需要被依法收集并使用。
				</view>
				<view>
					惠有福将严格保护您的个人信息，确保信息安全，具体
					详见《惠有福隐私政策》。
				</view>
				<view>您在点击同意下列协议前，请您务必审慎阅读《服务协
					议》和《隐私政策》并充分理解协议条款内容。</view>
			</view>
		</view> -->
		<view class="btn" @click="openMoney">
			{{buttext}}
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				buttext: '免费体验数字货架',
				state: '',
				money: ''
			}
		},
		onLoad(options) {
			uni.showLoading({
				title: '加载中...'
			});
			this.state = options.state
			this.judgePay()
		},
		methods: {
			// 判断 免费还是付费
			judgePay() {
				uni.hideLoading()
				if (this.state == 1) {
					this.buttext = '付费开通数字货架'
					this.getMoney()
				} else {
					this.buttext = '免费体验数字货架'
				}
			},
			// 获取数字货架支付金额
			getMoney() {
				this.$http.getMoney().then(res => {
					if(res.code == 200) {
						let mm = res.data
						this.money = JSON.parse(mm).money
					}
				})
			},
			// 开通
			openMoney() {
				uni.showLoading({
					mask: true,
					title: "加载中..."
				})
				if (this.buttext == '免费体验数字货架') {
					uni.hideLoading();
					uni.navigateTo({
						url: `/sub/webview/index/index?webUrl=${encodeURIComponent(this.$queue.publicStoreYuMing() + '/register?inWay=digitalShelves&type=2')}`
					})
					return
				}
				let obj = {
					payType: 2,
					amount: this.money,
					bsType: 'BS_A011'
				}
				this.$http.getdepositOrder(obj).then(resPay => {
					if (!resPay.success) {
						uni.hideLoading();
						return this.$queue.showToast(resPay.message);
					}
					if(resPay.data == 0) {
						// 已开通数字货架充值
						uni.redirectTo({
							url: `/sub/webview/index/index?webUrl=${encodeURIComponent(this.$queue.publicStoreYuMing() + '/register?inWay=digitalShelves&type=2')}`
						});
						return
					}
					let dataObj = {
						openId: this.$queue.getData("openId"),
						orderNo: resPay.data,
						payType: '2',
						bsType: 'BS_A011'
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
										url: `/sub/webview/index/index?webUrl=${encodeURIComponent(this.$queue.publicStoreYuMing() + '/register?inWay=digitalShelves&type=2')}`
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
			}
		}
	}
</script>
<style lang="scss">
	page {
		background-color: #fff;
	}

	.shelves {
		&-head {
			margin: 48upx auto;
			text-align: center;
			font-size: 32upx;
			font-weight: 500;
			color: #333333;
		}

		&-instructions {
			margin: 0 34upx;
			font-size: 28upx;
			font-weight: 500;
			color: #333333;

			&-1 {
				margin-bottom: 16upx;
				font-weight: 500;
			}

			.text {
				view {
					text-indent: 2em;
					font-size: 26upx;
					font-weight: 300;
					margin: 8upx 0;
					color: #333333;
				}
			}
		}

		&-interests {
			margin: 40upx 34upx 0;
			font-size: 28upx;
			font-weight: 500;
			color: #333333;

			&-2 {
				margin-bottom: 16upx;
				font-weight: 500;
			}

			.text {
				view {
					text-indent: 2em;
					font-size: 26upx;
					font-weight: 300;
					margin: 8upx 0;
					color: #333333;
				}
			}
		}

		.btn {
			width: 524upx;
			height: 76upx;
			line-height: 76upx;
			background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
			border-radius: 41upx;
			text-align: center;
			margin: 200upx auto 64upx;
			font-size: 28upx;
			font-weight: 300;
			color: #FFFFFF;
		}
	}
</style>
