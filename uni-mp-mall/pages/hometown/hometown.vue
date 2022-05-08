<template>
	<view class="street">
		<!-- 顶部搜索 -->
		<view class="search">
			<view class="searchBar" :style="{height: statusBarHeight  + 'px'}"></view>
			<view class="searchNav" :style="{height: navBarHright  + 'px'}">
				<view class="address">
					<image class="location_white" src="../../static/img/icon_location_white@2x.png" mode=""></image>
					<view class="location" @click="onClickLocation">
						<text>{{ locationName }}</text>
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
		<view class="bg">
		<view class="street-content">
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
		</view>
		<!-- 综合 距离 -->
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
						<view>
							<view class="two">
								<view class="two-left">
									<view class="">
										<text class="discount">{{ $queue.fomatFloat((item.vipPrice / item.marketPrice) * 10, 1) }}折</text>
										<text class="stockQty">仅剩{{item.stockQty}}份</text>
									</view>
									<view class="san"></view>
								</view>
								<view class="two-right">
									<image class="area4Name" src="../../static/img/location_back@2x.png" mode=""></image>
									<text>{{ item.gooStreetStore.area4Name || '' }}</text>
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
									<view class="vipBtn">
										会员价
									</view>
									<!-- <text class="text-sm line-thr text-price text-gray margin-left-xs">{{ item.marketPrice}}</text> -->
								</view>
								<view class="goBtn" @click.stop="goShopping(item)">
									立即抢购
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 状态 -->
		<view class="cu-load" :class="queryParams.isfinish ? 'over' : 'loading'"></view>
		<!-- <popup-layer ref="popupRef" :direction="'right'">
			<view style="width:750upx;height: 100%;">
				<citySelect @back_city="back_city"></citySelect>
			</view>
		</popup-layer> -->
	</view>
</template>

