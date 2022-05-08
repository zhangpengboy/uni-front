<!-- 幸运大转盘 -->
<template>
  <div class='luckyWheel'>
    <!-- 大转盘抽奖 -->
    <LuckyWheel
      class="luckDraw"
      ref="LuckyWheel"
      width="300px"
      height="300px"
      :prizes="prizes"
      :default-style="defaultStyle"
      :blocks="blocks"
      :buttons="buttons"
      @start="startCallBack"
      @end="endCallBack"
    />
    <!-- 九宫格 -->
    <LuckyGrid
      class="luckDraw"
      ref="LuckDraw"
      width="300px"
      height="300px"
      :prizes="prizesGrid"
      :buttons="buttonsGrid"
      :blocks="blocksGrid"
      :default-config="defaultConfigGrid"
      :default-style="defaultStyleGrid"
      :active-style="activeStyleGrid"
      @start="startCallBackGrid"
      @end="endCallBackGrid"
    />
  </div>
</template>

<script>
import { LuckyWheel, LuckyGrid } from 'vue-luck-draw' //
export default {
  name: 'luckyWheel',
  components: { LuckyWheel, LuckyGrid },
  data () {
    return {
      prizes: [],
      defaultStyle: {
        fontColor: '#d64737',
        fontSize: '14px'
      },
      blocks: [
        { padding: '13px', background: '#d64737' }
      ],
      buttons: [
        { radius: '50px', background: '#d64737' },
        { radius: '45px', background: '#fff' },
        { radius: '41px', background: '#f6c66f', pointer: true },
        {
          radius: '35px',
          background: '#ffdea0',
          imgs: [{ src: require('@/assets/images/lucky/button.png'), width: '65%', top: '-50%' }]
        }
      ],
      luckyNum: 0,
      prizesGrid: [],
      blocksGrid: [
        { padding: '15px', background: '#ffc27a', borderRadius: 28 },
        { padding: '4px', background: '#ff4a4c', borderRadius: 23 },
        { padding: '4px', background: '#ff625b', borderRadius: 20 }
      ],
      defaultConfigGrid: {
        gutter: 5
      },
      defaultStyleGrid: {
        borderRadius: 15,
        fontColor: '#DF424B',
        fontSize: '14px',
        textAlign: 'center',
        background: '#fff',
        shadow: '0 5 1 #ebf1f4'
      },
      activeStyleGrid: {
        background: 'linear-gradient(270deg, #FFDCB8, #FDC689)',
        shadow: ''
      }
    }
  },
  computed: {
    buttonsGrid () {
      return [{
        x: 1,
        y: 1,
        background: 'linear-gradient(270deg, #FFDCB8, #FDC689)',
        shadow: '0 5 1 #e89b4f',
        fonts: [
          { text: `剩余${this.luckyNum} 次`, fontColor: '#fff', top: '73%', fontSize: '11px' }
        ],
        imgs: [
          { src: require('@/assets/images/lucky/button.png'), width: '65%', top: '13%' }
          // { src: require('@/assets/images/lucky/button.png'), width: '50%', top: '73%' }
        ]
      }]
    }
  },
  mounted () {
    this.getPrizesList()
    this.getPrizeListGrid()
  },
  methods: {
    // 大转盘
    getPrizesList () {
      const prizes = []
      let data = ['1元红包', '100元红包', '0.5元红包', '2元红包', '10元红包', '50元红包', '0.3元红包', '5元红包']
      data.forEach((item, index) => {
        prizes.push({
          title: item,
          background: index % 2 ? '#f9e3bb' : '#f8d384',
          fonts: [{ text: item, top: '10%' }],
          imgs: [{ src: require(`@/assets/images/lucky/${index}.png`), width: '30%', top: '35%' }]
        })
      })
      this.prizes = prizes
    },
    startCallBack () {
      this.$refs.LuckyWheel.play()
      setTimeout(() => {
        this.$refs.LuckyWheel.stop(Math.random() * 4 >> 0)
      }, 2000)
    },
    endCallBack (prize) {
      alert(`恭喜你获得${prize.title}`)
    },
    // 九宫格
    getPrizeListGrid () {
      // 模拟接口请求奖品列表
      setTimeout(() => {
        const data = [
          { name: '1元红包', img: require('@/assets/images/lucky/0.png') },
          { name: '100元红包', img: require('@/assets/images/lucky/1.png') },
          { name: '0.5元红包', img: require('@/assets/images/lucky/2.png') },
          { name: '2元红包', img: require('@/assets/images/lucky/3.png') },
          { name: '10元红包', img: require('@/assets/images/lucky/4.png') },
          { name: '50元红包', img: require('@/assets/images/lucky/5.png') },
          { name: '0.3元红包', img: require('@/assets/images/lucky/6.png') },
          { name: '5元红包', img: require('@/assets/images/lucky/7.png') }
        ]
        const prizes = []
        this.luckyNum = 1
        let axis = [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1]]
        for (let i = 0; i < 8; i++) {
          let item = data[i]
          prizes.push({
            index: i,
            x: axis[i][0],
            y: axis[i][1],
            fonts: [{ text: item.name, top: '70%' }],
            imgs: [{ src: item.img, width: '55%', top: '8%' }]
          })
        }
        this.prizesGrid = prizes
      }, 0)
    },
    startCallBackGrid () {
      if (!this.luckyNum) return alert('还剩0次抽奖机会')
      this.$refs.LuckDraw.play()
      setTimeout(() => {
        this.$refs.LuckDraw.stop(Math.random() * 7 >> 0)
      }, 2000)
    },
    endCallBackGrid (prize) {
      alert(`恭喜你获得大奖: ${prize.fonts[0].text}`)
      this.luckyNum--
    }
  }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
.luckyWheel {
  background: white;
  .luckDraw {
    margin:0 auto 10px;
  }
}
</style>
