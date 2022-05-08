<template>
	<view class="empty">
		<view class="empty__image">
			<image :src="genImageContent()" mode=" aspectFit"></image>
		</view>
		<view class="empty__description">
			{{genDescription()}}
		</view>
		<slot></slot>
	</view>
</template>

<script>
	var PRESETS = ['error', 'search', 'default'];

	export default {
		props: {
			imageSize: [Number, String],
			description: String,
			image: {
				type: String,
				default: 'default'
			}
		},
		data() {
			return {};
		},
		methods: {
			// 获取图片地址
			genImageContent() {
				var image = this.image;
				if (PRESETS.indexOf(image) !== -1) {
					image = `${this.$queue.publicCdnHost()}/assets/imgs/no_goods.png`;
				}
				return image;
			},
			// 获取说明
			genDescription() {
				var description = this.description || '还没有收藏的商品哦~';
				return description;
			}
		},

	}
</script>

<style lang="scss" scoped>
	.empty {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		-webkit-flex-direction: column;
		flex-direction: column;
		-webkit-box-align: center;
		-webkit-align-items: center;
		align-items: center;
		-webkit-box-pack: center;
		-webkit-justify-content: center;
		justify-content: center;
		box-sizing: border-box;
		padding: 64upx 0
	}

	.empty__image {
		width: 492upx;
		height: 340upx
	}

	.empty__image image {
		width: 100%;
		height: 100%
	}

	.empty__description {
		margin-top: 48upx;
		color: #969799;
		font-size: 32upx;
		line-height: 40upx
	}

	.empty__bottom {
		margin-top: 48upx
	}
</style>
