<template>
	<view class="mom">
		<!-- 用户信息 -->
		<view class="tab"
			:style="{ height: statusBarHeight + navBarHright  + 'px',background: 'linear-gradient(180deg, '+ bgcolor.one + ' 0%, ' + bgcolor.two + ' 100%)' }">
			<view class="tabBar" :style="{height: statusBarHeight  + 'px'}"></view>
			<view class="tabNav" :style="{height: navBarHright  + 'px'}">
				<view class="cuIcon-back backIcon" @click="goback">
				</view>
				<view class="" style="margin-left: 240rpx;">
					个人云创业
				</view>
			</view>
		</view>
		<view class="mom-header">
			<view class="mom-header-top">
				<view class="left">
					<view class="avatar">
						<open-data v-if="motherData.headPic" class="avatar" type="userAvatarUrl"></open-data>
						<image v-else src="../../../static/img/logo.png" mode=""></image>
					</view>
					<view class="content">
						<view>
							<view class="momname">
								<!-- <open-data type="userNickName"></open-data> -->
								<view>{{nameList[1]}}</view>
							</view>
							<!-- <view class="momtype" v-if="0">
								<image src="../../static/img/mom/momvip.png" mode=""></image>
							</view>
							<view class="momtype" v-if="1"><text>普通用户</text></view> -->
						</view>
						<view class="invite-code">
							<view class="momtype" v-if="motherData.giftMotherFlag">
								<image src="../../../static/img/mom/momvip.png" mode=""></image>
							</view>
							<view class="category">
								<image src="../../../static/img/mom/huiV.png" mode=""></image>
								<text>{{nameList[0]}}</text>
							</view>
							<view class="huipeo">
								<image v-if="peopleshow" src="../../../static/img/mom/huibrother.png" mode=""></image>
								<image v-if="!peopleshow" src="../../../static/img/mom/huisister.png" mode=""></image>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 开通续费 -->
			<view class="openMOM" v-if="motherData.phone != $queue.getData('phone')">
				<view class="opentext">
					开通个人云创业
				</view>
				<view class="openbtn" @click="chargeMoney(1)">
					立即开通
				</view>
				<view class="bgc">
				</view>
			</view>
			<view class="renewalMOM" v-if="motherData.phone == $queue.getData('phone')">
				<view class="renewaltext">
					<image src="../../../static/img/horn.png" mode=""></image>
					<text>{{motherData.motherEndTime, '{y}-{m}-{d}' | parseTime }}到期</text>
				</view>
				<view class="renewalbtn" @click="chargeMoney(2)">
					立即续费
				</view>
				<view class="bgc">
				</view>
			</view>
		</view>

		<!-- 主体 -->
		<view class="mom-content" v-if="isloading == 0">
			<!-- 猜你喜欢 -->
			<view class="" :style="{minHeight: windowHeight - 50 + 'px'}" v-if="goodsList.length">
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
						</view>
					</view>
				</view>
				<view class="cu-load" :class="queryParams.isfinish ? 'over' : 'loading'"></view>
			</view>
			<view class="mom-image" v-if="goodsList.length == 0">
				<image :src="img" mode=""></image>
				<view class="">
					还没有商品哦~
				</view>
			</view>
		</view>
		<view class="password-wrap" v-if="digitalshelveswrapper == 1">
			<view class="bg"></view>
			<view class="content">
				<view class="close" @click="digitalshelveswrapper = 0">+</view>
				<view class="title">{{titleText}}个人云创业</view>
				<view class="body">
					<view class="type">服务类型</view>
					<text class="moneytype">
						{{money}}元/年
					</text>
					<view class="should">
						应付: <text style="color: #EB6133;margin-left: 10rpx;">{{money}}</text>
					</view>
				</view>
				<button class="btn" @click="sendNext">立即支付</button>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		parseTime
	} from '@/common/utils/DateUtils.js'
	export default {
		data() {
			return {
				isloading: 1,
				statusBarHeight: 0,
				navBarHright: 0,
				windowHeight: 0,
				// 高度差
				heightDiff: 0,
				statusBar: {},
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					isfinish: false,
				},
				totalPage: 0,
				goodsList: [],
				pushGoodsList: [],
				digitalshelveswrapper: 0,
				titleText: '',
				money: 0,
				motherData: {},
				nameList: [],
				peopleshow: false,
				img: '',
				giftmomstroe: {},
				orderNo: '',
				flag: null,
			};
		},
		//下拉刷新，配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			this.goodsList = [];
			this.queryParams.isfinish = false;
			this.queryParams.pageNum = 1;
			this.getActGoodsList();
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
		onLoad(e) {
			uni.showLoading({
				mask: true,
				title: "加载中..."
			})
			if (e.storeId) {
				this.giftmomstroe.storeId = e.storeId
			} else {
				this.giftmomstroe.phone = this.$queue.getData('phone')
			}
			this.img = this.Dict.status_img
			this.getstoreDetail()
			this.getSystemdata();
			this.getstoreGiftMotherpay()
		},
		onShow() {
			if (this.hasLogin) {
				// this.getmomDetail();
				// this.getmommallmom()
				return
			}
			uni.redirectTo({
				url: "/pages/login/login"
			})
		},
		filters: {
			parseTime
		},
		methods: {
			// 获取店铺信息
			getstoreDetail() {
				this.$http.storeGiftMothergetByPhone(this.giftmomstroe).then(res => {
					if (res.code == 200 && res.data) {
						this.motherData = res.data
						this.nameList = this.motherData.storeName.split("-")
						if (this.nameList[2] == '惠哥') {
							this.peopleshow = true;
						} else {
							this.peopleshow = false;
						}
						this.queryParams.storeId = this.motherData.storeId
						this.queryParams.storeName = this.motherData.storeName
						this.getActGoodsList()
					}
				})
			},
			// 返回
			goback() {
				uni.switchTab({
					url: "/pages/user/user"
				});
			},
			// 获取礼券妈妈开通支付金额
			getstoreGiftMotherpay() {
				this.$http.storeGiftMother().then(res => {
					console.log(res)
					if (res.code == 200) {
						this.money = res.data
					}
				})
			},
			// 跳转商品详情 
			toGoods(e) {
				console.log(e)
				let giftmom = {}
				this.pushGoodsList.map(item => {
					if (item.goodsId == e.id) {
						this.$queue.setData('userStoreId', item.storeId)
						giftmom.bsType = item.bsType
						giftmom.uuid = item.uuid
						giftmom.storeId = item.storeId
						giftmom.storeName = item.storeName
					}
				})
				uni.navigateTo({
					// url: "/sub/goods/detail/detail?" + this.$queue.stringify(e)
					url: "/sub/goods/detail/detail?goodsId=" + e.id + '&uuid=' + giftmom.uuid + '&bsType=' +
						giftmom.bsType
				});
			},
			// 立即支付
			sendNext() {
				uni.showLoading({
					mask: true,
					title: "加载中..."
				})
				// let obj = {
				// 	payType: 2,
				// 	amount: this.money,
				// 	bsType: 'BS_A012'
				// }
				// this.$http.getdepositOrder_v2(obj).then(resPay => {
				// 	if (!resPay.success) {
				// 		uni.hideLoading();
				// 		return this.$queue.showToast(resPay.message);
				// 	}
				let flag = this.flag
				let dataObj = {
					openId: this.$queue.getData("openId"),
					orderNo: this.orderNo,
					payType: '2',
					bsType: 'BS_A012'
				}
				this.$http.createPayOrder(dataObj).then(resPay => {
					if (!resPay.success) {
						uni.hideLoading();
						return this.$queue.showToast(resPay.message);
					}
					this.$queue.showLoading("支付中...");
					uni.requestPayment({
						provider: 'wxpay',
						appId: resPay.data.appid,
						nonceStr: resPay.data.nonceStr,
						package: resPay.data.package,
						paySign: resPay.data.paySign,
						signType: resPay.data.signType,
						timeStamp: resPay.data.timeStamp,
						success: result => {
							uni.hideLoading();
							uni.showToast({
								title: '支付成功'
							});
							if (flag == 0) {
								setTimeout(() => {
									this.digitalshelveswrapper = 0
									uni.redirectTo({
										url: './momenter'
									});
								}, 700);
							} else {
								this.digitalshelveswrapper = 0
							}
						},
						fail: err => {
							setTimeout(() => {
								uni.hideLoading();
								uni.showToast({
									title: '支付取消或失败,请重新支付',
									icon: 'none'
								});
							}, 700);
						}
					});
				})
				// })
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
			/* 获取商品列表 */
			async getActGoodsList() {
				if (this.queryParams.isfinish) return;
				const res = await this.$http.getPushGoodsList(this.queryParams);
				if (res.code == 200) {
					this.isloading = 0
					uni.stopPullDownRefresh();
					uni.hideLoading()
					this.totalPage = res.data.totalPage
					if (res.success) {
						this.pushGoodsList = _.concat(this.goodsList, res.data.list);
						let arr = []
						this.pushGoodsList.map((item, i) => {
							arr.push(item.goods)
						})
						this.goodsList = arr
						if (res.data.totalPage == this.queryParams.pageNum || _.size(res.data.list) === 0) {
							this.queryParams.isfinish = true;
						}
					}
				}
			},
			// 充值
			chargeMoney(i) {
				if (i == 1) {
					uni.navigateTo({
						url: './giftmomBack'
					})
				} else {
					this.titleText = '充值'
					let obj = {
						payType: 2,
						amount: this.money,
						bsType: 'BS_A012'
					}
					this.$http.getdepositOrder_v2(obj).then(resPay => {
						if (!resPay.success) {
							uni.hideLoading();
							return this.$queue.showToast(resPay.message);
						}
						uni.hideLoading();
						this.flag = resPay.data.flag
						this.orderNo = resPay.data.orderNo
						this.digitalshelveswrapper = 1
					})
				}
			},
			// 礼券妈妈后台
			goGiftMOMback() {
				uni.navigateTo({
					url: './giftmomBack'
				})
			}
		}
	};
