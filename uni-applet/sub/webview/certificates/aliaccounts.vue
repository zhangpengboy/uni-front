<template>
	<view class="container">
		<view class="top">已绑定支付宝</view>
		<view class="conten">
			<view class="input-b">
				<view class='input-b-ali'>到账支付宝：</view>
				<view>{{bank_account}}</view>
			</view>
			<view class="input-b">
				<view class='input-b-ali'>真实姓名：</view>
				<view>{{proposer}}</view>
			</view>
		</view>
		<view class="hint">
			<view class='hint_text'>提示：</view>
			<view class="hint-wz">
				为保障您的资金安全，暂不提供更换已绑定的支付宝账户，若需要
				更换支付宝账户，请拨打客服电话：
				<text style="color: #EC221E">4006235236</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bank_account: "",
				proposer: "",
				userId: ""
			};
		},
		onLoad(options) {
			this.userId = options.userId
			this.getAlipayUser()
		},
		methods: {
			getAlipayUser(){
				// const storeAlipayUser = this.$queue.getJson('storeAlipayUser')
				// if(storeAlipayUser){
				// 	this.bank_account = storeAlipayUser.account
				// 	this.proposer = storeAlipayUser.userName
				// }else{
					uni.showLoading({
						title: '加载中'
					});
					// const storeAgentObj = this.$queue.getJson('store')
					// if(storeAgentList.length === 0) return uni.showToast({title: '获取用户ID失败'});
					// this.userId = storeAgentObj.id
					this.$http.getAlipayUser({
						"userId": this.userId
					}).then(res => {
						if(res.code == 200){
							uni.hideLoading()
							if(res.data){
								this.bank_account = res.data.account
								this.proposer = res.data.userName
							}
						}
					})
				// }
			}
		}
	};
</script>

<style lang="scss">
	.top {
		height: 86rpx;
		line-height: 86rpx;
		background: #f3f3f3;
		color: #333333;
		font-size: 28rpx;
		padding-left: 24rpx;
	}

	.conten {
		margin-top: 10rpx;
		background: #fff;
		padding-left: 24rpx;
	}

	.input-b {
		display: flex;
		height: 100rpx;
		align-items: center;
		font-size: 32rpx;
		border-bottom: 2rpx solid rgba(231, 231, 231, 1);
	}

	.input-b-ali {
		width: 200rpx;
	}

	.hint-wz {
		margin-top: 30rpx;
		font-size: 24rpx;
		font-weight: 300;
		color: #999;
	}

	.hint {
		padding: 60rpx 24rpx 0 24rpx;
	}

	.hint_text {
		font-size: 28rpx
	}
</style>
