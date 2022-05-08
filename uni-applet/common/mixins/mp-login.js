import QueueUtils from '@/common/utils/QueueUtils.js';
export default {
	data() {
		return {
			// 是否登录
			hasLogin: false,
			// 登陆用户信息
			userInfo: null,
			// 个人用户ID
			userId: null,
			// 用户手机号
			userPhone: null,
			// 我的邀请码
			myInviteCode: null,
			// 分享ID 商品|店铺ID
			shareId: null
		}
	},
	onShow() {
		this.hasLogin = QueueUtils.getData("hasLogin") || false;
		this.userInfo = QueueUtils.getJson("userInfo") || {};
		this.userPhone = QueueUtils.getData("phone") || null;
		this.myInviteCode = QueueUtils.getData("myInviteCode") || null;
		this.userId = QueueUtils.getData("userId") || null;
		this.shareId = uni.getStorageSync("shareId") || null;
	},
	methods: {
		getWxOpenId() {
			return new Promise((resolve, reject) => {
				// 小程序登陆
				uni.login({
					provider: 'weixin',
					success: result => {
						if (result.errMsg == "login:ok") {
							// 获取openID
							this.$http.getWxOpenId({
								code: result.code
							}).then(res => {
								if (res.code == 200) {
									resolve(res.data);
								} else {
									reject();
									uni.showToast({
										title: "获取用户信息失败",
										icon: "none"
									})
								}
							})
						}
					}
				});
			})
		}
	}
}
