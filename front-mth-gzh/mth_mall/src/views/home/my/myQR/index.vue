<template>
  <div class="myqr">
    <van-nav-bar
      :title="$route.meta.title"
      left-arrow
      fixed
      :border="false"
      placeholder
      @click-left="$router.back()"
    />
    <div class="share-box">
      <div class="logo">
        <van-image
          round
          width="1.83784rem"
          height="1.83784rem"
          :src="
            userWeixinInfo.headImgUrl
              ? userWeixinInfo.headImgUrl
              : require('@/assets/images/logo.png')
          "
        />
      </div>
      <div class="text-center name">
        <span>{{ userWeixinInfo.nickname }}</span>
      </div>
      <div class="QR">
        <van-image :src="imgQr" />
      </div>
      <div class="title">
        我的邀请码: {{ $lance.getData('userInviteCode') }}
      </div>
      <!-- <div class="sub_title">邀请好友注册得18积分，当钱花！</div> -->
      <div class="btn">长按保存分享好友</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['userInfo', 'userWeixinInfo'])
  },
  data () {
    return {
      imgQr: null,
      downloadImg: null
    }
  },
  mounted () {
    // 获取邀请码
    this.getQrCode()
  },
  methods: {
    // 获取邀请码
    getQrCode () {
      this.$http.post(
        this.$apiUri.APP_WXBARCODEIMG_GET,
        {
          scene: this.$lance.getData('userInviteCode'),
          // TODO 这里路径需要修改
          path: 'pages/exchange/exchange',
          width: '430'
        },
        res => {
          // console.log(22, res)
          if (res.code === '200') {
            this.imgQr =
              'data:image/png;base64,' + res.data.replace(/[\r\n]/g, '')
            // console.log('cdc', this.imgQr)
            this.downloadImg = res.data
          } else {
            this.imgQr = this.$baseUtils.publicCdnHost() + '/mpapp/qr.png'
          }
        },
        err => {
          this.imgQr = this.$baseUtils.publicCdnHost() + '/mpapp/qr.png'
          this.$toast(err.message)
        }
      )
    }
    /* 保存二维码 */
    // handleSaveQrCode () {
    //   var imgSrc = this.downloadImg // base64编码
    //   console.log(11, this.$wxApi.wx)
    //   var save = this.$wxApi.getFileSystemManager() // 获取文件管理器对象
    //   var number = Math.random()
    //   save.writeFile({
    //     filePath:
    //       this.$wxApi.env.USER_DATA_PATH + '/jms_pic_' + number + '.png', // 表示生成一个临时文件名
    //     data: imgSrc,
    //     encoding: 'base64',
    //     success: res => {
    //       this.$wxApi.wx.saveImageToPhotosAlbum({
    //         filePath:
    //           this.$wxApi.env.USER_DATA_PATH + '/jms_pic_' + number + '.png',
    //         success: function (res) {
    //           this.$toast('保存成功')
    //         },
    //         fail: function (err) {
    //           console.log(err)
    //         }
    //       })
    //       console.log(res)
    //     },
    //     fail: err => {
    //       console.log(err)
    //     }
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
.myqr {
  height: 100%;
  background: linear-gradient(360deg, #f7f7f7 0%, #ffc2a6 32%, #eb6132 100%);

  .van-nav-bar__placeholder {
    /deep/ .van-nav-bar {
      background-color: #fff0 !important;
    }
  }

  .share-box {
    background-color: #fff;
    position: relative;
    height: 80vh;
    top: 20vh;
    border-top-left-radius: 25px;
    border-top-right-radius: 25px;
    color: #333;
    .logo {
      position: absolute;
      top: -40px;
      left: 50%;
      height: 68px;
      width: 68px;
      border-radius: 50%;
      transform: translateX(-50%);
      overflow: hidden;
    }

    .name {
      padding-top: 30px;
      font-size: 18px;
    }

    .QR {
      width: 60vw;
      height: 60vw;
      margin: 0 auto;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;

      image {
        width: 50vw;
        height: 50vw;
      }
    }

    .title {
      width: 100%;
      margin-top: 25px;
      display: flex;
      justify-content: center;
      font-size: 18px;
    }

    .sub_title {
      width: 100%;
      margin-top: 25px;
      display: flex;
      justify-content: center;
      font-size: 16px;
    }
  }

  .btn {
    width: 50%;
    height: 40px;
    border-radius: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
    margin: 0 auto;
    margin-top: 25px;
    background-color: #eb6132;
    color: #ffffff;
  }
}
</style>
