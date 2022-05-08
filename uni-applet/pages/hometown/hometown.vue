<template>
	<view class="street">
		<!-- 顶部搜索 -->
		<view class="search">
			<view class="searchBar" :style="{height: statusBarHeight  + 'px'}"></view>
			<view class="searchNav" :style="{height: navBarHright  + 'px'}">
				<view class="address">
					<image class="location_white" src="../../static/img/icon_location_white@2x.png" mode=""></image>
					<view class="location" @click="onClickLocation">
						<text>深圳市</text>
						<image class="gray_down" src="../../static/img/icon_spread_gray_down@2x.png" mode=""></image>
					</view>
				</view>
				<view class="btn" @click="goSearch" :style="{height: statusBar.height + 'px'}">
					<text class="icon cuIcon-search"></text>
					<text>
						搜索
					</text>
				</view>
			</view>
		</view>
		<view class="bg"></view>
		<view class="street-content" :style="{top: topBarHeight  + 'px'}">
			<!-- 广告图  -->
			<view class="swiper">
				<view class="swiper-box">
					<swiper class="square-dot" :indicator-dots="true" :circular="true" :autoplay="true" interval="3000"
						duration="500">
						<swiper-item v-for="(item,index) in swiperList" :key="item.id" @click="toSwiper(item)">
							<video :src="item.image" autoplay loop muted :show-play-btn="false" :controls="false"
								objectFit="cover" v-if="item.type=='video'"></video>
							<image :src="item.image" mode="aspectFill" v-else></image>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
		<!-- 综合 上新 -->
		<view class="topTabBar" :style="{top: statusBarHeight + navBarHright + 'px'}">
			<view class="tabitem" v-for="(item, tbIndex) in tabType" :key="tbIndex" @tap="handleTabType(tbIndex)">
				<view class="text" :class="[tbIndex == tabTypeIndex ? 'on' : '']">{{ item.name }}</view>
				<image :src="item.img" mode=""></image>
			</view>
		</view>
		<!-- 商品列表 -->
		<view class="goodsList" :style="{'min-height': minHeight + 'px'}">
			<view class="content" v-for="(item, i) in goodsList" :key="i" @tap="toGoods(item)">
				<view class="top">
					<image :src="item.goodsIcon" mode=""></image>
					<view class="right">
						<view class="name">{{ item.goodsName}}</view>
						<view class="two">
							<view class="left">
								<view class="">
									<text class="discount">{{ discount }}</text>
									<text class="saleQty">仅剩{{item.saleQty}}份</text>
								</view>
							</view>
							<view class="right">
								<image src="../../static/img/31@2x.png" mode=""></image>
								<text>{{ item.area4Name }}</text>
							</view>
						</view>
						<view class="info">
							<view class="price text-price">
								<text>{{ item.vipPrice }}</text>
								<template v-if="item.integral > 0">
									<text class="text-xs">{{ item.integralType | filterIntegralType }}</text>
									<text>{{ item.integral }}</text>
									<text class="text-xs">{{$queue.getIntegralName()}}</text>
								</template>
								<text
									class="text-sm line-thr text-price text-gray margin-left-xs">{{ item.marketPrice}}</text>
							</view>
							<view class="goBtn">
								立即抢购
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 状态 -->
		<view class="cu-load" :class="queryParams.isfinish ? 'over' : 'loading'"></view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				minHeight: 0,
				topBarHeight: 0,
				statusBarHeight: 0,
				navBarHright: 0,
				// 高度差
				heightDiff: 0,
				statusBar: {},
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					isfinish: false,
					actCode: "",
					status: 3,
					orderBy: 'asc'
				},
				swiperList: [],
				goodsList: [],
				categoryList: [],
				homeActList: [],
				transverseList: [],
				ListShow: [],
				listIndex: 0,
				totalPage: 0,
				windowHeight: 0,
				tabType: [{
					name: '综合',
					img: '../../static/img/top@2x.png'
				}, {
					name: '距离',
					img: '../../static/img/default@2x.png'
				}], //
				tabTypeIndex: 0,
				goodsItem: {},
				listType: 0,
				discount: 5.4 //折扣
			}
		},
		onLoad() {
			this.getActBannerList();
			// this.getListShow();
			// 获取设备状态栏高度
			this.getSystemdata();
			// this.getHomeActList()
			this.getGoodsBaseList();
		},
		methods: {
			change(e) {
				let index = e.detail.current
				this.swiperList.map((v, i) => {
					// if (index == i) {
					// 	this.$set(this.bgcolor, 'one', v.topBarColor)
					// 	this.$set(this.bgcolor, 'two', v.topBarColor)
					// }
				})
			},
			handleTabType(i) {
				uni.showLoading({
					mask: true,
					title: "加载中..."
				})
				if (this.listType == i && this.tabType[i].img == '../../static/img/top@2x.png') {
					this.tabType[i].img = '../../static/img/bottom@2x.png'
					this.queryParams.orderBy = 'asc'
				} else {
					this.tabType[i].img = '../../static/img/top@2x.png'
					this.queryParams.orderBy = 'desc'
				}
				this.tabType.map((item, index) => {
					if (index !== i) {
						item.img = '../../static/img/default@2x.png'
					}
				})
				this.goodsList = []
				this.queryParams.pageNum = 1
				this.tabTypeIndex = i
				this.listType = i
				this.queryParams.isfinish = false
				this.getGoodsBaseList()
			},
			//获取设备状态栏 导航栏 胶囊信息
			getSystemdata() {
				// 状态栏高度
				uni.getSystemInfo({
					success: (res) => {
						this.statusBarHeight = res.statusBarHeight
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
				if (this.statusBarHeight >= 44) {
					this.topBarHeight = 94
				} else {
					this.topBarHeight = 70
				}
			},

			// 跳转活动页面
			gotoActivity(item) {
				item.path = 'exchange'
				uni.navigateTo({
					url: "/sub/activity/activity/activity?" + this.$queue.stringify(item)
				});
			},

			// 获取小程序首页商品列表
			async getGoodsBaseList() {
				if (this.queryParams.isfinish) return;
				this.queryParams.listType = this.listType
				const res = await this.$http.getMpGoodsList(this.queryParams);
				if (res.code == 200) {
					uni.stopPullDownRefresh();
					uni.hideLoading()
					this.totalPage = res.data.totalPage
					if (res.success) {
						this.goodsList = _.concat(this.goodsList, res.data.list);

						if (this.goodsList.length > 2) {
							this.minHeight = 500
						}
						if (this.goodsList.length > 3) {
							this.minHeight = 700
						}
						this.goodsList.map((item, index) => {
							if (!item) {
								this.goodsList.splice(index, 1)
							}

						})
						if (res.data.totalPage == this.queryParams.pageNum || _.size(res.data.list) === 0) {
							this.queryParams.isfinish = true;
						}
					}
				}
			},

			// 跳转店铺
			goGoodsstore(v) {
				uni.navigateTo({
					url: '/sub/stores/store/storeDetail?storeId=' + v.goodsList[0].storeId + '&brandCode=' + v
						.goodsBrand.brandCode
				})
			},
			/* 获取banner图 */
			async getActBannerList() {
				const res = await this.$http.getActBannerList({
					type: '1',
					actCode: this.$stringUtils.brandCode()
				});
				if (res.success) {
					this.swiperList = res.data;

				}
			},
			// 跳转搜索页面
			goSearch() {
				uni.navigateTo({
					url: "/sub/goods/search/search?actCode=" + this.$stringUtils.brandCode()
				});
			},
			//商品跳转
			toGoods(e) {
				// uni.navigateTo({
				// 	// url: "/sub/goods/detail/detail?" + this.$queue.stringify(e)
				// 	url: "/sub/goods/detail/detail?goodsId=" + e.id
				// });
				// 改成跳转到店铺
				uni.navigateTo({
					// url: "/sub/goods/detail/detail?" + this.$queue.stringify(e)
					url: "/sub/stores/store/storeDetail?storeId=" + e.storeId + "&goodsId=" + e.id
				});
				this.$queue.setJson('goodsInfo', e)
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
						url: '/sub/stores/store/storeDetail?storeId=' + e.url
					})
				} else if (e.urlType == 3) {
					// 外部链接 
					uni.navigateTo({
						url: "/sub/webview/index/index?webUrl=" + encodeURIComponent(e.url)
					})
				} else if (e.urlType == 4) {
					// 栏目 
					let item = {
						path: 'exchange',
						name: e.urlName,
						code: e.url,
					}
					uni.navigateTo({
						url: "/sub/activity/activity/activity?" + this.$queue.stringify(item)
					})
				}
			},
		},
		//下拉刷新，配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			this.tabType = [{
				name: '综合',
				img: '../../static/img/top@2x.png'
			}, {
				name: '距离',
				img: '../../static/img/default@2x.png'
			}]
			this.tabTypeIndex = 0
			this.goodsList = [];
			this.queryParams.isfinish = false;
			this.queryParams.pageNum = 1;
			this.listIndex = 0;
			this.getGoodsBaseList();
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
				this.getGoodsBaseList();
			}

		},
	}
