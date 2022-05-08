/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-10-25 13:38:41
 * @Description  : 模拟后台返回的异步路由
 */
import Layout from '@/layout/index'
// 公共路由
export const asyncRoutes = [
  // * 商品管理
  {
    path: '/goods',
    component: Layout,
    redirect: '/goods/list',
    name: 'Goods',
    alwaysShow: true,
    meta: { title: '矿机管理', icon: 'goods' },
    children: [
      {
        path: 'list',
        name: 'GoodsList',
        component: (resolve) => require(['@/views/goods/index/index'], resolve),
        meta: { title: '矿机列表', icon: 'list', noCache: true }
      },
      {
        path: 'detail',
        name: 'GoodsDetail',
        hidden: true,
        component: (resolve) => require(['@/views/goods/index/detail'], resolve),
        meta: { title: '矿机详情', icon: 'list', noCache: true }
      }
    ]
  },
  // * 财务管理
  {
    path: '/finance',
    component: Layout,
    redirect: '/finance/recharge',
    name: 'Finance',
    alwaysShow: true,
    meta: { title: '财务管理', icon: 'money' },
    children: [
      {
        path: 'recharge',
        name: 'FinanceRecharge',
        component: (resolve) => require(['@/views/finance/recharge'], resolve),
        meta: { title: '充值订单', icon: 'list', noCache: true }
      },
      {
        path: 'withdraw',
        name: 'FinanceWithdraw',
        component: (resolve) => require(['@/views/finance/withdraw'], resolve),
        meta: { title: '用户提现订单', icon: 'list', noCache: true }
      },
      {
        path: 'agentWithdraw',
        name: 'agentWithdraw',
        component: (resolve) => require(['@/views/finance/agentWithdraw'], resolve),
        meta: { title: '代理提现订单', icon: 'list', noCache: true }
      },
      {
        path: 'digbit',
        name: 'FinanceDig',
        component: (resolve) => require(['@/views/finance/digbit'], resolve),
        meta: { title: '挖矿结算', icon: 'list', noCache: true }
      },
      {
        path: 'compCard',
        name: 'FinanceCompCard',
        component: (resolve) => require(['@/views/finance/compCard'], resolve),
        meta: { title: '对公账号', icon: 'list', noCache: true }
      },
      {
        path: 'drawFei',
        name: 'FinanceDrawFei',
        component: (resolve) => require(['@/views/finance/drawFei'], resolve),
        meta: { title: '提现手续费', icon: 'list', noCache: true }
      },
      {
        path: 'drawSet',
        name: 'FinanceDrawSet',
        component: (resolve) => require(['@/views/finance/drawSet'], resolve),
        meta: { title: '币价设置', icon: 'list', noCache: true }
      },
    ]
  },
  // * 报表统计
  {
    path: '/report',
    component: Layout,
    redirect: '/report/money',
    name: 'Report',
    alwaysShow: true,
    meta: { title: '报表统计', icon: 'report' },
    children: [
      {
        path: 'money',
        name: 'ReportMoney',
        component: (resolve) => require(['@/views/report/money'], resolve),
        meta: { title: '财务统计', icon: 'list', noCache: true }
      },
      {
        path: 'moneyList',
        name: 'ReportMoneyList',
        component: (resolve) => require(['@/views/report/money/moneyList'], resolve),
        meta: { title: '流水统计', icon: 'list', noCache: true }
      },
    ]
  },
  // * 系统管理
  {
    path: '/system',
    component: Layout,
    redirect: '/system/bitType',
    name: 'System',
    alwaysShow: true,
    meta: { title: '系统管理', icon: 'example' },
    children: [
      {
        path: 'bitType',
        name: 'SystemBitType',
        component: (resolve) => require(['@/views/system/bitType'], resolve),
        meta: { title: '挖矿配置', icon: 'list' }
      },
      {
        path: 'bitUsdt',
        name: 'SystemPower',
        component: (resolve) => require(['@/views/system/bitUsdt'], resolve),
        meta: { title: '算力配置', icon: 'list' }
      },
      {
        path: 'roleList',
        name: 'SystemRoleList',
        component: (resolve) => require(['@/views/system/roleList'], resolve),
        meta: { title: '代理角色配置', icon: 'list' }
      },
      {
        path: 'roleRewardList',
        name: 'SystemRoleRewardList',
        component: (resolve) => require(['@/views/system/roleRewardList'], resolve),
        meta: { title: '代理奖励配置', icon: 'list' }
      },
      {
        path: 'roleTeamRewardList',
        name: 'SystemRoleTeamRewardList',
        component: (resolve) => require(['@/views/system/roleTeamRewardList'], resolve),
        meta: { title: '团长奖励配置', icon: 'list' }
      },
    ]
  }
]