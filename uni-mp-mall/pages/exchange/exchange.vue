<template>
	<view class="goods">
		<!-- 顶部搜索 -->
		<view class="search" :style="{ height: statusBarHeight + navBarHright  + 'px',background: 'linear-gradient(180deg, '+ bgcolor.one + ' 0%, ' + bgcolor.two + ' 100%)'}">
			<view class="searchBar" :style="{height: statusBarHeight  + 'px'}"></view>
			<view class="searchNav" :style="{height: navBarHright  + 'px'}">
				<view class="image">
					<image src="../../static/img/logoText@2x.png" mode=""></image>
				</view>
				<view class="btn" @click="goSearch" :style="{height: statusBar.height + 'px'}">
					<text class="icon cuIcon-search"></text>
					<text>
						搜索
					</text>
				</view>
			</view>
		</view>
		<!-- 广告图  -->
		<view class="goods-header" :style="{ background: 'linear-gradient(180deg, '+ bgcolor.one + ' 0%, ' + bgcolor.two + ' 100%)' }" >
			<view class="swiper">
				<view class="swiper-box">
					<swiper class="square-dot" :indicator-dots="true" :circular="true" :autoplay="true" interval="3000"
						duration="500" @change="change">
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
						<view class="logo">
							<image :src="item.gooGoodsBrand.brandLogo" mode=""></image>
							<text class="brandName">{{ item.gooGoodsBrand.brandName || '' }}</text>
							<view class="countNum">
								{{ item.gooGoodsBrand.goodsTotal || 0 }}款
							</view>
						</view>
						<view class="name">{{ item.goodsName}}</view>
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
								<!-- <text
									class="text-sm line-thr text-price text-gray margin-left-xs">{{ item.marketPrice}}</text> -->
							</view>
						</view>
					</view>
				</view>
				<view class="bottom">
					<view class="fx" type="default" @click.stop="showShareEvn(item)">
						<image src="../../static/img/fx@2x.png" mode=""></image> 分享
					</view>
					<!-- <view class="time" v-if="item.timer > 0"> -->
					<view class="time">
						<text class="one">距结束</text>
						<uni-countdown color="#FA3B1C" splitorColor="#999" background-color="#FFF" border-color="#FFF" dayColor="#FA3B1C"
							:day="item.d" :hour="item.h" :minute="item.m" :second="item.s" :showColon="false">
						</uni-countdown>
					</view>
					<!-- <view class="time" v-else>
						<text>活动已结束</text>
					</view> -->
					
				</view>
			</view>
		</view>
		<!-- 状态 -->
		<view class="cu-load" :class="queryParams.isfinish ? 'over' : 'loading'"></view>
		<!-- 分享弹窗 -->
		<view class="share-pro">
			<view class="share-pro-mask" v-if="deliveryFlag"></view>
			<view class="share-pro-dialog" :class="deliveryFlag ? 'open' : 'close'">
				<view class="close-btn" @tap="hideShareEvn"><span class="cuIcon-close"></span></view>
				<view class="share-pro-title">分享</view>
				<view class="share-pro-body">
					<view class="share-item">
						<button open-type="share">
							<view class="cuIcon-weixin share-icon"></view>
							<view>分享给好友</view>
						</button>
					</view>
					<view class="share-item" @tap="createCanvasImageEvn">
						<view class="cuIcon-pic share-icon"></view>
						<view>生成分享图片</view>
					</view>
				</view>
			</view>
		</view>
		<hchPoster ref="hchPoster" @cancel="handleCancel" :posterData.sync="posterData" />
	</view>
</template>