<script>
	import bmap from '@/common/SDK/bmap-wx.js';
	// import citySelect from '@/components/linzq-citySelect/linzq-citySelect.vue';
	// import popupLayer from '@/components/popup-layer/popup-layer.vue';
	export default {
		// components: {
		// 	citySelect,
		// 	popupLayer
		// },
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
					img: '../../static/img/default@2x.png'
				}, {
					name: '距离',
					img: '../../static/img/default@2x.png'
				}], //
				tabTypeIndex: 0,
				goodsItem: {},
				listType: 0,
				discount: 5.4, //折扣
				locationName: '',
				locatingCityCode: '',
				userLocation: null, //用户定位经纬度
			}
		},
		onLoad() {
			this.getLocation()
			this.getActBannerList();
			// this.getListShow();
			// 获取设备状态栏高度
			this.getSystemdata();
			// this.getHomeActList()
			// this.getGoodsBaseList();
		},
		// mounted() {
		// 	this.$refs.popupRef.close();
		// },
		methods: {
			// change(e) {
			// 	let index = e.detail.current
			// 	this.swiperList.map((v, i) => {
			// 		// if (index == i) {
			// 		// 	this.$set(this.bgcolor, 'one', v.topBarColor)
			// 		// 	this.$set(this.bgcolor, 'two', v.topBarColor)
			// 		// }
			// 	})
			// },
			// 跳转选择地区
			onClickLocation() {
				// uni.navigateTo({
				// 	url: "/sub/goods/saveSelection/saveSelection"
				// });
				// this.$refs.popupRef.show();
			},
			back_city(e) {
				if (e !== 'no') {
					this.locationName = e.cityName
					this.$refs.popupRef.close();
				} else {
					this.$refs.popupRef.close();
				}
			},
			// 获取定位
			getLocation() {
				// // 定位
				const Bmap = new bmap.BMapWX({
					ak: 'leuSffRhfn9ysUifXtnNAqzkYOsBG5by'
				});
				const that = this
				uni.getLocation({
					type: 'gcj02',
					success: r => {
						Bmap.regeocoding({
							location: r.latitude + ',' + r.longitude,
							success: data => {
								// this.locatingCity = data.originalData.result.addressComponent.town_code
								that.locationName = data.originalData.result.addressComponent.city
								that.userLocation = data.originalData.result.location
								that.$queue.setJson("userLocation", data.originalData.result.location)
								this.getcheckstoreArea(data.originalData.result.addressComponent.adcode)
								// this.getGoodsBaseList();
							}
						});
					},
					fail() {
						// that.getProvinces()
						// that.$queue.showToast('获取定位失败')
						that.locationName = '广州'
						that.locatingCityCode = '440100' // 定位失败，默认广州市
						this.getGoodsBaseList();
					}
				});
			},
			//获取地区
			getcheckstoreArea(code) {
				const that = this
				that.$http.getcheckstoreArea({
					code: code
				}).then(result => {
					if (result.code == 200) {
						
						Object.keys(result.data).forEach(function(key) {
							if(result.data[key].deep == 2){
								// console.log(result.data[key])
								that.locatingCityCode = result.data[key].id
							}							
						});
						that.getGoodsBaseList();
					}
				})
			},
			handleTabType(i) {
				uni.showLoading({
					mask: true,
					title: "加载中..."
				})
				if (this.listType == i && this.tabType[i].img == '../../static/img/default@2x.png') {
					this.tabType[i].img = '../../static/img/top@2x.png'
					this.queryParams.orderBy = 'asc'
				} else if (this.listType == i && this.tabType[i].img == '../../static/img/top@2x.png') {
					this.tabType[i].img = '../../static/img/bottom@2x.png'
					this.queryParams.orderBy = 'desc'
				} else if(this.listType == i && this.tabType[i].img == '../../static/img/bottom@2x.png'){
					this.tabType[i].img = '../../static/img/default@2x.png'
					this.queryParams.orderBy = ''
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

			// 获取小程序首页街市商品列表
			async getGoodsBaseList() {
				if (this.queryParams.isfinish) return;
				this.queryParams.listType = this.listType
				this.queryParams.area2Id = this.locatingCityCode
				this.queryParams.actCode = 'LZSY_C001'
				this.queryParams.longitude = this.userLocation.lng
				this.queryParams.latitude = this.userLocation.lat
				const res = await this.$http.getStreetGoodsList(this.queryParams);
				
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
			
			// 立即购买
			goShopping(item) {
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login'
					});
					return false;
				}
				
				if (item.stockQty === 0) return this.$queue.showToast("该商品剩余0件，无法订购");
				let goods = _.assign({}, item);
				this.$queue.setJson("buy_goods", goods);
				uni.navigateTo({
					url: '/sub/street/confirmation/confirmation?actCode=LZSY_C001'
				});
			},
			// 跳转搜索页面
			goSearch() {
				uni.navigateTo({
					url: "/sub/goods/search/search?actCode=" + this.$stringUtils.brandCode()
				});
			},
			//商品跳转
			toGoods(e) {
				uni.navigateTo({
					// url: "/sub/goods/detail/detail?" + this.$queue.stringify(e)
					url: "/sub/street/streetGoodsDetails/streetGoodsDetails?goodsId=" + e.id
				});
				// 改成跳转到店铺
				// uni.navigateTo({
				// 	// url: "/sub/goods/detail/detail?" + this.$queue.stringify(e)
				// 	url: "/sub/stores/store/storeDetail?storeId=" + e.storeId + "&goodsId=" + e.id
				// });
				this.$queue.setJson('streetGoodsInfo', e)
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
					img: '../../static/img/default@2x.png'
				}, {
					name: '距离',
					img: '../../static/img/default@2x.png'
				}],
			this.tabTypeIndex = 0
			this.goodsList = [];
			this.queryParams.isfinish = false;
			this.queryParams.pageNum = 1;
			this.listType = 0;
			// this.getGoodsBaseList();
			this.getLocation()
			this.getActBannerList();
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
			padding-top: 20upx;
		}

		.street-content {
			width: 100%;
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


						.name {
							width: 100%;
							height: 80upx;
							font-size: 28upx;
							color: #333;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							text-align: justify;
							overflow: hidden;
							line-height: 40upx;
							font-weight: 700;
							margin: 0 0 20upx 0;
						}

						.two {
							display: flex;
							justify-content: space-between;

							.two-left {
								// width: 89px;
								height: 32upx;
								font-size: 22upx;
								line-height: 32upx;

								.discount {
									display: inline-block;
									background: #FA3B1C;
									border: 2upx solid #FA3B1C;
									border-top-left-radius: 8upx;
									border-bottom-left-radius: 8upx;
									color: #fff;
									padding: 0 8upx;
								}

								.stockQty {
									display: inline-block;
									border-top: 2upx solid #FA3B1C;
									border-right: 2upx solid #FA3B1C;
									border-bottom: 2upx solid #FA3B1C;
									border-top-right-radius: 8upx;
									border-bottom-right-radius: 8upx;
									color: #FA3B1C;
									margin-right: 8upx;
									padding: 0 8upx;
								}

								.san {
									width: 0;
									height: 0;
									border-left: 6upx solid transparent;
									border-right: 6upx solid transparent;
									border-top: 12upx solid #FA3B1C;
									margin-left: 12upx;
								}
							}

							.two-right {
								display: flex;
								justify-content: flex-start;
								align-items: center;
								margin-right: 20rpx;
								margin-bottom: 10rpx;
								.area4Name {
									width: 24upx;
									height: 24upx;
									margin-right: 4upx;
								}
								text {
									max-width: 160upx;
									font-size: 20upx;
									color: #333;
									display: -webkit-box;
									-webkit-box-orient: vertical;
									-webkit-line-clamp: 1;
									text-align: justify;
									overflow: hidden;
								}
							}
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
				}
			}
		}

	}
</style>
