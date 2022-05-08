<template>
	<view class="" style="margin-bottom: 60upx;">
		<view class="selection" v-for="item in ListShow" :key="item">
			<view class="letterList">
				<view class="letter">
					{{item.letter}}
				</view>
			</view>
			<view class="provinceList">
				<view  v-for="(v,i) in item.code" :key="i" @click="goSelection(v,i)">
					<view class="provincetext" :class="{active: listIndex == v}">
						<text>{{item.name[i]}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		letter
	} from '@/common/utils/index.js'

	export default {
		data() {
			return {
				actCode: '',
				ListShow: [],
				listIndex: '',
			}
		},
		onLoad(option) {
			this.actCode = option.actCode
			this.getprovinceList()
		},
		methods: {
			goSelection(v, i) {
				// this.actCode = code[i]
				this.listIndex = v
				uni.setStorageSync('code_key', v);
				uni.switchTab({
					url: "../../../pages/hometown/hometown"
				})
			},
			deWeight(arr) {
			    for (var i = 0; i < arr.length - 1; i++) {
			        for (var j = i + 1; j < arr.length; j++) {
			            if (arr[i].letter == arr[j].letter) {
							arr[i].name +=  ' ' +  arr[j].name
							arr[i].code +=  ' ' +  arr[j].code
			                arr.splice(j, 1);
			                //因为数组长度减小1，所以直接 j++ 会漏掉一个元素，所以要 j--
			                j--;
			            }
			        }
			    }
			    return arr;
			},
			getprovinceList() {
				uni.showLoading({
					mask: true,
					title: "加载中..."
				})
				this.$http.getHometownGoodsList({
					actCode: this.$stringUtils.towmCode()
				}).then(res => {
					uni.hideLoading()
					if (res.code == 200) {
						// this.ListShow = res.data
						res.data.map(item => {
							if (item.name) {
								var strsub = item.name.substr(0, 1)
								item.letter = letter(strsub)[0]
								if (item.name.indexOf("重") != -1) {
									item.letter = letter(strsub)[1]
								}
								if (item.name.indexOf("广") != -1) {
									item.letter = letter(strsub)[0]
								}
								if(item.name.includes('香港') || item.name.includes('台湾') || item.name.includes('澳门')) {
									item.letter = '#'
								}
							}
						})
						this.ListShow = _.cloneDeep(this.deWeight(res.data))
						
						this.ListShow.map(item => {
							
							item.code = item.code.split(" ")
							item.name = item.name.split(" ")
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
	}

	.active {
		background: #FFEBE4;
		border: 2upx solid #EB6133;
		color: #eb6132 !important;
	}

	.selection {
		background-color: #fff;

		display: flex;

		.letterList {
			.letter {
				line-height: 48upx;
				margin: 40upx 0upx 0upx 32upx;
			}
		}

		.provinceList {
			display: flex;
			flex-wrap: wrap;

			.provincetext {
				margin-left: 24upx;
				margin-top: 40upx;
				text-align: center;
				line-height: 48upx;
				height: 48upx;
				background: #F2F2F2;
				border-radius: 29upx;
				box-sizing: border-box;
				text {
					margin: 0upx 46upx;
					font-size: 26upx;
					font-weight: 300;
				}
			}

			.provincetext:first-child {
				margin-left: 22upx;
			}
		}

	}
</style>
