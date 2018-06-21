/**
 * @Author: sunshiqiang
 * @Date: 2017-10-31 10:34:47
 * @Title: 接口调用
 */

import fetch from 'Util/fetch'
import { message } from 'antd'
import { showSpin } from 'Models/layout'

// 获取数据类接口
export const Fetch = (url, params, method = 'post') => {
  showSpin(true)
  if (typeof params !== 'object') {
    url += ('/' + params)
  } else if (method === 'get') {
    params = { params }
  }
  return fetch[method](url, params).then((res) => {
    console.log()
    if (res.code === 0) {
      showSpin()
      return res.data
    } else {
      showSpin()
      message.error(res.errmsg, 2)
    }
  }, (err) => {
    showSpin()
    message.error(err.errmsg, 2)
  })
}

// 保存类接口
export const FetchSave = (url, params, method) => {
  showSpin(true)
  if (typeof params !== 'object') {
    url += ('/' + params)
  } else if (method === 'get') {
    params = { params }
  }
  return fetch[method](url, params).then((res) => {
    if (res.code === 0) {
      showSpin()
      message.success(res.errmsg, 2)
      return res.data
    } else {
      showSpin()
      message.error(res.errmsg, 2)
    }
  }, (err) => {
    showSpin()
    message.error(err.errmsg, 2)
  })
}

