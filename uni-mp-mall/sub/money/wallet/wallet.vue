<template>
	<view class="myWallet">
		<view class="myCd">
			<view class="assets">
				<view class="myAssets">我的资产</view>
				<!-- <view class="particulars" @click="goTheDeatil">明细</view> -->
			</view>
			<view class="balance">余额 (元)</view>
			<view class="amount">{{userMoney.freeAmount}}</view>
		</view>
		<view class="operation">
			<view class="canWith">可提现余额（元）：{{userMoney.freeAmount}}</view>
			<view class="mention" @click="mention">提现</view>
		</view>
		<view class="myWay" @click="bindZFB">
			<view class="Alipay">支付宝</view>
			<view class="notTie" v-if="aliaccount">(未绑定)<text class="icon">></text></view>
			<view class="notTie" v-if="!aliaccount">已绑定<text class="icon">></text></view>
		</view>
		<view class="moneyList">
			<view class="moneyItem" v-for="item in MoneyList" :key="item">
				<view class="item">
					<view class="instructions">
						<view class="note">
							{{item.des}}
						</view>
						<view class="amount" v-if="item.status == 0">
							{{item.amount == 0 ? '' : '-' }}{{item.amount}}
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
		<view class="cu-load" style="background-color: #f3f3f3;" :class="queryParams.isfinish ? 'over' : 'loading'"></view>
		</view>
		
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
				userId: '',
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					isfinish: false,
					actCode: ""
				},
			};
		},
		onLoad(options) {
			uni.showLoading({
				mask: true,
				title: "加载中..."
			})
			this.userId = options.id
			// this.getMoney()
			// this.getAlipayUser()
			// this.getMoneyList()
		},
		onShow() {
			this.getMoney()
			this.getAlipayUser()
			this.MoneyList = [];
			this.getMoneyList()
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			this.queryParams.pageNum = 1;
			this.queryParams.isfinish = false;
			// 加载猜你喜欢推荐商品
			this.MoneyList = [];
			this.getMoneyList();
			// this.getActBannerList();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			});
		},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		onReachBottom() {
			if (this.totalPage > this.queryParams.pageNum) {
				uni.showLoading({
					mask: true,
					title: "加载中..."
				})
				this.queryParams.pageNum++;
				// this.getAlipayUser();
				this.getMoneyList();
			}

		},
		filters: {
			parseTime
		},
		methods: {
			parseTime,
			getMoney() {
				this.$http.getMoneyInfo().then(res => {
					if (res.code == 200) {
						uni.hideLoading()
						this.userMoney = res.data
					} else {
						uni.hideLoading()
					}
				})
			},
			//根据账户获取绑定的支付宝账号
			getAlipayUser() {
				uni.showLoading({
					title: '加载中'
				});
				this.$http.getAlipayUser({userId: this.userId}).then(res => {
					if (res.code == 200) {
						uni.hideLoading()
						if (res.data == null) {
							this.aliaccount = true
						} else {
							this.aliaccount = false
							this.accountName = res.data.userName
						}
					}
				})
			},
			getMoneyList() {
				this.$http.getMoneyList(this.queryParams).then(res => {
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
			//提现
			mention() {
				if (this.aliaccount) return this.$queue.showToast('请绑定支付宝');
				uni.navigateTo({
					url: '../../webview/certificates/withdraw?userId=' + this.userId
				})
			},
			bindZFB() {
				if (this.aliaccount) {
					uni.navigateTo({
						url: '../../webview/certificates/bindZFB?userId=' + this.userId + '&type=0'
					})
				} else {
					uni.navigateTo({
						url: '../../webview/certificates/aliaccounts?userId=' + this.userId
					})
				}
			},
			goTheDeatil() {
				uni.navigateTo({
					url: '../theDetail/theDetail'
				})
			},
		}
	};
</script>

<style lang="scss" scoped>
	.myWallet {
		.myCd {
			background-image: url(../../orders/static/img/myCd.png);
			background-size: cover;
			background-repeat: inherit;
			width: 694upx;
			height: 336upx;
			margin: 24upx 28upx 40upx;
			border-radius: 20upx;

			.assets {
				height: 90upx;

				.myAssets {
					margin: 40upx 0 0 24upx;
					float: left;
					font-size: 36upx;
					font-weight: 300;
					color: #FFFFFF;
				}

				.particulars {
					margin: 48upx 24upx 0 0upx;
					float: right;
					font-size: 28upx;
					font-weight: 300;
					color: #333333;
				}
			}

			.balance {
				text-align: center;
				font-size: 26upx;
				font-weight: 300;
				margin: 20upx 0upx 12upx;
				color: #FFFFFF;
			}

			.amount {
				text-align: center;
				font-size: 48upx;
				font-weight: 500;
				color: #FFFFFF;
			}
		}

		.operation {
			height: 60upx;
			margin: 0upx 28upx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.canWith {
				font-size: 30upx;
				font-weight: 500;
				color: #333333;
			}

			.mention {
				width: 112upx;
				height: 56upx;
				background: $uni-bg-color-main;
				border-radius: 16upx;
				text-align: center;
				line-height: 56upx;
				font-size: 28upx;
				color: #FFFFFF;
			}
		}

		.myWay {
			height: 104upx;
			margin: 28upx;
			background: #FFFFFF;
			border-radius: 16upx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.Alipay {
				margin-left: 28upx;
				font-size: 28upx;
				font-weight: 300;
				color: #333333;
			}

			.notTie {
				margin-right: 28upx;
				font-size: 28upx;
				font-weight: 300;
				color: #999999;

				text {
					margin-left: 20upx;
					color: #999999;
				}
			}
		}

		.moneyList {
			margin: 0 28upx;
			background-color: #fff;

			.moneyItem {
				.item {
					// height: 144upx;
					box-sizing: border-box;
					padding:28upx 0;
					border-bottom: 2upx solid #F6F6F6;
					;

					.instructions {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin: 0 28upx;

						.note {
							font-size: 30upx;
							font-weight: 700;
							color: #333333;
						}

						.addAmount {
							font-size: 32upx;
							font-weight: 700;
							color: $base;
						}

						.amount {
							font-size: 32upx;
							font-weight: 700;
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
	}
</style>
