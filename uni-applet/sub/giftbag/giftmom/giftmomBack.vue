<template>
	<view class="momback">
		<view class="momback-head">
			<view class="momtitle">
				惠哥/姐
			</view>
			<view class="momtext">
				做亲朋好友身边最专业的匠心产品代理商
			</view>
			<view class="mommerit">
				<text>新匠人</text>
				<text>新人设</text>
				<text>新品质</text>
				<text>新生活</text>
			</view>
		</view>
		<view class="momback-content">
			<view class="interests">
				<view class="line">
				</view>
				<view class="equity">
					升级云创业立享权益
				</view>
				<view class="line">
				</view>
			</view>
			<view class="momList">
				<view class="item" v-for="item in momList" :key="item.icon">
					<image :src="item.icon" mode=""></image>
					<view class="item_name">
						{{item.name}}
					</view>
					<view class="item_text">
						{{item.text}}
					</view>
				</view>
			</view>
			<view class="mombuyBtn" @click="sendgiftmom">
				立即开通
			</view>
			<view class="placeholder">

			</view>
			<view class="momreason">
				<view class="reasontext">
					选择个人云创业的理由
				</view>
				<view class="reasonList">
					<view class="item" v-for="(item,index) in reasonList" :key="index">
						<image :src="item.icon" mode=""></image>
						<view class="view">
							<view class="item_name">
								{{item.name}}
							</view>
							<view class="item_text">
								{{item.text}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="password-wrap" v-if="digitalshelveswrapper == 1">
			<view class="bg"></view>
			<view class="content">
				<view class="close" @click="digitalshelveswrapper = 0">+</view>
				<view class="title">开通个人云创业</view>
				<view class="body">
					<view class="type">服务类型</view>
					<text class="moneytype">
						{{money}}元/年
					</text>
					<view class="should">
						应付:<text style="color: #EB6133;margin-left: 10rpx;">{{money}}</text>
					</view>
				</view>
				<button class="btn" @click="sendNext">立即支付</button>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				momList: [{
						icon: '/static/img/mom/lowprice.png',
						name: '专享低价',
						text: 'VIP专享价'
					},
					{
						icon: '/static/img/mom/reward.png',
						name: '分享奖励',
						text: '分享商品赚取奖励'
					},
					{
						icon: '/static/img/mom/gift.png',
						name: '赠送福袋',
						text: '价值365，送1+5个'
					},
					{
						icon: '/static/img/mom/training.png',
						name: '专属培训',
						text: '平台定期提供个人IP打造'
					}
				],
				reasonList: [{
						icon: '/static/img/mom/select.png',
						name: '精选匠心品牌，厂家直接授权代理',
						text: '没有中间商，把利润让给消费者'
					},
					{
						icon: '/static/img/mom/easily.png',
						name: '一键开店，轻松管理店铺',
						text: '专业培训指导，轻松创业'
					},
					{
						icon: '/static/img/mom/support.png',
						name: '平台扶持，流量赋能',
						text: '智能后台、会员系统、聊天系统、真正实现线上、线下打通'
					},
					{
						icon: '/static/img/mom/complete.png',
						name: '产品齐全，全场景覆盖',
						text: '全面覆盖餐饮，零售等吃喝玩乐场'
					}
				],
				money: 0,
				digitalshelveswrapper: 0,
				orderNo: ''
			};
		},
		onLoad() {
			this.getstoreGiftMotherpay()
		},
		methods: {
			// 获取礼券妈妈开通支付金额
			getstoreGiftMotherpay() {
				this.$http.storeGiftMother().then(res => {
					console.log(res)
					if (res.code == 200) {
						this.money = res.data
					}
				})
			},
			sendgiftmom() {
				uni.showLoading({
					mask: true,
					title: "加载中..."
				})
				let obj = {
					payType: 2,
					amount: this.money,
					bsType: 'BS_A012'
				}
				this.$http.getdepositOrder_v2(obj).then(resPay => {
					if (!resPay.success) {
						uni.hideLoading();
						return this.$queue.showToast(resPay.message);
					}
					if (resPay.data.successful) {
						uni.hideLoading();
						uni.redirectTo({
							url: './momenter'
						});
						return
					}
					uni.hideLoading();
					this.digitalshelveswrapper = 1
					this.orderNo = resPay.data.orderNo
					})
			},
			// 立即支付
			sendNext() {
				uni.showLoading({
					mask: true,
					title: "加载中..."
				})
				// let obj = {
				// 	payType: 2,
				// 	amount: this.money,
				// 	bsType: 'BS_A012'
				// }
				// this.$http.getdepositOrder_v2(obj).then(resPay => {
				// 	if (!resPay.success) {
				// 		uni.hideLoading();
				// 		return this.$queue.showToast(resPay.message);
				// 	}
				// 	if (resPay.data.successful) {
				// 		uni.hideLoading();
				// 		uni.redirectTo({
				// 			url: './momenter'
				// 		});
				// 		return
				// 	}
					let dataObj = {
						openId: this.$queue.getData("openId"),
						orderNo: this.orderNo,
						payType: '2',
						bsType: 'BS_A012'
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
								this.digitalshelveswrapper = 0
								setTimeout(() => {
									uni.redirectTo({
										url: './momenter'
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
				// })
			},
		}
	};
</script>
<style lang="scss">
	page {
		background-color: #FFFFFF;
	}

	.momback {
		&-head {
			height: 360upx;
			overflow: hidden;
			// background-image: url(https://app-static.meitianhui.com/images/e8973121b1552ee97fa42ad557c3224f-yrihp98b55.png);
			background-size: cover;
			background-repeat: inherit;

			.momtitle {
				margin: 96upx 0upx 16upx 48upx;
				font-size: 36upx;
				font-weight: 300;
				color: #FFFFFF;
			}

			.momtext {
				margin-left: 56upx;
				font-size: 26upx;
				font-weight: 300;
				color: #FFFFFF;
			}

			.mommerit {
				margin-top: 46upx;
				margin-left: 8upx;
				font-size: 32upx;
				font-weight: 300;
				color: #FFFFFF;

				text {
					margin-left: 48upx;
				}
			}
		}

		&-content {
			.interests {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin: 48upx 60upx 0upx;

				.line {
					width: 84upx;
					height: 2upx;
					background: #8B5B04;
				}

				.equity {
					font-size: 40upx;
					font-weight: 500;
					color: #8B5B04;
				}
			}

			.momList {
				width: 100%;
				margin-top: 48upx;
				display: flex;
				flex-wrap: wrap;

				.item {
					text-align: center;
					margin-bottom: 64upx;
					width: 50%;

					image {
						width: 104upx;
						height: 104upx;
					}

					.item_name {
						font-size: 28upx;
						font-weight: 500;
						margin: 24upx 0upx 8upx 0upx;
						color: #333333;
					}

					.item_text {
						width: 216upx;
						margin: 0 auto;
						font-size: 26upx;
						font-weight: 300;
						color: #999999;
					}
				}
			}

			.mombuyBtn {
				margin: 0 auto 64upx;
				width: 524upx;
				height: 76upx;
				line-height: 76upx;
				text-align: center;
				background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
				border-radius: 41upx;
				font-size: 28upx;
				font-weight: 300;
				color: #FFFFFF;
			}

			.placeholder {
				height: 24upx;
				background: #F3F3F3;
				opacity: 1;
			}

			.momreason {
				padding-bottom: 20upx;

				.reasontext {
					margin-top: 64upx;
					margin-bottom: 48upx;
					text-align: center;
					font-size: 40upx;
					font-weight: 500;
					color: #333333;
				}

				.reasonList {
					.item {
						display: flex;
						align-items: center;
						margin: 0upx 32upx 64upx;

						image {
							width: 104upx;
							height: 104upx;
						}

						.view {
							width: 80%;
							margin-left: 40upx;

							.item_name {
								font-size: 30upx;
								font-weight: 300;
								color: #333333;
							}

							.item_text {
								margin-top: 10upx;
								font-size: 26upx;
								font-weight: 300;
								color: #999999;
							}
						}
					}
				}
			}
		}
	}

	.password-wrap {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9999;
	}

	.password-wrap .bg {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background-color: rgba(17, 16, 30, 0.50);
	}

	.password-wrap .content {
		position: absolute;
		top: 51%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 600upx;
		background-color: #fff;
		border-radius: 16upx;
	}

	.password-wrap .content .title {
		text-align: center;
		margin: 48upx 0 60upx;
		font-size: 32upx;
		color: #333333;
	}

	.password-wrap .content .body {
		margin: 0 28upx;

		.type {
			margin-bottom: 24upx;
			font-size: 28upx;
			font-weight: 300;
			color: #999999;
		}

		.moneytype {
			padding: 34upx 36upx;
			border: 2upx solid #EB6132;
			display: inline-block;
			border-radius: 16upx;
			font-size: 32upx;
			font-weight: 300;
			color: #EB6133;
		}

		.should {
			margin-top: 40upx;
			font-size: 40upx;
			font-weight: 500;
			color: #666;
		}
	}

	.password-wrap .content .btn {
		width: 524upx;
		height: 76upx;
		line-height: 76upx;
		text-align: center;
		font-size: 32upx;
		color: #FFFFFF;
		margin: 48upx auto 48upx;
		background: #FF5A5A;
		border-radius: 38upx;
		background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
	}


	.password-wrap .close {
		position: absolute;
		top: 20upx;
		right: 30upx;
		font-size: 56upx;
		color: #D8D8D8;
		transform: rotate(45deg);
	}
</style>
