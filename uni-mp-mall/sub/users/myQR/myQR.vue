<template>
	<view class="share">
		<view class="share-herder" :style="{background: 'url(' + storeBg + ')  no-repeat;background-size: 100%;'}">
			<view class="searchBar" :style="{height: statusBarHeight  + 'px'}"></view>
			<view class="searchNav" :style="{height: navBarHright  + 'px'}">
				<view class="black" @tap="toBlack()">
					<image src="../../../static/img/icon_back_nor@2x.png" class="black-icon" mode=""></image>
				</view>
				<text>我的邀请码</text>
			</view>
		</view>
		<view class="user">
			<view class="logo avatar">
				<open-data class="avatar" type="userAvatarUrl"></open-data>
			</view>
			<view class="text-content">
				<open-data class="username" type="userNickName"></open-data>
			</view>
		</view>
		<!-- 海报列表 -->
		<view class="posterList">
			<view class="" v-for="(item, i) in posterList" :key="i">
				<!-- :style="{background: 'url(' + item + ')  no-repeat'}" -->
				<view class="poster">
					<image class="posterItem" :src="item" mode=""></image>
					<view class="mask"></view>
					<view class="mask-btn" @click="createCanvasImageEvn(i)">
						<image src="../../../static/img/icon_fx_white_new@2x.png" mode=""></image>
						<text>分享</text>
					</view>
				</view>
			</view>
		</view>
		<hchPoster ref="hchPoster" @cancel="handleCancel" :posterData.sync="posterData" />
		<!-- <r-canvas ref="rCanvas"></r-canvas> -->
	</view>
</template>

