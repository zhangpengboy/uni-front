<template>
	<view class="container">
		<view class="inp-qb">
			<view class="ktx-text">可提现金额 (元)</view>
			<view class="ktx-money">
				<view class="money">
					{{freeAmount}}
				</view>
				<view class="qtx-text" @click="toAll()">全部提现</view>
			</view>
		</view>
		<view class="extract-inp">
			<view class="inp-title">提现金额:</view>
			<view class="shurumon">
				<view style="font-size:60rpx;line-height: 100%">￥</view>
				<view>
					<input type="digit" @input.stop="inMoney" maxlength="8" v-model="tiquMoeny" />
				</view>
			</view>
			<view class="exx-text">
				<text v-if="moneryError">输入金额超出可提现金额</text>
			</view>
		</view>
		<view class="extract-mon">
			<view class="text">
				<view class="txt1">到账支付宝:</view>
				<view>{{merchantMsg.bank_account}}</view>
			</view>
			<view class="text">
				<view class="txt1">真实姓名:</view>
				<view>{{merchantMsg.proposer}}</view>
			</view>
			<view class="input-i yzm">
				<view class="in-tit">验证码:</view>
				<view>
					<input type="number" v-model="valueCode" maxlength="6" placeholder="输入验证码"
						placeholder-class="phcolor" />
				</view>
				<view class="yz-span">
					<button class="sendSmsBtn" type="button" @click="sendSms"
						:disabled="disabled">{{ text == null ? yzmdjs + '秒后重新获取' : text }}</button>
				</view>
			</view>
			<!-- <view class="text">
				<view class="txt1">验证码：</view>
				<view class="input-code">
					<input placeholder="请输入验证码" v-model="valueCode" type="number" maxlength="6" />
				</view>
				<view class="yz-span">
					<button class="sendSmsBtn" type="button" @click="sendSms" :disabled="disabled">
						{{ text == null ? yzmdjs + '秒后重新获取' : text }}
					</button>
				</view>
			</view> -->
		</view>
		<view class="btn" @click="toSMS">申请提现</view>
		<view class="extract-db">
			<view>提现须知：</view>
			<view class="wenben pb-3">
				<view>
					1、提现金额：单笔提现金额
					<text>1-50000</text> 元
				</view>
				<view>2、手续费：0.01%；</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		formatMoney
	} from '@/common/utils/DateUtils.js';
	export default {
		data() {
			return {
				merchantMsg: {},
				tiquMoeny: '',
				account: '',
				moneryError: false,
				valueCode: '', // 验证码
				signNo: '',
				freeAmount: 0, //可提现金额
				text: '获取验证码',
				yzmdjs: 60,
				disabled: false,
				intervalBtn: null,
				storeAlipayUser: {},
				storeId: null
			};
		},
		onLoad(options) {
			this.storeId = options.storeId
			this.getAlipayUser();
		},
		methods: {
			//根据账户获取绑定的支付宝账号
			getAlipayUser() {
				uni.showLoading({
					title: '加载中'
				});
				this.$http.getAlipayUser({
					userId: this.storeId
				}).then(res => {
					if (res.code == 200) {
						uni.hideLoading()
						if (res.data == null) {
							this.aliaccount = true
						} else {
							this.aliaccount = false
							this.accountName = res.data.userName
							this.storeAlipayUser = res.data
							if (!this.storeAlipayUser) return this.$queue.showToast('未绑定支付宝')
							this.merchantMsg["bank_account"] = this.storeAlipayUser.account
							this.merchantMsg["proposer"] = this.storeAlipayUser.userName
							this.getMoneyInfo()
						}
					}
				})
			},
			//获取用户资产总数
			getMoneyInfo() {
				const shop = this.$queue.getJson('store')
				uni.showLoading({
					title: '加载中'
				});
				this.$http.getMoneyInfo({
					"userId": this.storeId
				}).then(res => {
					if (res.code == 200) {
						uni.hideLoading()
						if (res.data) {
							this.freeAmount = res.data.freeAmount.toFixed(2).toString()
						}
					}
				})
			},
			async sendSms() {
				if (!this.storeAlipayUser.phone) return this.$queue.showToast('请输入手机号')
				this.text = null
				this.disabled = true
				this.intervalBtn = setInterval(() => {
					if (this.yzmdjs <= 0) {
						clearInterval(this.intervalBtn)
						this.text = "获取验证码"
						this.disabled = false
						this.yzmdjs = 60
					}
					this.yzmdjs--
				}, 1000)
				const resultSignNo = await this.$http.getMoneyDrawSignNo({
					"mobile": this.storeAlipayUser.phone
				})
				if (resultSignNo.code == 200) {
					this.signNo = resultSignNo.data
					this.$http.getMoneyDrawSendSms({
						"mobile": this.storeAlipayUser.phone,
						"signNo": resultSignNo.data
					}).then(res => {
						if (res.code != 200) {
							return this.$queue.showToast('短信发送失败')
						}
						this.$queue.showToast('短信发送成功')
					})
				}
			},
			inMoney(e) {
				e.detail.value = e.detail.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
				e.detail.value = e.detail.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
				if (e.detail.value.indexOf(".") < 0 && e.detail.value != "") {
					e.detail.value = parseFloat(e.detail.value);
				} else if (e.detail.value.indexOf(".") == 0) {
					e.detail.value = e.detail.value.replace(/[^$#$]/g, "0.");
					e.detail.value = e.detail.value.replace(/\.{2,}/g, ".");
				}
				this.tiquMoeny = e.detail.value
			},
			//全部提现
			toAll() {
				if (this.freeAmount == 0) {
					return this.$queue.showToast('可提现金额为0,无法提现')
				}
				this.tiquMoeny = this.freeAmount
			},
			//申请提现
			toSMS() {
				if (!this.merchantMsg.bank_account) return this.$queue.showToast('支付宝账号为空')
				if (!this.merchantMsg.proposer) return this.$queue.showToast('支付宝名称为空')
				if (!this.tiquMoeny) return this.$queue.showToast('提现金额为空')
				if (this.tiquMoeny < 1) return this.$queue.showToast('提现金额不可低于1元')
				if (this.tiquMoeny > this.freeAmount) return this.$queue.showToast('不可大于可提现金额')
				if (!this.storeAlipayUser.phone) return this.$queue.showToast('手机号为空')
				if (!this.valueCode) return this.$queue.showToast('短信验证码为空')
				if (this.freeAmount == 0) return this.$queue.showToast('可提现金额为0,无法提现')
				this.$http.getMoneyDrawAlipay({
					"accountId": this.storeAlipayUser.accountId,
					"mobile": this.storeAlipayUser.phone,
					"cardNo": this.storeAlipayUser.account,
					"cardName": this.storeAlipayUser.userName,
					"cardType": 1,
					"money": this.tiquMoeny,
					"code": this.valueCode,
					"signNo": this.signNo
				}).then(res => {
					if (res.code == 200) {
						this.$queue.showToast(res.data)
						clearInterval(this.intervalBtn)
						this.yzmdjs = 60
						this.valueCode = ''
						this.tiquMoeny = ''
						setTimeout(() => {
							this.getMoneyInfo()
						}, 800)
					} else {
						this.$queue.showToast(res.message)
					}
				})
			}

		}
	};
</script>

<style lang="scss">
	.across {
		height: 12upx;
		width: 130upx;
		background: linear-gradient(90deg, rgba(68, 93, 240, 1) 0%, rgba(76, 170, 236, 1) 100%);
		margin-left: 30upx;
	}

	.triangle {
		z-index: 1;
		width: 0;
		height: 0;
		border-width: 18upx 0 18upx 20upx;
		border-style: solid;
		border-color: transparent transparent transparent rgba(76, 168, 236, 1);
		position: relative;
		margin-right: 30upx;
	}

	.extract-mon {
		background: #fff;
		margin-top: 24upx;
		width: 100%;
	}

	.text {
		display: flex;
		height: 104upx;
		align-items: center;
		justify-content: start;
		padding-left: 24upx;
		font-size: 32upx;
		color: #333;
		border-bottom: 2upx solid #F6F6F6;
	}

	.txt1 {
		width: 200upx;
	}

	.extract-inp {
		margin-top: 10upx;
		background: #fff;
		padding-left: 24upx;
		padding-top: 30upx;
	}

	.inp-title {
		font-size: 32upx;
		font-family: PingFangSC-Regular;
		font-weight: 400;
		color: rgba(102, 102, 102, 1);
	}

	.shurumon {
		display: flex;
		height: 100upx;
		margin-top: 24upx;
		align-items: center;
	}

	.shurumon input {
		height: 86upx;
		font-size: 60upx;
		width: 100%;
	}

	.inp-qb {
		height: 144upx;
		background-color: #fff;
		margin-top: 24upx;

		.ktx-text {
			font-size: 28upx;
			color: #999;
			padding-top: 24upx;
			margin-left: 24upx;
		}

		.ktx-money {
			margin-left: 24upx;
			margin-top: 24upx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.money {
				font-size: 32upx;
				font-weight: 500;
				color: #333333;
			}

			.qtx-text {
				margin-right: 28rpx;
				font-size: 28upx;
				font-weight: 300;
				color: #EB6133;
			}
		}

	}

	.btn {
		width: 524upx;
		height: 76upx;
		background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
		border-radius: 41upx;
		line-height: 76upx;
		text-align: center;
		margin: 80upx auto 100upx auto;
		color: #fff;
	}

	.extract-db {
		font-size: 28upx;
		color: #666;
		margin-left: 24upx;
		margin-bottom: 24upx;
	}

	.extract-db text {
		color: #333;
		font-weight: bold;
	}

	.wenben {
		margin-top: 28upx;
		margin-right: 50upx;
	}


	.mengc {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: #000000;
		opacity: 0.5;
		z-index: 30;
	}

	.close {
		height: 25upx;
		width: 25upx;
		/* margin-left: auto; */
		position: relative;
		left: 695upx;
		top: 30upx;
	}

	.close::before {
		content: '';
		position: absolute;
		height: 40upx;
		width: 4upx;
		border-radius: 8upx;
		background: #333333;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%) rotate(45deg);
		-webkit-transform: translate(-50%, -50%) rotate(45deg);
	}

	.close::after {
		content: '';
		position: absolute;
		height: 40upx;
		width: 4upx;
		border-radius: 8upx;
		background: #333333;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%) rotate(-45deg);
		-webkit-transform: translate(-50%, -50%) rotate(-45deg);
	}

	.sms-title {
		text-align: center;
		margin-top: 20upx;
		font-size: 36upx;
	}

	.sms-phone {
		margin-top: 40upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-top: 2upx solid rgba(215, 215, 215, 1);
		font-size: 24upx;
		padding-left: 24upx;
		padding-right: 24upx;
		padding-top: 20upx;
	}

	.sms-yzm {
		display: flex;
		justify-content: space-around;
	}

	/*.yam{
  height: 108px;
  width: 120px;
  text-align: center;
}
.yam-box{
  height: 108px;
  width: 120px;
  border-bottom: 1px solid rgba(215,215,215,1);
} */


	.iptbox {
		width: 120upx;
		height: 108upx;
		border-bottom: 2upx solid rgba(215, 215, 215, 1);
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		background: white;
	}

	.ipt {
		width: 0;
		height: 0;
	}


	.exx-text {
		color: #F12E5C;
		font-size: 24upx;
		margin-top: 40upx;
		margin-bottom: 20upx;
		min-height: 32upx;
	}




	.code-box {
		height: 90rpx;
		background: white;
		margin-top: 2upx;
	}

	.input-code {
		display: flex;
		justify-content: space-between;
		padding: 12upx 24upx;

		input {
			margin-top: 10rpx;
		}
	}

	// .yz-span {
	// 	font-size: 24rpx;
	// 	color: #445DF0;
	// 	margin-left: auto;
	// 	margin-right: 24rpx;
	// }

	// .sendSmsBtn {
	// 	background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
	// 	border-radius: 41px;
	// 	font-size: 24rpx;
	// 	height: 56upx;
	// }

	// .input-code button {
	// 	color: #FFFFFF;
	// 	font-size: 26upx;
	// }

	// .input-code text {
	// 	color: #445df0;
	// 	border: 2upx solid #445df0;
	// 	padding: 6upx 12upx;
	// 	border-radius: 28upx;
	// 	font-size: 24upx;
	.yz-span {
		font-size: 24rpx;
		color: #445DF0;
		margin-left: auto;
		margin-right: 24rpx;
	}

	.sendSmsBtn {
		// font-size: 24rpx;
		// color: #445DF0;
		// border: 2rpx solid #445DF0;
		// border-radius: 8rpx;

		// width: 85px;
		line-height: 56upx;
		height: 56upx;
		background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
		opacity: 1;
		border-radius: 41px;
	}

	.input-i {
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: start;
		font-size: 32rpx;
		padding-right: 24rpx;
		padding-left: 24rpx;
		border-bottom: 2rpx solid rgba(231, 231, 231, 1);

		.in-tit {
			width: 120rpx;
			font-size: 32upx;
			font-weight: 500;
			color: #333333;
		}

		.in-tit div {
			height: 100rpx;
		}

		.phcolor {
			color: #C1C1C1;
		}

		.yz-span {
			font-size: 24rpx;
			color: #445DF0;
			margin-left: auto;
			margin-right: 24rpx;

			button {
				font-size: 26upx;
				font-weight: 300;
				color: #FFFFFF;
			}
		}
	}
</style>
