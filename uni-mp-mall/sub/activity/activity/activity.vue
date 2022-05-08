<template>
	<view class="acr" v-if="isloading == 0">
		<view class="" v-if="goodsList.length">
			<view class="act-head">
				<view class="act-head-item" v-for="(item,i) in goodsList" :key="i" @tap="toGoods(item)">
					<view class="image">
						<image :src="item.goodsIcon" mode=""></image>
					</view>
					<view class="text">
						<view class="text-title">
							{{ item.goodsName}}
						</view>
						<view class="text-instructions">
							{{ item.goodsTitle }}
						</view>
						<view class="text-prices">
							<text class="presents text-price" style="font-size: 30rpx;">
								{{ item.salePrice }}
								<template v-if="item.integral > 0">
									<text class="text-xs">{{ item.integralType | filterIntegralType }}</text>
									<text style="font-size: 30rpx;">{{ item.integral }}</text>
									<text class="text-xs">{{$queue.getIntegralName()}}</text>
								</template>
							</text>
							<text class="original">{{'￥' + item.marketPrice}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="cu-load" :class="queryParams.isfinish ? 'over' : 'loading'"></view>
		</view>
		<view class="act-image" v-if="goodsList.length == 0">
			<image :src="img" mode=""></image>
			<view class="">
				还没有商品哦~
			</view>
		</view>
		<view class="act-content" v-if="goodsList1.length">
			<view class="like">
				<text class="line"></text>
				<text class="guess">猜你喜欢</text>
				<text class="line"></text>
			</view>
			<view class="goods-list">
				<view class="goods-item" v-for="(item,index) in goodsList1" :key="index" @tap="toGoods(item)">
					<image :src="item.goodsIcon"></image>
					<view class="name">{{ item.goodsName}}</view>
					<view class="cateName">{{ item.primaryCategoryName}}</view>
					<view class="info">
						<view class="price text-price">
							<text>{{ item.salePrice }}</text>
							<template v-if="item.integral > 0">
								<text class="text-xs">{{ item.integralType | filterIntegralType }}</text>
								<text>{{ item.integral }}</text>
								<text class="text-xs">{{$queue.getIntegralName()}}</text>
							</template>
							<text
								class="text-sm line-thr text-price text-gray margin-left-xs">{{ item.marketPrice}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isloading: 1,
				goodsList: [],
				goodsList1: [],
				totalPage: 0,
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					isfinish: false,
					actCode: ""
				},
				img: ''
			};
		},
		onLoad(options) {
			options = this.$queue.parse(options);
			uni.setNavigationBarTitle({
				title: options.name
			})
			uni.showLoading({
				mask: true,
				title: "加载中..."
			})
			this.queryParams.actCode = options.code
			this.getActGoodsList()
			this.getLikeList()
			this.img = this.Dict.status_img
		},
		onShow() {

		},
		//下拉刷新，配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			this.goodsList = [];
			this.queryParams.isfinish = false;
			this.isloading = 1
			this.queryParams.pageNum = 1;
			// 加载兑换中心商品

			this.getActGoodsList();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			});
		},
		//上拉加载，配置"onReachBottomDistance"
		onReachBottom() {
			if (this.totalPage > this.queryParams.pageNum) {
				uni.showLoading({
					mask: true,
					title: "加载中..."
				})
				this.queryParams.pageNum++;
				this.getActGoodsList();
			}

		},
		methods: {
			/* 商品跳转 */
			toGoods(e) {
				uni.navigateTo({
					// url: "/sub/goods/detail/detail?" + this.$queue.stringify(e)
					url: "/sub/goods/detail/detail?goodsId=" + e.id
				});
			},
			/* 获取猜你喜欢列表 */
			async getActGoodsList() {
				if (this.queryParams.isfinish) return;
				let res = ''
				if (this.queryParams.actCode == '0000') {
					// this.queryParams.actCode = ''
					res = await this.$http.getShopAllGoodsPageList(this.queryParams);
				} else {
					res = await this.$http.getActGoodsList(this.queryParams);
				}
				uni.hideLoading()
				if (res.code == 200) {
					this.isloading = 0
					this.goodsList = _.concat(this.goodsList, res.data.list);
					this.totalPage = res.data.totalPage
					this.goodsList.map((item, index) => {
						if (!item) {
							this.goodsList.splice(index, 1)
						}
					})
					if (res.data.totalPage == this.queryParams.pageNum || _.size(res.data.list) === 0) {
						this.queryParams.isfinish = true;
					}
				} else {
					this.goodsList = []
					this.queryParams.isfinish = true
				}
			},
			/* 获取猜你喜欢列表 */
			async getLikeList() {
				let obj = {
					pageNum: 1,
					pageSize: 10,
					isfinish: false,
					actCode: this.$stringUtils.getLikeCode()
				}
				const res = await this.$http.getActGoodsList(obj);
				uni.hideLoading()
				if (res.code == 200) {
					this.goodsList1 = _.concat(this.goodsList1, res.data.list);
					this.goodsList1.map((item, index) => {
						if (!item) {
							this.goodsList.splice(index, 1)
						}
					})
					this.goodsList1.splice(4, this.goodsList1.length - 1)
					// if (res.data.totalPage == this.queryParams.pageNum || _.size(res.data.list) === 0) {
					// 	this.queryParams.isfinish = true;
					// }
				}
			},
		}
	};
