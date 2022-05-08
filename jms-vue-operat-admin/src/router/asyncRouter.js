/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-10-25 13:38:41
 * @Description  : 模拟后台返回的异步路由
 */
import Layout from '@/layout/index'
// 公共路由
export const asyncRoutes = [
  // * 用户管理
  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    name: 'User',
    alwaysShow: true,
    meta: { title: '用户管理', icon: 'peoples' },
    children: [
      {
        path: 'list',
        name: 'UserList',
        component: resolve => require(['@/views/user/userList'], resolve),
        meta: { title: '用户列表', icon: 'swagger', noCache: true }
      },
      // {
      //   path: 'userFeign',
      //   name: 'userFeign',
      //   component: resolve => require(['@/views/user/userFeign'], resolve),
      //   meta: { title: '创建初始系统账号', icon: 'swagger', noCache: true }
      // },
      // {
      //   path: 'setProfit',
      //   name: 'SetProfit',
      //   component: (resolve) => require(['@/views/user/setProfit'], resolve),
      //   meta: { title: '设置业务员分润', icon: 'swagger', noCache: true }
      // },
    ]
  },
  // * 商品管理
  {
    path: '/goods',
    component: Layout,
    redirect: '/goods/list',
    name: 'Goods',
    alwaysShow: true,
    meta: { title: '商品管理', icon: 'goods' },
    children: [
      {
        path: 'category',
        name: 'GoodsCategory',
        component: resolve => require(['@/views/goods/category'], resolve),
        meta: { title: '分类管理', icon: 'dict', noCache: true }
      },
      {
        path: 'appBrand',
        name: 'AppBrand',
        component: resolve => require(['@/views/goods/appBrand'], resolve),
        meta: { title: '品牌管理', icon: 'dict', noCache: true }
      },
      {
        path: 'list',
        name: 'GoodsList',
        component: resolve => require(['@/views/goods/index/index'], resolve),
        meta: { title: '商品列表', icon: 'swagger', noCache: false }
      },
      {
        path: 'streetList',
        name: 'streetGoodsList',
        component: resolve => require(['@/views/goods/streetList/index'], resolve),
        meta: { title: '街市商品列表', icon: 'swagger', noCache: false }
      },
      {
        path: 'detail',
        name: 'GoodsDetail',
        hidden: true,
        component: resolve => require(['@/views/goods/index/detail'], resolve),
        meta: { title: '商品详情', icon: 'post', noCache: true }
      },
      {
        path: 'streetGoodsDetail',
        name: 'streetGoodsDetail',
        hidden: true,
        component: resolve => require(['@/views/goods/streetList/detail'], resolve),
        meta: { title: '商品详情', icon: 'post', noCache: true }
      },
      // {
      //   path: 'goodsLibrary',
      //   name: 'GoodsLibrary',
      //   component: resolve => require(['@/views/goods/goodsLibrary'], resolve),
      //   meta: { title: '商品库管理', icon: 'swagger' },
      //   children: [
      //     {
      //       path: 'convenienceStoreBasis',
      //       name: 'ConvenienceStoreBasis',
      //       component: resolve =>
      //         require([
      //           '@/views/goods/goodsLibrary/convenienceStoreBasis'
      //         ], resolve),
      //       meta: { title: '商品基础库', icon: 'swagger', noCache: true }
      //     },
      //     {
      //       path: 'convenienceStoreClassification',
      //       name: 'ConvenienceStoreClassification',
      //       component: resolve =>
      //         require([
      //           '@/views/goods/goodsLibrary/convenienceStoreClassification'
      //         ], resolve),
      //       meta: { title: '商品分类', icon: 'dict', noCache: true }
      //     },
      //     {
      //       path: 'storeGoodsDetail',
      //       name: 'StoreGoodsDetail',
      //       hidden: true,
      //       component: resolve =>
      //         require([
      //           '@/views/goods/goodsLibrary/components/storeGoodsDetail'
      //         ], resolve),
      //       meta: { title: '商品分类', icon: 'dict', noCache: true }
      //     }
      //   ]
      // },

    ]
  },
  // * 商户管理
  {
    path: '/stores',
    component: Layout,
    redirect: '/stores/account',
    name: 'Stores',
    alwaysShow: true,
    meta: { title: '商户管理', icon: 'shop' },
    children: [

      // {
      //   path: 'iboxAccount',
      //   name: 'StoresIboxAccount',
      //   component: resolve => require(['@/views/stores/iboxAccount'], resolve),
      //   meta: { title: '环迅商户', icon: 'swagger', noCache: true }
      // },
      {
        path: 'account',
        name: 'StoresAccount',
        component: resolve => require(['@/views/stores/account'], resolve),
        meta: { title: '商户列表', icon: 'swagger', noCache: true }
      },
      {
        path: 'category',
        name: 'StoresCategory',
        component: resolve => require(['@/views/stores/category'], resolve),
        meta: { title: '店铺分类', icon: 'dict', noCache: true }
      },
      {
        path: 'info',
        name: 'StoresInfo',
        component: resolve => require(['@/views/stores/info'], resolve),
        meta: { title: '店铺列表', icon: 'shop', noCache: false }
      },
      {
        path: 'storeDetail',
        name: 'StoreDetail',
        hidden: true,
        component: resolve =>
          require(['@/views/stores/info/storeDetail'], resolve),
        meta: { title: '店铺详情', icon: 'post', noCache: true }
      },
      {
        path: 'voice',
        name: 'StoresVoice',
        component: resolve => require(['@/views/stores/voice'], resolve),
        meta: { title: '收款音响', icon: 'shop', noCache: false }
      },

      {
        path: 'integral',
        name: 'StoresIntegral',
        component: resolve => require(['@/views/stores/integral'], resolve),
        meta: { title: '礼券赠送', icon: 'shop', noCache: true }
      },
      {
        path: 'giftComplimentaryConfiguration',
        name: 'GiftComplimentaryConfiguration',
        component: resolve =>
          require([
            '@/views/stores/giftComplimentaryConfiguration/index'
          ], resolve),
        meta: { title: '赠送配置', icon: 'skill', noCache: true }
      }
    ]
  },

  // * 营销管理
  {
    path: '/market',
    component: Layout,
    redirect: '/market/banner',
    name: 'Market',
    alwaysShow: true,
    meta: { title: '营销管理', icon: 'market' },
    children: [
      {
        path: 'actTable',
        name: 'MarketActTable',
        component: resolve =>
          require(['@/views/market/actTable/index'], resolve),
        meta: { title: '活动字典管理', icon: 'swagger', noCache: true }
      },
      {
        path: 'dictionary',
        name: 'MarketDictionary',
        component: resolve =>
          require(['@/views/market/dictionary/index'], resolve),
        meta: { title: '活动表管理', icon: 'swagger', noCache: true }
      },
      {
        path: 'module',
        name: 'MarketModule',
        component: resolve => require(['@/views/market/module'], resolve),
        meta: { title: '活动栏目管理', icon: 'market-module', noCache: true }
      },
      {
        path: 'pack',
        name: 'MarketPack',
        component: resolve => require(['@/views/market/pack'], resolve),
        meta: { title: '活动套餐管理', icon: 'market-pack', noCache: true }
      },
      {
        path: 'banner',
        name: 'MarketBanner',
        component: resolve => require(['@/views/market/banner'], resolve),
        meta: { title: '广告图管理', icon: 'market-banner', noCache: true }
      },
      {
        path: 'goods',
        name: 'MarketGoods',
        component: resolve => require(['@/views/market/goods'], resolve),
        meta: { title: '活动商品列表', icon: 'market-goods', noCache: true }
      },
      {
        path: 'businessCooperation',
        name: 'MarketBusinessCooperation',
        component: resolve =>
          require(['@/views/market/businessCooperation'], resolve),
        meta: { title: '商务合作列表', icon: 'market-pack', noCache: true }
      },
      // * 数字货架管理
      // {
      //   path: 'cloudStore',
      //   name: 'CloudStore',
      //   component: resolve => require(['@/views/market/cloudStore'], resolve),
      //   meta: { title: '数字货架', icon: 'cloud' },
      //   children: [
      //     {
      //       path: 'bindStoreList',
      //       name: 'BindStoreList',
      //       component: resolve =>
      //         require(['@/views/market/cloudStore/bindStoreList'], resolve),
      //       meta: { title: '店铺列表', icon: 'swagger', noCache: true }
      //     },
      //     {
      //       path: 'pushGoodsList',
      //       name: 'PushGoodsList',
      //       component: resolve =>
      //         require(['@/views/market/cloudStore/pushGoodsList'], resolve),
      //       meta: { title: '商品列表', icon: 'goods', noCache: true }
      //     }
      //     // {
      //     //   path: 'incomeConfig',
      //     //   name: 'IncomeConfig',
      //     //   component: (resolve) => require(['@/views/cloudStore/incomeConfig'], resolve),
      //     //   meta: { title: '分润配置', icon: 'income' }
      //     // },
      //   ]
      // },
      // * 礼券妈妈管理
      // {
      //   path: 'giftMother',
      //   name: 'GiftMother',
      //   component: resolve => require(['@/views/market/giftMother'], resolve),
      //   meta: { title: '礼券妈妈', icon: 'gift' },
      //   children: [
      //     {
      //       path: 'giftMotherStoreList',
      //       name: 'GiftMotherStoreList',
      //       component: resolve =>
      //         require([
      //           '@/views/market/giftMother/giftMotherStoreList'
      //         ], resolve),
      //       meta: { title: '店铺列表', icon: 'swagger', noCache: true }
      //     },
      //     {
      //       path: 'giftMotherGoodsList',
      //       name: 'GiftMotherGoodsList',
      //       component: resolve =>
      //         require([
      //           '@/views/market/giftMother/giftMotherGoodsList'
      //         ], resolve),
      //       meta: { title: '商品列表', icon: 'goods', noCache: true }
      //     }
      //   ]
      // }
    ]
  },
  // {
  //   path: '/theAgent',
  //   component: Layout,
  //   redirect: '/theAgent/agentList',
  //   name: 'theAgent',
  //   alwaysShow: true,
  //   meta: { title: '代理管理', icon: 'dict' },
  //   children: [
  //     {
  //       path: 'agentList',
  //       name: 'AgentList',
  //       component: resolve => require(['@/views/theAgent/agentList'], resolve),
  //       meta: { title: '代理列表', icon: 'dict', noCache: true }
  //     }
  //   ]
  // },
  // * 数字货架管理
  // {
  //   path: '/cloudStore',
  //   component: Layout,
  //   redirect: '/cloudStore/bindStoreList',
  //   name: 'CloudStore',
  //   alwaysShow: true,
  //   meta: { title: '数字货架', icon: 'cloud' },
  //   children: [
  //     {
  //       path: 'bindStoreList',
  //       name: 'BindStoreList',
  //       component: (resolve) => require(['@/views/cloudStore/bindStoreList'], resolve),
  //       meta: { title: '店铺列表', icon: 'swagger', noCache: true }
  //     },
  //     {
  //       path: 'pushGoodsList',
  //       name: 'PushGoodsList',
  //       component: (resolve) => require(['@/views/cloudStore/pushGoodsList'], resolve),
  //       meta: { title: '商品列表', icon: 'goods', noCache: true }
  //     },
  //     // {
  //     //   path: 'incomeConfig',
  //     //   name: 'IncomeConfig',
  //     //   component: (resolve) => require(['@/views/cloudStore/incomeConfig'], resolve),
  //     //   meta: { title: '分润配置', icon: 'income' }
  //     // },
  //   ]
  // },
  // // * 礼券妈妈管理
  // {
  //   path: '/giftMother',
  //   component: Layout,
  //   redirect: '/giftMother/giftMotherStoreList',
  //   name: 'GiftMother',
  //   alwaysShow: true,
  //   meta: { title: '礼券妈妈', icon: 'gift' },
  //   children: [
  //     {
  //       path: 'giftMotherStoreList',
  //       name: 'GiftMotherStoreList',
  //       component: (resolve) => require(['@/views/giftMother/giftMotherStoreList'], resolve),
  //       meta: { title: '店铺列表', icon: 'swagger', noCache: true }
  //     },
  //     {
  //       path: 'giftMotherGoodsList',
  //       name: 'GiftMotherGoodsList',
  //       component: (resolve) => require(['@/views/giftMother/giftMotherGoodsList'], resolve),
  //       meta: { title: '商品列表', icon: 'goods', noCache: true }
  //     },
  //   ]
  // },
  // * 分润管理
  // {
  //   path: '/profits',
  //   component: Layout,
  //   redirect: '/profits/profitsLog',
  //   name: 'Profits',
  //   alwaysShow: true,
  //   meta: { title: '分润管理', icon: 'goods' },
  //   children: [
  //     {
  //       path: 'profitsLog',
  //       name: 'ProfitsLog',
  //       component: (resolve) => require(['@/views/profits/profitsLog'], resolve),
  //       meta: { title: '分润日志', icon: 'dict' }
  //     },
  //     {
  //       path: 'profitsMission',
  //       name: 'ProfitsMission',
  //       component: (resolve) => require(['@/views/profits/profitsMission'], resolve),
  //       meta: { title: '分润任务', icon: 'swagger' }
  //     },
  //   ]
  // },

    {
    path: '/orders',
    component: Layout,
    redirect: '/orders/index',
    name: 'Orders',
    meta: { title: '订单管理', icon: 'example' },
    alwaysShow: true,
    children: [
      {
        path: 'index',
        name: 'OrdersIndex',
        component: (resolve) => require(['@/views/orders/index'], resolve),
        meta: { title: '订单列表', icon: 'list' }
      },
      {
        path: 'detail',
        name: 'OrdersDetail',
        hidden: true,
        component: (resolve) => require(['@/views/orders/detail'], resolve),
        meta: { title: '订单详情', noCache: true }
      },
    ]
  },
  // * 资金管理
  {
    path: '/money',
    component: Layout,
    redirect: '/money/moneyDraw',
    name: 'Money',
    alwaysShow: true,
    meta: { title: '资金管理', icon: 'money' },
    children: [
      {
        path: 'zfbSet',
        name: 'ZfbSet',
        component: resolve => require(['@/views/money/zfbSet'], resolve),
        meta: { title: '资金账号', icon: 'zfb', noCache: true }
      },
      {
        path: 'moneyDraw',
        name: 'MarketMoneyDraw',
        component: resolve => require(['@/views/money/moneyDraw'], resolve),
        meta: { title: '提现管理', icon: 'money', noCache: false }
      },
      {
        path: 'userMoneyList',
        name: 'UserMoneyList',
        hidden: true,
        component: resolve =>
          require(['@/views/money/components/userMoneyList'], resolve),
        meta: { title: '资金流水', noCache: true }
      },
      {
        path: 'poundage',
        name: 'Poundage',
        component: resolve => require(['@/views/money/poundage'], resolve),
        meta: { title: '提现配置', icon: 'skill', noCache: false }
      },
      // {
      //   path: 'settlement',
      //   name: 'Settlement',
      //   component: resolve => require(['@/views/money/settlement'], resolve),
      //   meta: { title: '福袋结算', icon: 'income' },
      //   children: [
      //     {
      //       path: 'bagSettlement',
      //       name: 'BagSettlement',
      //       component: resolve =>
      //         require(['@/views/money/settlement/bagSettlement'], resolve),
      //       meta: { title: '店东结算', icon: 'income', noCache: true }
      //     },
      //     {
      //       path: 'agentSettlement',
      //       name: 'AgentSettlement',
      //       // hidden: true,
      //       component: resolve =>
      //         require(['@/views/money/settlement/agentSettlement'], resolve),
      //       meta: { title: '代理结算', icon: 'income', noCache: true }
      //     }
      //   ]
      // },
      {
        path: 'incomeTask',
        name: 'IncomeTask',
        component: resolve => require(['@/views/money/incomeTask'], resolve),
        meta: { title: '分润任务', icon: 'skill', noCache: false }
      },
    ]
  },
  // * 统计报表
  {
    path: '/statistical',
    component: Layout,
    redirect: '/statistical/giftSerial',
    name: 'Statistical',
    alwaysShow: true,
    meta: { title: '统计报表', icon: 'chart' },
    children: [
      {
        path: 'userGiftList',
        name: 'UserGiftList',
        component: resolve =>
          require(['@/views/statistical/userGift'], resolve),
        meta: { title: '会员礼券', icon: 'user', noCache: true }
      },
      {
        path: 'storeGiftList',
        name: 'storeGiftList',
        component: resolve =>
          require(['@/views/statistical/storeGift'], resolve),
        meta: { title: '店铺礼券', icon: 'shop', noCache: true }
      },
      {
        path: 'giftSerial',
        name: 'GiftSerial',
        component: resolve =>
          require(['@/views/statistical/giftSerial'], resolve),
        meta: { title: '礼券流水', icon: 'income', noCache: true }
      },
      {
        path: 'assetStatistical',
        name: 'AssetStatistical',
        component: resolve =>
          require(['@/views/statistical/assetStatistical'], resolve),
        meta: { title: '礼券统计', icon: 'money', noCache: true }
      }
    ]
  },
  // * 商品库管理
  // {
  //   path: '/goodsLibrary',
  //   component: Layout,
  //   redirect: '/goodsLibrary/giftSerial',
  //   name: 'GoodsLibrary',
  //   alwaysShow: true,
  //   meta: { title: '商品库管理', icon: 'swagger' },
  //   children: [
  //     {
  //       path: 'convenienceStoreBasis',
  //       name: 'ConvenienceStoreBasis',
  //       component: (resolve) => require(['@/views/goodsLibrary/convenienceStoreBasis'], resolve),
  //       meta: { title: '商品基础库', icon: 'swagger', noCache: true }
  //     },
  //     {
  //       path: 'convenienceStoreClassification',
  //       name: 'ConvenienceStoreClassification',
  //       component: (resolve) => require(['@/views/goodsLibrary/convenienceStoreClassification'], resolve),
  //       meta: { title: '商品分类', icon: 'dict', noCache: true }
  //     },
  //     {
  //       path: 'storeGoodsDetail',
  //       name: 'StoreGoodsDetail',
  //       hidden: true,
  //       component: (resolve) => require(['@/views/goodsLibrary/components/storeGoodsDetail'], resolve),
  //       meta: { title: '商品分类', icon: 'dict', noCache: true }
  //     },
  //   ]
  // },
  // * 系统管理
  {
    path: '/system',
    component: Layout,
    redirect: '/system/reftable',
    name: 'System',
    alwaysShow: true,
    meta: { title: '系统管理', icon: 'example' },
    children: [
      // {
      //   path: 'reftable',
      //   name: 'SystemReftable',
      //   component: (resolve) => require(['@/views/system/reftable/index'], resolve),
      //   meta: { title: '活动表配置', icon: 'server' }
      // },
      {
        path: 'shopPackage',
        name: 'SystemShopPackage',
        component: resolve =>
          require(['@/views/system/shopPackage/index'], resolve),
        meta: { title: '收款码套餐', icon: 'server', noCache: true }
      },
      {
        path: 'APPupDate',
        name: 'SystemAPPupDate',
        component: resolve =>
          require(['@/views/system/APPupDate/index'], resolve),
        meta: { title: 'APP更新', icon: 'market-banner', noCache: true }
      }
      // {
      //   path: 'storeDiscounts',
      //   name: 'StoreDiscounts',
      //   component: (resolve) => require(['@/views/system/storeDiscounts'], resolve),
      //   meta: { title: '充值比例', icon: 'dict', noCache: true }
      // },
    ]
  }
]
