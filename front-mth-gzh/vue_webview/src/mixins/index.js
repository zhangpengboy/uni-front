/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-25 10:53:47
 * @Description  : Vue 混合模式
 */
import store from '../store'
export default {
  data () {
    return {
      // 是否登录
      hasLogin: false
    }
  },
  mounted () {
    this.hasLogin = store.state.hasLogin
  },
  methods: {
    afterReadUploader (File, i, name) {
      this.$toast.loading({
        message: '图片上传中...',
        forbidClick: true,
        duration: 0
        // mask: true
      })
      var formData = new FormData()
      formData.append('file', File.file)
      formData.append('fileType', i)
      this.$http.post(
        this.$apiUri.APP_IBOXPAY_FILEUPLOAD,
        formData,
        (res) => {
          if (res.success) {
            this.$toast.clear()
            this.$toast('图片上传成功')
            this.form.imgList.push({
              name: name,
              url: res.data.url,
              value: res.data.code
              // base64: res.data.base64
            })
            // console.log(this.form.imgList)
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