<script>
	import hchPoster from '../../components/hch-poster/hch-poster2.vue';
	import uniCountdown from '../../components/uni-countdown/uni-countdown.vue'
	export default {
		components: {
			hchPoster,
			uniCountdown
		},
		data() {
			return {
				deliveryFlag: false,
				bgcolor: {
					one: '',
					two: '',
				},
				minHeight: 0,
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
					orderBy: ''
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
					name: '上新',
					img: '../../static/img/default@2x.png'
				}], //
				tabTypeIndex: 0,
				goodsItem: {},
				listType: 0,
				timer: null,
				posterData: {
					poster: {
						//根据屏幕大小自动生成海报背景大小
						url: null, //图片地址
						r: 10, //圆角半径
						w: 299, //海报宽度
						h: 460, //海报高度
						p: 10 //海报内边距padding
					},
					brandImg: {
						//海报品牌logo
						url: null, //图片地址
						r: 24, //圆角半径
						w: 48, //海报宽度
						h: 48, //海报高度
					},
					name: {
						//店铺名称
						text: '', //文本
						fontSize: 12, //字体大小
						color: "#000", //颜色
						lineHeight: 20, //行高
						align: "right", //对齐方式
						bold: true,
						mt: 1 //margin-top
					},
					mainImg: {
						//海报主商品图
						url: null, //图片地址
						r: 10, //圆角半径
						w: 279, //宽度
						h: 240 //高度
					},
					title: {
						//商品标题
						text: '', //文本
						fontSize: 16, //字体大小
						color: "#000", //颜色
						lineHeight: 25, //行高
						mt: 16 //margin-top
					},
					textBg: {
						url: null, //图片地址
						w: 177, //宽度
						h: 36, //高度
						r: 18, //圆角半径
					},
					userImg: {
						//邀请人头像
						url: null, //图片地址
						w: 28, //宽度
						h: 28, //高度
						mt: 24, //margin-top
						r: 14 //圆角半径
					},
					
					userInfo: [
						//个人信息
						{
							text: '', //文本
							fontSize: 11, //字体大小
							color: "#333", //字体颜色
							align: "left", //对齐方式
							lineHeight: 25, //行高
							mt: 43, //margin-top
							bold: true
						}
					],
					codeImg: {
						//小程序码
						url: null, //图片地址
						w: 72, //宽度
						h: 72, //高度
						mt: 12, //margin-top
						r: 10 //圆角半径
					},
					tips: [
						//提示信息
						{
							text: '', //文本
							fontSize: 8, //字体大小
							color: "#666", //字体颜色
							align: "right", //对齐方式
							lineHeight: 25, //行高
							mt: 10 //margin-top
						},
						{
							text: '', //文本
							fontSize: 12, //字体大小
							color: "#2f1709", //字体颜色
							align: "center", //对齐方式
							lineHeight: 25, //行高
							mt: 20 //margin-top
						}
					]
				},
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
			/* 打开分享海报弹窗 */
			showShareEvn(val) {
				if (this.hasLogin) {
					// this.deliveryFlag = true;
					this.goodsItem = val
					// 配置分享
					this.share.path = "/sub/goods/detail/detail?goodsId=" + val.id
					this.share.imageUrl = val.goodsIcon;
					this.share.title = val.goodsName;
					this.share.desc = val.goodsTitle;
					this.createCanvasImageEvn()
					return
				}
				uni.redirectTo({
					url: "/pages/login/login"
				})

			},
			/* 关闭分享弹窗 */
			hideShareEvn() {
				this.deliveryFlag = false;
			},
			/* 取消海报 */
			handleCancel(val) {
				// this.canvasFlag = val
			},
			/* 创建海报画报 */
			createCanvasImageEvn() {
				// console.log(this.goodsItem)
				uni.showLoading({
					mask: true,
					title: "加载中..."
				})
				this.$http.getShareQrcode({
					"scene": this.myInviteCode,
					"userId": this.userId,
					"shareId": this.goodsItem.id,
					"path": "sub/goods/detail/detail" // sub/stores/store/storeDetail
				}).then(res => {
					uni.hideLoading()
					this.posterData.poster.url = this.$queue.fxBgImg()
					this.posterData.brandImg.url = this.goodsItem.gooGoodsBrand.brandLogo
					this.posterData.name.text = `        ${this.goodsItem.goodsName}`
					this.posterData.mainImg.url = this.goodsItem.goodsIcon
					this.posterData.codeImg.url = res.data
					this.posterData.textBg.url = this.$queue.publicCdnHost()+'/assets/imgs/hbTextBg@2x.png'
					this.posterData.userImg.url = this.userInfo.avatarUrl
					this.posterData.userInfo[0].text = `            @${this.userPhone} 为你推荐`
					// this.posterData.userInfo[1].text = ''
					// this.$forceUpdate(); //强制渲染数据
					setTimeout(() => {
						this.$refs.hchPoster.posterShow()
						this.deliveryFlag = false
					}, 500);
				})
			},
			change(e) {
				let index = e.detail.current
				this.swiperList.map((v, i) => {
					if (index == i) {
						this.$set(this.bgcolor, 'one', v.topBarColor)
						this.$set(this.bgcolor, 'two', v.topBarColor)
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
			},
			// 判断用户是否开通礼券礼包
			judgeOpened() {
				this.$http.getIsBuyGift().then(res => {
					if (res.code == 200) {
						if (res.data) {
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
					"code": this.$stringUtils.brandCode()
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
				this.queryParams.status = 3
				const res = await this.$http.getActGoodsList(this.queryParams);
				// const res = await this.$http.getActGoodsListV2(this.queryParams);
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

			// 获取小程序首页商品列表
			async getGoodsBaseList() {
				if (this.queryParams.isfinish) return;
				this.queryParams.listType = this.listType
				const res = await this.$http.getMpGoodsList(this.queryParams);
				console.log('res:',res)
				if (res.code == 200) {
					uni.stopPullDownRefresh();
					uni.hideLoading()
					this.totalPage = res.data.totalPage
					if (res.success) {
						this.goodsList = _.concat(this.goodsList, res.data.list);
						
						if(this.goodsList.length > 2) {
							this.minHeight = 500
						}
						if(this.goodsList.length > 3) {
							this.minHeight = 700
						}
						this.goodsList.map((item, index) => {
							if (!item) {
								this.goodsList.splice(index, 1)
							}
							this.timer = item.pullOffTime - new Date().getTime()
							// console.log(this.timer)
							let d = Math.floor(this.timer / 1000 / 86400);
							let h = Math.floor(this.timer / 1000 % 86400 / 3600);
							let m = Math.floor(this.timer / 1000 % 86400 % 3600 / 60);
							let s = Math.floor(this.timer / 1000 % 86400 % 3600 % 60);
							item['d'] = d
							item['h'] = h
							item['m'] = m
							item['s'] = s
							item['timer'] = this.timer
							// console.log(item)
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
					this.$set(this.bgcolor, 'one', this.swiperList[0].topBarColor)
					this.$set(this.bgcolor, 'two', this.swiperList[0].topBarColor)
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
			/* 列表切换 */
			// 列表获取
			async getListShow() {
				const res = await this.$http.getActListByType({
					"type": 4,
					"code": this.$stringUtils.brandCode()
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
		},
		//下拉刷新，配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			this.tabType = [{
				name: '综合',
				img: '../../static/img/default@2x.png'
			}, {
				name: '上新',
				img: '../../static/img/default@2x.png'
			}]
			this.tabTypeIndex = 0
			this.goodsList = [];
			this.queryParams.isfinish = false;
			this.queryParams.pageNum = 1;
			this.listType = 0;
			this.getGoodsBaseList();
			// 加载兑换中心商品
			this.getActBannerList();
			// this.getListShow();
			// this.getHomeActList()
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
				// this.getActGoodsList();
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
		// .sticky {
		// 	position: sticky;
		// 	z-index: 1;
		// 	top: 0upx;
		// 	width: 100%;
		// }
		.search {
			height: 120upx;
			width: 100%;
			position: sticky;
			z-index: 1;
			top: 0upx;
			background: linear-gradient(90deg, #F32A2A 0%, #FF6B3A 100%);

			.searchNav {
				display: flex;
				align-items: center;
				margin-left: 24upx;

				.image {
					width: 144upx;
					height: 76upx;

					image {
						width: 144upx;
						height: 76upx
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

		&-header {
			// width: 750rpx;
			height: 254rpx;
			// position: sticky;
			// z-index: 999;
			// top: 0upx;
			// background: url('../../static/img/headerBgImg@2x.png') no-repeat;
			// background-size: 100%;
			border-bottom-left-radius: 20%;
			border-bottom-right-radius: 20%;

			// image {
			// 	width: 702rpx;
			// 	height: 300rpx;
			// 	margin: 24rpx;
			// }
		}

		.swiper {
			width: 100%;
			padding-top: 24upx;
			display: flex;
			justify-content: center;

			.swiper-box {
				width: 700upx;
				height: 300upx;
				overflow: hidden;
				border-radius: 16upx;
				background-color: rgba(0, 0, 0, 0)!important;
				// box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
				//兼容ios，微信小程序
				position: relative;
				// z-index: 1;

				swiper {
					width: 700upx;
					height: 300upx;

					swiper-item {
						image {
							width: 700upx;
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

		.topTabBar {
			position: sticky;
			z-index: 1;
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			font-size: 28upx;
			color: #333;
			padding: 24upx;
			margin-top: 70upx;
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
				height: 292upx;
				background: #FFFFFF;
				border-radius: 16upx;
				padding: 24upx;
				margin-bottom: 24upx;

				.top {
					display: flex;
					margin-bottom: 28upx;

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
						justify-content: space-around;

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
							margin: 16upx 0 20upx 0;
						}

						.info {
							display: flex;
							justify-content: space-between;
							align-items: flex-end;
							// padding: 20upx 3%;

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

					// button::after {
					// 	border: 1upx solid #fff;
					// }
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