</script>

<style lang="scss" scoped>
	.street {

		.search {
			// height: 208upx;
			width: 100%;
			position: sticky;
			z-index: 1;
			top: 0upx;
			background: linear-gradient(360deg, #FD7574 0%, #FB3535 100%);

			.searchNav {
				display: flex;
				align-items: center;
				margin-left: 24upx;

				.address {
					display: flex;
					align-items: center;

					.location_white {
						width: 36upx;
						height: 40upx;
					}

					.location {
						text {
							width: 124upx;
							height: 40upx;
							font-size: 28upx;
							font-weight: 700;
							line-height: 40upx;
							color: #FFFFFF;
							text-align: center;
							margin: 0 4upx 0 8upx;
						}

						.gray_down {
							width: 16upx;
							height: 16upx;
						}
					}
				}

				.btn {
					display: flex;
					align-items: center;
					width: 360upx;
					// height: 64upx;
					background: #FFFFFF;
					border: 1upx solid #EC6033;
					box-sizing: border-box;
					border-radius: 42upx;
					margin-left: 10upx;

					.icon {
						width: 32upx;
						height: 32upx;
						color: #FA3B1C;
						font-size: 32upx;
						font-weight: 600;
					}

					text {
						color: #999999;
						font-size: 24upx;
						margin-left: 24upx;
					}
				}
			}
		}
			
			.bg {
				width: 100%;
				height: 60upx;
				background: linear-gradient(360deg, #FFA7A5 0%, #FD7574 100%);
			}
			
		.street-content {
			width: 100%;
			position: absolute;
			// z-index: 12;
			background: #F3F3F3;
			border-radius: 24upx 24upx 0 0;

			.swiper {
				width: 100%;
				display: flex;
				justify-content: center;
				padding-top: 16upx;

				.swiper-box {
					width: 702upx;
					height: 300upx;
					overflow: hidden;
					border-radius: 16upx;
					background-color: rgba(0, 0, 0, 0) !important;
					// box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
					//兼容ios，微信小程序
					position: relative;
					// z-index: 1;

					swiper {
						width: 702upx;
						height: 300upx;

						swiper-item {
							image {
								width: 702upx;
								height: 300upx;
								border-radius: 16upx;
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

		.topTabBar {
			position: sticky;
			z-index: 1;
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			font-size: 28upx;
			color: #333;
			padding: 24upx;
			margin-top: 274upx;
			background: #F5F2F5;

			.tabitem {
				display: flex;
				align-items: center;
				height: 40upx;
				line-height: 40upx;
				font-weight: 700;

				image {
					width: 32upx;
					height: 32upx;
					margin-left: 4upx;
				}

				.on {
					color: #FA3B1C;
				}
			}
		}

		.goodsList {

			padding: 0 24upx;

			.content {
				// width: 702upx;
				// height: 292upx;
				background: #FFFFFF;
				border-radius: 16upx;
				padding: 24upx;
				margin-bottom: 24upx;

				.top {
					display: flex;
					// margin-bottom: 28upx;

					image {
						width: 224upx;
						height: 224upx;
						border-radius: 16upx;
						margin-right: 24upx;
					}

					.right {
						width: 410upx;
						height: 224upx;
						display: flex;
						flex-direction: column;
						// align-content: space-around;
						justify-content: space-between;

						.logo {
							display: flex;
							align-items: center;

							image {
								width: 64upx;
								height: 64upx;
								border-radius: 50%;
								margin-right: 8upx;
							}

							.brandName {
								font-size: 30upx;
								color: #333333;
								font-weight: 700;
							}

							.countNum {
								// min-width: 40upx;
								height: 32upx;
								font-size: 22upx;
								background: #FFEEEB;
								border-radius: 4px;
								line-height: 32upx;
								text-align: center;
								color: #FA3B1C;
								margin-left: 4upx;
								padding: 0 8upx;
							}
						}

						.name {
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							text-align: justify;
							overflow: hidden;
							font-size: 28upx;
							line-height: 40upx;
							font-weight: 700;
							margin: 0 0 20upx 0;
						}

						.info {
							display: flex;
							justify-content: space-between;
							align-items: flex-end;
							// padding: 20upx 3%;
							
							.goBtn {
								width: 144upx;
								height: 56upx;
								background: linear-gradient(143deg, #F32A2A 0%, #FF6B3A 100%);
								line-height: 56upx;
								text-align: center;
								font-size: 26upx;
								color: #fff;
								border-radius: 80px;
							}
							
							.price {
								display: flex;
								align-items: center;
								color: $uni-color-main;
								font-size: 32upx;
								font-weight: 700;
								white-space: normal;
								
								.vipBtn {
									width: 68upx;
									height: 28upx;
									font-size: 20upx;
									color: #FA3B1C;
									border: 1upx solid #FA3B1C;
									opacity: 1;
									border-radius: 4upx;
									line-height: 28upx;
									text-align: center;
									font-weight: 300;
									margin: 4upx 8upx 0;
								}
							}
						}
					}
				}

				.bottom {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.time {
						display: flex;
						align-items: center;
						height: 48rpx;
						font-size: 28rpx;
						color: #999;
						line-height: 48rpx;



						.one {
							color: #333;
							margin-right: 4upx;
						}

						.t {
							color: #FA3B1C;
							font-weight: 700;
						}
					}

					.fx {
						width: 140upx;
						height: 44upx;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 24upx;
						border: 1upx solid #FA3B1C;
						background: #fff;
						border-radius: 300px;
						color: #FA3B1C;
						margin: 0;

						image {
							width: 28upx;
							height: 28upx;
							margin-right: 4upx;
						}
					}
				}
			}
		}

	}
</style>
