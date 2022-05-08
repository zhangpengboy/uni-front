<template>
	<view class="moneyList">
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
		<view class="cu-load" :class="queryParams.isfinish ? 'over' : 'loading'"></view>
	</view>
</template>

<script>
	import {
		parseTime
	} from '@/common/utils/DateUtils.js'
	export default {
		data() {
			return {
				MoneyList: [],
				totalPage: 0,
				distinguish: '',
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
			uni.setNavigationBarTitle({
				title: options.title
			})
			this.distinguish = options.num
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
				this.getMoneyList();
			}

		},
		filters: {
			parseTime
		},
		methods: {
			async getMoneyList() {
				let res = null;
				if (this.distinguish == 1) {
					res = await this.$http.getIntegralListById(this.queryParams)
				} else if (this.distinguish == 2) {
					res = await this.$http.getFrozenIntegralListById(this.queryParams)
				} else {
					res = await this.$http.getlockList(this.queryParams)
				}
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
			},
		}
	};
</script>

<style lang="scss">
	.moneyList {
		margin: 28upx 28upx;

		.moneyItem {
			border-radius: 16upx;
			background-color: #fff;
			padding: 0 28upx;

			.item {
				height: 144upx;
				box-sizing: border-box;
				padding-top: 28upx;
				border-bottom: 2upx solid #F6F6F6;
				;

				.instructions {
					display: flex;
					justify-content: space-between;

					.note {
						font-size: 30upx;
						font-weight: 500;
						color: #333333;
					}

					.addAmount {
						font-size: 32upx;
						font-weight: 500;
						color: #333;
					}

					.amount {
						font-size: 32upx;
						font-weight: 500;
						color: #EB6133;
					}
				}

				.time {
					margin-top: 12upx;
					font-size: 24upx;
					font-weight: 300;
					color: #999999;
				}
			}
		}
	}
</style>
