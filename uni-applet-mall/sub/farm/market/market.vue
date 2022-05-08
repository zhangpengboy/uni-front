<template>
	<view class="market">
		<view class="market-header">
			<view class="market-header-top">
				<view class="swiper">
					<view class="swiper-box">
						<swiper class="square-dot" :indicator-dots="true" :circular="true" :autoplay="true"
							interval="3000" duration="500">
							<swiper-item v-for="(item,index) in swiperList" :key="index" @click="toSwiper(item)">
								<video :src="item.image" autoplay loop muted :show-play-btn="false" :controls="false"
									objectFit="cover" v-if="item.type=='video'"></video>
								<image :src="item.image" mode="aspectFill" v-else></image>
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>
		</view>
		<!-- 商品列表 -->
		<view class="market-content">
			<view class="goods-list">
				<view class="goods-item" v-for="item in goodsList" :key="item.id" @tap="toGoods(item)">
					<image class="goodsIcon" :src="item.goodsIcon" mode="aspectFill"></image>
					<view class="right padding-lr-sm">
						<view class="name">{{ item.goodsName}}</view>
						<view class="cateName">{{ item.goodsTitle}}</view>
						<view class="info">
							<view class="price text-price">
								<text>{{ item.salePrice }}</text>
								<template v-if="item.integral > 0">
									<text class="text-xs">{{ item.integralType | filterIntegralType }}</text>
									<text>{{ item.integral }}</text>
									<text class="text-xs">{{$queue.getIntegralName()}}</text>
								</template>
								<text class="slogan line-thr text-price margin-left-xs">{{ item.marketPrice}}</text>
							</view>
							<view class="shopcart">
								<image src="/static/img/shopcart@2x.png"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 状态 -->
			<view class="cu-load" :class="queryParams.isfinish ? 'over' : 'loading'"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: 0,
				navBarHright: 0,
				// 高度差
				heightDiff: 0,
				statusBar: {},
				// 轮播图片
				swiperList: [],
				//猜你喜欢列表
				goodsList: [],
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					isfinish: false,
					actCode: ""
				},
				totalPage: 0,
				screenHeight: 0,
				windowHeight: 0
			};
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			this.queryParams.pageNum = 1;
			this.queryParams.isfinish = false;
			// 加载banner图
			this.getActBannerList();
			this.goodsList = [];
			this.getActiveGoodsList()
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
				this.getActiveGoodsList();
			}

		},
		onLoad(option) {
			// 加载banner图
			this.getActBannerList();
			// 加载推荐商品
			this.getActiveGoodsList();
			// 获取设备状态栏高度
			this.getSystemdata();
		},
		methods: {
			//获取设备状态栏高度
			getSystemdata() {
				uni.getSystemInfo({
					success: (res) => {
						this.statusBarHeight = res.statusBarHeight
						this.screenHeight = res.screenHeight
						this.windowHeight = res.windowHeight
					}
				})
				// 胶囊信息
				var data = uni.getMenuButtonBoundingClientRect()
				this.statusBar = data
				// 导航栏高度
				this.navBarHright = ((data.top - this.statusBarHeight) * 2 + data.height)
				// 高度差
				this.heightDiff = data.top - this.statusBarHeight
			},
			/* 获取banner图 */
			async getActBannerList() {
				const res = await this.$http.getActBannerList({
					type: '1',
					actCode: this.Dict.JMS_B
				});
				if (res.success) {
					this.swiperList = res.data;
				}
			},
			// 跳转活动页面
			gotoActivity(item) {
				item.path = 'home'
				uni.navigateTo({
					url: "/sub/activity/activity/activity?" + this.$queue.stringify(item)
				});
			},
			/* 获取猜你喜欢列表 */
			async getActiveGoodsList() {
				if (this.queryParams.isfinish) return;
				this.queryParams = _.assign(this.queryParams, {
					actCode: this.Dict.JMS_B001
				})
				const res = await this.$http.getActiveGoodsList(this.queryParams);
				if (res.code == 200) {
					uni.stopPullDownRefresh()
					uni.hideLoading()
					this.totalPage = res.data.totalPage
					this.goodsList = _.concat(this.goodsList, res.data.list);
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
			// 跳转店铺
			goGoodsstore(v) {
				uni.navigateTo({
					url: '/sub/stores/store/storeDetail?storeId=' + v.goodsList[0].storeId + '&brandCode=' + v
						.goodsBrand.brandCode
				})
			},
			// 跳转搜索页面
			goSearch() {
				uni.navigateTo({
					url: "/sub/goods/search/search?actCode=" + this.$stringUtils.mallCode()
				});
			},
			/* 轮播图跳转 */
			toSwiper(e) {
				if (e.urlType == 1) {
					// 商品 先获取商品基础信息
					uni.navigateTo({
						// url: "/sub/goods/detail/detail?" + this.$queue.stringify(res.data)
						url: "/sub/goods/detail/detail?goodsId=" + e.url
					});
				} else if (e.urlType == 2) {
					// 进店逛逛
					uni.navigateTo({
						url: '../../sub/stores/store/storeDetail?storeId=' + e.url
					})
				} else if (e.urlType == 3) {
					// 外部链接 
					uni.navigateTo({
						url: "/sub/webview/index/index?webUrl=" + encodeURIComponent(e.url)
					})
				} else if (e.urlType == 4) {
					// 栏目 
					let item = {
						path: 'home',
						name: e.urlName,
						code: e.url,
					}
					uni.navigateTo({
						url: "/sub/activity/activity/activity?" + this.$queue.stringify(item)
					})
				}
			},
			/* 商品跳转 */
			toGoods(e) {
				uni.navigateTo({
					url: "/sub/goods/detail/detail?goodsId=" + e.id
				});
				this.$queue.setJson('goodsInfo', e)
			},
			/* 添加购物车 */
			addShopCart(e) {
				console.log(e)
			}
		}
	};
</script>


<style lang="scss" scoped>
	.market {
		&-header {
			margin-top: -1px;
			height: 240upx;
			background: linear-gradient(180deg, $base 0%, $change-clor 50%, $floor-clor 100%);
			display: flex;
			flex-direction: column;
			// padding: 24upx;
			color: #FFFFFF;

			&-top {
				.swiper {
					width: 100%;
					display: flex;
					justify-content: center;

					.swiper-box {
						width: 700upx;
						height: 296upx;
						overflow: hidden;
						border-radius: 15upx;
						// box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
						//兼容ios，微信小程序
						position: relative;
						z-index: 1;

						swiper {
							width: 100%;
							height: 300upx;

							swiper-item {
								image {
									width: 100%;
									height: 300upx;
								}
							}
						}

						.indicator {
							position: absolute;
							bottom: 20upx;
							left: 20upx;
							background-color: rgba(255, 255, 255, 0.4);
							width: 150upx;
							height: 5upx;
							border-radius: 3upx;
							overflow: hidden;
							display: flex;

							.dots {
								width: 0upx;
								background-color: rgba(255, 255, 255, 1);
								transition: all 0.3s ease-out;

								&.on {
									width: (100%/3);
								}
							}
						}
					}
				}
			}


		}

		&-content {
			min-height: 700upx;
			position: relative;
			background: $floor-clor;
			padding-top: 84upx;
		}
	}

	@import "@/static/css/goods.scss";

	.goods-item {
		display: flex;
		padding: 24upx;
		// padding: 24upx 24upx 0 24upx;

		.goodsIcon {
			width: 184upx;
			height: 184upx;
			border-radius: 16upx;
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
	}
</style>
