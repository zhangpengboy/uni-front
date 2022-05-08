<template>
	<view class="apply">
		<view class="top">	
		<!-- :style="{background: 'url(' + storeDoc.storeBg + ')  no-repeat'}" -->
			<view class="store-bg">
				<image :src="storeDoc.storeBg" mode="aspectFill"></image>
			</view>
				<view class="searchBar" :style="{height: statusBarHeight  + 'px'}"></view>
				<view class="searchNav" :style="{height: navBarHright  + 'px'}">
					<view class="black" @tap="goBlack()">
						<image src="../static/img/black@2x.png" class="black-icon" mode=""></image>
					</view>
			</view>
			<view class="store_top">
				<view class="left">
					<image :src="storeDoc.storeLogo" class="storeImg"></image>
					<view class="store_name_favor">
						<view class="store_name">{{ storeInfo.storeName }}</view>
						<view class="store_favor">{{ favorCount > 0 ? favorCount : 0 }}人关注</view>
					</view>
				</view>
				<view class="right">
					<view class="store_but" :class="{favor1 : isFavor,favor: !isFavor}">
						<image src="../static/img/icon_follow@2x.png" v-if="!isFavor" class="store_favor_icon"></image>
						<text class="favor_txt" v-if="isFavor" @click="delStore">{{ '已关注' }}</text>
						<text class="favor_txt" v-else @click="addStore">{{ '关注' }}</text>
					</view>
					<view class="fx" @click="showShareEvn">
						<image src="../static/img/fx_off@2x.png" mode=""></image>
						<text>分享</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 首页点击商品进入，显示商品信息 -->
		<view class="act-head" v-if="!shareId && goodsId">
			<view class="act-head-item" @tap="toGoods(goodsInfo)">
				<view class="image">
					<image :src="goodsInfo.goodsIcon" mode=""></image>
				</view>
				<view class="text">
					<view class="text-title">
						{{ goodsInfo.goodsName}}
					</view>
					<!-- <view class="text-instructions">
						{{ goodsInfo.goodsTitle }}
					</view> -->
					<view class="text-prices fw">
						<text class="presents text-price">
							{{ goodsInfo.salePrice }}
							<template v-if="goodsInfo.integral > 0">
								<text class="text-xs">{{ goodsInfo.integralType | filterIntegralType }}</text>
								<text style="font-size: 30rpx;">{{ goodsInfo.integral }}</text>
								<text class="text-xs">{{$queue.getIntegralName()}}</text>
							</template>
						</text>
						<text class="original">{{'￥' + goodsInfo.marketPrice}}</text>
					</view>
					<view class="vipPrice">
						<text class="vip">会员价</text>
						<text class="presents text-price vipPriceItem fw" style="font-size: 22rpx;">
							{{ goodsInfo.vipPrice }}
							<template v-if="goodsInfo.integral > 0">
								<text class="text-xs">{{ goodsInfo.integralType | filterIntegralType }}</text>
								<text style="font-size: 22rpx;">{{ goodsInfo.integral }}</text>
								<text class="text-xs">{{$queue.getIntegralName()}}</text>
							</template>
						</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 综合 上新 -->
		<view class="topTabBar">
			<view class="tabitem" v-for="(item, tbIndex) in tabType" :key="tbIndex" @tap="handleTabType(tbIndex)">
				<view class="text" :class="[tbIndex == tabTypeIndex ? 'on' : '']">{{ item.name }}</view>
				<image :src="item.img" mode=""></image>
			</view>
		</view>
		<view class="" v-if="isloading == 0">
			<view class="" v-if="goodsList.length">
				<view class="store-list">
					<view class="store-item" v-for="item in goodsList" :key="item.id" @tap="toGoods(item)">
						<image :src="item.goodsIcon"></image>
						<view class="name">{{ item.goodsName}}</view>
						<!-- <view class="cateName">{{ item.goodsTitle}}</view> -->
						<view class="info">
							<view class="price text-price salePrice">
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
						<view class="vipPrice margin-left-xs">
							<text class="vip">会员价</text>
							<text class="presents text-price vipPriceItem fw" style="font-size: 22rpx;">
								{{ item.vipPrice }}
								<template v-if="item.integral > 0">
									<text class="text-xs">{{ item.integralType | filterIntegralType }}</text>
									<text style="font-size: 22rpx;">{{ item.integral }}</text>
									<text class="text-xs">{{$queue.getIntegralName()}}</text>
								</template>
							</text>
						</view>
					</view>
				</view>
				<!-- 状态 -->
				<view class="cu-load" :class="queryParams.isfinish ? 'over' : 'loading'"></view>
			</view>
			<view class="store-image" v-if="goodsList.length == 0">
				<image :src="img" mode=""></image>
				<view class="">
					还没有商品哦~
				</view>
			</view>
		</view>
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
	import hchPoster from '../../../components/hch-poster/hch-poster2.vue';
	export default {
		components: {
			hchPoster
		},
		data() {
			return {
				deliveryFlag: false,
				canvasFlag: true,
				isloading: 1,
				navList: [{
						name: '推荐',
					},
					{
						name: '宝贝',
					},
					{
						name: '活动',
					},
					{
						name: '新品',
					},
					// {
					// 	name: '便利店',
					// },
				],
				img: '',
				listIndex: 0,
				listName: '',
				favorCount: '',
				storeName: '',
				// 店铺详情
				storeInfo: {},
				storeDoc: {
					storeBg: '../static/img/storeBg@2x.png'
				},
				storeId: '',
				goodsId: '',
				goodsInfo: {},
				// 是否关注该店铺
				isFavor: false,
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					isfinish: false,
					status: 3,
					orderBy: 'asc',
					storeId: ""
				},
				totalPage: 0,
				goodsList: [],
				pushGoodsList: [],
				statusBarHeight: 0,
				navBarHright: 0,
				// 高度差
				heightDiff: 0,
				statusBar: {},
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
						fontSize: 16, //字体大小
						color: "#000", //颜色
						lineHeight: 16, //行高
						align: "left", //对齐方式
						bold: true,
						mt: 6 //margin-top
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
							mt: 10 ,//margin-top,
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
				options: null,
				tabType: [{
					name: '综合',
					img: '../../../static/img/default@2x.png'
				}, {
					name: '上新',
					img: '../../../static/img/default@2x.png'
				}], //
				tabTypeIndex: 0,
				actCode: ''
			}
		},
		onLoad(options) {
			// console.log('onLoad:',options)
			// console.log('onLoad:',this.shareId)
			this.options = options
			// 获取设备状态栏高度
			this.getSystemdata();
			this.goodsId = options.goodsId
			this.actCode = options.actCode
			if(this.actCode == 'LZSY_C') {
				// 街市
				this.tabType = [{
					name: '综合',
					img: '../../../static/img/default@2x.png'
				}, {
					name: '价格',
					img: '../../../static/img/default@2x.png'
				}]
			}
			if(options.scene) {
				this.storeId = this.shareId
				this.queryParams.storeId = this.shareId
			}else{
				this.storeId = options.storeId
				this.queryParams.storeId = options.storeId
				
			}
			this.getStoreInfoAndFavor()
			this.getActGoodsList()
			this.img = this.Dict.status_img
			this.goodsInfo = this.$queue.getJson('goodsInfo')
		},
		onShow() {
			// if (this.listName == '便利店') {
			// 	this.switchNavList(this.navList[0], 0)
			// }
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			
			if(this.actCode == 'LZSY_C') {
				// 街市
				this.tabType = [{
					name: '综合',
					img: '../../../static/img/default@2x.png'
				}, {
					name: '价格',
					img: '../../../static/img/default@2x.png'
				}]
			}else {
				// 商城
				this.tabType = [{
					name: '综合',
					img: '../../../../static/img/top@2x.png'
				}, {
					name: '上新',
					img: '../../../../static/img/default@2x.png'
				}]
			}
			this.tabTypeIndex = 0
			this.queryParams.pageNum = 1;
			this.queryParams.isfinish = false;
			// 加载猜你喜欢推荐商品
			this.goodsList = [];
			this.isloading = 1
			this.getActGoodsList();
		},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		onReachBottom() {
			if (this.totalPage > this.queryParams.pageNum) {
				this.queryParams.pageNum++;
				this.getActGoodsList();
			}
		},
		methods: {
			goBlack() {
				if (this.options.scene) {
					uni.redirectTo({
						url: "/pages/login/login?page=user"
					})
					return
				}
				uni.navigateBack()
			},
			handleTabType(i) {
				uni.showLoading({
					mask: true,
					title: "加载中..."
				})
				if (this.listType == i && this.tabType[i].img == '../../../static/img/default@2x.png') {
					this.tabType[i].img = '../../../static/img/top@2x.png'
					this.queryParams.orderBy = 'asc'
				} else if (this.listType == i && this.tabType[i].img == '../../../static/img/top@2x.png') {
					this.tabType[i].img = '../../../static/img/bottom@2x.png'
					this.queryParams.orderBy = 'desc'
				} else if(this.listType == i && this.tabType[i].img == '../../../static/img/bottom@2x.png'){
					this.tabType[i].img = '../../../static/img/default@2x.png'
					this.queryParams.orderBy = ''
				}
				this.tabType.map((item, index) => {
					if (index !== i) {
						item.img = '../../../static/img/default@2x.png'
					}
				})
				this.goodsList = []
				this.queryParams.pageNum = 1
				this.tabTypeIndex = i
				this.listType = i
				this.queryParams.isfinish = false
				this.getActGoodsList()
			},
			/* 打开分享弹窗 */
			showShareEvn() {
				if (this.hasLogin) {
					// this.deliveryFlag = true;
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
				uni.showLoading({
					mask: true,
					title: "加载中..."
				})
				this.$http.getShareQrcode({
					"scene": this.myInviteCode,
					"userId": this.$queue.getData('userId'),
					"shareId": this.storeId,
					"path": "sub/stores/store/storeDetail"
			
				}).then(res => {
					uni.hideLoading()
					this.posterData.poster.url = this.$queue.fxBgImg()
					this.posterData.brandImg.url = this.storeDoc.storeLogo || '@/static/img/logo.png'
					this.posterData.name.text = `        ${this.storeInfo.storeName}`
					this.posterData.mainImg.url = this.goodsList[0].goodsIcon
					this.posterData.codeImg.url = res.data
					this.posterData.userImg.url = this.$queue.getJson('userInfo').avatarUrl
					this.posterData.textBg.url = this.$queue.publicCdnHost()+'/assets/imgs/hbTextBg@2x.png'
					this.posterData.userInfo[0].text = `            @${this.userPhone} 为你推荐`
					// this.$forceUpdate(); //强制渲染数据
					setTimeout(() => {
						this.$refs.hchPoster.posterShow()
						this.deliveryFlag = false
					}, 500);
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
			// 获取数字货架商品
			getDigitalShelves() {
				this.$http.pushGoodsList(this.queryParams).then(res => {
					if (res.code == 200) {
						if (res.data.list.length) {
							this.navList.unshift({
								name: '数字货架',
							})
							this.pushGoodsList = res.data
							this.listName = '数字货架'
							this.isloading = 0
							let arrList = this.pushGoodsList.list
							let arr = []
							arrList.map((item, i) => {
								arr.push(item.goods)
							})
							this.goodsList = arr
							this.totalPage = this.pushGoodsList.totalPage
							if (this.pushGoodsList.totalPage == this.queryParams.pageNum || _.size(this
									.pushGoodsList.list) ===
								0) {
								this.queryParams.isfinish = true;
							}
						} else {
							this.switchNavList(this.navList[0], 0)
						}
					}
				})
			},
			getStoreInfoAndFavor() {
				this.$http.getStoreInfoAndFavor({
					storeId: this.storeId
				}).then(res => {
					if (res.code == 200) {
						this.isFavor = res.data.isFavor
						this.favorCount = res.data.favorCount
						this.storeInfo = res.data.storeInfo
						this.storeDoc = res.data.storeDoc
						this.storeDoc.storeBg = res.data.storeDoc.storeBg || `${this.$queue.publicCdnHost()}/assets/imgs/storeBg@2x.png`
						this.storeDoc.storeLogo = res.data.storeDoc.storeLogo || `${this.$queue.publicCdnHost()}/assets/imgs/logo.png`
						if (this.storeInfo.storeRoleCode == 3 || this.storeInfo.storeRoleCode == 5) {
							this.navList.push({
								name: '便利店'
							})
						}
					}
				})
			},
			// 关注当前店铺
			addStore() {
				if (this.hasLogin) {
					let obj = {}
					obj.storeId = this.storeInfo.id
					obj.storeName = this.storeInfo.storeName
					this.$http.addStore(obj).then(res => {
						if (res.code == 200) {
							this.isFavor = true
							this.favorCount++
						} else {
							uni.showToast({
								title: '操作频繁,稍后再试哦!',
								icon: 'none'
							});
						}
					})
					return
				}
				uni.redirectTo({
					url: "/pages/login/login"
				})
				
			},
			//取消关注店铺
			delStore() {
				this.$http.delStore({
					storeId: this.storeId
				}).then(res => {
					if (res.code == 200) {
						this.isFavor = false
						this.favorCount--
					} else {
						uni.showToast({
							title: '操作频繁,稍后再试哦!',
							icon: 'none'
						});
					}
				})
			},
			/* 获取产品列表 */
			async getActGoodsList() {
				if (this.queryParams.isfinish) return;
				this.queryParams.listType = this.listType
				let res = null
				if(this.actCode == 'LZSY_C') {
					res = await this.$http.streetGoodsPageList(this.queryParams);
				}else {
					res = await this.$http.getStoreGoodsList(this.queryParams);
				}
				if (res.code == 200) {
					uni.stopPullDownRefresh();
					uni.hideLoading()
					this.totalPage = res.data.totalPage
					if (res.success) {
						this.isloading = 0
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
				// let res = {}
				// if (index == '数字货架') {
				// 	let rep = await this.$http.pushGoodsList(this.queryParams)
				// 	this.pushGoodsList = rep.data
				// 	uni.stopPullDownRefresh()
				// 	this.isloading = 0
				// 	let arrList = _.concat(this.goodsList, this.pushGoodsList.list);
				// 	let arr = []
				// 	arrList.map((item, i) => {
				// 		arr.push(item.goods)
				// 	})
				// 	this.goodsList = arr
				// 	this.totalPage = this.pushGoodsList.totalPage
				// 	if (this.pushGoodsList.totalPage == this.queryParams.pageNum || _.size(this.pushGoodsList.list) ===
				// 		0) {
				// 		this.queryParams.isfinish = true;
				// 	}
				// } else if (index == '推荐') {
				// 	res = await this.$http.getGoodsRecommend(this.queryParams)
				// } else if (index == '宝贝') {
				// 	res = await this.$http.getGoodsBabys(this.queryParams)
				// } else if (index == '活动') {
				// 	res = await this.$http.getGoodsActivity(this.queryParams)
				// } else if (index == '新品') {
				// 	res = await this.$http.getGoodsNews(this.queryParams)
				// } else if (index == '便利店') {
				// 	uni.navigateTo({
				// 		url: "/sub/stores/store/storeLayout?storeId=" + this.storeId
				// 	});
				// }
				// if (res.code == 200 && index != '数字货架') {
				// 	uni.stopPullDownRefresh()
				// 	this.isloading = 0
				// 	this.goodsList = _.concat(this.goodsList, res.data.list);
				// 	this.goodsList.map((item, i) => {
				// 		if (!item) {
				// 			this.goodsList.splice(i, 1)
				// 		}
				// 	})
				// 	this.totalPage = res.data.totalPage
				// 	if (res.data.totalPage == this.queryParams.pageNum || _.size(res.data.list) === 0) {
				// 		this.queryParams.isfinish = true;
				// 	}
				// }
			},
			// 切换导航列表
			async switchNavList(item, index) {
				this.goodsList = []
				this.isloading = 1
				this.listIndex = index
				this.listName = item.name
				this.queryParams.storeId = this.storeId
				this.totalPage = 0
				this.queryParams.pageNum = 1
				this.getActGoodsList(this.listName)
			},
			// 商品跳转详情
			toGoods(e) {
				if (this.listName == '数字货架') {
					let obj = {}
					this.pushGoodsList.list.map(item => {
						if (item.goodsId == e.id) {
							obj.bsType = item.bsType
							obj.uuid = item.uuid
							obj.storeId = item.cloudStore.storeId
							obj.storeName = item.cloudStore.storeName
						}
					})
					uni.navigateTo({
						url: "/sub/goods/detail/detail?goodsId=" + e.id + '&bsType=' + obj.bsType + '&uuid=' + obj
							.uuid
					});
				} else {
					uni.navigateTo({
						url: "/sub/goods/detail/detail?goodsId=" + e.id
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	$base: #EB6133;

	.active {
		color: #eb6132 !important;
		font-weight: 500 !important;
	}

	.apply {
		.top {
			width: 100%;
			height: 328rpx;
			position: sticky;
			z-index: 998;
			top: 0upx;
		}
		.store-bg {
			width: 750upx;
			height: 338upx;
			position: absolute;
			// background: url("https://lz.static.seprain.com/images/bb7587e748b35135140706335f3da2c2-3a51r5to6r.png") no-repeat;
			background-size: 100% 100%;
			box-sizing: border-box;
			// width: 100%;
			top: 0;
			z-index: 998;
			-webkit-filter: blur(4rpx);
			filter: blur(4rpx) brightness(70%); // 模糊半径和变暗
			transform: scale(1.001); // 控制边缘是否模糊，小于1的话边缘会模糊
			image {
				width: 750upx;
				height: 338upx;
			}
		}
		.searchNav {
			display: flex;
			align-items: center;
			.black {
				width: 80upx;
				padding-left: 24upx;
				.black-icon {
					width: 32upx;
					height: 32upx;
					z-index: 1000;
					// margin-left: 24upx;
				}
			}
		}

		.store_top {
			height: 180upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			position: sticky;
			z-index: 1000;
			top: 0upx;
			padding: 0 24upx 24upx;


			.left {
				display: flex;
				align-items: center;

				.store_name_favor {
					margin-left: 20upx;

					.store_name {
						max-width: 270upx;
						height: 44rpx;
						font-size: 32rpx;
						font-weight: 700;
						line-height: 44rpx;
						color: #fff;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						// text-align: justify;
						overflow: hidden;
					}

					.store_favor {
						font-size: 24rpx;
						color: #fff;
						font-weight: 300;
						margin: 8rpx 0;
					}
				}
			}

			.storeImg {
				width: 112rpx;
				height: 112rpx;
				border-radius: 50%;
				// margin-left: 28rpx;
			}

			.right {
				display: flex;
				align-items: center;

				.store_but {
					width: 136rpx;
					height: 56rpx;
					line-height: 56rpx;
					border-radius: 309px;
					// border: 2rpx solid #F2F2F2;
					text-align: center;
					font-size: 26rpx;

					.store_favor_icon {
						color: $base;
						width: 24rpx;
						height: 20rpx;
						margin-right: 14rpx;
					}
				}

				.fx {
					width: 136rpx;
					height: 56rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 22upx;
					color: #fff;
					background: linear-gradient(143deg, #F32A2A 0%, #FF6B3A 100%);
					opacity: 1;
					border-radius: 309px;
					margin-left: 16upx;

					image {
						width: 24upx;
						height: 24upx;
						margin-right: 8upx;
					}
				}
			}

			.favor {
				// margin-right: 28rpx;
				background: #fff;
				color: #FA3B1C;
			}

			.favor1 {
				background: #F2F2F2;
				color: #666666;
			}
		}

		.store-image {
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

		.act-head {
			margin: 32upx 24upx 28upx;
			background-color: #fff;
			border-radius: 16upx;

			&-item {
				height: 220upx;
				display: flex;
				padding: 24upx;

				.image {
					image {
						width: 220upx;
						height: 220upx;
						border-radius: 8upx;
					}
				}

				.text {
					margin: 8upx 0upx 0upx 32upx;
					width: 410upx;
					position: relative;

					&-title {
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						font-size: 28upx;
						font-weight: 700;
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
						// position: absolute;
						// bottom: 0upx;
						margin-top: 56upx;
						font-weight: 700;

						.presents {
							font-size: 30upx;
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
		
		.topTabBar {
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			font-size: 28upx;
			color: #333;
			padding: 24upx;
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
		
		.vipPrice {
			height: 32upx;
			color: #FA3B1C;
			border-radius: 8upx;

			.vip {
				width: 82upx;
				height: 32upx;
				display: inline-block;
				line-height: 32upx;
				border-top: 1upx solid #FA3B1C;
				border-left: 1upx solid #FA3B1C;
				border-bottom: 1upx solid #FA3B1C;
				font-size: 22upx;
				background: #FFEEEB;
				text-align: center;
				border-radius: 8upx 0 0 8upx;
			}

			.vipPriceItem {
				height: 32upx;
				display: inline-block;
				line-height: 32upx;
				border-top: 1upx solid #FA3B1C;
				border-right: 1upx solid #FA3B1C;
				border-bottom: 1upx solid #FA3B1C;
				font-size: 22upx;
				background: #fff;
				text-align: center;
				border-radius: 0 8upx 8upx 0;
				padding: 0 8upx;
				margin-top: 6upx;
			}
		}

		.store-list {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			padding-left: 24upx;
			padding-right: 24upx;
			margin-top: 24upx;

			.store-item {
				width: 48.5%;
				border-radius: 20upx;
				background-color: #fff;
				margin: 0 0 25upx 0;
				box-shadow: 0upx 5upx 25upx rgba(0, 0, 0, 0.1);
				padding-bottom: 28upx;

				image {
					height: 350upx;
					width: 100%;
					border-radius: 20upx 20upx 0 0;
				}

				.name {
					// width: auto;
					// // padding: 10upx 4% 0;
					// display: -webkit-box;
					// -webkit-box-orient: vertical;
					// -webkit-line-clamp: 2;
					// text-align: justify;
					// overflow: hidden;
					// font-size: 28upx;
					// line-height: 38upx;
					// margin: 10upx;
					// font-weight: 700;
					
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					font-size: 28upx;
					font-weight: 700;
					color: #333333;
					margin: 0 8upx;
				}

				.cateName {
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					text-align: justify;
					overflow: hidden;
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
					padding: 0 4%;

					.price {
						color: $uni-color-main;
						font-size: 28upx;
						font-weight: 700;
						white-space: normal;
					}
				}
			}
		}
	}
</style>
