<template>
	<view v-if="isloading == 0">
		<!-- 商品主图轮播 -->
		<view class="swiper-box">
			<swiper circular="true" autoplay="true" @change="swiperChange">
				<swiper-item v-for="swiper in swiperList" :key="swiper.id">
					<image :src="swiper"></image>
				</swiper-item>
			</swiper>
			<view class="indicator">{{ currentSwiper + 1 }}/{{ swiperList.length }}</view>
		</view>
		<!-- 标题 -->
		<view class="goods bg-white" v-if="goodsData.base">
			<view class="goods-info">
				<view class="price text-price">
					<text>{{ goodsData.base.salePrice }}</text>
					<template v-if="goodsData.base.integral > 0">
						<text class="text-xs">{{ goodsData.base.integralType | filterIntegralType }}</text>
						<text>{{ goodsData.base.integral }}</text>
						<text class="text-xs">{{$queue.getIntegralName()}}</text>
					</template>
					<text class="text-price line-thr margin-left-xs text-sm">{{ goodsData.base.marketPrice }}</text>
				</view>
				<view class="title">{{ goodsData.base.goodsName }}</view>
				<view class="sharebut">
					<button class="button" open-type='share'>
						<image src="../static/img/shareicon.png" mode=""></image>
						<!-- <view>分享</view> -->
					</button>
				</view>
			</view>
			<view class="goodstitle">
				{{ goodsData.base.goodsTitle }}
			</view>
		</view>
		<!-- 详情 -->
		<view class="description">
			<view class="cu-bar bg-white">
				<view class="action">
					<text class="cuIcon-titles text-main"></text>
					<text>图文详情</text>
				</view>
			</view>
			<view class="content">
				<!-- <mp-html :content="descriptionStr" /> -->
				<image v-for="item in  descriptionStr" :key="item" style="width: 100%;display:block;" :src="item"
					mode="widthFix" @tap="preview(item)"></image>
			</view>
		</view>
		<!-- 底部菜单 -->
		<view class="cu-bar bg-white tabbar border shop foot" style="justify-content: left;">
			<view class="action" @click="toCart">
				<view class="cuIcon-cart">
					<view class="cu-tag badge" v-if="cartNum > 0">{{cartNum}}</view>
				</view>
				<text>购物车</text>
			</view>
			<view class="btn-group" style="justify-content: flex-end;">
				<button class="cu-btn bg-orange round shadow-blur margin-right" @tap="showSpec('cart')">加入购物车</button>
				<button class="cu-btn bg-main round shadow-blur" @tap="showSpec('immediately')">立即购买</button>
			</view>
		</view>

		<!-- 规格-模态层弹窗 -->
		<view class="cu-modal bottom-modal" :class="specClass" @tap.stop="hideSpec">
			<view class="cu-dialog goods-spec" @tap.stop="no">
				<view class="cu-bar bg-white justify-end">
					<view class="action text-xl text-bold text-gray margin-right" @tap.stop="hideSpec"><text
							class="cuIcon-close"></text></view>
				</view>
				<view class="bg-white goods-spec-box">
					<view class="top" v-if="goodsData.sepcList">
						<view class="top-left">
							<image class="skuImg" :src="goodsData.sepcList[selectSpec].skuImg"></image>
						</view>
						<view class="top-right">
							<view class="text-price text-main">
								<text>{{goodsData.sepcList[selectSpec].salePrice}}</text>
								<template v-if="goodsData.sepcList[selectSpec].integral > 0">
									<text
										class="text-xs">{{goodsData.sepcList[selectSpec].integralType | filterIntegralType }}</text>
									<text>{{goodsData.sepcList[selectSpec].integral}}</text>
									<text class="text-xs">{{$queue.getIntegralName()}}</text>
								</template>
							</view>
							<view class="margin-top text-sm text-gray">
								<text>剩余 {{ goodsData.sepcList[selectSpec].amount }} 件</text>
							</view>
							<view class="margin-top text-sm text-gray">
								<text>已选择 {{ goodsData.sepcList[selectSpec].skuName }} </text>
							</view>
						</view>
					</view>
					<view class="content">
						<view class="title">选择规格：</view>
						<view class="sp">
							<view v-for="(item, index) in goodsData.sepcList" :class="[index == selectSpec ? 'on' : '']"
								@tap.stop="setSelectSpec(item,index)" :key="index">{{ item.skuName }}</view>
						</view>
						<view class="length">
							<view class="text">数量：<text
									style="color: #999;font-size: 26rpx;">(限购{{quota > amount ? amount : quota}}件)</text>
							</view>
							<view class="number">
								<view class="sub" @tap.stop="handleSubNumber">
									<text class="cuIcon-move"></text>
								</view>
								<view class="input"><input type="number" v-model="goodsData.number" /></view>
								<view class="add" @tap.stop="handleAddNumber">
									<text class="cuIcon-add"></text>
								</view>
							</view>
						</view>

					</view>
					<view class="bottom cu-bar bg-white tabbar border shop">
						<view class="btn cu-btn bg-orange round shadow-blur" @tap.stop="handleAddCart">添加购物车</view>
						<view class="btn cu-btn bg-main round shadow-blur" @tap.stop="handleBuy">确定</view>
					</view>
				</view>
			</view>
		</view>



	</view>
