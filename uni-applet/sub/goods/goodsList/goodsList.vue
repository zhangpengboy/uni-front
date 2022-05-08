<template>
	<!-- 商品列表 -->
	<view class="goods">
		<view class="goods-list">
			<view class="goods-item" v-for="item in goodsList" :key="item.id" @tap="toGoods(item)">
				<image :src="item.goodsIcon"></image>
				<view class="name">{{ item.goodsName}}</view>
				<view class="info">
					<view class="price text-price">
						<text>{{ item.salePrice }}</text>
						<template v-if="item.integral > 0">						
							<text class="text-xs">{{ item.integralType | filterIntegralType }}</text>
							<text>{{ item.integral }}</text>
							<text class="text-xs">{{$queue.getIntegralName()}}</text>
						</template>
						<text class="text-sm line-thr text-price text-gray margin-left-xs">{{ item.marketPrice}}</text>
					</view>
					<!-- <view class="slogan">{{ product.sale + 100 }}人已购买</view> -->
				</view>
			</view>
		</view>
		<!-- 状态 -->
		<view class="cu-load" :class="queryParams.isfinish ? 'over' : 'loading'"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 商品列表
				goodsList: [],
				// 查询条件
				queryParams: {
					actCode: "", // 活动编号
					pageNum: 1,
					pageSize: 10,
					sort: '',
					isfinish: false
				}
			};
		},
		onLoad: function(option) {
			//option为object类型，会序列化上个页面传递的参数
			option.type = 'JMS_ACT_JPKC'
			option.name = '精品库存'
			this.queryParams.actCode = option.type;
			uni.setNavigationBarTitle({
				title: option.name
			});
			// 获取列表
			this.getActGoodsList();
		},
		//下拉刷新，在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			this.queryParams.pageNum = 1;
			this.queryParams.isfinish = false;
			this.goodsList = [];
			this.getActGoodsList();
			// setTimeout(() => {
			// 	uni.stopPullDownRefresh();
			// }, 1000);
		},
		//上拉加载，在page.json文件中配置"onReachBottomDistance"
		onReachBottom() {
			this.queryParams.pageNum++;
			this.getActGoodsList();
		},
		methods: {
			// 获取分类商品列表
			async getActGoodsList() {
				if (this.queryParams.isfinish) return false;
				this.$queue.showLoading("加载中...");
				const result = await this.$http.getActGoodsList(this.queryParams);
				uni.hideLoading();
				uni.stopPullDownRefresh();
				if (!result.success) return this.queryParams.isfinish = true;
				this.goodsList = _.concat(this.goodsList, result.data.list);
				if (result.data.pageNum == result.data.totalPage || result.data.total == 0) {
					this.queryParams.isfinish = true;
				}
			},
			//商品跳转
			toGoods(e) {
				uni.navigateTo({
					// url: "/sub/goods/detail/detail?" + this.$queue.stringify(e)
					url: "/sub/goods/detail/detail?goodsId=" + e.id
				});
			},
		}
	};
</script>

<style lang="scss" scoped>
@import '@/static/css/goods.scss';
.goods {
	margin-top: 24upx;
}
</style>
