<template>
	<view>
		<fl-signin
			:date="date"
			:list="list"
			@signin_fun="signin_fun"
			:repair="repair"
			:rule="rule"
			@repair_fun="repair_fun"
			:choose_date="choose_date"
			@date_change="date_change"
		></fl-signin>
	</view>
</template>

<script>
import flSignin from '@/components/fl-signin/fl-signin.vue';
export default {
	data() {
		return {
			// 是否可以选择日期
			choose_date: false,
			// 当前日期
			date: new Date(),
			// 签到成功列表
			// list: ['2019-12-15', '12-12', '10'],
			list: [],
			// 是否开启补签
			repair: false,
			// 是否开启补签规则
			rule: false
		};
	},
	components: {
		'fl-signin': flSignin
	},
	methods: {
		// 签到时触发
		signin_fun(res) {
			// this.list.push(res.day);
			// uni.showToast({
			// 	title: '签到成功',
			// 	icon: 'none'
			// });
			uni.showToast({
				title: '功能暂未开放,敬请期待~',
				icon: 'none'
			});
		},
		// 补签成功时触发
		repair_fun(res) {
			this.list.push(res.day);
			uni.showToast({
				title: '补签成功',
				icon: 'none'
			});
		},
		// 当月份改变时触发
		date_change(date) {
			// 更新当前日期
			this.date = date;
			// 更新签到列表
			this.list = ['01', '02'];
		}
	}
};
</script>

<style lang="scss"></style>
