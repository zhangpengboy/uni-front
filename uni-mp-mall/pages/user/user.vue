<template>
	<view class="user">
		<!-- 用户信息 -->
		<view class="user-header">
			<!-- <view class="searchBar" :style="{height: statusBarHeight  + 'px'}"></view> :style="{ height: statusBarHeight + navBarHright  + 'px'}"
			<view class="searchNav" :style="{height: navBarHright  + 'px'}"></view> -->
			<view class="user-header-top" :style="{ 'margin-top': statusBarHeight + navBarHright  + 'px'}">
				<view class="left">
					<view class="avatar"
						@tap="toPageUser('/sub/users/profile/profile?ispartner=' + ispartner + '&id=' + userId)">
						<open-data class="avatar" type="userAvatarUrl"></open-data>
					</view>
					<view class="content">
							<view class="username">
								<open-data type="userNickName"></open-data>
							</view>
							<view class="usertype" v-if="vipStatus ==1">
								<image src="../../static/img/svipNew.png" mode=""></image>
							</view>
							<!-- <view class="usertype" v-if="vipStatus == 0"><text>普通用户</text></view> -->
						
						<!-- <view class="invite-code">
							<text>邀请码：{{myInviteCode || "暂未生成" }}</text>
						</view>
						<text class="copy" @click="textPaste">复制</text> -->
					</view>
				</view>
				<view class="right text-white" @tap="toMyQR">
					<!-- <view class="icon cuIcon-qr_code"></view> -->
					<image class="icon" src="../../static/img/qrCode@2x.png" mode=""></image>
					<text>邀请码</text>
				</view>
			</view>
			<view class="user-header-money">
				<view class="content">
					<view class="row" @click="goWallet">
						<image src="../../static/img/hongbao@2x.png" mode=""></image>
						<view class="text">
							<view class="num">{{userMoney}}</view>
							<view class="unit">红包（元）</view>
						</view>
					</view>
					<view class="center"></view>
					<view class="row" @click="goIntegral">
						<image src="../../static/img/gift@2x.png" mode=""></image>
						<view class="text">
							<view class="num">{{userIntegral}}</view>
							<view class="unit">{{$queue.getIntegralName()}}（个）</view>
						</view>
					</view>
				</view>
			</view>
			<!-- <view class="user-header-bottom"> -->
				<!-- <view class="tag">关注 <text class="padding-left-sm">{{ favorStores }}</text></view>
				<view class="line"></view>
				<view class="tag" @tap="toPage('/sub/goods/favorite/favorite')">收藏 <text
						class="padding-left-sm">{{ favorGoods }}</text></view> -->
				<!-- <view class="focusOn" @click="toPage('/sub/stores/store/storeList')">
					<view class="">{{favorStores}}</view>
					<view class="">店铺关注</view>
				</view>
				<view class="collection" @click="toPage('/sub/goods/favorite/favorite')">
					<view class="">{{favorGoods}}</view>
					<view class="">商品收藏</view>
				</view> -->
				<!-- <view class="browse">
					<view class="">5</view>
					<view class="">浏览记录</view>
				</view> -->
			<!-- </view> -->
		</view>

		<!-- 主体 -->
		<view class="user-content">
			<!-- <view class="user-content-money">
				<view class="user-content-money__item" @click="goWallet">
					<view class="box">
						<view class="num">{{userMoney}}</view>
						<view class="text">红包(元)</view>
					</view>
					<image src="/static/img/user/money-icon1@2x.png" class="img"></image>
				</view>
				<view class="line"></view>
				<view class="user-content-money__item" @click="goIntegral">
					<view class="box">
						<view class="num">{{userIntegral}}</view>
						<view class="text">{{$queue.getIntegralName()}}(个)</view>
					</view>
					<image src="/static/img/user/money-icon2@2x.png" class="img"></image>
				</view>
			</view> -->

			<!-- 占位  -->
			<!-- <view class="user-palce"></view> -->

			<!-- 我的订单 -->
			<view class="user-wrap">
				<view class="user-wrap-title">
					<!-- <view>我的订单</view>
					<view class="text-sm text-gray" @click="toPage('/sub/orders/orderList/orderList')">
						<text>全部订单</text>
						<text class="cuIcon-right"></text>
					</view> -->
					<view class="content">
						<view class="row" @click="toPage('/sub/stores/store/storeList')">
							<image src="../../static/img/user/icon_shop@2x.png" mode=""></image>
							<view class="num">店铺关注&nbsp;&nbsp;{{favorStores}}</view>
						</view>
						<view class="center"></view>
						<view class="row" @click="toPage('/sub/goods/favorite/favorite')">
							<image src="../../static/img/user/icon_collect@2x.png" mode=""></image>
							<view class="num">商品收藏&nbsp;&nbsp;{{favorGoods}}</view>
						</view>
					</view>
				</view>
				<view class="cu-list grid col-5 no-border br">
					<view class="cu-item" v-for="(v,i) in mybarList" :key="i" @tap="toPage(v.url)">
						<view v-if="i != 4 && v.badge > 0" class='cu-tag badge'>{{ v.badge > 99 ? '99+' : v.badge }}</view>
						<image :src="v.icon" class="img"></image>
						<text class="padding-top-xs padding-none">{{v.text}}</text>
					</view>
				</view>
			</view>

			<!-- 开通vip -->
			<view class="vip">
				<view class="left">
					<image src="../../static/img/user/vipbg@2x.png" mode=""></image>
					<view class="text">
						<view class="one">{{ vipStatus == 0 ? '开通' : '续费' }}VIP</view>
						<view class="two">{{ vipStatus == 0 ? '开通' : '续费' }}会员享超值特权</view>
					</view>
				</view>
				<view type="default" class="but" @tap="toPage('/sub/vipMembers/vipMembersInterests?vipStatus='+vipStatus)">立即{{ vipStatus == 0 ? '开通' : '续费' }}</view>
			</view>
			<view class="user-wrap">
				<!-- <view class="user-wrap-title">我的服务</view> -->
				<view class="cu-list grid col-5 no-border br">
					<block v-for="(v,i) in myServiceList" :key="i">
						<view class="cu-item" v-if="!v.isShow" @tap="toPage(v.url)">
							<button v-if="v.text == '官方客服'" class="btnqd" open-type="contact" :session-from="data">
								<image :src="v.icon" class="img"></image>
								<text class="padding-top-xs padding-none">{{v.text}}</text>
							</button>
							<picker v-else-if="v.text == '我的云店'" v-model="index" @change="bindPickerChange"
								:value="index" :range="shopList" range-key="storeName">
								<image :src="v.icon" class="img"></image>
								<text class="padding-top-xs padding-none">{{v.text}}</text>
							</picker>
							<view class="" v-else>
								<image :src="v.icon" class="img"></image>
								<text class="padding-top-xs padding-none">{{v.text}}</text>
							</view>
						</view>
					</block>
				</view>
			</view>
			<view class="password-wrap" v-if="digitalshelveswrapper == 1">
				<view class="bg"></view>
				<view class="content">
					<view class="close" @click="digitalshelveswrapper = 0">+</view>
					<view class="title">开通数字货架</view>
					<view class="input">
						<image src="../../static/img/user/phoneNum.png" mode=""></image>
						<input type="text" v-model="phoneNum" placeholder="请输入业务员手机号码"
							placeholder-style="color: #C1C1C1" />
					</view>
					<button class="btn" @click="sendNext">下一步</button>
				</view>
			</view>
			<!-- 是否绑定手机号 -->
			<view class="password-wrap" v-if="isPhone">
				<view class="bg"></view>
				<view class="content">
					<!-- <view class="close" @click="isPhone = false">+</view> -->
					<view class="title">当前账户未绑定手机号</view>
					<button class="btn" open-type="getPhoneNumber" withCredentials="true" lang="zh_CN"
						@getphonenumber="handleGetPhoneNumber">绑定手机号</button>
				</view>
			</view>
			<!-- 是否需要弹出邀请人弹框 -->
			<view class="password-wrap" v-if="isInviteCode">
				<view class="bg"></view>
				<view class="content">
					<!-- <view class="close" @click="isPhone = false">+</view> -->
					<view class="text-gray phone">
						<input type="text" v-model="invitePhone" placeholder="请输入邀请人的手机号" maxlength="11" @input="onInput()"/>
					</view>
					<button class="btn" hover-class="none" lang="zh_CN" @tap="getInviteCode">{{ switchFlag ? '确认': '跳过' }}</button>
				</view>
			</view>
			<!-- 商家服务 -->
			<!-- <view class="user-wrap">
				<view class="user-wrap-title">商家服务</view>
				<view class="cu-list grid col-4 no-border">
					<view class="cu-item" v-for="(v,i) in storeServiceList" :key="i" @tap="toPage(v.url)">
						<view class="">
						<image :src="v.icon" class="img"></image>
						<text class="padding-top-xs">{{v.text}}</text>
						</view>
					</view>
				</view>
			</view> -->
		</view>

	</view>
