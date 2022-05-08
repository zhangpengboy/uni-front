<template>
	<view class="">
		<view class="logo">
			<image src="/static/img/logo.png" mode=""></image>
			<view>引客、留客、锁客专家</view>
		</view>
		<view class="storeLogin">
			<view class="account">
				<view class="title">账号: </view>
				<input class="input" ref="input1" v-model="account" @blur="getAccount" placeholder="请输入账号" maxlength=11
					placeholder-style="color: #C1C1C1;" />
			</view>
			<view class="account">
				<view class="title">密码: </view>
				<input class="input" password type="text" v-model="password" @input="getPassword" placeholder="请输入密码"
					placeholder-style="color: #C1C1C1;" />
			</view>
			<!-- <view class="account">
				<view class="title">店铺: </view>
				<picker style="padding: 12rpx 0rpx 36rpx;" v-model="index" @change="bindPickerChange" :value="index"
					:range="shopList" range-key="storeName">
					<text v-if="index != ''">{{shopList[index].storeName}}</text>
					<text v-if="index == '' && shopList.length">{{shopList[0].storeName}}</text>
					<text v-if="index == '' && shopList.length == 0" style="color: #C1C1C1">请选择店铺</text>
				</picker>
			</view> -->
			<view class="editPassword">
				<text @click="resetpassword">重置登录密码</text>
			</view>
			<view class="button">
				<button type="default" @click="storeLogin">登录</button>
			</view>
			<view class="reg_btn">
				<button type="default" @click="storeRegister">注册</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				password: '',
				account: '',
				shopList: [],
				selectStore: null,
				index: '',
				allStoreList: []
			};
		},
		onShow() {
			// this.password = ''
			// this.account = ''
			this.index = ''
			this.shopList = []
		},
		onUnload() {
			if (!this.$queue.getJson('store')) {
				uni.switchTab({
					url: "/pages/user/user"
				})
			}
		},
		methods: {
			async storeLogin() {
				uni.showLoading({
					title: '登录中'
				});
				let obj = {}
				obj.phone = this.account
				obj.password = this.password
				if (this.account == "") {
					this.$queue.showToast('请输入账号')
					return
				}
				if (this.password == "") {
					this.$queue.showToast('请输入密码')
					return
				}
				// if (this.index == "") {
				// if (this.selectStore == null) {
				// 	this.$queue.showToast('暂无可登录店铺')
				// 	return
				// }
				if (this.allStoreList.length == 0) {
					this.$queue.showToast('暂无店铺')
					return
				}

				const res = await this.$http.storeLogin(obj);
				if (res.code == 200) {
					this.$queue.setData('account', res.data.phone)
					this.$queue.setJson('storeToken', res.data)
					this.$queue.setJson('store', this.selectStore)
					if (this.allStoreList.length && this.shopList.length == 0) {
						// 跳转注册店铺
						this.storeRegister();
						return
					}
					uni.navigateTo({
						url: '/sub/webview/certificates/certificates'
					});
					uni.hideLoading()
				} else {
					uni.hideLoading()
					this.$queue.showToast(res.message)
				}
			},
			// 切换店铺
			bindPickerChange(e) {
				if (this.shopList.length != 0) {
					this.index = e.target.value
					this.shopList.map((item, index) => {
						if (index == e.target.value) {
							this.selectStore = item
						}
					})
				}
			},
			getAccount(e) {
				this.account = e.detail.value.replace(/\s+/g, '')
				this.$http.getStoreInfoByPhone({
					phone: this.account
				}).then(res => {
					if (res.code == 200) {
						let arr = []
						this.allStoreList = JSON.parse(JSON.stringify(res.data))
						res.data.map(item => {
							if (item.status == 0 && (item.storeRoleCode == 0 || item.storeRoleCode == 1 || item.storeRoleCode == 3 ||
									item.storeRoleCode == 4 || item.storeRoleCode == 5)) {
								arr.push(item)
							}
						})
						this.shopList = arr
						if (this.shopList.length != 0) {
							this.shopList.map((item, index) => {
								if (index == 0) {
									this.selectStore = item
								}
							})
						}
						console.log(this.selectStore)
					}
				})
			},
			getPassword(e) {
				this.password = e.detail.value.replace(/\s+/g, '')
			},
			// 重置登录密码
			resetpassword() {
				uni.navigateTo({
					url: './resetpassword'
				})
			},
			storeRegister() {
				uni.navigateTo({
					url: `/sub/webview/index/index?webUrl=${encodeURIComponent(this.$queue.publicStoreYuMing() + '/register?inWay=default&type=1')}`
				})
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
	}

	.logo {
		height: 300rpx;
		background-color: #f4f4f4;
		text-align: center;

		image {
			width: 132rpx;
			height: 132rpx;
			opacity: 1;
			border-radius: 8px;
			margin-top: 42rpx;
			margin-bottom: 24rpx;
		}

		view {
			font-size: 28upx;
			color: #EB6133;
		}
	}

	.storeLogin {
		margin: 28rpx 64rpx 0rpx;

		.account {
			border-bottom: 2rpx solid #F7F7F7;
			overflow: hidden;
		}

		.title {
			margin: 36rpx 0rpx 24rpx;
			color: #333333;
			font-size: 32rpx;
			font-weight: 400;
		}

		.input {
			width: 460rpx;
			height: 60rpx;
			margin-bottom: 24rpx;
			// border: 2rpx solid #000 ;

		}

		.editPassword {
			margin: 20upx 0upx;
			color: #eb6133;
			text-align: right;
		}

		.button {
			margin: 54rpx auto 0rpx;

			button {
				width: 524rpx;
				height: 76rpx;
				background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
				font-size: 28rpx;
				text-align: center;
				line-height: 76rpx;
				color: #FFFFFF;
				border-radius: 50rpx;
			}
		}

		.reg_btn button {
			width: 524rpx;
			height: 76rpx;
			font-size: 28rpx;
			text-align: center;
			line-height: 76rpx;
			border-radius: 50rpx;
			background: #FFFFFF;
			margin-top: 30rpx;
			color: #EB6133;
		}

		.reg_btn button::after {
			border: 0;
		}
	}
</style>
