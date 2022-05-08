<template>
	<view class="container">
		<view class="account-top">
			<view class="a-tky">总金额（元）</view>
			<view class="a-kym">{{ allAmount }}</view>
			<!-- <view class="account-jsdj">
				<view class="djsbt"  @click="awaitmsg()">
					<view>可用金额（元）</view>
				</view>
				<view class="djsbt" @click="frostmsg()">
					<view>冻结金额（元）</view>
				</view>
			</view>
			<view class="acc-jddj-mon">
				<view>{{ freeAmount }}</view>
				<view>{{ frozenAmount }}</view>
			</view> -->
			<view class="account-jsdj">
				<view class="" @click="awaitmsg()">
					<view class="djsbt">
						<view>可用金额（元）</view>
					</view>
					<view style="font-size: 38rpx;">{{ freeAmount }}</view>
				</view>
				<view class="" @click="frostmsg()">
					<view class="djsbt">
						<view>冻结金额（元）</view>
					</view>
					<view style="font-size: 38rpx;">{{ frozenAmount }}</view>
				</view>
			</view>
		</view>
		<view class="bt-list" @click="gotobindZFB">
			<view class="bt-wz">支付宝</view>
			<view class="money" v-if="!aliaccount">{{ accountName }}</view>
			<view class="money" v-if="aliaccount">（未绑定）</view>
			<view class="jiantou"></view>
		</view>
		<view class="bt-list" @click="gotorecord">
			<view class="bt-wz">提现记录</view>
			<view class="money"></view>
			<view class="jiantou"></view>
		</view>
		<view class="bt-list" @click="gotowithdraw">
			<view class="bt-wz">提现</view>
			<view class="money">（可提现{{freeAmount}}元）</view>
			<view class="jiantou"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				indextype: false,
				aliaccount: true,
				account: '',
				settled_balance: '',
				show: false,
				close: 2, // 结算
				unclose: 1, // 待结算
				accountName: '', //支付宝账户名称
				allAmount: '0.00', //总金额
				freeAmount: '0.00', //可用金额
				frozenAmount: '0.00', //冻结金额
				shop: {},
				accountId: ''
			};
		},
		onLoad(options) {
			this.shop = this.$queue.getJson('store')
		},
		onShow() {
			this.getMoneyInfo()
			this.getAlipayUser()
		},
		methods: {
			//获取用户资产总数
			getMoneyInfo() {
				uni.showLoading({
					title: '加载中'
				});
				this.$http.getMoneyInfo({
					"userId": this.shop.id,
				}).then(res => {
					if (res.code == 200) {
						uni.hideLoading()
						if (res.data) {
							this.allAmount = res.data.allAmount.toFixed(2).toString()
							this.freeAmount = res.data.freeAmount.toFixed(2).toString()
							this.frozenAmount = res.data.frozenAmount.toFixed(2).toString()
							this.accountId = res.data.accountId
						}

					}
				})
			},
			//根据账户获取绑定的支付宝账号
			getAlipayUser() {
				uni.showLoading({
					title: '加载中'
				});
				this.$http.getAlipayUser({
					"userId": this.shop.id
				}).then(res => {
					if (res.code == 200) {
						uni.hideLoading()
						if (res.data) {
							this.aliaccount = false
							this.accountName = res.data.userName
						}
					}
				})
			},
			//提现记录页面
			gotorecord() {
				uni.navigateTo({
					url: './withdrawrecord?type=1'
				})
			},
			awaitmsg() {
				uni.navigateTo({
					url: './withdrawrecord?type=2&accountId=' + this.accountId
				})
			},
			frostmsg() {
				uni.navigateTo({
					url: './withdrawrecord?type=3&accountId=' + this.accountId
				})
			},
			// 绑定支付宝页面
			gotobindZFB() {
				if (this.aliaccount) {
					uni.navigateTo({
						url: './bindZFB?type=1'
					})
				} else {
					uni.navigateTo({
						url: './aliaccounts?storeId=' + this.shop.id
					})
				}
			},
			// 提现
			gotowithdraw() {
				if (this.aliaccount) return this.$queue.showToast('未绑定支付宝')
				uni.navigateTo({
					url: './withdraw?storeId=' + this.shop.id
				})
			}
		}
	};
</script>

<style lang="scss">
	.account-top {
		/* height: 316px; */
		background: #eb6132;
		padding-top: 66rpx;
		color: #fff;
		padding-left: 46rpx;
		padding-bottom: 40rpx;
	}

	.account-jsdj {
		margin-right: 46rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.a-tky {
		font-size: 32rpx;
		font-weight: 400;
	}

	.a-kym {
		margin-top: 10rpx;
		margin-bottom: 80rpx;
		font-size: 68rpx;
		font-weight: bold;
	}

	.djsbt {
		display: flex;
		color: #E7E7E7;
		font-size: 32rpx;
	}

	.quan {
		width: 38rpx;
		height: 38rpx;
		border-radius: 50%;
		border: 2rpx solid #E8E8E8;
		text-align: center;
		line-height: 38rpx;
		margin-left: 10rpx;
	}

	.acc-jddj-mon {
		width: 644rpx;
		display: flex;
		justify-content: space-between;
		font-size: 38rpx;
	}

	.bt-list {
		display: flex;
		align-items: center;
		height: 88rpx;
		margin-top: 10rpx;
		background: #fff;
		font-size: 32rpx;
	}

	.jiantou {
		width: 20rpx;
		height: 20rpx;
		border-top: 4rpx solid #333333;
		border-right: 4rpx solid #333333;
		transform: rotate(45deg);
		margin-left: 20rpx;
	}

	.bt-wz {
		margin-left: 24rpx;
	}

	.money {
		margin-left: auto;
		color: #F12E5C
	}

	.jiantou {
		margin-right: 30rpx;
	}
</style>
