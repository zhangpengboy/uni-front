<template>
  <div class>
    <!-- 能量球 -->
    <div class="js-version-container" :style="{ height: cHeight }">
      <img
        style="display: none"
        src="@/assets/images/FruitTree/FruitTrees/树-发芽（爱情树）.png"
        :class="['tree', moveEnd ? 'flip' : '']"
        :style="{ width: `${treeWidth}px`, height: `${treeHeight}px` }"
      />
      <div
        :class="['circle', targetIndex === index ? '' : 'wave']"
        :style="circleStyle(item)"
        v-for="(item, index) in circleArr"
        :key="index"
        @click="startMove(index)"
      >
        <div class="circle-text">
          <span :class="[index != 1 ? 'col-cc' : '']" v-if="index == 1">
            +{{ item.count }}
          </span>
          <!-- 偷水 -->
          <div class="circleIcon" v-if="index == 1">
            <transition v-if="wasteals && index == 1" name="van-fade">
              <img
                width="100%"
                height="100%"
                src="@/assets/images/icons/头水滴.png"
                alt
                srcset
              />
            </transition>
          </div>
          <div class="cirIcHand">
            <transition v-if="wasteal && index == 1" name="cirIcHands">
              <div class="circleIconste">
                <span>-{{ item.count - 1 }}</span>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      imgs: require('@/assets/images/马-抬头.png'),
      canvas: null,
      cxt: null,
      circlePadding: 50, // 左右边距，也会影响到生成的球的横坐标边界
      treeWidth: 400, // 树的宽度
      treeHeight: 400, // 树的高度
      moveTarget: null, // 移动对象
      targetIndex: null, // 被点击的对象的索引
      isMoving: false, // 是否在移动中
      moveEnd: false, // 移动结束状态，用于触发树的动画
      circleArr: [], // 所有点的集合数组 位置集合
      xArr: [], // 所有点的横坐标数组
      easing: 0.15, // 阻尼系数
      r: 0.50666, // 圆形半径,
      wasteal: false,
      wasteals: true
    }
  },
  computed: {
    cWidth () {
      return window.innerWidth
    },
    cHeight () {
      return window.innerHeight
    }
  },
  watch: {
    // 监听触发树的状态
    isMoving (nv, ov) {
      if (!nv && ov) {
        this.moveEnd = true
      } else if (nv && !ov) {
        this.moveEnd = false
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.createList(2)
    },
    circleStyle (item) {
      const r = item.r * 2
      return {
        top: `${item.y}rem`,
        left: `${item.x}px`,
        width: `${r}rem`,
        height: `${r}rem`,
        lineHeight: `${r}rem`,
        borderRadius: '50%',
        transform: `scale(${item.scale})`
      }
    },
    // 水滴
    startMove (index) {
      var that = this
      if (index === 1) {
        that.wasteal = !that.wasteal
        that.wasteals = !that.wasteals
        // this.targetIndex = index; //保存移动目标的索引
        setTimeout(() => {
          that.wasteal = !that.wasteal
        }, 10)
      }
    },
    move () {
      this.circleArr.splice(this.targetIndex, 1)
      this.moveTarget = null
      this.targetIndex = null
    },
    // 生成随机数方法
    randomNum (from, to) {
      return Math.floor(Math.random() * (to - from + 1) + from)
    },
    // 生成圆点方法
    createList (count) {
      let { cWidth, circlePadding } = this
      let index = 0
      // 生成每一个坐标
      while (this.circleArr.length < count) {
        if (index > 100) return false
        index++
        var x = this.randomNum(circlePadding, cWidth - circlePadding - 20)
        var y = this.randomNum(3, 4.5)
        if (!this.isNear(x)) {
          this.circleArr.push({
            x,
            y,
            r: this.r,
            count: this.randomNum(1, 20), // 数字，后台获取
            scale: 1 // 用于动画缩放倍数的参数，默认为1
          })
          this.xArr.push(x)
        }
      }
    },
    isNear (x) {
      var near = false
      this.xArr.forEach((val) => {
        // 本来为至少要小于2倍半径，但如果其余的点把屏幕均分了，下一个点就永远满足不了条件，
        // 故改为小于1.5倍半径，即有多于4/3个圆的部分重叠，则判断为太近
        // 这里可以根据需要更改判断条件
        if (Math.abs(x - val) < (this.r * 3) / 2) {
          near = true
        }
      })
      return near
    }
  }
}
</script>
<style lang='scss' scoped>
.col-cc {
  color: #cccccc !important;
}
// ......
@keyframes wave {
  0% {
    transform: translateY(-3px);
  }
  50% {
    transform: translateY(3px);
  }
  100% {
    transform: translateY(-3px);
  }
}

.tree {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  transform-origin: bottom;
}
// 圆
.circle {
  position: absolute;
  text-align: center;
  background: linear-gradient(to top, #95eeff 0%, #93edff 70%, #cffaff 100%);
  z-index: 1000;
}

.circle-text {
  position: relative;
  color: #47c04b;
}
.circle-text > .circleIcon {
  position: absolute;
  top: -0.1rem;
  right: -0.3333rem;
  width: 0.7rem;
}
.circle-text .circleIconste {
  position: absolute;
  top: -15px;
  left: 30%;
}
.circle-text .circleIconste > span {
  height: 17px;
  font-size: 12px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(71, 192, 75, 1);
  line-height: 17px;
}
// 水
.wave {
  animation: wave 2.5s infinite ease-in-out;
}
.cirIcHand .cirIcHands-enter {
  opacity: 0;
  transform: translateY(40px);
}

.cirIcHand .cirIcHands-leave-to {
  opacity: 0;
  transform: translateY(-40px);
}

.cirIcHand .cirIcHands-enter-active,
.cirIcHand .cirIcHands-leave-active {
  transition: all 0.5s ease;
}
</style>