<script>
	// import hchPoster from '../../../components/hch-poster/hch-poster2.vue';
	import hchPoster from '../components/hch-poster/hch-poster2.vue';
	// import rCanvas from "../components/r-canvas/r-canvas.vue"
	export default {
		components: {
			hchPoster,
			// rCanvas
		},
		data() {
			return {
				storeBg: '',
				imgQr: null,
				downloadImg: null,
				statusBarHeight: 0,
				navBarHright: 0,
				// 高度差
				heightDiff: 0,
				posterList: [
					this.$queue.publicCdnHost()+'/assets/imgs/vipInviteBg1@2x.png',
					this.$queue.publicCdnHost()+'/assets/imgs/vipInviteDressBg@2x.png',
					this.$queue.publicCdnHost()+'/assets/imgs/vipInviteToyBg@2x.png',
					this.$queue.publicCdnHost()+'/assets/imgs/vipInviteSnacksBg@2x.png'
					],
				posterData: {
					poster: {
						//根据屏幕大小自动生成海报背景大小
						url: null, //图片地址
						r: 8, //圆角半径
						w: 299, //海报宽度
						h: 412, //海报高度
						p: 0 //海报内边距padding
					},
					// brandImg: {
					// 	//海报品牌logo
					// 	url: null, //图片地址
					// 	r: 24, //圆角半径
					// 	w: 48, //海报宽度
					// 	h: 48, //海报高度
					// },
					// name: {
					// 	//店铺名称
					// 	text: '', //文本
					// 	fontSize: 16, //字体大小
					// 	color: "#000", //颜色
					// 	lineHeight: 16, //行高
					// 	align: "left", //对齐方式
					// 	bold: true,
					// 	mt: 0 //margin-top
					// },
					mainImg: {
						//海报主商品图
						url: null, //图片地址
						r: 8, //圆角半径
						w: 299, //宽度
						h: 260 //高度
					},
					title: {
						//商品标题
						text: '', //文本
						fontSize: 16, //字体大小
						color: "#000", //颜色
						lineHeight: 25, //行高
						mt: 16 //margin-top
					},
					textBg: {
						url: null, //图片地址
						w: 180, //宽度
						h: 36, //高度
						r: 18, //圆角半径
					},
					userImg: {
						//邀请人头像
						url: null, //图片地址
						w: 28, //宽度
						h: 28, //高度
						mt: 24, //margin-top
						r: 14 //圆角半径
					},
					
					userInfo: [
						//个人信息
						{
							text: '', //文本
							fontSize: 11, //字体大小
							color: "#333", //字体颜色
							align: "left", //对齐方式
							lineHeight: 25, //行高
							mt: 43, //margin-top
							bold: true
						}
					],
					codeImg: {
						//小程序码
						url: null, //图片地址
						w: 72, //宽度
						h: 72, //高度
						mt: 12, //margin-top
						r: 10 //圆角半径
					},
					tips: [
						//提示信息
						{
							text: '', //文本
							fontSize: 8, //字体大小
							color: "#666", //字体颜色
							align: "right", //对齐方式
							lineHeight: 25, //行高
							mt: 12 //margin-top
						},
						{
							text: '', //文本
							fontSize: 12, //字体大小
							color: "#2f1709", //字体颜色
							align: "center", //对齐方式
							lineHeight: 25, //行高
							mt: 25 //margin-top
						}
					]
				},
			};
		},
		onLoad() {
			// 获取设备状态栏高度
			this.getSystemdata();
		},
		onShow() {
			this.storeBg = `${this.$queue.publicCdnHost()}/assets/imgs/inviteCode@2x.png`
			// 获取邀请码
			this.$queue.showLoading("加载中...");
			this.$http.getMiniCodePic({
				scene: this.myInviteCode,
				// TODO 这里路径需要修改
				path: 'sub/vipMembers/vipMembersInterests',
				// path: 'pages/exchange/exchange',
				width: '430'
			}).then(res => {
				if (res.code == 200) {
					// this.imgQr = "data:image/png;base64," + res.data.replace(/[\r\n]/g, '');
					this.imgQr = res.data;
					// this.setData('imgQrUrl', this.imgQr)
					this.downloadImg = res.data;
				} else {
					this.$queue.publicCdnHost() + '/mpapp/qr.png'
				}
				uni.hideLoading();
			});
		},
		methods: {
			toBlack() {
				// console.log('ssssssssssss')
				uni.navigateBack()
			},
			//获取设备状态栏 导航栏 胶囊信息
			getSystemdata() {
				// 状态栏高度
				uni.getSystemInfo({
					success: (res) => {
						this.statusBarHeight = res.statusBarHeight
						this.windowHeight = res.windowHeight
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
			/* 取消海报 */
			handleCancel(val) {
				// this.canvasFlag = val
			},
			/* 创建海报画报 */
			createCanvasImageEvn(i) {
				this.posterData.poster.url = this.$queue.fxBgImg()
				if(i == 0) {
					this.posterData.mainImg.url = this.$queue.vipFxImg()
				}
				if(i == 1) {
					this.posterData.mainImg.url = this.$queue.publicCdnHost()+'/assets/imgs/vipInviteDressPosters@2x.png'
				}
				if(i == 2) {
					this.posterData.mainImg.url = this.$queue.publicCdnHost()+'/assets/imgs/vipInviteToyPosters@2x.png'
				}
				if(i == 3) {
					this.posterData.mainImg.url = this.$queue.publicCdnHost()+'/assets/imgs/vipInviteSnacksPosters@2x.png'
				}
				console.log(this.posterData.mainImg.url)
				// this.posterData.brandImg.url = 
				// this.posterData.name.text = ''
				this.posterData.codeImg.url = this.imgQr
				this.posterData.userImg.url = this.$queue.getJson('userInfo').avatarUrl
				this.posterData.textBg.url = this.$queue.publicCdnHost()+'/assets/imgs/hbTextBg@2x.png'
				this.posterData.userInfo[0].text = `                @${this.userPhone} 为你推荐`
				// this.$forceUpdate(); //强制渲染数据
				setTimeout(() => {
					this.$refs.hchPoster.posterShow()
				}, 500);
			},
			/* 保存二维码 */
			handleSaveQrCode() {

				var imgSrc = this.downloadImg; // base64编码
				var save = wx.getFileSystemManager(); // 获取文件管理器对象
				var number = Math.random();
				save.writeFile({
					filePath: wx.env.USER_DATA_PATH + '/jms_pic_' + number + '.png', // 表示生成一个临时文件名
					data: imgSrc,
					encoding: 'base64',
					success: res => {
						wx.saveImageToPhotosAlbum({
							filePath: wx.env.USER_DATA_PATH + '/jms_pic_' + number + '.png',
							success: function(res) {
								uni.showToast({
									title: '保存成功',
								})
							},
							fail: function(err) {
								console.log(err)
							}
						})
						console.log(res)
					},
					fail: err => {
						console.log(err)
					}
				})
			}
		}
	};
</script>

<style lang="scss">

	.share {
		
		&-herder {
			width: 750upx;
			height: 272upx;
			position: sticky;
			top: 0;
			background: url('https://lz.static.seprain.com/assets/imgs/inviteCode@2x.png') no-repeat;
			background-size: 100%;
			// z-index: -1;
			display: flex;
			flex-direction: column;
			color: #333;
			
			.searchNav {
				display: flex;
				align-items: center;
				
				
				.black {
					width: 80upx;
					padding-left: 24upx;
					.black-icon {
						width: 32upx;
						height: 32upx;
						// z-index: 1000;
					}
				}
				text {
					width: 180upx;
					font-size: 36upx;
				}
			}
		}
		
	}
	.user {
		position: sticky;
		top: 64upx;
	}
	.logo {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: -64upx;
		// position: absolute;
		// bottom: 25upx;

		.avatar {
			width: 128upx;
			height: 128upx;
			border-radius: 64upx;
			overflow: hidden;
		}
	}
	.text-content {
		width: 100%;
		height: 50upx;
		line-height: 50upx;
		font-size: 36upx;
		color: #333333;
		// vertical-align: top;
		font-weight: 700;
		text-align: center;
		margin-top: 8upx;
		display: inline-block;
		overflow: hidden; //超出的文本隐藏
		text-overflow: ellipsis; //溢出用省略号显示
		white-space: nowrap; //溢出不换行
		.username {
			padding: 0 24upx;
		}
	}
	// 海报列表
	.posterList {
		// width: 100%;
		padding: 28upx 40upx;
		
		.posterItem {
			width: 670upx;
			height: 216upx;
			background-size:100%;
			border-radius: 16upx;
			margin-bottom: 24upx;
			}
			.poster {
				position: relative;
			}
			.mask {
				width: 104upx;
				height: 216upx;
				position: absolute;
				top: -0.3%;
				left: 84.3%;
				background: #000000;
				opacity: 0.2;
				border-radius: 0px 16upx 16upx 0px;
				
				
				
			}
			.mask-btn {
				display: flex;
				flex-direction: column;
				position: absolute;
				top: 27.5%;
				left: 88.5%;
				image {
					width: 56upx;
					height: 56upx;
				}
				text {
					width: 48upx;
					height: 34upx;
					font-size: 24upx;
					font-weight: 700;
					line-height: 34upx;
					color: #FFFFFF;
					margin-top: 4upx;
				}
			}

	}
</style>
