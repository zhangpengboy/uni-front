<template>
	<view class="home">
		<!-- 顶部搜索 -->
		<view class="search"
			:style="{ height: statusBarHeight + navBarHright + 'px',background: 'linear-gradient(180deg, '+ bgcolor.one + ' 0%, ' + bgcolor.two + ' 100%)' }">
			<view class="searchBar" :style="{height: statusBarHeight + 'px'}"></view>
			<view class="searchNav" :style="{height: navBarHright + 'px'}">
				<view class="image">
					<image :src="`${$queue.publicCdnHost()}/assets/imgs/logoText@2x.png`" mode=""></image>
				</view>
				<view class="btn" @click="goSearch" :style="{height: statusBar.height + 'px'}">
					<text class="icon cuIcon-search"></text>
					<text>
						搜索你想要的商品
					</text>
				</view>
			</view>
		</view>
		<view class="home-header"
			:style="{ background: 'linear-gradient(180deg, '+ bgcolor.one + ' 0%, ' + bgcolor.two + ' 100%)' }">
		</view>
		<view class="home-content">
			<!-- <view class="" style="position: absolute;top: -20%; width: 100%;"> -->
			<!-- 顶部 搜索 轮播图 -->
			<view class="home-content-top" style="position: absolute;
			top: -140upx; left: 25upx;">
				<view class="swiper">
					<view class="swiper-box">
						<swiper class="square-dot" :indicator-dots="true" :circular="true" :autoplay="true"
							interval="3000" duration="500" @change="change">
							<swiper-item v-for="(item,index) in swiperList" :key="index" @click="toSwiper(item)">
								<video :src="item.image" autoplay loop muted :show-play-btn="false" :controls="false"
									objectFit="cover" v-if="item.type=='video'"></video>
								<image :src="item.image" mode="aspectFill" v-else></image>
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>

			<!-- 分类列表 -->
			<view class="home-nav">
				<!-- <view class="nav-item" v-for="(row, index) in categoryList" :key="index" @tap="gotoActivity(row)">
					<view class="img">
						<image :src="row.icon"></image>
					</view>
					<view class="text">{{ row.name }}</view>
				</view> -->
			</view>
			<!-- 精选推荐 -->
			<view class="home-fine">
				<view class="home-fine-swiper-box" v-if="swiperLists.length">
					<swiper class="square-dot" :autoplay="true" interval="3000" duration="500" @change="changes">
						<swiper-item v-for="(item,index) in swiperLists" :key="index" @click="toSwiper(item)">
							<video :src="item.image" autoplay loop muted :show-play-btn="false" :controls="false"
								objectFit="cover" v-if="item.type=='video'"></video>
							<image :src="item.image" mode="aspectFill" v-else></image>
						</swiper-item>
					</swiper>
				</view>
			</view>
			<!-- 特卖专区 -->
			<view class="" v-for="(item,index) in homeActList" :key="index">
				<view class="home-new" v-if="item.actData.length !== 0">
					<view class="new-header">
						<view class="new-left">
							{{item.actInfo.name}}
						</view>
						<view class="home-label" v-if="item.actInfo.label">
							<text style="padding: 0upx 10upx;">{{item.actInfo.label}}</text>
						</view>
						<view class="new-right" @click="gotoActivity(item.actInfo)">
							查看更多<text class="cuIcon-right"></text>
						</view>
					</view>
					<view class="new-body">
						<view class="new-list" v-for="(v,i) in item.actData" :key='i' @tap="toGoods(v)">
							<view class="image-list">
								<view class="image-icon"
									v-if="item.actInfo.code == $stringUtils.saleZoneCode() && v.goodsMark != 0">
									<text
										v-if="v.goodsMark == 1">低至{{(v.salePrice / v.marketPrice * 10).toFixed(1)}}折</text>
									<text v-if="v.goodsMark == 2">直降{{v.marketPrice - v.salePrice}}元</text>
									<text v-if="v.goodsMark == 3">特卖价</text>
								</view>
								<image :src="v.goodsIcon" mode=""></image>
							</view>
							<view class="presentprice text-price">
								{{ v.salePrice }}
								<template v-if="v.integral > 0">
									<text class="text-xs">{{ v.integralType | filterIntegralType }}</text>
									<text>{{ v.integral }}</text>
									<text class="text-xs">{{$queue.getIntegralName()}}</text>
								</template>
							</view>
							<view class="text-price originalprice">
								{{v.marketPrice}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 猜你喜欢windowHeight -->
			<view class="" :style="{minHeight: 700 + 'px'}">
				<view class="home-tips" :style="{top: statusBarHeight + navBarHright + 'px'}">
					<view class="home-tips-select" :class="{active: listIndex == index}"
						v-for="(item,index) in ListShow" :key="item.name" @click="clickSwitch(item,index)">
						<view class="home-tips-nav">{{item.name}}</view>
						<view class="home-tips-like">{{item.label}}</view>
						<view class="home-tips-image">
							<image v-show="listIndex == index" src="../../static/img/icon-small.png" mode=""></image>
						</view>
					</view>
				</view>
				<view class="goods-list">
					<view class="goods-item" v-for="item in goodsList" :key="item.id" @tap="toGoods(item)">
						<image :src="item.goodsIcon"></image>
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
								<text
									class="text-sm line-thr text-price text-gray margin-left-xs">{{ item.marketPrice}}</text>
							</view>
						</view>
					</view>
				</view>

				<!-- <view class="goodsListV2" v-for="(v,i) in goodsList" :key="i">
					<view class="goodsListV2_top" @click="goGoodsstore(v)">
						<view class="left">
							<view class="avatar">
								<image :src="v.goodsBrand.brandIcon" mode=""></image>
							</view>
							<view class="content">
								<view>
									<view class="username">
										{{v.goodsBrand.brandName}}
									</view>
								</view>
								<view class="style">
									<text>{{v.goodsBrand.goodsTotal}}款</text>
								</view>
								<text class="subtract">199减20</text>
							</view>
						</view>
						<view class="right cuIcon-right"></view>
					</view>
					<scroll-view scroll-x="true" class="albumList">
						<view class="goodsListV2_body" v-for="(item,index) in v.goodsList" :key="index" @tap="toGoods(item)">
							<view class="imgwrap">
								<image :src="item.goodsIcon"></image>
							</view>
							<view class="infowrap">
								<view class="title">蓝月亮衣领净...</view>
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
					</scroll-view>
				</view> -->
			</view>
			<!-- 状态 -->
			<view class="cu-load" :class="queryParams.isfinish ? 'over' : 'loading'"></view>
			<!-- </view> -->
		</view>
	</view>
</template>

<script>
	// import bmap from '@/common/SDK/bmap-wx.js';
	export default {
		data() {
			return {
				bgcolor: {
					one: '',
					two: '',
				},
				statusBarHeight: 0,
				navBarHright: 0,
				// 高度差
				heightDiff: 0,
				statusBar: {},
				city: '北京',
				currentSwiper: 0,
				// 轮播图片
				swiperList: [],
				swiperLists: [],
				// 分类菜单
				categoryList: [],
				homeActList: [],
				//猜你喜欢列表
				goodsList: [],
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					isfinish: false,
					actCode: ""
				},
				listIndex: 0,
				ListShow: [],
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
			this.getActBannerLists();
			this.getActBannerList();
			// 加载猜你喜欢推荐商品
			this.listIndex = 0;
			this.goodsList = [];
			this.getHomeActList()
			this.getListShow()
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
				this.getActGoodsList();
			}

		},
		onLoad(option) {
			// // 定位
			// const Bmap = new bmap.BMapWX({
			// 	ak: 'leuSffRhfn9ysUifXtnNAqzkYOsBG5by'
			// });
			// uni.getLocation({
			// 	type: 'gcj02',
			// 	success: r => {
			// 		Bmap.regeocoding({
			// 			location: r.latitude + ',' + r.longitude,
			// 			success: data => {
			// 				this.city = data.originalData.result.addressComponent.city.replace(/市/g, ''); //把"市"去掉
			// 				// #ifdef APP-PLUS
			// 				this.nVueTitle.postMessage({
			// 					type: 'location',
			// 					city: this.city
			// 				});
			// 				// #endif
			// 			}
			// 		});
			// 	}
			// });
			this.getHomeActList()
			this.getListShow()
			// 加载banner图
			this.getActBannerList();
			this.getActBannerLists();
			// 加载推荐商品
			// this.getActGoodsList();
			// 获取设备状态栏高度
			this.getSystemdata();
			// 获取活动列表
			// this.getActListByType()
		},
		methods: {
			change(e) {
				let index = e.detail.current
				this.swiperList.map((v, i) => {
					if (index == i) {
						this.$set(this.bgcolor, 'one', v.topBarColor)
						this.$set(this.bgcolor, 'two', v.topBarColor)
					}
				})
			},
			changes(e) {
				// console.log(e)
			},
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
			// 获取活动列表
			async getHomeActList() {
				const res = await this.$http.getHomeActList({
					"code": this.$stringUtils.mallCode() // 商城code
				});
				if (res.code == 200) {
					this.homeActList = res.data.act
					this.categoryList = res.data.kingKong
					this.categoryList.push({
						name: '全部商品',
						code: '0000',
						// icon: 'https://app-static.meitianhui.com/images/e2a2e9a68755bcc7216a0c162039c448-n4d4ybgjgl.png'
					})
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
			async getActGoodsList() {
				if (this.queryParams.isfinish) return;
				const res = await this.$http.getActGoodsList(this.queryParams);
				// const res = await this.$http.getActGoodsListV2(this.queryParams);
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
					url: '/sub/stores/store/storeDetail?storeId=' + v.goodsList[0].storeId + '&brandCode=' + v.goodsBrand.brandCode
				})
			},
			/* 获取banner图 */
			async getActBannerList() {
				const res = await this.$http.getActBannerList({
					type: '1',
					actCode: this.$stringUtils.mallCode()
				});
				if (res.success) {
					this.swiperList = res.data;
					this.$set(this.bgcolor, 'one', this.swiperList[0].topBarColor)
					this.$set(this.bgcolor, 'two', this.swiperList[0].topBarColor)

				}
			},
			/* 获取推荐图图 */
			async getActBannerLists() {
				const res = await this.$http.getActBannerList({
					type: '2',
					actCode: this.$stringUtils.mallCode()
				});
				if (res.success) {
					this.swiperLists = res.data;

				}
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
			/* 分类跳转 */
			toCategory(e) {
				uni.navigateTo({
					url: e.url
				});
			},
			/* 商品跳转 */
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

			/* 列表专区切换 */
			// 列表获取
			async getListShow() {
				const res = await this.$http.getActListByType({
					"type": 4,
					"code": this.$stringUtils.mallCode()
				});
				if (res.code == 200) {
					if (res.data.length !== 0) {
						this.ListShow = res.data
						this.queryParams.actCode = res.data[0].code
						this.getActGoodsList();
					}
				}
			},
			// 列表点击切换
			clickSwitch(item, index) {
				if (this.listIndex == index) return
				uni.showLoading({
					mask: true,
					title: "加载中..."
				})
				this.goodsList = []
				this.queryParams.pageNum = 1
				this.listIndex = index
				this.queryParams.actCode = item.code
				this.queryParams.isfinish = false
				this.getActGoodsList()
			},
		}
	};
</script>
<style lang="scss" scoped>
	.active {
		color: #eb6132 !important;
		font-size: 36upx !important;
	}

	.home {
		.search {
			width: 100%;
			position: sticky;
			z-index: 9999;
			top: 0upx;
			background: linear-gradient(180deg, #FF8744 0%, #FF8744 100%);

			.searchNav {
				display: flex;
				align-items: center;
				margin-left: 24upx;

				.image {
					width: 116upx;
					height: 40upx;

					image {
						width: 116upx;
						height: 40upx;
					}
				}

				.btn {
					display: flex;
					align-items: center;
					width: 374upx;
					background: #FFFFFF;
					border: 2upx solid #EC6033;
					box-sizing: border-box;
					border-radius: 42upx;
					margin-left: 24upx;

					.icon {
						width: 32upx;
						height: 32upx;
						color: #818181;
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

		&-header {
			height: 150upx;
			background: linear-gradient(180deg, #F3EEE0 0%, #B9AB9A 100%);
			display: flex;
			flex-direction: column;
			padding-right: 24upx;
			padding-left: 24upx;
			padding-top: 30upx;
			padding-bottom: 30upx;
			color: #FFFFFF;



		}

		&-content {
			min-height: 700upx;
			border-radius: 68upx 68upx 0 0;
			position: relative;
			top: -80upx;
			background: #f7f7f7;

			&-top {
				.swiper {
					width: 100%;
					padding-top: 24upx;
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


		&-nav {
			// width: 700upx;
			margin-left: 24upx;
			padding: 178upx 0 0upx 0;
			border-bottom: solid 2upx #f6f6f6;
			display: flex;
			// justify-content: space-between;
			flex-wrap: wrap;

			.nav-item {
				margin-top: 32upx;
				margin-right: 20upx;
				height: 136upx;
				text-align: center;

				image {
					width: 80upx;
					height: 80upx;

					image {
						width: 11vw;
						height: 11vw;
					}
				}

				.text {
					margin-top: 16upx;
					min-width: 124upx;
					display: flex;
					justify-content: center;
					font-size: 24upx;
					color: #3c3c3c;
				}

				&:nth-child(5) {
					margin-right: 0upx;
				}

				:nth-child(5) {
					margin-right: 0upx;
				}
			}

		}

		&-fine {
			margin: 32upx 24upx 24upx;

			&-swiper-box {
				width: 700upx;
				height: 176upx;
				overflow: hidden;
				border-radius: 15upx;
				// box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
				//兼容ios，微信小程序
				position: relative;
				z-index: 1;

				swiper {
					width: 100%;
					height: 176upx;

					swiper-item {
						image {
							width: 100%;
							height: 176upx;
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

			// image {
			// 	width: 700upx;
			// 	height: 176upx;
			// }
		}


		&-new {
			width: 700upx;
			margin: 0upx 24upx 24upx;
			padding: 24upx;
			box-sizing: border-box;
			background-color: #fff;
			border-radius: 16upx;

			.new-header {
				position: relative;

				.new-left {
					float: left;
					font-size: 32upx;
					font-weight: 500;
					color: #333333;
				}

				.home-label {
					position: absolute;
					left: 136upx;
					top: 0upx;
					height: 40upx;
					font-size: 24upx;
					border: 2upx solid #EB6132;
					border-radius: 40upx;
					text-align: center;
					line-height: 40upx;
					color: #EB6132;
				}

				.new-right {
					float: right;
					font-size: 24upx;
					font-weight: 300;
					color: #333333;
				}
			}

			.new-body {
				display: flex;
				justify-content: space-between;
				margin-top: 70upx;

				.new-list {
					text-align: center;

					.image-list {
						position: relative;

						.image-icon {
							position: absolute;
							bottom: 0upx;
							z-index: 88;
							height: 32upx;
							background: #EB6133;
							border-radius: 12upx 0upx 12upx 0upx;
							display: flex;
							align-items: center;

							text {
								font-size: 20upx;
								font-weight: 300;
								color: #FFFFFF;
								padding: 2upx 8upx;
							}
						}

						image {
							border-radius: 16upx;
							width: 144upx;
							height: 144upx;
						}
					}

					.presentprice {
						font-size: 20upx;
						font-weight: 300;
						margin-top: 16upx;
						color: #EB6133;
					}

					.instructions {
						font-size: 24upx;
						font-weight: 300;
						margin: 16upx 0upx 0upx;
						color: #333333;
					}

					.originalprice {
						font-size: 22upx;
						font-weight: 300;
						color: #999999;
						text-decoration: line-through;
					}
				}
			}
		}

		&-tips {
			background-color: #f7f7f7;
			z-index: 999;
			position: sticky;
			display: flex;
			justify-content: space-around;
			align-items: center;
			margin: 0upx 0upx 24upx;
			padding: 10upx 24upx;


			&-select {
				text-align: center;
				font-size: 32upx;
			}

			&-nav {
				font-weight: 500;
				width: 100upx;
				overflow: hidden;
				height: 44upx;
				// color: #333;
			}

			&-like {
				font-size: 26upx;
				font-weight: 300;
				// color: #333;
			}

			&-image {
				width: 104upx;
				height: 32upx;

				image {
					text-align: center;
					width: 32upx;
					height: 100%;
				}
			}
		}
	}

	@import "@/static/css/goods.scss";
</style>
