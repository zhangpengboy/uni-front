<template>
	<view class="container">
		<view class="moneyList" v-if="type == 1">
			<view class="moneyItem" v-for="item in dataList" :key="item">
				<view class="item">
					<view class="instructions">
						<view class="note">
							{{item.mark}}
						</view>
						<view class="amount" v-if="item.withdrawStatus == 0">
							-{{item.money}}
						</view>
						<view class="addAmount" v-if="item.withdrawStatus == 1">
							-{{item.money}}
						</view>
						<view class="amount" v-if="item.withdrawStatus == 2">
							+{{item.money}}
						</view>
					</view>
					<view class="time">
						{{parseTime(item.createTime)}}
						<text v-if="item.freeStatus == 0">(冻结)</text>
					</view>
				</view>
			</view>
		</view>
		<view class="moneyList" v-else>
			<view class="moneyItem" v-for="item in dataList" :key="item">
				<view class="item">
					<view class="instructions">
						<view class="note">
							{{item.des}}
						</view>
						<view class="amount" v-if="item.status == 0">
							-{{item.amount}}
						</view>
						<view class="addAmount" v-if="item.status == 1">
							+{{item.amount}}
						</view>
					</view>
					<view class="time">
						{{parseTime(item.createTime)}}
						<text v-if="item.freeStatus == 0">(冻结)</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		parseTime
	} from "@/common/utils/DateUtils.js"
	export default {
		data() {
			return {
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					isfinish: false,
				},
				type: 0,
				accountId: '',
				dataList: []
			};
		},
		onLoad(options) {
			this.type = options.type
			this.accountId = options.accountId
			this.getinterface()
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			this.queryParams.pageNum = 1;
			this.queryParams.isfinish = false;
			this.dataList = []
			this.getinterface()
		},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		onReachBottom() {
			if (this.totalPage > this.queryParams.pageNum) {
				uni.showLoading({
					mask: true,
					title: "加载中..."
				})
				this.queryParams.pageNum++;
				this.getinterface();
			}
		},
		methods: {
			parseTime,
			getinterface(){
				if(this.type == 1) {
					// 提现记录
					uni.setNavigationBarTitle({
						title: '提现记录'
					})
					this.getMoneyDrawList()
				} else if(this.type == 2) {
					// 账户解冻金额
					uni.setNavigationBarTitle({
						title: '可用余额'
					})
					this.queryParams.freeStatus = 1
					this.queryParams.accountId = this.accountId 
					this.getMoney()
				} else if(this.type == 3) {
					// 账户冻结金额
					uni.setNavigationBarTitle({
						title: '冻结金额'
					})
					this.queryParams.freeStatus = 0
					this.queryParams.accountId = this.accountId 
					this.getMoney()
				}
			},
			// 资金流水记录
			getMoney(){
				this.queryParams.userType = 1
				this.$http.getMoneyList(this.queryParams).then(res => {
					if (res.code == 200) {
						uni.stopPullDownRefresh();
						uni.hideLoading()
						if (res.data.list.length === 0) {
							return uni.showToast({
								title: '暂无记录',
								icon: 'none'
							});
						}
						this.totalPage = res.data.totalPage
						this.dataList = _.concat(this.dataList, res.data.list);
						if (res.data.totalPage == this.queryParams.pageNum || _.size(res.data.list) === 0) {
							this.queryParams.isfinish = true;
						}
						this.dataList.map(item => {
							
						})
					} else {
						this.dataList = []
						this.queryParams.isfinish = true
					}
				})
			},
			//提现流水
			getMoneyDrawList() {
				if (this.queryParams.isfinish) return;
				uni.showLoading({
					title: '加载中'
				});
				const shop = this.$queue.getJson('store')
				this.queryParams.userId = shop.id
				this.$http.getMoneyDrawList(this.queryParams).then(res => {
					if (res.code == 200) {
						uni.stopPullDownRefresh();
						uni.hideLoading()
						if (res.data.list.length === 0) {
							return uni.showToast({
								title: '暂无提现记录',
								icon: 'none'
							});
						}
						this.totalPage = res.data.totalPage
						this.dataList = _.concat(this.dataList, res.data.list);
						if (res.data.totalPage == this.queryParams.pageNum || _.size(res.data.list) === 0) {
							this.queryParams.isfinish = true;
						}
					} else {
						this.dataList = []
						this.queryParams.isfinish = true
					}
				})
			}
		}
	};
</script>

<style lang="scss">
	.top-tab {
		position: fixed;
		width: 92%;
		display: flex;
		align-items: center;
		height: 98rpx;
		background: #eb6132;
		justify-content: space-between;
		padding-left: 30rpx;
		padding-right: 32rpx;
		color: #fff;
		box-shadow: 0rpx 10rpx 20rpx -10rpx #eb6132;
		/*for Android*/
		-webkit-box-shadow: 0rpx 5rpx 10rpx -6rpx #eb6132;
		/*for IOS*/
		z-index: 20;
	}

	.onorder {
		width: 100%;
		height: 50vw;
		display: flex;
		justify-content: center;
		align-content: center;
		flex-wrap: wrap;

		image {
			width: 20vw;
			height: 20vw;
			margin-top: 80rpx;
			border-radius: 100%;
		}

		.text {
			width: 100%;
			height: 60upx;
			font-size: 28upx;
			color: #444;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.list-box {
		position: absolute;
		top: 90rpx;
		left: 0;
		bottom: 0;
		width: 100%;
	}

	.billmsg {
		padding-left: 30rpx;
		padding-right: 30rpx;
		display: flex;
		justify-content: space-between;
		height: 120rpx;
		align-items: center;
		border-bottom: 2rpx solid rgba(231, 231, 231, 1);
	}

	.billname {

		font-size: 30rpx;
	}

	.billtime {
		font-size: 24rpx;
		width: 88rpx;
	}

	.billmoney {
		text-align: center;
		font-size: 28rpx;
	}

	.moneyList {
		margin: 0 28upx;
		background-color: #fff;

		.moneyItem {
			margin-top: 20rpx;

			.item {
				height: 144upx;
				box-sizing: border-box;
				padding-top: 28upx;
				border-bottom: 2upx solid #F6F6F6;

				.instructions {
					display: flex;
					justify-content: space-between;
					margin: 0 28upx;

					.note {
						font-size: 30upx;
						font-weight: 500;
						color: #333333;
					}

					.addAmount {
						font-size: 32upx;
						font-weight: 500;
						color: #EB6133;
					}

					.amount {
						font-size: 32upx;
						font-weight: 500;
						color: #333333;
					}
				}

				.time {
					margin-top: 12upx;
					margin-left: 28upx;
					margin-right: 28upx;
					font-size: 24upx;
					font-weight: 300;
					color: #999999;
					display: flex;
					justify-content: space-between;
				}
			}
		}
	}
</style>
