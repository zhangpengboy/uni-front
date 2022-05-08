<template>
	<view>
		<view class="icon text-xsl">
			<text class="cuIcon-roundcheckfill text-main"></text>
		</view>
		<view class="tis">
			订单支付成功
		</view>
		<view class="pay-amount">
			支付金额:{{amount}}元
		</view>
		<view class="back">
			<view class="btn" @tap="toUser">个人中心</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				amount: 0
			};
		},
		onLoad(e) {
			this.amount = parseFloat(e.amount).toFixed(2);
		},
		methods: {
			toUser() {
				uni.switchTab({
					url: "/pages/user/user"
				});
			}
		},
	}
</script>

<style lang="scss" scoped>
	view {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.icon {
		width: 100%;
		margin-top: 10vw;
	}

	.tis {
		width: 100%;
		margin-top: 20upx;
		font-size: 48upx;
	}

	.pay-amount {
		width: 100%;
		margin-top: 10upx;
		font-size: 32upx;
	}

	.back {
		position: absolute;
		width: 100%;
		bottom: 160upx;

		.btn {
			padding: 0 80upx;
			height: 70upx;
			border: solid 2upx $uni-color-main;
			color: $uni-color-main;
			align-items: center;
			border-radius: 10upx;
			font-size: 30upx;
		}
	}
</style>
