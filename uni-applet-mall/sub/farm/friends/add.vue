<template>
	<view class="friend-form">
		<view class="cu-form-group">
			<view class="title">手机号</view>
			<input type="text" v-model="phone" placeholder="请输入好友手机号" />
		</view>

		<view class="flex flex-direction padding">
			<view class="cu-btn linear-btn round" @tap="submitForm()">
				立即查找
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone: null
			};
		},
		methods: {
			/* 立即查找 */
			async submitForm() {
				const res = await this.$http.addInviteFriend({
					userId: this.userId,
					phone: this.phone
				});
				let msg = "申请添加成功。";
				if (res.data != 1) {
					msg = res.message + "。";
				}
				uni.showModal({
					title: "提示",
					content: `好友：${this.phone}, ${msg}`,
					success() {
						uni.navigateBack({
							delta: 1
						})
					}
				})
			}
		}
	}
</script>

<style>
</style>
