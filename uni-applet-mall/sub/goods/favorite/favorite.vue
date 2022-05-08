<template>
	<view class="faver" v-if="isloading == 0">
		<!-- 收藏列表 -->
		<block v-if="list.length > 0">
			<view class="main-wrap" v-for="(v, i) in list" :key="i" @click="jumpGoodsDetail(v)">
				<view class="main-wrap-box">
					<view class="faver-content">
						<view class="faver-img">
							<image :src="v.goodsIcon" mode="aspectFill"></image>
						</view>
						<view class="faver-desc">
							<view class="title">{{v.goodsName}}</view>
							<view class="price text-price text-main">
								<text>{{v.salePrice}}</text>
								<template v-if="v.integral > 0">
									<text class="text-xs">{{ v.integralType | filterIntegralType }}</text>
									<text>{{ v.integral }}</text>
									<text class="text-xs">{{$queue.getIntegralName()}}</text>
								</template>
							</view>
						</view>
					</view>
					<view class="faver-footer">
						<view class="cbtn main" style="color: #666;border: 2rpx solid #C1C1C1;"
							@click.stop="delFaverGoods(v.goodsId)">取消收藏</view>
					</view>
				</view>
			</view>
			<!-- 状态 -->
			<view class="cu-load" :class="queryParams.isfinish ? 'over' : 'loading'"></view>
		</block>
		<Empty v-else></Empty>
	</view>
</template>

<script>
	import Empty from '@/components/empty'
	export default {
		components: {
			Empty
		},
		data() {
			return {
				isloading: 1,
				list: [],
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					isfinish: false
				}
			}
		},
		//下拉刷新，在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			this.queryParams.pageNum = 1;
			this.queryParams.isfinish = false;
			this.list = [];
			this.getFaverGoodsList();
			// setTimeout(() => {
			// 	uni.stopPullDownRefresh();
			// }, 1000);
		},
		//上拉加载，在page.json文件中配置"onReachBottomDistance"
		onReachBottom() {
			this.queryParams.pageNum++;
			this.getFaverGoodsList();
		},
		onLoad() {
			this.getFaverGoodsList();
		},
		methods: {
			// 获取商品收藏列表
			async getFaverGoodsList() {
				if (this.queryParams.isfinish) return false;
				this.$queue.showLoading("加载中...");
				const result = await this.$http.getFaverGoodsList(this.queryParams);
				this.isloading = 0
				uni.hideLoading();
				uni.stopPullDownRefresh();
				if (!result.success) return $queue.showToast("加载失败...");
				this.list = _.concat(this.list, result.data.list);
				if (result.data.pageNum == result.data.totalPage || result.data.total == 0) {
					this.queryParams.isfinish = true;
				}
			},
			// 取消收藏
			delFaverGoods(goodsId) {
				this.$http
					.delFaverGoods({
						workId: goodsId
					})
					.then(res => {
						if (res.success) {
							this.queryParams.pageNum = 1;
							this.queryParams.isfinish = false;
							this.list = [];
							this.getFaverGoodsList();
						} else {
							this.$queue.showToast(res.message);
						}
					});
			},
			// 商品详情
			jumpGoodsDetail(v) {
				// this.$http.getGoodsBase({
				// 	goodsId: v.goodsId
				// }).then(res => {
				// 	if (res.success) {
				// 		uni.navigateTo({
				// 			// url: "/sub/goods/detail/detail?" + this.$queue.stringify(res.data)
				// 			url: "/sub/goods/detail/detail?goodsId=" + res.data.id + '&bsType=' + v.bsType
				// 		});
				// 	}
				// })
				if (v.saleUuid) {
					uni.navigateTo({
						// url: "/sub/goods/detail/detail?" + this.$queue.stringify(res.data)
						url: "/sub/goods/detail/detail?goodsId=" + v.goodsId + '&uuid=' + v.saleUuid +
							'&bsType=' + v.bsType
					});
				} else {
					uni.navigateTo({
						// url: "/sub/goods/detail/detail?" + this.$queue.stringify(v)
						url: "/sub/goods/detail/detail?goodsId=" + v.goodsId + '&bsType=' + v.bsType
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.faver {
		padding-top: 30upx;

		&-content {
			display: flex;
		}

		&-img {
			width: 200upx;
			height: 200upx;
			border-radius: 8upx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

		&-desc {
			flex: 1;
			margin-left: 16upx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.title {
				padding-top: 12upx;
				display: -webkit-box;
				overflow: hidden;
				text-overflow: ellipsis;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}

			.price {
				font-size: 32upx;
			}
		}

		&-footer {
			margin-top: 10upx;
			display: flex;
			justify-content: flex-end;
		}
	}
</style>
