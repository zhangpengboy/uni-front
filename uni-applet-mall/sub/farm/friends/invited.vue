<template>
	<view class="friend">
		<!-- 列表 -->
		<view class="friend-list cu-list menu-avatar">
			<!-- 循环块 -->
			<block v-for="(item,index) in list" :key="index">
				<view class="cu-item arrow">
					<view class="cu-avatar round lg" :style="{ 'background-image': `url(${item.userHeadImg})`}">
					</view>
					<view class="content">
						<view class="text-bold">
							<view class="text-cut">{{item.userPhone}}</view>
						</view>
						<view class="text-gray">
							<text>{{parseTime(item.createTime)}}</text>
						</view>
					</view>
					<view class="text-df">
						<block v-if="item.status == 0">
							<view class="cu-btn round lines-red margin-right sm" @tap="handlerSubmit(item, 2)">拒绝
							</view>
							<view class="cu-btn round gbtn margin-right sm" @tap="handlerSubmit(item, 1)">同意</view>
						</block>
						<view v-else class="text-grey margin-right">
							{{item.status == 1 ? "已添加" : "已拒绝"}}
						</view>
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
	</view>
</template>

<script>
	import {
		parseTime
	} from '../../../common/utils/DateUtils.js';
	export default {
		data() {
			return {
				// 邀请好友列表
				list: []
			};
		},
		onShow() {
			this.getInviteList()
		},
		methods: {
			parseTime,
			/* 获取好友列表 */
			async getInviteList() {
				const res = await this.$http.getInviteList({
					userId: this.userId
				});
				this.list = res.data;
			},
			/* 修改好友状态 */
			async updateInviteStatus(id, status) {
				const res = await this.$http.updateInviteStatus({
					ids: [id],
					status: status
				});
				uni.showToast({
					icon: "none",
					title: res.message
				})
				this.getInviteList();
			},
			/* 同意|拒绝事件 */
			handlerSubmit(item, status) {
				const that = this;
				if (status == 2) {
					// 拒绝
					uni.showModal({
						title: "提示",
						content: "是否拒绝添加该好友?",
						success(res) {
							if (res.confirm) {
								that.updateInviteStatus(item.id, status);
							}
						}
					})
				} else {
					// 同意
					that.updateInviteStatus(item.id, status);
				}
			}
		}
	}
</script>

<style lang="scss">

</style>
