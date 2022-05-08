<template>
	<view>
		<view class="status" :style="{ opacity: afterHeaderOpacity }"></view>
		<view class="header">
			<!-- 头部-默认显示 -->
			<view class="before" :style="{ opacity: 1 - afterHeaderOpacity, zIndex: beforeHeaderzIndex }">
				<view class="middle"></view>
			</view>
			<!-- 头部-滚动渐变显示 -->
			<view class="after" :style="{ opacity: afterHeaderOpacity, zIndex: afterHeaderzIndex }">
				<view class="middle">
					<view v-for="(anchor, index) in anchorlist" :class="[selectAnchor == index ? 'on' : '']"
						:key="index" @tap="toAnchor(index)">{{ anchor.name }}</view>
				</view>
			</view>
		</view>
		<!-- 商品主图轮播 -->
		<view class="swiper-box">
			<swiper circular="true" autoplay="true" @change="swiperChange">
				<swiper-item v-for="swiper in swiperList" :key="swiper.id">
					<image :src="swiper"></image>
				</swiper-item>
			</swiper>
			<view class="indicator">{{ currentSwiper + 1 }}/{{ swiperList.length }}</view>
			<!-- <view class="keep"  @click.stop="handleKeep">
				<view class="icon" :class="isKeep ? 'text-main cuIcon-favorfill' : 'text-gray cuIcon-favor'"></view>
			</view> -->
		</view>
		<!-- 标题 -->
		<view class="main-wrap margin-top-sm" v-if="goodsData">
			<view class="main-wrap-box goods-info">
				<view class="price-cell">
					<view class="left">
						<text class="text-main">当前价：</text>
						<view class="price text-price">
							<text>{{ goodsData.salePrice }}
								<template v-if="goodsData.integral > 0">
									<text class="text-xs">{{ goodsData.integralType | filterIntegralType }}</text>
									<text style="font-size: 22rpx;">{{ goodsData.integral }}</text>
									<text class="text-xs">{{$queue.getIntegralName()}}</text>
								</template>
							</text>
						</view>
						<view class="vipPrice">
							<text>会员价</text>
							<text class="presents text-price fw">
								{{ goodsData.vipPrice }}
								<template v-if="goodsData.integral > 0">
									<text class="text-xs">{{ goodsData.integralType | filterIntegralType }}</text>
									<text style="font-size: 22rpx;">{{ goodsData.integral }}</text>
									<text class="text-xs">{{$queue.getIntegralName()}}</text>
								</template>
							</text>
						</view>
						<view class="marketPrice text-price text-sm line-thr text-price text-gray margin-left-xs">
							<text>{{ goodsData.marketPrice }}</text>
						</view>
					</view>
					<view class="right">
						<view class="active" @click.stop="handleKeep">
							<view class="" style="margin-bottom: 10rpx;">
								<image style="width: 39rpx; height: 37rpx;"
									:src="isKeep ? collecticon[1] : collecticon[0]" mode="">
								</image>
							</view>
							<text>{{ isKeep ? '已收藏' : '收藏' }}</text>
						</view>
					</view>
				</view>
				<view class="title">{{ goodsData.goodsName }}</view>
			</view>
			<view class="goodstitle">
				{{ goodsData.goodsTitle }}
			</view>
			<!-- 库存相关信息 -->
			<view class="qty">
				<view class="bottom-num">
					<text>已售： {{ goodsData.salesVolume }}件</text>
				</view>
				<view class="vertical-bar"></view>
				<view class="bottom-num">
					<text>剩余： {{ goodsData.stockQty }}件</text>
				</view>
				<view class="vertical-bar"></view>
				<view class="sharebut" @click="showShareEvn">
					<image src="../../../static/img/fx_e@2x.png" mode=""></image>
					<text>分享</text>
				</view>
			</view>
		</view>
		<!-- 店铺信息 -->
		<view class="main-wrap margin-top-sm storeInfo" @click="goStore">
			<view class="top">
				<view class="left">
					<image class="img" :src="goodsData.gooStreetStore.storeLogo" mode=""></image>
					<text class="storeName">{{ goodsData.gooStreetStore.storeName }}</text>
					<text class="distance" v-if="goodsData.distance"> 距您 {{ distance }}km</text>
				</view>
				<view class="right">
					<image src="../../../static/img/icon_enter@2x.png" mode=""></image>
				</view>
			</view>
			<view class="bottom">
				<image class="img" src="../../../static/img/location_back@2x.png" mode=""></image>
				<view class="address">{{ goodsData.address }}</view>
			</view>
		</view>
		<!-- 套餐信息 -->
		<view class="main-wrap margin-top-sm storeInfo">
			<view class="package-title">套餐详情</view>
			<view v-for="(data, index) in specification" :key="index">

				<view class="package-name">{{ data.name }}</view>
				<view class="package-details" v-for="(v, i) in data.item" :key="i">
					<view class="left">
						<view class="dian"></view>
						<view class="num">{{v.detail}} ({{v.num}}) 份</view>
					</view>
					<view class="price">{{ `¥ ${v.price}` }}</view>
				</view>
			</view>
		</view>
		<!-- 注意事项 -->
		<view class="main-wrap margin-top-sm storeInfo">
			<view class="package-title">注意事项</view>
			<view class="package-name">使用时间</view>
			<view class="package-details">
				<view class="left">
					<view class="dian"></view>
					<view class="p">{{goodsData.useTime}}</view>
				</view>
			</view>
			<view class="package-name">使用须知</view>
			<view class="package-details">
				<view class="left">
					<view class="dian"></view>
					<view class="p">不提供发票，不支持退款</view>
				</view>
			</view>
			<view class="package-name">其它须知</view>
			<view class="package-details">
				<view class="left">
					<view class="dian"></view>
					<view class="p" v-if="goodsData.purchaseNotice">{{ goodsData.purchaseNotice}}</view>
					<view class="p" v-else>无</view>
				</view>
			</view>
		</view>
		<view class="cu-bar tabbar"></view>
		<!-- 底部菜单 -->
		<view class="cu-bar bg-white tabbar border shop foot mt-5" style="justify-content: left;">
			<view class="active">
				<view class="price text-price ">
					<text v-if="vipStatus == 1">{{ goodsData.vipPrice }}</text>
					<text v-else>{{ goodsData.vipPrice }}</text>
					<template v-if="goodsData.integral > 0">
						<text class="text-xs">{{ goodsData.integralType | filterIntegralType }}</text>
						<text style="font-size: 22rpx;">{{ goodsData.integral }}</text>
						<text class="text-xs">{{$queue.getIntegralName()}}</text>
					</template>
				</view>
				<view class="active-bottom">
					<text class="marketPrice">店内价</text>
					<view class="marketPrice text-price">
						<text>{{ goodsData.marketPrice }}</text>
					</view>
				</view>
			</view>
			<view class="btn-group" style="justify-content: flex-end;">
				<!-- <button class="cu-btn bg-main round shadow-blur" @tap="showSpec('cart')">加入购物车</button> -->
				<button class="cu-btn store-bg-main round shadow-blur" @click="goStore">进店逛逛</button>
				<button class="cu-btn bg-main round shadow-blur ml-8"  @click.stop="goShopping()">立即购买</button>
			</view>
		</view>
		<!-- 服务-模态层弹窗 -->
		<view class="cu-modal bottom-modal" :class="serviceClass">
			<view class="cu-dialog goods-service">
				<view class="cu-bar bg-white justify-end">
					<view class="action text-xl text-bold text-gray margin-right" @tap="hideService"><text
							class="cuIcon-close"></text></view>
				</view>
				<view class="bg-white goods-service-box">
					<view class="content">
						<view class="row" v-for="(item, index) in goodsData.service" :key="index">
							<view class="title">{{ item.name }}</view>
							<view class="description">{{ item.description }}</view>
						</view>
					</view>
					<view class="bottom">
						<view class="btn" @tap="hideService">完成</view>
					</view>
				</view>
			</view>
		</view>
		<hchPoster ref="hchPoster" @cancel="handleCancel" :posterData.sync="posterData" />
	</view>
