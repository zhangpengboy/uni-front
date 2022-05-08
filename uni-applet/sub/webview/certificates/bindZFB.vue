<template>
	<view class="container">
		<view class="extract-top">
			<view class="logo">
				<image src="/static/img/logo.png" mode=""></image>
			</view>
			<view class="jiantou">
				<view class="across"></view>
				<view class="triangle"></view>
			</view>
			<view class="logo">
				<image src="../../../static/img/z-alipay@2x.png" mode=""></image>
				<!-- <image src="@/assets/images/z-alipay@2x.png" /> -->
			</view>
		</view>
		<view class="input-box">
			<view class="input-i">
				<view class="in-tit">到账支付宝：</view>
				<view>
					<input type="text" v-model="accountin" placeholder="输入支付宝账号" placeholder-class="phcolor" />
				</view>
			</view>
			<view class="input-i">
				<view class="in-tit">真实姓名：</view>
				<view>
					<input type="text" v-model="namein" placeholder="输入与支付宝对应的姓名" placeholder-class="phcolor" />
				</view>
			</view>
			<view class="input-i">
				<view class="in-tit">手机号码：</view>
				<view>
					<input type="number" maxlength="11" disabled v-model="phonein" placeholder="输入手机号"
						placeholder-class="phcolor" />
				</view>
			</view>
			<view class="input-i yzm">
				<view class="in-tit">验证码：</view>
				<view>
					<input type="number" v-model="yzmin" maxlength="6" placeholder="输入验证码"
						placeholder-class="phcolor" />
				</view>
				<view class="yz-span">
					<!-- <span v-if="yzmdjs==60" @click="sendSms">获取验证码</span>
	          <span v-if="yzmdjs!=60">{{yzmdjs}}秒后重新获取</span> -->
					<!-- <input type="button" :disabled="disabled" @click="sendSms" v-model="btnMsg == null ? countNum+'s后重新发送' : btnMsg"> -->
					<button class="sendSmsBtn" type="button" @click="sendSms"
						:disabled="disabled">{{ text == null ? yzmdjs + '秒后重新获取' : text }}</button>
				</view>
			</view>
		</view>
		<view @click="bindingAli" class="sub-btn">立即绑定</view>
		<!-- :class="[accountin.length != 0 && yzmin.length == 6 && phonein.length == 11 && namein != '' ? '':'sub-btn2']" -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				yzmdjs: 60,
				disabled: false,
				intervalBtn: null,
				text: "获取验证码",
				accountin: "",
				namein: "",
				phonein: "",
				yzmin: "",
				storeId: '', //账户ID
				signNo: "",
				type: null
			};
		},
		onLoad(e) {
			if (e.type == 0) {
				this.storeId = e.storeId
				this.type = e.type
			} else {
				const storeAgentObj = this.$queue.getJson('store')
				this.storeId = storeAgentObj.id
				this.type = e.type
			}
		},
		mounted() {
			this.phonein = this.$queue.getData("phone")
		},
		methods: {
			async sendSms() {
				if (!this.phonein) return this.$queue.showToast('请输入手机号')
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
				const resultSignNo = await this.$http.addSignNo({
					"mobile": this.phonein
				})
				if (resultSignNo.code == 200) {
					this.signNo = resultSignNo.data
					this.$http.addSendSms({
						"mobile": this.phonein,
						"signNo": resultSignNo.data
					}).then(res => {
						if (res.code != 200) {
							return this.$queue.showToast('短信发送失败')
						}
						this.$queue.showToast('短信发送成功')
					})
				}
			},
			bindingAli() {
				if (!this.accountin) return this.$queue.showToast('请输入支付宝账号')
				if (!this.namein) return this.$queue.showToast('请输入与手机号对应的姓名')
				if (!this.phonein) return this.$queue.showToast('请输入手机号')
				if (!this.yzmin) return this.$queue.showToast('请输入验证码')
				this.$http.addAlipay({
					"account": this.accountin,
					"userId": this.storeId,
					"code": this.yzmin,
					"phone": this.phonein,
					"signNo": this.signNo,
					"userName": this.namein,
					"userType": this.type
				}).then(res => {
					if (res.code != 200) {
						return this.$queue.showToast('支付宝绑定失败')
					}
					this.$queue.showToast('支付宝绑定成功')
					uni.navigateBack({
						delta: 1
					})
				})
			}
		}

	};
</script>

<style lang="scss">
	.extract-top {
		height: 180rpx;
		display: flex;
		background: #fff;
		margin: 10rpx 0rpx 10rpx 0rpx;
		align-items: center;
		justify-content: center;
	}

	.logo image,
	.logo {
		height: 103rpx;
		width: 103rpx;
	}

	.jiantou {
		display: flex;
		align-items: center;
	}

	.across {
		height: 12rpx;
		width: 129rpx;
		background: linear-gradient(90deg, rgba(68, 93, 240, 1) 0%, rgba(76, 170, 236, 1) 100%);
		margin-left: 30rpx;
	}

	.triangle {
		z-index: 1;
		width: 0;
		height: 0;
		border-width: 18rpx 0 18rpx 20rpx;
		border-style: solid;
		border-color: transparent transparent transparent rgba(76, 168, 236, 1);
		position: relative;
		margin-right: 30rpx;
	}

	.input-box {
		height: 410rpx;
		margin-top: 24rpx;
		background: #fff;
		padding-left: 24rpx;
		width: 100%;
	}

	.input-i {
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: start;
		font-size: 32rpx;
		padding-right: 24rpx;
		border-bottom: 2rpx solid rgba(231, 231, 231, 1)
	}

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
		// height: 28px;
		background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
		opacity: 1;
		border-radius: 41px;
	}

	.yz-span button {
		// color:#445DF0;

		font-size: 26upx;
		font-weight: 300;
		color: #FFFFFF;
	}

	.in-tit {
		width: 240rpx;
		font-size: 28upx;
		font-weight: 300;
		color: #333333;
	}

	.in-tit div {
		height: 100rpx;
	}

	.phcolor {
		color: #C1C1C1;
	}

	.yzm input {
		width: 200rpx;
	}

	.sub-btn {
		// height: 88rpx;
		// width: 690rpx;
		margin: 64rpx auto 0 auto;
		line-height: 76rpx;
		text-align: center;
		color: #fff;
		// border-radius: 10rpx;
		background: #ec6530;

		width: 524upx;
		height: 76upx;
		// background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
		border-radius: 41upx;
	}

	.sub-btn2 {
		background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
		color: #FFF !important;
	}
</style>
