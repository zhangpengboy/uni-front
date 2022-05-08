<template>
	<view v-if="isloading == 0">
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
		<!-- 价格 -->
		<view class="priceNav">
			<view class="left">
				<view class="salePrice">
					<text class="text-df">当前价</text>
					<view class="price text-price">
						<text>{{ goodsData.base.salePrice }}</text>
						<template v-if="goodsData.base.integral > 0">
							<text class="text-xs">{{ goodsData.base.integralType | filterIntegralType }}</text>
							<text>{{ goodsData.base.integral }}</text>
							<text class="text-xs">{{$queue.getIntegralName()}}</text>
						</template>
						<text class="text-price line-thr margin-left-xs text-sm">{{ goodsData.base.marketPrice }}</text>
					</view>
				</view>
				<view class="vipPrice">
					<text>会员价</text>
					<view class="price text-price">
						<text>{{ goodsData.base.vipPrice }}</text>
						<template v-if="goodsData.base.integral > 0">
							<text class="text-xs">{{ goodsData.base.integralType | filterIntegralType }}</text>
							<text>{{ goodsData.base.integral }}</text>
							<text class="text-xs">{{$queue.getIntegralName()}}</text>
						</template>
					</view>
				</view>
			</view>
			<view class="right" v-if="timer > 0">
				<text class="end">距活动结束</text>
				<uni-countdown color="#FA3B1C" splitorColor="#fff" background-color="#FFF" border-color="#FFF" :day="d" dayColor="#fff"
					:hour="h" :minute="m" :second="s"></uni-countdown>
			</view>
			<!-- <view class="right" v-else>
				<text class="end">活动已结束</text>
			</view> -->
		</view>
		<!-- 标题 -->
		<view class="main-wrap margin-top-sm" v-if="goodsData.base">
			<view class="main-wrap-box goods-info">
				<view class="title">{{ goodsData.base.goodsName }}</view>
				<view class="sharebut">
					<!-- <button class="button" open-type='share'>
						<image src="../static/img/shareicon.png" mode=""></image>
						<view>分享</view>
					</button> -->
					<view class="button" @click="showShareEvn">
						<image src="../static/img/fx_on@2x.png" mode=""></image>
						<view>分享</view>
					</view>
				</view>
			</view>
			<view class="goodstitle">
				{{ goodsData.base.goodsTitle }}
			</view>
			<view class="commission" v-if="userStoreShow && storeObj.storeAmount">
				<view class="display">
					<view class="" v-if="bsType != 'BS_A013'">
						商品陈列奖励
					</view>
					<view class="" v-if="bsType == 'BS_A013'">
						预计奖励
					</view>
					<view class="shopprice text-price">
						{{storeObj.storeAmount}}
					</view>
				</view>
				<view class="FenRun">
					<view class="" v-if="bsType != 'BS_A013'">
						商品动销奖励比例
					</view>
					<view class="" v-if="bsType == 'BS_A013'">
						预计奖励比例
					</view>
					<view class="shopbili">
						{{storeObj.storeIncome}}%
					</view>
				</view>
			</view>
		</view>
		<!-- 开通vip -->
		<view class="vip">
			<view class="left">
				<image src="../static/img/vipbg@2x.png" mode=""></image>
				<view class="text">
					<view class="one">{{ vipStatus == 0 ? '开通' : '续费' }}VIP</view>
					<view class="two">{{ vipStatus == 0 ? '开通' : '续费' }}会员享超值特权</view>
				</view>
			</view>
			<button type="default" class="but" @tap="toPage('/sub/vipMembers/vipMembersInterests?vipStatus='+vipStatus)">立即{{ vipStatus == 0 ? '开通' : '续费' }}</button>
		</view>
		<!-- <view v-if="giftvouchers && opengift" class="main-wrap goods-coupons"
			style="background-image: url(https://app-static.meitianhui.com/images/ebbe6f658ceac1d8f1e06fc3eebeb304-n58esp0zcw.png);">
			<view class="left" @click="buggiftbag">
				<image src="../static/img/piaoquan.png" mode=""></image>
				<view class="">
					优惠
				</view>
				<view class="keyong" v-if="opengift">
					可使用{{giftNumber}}张礼券福袋
				</view>
				<view class="keyong" v-else>
					开通365礼券福袋
				</view>
			</view>
		</view> -->
		<!-- <view class="main-wrap goods-storeText" @click="goStore" v-if="goodsData.base.roleCode != 2">
			<view class="left">
				<image src="../../../static/img/logo.png" mode=""></image>
				<view class="">
					{{goodsData.base.storeName}}
				</view>
			</view>
			<view class=" right cuIcon-right">
			</view>
		</view> -->
		<!-- 服务-规则选择 -->
		<!-- <view class="main-wrap">
			<view class="cu-list sm-border menu">
				<view class="cu-item arrow" @click.stop="showService()">
					<view class="content">
						<text class="text-sm text-gray">服务</text>
					</view>
					<view class="action text-sm text-grey">
						<text>查看服务</text>
					</view>
				</view>
				<view class="cu-item arrow" @click.stop="showSpec()">
					<view class="content">
						<text class="text-sm text-gray">规格</text>
					</view>
					<view class="action text-sm text-grey">
						<text>{{specifications}}</text>
					</view>
				</view>
			</view>
		</view> -->
		<!-- 评价 -->
		<!-- <view class="main-wrap" v-if="!_.isEmpty(goodsData.comment)" id="comments">
			<view class="main-wrap-box">
				<view class="comments">
					<view class="flex justify-between" @click="toRatings">
						<view class="text">商品评价(999+)</view>
						<view class="text-orange" @click.stop="showComments(goodsData.id)">
							<text class="margin-right-xs">查看全部</text>
							<text class="cuIcon cuIcon-right"></text>
						</view>
					</view>
					<view class="comment" @tap="toRatings">
						<view class="user-info">
							<view class="face">
								<image :src="goodsData.comment.userface"></image>
							</view>
							<view class="username">{{ goodsData.comment.username }}</view>
						</view>
						<view class="content">{{ goodsData.comment.content }}</view>
					</view>
				</view>
			</view>
		</view> -->
		<!-- 详情 -->
		<view class="description">
			<view class="title">商品简介</view>
			<view class="content">
				<!-- <mp-html :content="descriptionStr" /> -->
				<image v-for="item in  descriptionStr" :key="item" style="width: 100%;display:block;" :src="item"
					mode="widthFix" @tap="preview(item)"></image>
			</view>
		</view>
		<!-- 底部菜单 -->
		<view class="cu-bar bg-white tabbar border shop foot" style="justify-content: left;">
			<!-- <view class="action" style="width: 100rpx;" @click="goStore">
				<view class="cuIcon-shop"></view>
				<text>店铺</text>
			</view> -->
			<!-- <view class="action" style="width: 100rpx;" @click.stop="handleKeep">
				<view class="icon" :class="isKeep ? 'text-main cuIcon-favorfill' : 'text-gray cuIcon-favor'"></view>
				<text>{{ isKeep ? '已收藏' : '收藏' }}</text>
			</view> -->
			<view class="active" @click="goStore">
				<view class="" style="margin-bottom: 10rpx;">
					<image style="width: 39rpx; height: 37rpx;" src="../../../static/img/iconshopdetail.png" mode="">
					</image>
				</view>
				<text>店铺</text>
			</view>
			<!-- <button class="active" open-type="contact" :session-from="data">
				<view class="" style="margin-bottom: 10rpx;">
					<image style="width: 39rpx; height: 37rpx;" src="../../../static/img/customer.png" mode=""></image>
				</view>
				<text>客服</text>
			</button> -->
			<view class="active" @click.stop="handleKeep">
				<view class="" style="margin-bottom: 10rpx;">
					<image style="width: 39rpx; height: 37rpx;" :src="isKeep ? collecticon[1] : collecticon[0]" mode="">
					</image>
				</view>
				<text>{{ isKeep ? '已收藏' : '收藏' }}</text>
			</view>
			<!-- <view class="action" @click="toCart">
				<view class="cuIcon-cart">
					<view class="cu-tag badge" v-if="cartNum > 0">{{cartNum}}</view>
				</view>
				<text>购物车</text>
			</view> -->
			<view class="btn-group" style="justify-content: flex-end;">
				<!-- <button class="cu-btn bg-main round shadow-blur" @tap="showSpec()">加入购物车</button> -->
				<button style="background: linear-gradient(143deg, #F32A2A 0%, #FF6B3A 100%);
	color: #fff;" class="cu-btn round shadow-blur" @tap="showSpec()">立即购买</button>
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
							<view class="vipPrice">
								<text class="vip">会员价</text>
								<text class="presents text-price vipPriceItem fw" style="font-size: 22rpx;">
									{{ goodsData.sepcList[selectSpec].vipPrice || 0 }}
									<template v-if="goodsData.sepcList[selectSpec].integral > 0">
										<text class="text-xs">{{ goodsData.sepcList[selectSpec].integralType | filterIntegralType }}</text>
										<text style="font-size: 22rpx;">{{ goodsData.sepcList[selectSpec].integral }}</text>
										<text class="text-xs">{{$queue.getIntegralName()}}</text>
									</template>
								</text>
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
					<view class="bottom">
						<!-- <view class="btn cu-btn bg-main round shadow-blur" @tap.stop="handleAddCart">添加购物车</view> -->
						<view class=" cu-btn bg-red round shadow-blur"
							style="margin: 0 auto;width: 524rpx;height: 76rpx;background: linear-gradient(143deg, #F32A2A 0%, #FF6B3A 100%);"
							@tap.stop="handleBuy">确定</view>
					</view>
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
		<view :hidden="canvasFlag">
			<!-- 海报 要放外面放组件里面 会找不到 canvas-->
			<canvas class="canvas" canvas-id="myCanvas"></canvas>
			<!-- 海报 -->
		</view>
	</view>