</template>

<script>
	import {
		formatMoney
	} from '@/common/utils/MoneyUtils.js';
	import bmap from '@/common/SDK/bmap-wx.js';
	import hchPoster from '../../../components/hch-poster/hch-poster2.vue';
	// import mpHtml from '../../goods/components/mp-html/mp-html'
	import uniCountdown from '../../../components/uni-countdown/uni-countdown.vue'
	export default {
		components: {
			hchPoster,
			// mpHtml,
			uniCountdown
		},
		data() {
			return {
				specification: [],
				isloading: 1,
				vipStatus: null,
				goodsId: null,
				//控制渐变标题栏的参数
				beforeHeaderzIndex: 11, //层级
				afterHeaderzIndex: 10, //层级
				beforeHeaderOpacity: 1, //不透明度
				afterHeaderOpacity: 0, //不透明度
				swiperList: [], //轮播主图数据
				currentSwiper: 0, //轮播图下标
				anchorlist: [{
						name: '主图',
						top: 0
					},
					// {
					// 	name: '评价',
					// 	top: 0
					// }, 
					{
						name: '详情',
						top: 0
					}
				], //导航条锚点
				specifications: '选择/规格', // 规格
				selectAnchor: 0, //选中锚点
				serviceClass: '', //服务弹窗css类，控制开关动画
				specClass: '', //规格弹窗css类，控制开关动画
				shareClass: '', //分享弹窗css类，控制开关动画
				goodsData: {}, // 商品信息
				selectSpec: 0, //选中规格
				isKeep: false, //收藏
				descriptionStr: '', //商品描述html
				cartNum: 0, // 购物车数量
				buylist: [], // 当前成功加入购物车返回的对象
				deliveryFlag: false,
				canvasFlag: true,
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
				amount: 0, //当前库存数量
				storeId: '',
				collecticon: ['../../../static/img/iconcollect_nor.png', '../../../static/img/iconcollect_yes.png'],
				actCode: '',
				quota: 0,
				userStoreShow: false,
				storeObj: {},
				userInvitationCode: '',
				getuuids: '',
				giftvouchers: false,
				giftNumber: 0,
				opengift: false,
				bsType: '',
				scene: false,
				options: null,
				flag: '', // 点击购物车或立即购买按钮标识符
				distance: 0,
				userLocation: null, //用户当前定位坐标
			};
		},

		onLoad(options) {
			console.log('option', options)
			this.options = options

		},
		onShow() {
			this.vipStatus = this.$queue.getData("vipStatus") || 0
			// console.log(this.vipStatus)
			// uni.showLoading({
			// 	title: '加载中...'
			// });
			if (this.options.scene) {
				this.goodsId = this.shareId
			} else {
				this.goodsId = this.options.goodsId
			}
			this.getGoodsBase()
			this.getDistance()
			this.hideSpec()
		},
		onUnload() {
			this.$queue.remove("bsType");
			this.$queue.remove("saleStoreId");
			this.$queue.remove("saleStoreName");
		},
		onPageScroll(e) {
			if (_.size(this.anchorlist) <= 0) return false;
			//锚点切换
			this.selectAnchor = e.scrollTop >= this.anchorlist[1].top ? 1 : 0;
			//导航栏渐变
			let tmpY = 375;
			e.scrollTop = e.scrollTop > tmpY ? 375 : e.scrollTop;
			this.afterHeaderOpacity = e.scrollTop * (1 / tmpY);
			this.beforeHeaderOpacity = 1 - this.afterHeaderOpacity;
			//切换层级
			this.beforeHeaderzIndex = e.scrollTop > 0 ? 10 : 11;
			this.afterHeaderzIndex = e.scrollTop > 0 ? 11 : 10;
		},
		methods: {
			formatMoney,
			/* 获取购物车列表 */
			async getCartList() {
				if (this.hasLogin) {
					const result = await this.$http.getShoppingCartList();
					if (result.success) {
						this.cartNum = result.data.total;
					}
				}
			},
			no() {
				// 什么事也不干 方法勿删
			},
			// 获取用户距离店铺的距离数 
			getDistance() {
				if(this.$queue.getJson("userLocation")) {
					this.userLocation = this.$queue.getJson("userLocation")
					this.getGoodsBase()
				}else {
					this.getLocation()
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
								that.userLocation = data.originalData.result.location
								this.getGoodsBase()
							}
						});
					},
					fail() {
						// that.$queue.showToast('获取定位失败')
					}
				});
			},
			
			toPage(url) {
				uni.navigateTo({
					url: url
				});
			},
			// 立即购买
			goShopping() {
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login'
					});
					return false;
				}
				
				if (this.goodsData.stockQty === 0) return this.$queue.showToast("该商品剩余0件，无法订购");
				this.toConfirmation();
			},
			/* 跳转确认订单页面 */
			toConfirmation() {
				let goods = _.assign({}, this.goodsData);
				this.$queue.setJson("buy_goods", goods);
				uni.navigateTo({
					url: '/sub/street/confirmation/confirmation?actCode=LZSY_C001'
				});
			},
			// 扫码解析uuid
			async getuuid() {
				console.log(4444, this.bsType)
				// console res;
				let res = {}
				if (this.bsType == 'BS_A010' || this.scene) {
					// 数字货架
					res = await this.$http.cloudStoreGetGoodsByUuid({
						uuid: this.getuuids
					})
				} else if (this.bsType == 'BS_A013') {
					// 礼券妈妈
					res = await this.$http.giftMotherGetGoodsByUuid({
						uuid: this.getuuids
					})
				}
				if (res.code == 200) {
					uni.hideLoading()
					this.bsType = res.data.bsType
					this.$queue.setData('bsType', res.data.bsType)
					this.$queue.setData('saleStoreId', res.data.storeId)
					this.$queue.setData('saleStoreName', res.data.storeName)
					this.goodsId = res.data.goodsId
					this.getGoodsBase()
				} else {
					this.$queue.showToast(res.message);
					setTimeout(function() {
						uni.switchTab({
							url: '../../../pages/exchange/exchange'
						})
					}, 2000)
				}
			},
			// 获取商品基础信息
			getGoodsBase() {
				this.$http.streetGoodsDetail({
					goodsId: this.goodsId,
					longitude: this.userLocation ? this.userLocation.lng : '',
					latitude: this.userLocation ? this.userLocation.lat : ''
				}).then(res => {
					if (res.code == 200) {
						console.log(res.code)
						// 配置分享	
						this.share.path = "/sub/street/streetGoodsDetails/streetGoodsDetails?goodsId=" + res.data.id + '&uuid=' + this
							.getuuids + '&bsType=' + this.bsType
						this.share.imageUrl = res.data.goodsIcon;
						this.share.title = res.data.goodsName;
						this.share.desc = res.data.goodsTitle;
						this.goodsData = res.data;
						this.goodsId = res.data.id;
						this.storeId = res.data.storeId
						this.actCode = res.data.actCode
						this.getFaverGoodsIsKeep(this.goodsId);
						this.swiperList = res.data.goodsBanner.split(";");
						this.specification = JSON.parse(res.data.specification)
						this.goodsData.address = res.data.gooStreetStore.area1Name + res.data.gooStreetStore.area2Name + res.data.gooStreetStore.area3Name 
								+ res.data.gooStreetStore.area4Name + res.data.gooStreetStore.storeAddress
						this.distance = res.data.distance ? this.$queue.fomatFloat(res.data.distance / 1000, 1) : ''
						// this.getCartList();
						// if (this.$queue.getData('saleStoreId') == this.$queue.getData('userStoreId')) {
						// 	this.userStoreShow = true
						// 	this.getGoodsIncomeConfig(this.bsType)
						// }
					}
				})
			},
			// 查询商品奖励配置
			getGoodsIncomeConfig(v) {
				if (v != 'BS_A013') {
					this.$http.getGoodsIncomeConfig({
						goodsId: this.goodsId,
						storeId: this.$queue.getData('userStoreId')
					}).then(res => {
						if (res.code == 200 && res.data != null) {
							let obj = JSON.parse(res.data.config)
							this.storeObj = {
								storeAmount: obj.storeAmount,
								storeIncome: obj.storeIncome * 100
							}
						}
					})
				} else {
					this.$http.getincomeGiftMother({
						goodsId: this.goodsId,
						storeId: this.$queue.getData('userStoreId')
					}).then(res => {
						if (res.code == 200 && res.data != null) {
							let obj = JSON.parse(res.data.config)
							console.log(9999, obj)
							if (obj.S.type == 1) {
								// 百分比  金额自己算
								this.storeObj = {
									storeAmount: (this.goodsData.base.salePrice * obj.S.amount).toFixed(2),
									storeIncome: obj.S.amount * 100
								}
							} else if (obj.S.type == 2) {
								// 固定金额,  百分比 100
								this.storeObj = {
									storeAmount: obj.S.amount,
									storeIncome: 100
								}
							}
						}
					})
				}
			},
			/* 获取商品是否收藏 */
			async getFaverGoodsIsKeep(goodsId) {
				if (this.hasLogin) {
					const {
						data
					} = await this.$http.getFaverGoodsIsKeep({
						goodsId
					});
					this.isKeep = data;
				}
			},
			//预览图片，放大预览
			preview(event) {
				let that = this
				let currentUrl = event
				wx.previewImage({
					current: currentUrl, // 当前显示图片的http链接
					urls: that.descriptionStr // 需要预览的图片http链接列表
				})
			},
			/* 获取商品详情 */
			async getGoodsDetail(goodsId) {
				uni.showLoading({
					title: '加载中...'
				});
				const res = await this.$http.getGoodsDetail({
					goodsId
				});
				uni.hideLoading();
				if (!res.success) return this.$queue.showToast("获取接口异常,请重新加载");
				const _data = res.data;
				// 商品详情信息
				this.goodsData.info = res.data;
				// 轮播图
				this.swiperList = res.data.bannerImg.split(";");
				// 商品详情
				this.descriptionStr = _data.detailImg.split(',');
				// 商品数量
				this.$set(this.goodsData, 'number', 1);
				// 服务
				this.goodsData.service = [{
						name: '正品保证',
						description: '此商品官方保证为正品'
					},
					{
						name: '极速退款',
						description: '此商品享受退货极速退款服务'
					},
					{
						name: '7天退换',
						description: '此商品享受7天无理由退换服务'
					}
				];
				// 规格
				this.getGoodsSkuList(goodsId);
				// 评论
				// this.goodsData.comment = _data.comments;
				//计算锚点高度，页面数据是ajax加载时，请把此行放在数据渲染完成事件中执行以保证高度计算正确
				this.calcAnchor();
			},
			/* 获取商品sku列表 */
			async getGoodsSkuList(goodsId) {
				const res = await this.$http.getGoodsSkuList({
					goodsId
				});
				if (res.success) {
					this.isloading = 0
					this.goodsData.sepcList = res.data;
					this.quota = this.goodsData.sepcList[0].quota
				}
			},
			/* 轮播图指示器 */
			swiperChange(event) {
				this.currentSwiper = event.detail.current;
			},
			/* 店铺按钮 */
			goStore() {
				if (!this.hasLogin) {
					uni.navigateTo({
						url: "/pages/login/login"
					})
					return 
				}
				uni.navigateTo({
					url: "/sub/stores/store/storeDetail?storeId=" + this.storeId + "&actCode=LZSY_C"
				});
			},
			/* 收藏按钮操作 */
			handleKeep() {
				if (!this.hasLogin) {
					uni.navigateTo({
						url: "/pages/login/login"
					});
					return false;
				}
				if (this.isKeep) {
					// 取消收藏
					this.$http
						.delFaverGoods({
							workId: this.goodsId
						})
						.then(res => {
							if (res.success) {
								this.isKeep = this.isKeep ? false : true;
								this.$queue.showToast("已取消收藏~");
							} else {
								this.$queue.showToast(res.message);
							}
						});
				} else {
					this.$http
						.addFaverGoods({
							goodsId: this.goodsId,
							goodsName: this.goodsData.base.goodsName,
							goodsIcon: this.goodsData.base.goodsIcon,
							salePrice: this.goodsData.base.salePrice,
							marketPrice: this.goodsData.base.marketPrice,
							integral: this.goodsData.base.integral,
							integralType: this.goodsData.base.integralType,
							saleUuid: this.getuuids,
							bsType: this.$queue.getData('bsType'),
						})
						.then(res => {
							if (res.success) {
								this.isKeep = this.isKeep ? false : true;
								this.$queue.showToast("添加收藏成功~");
							} else {
								this.$queue.showToast(res.message);
							}
						});
				}
			},
			// 获取几张可用礼券
			getusegiftNum() {
				this.$http.getGiftUse({
					type: 0
				}).then(res => {
					if (res.code == 200) {
						let num = 0
						res.data.list.map(item => {
							if (item.isActivate == 1) {
								num += 1
							}
						})
						this.giftNumber = num
					}
				})
			},
			// 判断是否开通礼券
			getOpengift() {
				this.$http.getIsBuyGift().then(res => {
					if (res.code == 200) {
						this.opengift = res.data
					}
				})
			},
			// 购买礼包
			buggiftbag() {
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login'
					});
					return false;
				}
				if (this.opengift) return
				uni.navigateTo({
					url: '../../giftbag/topup/topup?page=detai'
				})
			},
			/* 立即购买 或添加购物车确认按钮操作 */
			handleBuy() {
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login'
					});
					return false;
				}
				if (!this.isPositiveInteger(this.goodsData.number)) return this.$queue.showToast("请填写正确的数量");
				if (this.goodsData.number > this.amount || this.goodsData.number > this.quota) return this.$queue
					.showToast("购买数量大于商品数量，无法订购");
				if (this.amount === 0) return this.$queue.showToast("该商品剩余0件，无法订购");
				if (this.goodsData.number == 0) return this.$queue.showToast("购买数量为0件");
				if (this.flag == 'immediately') {
					// 立即购买
					this.toConfirmation();
				}
				if (this.flag == 'cart') {
					// 添加购物车
					this.handleAddCart()
				}
			},
			isPositiveInteger(s) { //是否为正整数
				var reg = /^[1-9]+\d*$/;
				return reg.test(s)
			},
			/* 添加购物车 */
			handleAddCart() {
				const sku = this.goodsData.sepcList[this.selectSpec];
				this.$http.addShoppingCart({
					storeId: this.goodsData.base.storeId,
					storeName: this.goodsData.base.storeName,
					marketPrice: sku.marketPrice,
					goodsIcon: this.goodsData.base.goodsIcon,
					bsType: 'BS_A001',
					goodsStatus: this.goodsData.base.status,
					vipPrice: sku.vipPrice,
					postage: this.goodsData.base.postage,
					goodsId: sku.goodsId,
					goodsName: sku.goodsName,
					goodsNum: this.goodsData.number,
					salePrice: sku.salePrice,
					settlePrice: sku.settlePrice,
					integral: sku.integral,
					integralType: sku.integralType,
					skuId: sku.id,
					skuName: sku.skuName,
					skuIcon: sku.skuImg,
					stock: sku.amount,
					quota: sku.quota,
					userId: this.$queue.getData('userId')
				}).then(res => {
					if (res.success) {
						this.getCartList();
						return this.$queue.showToast("添加购物车成功~")
					}
					return this.$queue.showToast(res.message)
				}).catch(err => {
					return this.$queue.showToast(err.message)
				})
				this.hideSpec();
			},
			/* 商品评论 */
			toRatings() {
				uni.navigateTo({
					url: '/sub/goods/ratings/ratings'
				});
			},
			/* 跳转确认订单页面 */
			// toConfirmation() {
			// 	let goods = _.assign({}, this.goodsData);
			// 	goods.sku = goods.sepcList[this.selectSpec]
			// 	this.$queue.setJson("buy_goods", goods);
			// 	uni.navigateTo({
			// 		url: '/sub/orders/confirmation/confirmation?actCode=' + this.actCode + '&giftNumber=' + this
			// 			.giftNumber
			// 	});
			// },
			/* 选择规格操作 */
			setSelectSpec(item, index) {
				this.specifications = item.skuName
				this.selectSpec = index;
				this.amount = this.goodsData.sepcList[index].amount
				this.quota = this.goodsData.sepcList[index].quota
				if (this.goodsData.number > this.quota) {
					this.goodsData.number = this.quota
				}
			},
			/* 减少数量 */
			handleSubNumber() {
				if (this.goodsData.number <= 1) {
					return;
				}
				this.goodsData.number--;
			},
			/* 增加数量 */
			handleAddNumber() {
				if (this.goodsData.number >= this.quota) {
					return
				}
				if (this.goodsData.number >= this.goodsData.sepcList[this.selectSpec].amount) {
					return
				}
				this.goodsData.number++;
			},
			/* 跳转锚点 */
			toAnchor(index) {
				this.selectAnchor = index;
				uni.pageScrollTo({
					scrollTop: this.anchorlist[index].top,
					duration: 200
				});
			},
			/* 计算锚点高度 */
			calcAnchor() {
				let commentsView = uni.createSelectorQuery().select('#comments');
				commentsView
					.boundingClientRect(data => {
						if (data) {
							let statusbarHeight = 0;
							//APP内还要计算状态栏高度
							// #ifdef APP-PLUS
							statusbarHeight = plus.navigator.getStatusbarHeight();
							// #endif
							let headerHeight = uni.upx2px(100);
							this.anchorlist[1].top = data.top - headerHeight - statusbarHeight;
							this.anchorlist[2].top = data.bottom - headerHeight - statusbarHeight;
						}
					})
					.exec();
			},
			/* 打开服务弹窗 */
			showService() {
				this.serviceClass = 'show';
			},
			/* 关闭服务弹窗 */
			hideService() {
				this.serviceClass = 'hide';
				setTimeout(() => {
					this.serviceClass = 'none';
				}, 200);
			},
			/* 打开规格弹窗 */
			showSpec(fun) {
				if (fun == 'immediately') {
					this.flag = 'immediately'
				}
				if (fun == 'cart') {
					this.flag = 'cart'
				}
				this.specClass = 'show';
				this.amount = this.goodsData.sepcList[0].amount
			},
			/* 关闭规格弹窗 */
			hideSpec() {
				// this.goodsData.number = this.quota
				this.specClass = 'hide';
				setTimeout(() => {
					this.specClass = 'none';
				}, 200);
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
				console.log(this.goodsData)
				uni.showLoading({
					mask: true,
					title: "加载中..."
				})
				this.$http.getShareQrcode({
					"scene": this.myInviteCode,
					"userId": this.$queue.getData('userId'),
					"shareId": this.goodsId,
					"path": "sub/goods/detail/detail" // sub/stores/store/storeDetail
				}).then(res => {
					uni.hideLoading()
					this.posterData.poster.url = this.$queue.fxBgImg()
					this.posterData.brandImg.url = this.goodsData.gooStreetStore.storeLogo
					this.posterData.name.text = `        ${this.goodsData.goodsName}`
					this.posterData.mainImg.url = this.share.imageUrl //'./static/img/vip@2x.png'
					this.posterData.codeImg.url = res.data
					this.posterData.userImg.url = this.$queue.getJson('userInfo').avatarUrl
					this.posterData.textBg.url = this.$queue.publicCdnHost() + '/assets/imgs/hbTextBg@2x.png'
					this.posterData.userInfo[0].text = `            @${this.userPhone} 为你推荐`
					this.$forceUpdate(); //强制渲染数据
					setTimeout(() => {
						this.$refs.hchPoster.posterShow()
						this.deliveryFlag = false
					}, 500);
				})
			},


			/* 跳转到购物车 */
			toCart() {
				uni.switchTab({
					url: "/pages/cart/cart"
				})
			}
		}
	};