</template>
<script>
	export default {
		data() {
			return {
				userBg: '',
				moneyBg: '',
				data: {},
				statusBarHeight: 0,
				navBarHright: 0,
				windowHeight: 0,
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
				invitePhone: '', // 邀请人手机号
				isInviteCode: false,
				switchFlag: true,
				inviteCode: '',
				// cashierFlag: null, // 是否从收银台登陆进来的
				badgeList:[0, 0, 0, 0],
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
				// 我的服务
				myServiceList: [
					// {
					// 	url: '/sub/giftbag/giftbag/giftbag',
					// 	text: '福袋',
					// 	icon: '/static/img/user/giftbag.png'
					// },
					// {
					// 	url: '/sub/giftbag/retroactive/retroactive',
					// 	text: '签到',
					// 	icon: '/static/img/user/signin.png'
					// }, 
					{
						url: '/sub/users/address/address',
						text: '地址',
						icon: '/static/img/user/dress@2x.png'
					},
					// {
					// 	url: `/sub/webview/business/business?webUrl=${encodeURIComponent(this.$queue.publicYuMing() + '/business')}`,
					// 	text: '商务合作',
					// 	icon: '/static/img/user/icon-busines.png'
					// },
					// {
					// 	// url: `/sub/webview/service/service?webUrl=${encodeURIComponent('https://wpa1.qq.com/SVEwR648?_type=wpa&qidian=true')}`,
					// 	// url: `/sub/webview/storeLogin/storeLogin`,
					// 	text: '官方客服',
					// 	icon: '/static/img/user/customerservice.png'
					// },
					// {
					// 	url: `/sub/stores/store/storeDetail`,
					// 	text: '我的云店',
					// 	icon: '/static/img/user/store-goods@2x.png',
					// 	isShow: true
					// },
					{
						url: `/sub/webview/storeLogin/storeLogin`,
						text: '礼券码',
						icon: '/static/img/user/gift@2x.png'
					},
					// {
					// 	url: 'digitalshelveswrapper',
					// 	text: '数字货架',
					// 	icon: '/static/img/user/digitalshelves.png'
					// },
					// {
					// 	url: 'storeGiftMother',
					// 	text: '云创业',
					// 	icon: '/static/img/user/starmom.png'
					// },
					// {
					// 	url: `/sub/vipMembers/vipMembersInterests`,
					// 	text: 'vip充值',
					// 	icon: '/static/img/user/starmom.png'
					// },
					// {
					// 	url: 'publicTheAgentYuMing',
					// 	text: '代理商',
					// 	icon: '/static/img/user/theagent.png'
					// },
					{
						url: 'myTeam',
						text: '我的邀请',
						icon: '/static/img/user/myTeam@2x.png'
					}
				],
			};
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			this.mybarList = [{
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
				]
			this.getUserDetail();
			this.getUserDetail();
			this.getUsermallUser()
			// setTimeout(function() {
			// 	uni.stopPullDownRefresh();
			// }, 1000);
		},
		onLoad() {
			// 获取设备状态栏高度
			this.getSystemdata();
			// this.cashierFlag = this.$queue.getData("cashierFlag")
		},
		onShow() {
			if (this.hasLogin) {
				this.userBg = `${this.$queue.publicCdnHost()}/assets/imgs/userBg@2x.png`
				this.moneyBg = `${this.$queue.publicCdnHost()}/assets/imgs/moneyBg@2x.png`
				// this.getStoreList();
				this.getUserDetail();
				this.getUsermallUser()
				return
			}
			uni.redirectTo({
				url: "/pages/login/login?page=user"
			})
		},
		methods: {
			getUserProfileCode() {
				// 是否需要弹出邀请码弹框 【0：开启；1：关闭；2：允许跳过】
				this.$http.getInviteConfig({
					userId: this.userId
				}).then(res => {
					if (res.code == 200) {
						if (res.data == 0) {
							this.isInviteCode = true
							this.switchFlag = true
						}else if (res.data == 1) {
							this.isInviteCode = false
							this.switchFlag = false
						}else {
							this.isInviteCode = true
							this.switchFlag = false
						}
					}
				})
			},
			onInput() {
				if(this.invitePhone) {
					this.switchFlag = true
				}else {
					this.switchFlag = false
				}
			},
			// 根据手机号绑定邀请关系
			getInviteCode() {
				if(this.switchFlag) {
					if(!this.invitePhone) return this.$queue.showToast('手机号不能为空')
					this.$http.bindRelation({
						inviterPhone:this.invitePhone,
						userId: this.userId
					}).then(res => {
						if (res.code == 200) {
							this.$queue.showToast('已绑定成功')
							this.isInviteCode = false
						}else {
							this.$queue.showToast(res.message)
						}
					})
				}else {
					// this.isInviteCode = false
					if(this.invitePhone) {
						this.$http.bindRelation({
							inviterPhone:this.invitePhone,
							userId: this.userId
						}).then(res => {
							if (res.code == 200) {
								this.$queue.showToast('已绑定成功')
								this.isInviteCode = false
							}else {
								this.$queue.showToast(res.message)
							}
						})
					}else {
						this.$http.bindRelation({
							regRequireInvite: 1,
							userId: this.userId
						}).then(res => {
							if (res.code == 200) {
								this.isInviteCode = false
							}else {
								this.$queue.showToast(res.message)
							}
						})
					}
					
				}
			},
			// 获取订单数量
			getOrderCount() {
				this.$http.getOrderCount({userId: this.userId}).then(res => {
					// console.log(res.data['0'])
					// if(res.data['0'] > 0) this.$set(this.mybarList[0].badge, res.data['0'] * 1) 
					if (res.data['0']  * 1 > 0) {
						this.mybarList[0].badge = res.data['0'] * 1
					}
					if (res.data['1'] * 1 > 0) this.mybarList[1].badge = res.data['1'] * 1
					if (res.data['2'] * 1 > 0) this.mybarList[2].badge = res.data['2'] * 1
					if (res.data['6'] * 1 > 0 || res.data['7'] * 1 > 0) {
						this.mybarList[3].badge = res.data['6'] * 1 + res.data['7'] * 1
					}
					// console.log(this.mybarList)
					
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
				// this.heightDiff = data.top - this.statusBarHeight
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
										that.getUserProfileCode()
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
							}else {
								this.getUserProfileCode()
							// 	if (this.cashierFlag != 1) {
							// 	// 	this.getUserProfileCode()
							// 	// }
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
		background-color: #f7f7f7;
		box-sizing: border-box;
	}

	.user {

		// 顶部
		&-header {
			width: 750upx;
			// height: 350upx;
			background: url('https://lz.static.seprain.com/assets/imgs/userBg@2x.png') no-repeat;
			background-size: 100%;
			z-index: -1;
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
						width: 128upx;
						height: 128upx;
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

						.invite-code {
							display: inline-block;
							// width: 244upx;
							height: 44upx;
							background: linear-gradient(270deg, #EF3516 0%, #FB5D26 100%);
							opacity: 1;
							border-radius: 40upx;
							font-size: 24upx;
							font-weight: 300;
							line-height: 44upx;
							padding: 0upx 46upx 0upx 16upx;
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
					width: 136upx;
					height: 48upx;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 12px 0px 0px 12px;
					background: #fff;

					.icon {
						width: 32upx;
						height: 32upx;
						margin-right: 8upx;
					}
					
					text {
						width: 72upx;
						height: 32upx;
						font-size: 24upx;
						font-weight: 700;
						line-height: 32upx;
						text-align: center;
						color: #333333;
						opacity: 1;
					}
				}
			}
			
			// 红包
			&-money {
				// width: 100%;
				height: 140upx;
				padding: 0 24upx;
				margin: 32upx 0 24upx;
				
				.content {
					width: 100%;
					height: 140upx;
					display: flex;
					justify-content: space-around;
					align-items: center;
					background: url('https://lz.static.seprain.com/assets/imgs/moneyBg@2x.png') no-repeat;
					background-size: 100%;
					
					image {
						width: 98upx;
						height: 98upx;
						margin-right: 20upx;
					}
					.row {
						display: flex;
						align-items: center;
						
						.text {
							color: #333;
							text-align: center;
							.num {
								font-size: 32upx;
								font-weight: 700;
							}
							.unit {
								font-size: 26upx;
							}
						}
					}
					.center {
						width: 2upx;
						height: 64upx;
						background: #F6E6B3;
						opacity: 1;
					}
				}
			}
			
			&-bottom {
				display: flex;
				justify-content: space-around;
				text-align: center;
				font-size: 24upx;
				color: #333333;
				opacity: 1;

				.focusOn {
					width: 30%;
				}

				.collection {
					width: 30%;
				}

				.browse {
					width: 30%;
				}

				// .tag {
				// 	font-size: 26upx;
				// 	line-height: 36upx;
				// }

				// .line {
				// 	width: 2upx;
				// 	height: 24upx;
				// 	line-height: 36upx;
				// 	margin-left: 28upx;
				// 	margin-right: 28upx;
				// 	background: #F27B4F;
				// }
			}
		}

		// 主体
		&-content {
			min-height: 700upx;
			border-radius: 68upx 68upx 0 0;
			// position: relative;
			// top: -66upx;
			background: #f7f7f7;


			&-money {
				box-sizing: border-box;
				background: #FFFFFF;
				display: flex;
				width: 702upx;
				border-radius: 16upx;
				position: absolute;
				top: -70upx;
				left: 50%;
				transform: translateX(-50%);

				&__item {
					flex: 1;
					display: flex;
					justify-content: center;
					align-items: center;
					padding: 30upx;

					.box {
						flex: 1;
						text-align: center;

						.num {
							font-size: 36upx;
							font-weight: 600;
							line-height: 44upx;
							margin-bottom: 5upx;
						}

						.text {
							font-size: 24upx;
							line-height: 36upx;
							color: #666666;
						}
					}

					.img {
						width: 80upx;
						height: 80upx;
						margin-right: 30upx;
					}
				}

				.line {
					position: absolute;
					width: 2upx;
					height: 72upx;
					background: #EEEEEE;
					left: 50%;
					top: 50%;
					transform: translate(-50%, -50%);
				}
			}

		}

		.vip {
			height: 156upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background: #FFFFFF;
			opacity: 1;
			border-radius: 24upx;
			padding: 0 24upx;
			margin: 24upx;

			.left {
				display: flex;
				align-items: center;

				image {
					width: 160upx;
					height: 152upx;
					margin-right: 16upx;
				}

				.one {
					font-size: 32rpx;
					color: #333;
					font-weight: 700;
					margin-bottom: 24rpx;
				}

				.two {
					font-size: 26rpx;
					color: #666;
				}
			}

			.but {
				width: 162upx;
				height: 52upx;
				font-size: 26upx;
				color: #fff;
				background: linear-gradient(143deg, #F32A2A 0%, #FF6B3A 100%);
				opacity: 1;
				border-radius: 160upx;
				line-height: 52upx;
				text-align: center;
				margin: 0;
			}
		}

		// 占位
		&-palce {
			height: 100upx;
		}

		// 列表
		&-wrap {
			width: 702upx;
			border-radius: 24upx;
			box-sizing: border-box;
			margin: 0 auto;
			background: #FFFFFF;
			padding-top: 24upx;

			.cu-list.grid.no-border {
				padding: 0;
			}
			
			.br {
				border-radius: 24rpx;
			}
			
			&:not(:last-child) {
				margin-left: 24rpx;
				margin-right: 24rpx;
				margin-bottom: 24upx;
			}

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

			.btnqd {
				background-color: #fff;
				position: relative;
				padding-left: 0upx;
				padding-right: 0upx;

				image {
					position: absolute;
					top: 24%;
					left: 50%;
					transform: translate(-50%, -50%);
				}

				text {
					padding-top: 63upx;
				}
			}

			.btnqd::after {
				border: 0;
			}
		}

	}

	.phone{
		width: 60%;
		border-bottom: 1rpx solid #dcd1d1;
		margin: 80upx auto 0;
		input {
			padding: 20upx;
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
</style>