</template>

<script>
	import {
		formatMoney
	} from '@/common/utils/MoneyUtils.js';
	export default {
		data() {
			return {
				isloading: 1,
				goodsId: null,
				swiperList: [], //轮播主图数据
				currentSwiper: 0, //轮播图下标
				specifications: '选择/规格', // 规格
				serviceClass: '', //服务弹窗css类，控制开关动画
				specClass: '', //规格弹窗css类，控制开关动画
				shareClass: '', //分享弹窗css类，控制开关动画
				goodsData: {}, // 商品信息
				selectSpec: 0, //选中规格
				isKeep: false, //收藏
				descriptionStr: '', //商品描述html
				cartNum: 0, // 购物车数量
				buylist: [], // 当前成功加入购物车返回的对象
				amount: 0, //当前库存数量
				storeId: '',
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
				timer: null,
				d: 0,
				h: 0,
				m: 0,
				s: 0,
				options: null,
				flag: '', // 点击购物车或立即购买按钮标识符
				shopCart: {}
			};
		},

		onLoad(options) {
			console.log('option', options)
			this.options = options

		},
		onShow() {
			uni.showLoading({
				title: '加载中...'
			});
			if (this.options.scene) {
				this.goodsId = this.shareId
			} else {
				this.goodsId = this.options.goodsId
			}
			this.getGoodsBase()
			this.hideSpec()
		},
		onUnload() {
			this.$queue.remove("bsType");
			this.$queue.remove("saleStoreId");
			this.$queue.remove("saleStoreName");
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
			toPage(url) {
				uni.navigateTo({
					url: url
				});
			},
			// 获取商品基础信息
			getGoodsBase() {
				this.$http.getGoodsBase({
					goodsId: this.goodsId
				}).then(res => {
					if (res.code == 200) {
						// 配置分享	
						this.share.path = "/sub/goods/detail/detail?goodsId=" + res.data.id + '&uuid=' + this
							.getuuids + '&bsType=' + this.bsType
						this.share.imageUrl = res.data.goodsIcon;
						this.share.title = res.data.goodsName;
						this.share.desc = res.data.goodsTitle;
						this.goodsData.base = res.data;
						this.goodsId = res.data.id;
						this.storeId = res.data.storeId
						this.actCode = res.data.actCode
						this.timer = res.data.pullOffTime - new Date().getTime()
						this.d = Math.floor(this.timer / 1000 / 86400);
						this.h = Math.floor(this.timer / 1000 % 86400 / 3600);
						this.m = Math.floor(this.timer / 1000 % 86400 % 3600 / 60);
						this.s = Math.floor(this.timer / 1000 % 86400 % 3600 % 60);
						this.getGoodsDetail(this.goodsId);
						this.getCartList();
					}
				})
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
				// 规格
				this.getGoodsSkuList(goodsId);
			},
			/* 获取商品sku列表 */
			async getGoodsSkuList(goodsId) {
				const res = await this.$http.getGoodsSkuList({
					goodsId
				});
				if (res.success) {
					this.isloading = 0
					this.goodsData.sepcList = res.data;
					this.quota = this.goodsData.sepcList[this.selectSpec].quota
					this.amount = this.goodsData.sepcList[this.selectSpec].amount
				}
			},
			/* 轮播图指示器 */
			swiperChange(event) {
				this.currentSwiper = event.detail.current;
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
			/* 删除购物车 */
			handleSubCart() {
				this.$http.delShoppingCart();
			},
			/* 商品评论 */
			toRatings() {
				uni.navigateTo({
					url: '/sub/goods/ratings/ratings'
				});
			},
			/* 跳转确认订单页面 */
			toConfirmation() {
				let goods = _.assign({}, this.goodsData);
				goods.sku = goods.sepcList[this.selectSpec]
				this.$queue.setJson("buy_goods", goods);
				uni.navigateTo({
					url: '/sub/orders/confirmation/confirmation?actCode=' + this.actCode + '&giftNumber=' + this
						.giftNumber
				});
			},
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
		text-align: center;
		padding: 0;
		display: block;
		height: auto;
		line-height: 1;
		margin: 0;
		background-color: inherit;
		overflow: initial;
		margin-left: 52upx;
	}

	.active:first-child {
		margin-left: 24upx;
	}

	.active::after {
		border: 0;
	}
</style>
