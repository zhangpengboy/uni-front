<!-- 搜索 -->
<template>
	<view class="search">
		<view class="search-header">
			<view class="bar">
				<text class="icon cuIcon-search"></text>
				<input class="" @input="inputChange" type="text" value="" placeholder="搜索你想要的商品" />
				<text class="text" @click="gotoSearchList()">搜索</text>
			</view>
		</view>
		<view class="">
			<view class="search-history">
				<view class="search-history-nav">
					搜索历史
				</view>
				<view class="search-history-list">
					<view class="item" v-for="item in searchHistory" :key="item" @click="searchHistorys(item)">
						<view class="items">
							{{item}}
						</view>
					</view>
				</view>
			</view>
			<!-- <view class="search-hot">
				<view class="search-hot-nav">
					热门搜索
				</view>
				<view class="search-hot-list">
					<view class="bgc">
					</view>
					<view class="item">
						<view class="items">
							洗衣液洗衣液洗衣液洗衣液洗衣液洗衣液洗衣液
						</view>
						<view class="items">
							洗衣液洗衣液洗衣液洗衣液洗衣液洗衣液洗衣液
						</view>
						<view class="items">
							洗衣液洗衣液洗衣液洗衣液洗衣液洗衣液洗衣液
						</view>
						<view class="items">
							洗衣液洗衣液洗衣液洗衣液洗衣液洗衣液洗衣液
						</view>
						<view class="items">
							洗衣液洗衣液洗衣液洗衣液洗衣液洗衣液洗衣液
						</view>
						<view class="items">
							洗衣液洗衣液洗衣液洗衣液洗衣液洗衣液洗衣液
						</view>
					</view>
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// isshow: false,
				// goodsList: [],
				searchText: '',
				searchHistory: [],
				actCode: ''
			};
		},
		onLoad(options) {
			if (options) {
				this.actCode = options.actCode
			}
		},
		onShow(options) {
			if (this.$queue.getJson('searchHistory')) {
				var array = [];
				for (var i = 0; i < this.$queue.getJson('searchHistory').length; i++) {
					if (!array.includes(this.$queue.getJson('searchHistory')[i])) { //includes 检测数组是否有某个值
						array.push(this.$queue.getJson('searchHistory')[i]);
					}
				}
				this.searchHistory = array
				this.$queue.setJson("searchHistory", this.searchHistory);
			}
		},
		methods: {
			inputChange(e) {
				this.searchText = e.detail.value
			},
			//判断字符是否为空的方法
			isEmpty(obj) {
				var regu = "^[ ]+$";
				var re = new RegExp(regu);
				if (typeof obj == "undefined" || obj == null || obj == "" || re.test(obj)) {
					return true;
				} else {
					return false;
				}
			},
			searchHistorys(item) {
				this.searchText = item
				this.gotoSearchList()
			},
			// 搜索商品 
			gotoSearchList() {
				let that = this
				if (this.isEmpty(this.searchText)) {
					uni.showToast({
						title: '请输入要搜索的商品名称',
						icon: 'none'
					});
				} else {
					uni.navigateTo({
						url: './searchList?goodsName=' + this.searchText + '&actCode=' + this.actCode
					})
					setTimeout(function() {
						that.searchHistory.unshift(that.searchText)
						let searcharr = that.searchHistory.slice(0,20)
						that.$queue.setJson("searchHistory", searcharr);
					}, 1000)
				}

			},

		},

	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}

	.search {

		opacity: 1;

		&-header {
			border-bottom: 2upx solid #eee;

			.bar {
				margin: 6upx 88upx;
				height: 64upx;
				line-height: 64upx;
				position: relative;

				.icon {
					position: absolute;
					left: -54upx;
					font-size: 36upx;
					width: 32upx;
					height: 32upx;
				}

				input {
					position: absolute;
					left: 0;
					width: 550upx;
					height: 64upx;
				}

				.text {
					position: absolute;
					right: -60upx;
					font-size: 28upx;
					font-weight: 300;
					color: #333333;
				}
			}
		}

		&-history {
			margin: 28upx;

			&-nav {
				font-size: 30upx;
				font-weight: 500;
				color: #333333;
			}

			&-list {
				display: flex;
				flex-direction: row;
				padding: 32upx 0upx 0upx 0upx;
				box-sizing: border-box;
				flex-wrap: wrap;

				.item {
					margin-right: 32upx;
					margin-bottom: 32upx;
					background: #F2F2F2;
					border-radius: 78upx;

					.items {
						font-size: 26rpx;
						font-weight: 300;
						color: #333333;
						padding: 6upx 20upx;
						border-radius: 32rpx;
					}
				}
			}
		}

		&-hot {
			margin: 28upx;

			&-nav {
				font-size: 30upx;
				font-weight: 500;
				color: #333333;
			}

			&-list {
				padding: 32upx 0upx 0upx 0upx;
				box-sizing: border-box;
				position: relative;

				.bgc {
					position: absolute;
					left: 0;
					width: 694upx;
					height: 96upx;
					background-image: url(../../../static/img/31@2x.png);
					background-repeat: no-repeat;
					background-size: 100% 100%;
					-moz-background-size: 100% 100%;
				}

				.item {
					margin: 26upx 28upx;
					display: flex;
					flex-wrap: wrap;

					.items {
						padding: 0upx 10upx 32upx 0upx;
						box-sizing: border-box;
						width: 319upx;
						font-size: 26upx;
						font-weight: 300;
						color: #000;
					}
				}
			}
		}

		// &-navigation {
		// 	display: flex;
		// 	 justify-content: space-around;
		// 	 border-bottom: 2upx solid #F6F6F6;
		// 	 margin: 30upx 0upx 16upx;
		// 	 view {
		// 		 margin-bottom: 24upx;
		// 		 font-size: 30upx;
		// 		 font-weight: 300;
		// 		 color: #333333;
		// 	 }
		// }
		// &-sort {
		// 	display: flex;
		// 	 justify-content: space-around;
		// 	 view {
		// 		 margin-bottom: 40upx;
		// 		 font-size: 30upx;
		// 		 font-weight: 300;
		// 		 color: #333333;
		// 	 }
		// }
	}

	// @import "@/static/css/goods.scss";
</style>
