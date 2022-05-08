<template>
	<view class="user">
		<view class="sk">
			<view class="searchBar" :style="{height: statusBarHeight  + 'px'}"></view>
			<view class="searchNav" :style="{height: navBarHright  + 'px'}"></view>
		</view>
		<!-- 用户信息 -->
		<view class="user-header" :style="{ height: statusBarHeight + 80 + 'px'}">
			<view class="user-header-top">
				<view class="left">
					<view class="avatar"
						@tap="toPageUser('/sub/users/profile/profile?ispartner=' + ispartner + '&id=' + userId)">
						<open-data class="avatar" type="userAvatarUrl"></open-data>
					</view>
					<view class="content">
						<view class="username">
							<open-data type="userNickName"></open-data>
						</view>
					</view>
				</view>
				<view class="right" @click.stop="toAddress">
					<image src="../../static/img/user/location_waite@2x.png" mode=""></image>
					<view class="text">收货地址</view>
				</view>
			</view>
		</view>

		<!-- 主体 -->
		<view class="user-content">
			<!-- 我的订单 -->
			<view class="user-wrap order" :style="{ 'margin-top': 0 - heightDiff - 32 + 'px'}">
				<view class="cu-list grid col-5 no-border br">
					<view class="cu-item" v-for="(v,i) in mybarList" :key="i" @tap="toPage(v.url)">
						<view v-if="i != 4 && v.badge > 0" class='cu-tag badge'>{{ v.badge > 99 ? '99+' : v.badge }}
						</view>
						<image :src="v.icon" class="img"></image>
						<text class="padding-top-xs padding-none">{{v.text}}</text>
					</view>
				</view>
			</view>
			<!-- 积分、余额 -->
			<view class="user-wrap money">
				<view class="money-row" @click="goIntegral()">
					<view class="money-text">
						{{ userIntegral }}
					</view>
					<text>{{$queue.getIntegralName()}}</text>
				</view>
				<view class="vertical-bar"></view>
				<view class="money-row" @click="goWallet()">
					<view class="money-text">
						{{ userMoney }}
					</view>
					<text>余额（元）</text>
				</view>
			</view>
		</view>

		<!-- 为你推荐 -->
		<view class="recommend">
			<view class="title">
				<image src="../../static/img/user/title-left@2x.png" mode=""></image>
				<text>为你推荐</text>
				<image src="../../static/img/user/title-right@2x.png" mode=""></image>
			</view>
		</view>

		<!-- 列表 -->
		<view class="goods-list">
			<view class="goods-item row-width" v-for="item in goodsList" :key="item.id" @tap="toGoods(item)">
				<image :src="item.goodsIcon" mode="aspectFill"></image>
				<view class="padding-sm">
					<view class="name">{{ item.goodsName}}</view>
					<view class="cateName margin-bottom-sm">{{ item.goodsTitle}}</view>
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
		</view>
		<!-- 状态 -->
		<view class="cu-load" :class="queryParams.isfinish ? 'over' : 'loading'"></view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				data: {},
				statusBarHeight: 0,
				navBarHright: 0,
				windowHeight: 0,
				heightDiff: 0,
				favorStores: 0, //关注
				favorGoods: 0, //收藏
				// 积分
				userIntegral: 0,
				// 红包
				userMoney: 0,
				// 收藏列表
				collectList: [],
				index: '',
				digitalshelveswrapper: 0,
				phoneNum: '',
				//店铺列表
				shopList: [],
				ispartner: '',
				userId: '',
				isPhone: false,
				vipStatus: null,
				code: '',
				phone: '',
				goodsList: [],
				totalPage: 0,
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					isfinish: false,
					actCode: ""
				},
				// 我的订单列表
				mybarList: [{
						url: '/sub/orders/orderList/orderList?tab=1',
						text: '待付款',
						icon: '/static/img/user/wait-pay@2x.png',
						badge: 0
					},
					{
						url: '/sub/orders/orderList/orderList?tab=2',
						text: '待发货',
						icon: '/static/img/user/wait-send@2x.png',
						badge: 0
					},
					{
						url: '/sub/orders/orderList/orderList?tab=3',
						text: '待收货',
						icon: '/static/img/user/wait-get@2x.png',
						badge: 0
					},
					{
						url: '/sub/orders/orderList/orderList?tab=5',
						text: '退换货',
						icon: '/static/img/user/apply@2x.png',
						badge: 0
					},
					{
						url: '/sub/orders/orderList/orderList',
						text: '全部订单',
						icon: '/static/img/user/all-order@2x.png'
					}
				],
			};
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			this.queryParams.pageNum = 1;
			this.queryParams.isfinish = false;
			this.getUserDetail();
			this.getUsermallUser()
			this.goodsList = [];
			this.getMpGoodsList()
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
				this.getMpGoodsList();
			}

		},
		onLoad() {
			// 获取设备状态栏高度
			this.getSystemdata();
		},
		onShow() {
			if (this.hasLogin) {
				this.getStoreList();
				this.getUserDetail();
				this.getUsermallUser()
				this.getMpGoodsList()
				return
			}
			uni.redirectTo({
				url: "/pages/login/login?page=user"
			})
		},
		methods: {
			// 跳转收货地址
			toAddress() {
				uni.navigateTo({
					url: "/sub/users/address/address"
				})
			},
			//商品跳转
			toGoods(e) {
				uni.navigateTo({
					// url: "/sub/goods/detail/detail?" + this.$queue.stringify(e)
					url: "/sub/goods/detail/detail?goodsId=" + e.id
				});
				// 改成跳转到店铺
				// uni.navigateTo({
				// 	// url: "/sub/goods/detail/detail?" + this.$queue.stringify(e)
				// 	url: "/sub/stores/store/storeDetail?storeId=" + e.storeId + "&goodsId=" + e.id
				// });
				this.$queue.setJson('goodsInfo', e)
			},
			// 获取订单数量
			getOrderCount() {
				this.$http.getOrderCount({
					userId: this.userId
				}).then(res => {
					// console.log(res.data['0'])
					if (res.data['0'] * 1 > 0) {
						this.mybarList[0].badge = res.data['0'] * 1
					}
					if (res.data['1'] * 1 > 0) this.mybarList[1].badge = res.data['1'] * 1
					if (res.data['2'] * 1 > 0) this.mybarList[2].badge = res.data['2'] * 1
					if (res.data['6'] * 1 > 0) this.mybarList[3].badge = res.data['6'] * 1
					// console.log(this.mybarList)
					// this.$set(this.mybarList[3].badge, res.data['6'] * 1)

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
			/* 授权一键登录按钮操作 */
			handleGetPhoneNumber: function(phoneRes) {
				const that = this;
				// 提前获取code
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						// console.log("phoneRes", phoneRes)
						if (phoneRes.detail.errMsg == "getPhoneNumber:ok") {
							// this.$queue.showLoading('正在登录中...');
							that.$http.bindingPhone({
									encryptedData: phoneRes.detail.encryptedData,
									iv: phoneRes.detail.iv,
									code: loginRes.code,
									oldPhone: that.userPhone
								})
								.then(res => {
									uni.hideLoading();
									if (res.success) {
										that.$queue.setData("phone", res.data);
										that.phone = res.data
										that.isPhone = false
										that.getUserDetail();
									} else {
										that.$queue.showToast(res.message);
									}
								}).catch(err => {
									uni.hideLoading();
									that.$queue.showToast("授权失败, 请重新授权")
								});
						} else {
							uni.hideLoading();
							this.$queue.showToast("授权失败, 请重新授权")
						}
					}
				})
			},

			/* 获取为你推荐商品列表 */
			async getMpGoodsList() {
				if (this.queryParams.isfinish) return;
				const res = await this.$http.getMpGoodsList(this.queryParams);
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
			// 判断用户等级
			getUsermallUser() {
				this.$http.getUsermallUser().then(res => {
					if (res.code == 200 && res.data) {
						this.ispartner = res.data.roleCode
						this.userId = res.data.id
						this.vipStatus = res.data.vipStatus
						this.$queue.setData("phone", res.data.phone);
						this.$queue.setData("userId", res.data.id);
						this.$queue.setData("vipStatus", res.data.vipStatus);
						this.getOrderCount()
						this.$http.isBindPhone({
							userId: this.userId
						}).then(res => {
							if (!res.data) {
								this.isPhone = true
							}
						})
					}
				})
			},
			textPaste() {
				let that = this
				uni.setClipboardData({
					data: that.myInviteCode,
					success: function(res) {
						uni.getClipboardData({
							success: function(res) {
								that.$queue.showToast('复制成功');
							}
						})
					}
				})
			},
			/* 获取个人中心信息 */
			async getUserDetail() {
				const res = await this.$http.getUserDetail();
				if (res.code == 200) {
					uni.stopPullDownRefresh();
					if (res.data.barCode) {
						this.$queue.setData('myInviteCode', res.data.barCode.code)
						this.myInviteCode = res.data.barCode.code;
					}
					if (res.data.integral != null || res.data.integral != null) {
						if (Object.keys(res.data.integral).length > 0) this.userIntegral = res.data.integral.allAmount;
						if (Object.keys(res.data.money).length > 0) this.userMoney = res.data.money.allAmount;
					}
					if (res.data.favorStores != null) this.favorStores = res.data.favorStores;
					if (res.data.favorGoods != null) this.favorGoods = res.data.favorGoods;

				}
			},
			/* 前往用户设置 */
			toSetting() {
				uni.navigateTo({
					url: 'sub/user/setting/setting'
				});
			},
			/* 前往我的邀请码 */
			toMyQR() {
				uni.navigateTo({
					url: '/sub/users/myQR/myQR'
				});
			},
			// 获取当前账号下店铺列表
			getStoreList() {
				this.$http.getStoreInfoByPhone({
					phone: this.userPhone
				}).then(res => {
					if (res.code == 200) {
						if (res.data.length) {
							let arr = []
							res.data.map(item => {
								if (item.status == 0) {
									if (item.storeRoleCode == 3 || item.storeRoleCode == 4 || item
										.storeRoleCode == 5) {
										arr.push(item)
									}
								}
							})
							this.shopList = arr
							if (this.shopList.length) {
								// this.myServiceList.splice(4, 0, {
								// 	url: `/sub/stores/store/storeDetail`,
								// 	text: '我的云店',
								// 	icon: '/static/img/user/store-goods@2x.png'
								// })
								this.myServiceList.map(v => {
									if (v.isShow) {
										v.isShow = false
									}
								})
							}
						}
					}
				})
			},
			// 我的店铺切换
			bindPickerChange(e) {
				if (this.shopList.length != 0) {
					this.index = e.target.value
					this.shopList.map((item, index) => {
						if (index == e.target.value) {
							this.$queue.setData('userStoreId', item.id)
							uni.navigateTo({
								url: '../../sub/stores/store/storeDetail?storeId=' + item.id
							});
						}
					})
				}
			},
			/* 前往指定url页面 */
			toPage(url) {
				console.log(url)
				// 礼券码
				if (url == '/sub/webview/storeLogin/storeLogin' && this.$queue.getJson("store")) {
					uni.navigateTo({
						url: '../../sub/webview/certificates/certificates'
					});
					return;
				}
				if (url == '/sub/stores/store/storeDetail') return
				// 数字货架
				if (url == 'digitalshelveswrapper') return this.digitalshelveswrapper = 1
				// 个人云创业
				if (url == 'storeGiftMother') {
					this.$http.storeGiftMotherhasOpen({
						phone: this.userPhone
					}).then(res => {
						if (res.code == 200 && res.data) {
							uni.navigateTo({
								url: '/sub/giftbag/giftmom/giftmomDetail'
							})
						} else {
							uni.navigateTo({
								url: '/sub/giftbag/giftmom/giftmomBack'
							})
						}
					})
					return false
				}

				// 代理商
				if (url == 'publicTheAgentYuMing') {
					this.$http.dlStatistics({
						userId: this.userId
					}).then(res => {
						if (res.code == 200) {
							if (res.data) {
								this.$http.dlStatus({
									userId: this.userId
								}).then(rep => {
									if (rep.code == 200 && rep.data) {
										uni.navigateTo({
											url: '/sub/webview/business/business?webUrl=' +
												encodeURIComponent(this
													.$queue.publicTheAgentYuMing() + '?userId=' +
													this.userId)
										})
									} else {
										this.$queue.showToast("正在审核中，请等待!")
										return
									}
								})
							} else {
								uni.navigateTo({
									url: '/sub/webview/business/business?webUrl=' + encodeURIComponent(this
										.$queue.publicTheAgentYuMing() + '/agentApply?userId=' + this
										.userId)
								})
							}
						}
					})
					return
				}
				// 我的团队
				if (url == 'myTeam') {
					uni.navigateTo({
						url: '/sub/webview/business/business?webUrl=' + encodeURIComponent(this
							.$queue.publicTheAgentYuMing() + '/myTeam?userId=' + this
							.userId)
					})
					return
				}
				uni.navigateTo({
					url: url
				});
			},
			// 开通数字货架
			sendNext() {
				if (!(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(this.phoneNum))) {
					this.$queue.showToast("请输入正确的手机号")
					return false;
				}
				// 判断 免费还是付费
				uni.showLoading({
					title: '加载中...'
				});
				this.$http.getDigitalShelves({
					mobile: this.phoneNum
				}).then(res => {
					uni.hideLoading()
					if (res.code == 200) {
						uni.navigateTo({
							url: '/sub/stores/store/shelves?state=' + (res.data.isFree ? 0 : 1)
						})
						this.phoneNum = ''
						this.digitalshelveswrapper = 0
					} else {
						this.$queue.showToast(res.message)
					}
				})

			},
			// 个人信息页面
			toPageUser(url) {
				if (this.$queue.getJson('userInfo') == undefined) {
					const that = this;
					uni.getUserProfile({
						desc: '完善用户资料',
						success: function(infoRes) {
							// 保存用户的基础信息
							if (infoRes.errMsg == 'getUserProfile:ok') {
								that.$queue.setJson("userInfo", infoRes.userInfo)
								const sessionKey = that.$queue.getJson('sessionKey')
								uni.navigateTo({
									url: url
								})
								//更新微信用户信息
								// that.$http.userInfoUpdate({
								// 	phone: that.$queue.getJson('phone'),
								// 	encryptedData: infoRes.encryptedData,
								// 	sessionKey: sessionKey,
								// 	iv: infoRes.iv
								// })
							}
						},
						fail: function(err) {
							that.$queue.showToast("授权失败, 请重新授权")
						}
					})
				} else {
					uni.navigateTo({
						url: url
					})
				}
			},
			// 我的钱包
			goWallet() {
				uni.navigateTo({
					url: '../../sub/money/wallet/wallet?id=' + this.userId
				})
			},
			goIntegral() {
				uni.navigateTo({
					url: '../../sub/money/giftCer/giftCer'
				})
			},
		}
	};