</template>

<script>
	import {
		formatMoney
	} from '@/common/utils/MoneyUtils.js';
	import hchPoster from '../../../components/hch-poster/hch-poster2.vue';
	import mpHtml from '../components/mp-html/mp-html'
	import uniCountdown from '../../../components/uni-countdown/uni-countdown.vue'
	export default {
		components: {
			hchPoster,
			mpHtml,
			uniCountdown
		},
		data() {
			return {
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
				}], //导航条锚点
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
				timer: null,
				d: 0,
				h: 0,
				m: 0,
				s: 0,
				options: null,
			};
		},

		onLoad(options) {
			console.log('option', options)
			this.options = options
			
		},
		onShow() {
			this.vipStatus = this.$queue.getData("vipStatus") || 0
			console.log(this.vipStatus)
			uni.showLoading({
				title: '加载中...'
			});
			if (this.options.scene) {
				this.goodsId = this.shareId
			} else {
				this.goodsId = this.options.goodsId
			}
			this.getGoodsBase()
			// this.getGoodsDetail(this.goodsId);
			// this.getFaverGoodsIsKeep(this.goodsId);
			if (this.actCode == this.$stringUtils.giftbagCode() && this.hasLogin) {
				this.getusegiftNum()
				this.getOpengift()
			}
			// this.getCartList();
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
					const result = await this.$http.getGoodsCartList();
					if (result.success) {
						this.cartNum = result.data.total;
					}
				}
			},
			no() {
				// 什么事也不干 方法勿删
			},
			toPage(url) {
				uni.navigateTo({
					url: url
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
						if (res.data.actCode == this.$stringUtils.giftbagCode()) {
							this.giftvouchers = true
							if (this.hasLogin) {
								this.getusegiftNum()
								this.getOpengift()
							}
						}
						this.getGoodsDetail(this.goodsId);
						this.getFaverGoodsIsKeep(this.goodsId);
						if (this.$queue.getData('saleStoreId') == this.$queue.getData('userStoreId')) {
							this.userStoreShow = true
							this.getGoodsIncomeConfig(this.bsType)
						}
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
				}
				if (this.bsType == 'BS_A013') {
					uni.navigateTo({
						url: "/sub/giftbag/giftmom/giftmomDetail?storeId=" + this.$queue.getData('saleStoreId')
					});
				}
				if (this.goodsData.base.roleCode == 2) {
					uni.navigateTo({
						url: "/sub/stores/store/storeDetail?storeId=" + this.$queue.getData('saleStoreId')
					});
				} else {
					uni.navigateTo({
						url: "/sub/stores/store/storeDetail?storeId=" + this.storeId
					});
				}
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
			/* 立即购买确认按钮操作 */
			handleBuy() {
				// if (!this.hasLogin) {
				// 	uni.navigateTo({
				// 		url: '/pages/login/login'
				// 	});
				// 	return false;
				// }
				if (!this.isPositiveInteger(this.goodsData.number)) return this.$queue.showToast("请填写正确的数量");
				if (this.goodsData.number > this.amount || this.goodsData.number > this.quota) return this.$queue
					.showToast("购买数量大于商品数量，无法订购");
				if (this.amount === 0) return this.$queue.showToast("该商品剩余0件，无法订购");
				if (this.goodsData.number == 0) return this.$queue.showToast("购买数量为0件");
				this.toConfirmation();
				this.hideSpec();
			},
			isPositiveInteger(s) { //是否为正整数
				var reg = /^[1-9]+\d*$/;
				return reg.test(s)
			},
			/* 添加购物车 */
			handleAddCart() {
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login'
					});
					return false;
				}
				const sku = this.goodsData.sepcList[this.selectSpec];
				this.$http.addGoodsCart({
					storeId: this.goodsData.base.storeId,
					storeName: this.goodsData.base.storeName,
					marketPrice: this.goodsData.base.marketPrice,
					goodsId: sku.goodsId,
					goodsName: sku.goodsName,
					salePrice: sku.salePrice,
					settlePrice: sku.settlePrice,
					integral: sku.integral,
					integralType: sku.integralType,
					skuId: sku.id,
					skuName: sku.skuName,
					skuIcon: sku.skuImg,
					num: this.goodsData.number,
				}).then(res => {
					if (res.success) {
						this.getCartList();
						return this.$queue.showToast("添加购物车成功~")
					}
					return this.$queue.showToast(res.message)
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
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login'
					});
					return false;
				}
				// if (this.actCode == this.$stringUtils.giftbagCode() && !this.opengift) {
				// 	uni.navigateTo({
				// 		url: '../../giftbag/topup/topup?page=detail'
				// 	})
				// 	return false;
				// }
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
					this.posterData.brandImg.url = this.goodsData.base.gooGoodsBrand.brandLogo
					this.posterData.name.text = `        ${this.goodsData.base.goodsName}`
					this.posterData.mainImg.url = this.share.imageUrl //'./static/img/vip@2x.png'
					this.posterData.codeImg.url = res.data
					this.posterData.userImg.url = this.$queue.getJson('userInfo').avatarUrl
					this.posterData.textBg.url = this.$queue.publicCdnHost()+'/assets/imgs/hbTextBg@2x.png'
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
