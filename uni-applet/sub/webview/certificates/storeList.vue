<template>
	<view>
		<view class="shopList">
			<view class="list" v-for="(item,index) in shopList" :key="index" @click="goGiftPage(item,index)">
				<view class="itemtext">
					{{item.storeName}}
				</view>
				<view class="cuIcon-right">
				</view>
				<view class="prompt"
					:style="{'background': item.status == 0 ? '#fff' : item.status == 1 ? '#FBA440' : item.status == 2 ? '#F53232' : '#C1C1C1'}">
					{{item.status == 0 ? '' : item.status == 1 ? '待审核' : item.status == 2 ? '审核不通过' : '已关闭' }}
				</view>
			</view>
		</view>
		<view class="foot">
			<view class="reg_btn">
				<button type="default" @click="storeRegister">申请开通店铺</button>
			</view>
			<view class="reg_btn">
				<button type="default" @click="outStore">退出</button>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				phone: '',
				shopList: [],
				storeAccountId: ''
			}
		},
		onLoad(options) {
			uni.showLoading({
				title: '加载中'
			});
			this.phone = options.phone
			this.getAccount()
		},
		methods: {
			getAccount(e) {
				this.$http.getStoreInfoByPhone({
					phone: this.phone
				}).then(res => {
					uni.hideLoading()
					if (res.code == 200) {
						let arr = []
						res.data.map(item => {
							arr.push(item)
						})
						this.shopList = arr.sort(this.compare('status'))
						this.storeAccountId = this.shopList[0].storeAccountId
					}
				})
			},
			compare(property) {
				return (a, b) => {
					var value1 = a[property];
					var value2 = b[property];
					return value1 - value2;
				}
			},
			// 申请开通店铺
			storeRegister() {
				uni.navigateTo({
					url: `/sub/webview/index/index?webUrl=${encodeURIComponent(this.$queue.publicStoreYuMing() + '/inApplication?inWay=detault&type=create&storeAccountId=' + this.storeAccountId + '&phone=' + this.$queue.getData('account'))}`
				})
			},
			// 推出当前店铺
			outStore() {
				this.$queue.remove("store");
				this.$queue.remove("account");
				this.$queue.remove("storeToken");
				uni.navigateTo({
					url: "/sub/webview/storeLogin/storeLogin"
				})
			},
			goGiftPage(v, i) {
				if (v.storeRoleCode == 2) return this.$queue.showToast('该店铺不可登录')
				if (v.status != 0) return this.$queue.showToast('该店铺不可登录')
				this.$queue.setJson('store', v)
				uni.navigateBack({
					delta: 1
				})
				// uni.navigateTo({
				// 	url: '/sub/webview/certificates/certificates'
				// });
			}
		},
	}
</script>
<style lang="scss">
	page {
		background-color: #f7f7f7;
	}
	.shopList {
		padding-bottom: 150upx;
	}
	.list {
		margin: 24upx auto;
		width: 702upx;
		height: 156upx;
		background: #FFFFFF;
		border-radius: 16upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 28upx;
		box-sizing: border-box;
		position: relative;

		.prompt {
			position: absolute;
			top: 0upx;
			left: 0upx;
			width: 172upx;
			height: 38upx;
			border-radius: 16upx 0upx 0upx 0upx;
			text-align: center;
			line-height: 38upx;
			font-size: 24upx;
			font-weight: 300;
			color: #FFFFFF;
		}
	}

	.editPassword {
		margin: 20rpx 30rpx 10rpx;
		color: #eb6133;
		text-align: right;
	}

	.foot {
		margin-top: 30upx;
		z-index: 222;
		width: 100%;
		height: 140upx;
		position: fixed;
		bottom: 0upx;
		display: flex;
		align-items: center;
		padding-left: 48upx;
		background-color: #f7f7f7;

		.reg_btn {
			margin-bottom: 30upx;
			margin-left: 32upx;
			text-align: center;
			line-height: 76upx;

			button {
				width: 280rpx;
				height: 76rpx;
				font-size: 28rpx;
				text-align: center;
				line-height: 76rpx;
				border-radius: 50rpx;
				background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
				margin-top: 30rpx auto 0upx;
				color: #FFFFFF;




			}
		}

		.reg_btn button::after {
			border: 0;
		}


	}
</style>