</script>
<style lang="scss">
	page {
		position: relative;
		background-color: #f3f3f3;
		box-sizing: border-box;
	}

	.user {

		.sk {
			position: sticky;
			z-index: 1;
			top: 0upx;
			background: $uni-bg-color-main;
		}

		// 顶部
		&-header {
			width: 750upx;
			background: linear-gradient(90deg, #4FA85C 0%, #3DCB50 100%);
			display: flex;
			flex-direction: column;
			color: #FFFFFF;

			&-top {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.left {
					display: flex;
					align-items: center;
					flex: 1;
					padding-left: 24upx;

					.avatar {
						width: 96upx;
						height: 96upx;
						border-radius: 50%;
						overflow: hidden;
					}

					.content {
						display: flex;
						align-items: center;
						padding-left: 28upx;
						padding-right: 28upx;

						.username {
							max-width: 224upx;
							height: 50upx;
							line-height: 50upx;
							font-size: 36upx;
							color: #333333;
							// vertical-align: top;
							font-weight: 700;
							display: inline-block;
							overflow: hidden; //超出的文本隐藏
							text-overflow: ellipsis; //溢出用省略号显示
							white-space: nowrap; //溢出不换行
						}

						.usertype {
							display: inline-block;
							margin: 0 8upx;

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
								width: 40upx;
								height: 40upx;
								opacity: 1;
							}
						}
					}
				}

				.right {
					margin-right: 24upx;
					text-align: center;


					image {
						width: 40upx;
						height: 40upx;
					}

					.text {
						font-size: 24upx;
						color: #fff;
					}
				}
			}

		}

		// 主体
		&-content {
			padding: 24upx 24upx 0;
		}

		.order {
			margin: 0 auto 24upx;
		}

		.money {
			height: 134upx;
			display: flex;
			justify-content: space-around;
			align-items: center;
			padding-top: 0;

			&-row {
				min-width: 120upx;
				text-align: center;
				color: #333;

				.money-text {
					font-size: 32upx;
					font-weight: 700;
					margin-bottom: 8upx;
				}

				text {
					font-size: 24upx;
				}
			}

			.vertical-bar {
				width: 2upx;
				height: 48upx;
				background: #EEEEEE;
			}
		}

		// 列表
		&-wrap {
			// width: 702upx;
			border-radius: 24upx;
			margin: 0 auto 24upx;
			box-sizing: border-box;
			background: #FFFFFF;
			padding-top: 24upx;

			.cu-list.grid.no-border {
				padding: 0;
			}

			.br {
				border-radius: 24rpx;
			}

			// &:not(:last-child) {
			// 	margin-left: 24rpx;
			// 	margin-right: 24rpx;
			// 	margin-bottom: 24upx;
			// }

			&-title {
				margin-bottom: 22upx;

				.content {
					display: flex;
					justify-content: space-around;
					align-items: center;
					padding-bottom: 22upx;
					border-bottom: 2upx solid #eee;
					margin: 0 24rpx;

					image {
						width: 40upx;
						height: 40upx;
						margin-right: 8upx;
					}

					.center {
						width: 2upx;
						height: 40upx;
						background: #EEEEEE;
					}

					.row {
						display: flex;
						align-items: center;

						.num {
							font-size: 22upx;
							color: 333;
						}
					}
				}
			}

			.img {
				width: 56upx;
				height: 56upx;
				margin: 0 auto;
			}

			.padding-none {
				padding-top: 0upx;
			}
		}

		// 为你推荐
		.recommend {
			// padding: 0 24upx 24upx;

			.title {
				margin: 0 auto;
				text-align: center;

				image {
					width: 28upx;
					height: 28upx;
				}

				text {
					width: 128px;
					height: 44upx;
					font-size: 32upx;
					font-weight: 700;
					line-height: 44px;
					color: $base;
					margin: 0 16upx;
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

	.password-wrap .content .input {
		display: flex;
		align-items: center;
		border-bottom: 2upx solid #f7f7f7;
		margin: 0 28upx;

		image {
			width: 40upx;
			height: 40upx;
			margin: 0 24upx 30upx 12upx;
		}

		input {
			margin-bottom: 30upx;
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
		background: $uni-bg-color-main;
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

	.row-width {
		width: 48.5%;
		image{
			width: 340upx;
			height: 340upx;
		}
	}
</style>
