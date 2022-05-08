<template>
	<view class="margin-top-xs">
		<view class="content">
			<view class="list">
				<view class="row">
					<view class="title">头像</view>
					<view class="right">
						<view class="tis">
							<image :src="userInfo.avatarUrl || '/static/img/logo.png'" mode="widthFix"></image>
						</view>
						<view class="icon"></view>
					</view>
				</view>
				<view class="row margin-top-xs">
					<view class="title">用户名</view>
					<view class="right">
						<view class="tis">{{ userInfo.nickName }}</view>
						<view class="icon"></view>
					</view>
				</view>
				<view class="row">
					<view class="title">性别</view>
					<view class="right">
						<view class="tis">{{ userInfo.gender == 1 ? '男' : '女' }}</view>
						<view class="icon"></view>
					</view>
				</view>
				<view class="row">
					<view class="title">绑定手机</view>
					<view class="right">
						<view class="tis">{{ $queue.getData("phone") }}</view>
						<view class="icon"></view>
					</view>
				</view>
				<view class="row">
					<view class="title">绑定微信</view>
					<view class="right">
						<view class="tis">已绑定</view>
						<view class="icon"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		methods: {}
	};
</script>

<style lang="scss">
	page {
		background-color: #f7f7f7;
	}

	.icon {
		font-size: 30upx;
	}

	.content {
		padding-bottom: 20upx;

		.list {
			margin-bottom: 20upx;

			.row {
				box-sizing: border-box;
				background-color: #fff;
				padding-left: 4%;
				width: 100;
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
