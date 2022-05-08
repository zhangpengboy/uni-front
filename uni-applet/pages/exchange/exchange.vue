<template>
	<view class="goods">
		<!-- 顶部搜索 -->
		<view class="search"
			:style="{ height: statusBarHeight + navBarHright  + 'px',background: 'linear-gradient(180deg, '+ bgcolor.one + ' 0%, ' + bgcolor.two + ' 100%)' }">
			<view class="searchBar" :style="{height: statusBarHeight  + 'px'}"></view>
			<view class="searchNav" :style="{height: navBarHright  + 'px'}">
				<view class="image">
					<image :src="`${$queue.publicCdnHost()}/assets/imgs/logoText@2x.png`" mode=""></image>
				</view>
				<view class="btn" @click="goSearch" :style="{height: statusBar.height + 'px'}">
					<text class="icon cuIcon-search"></text>
					<text>
						搜索你想要兑换的商品
					</text>
				</view>
			</view>
		</view>
		<view class="goods-header"
			:style="{  background: 'linear-gradient(180deg, '+ bgcolor.one + ' 0%, ' + bgcolor.two + ' 100%)' }">
		</view>
		<!-- 广告图 -->
		<view class="goods-content">
			<!-- <view class="" style="position: absolute;top: -20%; width: 100%;"> -->
			<view class="goods-content-top" style="position: absolute;
			top: -140upx; left: 25upx;">
				<view class="swiper">
					<view class="swiper-box">
						<swiper class="square-dot" :indicator-dots="true" :circular="true" :autoplay="true"
							interval="3000" duration="500" @change="change">
							<swiper-item v-for="(item,index) in swiperList" :key="item.id" @click="toSwiper(item)">
								<video :src="item.image" autoplay loop muted :show-play-btn="false" :controls="false"
									objectFit="cover" v-if="item.type=='video'"></video>
								<image :src="item.image" mode="aspectFill" v-else></image>
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>
			<!-- 分类列表 -->
			<view class="goods-nav">
				<view class="nav-item" v-for="(row, index) in categoryList" :key="row.id" @tap="gotoActivity(row)">
					<view class="img">
						<image :src="row.icon"></image>
					</view>
					<view class="text">{{ row.name }}</view>
				</view>
			</view>
			<!-- 每日上新 -->
			<view class="">
				<view class="" v-for="(item,index) in homeActList" :key='index'>
					<view class="goods-new" v-if="item.actData.length" :class="{borders: index == 1}">
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
							<view class="new-list" v-for="(v,i) in item.actData" :key='v.id' @tap="toGoods(v)">
								<view class="image-list">
									<view class="image-icon"
										:style="{background: 'linear-gradient(180deg, ' + hotbgc[i].shallow + ' 0%, '+ hotbgc[i].deep +' 100%)'}"
										v-if="item.actInfo.code == $stringUtils.hotexchangeCode()">
										<text>{{'0' + (i+1)}}</text>
									</view>
									<image :src="v.goodsIcon" mode=""></image>
								</view>
								<!-- 每日上新 -->
								<view class="instructions" v-if="item.actInfo.style == 2">
									{{v.goodsName}}
								</view>
								<view class="presentprice text-price">
									{{ v.salePrice }}
									<template v-if="v.integral > 0">
										<text class="text-xs">{{ v.integralType | filterIntegralType }}</text>
										<text>{{ v.integral }}</text>
										<text class="text-xs">{{$queue.getIntegralName()}}</text>
									</template>
								</view>
								<view class="text-price originalprice" v-if="item.actInfo.style == 1">
									{{v.marketPrice}}
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 大牌汇聚 -->
				<view class="">
					<view class="goods-show" v-if="transverseList.length > 1">
						<view class="" v-for="(item,i) in transverseList" :key="i" style="border-right: 2upx solid #F6F6F6;">
							<view class="goods-show-left" @click="gotoActivity(item.actInfo)"
								v-if="item.actData.length">
								<view class="big">
									{{item.actInfo.name}}
								</view>
								<view class="pic">
									<!-- @tap="toGoods(item.actData[0])" -->
									<image :src="item.actData[0].goodsIcon" mode="">
									</image>
									<image style="margin-left: 24upx;" :src="item.actData[1].goodsIcon" mode=""></image>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 猜你喜欢 -->
			<view class="" :style="{minHeight: windowHeight - 50 + 'px'}">
				<view class="goods-tips" :style="{top: statusBarHeight + navBarHright + 'px'}">
					<view class="goods-tips-select" :class="{active: listIndex == index}"
						v-for="(item,index) in ListShow" :key="index" @click="clickSwitch(item,index)">
						<view class="goods-tips-nav">{{item.name}}</view>
						<view class="goods-tips-like">{{item.label}}</view>
						<view class="goods-tips-image">
							<image v-show="listIndex == index" src="../../static/img/icon-small.png" mode=""></image>
						</view>
					</view>
				</view>

				<!-- 列表 -->
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
							<!-- <view class="slogan">{{ product.sale + 100 }}人已购买</view> -->
						</view>
					</view>
				</view>
			</view>
			<!-- 状态 -->
			<view class="cu-load" :class="queryParams.isfinish ? 'over' : 'loading'"></view>
			<!-- </view> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				hotbgc: [{
						shallow: '#FE8282',
						deep: '#EF4444'
					},
					{
						shallow: '#FFC664',
						deep: '#F87C30'
					},
					{
						shallow: '#7FB6FE',
						deep: '#3889F2'
					},
					{
						shallow: '#FBE1BD',
						deep: '#E9C387'
					}
				],
				bgcolor: {
					one: '',
					two: '',
				},
				statusBarHeight: 0,
				navBarHright: 0,
				// 高度差
				heightDiff: 0,
				statusBar: {},
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					isfinish: false,
					actCode: ""
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
			}
		},
		onLoad() {
			this.getActBannerList();
			this.getListShow();
			// 获取设备状态栏高度
			this.getSystemdata();
			this.getHomeActList()
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
			},
			// 判断用户是否开通礼券礼包
			judgeOpened() {
				this.$http.getIsBuyGift().then(res =>{
					if(res.code == 200) {
						if(res.data) {
							uni.navigateTo({
								url: '../../sub/giftbag/topup/topup'
							});	
						}
					}
				})
			},
			// 跳转活动页面
			gotoActivity(item) {
				item.path = 'exchange'				
					uni.navigateTo({
						url: "/sub/activity/activity/activity?" + this.$queue.stringify(item)
					});
			},
			// 获取活动列表
			async getHomeActList() {
				const res = await this.$http.getHomeActList({
					"code": this.$stringUtils.exchangeCode()
				});
				if (res.code == 200) {
					let transverseArr = []
					let longitudinalArr = []
					res.data.act.map(item => {
						if (item.actInfo.style == 3) {
							if (item.actData.length > 0) {
								transverseArr.push(item)
							}
						} else {
							longitudinalArr.push(item)
						}
					})
					this.transverseList = _.cloneDeep(transverseArr)
					this.homeActList = _.cloneDeep(longitudinalArr)
					this.categoryList = res.data.kingKong
				}
			},
			/* 获取兑换中心商品列表 */
			async getActGoodsList() {
				if (this.queryParams.isfinish) return;
				const res = await this.$http.getActGoodsList(this.queryParams);
				if (res.code == 200) {
					uni.stopPullDownRefresh();
					uni.hideLoading()
					this.totalPage = res.data.totalPage
					if (res.success) {
						this.goodsList = _.concat(this.goodsList, res.data.list);
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
					actCode: this.$stringUtils.exchangeCode()
				});
				if (res.success) {
					this.swiperList = res.data;
					this.$set(this.bgcolor, 'one', this.swiperList[0].topBarColor)
					this.$set(this.bgcolor, 'two', this.swiperList[0].topBarColor)
				}
			},
			// 跳转搜索页面
			goSearch() {
				uni.navigateTo({
					url: "/sub/goods/search/search?actCode=" + this.$stringUtils.exchangeCode()
				});
			},
			//商品跳转
			toGoods(e) {
				uni.navigateTo({
					// url: "/sub/goods/detail/detail?" + this.$queue.stringify(e)
					url: "/sub/goods/detail/detail?goodsId=" + e.id
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
						path: 'exchange',
						name: e.urlName,
						code: e.url,
					}
					uni.navigateTo({
						url: "/sub/activity/activity/activity?" + this.$queue.stringify(item)
					})
				}
			},
			/* 列表切换 */
			// 列表获取
			async getListShow() {
				const res = await this.$http.getActListByType({
					"type": 4,
					"code": this.$stringUtils.exchangeCode()
				});
				if (res.code == 200) {
					if (res.data.length !== 0) {
						this.ListShow = res.data
						this.queryParams.actCode = res.data[0].code
						this.getActGoodsList();
					}
				}
			},
			clickSwitch(item, index) {
				if (this.listIndex == index) return
				this.queryParams.pageNum = 1
				this.goodsList = []
				this.listIndex = index
				this.queryParams.actCode = item.code
				this.queryParams.isfinish = false
				this.getActGoodsList()
			},
		},
		//下拉刷新，配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			this.goodsList = [];
			this.queryParams.isfinish = false;
			this.queryParams.pageNum = 1;
			this.listIndex = 0;
			// 加载兑换中心商品
			this.getActBannerList();
			this.getListShow();
			this.getHomeActList()
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
	}