export default {
  getMenu() { // 获取菜单数据
    return Fetch('/Sso/findMenuList', {}, 'get')
  },
  dictData: { // 数据字典
    countrys() { // 国家
      return Fetch('/CRM/DictData/Dict_Type_C_MANAGE_USER_INFO_COUNTRY', {}, 'get')
    },
    provinces(param) { // 省／州
      return Fetch('/CRM/DictData/Dict_Type_C_MANAGE_USER_INFO_PROVINCE/Dict_Type_C_MANAGE_USER_INFO_COUNTRY', param, 'get')
    },
    citys(param) { // 城市
      return Fetch('/CRM/DictData/Dict_Type_C_MANAGE_USER_INFO_CITY/Dict_Type_C_MANAGE_USER_INFO_PROVINCE', param, 'get')
    },
    countys(param) { // 区／县
      return Fetch('/CRM/DictData/Dict_Type_C_MANAGE_USER_INFO_AREA/Dict_Type_C_MANAGE_USER_INFO_CITY', param, 'get')
    },
    columns() { // 纵列表头
      return Fetch('/Update/Priority/Columns', {}, 'post')
    },
    memberships() { // 会籍
      return Fetch('/CRM/DictDataItems/Memberships', {}, 'get')
    },
    plateforms() { // 平台
      return Fetch('/CRM/DictDataItems/PlateformList/V1.0.2', {}, 'get')
    }
  },
  data: { // 会员信息数据权限
    updateRule: { // 更新规则定义
      columnsAll() { // 纵列表头字典所有
        return Fetch('/Update/Priority/Column/All', {}, 'get')
      },
      columnsUpdate() { // 配置纵列表头字典更新
        return Fetch('/Update/Priority/Columns', {}, 'get')
      },
      columnsSave(params) { // 配置纵列表头字典更新
        return FetchSave('/Update/Priority/Column/All', params, 'post')
      },
    },
    channelIdentification: { // 渠道标识管理
      list(params) { // 列表
        return Fetch('/Cend/AccessChannel/V1.0.2', params, 'get')
      },
      add(params) { // 新增
        return FetchSave('/Cend/AccessChannel/V1.0.2', params, 'post')
      },
      update(params) { // 修改
        return FetchSave('/Cend/AccessChannel/V1.0.2', params, 'put')
      },
      del(params) { // 删除
        return FetchSave('/Cend/AccessChannel/V1.0.2', params, 'delete')
      },
    },
    rule: { // 规则管理
      industryConvert: { // 跨平台折算规则
        list(params) { // 列表
          return Fetch('/Cend/Manage/CrossPlateform/V1.0.2', params, 'get')
        },
        add(params) { // 新增
          return FetchSave('/Cend/Manage/CrossPlateform/V1.0.2', params, 'post')
        },
        update(params) { // 修改
          return FetchSave('/Cend/Manage/CrossPlateform/V1.0.2', params, 'put')
        },
        del(params) { // 删除
          return FetchSave('/Cend/Manage/CrossPlateform/V1.0.2', params, 'delete')
        },
      },
      level: { // 跨会籍折算规则
        list(params) { // 列表
          return Fetch('/Cend/Rule/CrossMembershipRate/V1.0.2', params, 'get')
        },
        linkMemberShips(params) { // 列表
          return Fetch('/CRM/DictDataItems/membershipListByPlateform/V1.0.2', params, 'get')
        },
        add(params) { // 新增
          return FetchSave('/Cend/Rule/CrossMembershipRate/V1.0.2', params, 'post')
        },
        update(params) { // 修改
          return FetchSave('/Cend/Rule/CrossMembershipRate/V1.0.2', params, 'put')
        },
        del(params) { // 删除
          return FetchSave('/Cend/Rule/CrossMembershipRate/V1.0.2', params, 'delete')
        },
      },
      basicIntegral: { // 基本积分规则
        list(params) { // 列表
          return Fetch('/Cend/Rule/BaseIntergration/V1.0.2', params, 'get')
        },
        add(params) { // 新增
          return FetchSave('/Cend/Rule/BaseIntergration/V1.0.2', params, 'post')
        },
        update(params) { // 修改
          return FetchSave('/Cend/Rule/BaseIntergration/V1.0.2', params, 'put')
        },
        del(params) { // 修改
          return FetchSave('/Cend/Rule/BaseIntergration/V1.0.2', params, 'delete')
        },
      },
    },
    platfile: { // 平台档案
      platList(params) { // 平台档案列表
        return Fetch('/Cend/Manage/PlateForm/V1.0.2', params, 'get')
      },
      platAdd(params) { // 平台档案新增
        return FetchSave('/Cend/Manage/PlateForm/V1.0.2', params, 'post')
      },
      platEdit(params) { // 平台档案编辑
        return FetchSave('/Cend/Manage/PlateForm/V1.0.2', params, 'put')
      },
      platDel(params) { // 平台档案删除
        return FetchSave('/Cend/Manage/PlateForm/V1.0.2', params, 'delete')
      },
      platEnable(params) { // 平台停启用
        return FetchSave('/Cend/Manage/PlateForm/UpdateEnable/V1.0.2', params, 'put')
      },
      memeberById(params) { // 根据平台id获取会籍
        return Fetch('/Cend/Manage/PlateForm/V1.0.2', params, 'get')
      },
      memeberShipTree(params = {}) { // 获取左边会籍树
        return Fetch('/Cend/Manage/PlateformMembershipTree/V1.0.2', params, 'get')
      },
      memberShipList(params = {}) { // 获取右边会籍列表
        return Fetch('/Cend/Manage/MembershipList/V1.0.2', params, 'get')
      },
      productTree(params = {}) { // 获取左侧产业树
        return Fetch('/Cend/Manage/Membership/ProductTree/V1.0.2', params, 'get')
      },
      productList(params = {}) {
        return Fetch('/Cend/Manage/Membership/ProductList/V1.0.2', params, 'get')
      }
    },
    memberfile: { // 会员档案 /Cend/Manage/MembershipInfo/V1.0.2/{userId}
      associaction(params) { // 会员所属会籍
        return Fetch('/Cend/Manage/MembershipInfo/V1.0.2', params, 'get')
      },
      exportMembership(params) { // 会籍导出
        return Fetch('/membership/exportMembership', params, 'get')
      },
      exportMembersList(params) { // 会员导出
        return Fetch('/userInfo/exportList', params, 'get')
      },
      exportMembersJudge(params = {}) { // 会员导出检测
        return Fetch('/userInfo/exportList/judge', params, 'get')
      },
      exportMembershipJudge(params = {}) { // 会籍导出检测
        return Fetch('/membership/exportMembership/judge', params, 'get')
      }
    }
  }
}