</script>

<style lang="scss">
	.act {
		&-image {
			margin-top: 260upx;
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
		&-head {
			margin: 32upx 24upx 28upx;
			background-color: #fff;
			border-radius: 16upx;

			&-item {
				padding: 24upx;
				height: 240upx;
				display: flex;

				.image {
					image {
						width: 240upx;
						height: 240upx;
						border-radius: 8upx;
					}
				}

				.text {
					margin: 8upx 0upx 0upx 32upx;
					width: 364upx;
					position: relative;

					&-title {
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 3;
						overflow: hidden;
						font-size: 28upx;
						font-weight: 500;
						color: #333333;
					}

					&-instructions {
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						text-align: justify;
						overflow: hidden;
						font-size: 24upx;
						font-weight: 300;
						margin-top: 16upx;
						color: #999999;
					}

					&-prices {
						position: absolute;
						bottom: 0upx;

						.presents {
							font-size: 20upx;
							font-weight: 300;
							color: #EB6133;
						}

						.original {
							font-size: 22upx;
							font-weight: 300;
							color: #999999;
							margin-left: 16upx;
							text-decoration: line-through;
						}
					}
				}
			}
		}

		&-content {
			.like {
				text-align: center;
				margin-bottom: 28upx;

				.line {
					display: inline-block;
					width: 48upx;
					height: 2upx;
					background: #EB6132;
					margin-bottom: 8upx;
				}

				.guess {
					font-size: 30upx;
					font-weight: 300;
					color: #EB6132;
				}
			}

			.goods-list {
				padding-left: 24upx;
				padding-right: 24upx;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
			}

			.goods-item {
				width: 48.5%;
				border-radius: 20upx;
				background-color: #fff;
				margin: 0 0 25upx 0;
				box-shadow: 0upx 5upx 25upx rgba(0, 0, 0, 0.1);

				image {
					height: 350upx;
					width: 100%;
					border-radius: 20upx 20upx 0 0;
				}

				.name {
					width: 92%;
					padding: 10upx 4% 0;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					text-align: justify;
					overflow: hidden;
					font-size: 28upx;
					line-height: 38upx;
					margin-bottom: 10upx;
				}

				.cateName {
					padding: 10upx 4% 0;
					font-size: 24upx;
					font-weight: 300;
					line-height: 34upx;
					color: #999999;
				}

				.info {
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					width: 94%;
					padding: 20upx 3%;

					.price {
						color: $uni-color-main;
						font-size: 28upx;
						font-weight: 600;
						white-space: normal;
					}

					.slogan {
						color: #807c87;
						font-size: 24upx;
					}
				}
			}
		}
	}
</style>
