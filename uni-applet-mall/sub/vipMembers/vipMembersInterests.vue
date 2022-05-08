<!-- VIP充值 -->
<template>
	<view class="payment">
		<view class="vipTopUp">
			<text class="title">充值金额</text>
			<view class="moneyType">
				<template v-if="vipType == 0">
					<view class="user" v-for="(item,index) in userPaymentConf" :key="index"
						:class="[userTabTypeIndex == index ? 'on' : 'off']" @click="handleTabType(item,index)">
						<view class="money">{{ item.money }}元</view>
						<view class="integral">{{ `赠送${item.integral}礼券` }}</view>
					</view>
				</template>
				<template v-else>
					<view class="user store">
						<input v-model="amount" type="digit" placeholder="请输入金额" size="large" focus class="input"/>
					</view>
				</template>
			</view>
			<button @click="sendNext" class="pay-btn" type="info" round block>立即{{ vipStatus == 0 ? '开通' : '续费' }}</button>
		</view>
		
		<!-- 优惠权益 -->
		<view class="nterests">
			<text class="title">开通VIP享超值特权</text>
			<view v-for="(item, i) in nterestsList" :key="i">
				<view class="content" v-if="item.isShow">
					<image :src="item.imgUrl" mode=""></image>
					<view class="right">
						<view class="one">{{ item.one }}</view>
						<!-- <view class="two">{{ item.two }}</view> -->
					</view>
				</view>
			</view>
			
		</view>
		<!-- 个人或商家切换 -->
		<view class="switch">
			<view class="personal" :class="[vipType == 0 ? 'on' : '']" @tap="switchType(0)">
				个人
			</view>
			<view class="merchants" :class="[vipType == 1 ? 'on' : '']" @tap="switchType(1)">
				商家
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userTabTypeIndex: 0,
				vipType: 0,
				userAmount: null,
				amount: null,
				vipStatus: 0,
				userPaymentConf: [],
				storePaymentConf: {},
				nterestsList: [{
					imgUrl: '../../static/img/user/vipImg1.png',
					one: '自购省钱，享品质好货',
					isShow: true,
				}, 
				{
					imgUrl: '../../static/img/user/vipImg2@2x.png',
					one: '分享好物，享受福利',
					isShow: true,
				}, {
					imgUrl: '../../static/img/user/vipImg3@2x.png',
					one: '赠送等额礼券，兑换好物',
					isShow: true,
				},{
					imgUrl: '../../static/img/user/vipImg4@2x.png',
					one: '成为初级代理，享受平台业务奖励',
					isShow: false,
				},{
					imgUrl: '../../static/img/user/vipImg5@2x.png',
					one: '免费开通礼券码',
					isShow: false,
				}, 
				]
			};
		},
		onLoad(options) {
			this.vipStatus = options.vipStatus
		},
		onShow() {
			if (this.hasLogin) {
				this.getstoreGiftMotherpay()
				return
			}
			uni.redirectTo({
				url: "/pages/login/login?page=user"
			})
		},
		methods: {
			/* 切换个人充值套餐操作 */
			handleTabType(item,index) {
				// console.log(tbIndex)
				this.userTabTypeIndex = index
				this.userAmount = item.money
				if(index == 1) {
					this.nterestsList[3].isShow = true
					this.nterestsList[4].isShow = false
				}else {
					this.nterestsList[3].isShow = false
					this.nterestsList[4].isShow = false
				}
			},
			// 切换个人/商家按钮操作
			switchType(i) {
				this.vipType = i
				if(i == 0) {
					this.userTabTypeIndex = 0
					this.nterestsList[3].isShow = false
					this.nterestsList[4].isShow = false
				}
				if(i == 1) {
					this.amount = null
					this.nterestsList[3].isShow = false
					this.nterestsList[4].isShow = true
				}
				
			},
			// 获取VIP开通支付金额
			getstoreGiftMotherpay() {
				this.$http.vipRecharge().then(res => {
					console.log(res)
					if (res.code == 200) {
						this.userPaymentConf = res.data.userVip.paymentConf.userPay
						this.storePaymentConf = res.data.userVip.paymentConf.storePay
						this.userAmount = this.userPaymentConf[0].money
						// this.money = res.data.userVip.paymentConf.storePay.money || 0
						// this.maxMoney = res.data.userVip.paymentConf.storePay.maxMoney || 0
						// this.integral = res.data.userVip.paymentConf.integral || 0
					}
				})
			},
			// 立即支付
			sendNext() {
				if (this.vipType == 1 && !(this.amount >= this.storePaymentConf.money && this.amount <= this.storePaymentConf.maxMoney)) {
					return uni.showToast({
						title: `充值金额只能在${this.storePaymentConf.money}元至${this.storePaymentConf.maxMoney}元之间`,
						icon: 'none'
					});
				}
				uni.showLoading({
					mask: true,
					title: "加载中..."
				})
				let obj = {
					payType: 2,
					amount: this.vipType == 1 ? this.amount : this.userAmount,
					bsType: 'BS_A015',
					userType: this.vipType
				}
				this.$http.getdepositOrder_v2(obj).then(resPay => {
					if (!resPay.success) {
						uni.hideLoading();
						return this.$queue.showToast(resPay.message);
					}
					let dataObj = {
						openId: this.$queue.getData("openId"),
						orderNo: resPay.data.orderNo,
						payType: '2',
						bsType: 'BS_A015'
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
									uni.switchTab({
										url: '/pages/user/user'
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
		}
	};
</script>

<style lang="scss">
	.payment {
		padding: 24rpx;

		// 新版页面 2021-10-16
		.title {
			width: 112rpx;
			height: 40rpx;
			font-size: 28rpx;
			font-weight: 700;
			line-height: 40rpx;
			color: #333333;
		}

		.vipTopUp {
			height: 298rpx;
			background: #ffffff;
			border-radius: 16rpx;
			margin-bottom: 40rpx;
			overflow: hidden;
			padding: 24rpx;

			.moneyType {
				display: flex;
				padding: 24rpx 0 48rpx;

				.user {
					width: 202rpx;
					height: 120rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					font-size: 32rpx;
					background: #FFFFFF;
					border-radius: 16upx;
					text-align: center;
					font-weight: 700;
					margin-right: 24upx;

					.integral {
						font-size: 26rpx;
						margin-top: 8rpx;
						font-weight: 300;
					}
				}

				.store {
					width: 100%;
					height: 80upx;
					display: flex;
					flex-direction: row;
					justify-content: flex-start;
					align-items: center;
					margin-left: 24rpx;
					text-align: left;
					border-bottom: 4rpx solid #F2F2F2;
					border-radius: 0;
					

					.input {
						width: 468upx;
						font-size: 38rpx;
						font-weight: 300;
						
					}
				}

				.on {
					border: 1px solid #FA3B1C;
					color: #FA3B1C;
				}

				.off {
					border: 1px solid #F2F2F2;
					color: #333;
				}
			}
			.store::before {
					content: "¥";
					font-size: 48upx;
					color: #333;
					margin-right: 12upx;
				}
			.icon {
				display: flex;

				image {
					width: 48rpx;
					height: 48rpx;
					margin-right: 8rpx;
				}

				.iconText {
					width: 100%;
					height: 48rpx;
					font-size: 24rpx;
					line-height: 48rpx;
					color: #666666;
				}
			}
		}

		.pay-btn {
			width: 524rpx;
			height: 76rpx;
			font-size: 28rpx;
			line-height: 76rpx;
			color: #fff;
			background: linear-gradient(143deg, #F32A2A 0%, #FF6B3A 100%);
			border-radius: 160rpx;
			margin: 0 auto 16rpx;
		}

		.nterests {
			height: 100%;
			background: #ffffff;
			border-radius: 16rpx;
			padding: 24rpx;

			.content {
				display: flex;
				margin: 24rpx 0;

				image {
					width: 264rpx;
					height: 152rpx;
					margin-right: 24rpx;
				}

				.right {
					width: 330upx;
					display: flex;
					flex-direction: column;
					justify-content: center;

					.one {
						font-size: 30rpx;
						color: #333;
						font-weight: 700;
						margin-bottom: 8rpx;
					}

					.two {
						font-size: 26rpx;
						color: #333;
					}
				}
			}
		}
		
		// 切换个人、商家按钮
		.switch {
			display: flex;
			position: fixed;
			align-items: center;
			bottom: 32upx;
			margin: 0 20upx;
			.personal {
				width: 334upx;
				height: 76upx;
				font-size: 32upx;
				color: #333;
				font-weight: 700;
				background: #fff;
				box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
				border-top-left-radius: 200upx;
				border-bottom-left-radius: 200upx;
				line-height: 76upx;
				text-align: center;
			}
			.merchants {
				width: 334upx;
				height: 76upx;
				font-size: 32upx;
				font-weight: 700;
				color: #333;
				background: #fff;
				box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
				border-top-right-radius: 200upx;
				border-bottom-right-radius: 200upx;
				line-height: 76upx;
				text-align: center;
			}
			.on {
				color: #fff;
				background: linear-gradient(143deg, #F32A2A 0%, #FF6B3A 100%);
			}
		}

	}
</style>
