<template>
	<view class="momenter">
		<view class="message">
			<view class="row">
				<view class="left">
					<!-- <image src="../../../static/img/mom/icon_abbreviation@2x.png" mode=""></image> -->
					<text><text class="text">*</text> 用户昵称</text>
				</view>
				<input type="text" class="right" maxlength='12' v-model="giftMother.storeName"
					style="width: 65%;text-align: right;" value="" placeholder="输入用户昵称，用户平台店铺展示"
					placeholder-style="color: #C1C1C1;" />
			</view>
			<view class="row">
				<view class="left">
					<!-- <image src="../../../static/img/mom/icon_phone@2x.png" mode=""></image> -->
					<text><text class="text">*</text> 联系电话</text>
				</view>
				<input type="text" class="right" style="width: 32%;text-align: right;" disabled
					v-model="giftMother.phone" />
			</view>
			<view class="row">
				<view class="left">
					<!-- <image src="../../../static/img/mom/icon_category@2x.png" mode=""></image> -->
					<text><text class="text">*</text> 主营类目</text>
				</view>
				<input v-if="giftMother.storeCategoryName" disabled v-model="giftMother.storeCategoryName"
					@click="showSpec" style="width: 46%;text-align: right;" class="right" />
				<text v-if="!giftMother.storeCategoryName" @click="showSpec" style="color: #C1C1C1;">请选择<text
						class="cuIcon-right"></text></text>
			</view>
			<view class="row">
				<view class="left">
					<!-- <image src="../../../static/img/mom/icon_category@2x.png" mode=""></image> -->
					<text><text class="text">*</text> 角色选择</text>
				</view>
				<view class="right" style="color: #EB6133;">
					<radio-group @change="radioChange" class="radio-group">
						<label class="weui-cell weui-check__label radio-group-label" style="margin-right: 48upx;">
							<view class="weui-cell__hd">
								<radio class="yellow" value="0" checked="true" />
							</view>
							<view class="weui-cell__bd">惠哥</view>
						</label>
						<label class="weui-cell weui-check__label radio-group-label">
							<view class="weui-cell__hd">
								<radio class="yellow" value="1" />
							</view>
							<view class="weui-cell__bd">惠姐</view>
						</label>
					</radio-group>
				</view>
			</view>
			<view class="row">
				<view class="left">
					<!-- <image src="../../../static/img/mom/address.png" mode=""></image> -->
					<text><text class="text">*</text> 店铺地址</text>
				</view>
				<picker class="right" style="width: 75%;text-align: right;" mode="multiSelector" :range="cityArray"
					:value="multiIndex" @columnchange="changeCity" @change="chooseCity" v-if="isloading == 0">
					<template v-if="selCity == 1">
						<view class="">
							{{cityList[multiIndex[0]].name}}-{{areaList[multiIndex[1]].name}}-{{campusList[multiIndex[2]].name}}
						</view>
					</template>
					<template v-if="selCity == 0">
						<view style="color: #c0c0c0;">请选择地区<text style="color: #c0c0c0;" class="cuIcon-right"></text>
						</view>
					</template>
				</picker>
			</view>
			<view class="row">
				<view class="left">
					<!-- <image src="../../../static/img/mom/icon_abbreviation@2x.png" mode=""></image> -->
					<text><text class="text">*</text> 详细地址</text>
				</view>
				<input type="text" class="right" maxlength='50' v-model="giftMother.storeAddress"
					style="width: 69%;text-align: right;" value="" placeholder="请输入店铺详情地址（精确到门牌号）"
					placeholder-style="color: #C1C1C1;" />
			</view>
			<!-- <view class="cu-form-group">
				<textarea style="height: 2.5em;" maxlength="-1" :disabled="modalName!=null"
					v-model="giftMother.storeAddress" placeholder="请输入详细地址（精确到门牌号）"
					placeholder-style="color: #aaa"></textarea>
			</view> -->
			<view class="rowcard">
				<view class="left">
					<!-- <image src="../../../static/img/mom/icon_abbreviation@2x.png" mode=""></image> -->
					<text><text class="text">*</text> 身份证</text>
				</view>
				<view class="right">
					<image @click="uploadImage('positive')" src="../../../static/img/mom/card0.png"
						v-if="tempFilePathsCard1 == ''" mode=""></image>
					<image @click="uploadImage('positive')" :src="tempFilePathsCard1" v-else mode=""></image>
					<image @click="uploadImage('negative')" src="../../../static/img/mom/card1.png"
						v-if="tempFilePathsCard2 == ''" mode=""></image>
					<image @click="uploadImage('negative')" v-else :src="tempFilePathsCard2" mode=""></image>
				</view>
			</view>
		</view>
		<view class="agreement">
			<checkbox-group class="chgroup" @change="checkboxChange">
				<view class="checkbtn">
					<label>
						<checkbox class='' value="check" :checked="false"><text class="text">我已阅读并同意</text>
						</checkbox>
					</label>
					<text @click="giftmomagreement" style="color: #EB6133;">《个人云创业入驻协议》</text>
				</view>
			</checkbox-group>
		</view>
		<view class="nextstep" @click="nextstep">
			下一步
		</view>
		<!-- 类目-模态层弹窗 -->
		<view class="cu-modal bottom-modal categoryDialog" :class="specClass" @tap.stop="hideSpec">
			<view class="cu-dialog goods-spec" @tap.stop="no">
				<view class="cu-bar bg-white justify-end">
					<view class="content maincategory">
						主营类目
					</view>
					<view class="action text-xl text-bold text-gray margin-right" @tap.stop="hideSpec"><text
							class="cuIcon-close"></text></view>
				</view>
				<view class="bg-white goods-spec-box">
					<view class="levelcategory">
						一级类目
					</view>
					<view class="grid padding-sm flexcategory">
						<view class="padding-xs12" v-for="(item,index) in momCateList" :key="index"
							@click="selectcategory(item,index)">
							<view class="cu-btn itemcategory" :class="{itemcategorysel: selectIndex == index}">
								<text>{{item.title}}</text>
							</view>
						</view>
					</view>
					<view class="bottom">
						<view class=" cu-btn bg-red round shadow-blur buttoncategory" @tap.stop="handleBuy">确定</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import fetch from '../../../common/fetch/request.js'
	export default {
		data() {
			return {
				isloading: 0,
				specClass: '',
				category: '',
				selectIndex: null,
				selCity: 0,
				checked: 0,
				//城市筛选
				cityArray: [
					[],
					[],
					[]
				],
				multiIndex: [0, 0, 0], //筛选的省市区各下标（用于获取value）
				cityList: [],
				cityList1: [],
				areaList: [],
				areaList1: [],
				campusList: [],
				campusList1: [],
				momCateList: [],
				tempFilePathsCard1: '',
				tempFilePathsCard2: '',
				zerohourname: '',
				zerohourid: '',
				zerohourindex: null,
				giftMother: {
					phone: '',
					storeName: '',
					storeAddress: '',
					storeCategoryId: '',
					storeCategoryName: '',
					idcard1: '',
					idcard2: '',
					storeSex: '惠哥'
				}

			};
		},
		onLoad() {
			this.giftMother.phone = this.$queue.getData("phone")
			this.getstoreCateList()
			this.getProvinces()
		},
		methods: {
			uploadImage(v) {
				var that = this;
				wx.chooseImage({
					count: 1, //最多可以选择的图片总数
					sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success: function(res) {
						console.log(res)
						// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
						var tempFilePaths = res.tempFilePaths;
						if (v == 'positive') {
							that.tempFilePathsCard1 = tempFilePaths[0]
						} else {
							that.tempFilePathsCard2 = tempFilePaths[0]
						}
						//启动上传等待中...
						wx.showToast({
							title: '正在上传...',
							icon: 'loading',
						})
						wx.uploadFile({
							url: fetch.config.baseUrl + '/api-upload/upload/img',
							// url: 'https://test.lanceyi.com/api-upload/upload/img',
							filePath: tempFilePaths[0],
							name: 'file',
							// formData: {
							//  file: wx.getFileSystemManager().readFileSync(that.tempFilePaths1, "base64"),
							// },
							header: {
								"Content-Type": "multipart/form-data"
							},
							success: function(res) {
								uni.hideToast()
								var data = JSON.parse(res.data);
								console.log(123, data);
								if (v == 'positive') {
									that.giftMother.idcard1 = data.data
								} else {
									that.giftMother.idcard2 = data.data
								}
							},
							fail: function(res) {
								wx.hideToast();
								wx.showModal({
									title: '错误提示',
									content: '上传图片失败',
									showCancel: false,
									success: function(res) {}
								})
							}
						});
					}
				});
			},
			// 获取类别列表
			getstoreCateList() {
				this.$http.storeCateList({
					roleCode: 1
				}).then(res => {
					console.log(res)
					if (res.code == 200) {
						this.momCateList = res.data
					}
				})
			},
			// 选择类别
			selectcategory(item, index) {
				// if(this.selectIndex == index ) return this.selectIndex = null
				this.zerohourname = ''
				this.zerohourid = ''
				this.selectIndex = null
				this.selectIndex = index
				this.zerohourname = item.title
				this.zerohourid = item.id
			},
			radioChange(e) {
				console.log(e)
				if (e.detail.value == 0) {
					this.giftMother.storeSex = '惠哥'
				} else {
					this.giftMother.storeSex = '惠姐'
				}
			},
			// 确定选择类目
			handleBuy() {
				if (this.zerohourname == '') return this.$queue.showToast("请选择主营类目")
				this.zerohourindex = this.selectIndex
				this.giftMother.storeCategoryName = this.zerohourname
				this.giftMother.storeCategoryId = this.zerohourid
				this.specClass = 'hide';
			},
			// 礼券妈妈入驻协议
			giftmomagreement() {
				uni.navigateTo({
					url: '/pages/public/digital'
				})
			},
			//勾选
			checkboxChange(e) {
				this.checked = e.detail.value.length
			},
			// 确定下一步
			nextstep() {
				console.log(this.checked)
				if (this.giftMother.storeName == '') {
					this.$queue.showToast('用户昵称不能为空');
					return
				}
				if (this.giftMother.storeCategoryId == '') {
					this.$queue.showToast('请选择主营类目');
					return
				}
				if (this.giftMother.area3Id == '') {
					this.$queue.showToast('店铺地址不能为空');
					return
				}
				if (this.selCity == 0) {
					this.$queue.showToast('请选择店铺地址');
					return
				} else {
					// let str = this.cityList[this.multiIndex[0]].id + ',' + this.areaList[this.multiIndex[1]].id + ',' + this
					// 	.campusList[this.multiIndex[2]].id
					this.giftMother.area1Id = this.cityList[this.multiIndex[0]].id
					this.giftMother.area1Name = this.cityList[this.multiIndex[0]].name
					this.giftMother.area2Id = this.areaList[this.multiIndex[1]].id
					this.giftMother.area2Name = this.areaList[this.multiIndex[1]].name
					this.giftMother.area3Id = this.campusList[this.multiIndex[2]].id
					this.giftMother.area3Name = this.campusList[this.multiIndex[2]].name
				}
				if (this.giftMother.storeAddress == '') {
					this.$queue.showToast('请输入详细地址');
					return
				}
				if (this.giftMother.idcard1 == '' || this.giftMother.idcard2 == '') {
					this.$queue.showToast('请上传身份证照片');
					return
				}
				if (this.checked == false) return this.$queue.showToast('请勾选阅读并同意个人云创业入驻协议');
				this.$http.createGiftMother(this.giftMother).then(res => {
					if (res.code == 200) {
						this.$queue.showToast('入驻成功,请等待审核!');
						setTimeout(() => {
							uni.switchTab({
								url: "/pages/user/user"
							});
						}, 800);
					} else {
						this.$queue.showToast(res.message);
					}
				})
			},
			// 获取市
			getcity(workId) {
				this.$http.getstoreAreaList({
					workId
				}).then(res => {
					this.areaList = res.data
					this.areaList1 = this.areaList.map(e => e.name);
					this.cityArray = [this.cityList1, this.areaList1,
						[]
					]
					// if (this.locationCityArr.length) {
					// 	this.locationCityArr.map((v, i) => {
					// 		this.areaList.map((item, index) => {
					// 			if (item.id == v.id) {
					// 				this.multiIndex[1] = index
					// 				this.getarea(item.id)
					// 			}
					// 		})
					// 	})
					// } else {
					this.getarea(this.areaList[0].id)
					// }
				})
			},
			// 获取区
			getarea(workId) {
				this.$http.getstoreAreaList({
					workId
				}).then(res => {
					this.isloading = 0
					this.campusList = res.data
					this.campusList1 = this.campusList.map(e => e.name);
					this.cityArray = [this.cityList1, this.areaList1,
						this.campusList1
					]
					// if (this.locationCityArr.length) {
					// 	this.locationCityArr.map((v, i) => {
					// 		this.campusList.map((item, index) => {
					// 			if (item.id == v.id) {
					// 				this.multiIndex[2] = index
					// 			}
					// 		})
					// 	})
					// }
				})
			},
			// 省市区获取
			getProvinces(workId, level) {
				this.$http.getstoreAreaList({
					workId
				}).then(res => {
					if (res.code == 200) {
						if (level == 0) {
							this.areaList = res.data
							this.areaList1 = this.areaList.map(e => e.name);
							this.cityArray = [this.cityList1, this.areaList1,
								[]
							]
							this.getarea(this.areaList[0].id)
						} else if (level == 1) {
							this.campusList = res.data
							this.campusList1 = this.campusList.map(e => e.name);
							this.cityArray = [this.cityList1, this.areaList1,
								this.campusList1
							]
						} else {
							this.cityList = res.data
							this.cityList1 = this.cityList.map(e => e.name);
							this.cityArray = [this.cityList1, [],
								[]
							]
							// if (this.locationCityArr.length) {
							// 	this.locationCityArr.map((v, i) => {
							// 		this.cityList.map((item, index) => {
							// 			if (item.id == v.id) {
							// 				this.multiIndex[0] = index
							// 				this.getcity(item.id)
							// 			}
							// 		})
							// 	})
							// } else {
							this.getcity(this.cityList[0].id)
							// }
						}

					}
				})
			},
			// 城市三级联动
			changeCity(e) {
				this.selCity = 0
				switch (e.detail.column) {
					case 0:
						this.cityList.map((item, index) => {
							if (index == e.detail.value) {
								this.getProvinces(item.id, e.detail.column)
							}
						})
						this.multiIndex = [e.detail.value, 0, 0]
						break;
					case 1:
						this.areaList.map((item, index) => {
							if (index == e.detail.value) {
								this.getProvinces(item.id, e.detail.column)
							}
						})
						var i = this.multiIndex[0];
						this.multiIndex = [i, e.detail.value, 0]
						break;
					case 2:
						var i = this.multiIndex[0];
						var j = this.multiIndex[1];
						this.multiIndex = [i, j, e.detail.value];
				}
			},
			chooseCity(e) {
				this.selCity = 1
			},
			/* 打开规格弹窗 */
			showSpec(fun) {
				this.specClass = 'show';
			},
			no() {
				// 方法勿删
			},
			/* 关闭规格弹窗 */
			hideSpec() {
				// this.goodsData.number = this.quota
				this.specClass = 'hide';
				setTimeout(() => {
					this.selectIndex = this.zerohourindex
					this.specClass = 'none';
				}, 200);
			},
		}
	};
