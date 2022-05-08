<template>
	<view class="friend">
		<!-- 新的好友 -->
		<view class="cu-list menu-avatar margin-bottom">
			<navigator class="cu-item arrow" url="/sub/farm/friends/invited">
				<view class="cu-avatar round lg"
					:style="{'background-image': `url(${$queue.publicCdnHost()}/assets/game/new.png)`}">
					<view class="cu-tag badge bg-yellow" v-if="inviteNum >0">{{inviteNum > 99 ? "99+" : inviteNum}}
					</view>
				</view>
				<view class="content">
					<text class="text-bold text-df">新的好友</text>
				</view>
				<view class="action">
					<text class="cuIcon-right text-grey"></text>
				</view>
			</navigator>
		</view>
		<!-- 好友列表 -->
		<view class="friend-list cu-list menu-avatar">

			<block v-for="(item,index) in list" :key="index">
				<view class="cu-item arrow" @tap="jumpPages('./corns', item)">
					<view class="friend-idx">
						<!-- 前三名图标 -->
						<image class="tag" lazy-load :src="`../static/${index+1}.png`" v-if="index<3"></image>
						<!-- 3+排名文字 -->
						<view class="text-bold text-xl" v-else>{{index+1}}</view>
					</view>
					<view class="cu-avatar round" :style="{ 'background-image': `url(${item.friendHeadImg})`}"></view>
					<view class="content">
						<view class="text-bold">
							<view class="text-cut">{{item.friendPhone}}</view>
						</view>
						<view class="text-gray text-sm">
							<view class="text-cut">
								{{parseTime(item.createTime)}}
							</view>
						</view>
					</view>
					<view class="action">
						<text class="cuIcon-right text-grey"></text>
					</view>
				</view>

			</block>

			<!-- 暂无数据 -->
			<view class="notfund" v-if="list.length==0">
				<view class="text-main text-xsl">
					<text class="cuIcon-creative"></text>
					<view class="text-df">暂无数据</view>
				</view>
			</view>

		</view>

		<view class="friend-btn">
			<view class="flex flex-direction padding">
				<navigator class="linear-btn cu-btn lg round" url="/sub/farm/friends/add">添加好友</navigator>
			</view>
		</view>
	</view>


</template>

<script>
	import {
		parseTime
	} from '../../../common/utils/DateUtils.js';
	export default {
		data() {
			return {
				// 好友申请数量
				inviteNum: 0,
				// 好友列表
				list: [],
				// 请求参数
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					isfinish: false,
				}
			};
		},
		onShow() {
			this.getInviteList();
			this.getFriendList();
		},
		onPullDownRefresh() {
			this.queryParams.pageNum = 1;
			this.queryParams.isfinish = false;
			this.list = [];
			this.getInviteList();
			this.getFriendList();
		},
		onReachBottom() {
			uni.showLoading({
				mask: true,
				title: "加载中..."
			})
			this.queryParams.pageNum++;
			this.getFriendList();
		},
		methods: {
			parseTime,
			/* 跳转页面 */
			jumpPages(uri, ...algs) {
				uni.navigateTo({
					url: uri
				});
				if (algs.length > 0) {
					this.$queue.setJson('corn_friends', algs[0]);
				}
			},
			/* 获取好友申请 */
			async getInviteList() {
				const res = await this.$http.getInviteList({
					userId: this.userId,
					status: 0
				});
				this.inviteNum = _.size(res.data);
			},
			/* 获取好友列表 */
			async getFriendList() {
				uni.stopPullDownRefresh();
				if (this.queryParams.isfinish) return;
				const res = await this.$http.getMyFriendList({
					userId: this.userId
				});
				uni.hideLoading()
				this.list = _.concat(this.list, res.data.list);
				if (res.data.totalPage == this.queryParams.pageNum || _.size(res.data.list) === 0) {
					this.queryParams.isfinish = true;
				}
			}
		}
	}
</script>

<style lang="scss">
	.friend {
		padding-bottom: 150upx;

		&-list {
			.friend-idx {
				position: absolute;
				left: 10rpx;
				width: 60rpx;
				height: 60rpx;
				display: flex;
				justify-content: center;
				align-items: center;

				.tag {
					width: 48upx;
					height: 48upx;
					background-size: 100%;
					background-repeat: no-repeat;
				}
			}

			&.menu-avatar>.cu-item>.cu-avatar {
				left: 80rpx;
				width: 80rpx;
				height: 80rpx;
			}

			&.menu-avatar>.cu-item>.content {
				left: 180rpx;
			}
		}

		&-btn {
			position: fixed;
			bottom: 0;
			width: 100%;
		}
	}
</style>
