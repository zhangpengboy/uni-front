<template>
	<view>
		<view class="search" :style="{ height: statusBarHeight + navBarHright + 'px'}">
			<view class="searchBar" :style="{height: statusBarHeight + 'px'}"></view>
			<view class="searchNav" :style="{height: navBarHright + 'px'}">
				<!-- <view class="image">
					<image src="../../../static/img/png.png" mode=""></image>
				</view> -->
				<view class="btn" @click="goSearch" :style="{height: statusBar.height + 'px'}">
					<text class="icon cuIcon-search"></text>
					<text>
						搜索你想要的商品
					</text>
				</view>
			</view>
		</view>
		<view class="content">
			<!-- 选择项目 -->
			<!-- <view  class="cont-pro"> -->
			  <!-- 左侧列表 -->
			  <<!-- view class='pro-left font28 color9'>
			    <view wx:for="{{serviceTypes}}" class='pro-title {{index==currentLeft?"font30 color3 bgWhite":""}}' bindtap='proItemTap' data-pos='{{index}}'>{{item.type}}</view>
			  </view> -->
			  <!-- 右侧列表 -->
			  <!-- <scroll-view class='pro-right' scroll-y scroll-with-animation="true" scroll-into-view="{{selectId}}" bindscroll="scrollEvent" scroll-top="{{scrollTop}}"> -->
			    <!-- id要用来实现点击左侧右侧滚动至相应位置的效果；class（pro-box）要用来计算右侧对应左侧某一分类的高度 -->
			    <!-- id: item0, item1, item2... （注意：不能直接使用数字或汉字做id）-->
			    <!-- <view id='{{"item"+index}}' class='pro-box' wx:for="{{serviceTypes}}" wx:for-index="index" wx:for-item="item"> -->
			      <!-- 右侧列表里的标题，高度为50px -->
			      <!-- <view class="item-title font30">{{item.type}}</view>
			      <view class='pro-item' wx:for="{{item.services}}" wx:for-index="idx" wx:for-item="itemName">
			        <image class='pro-img' src='{{itemName.img}}'></image>
			        <view class='pro-text'>
			          <view class='item-name color3 font32'>{{itemName.name}}</view>
			          <view class='pro-tag'>
			            <text wx:for="{{itemName.label}}" wx:for-item="tag">{{tag}}</text>
			          </view>
			          <view class='pro-bottom'>
			            <text style='color:#C93131;' class='font32'>¥{{itemName.price}}</text>
			            <view class='count font30 color6'>
			              <text catchtap='subCount' data-pos='{{idx}}' data-index='{{index}}' data-sid='{{itemName.id}}'>-</text>
			              <text class='color3'>{{itemName.count?itemName.count:0}}</text>
			              <text catchtap='addCount' data-pos='{{idx}}' data-index='{{index}}' data-sid='{{itemName.id}}'>+</text>
			            </view>
			          </view>
			        </view>
			      </view>
			    </view>
			  </scroll-view>
			</view> -->

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: 0,
				screenHeight: 0,
				statusBar: {},
				navBarHright: 0,
				heightDiff: 0,
				
				currentTab: 0,  //选择项目、选择技师、优惠券
				currentLeft: 0, //左侧选中的下标
				selectId: "item0",  //当前显示的元素id
				scrollTop: 0, //到顶部的距离
				serviceTypes: [], //项目列表数据
				staffList: [],
				coupons: []
			}
		},
		onLoad() {
			this.getSystemdata()
		},
		methods: {
			//获取设备状态栏高度
			getSystemdata() {
				uni.getSystemInfo({
					success: (res) => {
						this.statusBarHeight = res.statusBarHeight
						this.screenHeight = res.screenHeight
					}
				})
				// 胶囊信息
				var data = uni.getMenuButtonBoundingClientRect()
				this.statusBar = data
				// 导航栏高度
				this.navBarHright = ((data.top - this.statusBarHeight) * 2 + data.height)
				// 高度差
				this.heightDiff = data.top - this.statusBarHeight
			},
			// 跳转搜索页面
			goSearch() {
				uni.navigateTo({
					// url: "/sub/goods/search/search?actCode=" + this.towmCode  // 需要的code
				});
			},
		},
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}
	.search {
		width: 100%;
		position: sticky;
		z-index: 9999;
		top: 0upx;
		.searchNav {
			display: flex;
			align-items: center;
			margin-left: 24upx;

			.image {
				width: 116upx;
				height: 56upx;

				image {
					width: 116upx;
					height: 56upx;
				}
			}

			.btn {
				display: flex;
				align-items: center;
				// width: 374upx;
				width: 66%;
				background: #F2F2F2;
				box-sizing: border-box;
				border-radius: 42upx;
				margin-left: 24upx;

				.icon {
					width: 32upx;
					height: 32upx;
					color: #818181;
					font-size: 32upx;
					font-weight: 600;
				}

				text {
					color: #999999;
					font-size: 24upx;
					margin-left: 24upx;
				}
			}
		}
	}
	.content {
		
	}
</style>
