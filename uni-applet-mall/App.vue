<script>
	import Vue from 'vue';
	export default {
		// 全局对象
		globalData: {},
		onLaunch: function(e) {
			// ========== 小程序更新 start==================
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(function(res) {
				console.log(res.hasUpdate); // 请求完新版本信息的回调
			});
			updateManager.onUpdateReady(function(res) {
				uni.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否重启应用？',
					success(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						}
					}
				});
			});
			// ========== 小程序更新 end==================
			console.log('App Launch');
			this.$queue.remove('giftselectList')
			this.$queue.remove('selectprice')

			// ========== 自定义导航 start ====================
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif
					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif       
					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			})
			// ========== 自定义导航 end ====================
		},
		onShow: function(options) {
			// 邀请码缓存
			const _query = this.$queue.parse(options.query);
			if (_query.inviteCode) {
				uni.setStorageSync('inviteCode', _query.inviteCode);
			}
			// 扫码直接进来
			if (_query.scene) {
				// 商品、店铺分享
				if (_query.scene.indexOf("_") != -1) {
					uni.setStorageSync('inviteCode', _query.scene.split("_")[0]);
					uni.setStorageSync('shareId', _query.scene.split("_")[1]);
				} else {
					// VIP分享
					uni.setStorageSync('inviteCode', _query.scene);
				}
			}
			console.log('App Show', options);
		},
		onHide: function() {
			console.log('App Hide');
			this.$queue.remove('userInvitationCode')
		}
	};
</script>

<style lang="scss">
	@import '/colorui/main.css';
	@import '/colorui/icon.css';
	/*每个页面公共css */
	@import '/static/css/FontStyle.css';
	@import '/static/css/common.scss';
	/deep/ uni-switch .uni-switch-input::before{
	        background-color: $base;
	    }
</style>