</script>
<style lang="scss">
	page {
		background-color: #fff;
	}

	.momenter {
		.message {
			margin: 30upx;
			background-color: #fff;
			border-radius: 16upx;

			.rowcard {
				margin: 28upx 0upx 0upx;

				.text {
					color: #F53232;
					margin-right: 8upx;
				}

				.right {
					margin-top: 28upx;
					display: flex;
					justify-content: space-between;

					image {
						width: 332upx;
						height: 212upx;
					}
				}
			}

			.row {
				height: 96upx;
				// margin: 0upx 28upx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 2upx solid #F7F7F7;

				.left {
					display: flex;
					// align-items: center;

					// image {
					// 	padding-top: 4upx;
					// 	width: 28upx;
					// 	height: 28upx;
					// }
					.text {
						color: #F53232;
						margin-right: 8upx;
					}

					text {
						// margin-left: 20upx;
						font-size: 28upx;
						font-weight: 500;
						color: #333333;
					}
				}

				.right {

					// margin-right: 28upx;
					.radio-group {
						display: flex;
						align-items: center;

						.radio-group-label {
							display: flex;
							align-items: center;

							radio .wx-radio-input {
								width: 36rpx;
								height: 36rpx;
							}

							radio::before {
								font-family: "cuIcon";
								content: "";
								position: absolute;
								color: #ffffff !important;
								top: 50%;
								margin-top: -16rpx;
								right: 4rpx;
								font-size: 32upx;
								line-height: 32upx;
								pointer-events: none;
								transform: scale(1, 1);
								transition: all 0.3s ease-in-out 0s;
								z-index: 9;
							}

							radio .wx-radio-input.wx-radio-input-checked {
								background-image: url(../../orders/static/img/checkyes.png);
								background-size: cover;
								background-repeat: inherit;
							}

							.weui-cell__bd {
								font-size: 28upx;
								font-weight: 300;
								color: #333333;
								margin-right: 0rpx
							}

							view {
								margin-right: 20upx;
							}
						}
					}
				}
			}
		}

		.categoryDialog {
			.maincategory {
				margin-top: 32upx;
				font-size: 32upx;
				color: #333333;
			}

			.levelcategory {
				text-align: left;
				margin-left: 28upx;
				font-weight: 500;
				color: #333333;
			}

			.flexcategory {
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
			}

			.flexcategory:after {
				content: '';
				width: 210upx;
				height: 64upx;
			}

			.itemcategory {
				width: 210upx;
				height: 64upx;
				overflow: hidden; //超出的文本隐藏
				text-overflow: ellipsis; //溢出用省略号显示
				white-space: nowrap; //溢出不换行
				margin-top: 32upx;
				padding: 12upx 20upx;
				background: #fff;
				border: 2upx solid #F2F2F2;
				border-radius: 56upx;
				font-size: 28upx;
				font-weight: 300;
				color: #666666;

				text {
					display: inline-block;
					// width: 130upx;
					overflow: hidden; //超出的文本隐藏
					text-overflow: ellipsis; //溢出用省略号显示
					white-space: nowrap; //溢出不换行
				}
			}

			.itemcategorysel {
				background: #EB6133;
				color: #FFFFFF;
			}

			.buttoncategory {
				margin: 60upx auto 32upx;
				width: 524rpx;
				height: 76rpx;
				background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
			}
		}
	}

	.nextstep {
		width: 524upx;
		height: 38px;
		line-height: 76upx;
		border-radius: 40upx;
		margin: 0 auto;
		text-align: center;
		background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
		font-size: 28upx;
		font-weight: 300;
		color: #FFFFFF;
	}

	.agreement {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		margin-bottom: 64upx;

		.text {
			margin-left: 16upx;
			font-size: 26upx;
			font-weight: 300;
			color: #333;
		}

		.checkbtn {
			// width: 36upx;
			// height: 36upx;
			margin-right: 28upx;

			checkbox {
				margin-left: 28upx;
				// width: 36upx;
				// height: 36upx;
			}

			checkbox::before {
				font-family: "cuIcon";
				content: "\e645";
				position: absolute;
				color: #ffffff !important;
				top: 50%;
				left: 4upx;
				pointer-events: none;
				transform: scale(1, 1);
				transition: all 0.3s ease-in-out 0s;
				z-index: 9;
			}

			/*checkbox 选项框大小  */
			checkbox .wx-checkbox-input {
				width: 36upx;
				height: 36upx;
				border-radius: 50%;
				// background-image: url(../static/img/checkno.png);
				background-size: cover;
				background-repeat: inherit;
			}

			checkbox .wx-checkbox-input.wx-checkbox-input-checked {
				// background-image: url(../static/img/checkyes.png);
				background-size: cover;
				background-repeat: inherit;
			}

			checkbox[checked] .wx-checkbox-input {
				background-color: #eb6132 !important;
				border-color: #eb6132 !important;
				color: #eb6132 !important;
				border-color: #eb6132 !important;
			}

			checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
				width: 36upx;
				height: 36upx;
				line-height: 36upx;
				text-align: center;
				color: #E10A07;
			}

		}
	}
</style>
