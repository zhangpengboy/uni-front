/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-25 10:53:47
 * @Description  : Vue 混合模式
 */
import store from '../store'
import * as imageConversion from 'image-conversion'
export default {
  data () {
    return {
      // 是否登录
      hasLogin: false
    }
  },
  created () {
    window.androidResponse = this.androidResponse
  },
  mounted () {
    this.hasLogin = store.state.hasLogin
  },
  methods: {
    // * android upload
    androidUpload (type) {
      let obj = {
        type: type
      }
      this.$baseUtils.toAppBaseFun('uploadImg', obj)
    },
    // 上传前压缩图片
    beforeReadFileList (file) {
      // 判断是否多图压缩
      if (Array.isArray(file)) {
        for (let index = 0; index < file.length; index++) {
          this.beforeReadFile(file[index])
        }
      } else {
        this.beforeReadFile(file)
      }
    },
    // 上传前压缩图片
    beforeReadFile (file) {
      // 上传之前校验
      return new Promise((resolve, reject) => {
        console.log('压缩前', file) // 压缩到3MB,大于3MB的图片都会进行压缩，小于则不会
        imageConversion.compressAccurately(file, 1024 * 3).then(res => { // console.log(res)
          res = new File([res], file.name, { type: res.type, lastModified: Date.now() })
          console.log('压缩后', res)
          resolve(res)
        })
      })
    },
    afterReadUploader (File, i) {
      this.$toast.loading({
        message: '图片上传中...',
        forbidClick: true,
        duration: 0
        // mask: true
      })
      if (Array.isArray(File)) {
        for (let index = 0; index < File.length; index++) {
          this.get(File[index], i)
        }
      } else {
        this.get(File, i)
      }
    },
    get (File, i) {
      var formData = new FormData()
      formData.append('file', File.file)
      this.$http.post(
        this.$apiUri.APP_UPLOAD_IMG,
        formData,
        (res) => {
          if (res.success) {
            this.$toast.clear()
            this.$toast('图片上传成功')
            if (i === 1) this.form.goodsIcon = res.data
            if (i === 2) this.bannerImgUrlList.push(res.data)
            if (i === 3) {
              this.detailImgUrlList.push(res.data)
            }
            if (i === 4) {
              this.skuItem.skuImg = res.data
            }
          } else {
            this.$toast.clear()
            this.$toast('图片上传失败，请重新上传')
          }
        },
        (err) => {
          this.$toast.clear()
          this.$toast(err.message)
        }
      )
    }
  }
}
