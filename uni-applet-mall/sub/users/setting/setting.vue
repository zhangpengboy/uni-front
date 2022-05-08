<template>
	<view class="margin-top-sm">
		<view class="content">
			<view class="list">
				<view class="row" @tap="toProfile()">
					<view class="title">个人资料</view>
					<view class="right">
						<view class="icon xiangyou"></view>
					</view>
				</view>
				<view class="row" @tap="toAddress()">
					<view class="title">地址管理</view>
					<view class="right">
						<view class="icon xiangyou"></view>
					</view>
				</view>
			</view>
			<view class="list">
				<view class="row">
					<view class="title">清除缓存</view>
					<view class="right">
						<view class="tis"></view>
						<view class="icon xiangyou"></view>
					</view>
				</view>
				<view class="row">
					<view class="title">问题反馈</view>
					<view class="right">
						<view class="tis"></view>
						<view class="icon xiangyou"></view>
					</view>
				</view>
				<view class="row">
					<view class="title">关于商城</view>
					<view class="right">
						<view class="tis"></view>
						<view class="icon xiangyou"></view>
					</view>
				</view>
				<view class="row">
					<view class="title">版本升级</view>
					<view class="right">
						<view class="tis">v1.0.0</view>
						<view class="icon xiangyou"></view>
					</view>
				</view>
			</view>
			<view class="flex padding-lr-xl margin-top-xl"><button type="primary" class="cu-btn round bg-gradual-red lg flex-sub" @tap="logout">退出登陆</button></view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { parseTime } from '@/common/utils/DateUtils.js';
export default {
	data() {
		return {};
	},
	computed: {
		...mapState(['userInfo', 'hasLogin'])
	},
	onShow() {
		if (!this.hasLogin) {
			uni.navigateTo({
				url: '../../tabBar/home/home'
			});
		}
	},
	filters: {
		parseTime
	},
	methods: {
		logout() {
			this.$store.commit('logout');
			uni.navigateTo({
				url: '../../login/login'
			});
		},
		// to profile
		toProfile(){
			uni.navigateTo({
				url: "/pages/user/profile/profile"
			})
		},
		// to Address
		toAddress(){
			uni.navigateTo({
				url: "/pages/user/address/address"
			})
		}

	}
};
</script>

<style lang="scss">
page {
	background-color: #f3f3f3;
}

.icon {
	font-size: 30upx;
}
.content {
	padding-bottom: 20upx;
	.list {
		width: 96%;
		padding-left: 4%;
		background-color: #fff;
		margin-bottom: 20upx;
		.row {
			widows: 100%;
			min-height: 90upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: solid 1upx #eee;
			&:last-child {
				border-bottom: none;
			}
			.title {
				font-size: 32upx;
				color: #333;
			}
			.right {
				display: flex;
				align-items: center;
				color: #999;
				.tis {
					font-size: 26upx;
					margin-right: 5upx;
					max-height: 120upx;
					image {
						width: 100upx;
						height: 100upx;
						border-radius: 100%;
						margin: 10upx 0;
					}
				}
				.icon {
					width: 40upx;
					color: #cecece;
				}
			}
		}
	}
}
</style>
