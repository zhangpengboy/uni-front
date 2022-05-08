import QueueUtils from '@/common/utils/QueueUtils.js';
export default {
	data() {
		return {
			//设置默认的分享参数
			share: {
				title: '一分钱，两份花',
				path: '/pages/exchange/exchange',
				// imageUrl: this.cdnUrl + '/mpapp/share.png?time=' + Date.now(),
				imageUrl: this.$queue.publicCdnHost()+'/assets/imgs/share.png?time=' + Date.now(),
				desc: '知名大牌,清库抢购!',
				content: ''
			}
		}
	},
	onShareAppMessage(res) {
		let _path = this.share.path;
		if (QueueUtils.getData("hasLogin")) {
			if (_path.indexOf('inviteCode') < 0) {
				const myInviteCode = QueueUtils.getData("myInviteCode");
				if (_path.indexOf('?') < 0) {
					_path = `${_path}?inviteCode=${myInviteCode}`
				} else {
					_path = `${_path}&inviteCode=${myInviteCode}`
				}
			}
			console.log("分享给朋友的地址:", _path);
		}
		return {
			title: this.share.title,
			path: _path,
			imageUrl: this.share.imageUrl,
			desc: this.share.desc,
			content: this.share.content,
			success(res) {
				uni.showToast({
					title: '分享成功'
				})
			},
			fail(res) {
				uni.showToast({
					title: '分享失败',
					icon: 'none'
				})
			}
		}
	},
}
