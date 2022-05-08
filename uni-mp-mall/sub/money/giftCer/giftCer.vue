<template>
	<view class="myWallet">
		<view class="myCd">
			<view class="assets">
				<view class="myAssets">礼券总数 （个）</view>
				<view class="particulars">
					{{userMoney.allAmount == undefined ? 0 : userMoney.allAmount}}
				</view>
				<!-- <view class="particulars" @click="goTheDeatil">明细</view> -->
			</view>
			<view class="number">
				<view class="available" @click="gotothisdetail(1)">
					<view class="balance">{{userMoney.freeAmount}}</view>
					<view class="amount">可用礼券</view>
				</view>
				<view class="freeze" @click="gotothisdetail(2)">
					<view class="balance">{{userMoney.frozenAmount}}</view>
					<view class="amount">冻结礼券</view>
				</view>
				<view class="freeze" @click="gotothisdetail(3)">
					<view class="balance">{{userMoney.lockAmount}}</view>
					<view class="amount">待释放礼券</view>
				</view>
			</view>
		</view>
		<!-- <view class="operation">
			<view class="canWith">礼券明细</view>
		</view> -->
		<!-- <view class="moneyList">
			<view class="moneyItem" v-for="item in MoneyList" :key="item">
				<view class="item">
					<view class="instructions">
						<view class="note">
							{{item.des}}

						</view>
						<view class="addAmount" v-if="item.status == 0">
							{{item.amount == 0 ? '' : '-' }}{{item.amount}}
						</view>
						<view class="amount" v-if="item.status == 1">
							+{{item.amount}}
						</view>
					</view>
					<view class="time">
						{{item.createTime, '{y}-{m}-{d} {h}:{i}:{s}' | parseTime }}
						<text v-if="item.freeStatus == 0">(冻结)</text>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-load" :class="queryParams.isfinish ? 'over' : 'loading'"></view> -->
	</view>
</template>

<script>
	import {
		parseTime
	} from '@/common/utils/DateUtils.js'
	export default {
		data() {
			return {
				userMoney: {},
				aliaccount: true,
				MoneyList: [],
				totalPage: 0,
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					isfinish: false,
				},
			};
		},
		onLoad(options) {
			uni.showLoading({
				mask: true,
				title: "加载中..."
			})
			this.getMoney()
			// this.getAlipayUser()
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		// onPullDownRefresh() {
		// 	this.queryParams.pageNum = 1;
		// 	this.queryParams.isfinish = false;
		// 	// 加载猜你喜欢推荐商品
		// 	this.MoneyList = [];
		// 	this.getAlipayUser();
		// 	// this.getActBannerList();
		// 	setTimeout(function() {
		// 		uni.stopPullDownRefresh();
		// 	});
		// },
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		// onReachBottom() {
		// 	if (this.totalPage > this.queryParams.pageNum) {
		// 		uni.showLoading({
		// 			mask: true,
		// 			title: "加载中..."
		// 		})
		// 		this.queryParams.pageNum++;
		// 		this.getAlipayUser();
		// 	}

		// },
		filters: {
			parseTime
		},
		methods: {
			getMoney() {
				this.$http.getUserGral().then(res => {
					if (res.code == 200) {
						uni.hideLoading()
						this.userMoney = res.data
					} else {
						uni.hideLoading()
					}
				})
			},
			gotothisdetail(v) {
				let title = '';
				if (v == 1) {
					title = '礼券明细';
				} else if (v == 2) {
					title = '冻结礼券明细';
				} else {
					title = '待释放礼券明细';
				}
				uni.navigateTo({
					url: '../theDetail/theDetail?title=' + title + '&num=' + v
				})
			},
			getAlipayUser() {
				uni.showLoading({
					title: '加载中'
				});
				this.$http.getIntegralListById(this.queryParams).then(res => {
					if (res.code == 200) {
						uni.stopPullDownRefresh()
						uni.hideLoading()
						this.totalPage = res.data.totalPage
						this.MoneyList = _.concat(this.MoneyList, res.data.list);
						this.MoneyList.map((item, index) => {
							if (!item) {
								this.MoneyList.splice(index, 1)
							}
						})
						if (res.data.totalPage == this.queryParams.pageNum || _.size(res.data.list) === 0) {
							this.queryParams.isfinish = true;
						}
					} else {
						this.MoneyList = []
						this.queryParams.isfinish = true
					}
				})
			},
		}
	};
</script>

<style lang="scss" scoped>
	.myWallet {
		.myCd {
			// background-image: url(../../orders/static/img/mygift.png);
			// background-size: cover;
			// background-repeat: inherit;
			background: $uni-bg-color-main;
			width: 100%;
			height: 312upx;
			padding: 24upx 28upx;
			// border-radius: 20upx;

			.assets {
				height: 90upx;
				display: flex;
				justify-content: flex-start;

				.myAssets {
					margin: 40upx 0 0 24upx;
					font-size: 36upx;
					font-weight: 300;
					color: #FFFFFF;

				}

				.particulars {
					margin: 40upx 0 0 24upx;
					font-size: 40upx;
					font-weight: 300;
					color: #FFFFFF;
				}
			}

			.number {
				display: flex;
				justify-content: space-around;

				.available {
					text-align: center;
					margin-top: 112upx;

					.balance {
						margin-bottom: 12upx;
						font-size: 36upx;
						font-weight: 300;
						color: #FFFFFF;
					}

					.amount {
						font-size: 26upx;
						font-weight: 200;
						color: #FFFFFF;
					}
				}

				.freeze {
					text-align: center;
					margin-top: 112upx;

					.balance {
						margin-bottom: 12upx;
						font-size: 36upx;
						font-weight: 300;
						color: #FFFFFF;
					}

					.amount {
						font-size: 26upx;
						font-weight: 200;
						color: #FFFFFF;
					}
				}
			}

		}

		.operation {
			margin: 36upx 0upx 24upx 28upx;
			border-radius: 16upx;

			.canWith {
				font-size: 32upx;
				font-weight: 500;
				color: #333333;
			}
		}

		.moneyList {
			margin: 0 28upx;
			background-color: #fff;

			.moneyItem {
				.item {
					height: 144upx;
					box-sizing: border-box;
					padding-top: 28upx;
					border-bottom: 2upx solid #F6F6F6;
					;

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
							color: #333333;
						}

						.amount {
							font-size: 32upx;
							font-weight: 500;
							color: #EB6133;
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
	}
</style>
