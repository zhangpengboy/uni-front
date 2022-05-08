<template>
  <div>
    <div class="selection" v-for="item in ListShow" :key="item.id">
      <div class="letterList">
        <div class="letter">
          {{ item.letter }}
        </div>
      </div>
      <div class="provinceList">
        <div v-for="(v, i) in item.code" :key="i" @click="goSelection(v, i)">
          <div class="provincetext" :class="{ active: listIndex == v }">
            <span>{{ item.name[i] }}</span>
          </div>
        </div>
      </div>
    </div>
    <div style="  width: 100%;height: 60px;background-color: #fff;"></div>
  </div>
</template>
<script>
import { letter } from '@/store/index'

export default {
  data () {
    return {
      actCode: '',
      ListShow: [],
      listIndex: ''
    }
  },
  created () {
    this.getprovinceList()
  },
  methods: {
    goSelection (v, i) {
      // this.actCode = code[i]
      this.listIndex = v
      this.$lance.setJson('code_key', v)
      this.$router.push('hometown')
    },
    deWeight (arr) {
      for (var i = 0; i < arr.length - 1; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i].letter === arr[j].letter) {
            arr[i].name += ' ' + arr[j].name
            arr[i].code += ' ' + arr[j].code
            arr.splice(j, 1)
            // 因为数组长度减小1，所以直接 j++ 会漏掉一个元素，所以要 j--
            j--
          }
        }
      }
      return arr
    },
    getprovinceList () {
      this.$http.post(
        this.$apiUri.APP_TOWNLIST,
        {
          actCode: 'mth_2uyow1nn'
        },
        res => {
          if (res.success) {
            // this.ListShow = res.data
            res.data.map(item => {
              if (item.name) {
                var strsub = item.name.substr(0, 1)
                item.letter = letter(strsub)[0]
                // if(item.code == 'mth_catllpsc' || item.code == 'mth_io4nqnlv' || item.code == 'mth_1xpilyjg') {

                if (item.name.indexOf('重') !== -1) {
                  item.letter = letter(strsub)[1]
                }
                if (item.name.indexOf('广') !== -1) {
                  item.letter = letter(strsub)[0]
                }
                if (
                  item.name.includes('香港') ||
                  item.name.includes('台湾') ||
                  item.name.includes('澳门')
                ) {
                  item.letter = '#'
                }
              }
            })
            this.ListShow = _.cloneDeep(this.deWeight(res.data))

            this.ListShow.map(item => {
              item.code = item.code.split(' ')
              item.name = item.name.split(' ')
            })
            // console.log(22, this.ListShow)
          }
        }
      )
    }
  }
}
</script>

<style lang="scss">
.active {
  background: #ffebe4;
  border: 2px solid #eb6133;
  color: #eb6132 !important;
}

.selection {
  background-color: #fff;

  display: flex;

  .letterList {
    .letter {
      margin: 30px 0px 0px 32px;
      width: 8px;
      height: 18px;
      font-size: 13px;
      font-weight: 300;
      line-height: 18px;
      color: #999999;
      opacity: 1;
    }
  }

  .provinceList {
    display: flex;
    flex-wrap: wrap;

    .provincetext {
      width: 72px;
      margin-left: 24px;
      margin-top: 30px;
      text-align: center;
      line-height: 24px;
      height: 24px;
      background: #f2f2f2;
      border-radius: 29px;
      box-sizing: border-box;
      span {
        width: 26px;
        height: 18px;
        font-size: 13px;
        font-weight: 300;
        line-height: 18px;
        color: #333333;
        opacity: 1;
      }
    }

    .provincetext:first-child {
      margin-left: 22px;
    }
  }
}
</style>
