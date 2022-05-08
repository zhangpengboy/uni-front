/*
 * @Author: Gmsoft - WeiHong Ran
 * @Date: 2021-03-25 09:14:18
 * @LastEditors: Gmsoft - WeiHong Ran
 * @LastEditTime: 2021-03-28 13:34:11
 * @Description: Nothing
 */
import Vue from 'vue';

export interface ProductData {
  /** 产品ID */
  productId: string;
  /** 产品名称 */
  title: string;
  /** 产品Tag，可以有多个 */
  tags: string | string[];
  /** 子标题 */
  subTitles: (string | ((conf: ProductData) => string))[];
  /** 子项值 */
  subVals: (string | any)[];
  /** 已售百分比 */
  percent: number;
}

export default Vue.extend({
  name: 'GoodsPicker',
  props: {
    productInfo: {
      required: true,
      type: Object as () => ProductData
    }
  },
  data: () => ({
    amount: 10000,
    checked: true
  }),

  methods: {
    getTitle(val: string | ((conf: ProductData) => string)) {
      if (typeof val === 'string') {
        return val;
      }
      return val(this.productInfo);
    },
    onBuy() {
      console.log('buyer');
    },
    onDetailClick() {
      const { productInfo } = this;
      this.$router.push({
        path: `/productDetail?productId=${productInfo.productId}`
      });
    }
  },
  computed: {
    sellOut: function() {
      const {
        productInfo: { percent }
      } = this;
      return percent >= 100;
    }
  },

  render() {
    const { sellOut } = this;
    const { productInfo: conf } = this;
    const { title, tags, subTitles, subVals, percent } = conf;

    return (
      <div class="product-layout">
        <div class="jms-right-box">
          <div class="content" onClick={this.onDetailClick}>
            <div class="name">
              {title}
              {typeof tags === 'string' ? (
                <span class="tips">{tags}</span>
              ) : (
                tags.map(tag => <span class="tips">{tag}</span>)
              )}
            </div>
            <div class="product">
              <div class="product-item">
                <p class="label">{this.getTitle(subTitles[0])}</p>
                <h2 class="value income color-main">{subVals[0]}</h2>
                <div class="line"></div>
                <p class="label">{this.getTitle(subTitles[1])}</p>
                <h2 class="value">{subVals[1]}</h2>
              </div>
              <div class="product-item">
                <p class="label">{this.getTitle(subTitles[2])}</p>
                <h2 class="value money">{subVals[2]}</h2>
                <div class="line"></div>
                <p class="label">{this.getTitle(subTitles[3])}</p>
                <div class="progress">
                  <el-progress
                    showText={false}
                    strokeWidth={6}
                    percentage={percent}
                    status="warning"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class={{ from: true, 'sell-out': sellOut }}>
            <div class="from-label">认证金额</div>
            <el-input
              v-model={this.amount}
              placeholder="起购金额为1000且是100的倍数"
              size="large"
            ></el-input>
            <el-button
              onClick={this.onBuy}
              disabled={!this.checked || sellOut}
              type="primary"
              class="btn-buy"
              size="large"
            >
              立即购买
            </el-button>
            <p>
              <el-checkbox v-model={this.checked} disabled={sellOut}>
                我已阅读并同意
                <el-link type="primary">《主要链接》</el-link>
              </el-checkbox>
            </p>
          </div>
        </div>
      </div>
    );
  }
});