</script>

<style lang="scss" scoped>
	.active {
		color: #eb6132 !important;
		font-size: 36upx !important;
	}

	.borders {
		border-radius: 16upx 16upx 0upx 0upx !important
	}

	.goods {
		.search {
			height: 120upx;
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
					// height: 64upx;
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
			// width: 375px;
			// height: 360upx;
			// background: #f3eee0;
			// opacity: 1;
			height: 150upx;
			background: linear-gradient(180deg, #FF8744 0%, #EB6132 100%);
			display: flex;
			flex-direction: column;
			padding-right: 24upx;
			padding-left: 24upx;
			padding-top: 30upx;
			padding-bottom: 30upx;
			color: #FFFFFF;


		}

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

		&-content {
			min-height: 700upx;
			border-radius: 68upx 68upx 0 0;
			position: relative;
			top: -80upx;
			background: #f7f7f7;
		}

		&-nav {
			margin-left: 24upx;
			padding: 176upx 0 32upx 0;
			border-bottom: solid 2upx #f6f6f6;
			display: flex;
			justify-content: space-around;
			flex-wrap: wrap;

			.nav-item {
				// margin-top: 10upx;
				text-align: center;
				margin-top: 32upx;
				margin-right: 20upx;
				height: 136upx;

				// text-align: center;
				image {
					width: 96upx;
					height: 96upx;

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
			}

			&:nth-child(5) {
				margin-right: 0upx;
			}

			:nth-child(5) {
				margin-right: 0upx;
			}
		}

		&-new {
			width: 700upx;
			margin: 0upx 24upx 24upx;
			padding: 24upx;
			box-sizing: border-box;
			background-color: #fff;
			border-radius: 16upx;

			.new-header {
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
							bottom: 10upx;
							right: 0upx;
							z-index: 88;
							height: 40upx;
							background: linear-gradient(180deg, #FE8282 0%, #EF4444 100%);
							border-radius: 16upx 0upx 16upx 0upx;
							display: flex;
							align-items: center;

							text {
								font-size: 20upx;
								font-weight: 300;
								color: #FFFFFF;
								padding: 4upx 18upx;
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
						height: 64upx;
						font-size: 24upx;
						font-weight: 300;
						margin: 16upx 0upx 0upx;
						color: #333333;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 3;
						-webkit-box-orient: vertical;
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

		&-show {
			width: 700upx;
			display: flex;
			margin: -24upx 24upx 24upx;
			// padding: 24upx;
			border-top: 2upx solid #F6F6F6;
			box-sizing: border-box;
			background-color: #fff;
			border-radius: 0upx 0upx 16upx 16upx;

			&-left {
				width: 350upx;

				.big {
					padding: 24upx;
					font-size: 32upx;
					font-weight: 500;
					color: #333333;
				}

				.pic {
					margin-left: 14upx;
					margin-bottom: 24upx;

					image {
						border-radius: 16upx;
						width: 144upx;
						height: 144upx;
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

			// &-text {
			// 	position: relative;
			// 	border-radius: 50upx;
			// 	background-color: #FFE5E1;
			// 	font-size: 28upx;
			// 	padding: 8upx 26upx;
			// 	z-index: 1;

			// 	&::after {
			// 		content: '';
			// 		width: 0;
			// 		height: 0;
			// 		border-width: 16upx 16upx 0;
			// 		border-style: solid;
			// 		border-color: #FFE5E1 transparent transparent;
			// 		position: absolute;
			// 		right: 30upx;
			// 		bottom: -16upx;
			// 		z-index: 0;
			// 	}
			// }
		}
	}

	@import "@/static/css/goods.scss";
</style>
