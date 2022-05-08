<template>
	<view class="">
		<view class="members">
			<view class="members_my" style="">
				<view class="members_header">
					<view class="left" bindtap="personal">
						<view class="left_img">
							<open-data class="left_img" type="userAvatarUrl"></open-data>
						</view>
						<view
							style="margin-top:12rpx;font-size:28rpx;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 180upx;">
							<open-data type="userNickName"></open-data>
							<image class="view_left_img" src="../../../static/img/jinru.png"></image>
						</view>
						<text style="font-size:24rpx;color:#FFF2D7;">{{userPhone}}</text>
					</view>
					<view class="right" @click="gotoStoreLogin">
						切换店铺
					</view>
				</view>
				<!-- <view class="members_center">
					<image src="../../../static/img/huiyuan.png"></image>
					会员中心 >
				</view> -->
			</view>
		</view>

		<view class="my_boderR" style="height: 50rpx; line-height: 50rpx;">
			<text class="storeName">商户名称： {{storeName}}</text>
			<view class="shopList">
				<text>{{ storeRoleName }}</text>
			</view>
		</view>
		<view class="my_boderR">
			<view class="my_nav">
				<view @click="earnings">
					<image class="image" src="../static/img/icon_1.png"></image>
					资金管理
				</view>
				<view @click="goDetails" v-if="storeInfo.storeRoleCode != 1">
					<image class="image" src="../static/img/icon_2.png"></image>
					收银台
				</view>
				<view @click="goBuy" v-if="storeInfo.storeRoleCode != 1">
					<image class="image" src="../static/img/icon_3.png"></image>
					购买礼券
				</view>
				<view @click="goConfig" v-if="storeInfo.storeRoleCode != 1">
					<image class="image" src="../static/img/icon_4.png"></image>
					礼券配置
				</view>
				<!-- <view @click="goPayConfig">
					<image class="image" src="../static/img/payConfig@2x.png"></image>
					支付配置
				</view> -->
				<view @click="goStore">
					<image class="image" src="../static/img/store-icon.png"></image>
					商户后台
				</view>
			</view>
		</view>
		<view class="qr_code my_boderR" v-if="storeInfo.storeRoleCode != 1">
			<view class="my_title">店铺礼券码</view>
			<view class="img_phone" v-if="isshow">
				<image @click="handleSaveQrCode" :src="url"></image>
				<text @click="handleSaveQrCode">点击导出二维码</text>
			</view>
			<view class="button" v-else>
				<button type="default" @click="goNotify">开通礼券码</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatarUrl: '',
				nickName: '',
				liquan: '0',
				cashLiquan: '0',
				// 商家店铺信息列表
				storeInfo: [],
				// 当前店铺名称
				storeName: '',
				// 当前店铺id
				storeId: '',
				// 商家店铺列表
				shopList: [],
				index: 0,
				// 礼券码路径
				url: '',
				// 下载礼券码
				downloadImg: null,
				// 是否开通礼券码
				isBuyCoupons: false,
				// 店铺类别id
				storeRoleCode: null,
				storeAccountId: '1342347396604375040',
				isshow: true,
				storeRoleName: ''
			};
		},
		onLoad(options) {
		},
		onUnload() {
			uni.switchTab({
				url: "/pages/user/user"
			});
		},
		onShow() {
			this.getShoplist()
			this.getStoreQRCode()
		},
		methods: {
			//切换店铺
			gotoStoreLogin() {
				// this.$queue.remove('store')
				uni.navigateTo({
					url: '/sub/webview/certificates/storeList?phone=' + this.$queue.getData('account')
				})
			},
			// 收益管理
			earnings() {
				uni.navigateTo({
					url: '/sub/webview/certificates/accounts?storeId=' + this.storeId
				})
			},
			// 商店列表
			async getShoplist() {
				uni.showLoading({
					title: '加载中'
				});
				this.storeInfo = this.$queue.getJson('store')
				this.storeRoleName = this.storeInfo.storeRoleName
				this.storeName = this.storeInfo.storeName
				this.storeId = this.storeInfo.id
				this.isBuyCoupons = this.storeInfo.isBuyCoupons
				this.storeRoleCode = this.storeInfo.storeRoleCode
				uni.hideLoading()
			},
			//获取礼券二维码
			async getStoreQRCode() {
				uni.showLoading({
					title: '加载中'
				});
				let obj = {}
				// obj.path = "pages/pays/cashier/cashier"
				obj.path = "pages/logs/logs"
				obj.scene = this.storeId
				let res = await this.$http.getStoreQRCode(obj)
				if (res.code == 200) {
					this.isshow = true
					this.url = "data:image/png;base64," + res.data.base64.replace(/[\r\n]/g, '');
					this.downloadImg = res.data.base64;
				} else {
					this.isshow = false
				}
				uni.hideLoading()
			},
			//礼券详情
			goDetails() {
				uni.navigateTo({
					url: '/sub/webview/certificates/detail?storeId=' + this.storeId
				});
			},
			//礼券购买
			goBuy() {
				if (!this.isshow) {
					this.goNotify()
					return
				}
				uni.navigateTo({
					url: '/sub/webview/certificates/buy?storeId=' + this.storeId + '&storeRoleCode=' + this
						.storeRoleCode + '&storeName=' + this.storeName
				});
			},
			//赠送配置
			goConfig() {
				if (!this.isshow) return this.$queue.showToast('请先开通礼券码')
				uni.navigateTo({
					url: '/sub/webview/certificates/config?storeId=' + this.storeId
				});
			},
			//支付配置
			goPayConfig() {
				uni.navigateTo({
					url: '/sub/webview/business/business?webUrl=' + encodeURIComponent(this
						.$queue.publicTheAgentYuMing() + '/mchType?storeId=' + this
						.storeId)
				})
			},
			//商户后台
			goStore() {
				uni.navigateTo({
					url: '/sub/webview/business/business?webUrl=' + encodeURIComponent(this
						.$queue.publicStoreYuMing())
				})
			},
			//礼券开通
			goNotify() {
				uni.navigateTo({
					url: '/sub/webview/certificates/notify?storeId=' + this.storeId + '&roleCode=' + this
						.storeRoleCode + '&storeName=' + this.storeName
				});
			},
			/* 保存二维码 */
			handleSaveQrCode() {
				uni.showLoading({
					title: '正在保存'
				});
				var imgSrc = this.downloadImg; // base64编码
				var save = wx.getFileSystemManager(); // 获取文件管理器对象
				var number = Math.random();
				save.writeFile({
					filePath: wx.env.USER_DATA_PATH + '/jms_pic_' + number + '.png', // 表示生成一个临时文件名
					data: imgSrc,
					encoding: 'base64',
					success: res => {
						wx.saveImageToPhotosAlbum({
							filePath: wx.env.USER_DATA_PATH + '/jms_pic_' + number + '.png',
							success: function(res) {
								uni.showToast({
									title: '保存成功',
								})
							},
							fail: function(err) {
							}
						})
						uni.hideLoading()
					},
					fail: err => {
						uni.hideLoading()
					}
				})
			},
		}
	};
