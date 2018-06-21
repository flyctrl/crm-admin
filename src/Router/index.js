import React from 'react'
import {
  BrowserRouter as Router,
  Switch
} from 'react-router-dom'
import * as urls from '../contants/url'
import XLayout from '../models/layout'
import Home from '../models/Home'

import DataCate from '../models/Data/dataCate'
import QueryRule from '../models/Data/queryRule'
import UpdateRule from '../models/Data/updateRule'
import ChannelIdentification from '../models/Data/channelIdentification' // 渠道标识管理

import PlatFile from '../models/Member/platfile'
import Membership from '../models/Member/membership'
import MemberFile from '../models/Member/file'
import FileDetail from '../models/Member/fileDetail'
import MemberLevel from '../models/Member/level'

// 规则管理
import MoneyRule from '../models/Rule/money' // 金额晋级规则
import LevelRule from '../models/Rule/level' // 跨会籍折算规则
import IndustryConvert from '../models/Rule/industryConvert' // 跨产业折算规则
import BasicIntegral from '../models/Rule/basicIntegral' // 基本积分规则
import BasicIntegralUpdate from '../models/Rule/basicIntegral/update' // 基本积分规则新增和修改

import TradeRecord from '../models/Record/trade'
import LevelRecord from '../models/Record/levelChange'
import FileUpdateRecord from '../models/Record/fileUpdate'

import AddedService from '../models/MemberLegal/addedService'
import LegalConfig from '../models/MemberLegal/legalConfig'

const routes = [
  {
    path: '/',
    redirect: urls.HOME,
    component: Home,
    exact: true,
    breadcrumbName: '首页'
  },
  {
    path: urls.HOME,
    exact: true,
    component: Home,
    breadcrumbName: '首页'
  },
  {
    path: urls.DATACATE,
    exact: true,
    component: DataCate,
    breadcrumbName: '数据分类',
    parentPath: urls.HOME
  },
  {
    path: urls.QUERYRULE,
    exact: true,
    component: QueryRule,
    breadcrumbName: '查询规则定义',
    parentPath: urls.HOME
  },
  {
    path: urls.UPDATERULE,
    exact: true,
    component: UpdateRule,
    breadcrumbName: '更新规则定义',
    parentPath: urls.HOME
  },
  {
    path: urls.PLATFILE,
    exact: true,
    component: PlatFile,
    breadcrumbName: '平台档案',
    parentPath: urls.HOME
  },
  {
    path: urls.CHANNELIDENTIFICATION,
    exact: true,
    component: ChannelIdentification,
    breadcrumbName: '渠道标识管理',
    parentPath: urls.HOME
  },
  {
    path: urls.MEMBERSHIP,
    exact: true,
    component: Membership,
    breadcrumbName: '会籍档案',
    parentPath: urls.HOME
  },
  {
    path: urls.MEMBERFILE,
    exact: true,
    component: MemberFile,
    breadcrumbName: '会员档案',
    parentPath: urls.HOME
  },
  {
    path: urls.FILEDETAIL,
    exact: true,
    component: FileDetail,
    breadcrumbName: '会员档案新增',
    parentPath: urls.MEMBERFILE
  },
  {
    path: `${urls.FILEDETAIL}/:id`,
    exact: true,
    component: FileDetail,
    breadcrumbName: '会员档案修改',
    parentPath: urls.MEMBERFILE
  },
  {
    path: urls.MEMBERLEVEL,
    exact: true,
    component: MemberLevel,
    breadcrumbName: '用户等级定义',
    parentPath: urls.HOME
  },
  {
    path: urls.MONEYRULE,
    exact: true,
    component: MoneyRule,
    breadcrumbName: '金额晋级规则',
    parentPath: urls.HOME
  },
  {
    path: urls.LEVELRULE,
    exact: true,
    component: LevelRule,
    breadcrumbName: '跨会籍折算规则',
    parentPath: urls.HOME
  },
  {
    path: urls.INDUSTRYCONVERT,
    exact: true,
    component: IndustryConvert,
    breadcrumbName: '跨平台折算规则',
    parentPath: urls.HOME
  },
  {
    path: urls.BASICINTEGRAL,
    exact: true,
    component: BasicIntegral,
    breadcrumbName: '基本积分规则',
    parentPath: urls.HOME
  },
  {
    path: urls.BASICINTEGRALUPDATE,
    exact: true,
    component: BasicIntegralUpdate,
    breadcrumbName: '新增',
    parentPath: urls.BASICINTEGRAL
  },
  {
    path: urls.TRADERECORD,
    exact: true,
    component: TradeRecord,
    breadcrumbName: '交易记录管理',
    parentPath: urls.HOME
  },
  {
    path: urls.LEVELRECORD,
    exact: true,
    component: LevelRecord,
    breadcrumbName: '等级变动记录',
    parentPath: urls.HOME
  },
  {
    path: urls.FILERECORD,
    exact: true,
    component: FileUpdateRecord,
    breadcrumbName: '会员档案更新记录',
    parentPath: urls.HOME
  },
  {
    path: urls.ADDEDSERVICE,
    exact: true,
    component: AddedService,
    breadcrumbName: '增值服务权益设置',
    parentPath: urls.HOME
  },
  {
    path: urls.LEGALCONFIG,
    exact: true,
    component: LegalConfig,
    breadcrumbName: '会员权益配置',
    parentPath: urls.HOME
  },
]

const RouteConfig = () => (
  <Router>
    <Switch>
      <XLayout routes={routes}>
      </XLayout>
    </Switch>
  </Router>
)

export default RouteConfig