</script>
<style lang="scss">
	page {
		position: relative;
		background-color: #f7f7f7;
		box-sizing: border-box;
	}

	.mom {

		// 顶部
		.tab {
			// position: relative;
			height: 120upx;
			width: 100%;
			background: linear-gradient(90deg, #E8CB8E 0%, #D1A068 100%);
			// position: sticky;
			z-index: 9999;
			// top: 0upx;

			.backIcon {
				margin-left: 32upx;
				font-size: 32upx;
				color: #FFFFFF;
			}

			.tabNav {
				display: flex;
				// justify-content: center;
				align-items: center;
				font-size: 36upx;
				font-weight: 300;
				color: #FFFFFF;
				// border-bottom: 2upx solid #F6F6F6;
			}
		}

		&-header {
			// height: 456upx;
			background: linear-gradient(90deg, #E8CB8E 0%, #D1A068 100%);

			&-top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-top: 48upx;
				margin-left: 24upx;
				padding-bottom: 50upx;

				.left {
					display: flex;
					align-items: center;
					flex: 1;

					.avatar {
						width: 128upx;
						height: 128upx;
						border-radius: 50%;
						overflow: hidden;

						image {
							width: 128upx;
							height: 128upx;
						}
					}

					.content {
						padding-left: 28upx;
						padding-right: 28upx;

						.momname {
							vertical-align: top;
							font-weight: 500;
							margin-bottom: 20upx;
							display: inline-block;
							overflow: hidden; //超出的文本隐藏
							text-overflow: ellipsis; //溢出用省略号显示
							white-space: nowrap; //溢出不换行
							width: 346upx;
							font-size: 36upx;
							color: #FFF2D6;
						}

						.invite-code {
							height: 40upx;
							color: #FFF2D6;
							// display: inline-block;
							display: flex;
							align-items: center;
							font-size: 28upx;
							font-weight: 300;

							.momtype {
								display: inline-block;

								// margin: 8upx 0upx 8upx -8upx;
								text {
									width: 104upx;
									height: 36upx;
									display: inline-block;
									color: #000;
									opacity: 0.63;
									font-size: 20upx;
									font-weight: 300;
									border-radius: 18upx;
									background: #FFFFFF;
									text-align: center;
									line-height: 36upx;
								}

								image {
									width: 133upx;
									height: 39upx;
									opacity: 1;
								}
							}

							.category {
								display: flex;
								align-items: center;
								margin: 0upx 16upx 8upx 16upx;
								position: relative;

								text {
									display: inline-block;
									max-width: 240upx;
									overflow: hidden; //超出的文本隐藏
									text-overflow: ellipsis; //溢出用省略号显示
									white-space: nowrap; //溢出不换行
									margin-left: 10upx;
									padding: 5upx 12upx 5upx 30upx;
									font-size: 20upx;
									font-weight: 300;
									color: #FFFFFF;
									background: linear-gradient(180deg, #FC9840 0%, #F15F2D 100%);
									opacity: 1;
									border-radius: 18upx;
								}

								image {
									position: absolute;
									width: 36upx;
									height: 36upx;
									opacity: 1;
								}
							}

							.huipeo {
								image {
									width: 93upx;
									height: 39upx;
									opacity: 1;
								}
							}
						}

						.copy {
							font-size: 24upx;
							font-weight: 300;
							margin-left: -40upx;
							text-align: center;
							width: 88upx;
							height: 44upx;
							line-height: 44upx;
							display: inline-block;
							background: linear-gradient(270deg, #FB7F07 0%, #FB9C26 100%);
							opacity: 1;
							border-radius: 40upx;
						}
					}
				}

				.right {
					flex-shrink: 0;
					width: 80upx;
					height: 80upx;
					margin-left: 5vw;
					border-radius: 100%;

					display: flex;
					justify-content: center;
					align-items: center;
					// background: linear-gradient(to left, #fbbb37 0%, #fcf0d0 105%);
					background: #fff;

					.icon {
						width: 80upx;
						height: 80upx;
					}
				}
			}

			.openMOM {
				position: relative;
				margin-top: 68upx;
				height: 104upx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.opentext {
					padding-left: 24upx;
					font-size: 28upx;
					font-weight: 300;
					color: #F1F1F1;
				}

				.openbtn {
					z-index: 99;
					margin-right: 28upx;
					padding: 0upx 24upx;
					color: #F1F1F1;
					background: #D1A068;
					border: 2upx solid #FFF2D6;
					border-radius: 85upx;
					text-align: center;
					line-height: 56upx;
				}

				.bgc {
					position: absolute;
					top: 0upx;
					width: 100%;
					height: 104upx;
					background: linear-gradient(85deg, #FFFFFF 0%, #D1A46B 100%);
					opacity: 0.2;
				}
			}

			.renewalMOM {
				position: relative;
				// margin-top: 58upx;
				height: 104upx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.renewaltext {
					display: flex;
					align-items: center;
					padding-left: 24upx;

					image {
						width: 40upx;
						height: 40upx;
						opacity: 1;
						margin-right: 32upx;
					}

					text {
						font-size: 28upx;
						font-weight: 300;
						color: #FFFFFF;
					}
				}

				.renewalbtn {
					z-index: 99;
					margin-right: 28upx;
					padding: 0upx 24upx;
					color: #F1F1F1;
					background: #D1A068;
					border: 2upx solid #FFF2D6;
					border-radius: 85upx;
					text-align: center;
					line-height: 56upx;
				}

				.bgc {
					position: absolute;
					top: 0upx;
					width: 100%;
					height: 104upx;
					background: linear-gradient(85deg, #FFFFFF 0%, #D1A46B 100%);
					opacity: 0.2;
				}
			}
		}

		// 主体
		&-content {
			margin-top: 24upx;

			.mom-image {
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
		}
	}

	.password-wrap {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9999;
	}

	.password-wrap .bg {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background-color: rgba(17, 16, 30, 0.50);
	}

	.password-wrap .content {
		position: absolute;
		top: 51%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 600upx;
		background-color: #fff;
		border-radius: 16upx;
	}

	.password-wrap .content .title {
		text-align: center;
		margin: 48upx 0 60upx;
		font-size: 32upx;
		color: #333333;
	}

	.password-wrap .content .body {
		margin: 0 28upx;

		.type {
			margin-bottom: 24upx;
			font-size: 28upx;
			font-weight: 300;
			color: #999999;
		}

		.moneytype {
			padding: 34upx 36upx;
			border: 2upx solid #EB6132;
			display: inline-block;
			border-radius: 16upx;
			font-size: 32upx;
			font-weight: 300;
			color: #EB6133;
		}

		.should {
			margin-top: 40upx;
			font-size: 40upx;
			font-weight: 500;
			color: #666;
		}
	}

	.password-wrap .content .btn {
		width: 524upx;
		height: 76upx;
		line-height: 76upx;
		text-align: center;
		font-size: 32upx;
		color: #FFFFFF;
		margin: 48upx auto 48upx;
		background: #FF5A5A;
		border-radius: 38upx;
		background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
	}


	.password-wrap .close {
		position: absolute;
		top: 20upx;
		right: 30upx;
		font-size: 56upx;
		color: #D8D8D8;
		transform: rotate(45deg);
	}

	@import "@/static/css/goods.scss";
</style>
