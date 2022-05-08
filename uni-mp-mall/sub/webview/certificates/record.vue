<template>
	<view class="">
		<view class="top-tab">
			<view>订单时间</view>
			<view>金额</view>
			<view>礼券</view>
			<view>状态</view>
		</view>
		<view class="list-box">
			<view v-for="(item, index) in buyList" :key="index" class="billmsg">
				<view class="billtime">{{ parseTime(item.createTime) }}</view>
				<view class="billname">&yen;{{ item.amount }}</view>
				<view class="billmoney">{{ item.integral }}</view>
				<view class="billmoney">{{item.status | filterPayStatus}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { parseTime } from '@/common/utils/DateUtils.js';
	export default {
		data() {
			return {
				storeId: '',
				pageNum: 1,
				pageSize: 17,
				buyList: [],
				isfinish: false
			};
		},
		onLoad(options) {
			if (options.storeId) {
				this.storeId = options.storeId
			}
			this.getRechargeOrderList()
		},
		onPullDownRefresh() {
			this.pageNum = 1;
			this.isfinish = false;
			// 加载猜你喜欢推荐商品
			this.buyList = [];
			this.getRechargeOrderList();
			// setTimeout(function() {
			// 	uni.stopPullDownRefresh();
			// }, 1000);
		},
		onReachBottom() {
			this.pageNum++;
			this.getRechargeOrderList();
		},
		methods: {
			parseTime,
			// 获取列表
			getRechargeOrderList() {
				if (this.isfinish) return;
				let obj = {}
				obj.userId = this.storeId
				obj.pageNum = this.pageNum
				obj.pageSize = this.pageSize
				uni.showLoading({
					mask: true,
					title: "加载中..."
				})
				this.$http.getRechargeOrderList(obj).then(res => {
					if (res.code == 200) {
						uni.hideLoading()
						uni.stopPullDownRefresh();
						this.buyList = _.concat(this.buyList, res.data.list);
						if (res.data.totalPage == this.pageNum || _.size(res.data.list) === 0) {
							this.isfinish = true;
						}
					}
				})
			},

		}
	};
</script>

<style lang="scss">
	page {
		background-color: #F7F7F7;
	}

	.top-tab {
		position: fixed;
		width: 91%;
		display: flex;
		align-items: center;
		height: 98rpx;
		background: #fff;
		justify-content: space-between;
		padding-left: 30rpx;
		padding-right: 40rpx;
		color: #000;
		box-shadow: 0 10rpx 20rpx -10rpx #eee;
		/*for Android*/
		-webkit-box-shadow: 0rpx 5rpx 10rpx -6rpx #eee;
		/*for IOS*/
		z-index: 20;
	}

	.list-box {
		position: absolute;
		top: 120rpx;
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
		margin-left: -18rpx;
		font-size: 30rpx;
	}

	.billtime {
		font-size: 22rpx;
		width: 120rpx;
		text-align: center;
	}

	.billmoney {
		font-size: 14px;

	}
</style>