</script>

<style lang="scss">
	@import '@/sub/goods/static/css/goods.scss';

	.active {
		font-size: 22upx;
		position: relative;
		text-align: left;
		padding: 0;
		display: block;
		height: auto;
		line-height: 1;
		margin: 0;
		background-color: inherit;
		overflow: initial;
		margin-left: 52upx;
		
		.price {
			font-size: 36upx;
			color: #FA3B1C;
		}
		.active-bottom {
			display: flex;
			align-items: flex-end;
			font-size: 20upx;
			margin-top: 4upx;
		}
		
	}

	.active:first-child {
		margin-left: 24upx;
	}

	.active::after {
		border: 0;
	}

	.store-bg-main {
		background: linear-gradient(90deg, #F37A2A 0%, #FFB03A 100%);
		color: #fff;
	}

	.price-cell {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.left {
			display: flex;
			align-items: flex-end;
			
			.vipPrice {
				height: 40upx;
				font-size: 26upx;
				color: #fff;
				background: $uni-bg-color-main;
				border-radius: 160upx;
				line-height: 40upx;
				text-align: center;
				padding: 0 8upx;
			}
			
			.marketPrice {
				font-size: 26upx;
				color: #999;
			}
		}
	}

	.goods-info .title {
		margin-right: 0
	}

	.qty {
		display: flex;
		align-items: center;
		justify-content: space-around;
		font-size: 24upx;
		color: #666;
		padding-bottom: 24upx;

		.bottom-num {
			font-size: 24upx;
			color: #666;
		}

		.vertical-bar {
			width: 2upx;
			height: 28upx;
			background: #EEEEEE;
			opacity: 1;
		}

		.sharebut {
			display: felx;
			align-items: center;

			image {
				width: 28upx;
				height: 28upx;
				margin-right: 8upx;
			}
		}
	}
// .position {
// 	height: 110upx;
// }
@import '@/static/css/street.scss';
</style>