</script>

<style lang="scss">
	@font-face {
		font-family: "iconfont";
		src: url('//at.alicdn.com/t/font_2377339_wg8cucom9w.eot?t=1617019151606');
		/* IE9 */
		src: url('//at.alicdn.com/t/font_2377339_wg8cucom9w.eot?t=1617019151606#iefix') format('embedded-opentype'),
			/* IE6-IE8 */
			url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAJwAAsAAAAABhQAAAIkAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCCcAocPwE2AiQDCAsGAAQgBYRtBzQbaQXIrjBusUkbIjlEz2Zj0Gf6kQdAVRHB9/v99tx3vzieVCPJJIsmS5CYbiGRICRSJRWyZzLr7Z9WzSmFEm1sH81cqFqWkhAJTbE1ZztCYSPUiBShQv/X5r+cXZYO3HrBl1lcV/wfDqwuP5/ncnoT6EDmBzrX1do01sTeUS/AOJAC3QOjyEoo44axC17gYwJ1wzTc3Z5vVklmrwrErW+UVSqkZJlVq0K54WAWL0qq6SnF8hx9P371okRSKth9Bzcb15p/cOr2//87DwhpAjpeQoFFIBMnjaU9WcE4pV7KGQfH6g4+VBAUR/UJ9tfZnU0wCMvBB2+lAAkea6oClUnHiOKxcT38M4k1hz8rrjLLEMHsaxubq38lMnj/zcibDYuA6jrh4N3VgUPZ0O1Aypra6EzmCRLq6viHYz3u1IET1UJV/4RIxVCGQtUkmdlFlDQsoaxqA3ULwvGGXl1W5BrmTYDQZSFpe0OhyyYze1Ay4KGsK7KoO4veCxumw6/sMCpBF9IPqkOJdkNSibsvaNJIcV6P+Afyy8+Ca3XK1R0myEtskbfpDdHATDF48BxGEUFjCtCRVhF5zqitm97UyhRbFTsYUgRygeQHVA6S0MF4Ual8/gIZqYjCHaa68gGxF3924Bh2ALmzJ4NMj/KKeDN6BqEBxkgMeDAPRSIEtOZ5AeQQLWVC4WmGnFE81N7a3hn/3Qmosz0pnPpC/c5XgduUCKWWBQAA') format('woff2'),
			url('//at.alicdn.com/t/font_2377339_wg8cucom9w.woff?t=1617019151606') format('woff'),
			url('//at.alicdn.com/t/font_2377339_wg8cucom9w.ttf?t=1617019151606') format('truetype'),
			/* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
			url('//at.alicdn.com/t/font_2377339_wg8cucom9w.svg?t=1617019151606#iconfont') format('svg');
		/* iOS 4.1- */
	}

	.iconfont {
		font-family: "iconfont" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		position: relative;
		overflow: hidden;
	}

	.icon-xiajiantou:before {
		content: "\e615";
	}

	.members {
		padding: 24rpx 0rpx 0rpx
	}

	.members_my {
		height: 200rpx;
		background: url('https://ytb.static.lanceyi.com/images/348a87abc5f0870ed4d0e6085fd032fb-lr2slq9bm9.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center center;
		width: auto;
	}

	.members_header {
		overflow: hidden;
		padding: 30rpx 60rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.members_header .left {
		font-size: 26rpx;
		color: #fff;
		// float: left;
		width: 380rpx;
	}

	.members_header .right {
		font-size: 24rpx;
		color: #fff;
		border: 2upx solid #fff;
		border-radius: 48upx;
		padding: 8upx 16upx;
		// float: right;
		// width: 120rpx;
	}

	.members_header .left text {
		font-size: 32rpx;
		color: #fff;
		display: block;
		/* width: 500rpx; */
		margin-top: 10rpx;
		margin-left: 10rpx;
	}

	.members_header .left .left_img {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		float: left;
		margin-right: 20rpx;
		overflow: hidden;
	}

	.img_phone {
		text-align: center;
		font-size: 24rpx;
	}

	.members_money {
		display: flex;
		justify-content: space-around;
		margin-top: 50rpx;
	}

	.members_money view {
		color: #fff;
		font-size: 26rpx;
		text-align: center;
	}

	.members_money text {
		display: block;
		justify-content: space-around;
		text-align: center;
		color: #fff;
		font-size: 26rpx;
		margin-top: 20rpx;
	}

	.members_money image {
		display: inline-block;
		vertical-align: middle;
		width: 26rpx;
		height: 26rpx;
	}

	.giftNum {
		font-size: 24rpx;
		color: #FFF2D7;

		text {
			display: inline-block;
			margin-left: 8rpx;
			font-size: 22rpx;
		}
	}

	.view_left_img {
		width: 20rpx;
		height: 20rpx;
		display: inline-block;
		margin-left: 20rpx;
	}

	.members_center {
		width: auto;
		height: 60rpx;
		line-height: 60rpx;
		position: absolute;
		top: 10%;
		right: 24rpx;
		font-size: 26rpx;
		background: #000;
		color: #fff;
		padding: 8rpx 20rpx;
		border-top-left-radius: 50rpx;
		border-bottom-left-radius: 50rpx;
		background: -webkit-linear-gradient(left, #b23e28, #d55030, #f46136);
	}

	.members_center image {
		width: 30rpx;
		height: 30rpx;
		/* display: inline-block; */
		background: #fff;
		border-radius: 50%;
		padding: 10rpx;
		float: left;
		margin-right: 16rpx;
		margin-top: 8rpx;
	}

	.storeName {
		float: left;
		width: 70%;
		overflow: hidden; //超出的文本隐藏
		text-overflow: ellipsis; //溢出用省略号显示
		white-space: nowrap; //溢出不换行
	}

	.shopList {
		float: right;
	}

	.my_boderR {
		background: #fff;
		border-radius: 30rpx;
		margin-bottom: 50rpx;
		padding: 30rpx 40rpx;
		margin-left: 20rpx;
		margin-right: 20rpx;

		.my_nav {
			display: flex;
			justify-content: space-between;
			font-size: 26rpx;
			color: #333;

			.my_nav view {
				text-align: center;
			}


		}
	}

	.my_nav .image {
		display: block;
		width: 56rpx;
		height: 56rpx;
		margin: 20rpx auto;
	}

	.qr_code image {
		width: 300rpx;
		height: 300rpx;
		display: block;
		margin: 40rpx auto 20rpx;
	}

	.qr_code .button {
		position: relative;
		width: 300rpx;
		height: 300rpx;
	}

	.qr_code button {
		top: 40%;
		left: 50%;
		width: 180rpx;
		font-size: 24rpx;
	}
</style>
