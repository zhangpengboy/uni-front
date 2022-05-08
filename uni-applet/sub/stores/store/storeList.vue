<template>
	<view class="" v-if="isloading == 0">
		<view class="" v-if="list.length">
			<view class="store_top" v-for="item in list" :key="item" @click="goStore(item)">
				<view class="">
					<image src="/static/img/logo.png" class="storeImg"></image>
					<view class="store_name_favor">
						<view class="store_name">{{ item.storeName }}</view>
						<view class="store_favor">{{ item.favorCount }}人关注</view>
					</view>
				</view>
				<view class="store_but">
					<!-- <text class="favor_txt" @click.stop="delStore(item)">{{ '已关注' }}</text> -->
					<text class="favor_txt">{{ '已关注' }}</text>
				</view>
			</view>
			<view class="cu-load" :class="queryParams.isfinish ? 'over' : 'loading'"></view>
		</view>
		<view class="noFocus" v-else>
			<image src="https://lz.static.seprain.com/assets/imgs/no_focusOn.png" mode=""></image>
			<view>还没有关注的店铺哦~</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isloading: 1,
				list: [],
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					isfinish: false
				},
				storeId: ''
			}
		},
		onLoad(option) {
			this.pageListStore()
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			this.queryParams.pageNum = 1;
			this.queryParams.isfinish = false;
			// 加载猜你喜欢推荐商品
			this.list = [];
			this.pageListStore();
			// setTimeout(function() {
			// 	uni.stopPullDownRefresh();
			// }, 1000);
		},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		onReachBottom() {
			this.queryParams.pageNum++;
			this.pageListStore();
		},
		methods: {
			async pageListStore() {
				if (this.queryParams.isfinish) return false;
				this.$queue.showLoading("加载中...");
				const result = await this.$http.pageListStore(this.queryParams);
				this.isloading = 0
				uni.hideLoading();
				uni.stopPullDownRefresh();
				if (!result.success) return $queue.showToast("加载失败...");
				this.list = _.concat(this.list, result.data.list);
				if (result.data.pageNum == result.data.totalPage || result.data.total == 0) {
					this.queryParams.isfinish = true;
				}
			},
			/* 店铺按钮 */
			goStore(item) {
				if (!this.hasLogin) {
					uni.redirectTo({
						url: "/pages/login/login?page=user"
					})
				}
				uni.navigateTo({
					url: "/sub/stores/store/storeDetail?storeId=" + item.storeId
				});
			},
			// 取消店铺关注
			delStore(item) {
				this.$http.delStore({
					storeId: item.storeId
				}).then(res => {
					if (res.code == 200) {
						this.list = []
						this.queryParams.isfinish = false
						this.pageListStore()
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	$base: #C1C1C1;

	.store_top {
		// display: flex;
		// justify-content: center;
		// align-items: center;
		background-color: #fff;
		padding: 28rpx;
		border-bottom: 2upx solid #eee;
		position: relative;

		.store_name_favor {
			margin: 0 30rpx 0 20rpx;
			text-align: left;
			display: inline-block;

			.store_name {
				width: 400rpx;
				height: 44rpx;
				font-size: 32rpx;
				font-weight: 700;
				line-height: 44rpx;
				color: #333333;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.store_favor {
				font-size: 24rpx;
				font-weight: 300;
				margin: 8rpx 0;
			}
		}

		.storeImg {
			display: inline-block;
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			// margin-left: 28rpx;
		}

		.store_but {
			display: inline-block;
			position: absolute;
			right: 28upx;
			top: 30%;
			width: 136rpx;
			height: 56rpx;
			border-radius: 309px;
			background-color: #f2f2f2;
			text-align: center;
			margin-right: 10upx;

			.favor_txt {
				color: #666;
				line-height: 56rpx;
				color: $base;
				font-size: 26rpx;
			}
		}

		.favor {
			margin-right: 28rpx;
			background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
			color: #fff;
		}
	}

	.noFocus {
		margin-top: 160upx;
		text-align: center;

		image {
			width: 492upx;
			height: 340upx;
			margin-bottom: 48upx;
		}

		view {
			font-size: 32upx;
			font-weight: 300;
			color: #999999;
		}
	}
</style>
