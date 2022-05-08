/*
 * @Author: Gmsoft - WeiHong Ran
 * @Date: 2021-03-22 17:13:53
 * @LastEditors: Gmsoft - WeiHong Ran
 * @LastEditTime: 2021-03-28 13:16:56
 * @Description: Nothing
 */
import Vue from 'vue';
import GoodsPicker, { ProductData } from './components/GoodsPicker';

import './Product.less';

interface ProductType {
  id: string;
  name: string;
  desc?: string;
  isAll?: boolean;
}

export default Vue.extend({
  name: 'Product',
  data() {
    const productType: ProductType[] = [
      {
        id: '1',
        name: '全部',
        isAll: true
      },
      {
        id: '2',
        name: '合租挖矿',
        desc: '定期稳健收益'
      },
      {
        id: '3',
        name: '合约算力',
        desc: '低门槛轻松挖币'
      },
      {
        id: '4',
        name: '联合挖矿',
        desc: '超高收益，快速回本'
      }
    ];
    const productList: ProductData[] = [
      {
        productId: '1',
        title: '合租挖矿新手体验包11',
        tags: ['限投一次1', '新手礼包'],
        subTitles: [
          '预期年化收益1',
          '起投资金1',
          '服务期限1',
          (conf: ProductData) => `已售：${conf.percent}%`
        ],
        subVals: ['7.00%', '100CNY', '30天'],
        percent: 15.5
      },
      {
        productId: '2',
        title: '矿场360天精选合租挖矿',
        tags: '押金保证',
        subTitles: [
          '预期年化收益1',
          '起投资金1',
          '服务期限1',
          (conf: ProductData) => `已售：${conf.percent}%`
        ],
        subVals: ['16.00%', '1000CNY', '30天'],
        percent: 100
      },
      {
        productId: '3',
        title: '矿场180天精选合租挖矿',
        tags: '押金保证',
        subTitles: [
          '预期年化收益1',
          '起投资金1',
          '服务期限1',
          (conf: ProductData) => `已售：${conf.percent}%`
        ],
        subVals: ['13.00%', '1000CNY', '30天'],
        percent: 35.5
      }
    ];
    return { productType, activeId: '1', productList };
  },
  methods: {
    onActiveClick(product: ProductType) {
      this.activeId = product.id;
    }
  },
  render() {
    const { productType } = this;

    return (
      <div class="product-root container">
        <div class="product-types">
          {productType.map(product => (
            <div
              onClick={() => this.onActiveClick(product)}
              class={{
                'product-item': true,
                active: product.id === this.activeId
              }}
              key={product.id}
            >
              {product.isAll ? (
                <div class="item-all">全部产品</div>
              ) : (
                <div class="item-title">{product.name}</div>
              )}
              {product.desc && <div class="item-desc">定期稳健收益</div>}
            </div>
          ))}
        </div>
        <div class="product-list">
          {this.productList.map(item => (
            <GoodsPicker product-info={item} />
          ))}
        </div>
      </div>
    );
  }
});
