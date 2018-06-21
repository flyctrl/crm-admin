/*
* @Author: chengbs
* @Date:   2018-04-28 12:41:14
* @Last Modified by:   chengbs
* @Last Modified time: 2018-05-11 11:33:55
*/
const data =
  [{
    'key': 'mams_home',
    'value': '首页',
    'icon': 'home',
    'url': 'urls.HOME',
    'accessFlag': true
  }, {
    'key': 'mams_member_data_auth',
    'value': '会员信息数据权限',
    'icon': 'layout',
    'url': '',
    'children': [{
      'key': 'mams_data_cate',
      'value': '数据分类',
      'icon': 'profile',
      'url': 'urls.DATACATE',
      'functionList': [{
        'functionName': '新增',
        'functionCode': 'operation_access_data_classify_insert',
        'hasPower': true
      }, {
        'functionName': '修改',
        'functionCode': 'operation_access_data_classify_update',
        'hasPower': true
      }, {
        'functionName': '删除',
        'functionCode': 'operation_access_data_classify_delete_logic',
        'hasPower': true
      }, {
        'functionName': '移动',
        'functionCode': 'operation_access_data_classify_detail_insert',
        'hasPower': true
      }, {
        'functionName': '启用／停用',
        'functionCode': 'operation_access_data_classify_enable_or_disable',
        'hasPower': true
      }],
      'accessFlag': true
    }, {
      'key': 'mams_query_rule',
      'value': '查询规则定义',
      'icon': 'search',
      'url': 'urls.QUERYRULE',
      'functionList': [{
        'functionName': '新增',
        'functionCode': 'operation_access_query_rule_insert',
        'hasPower': true
      }, {
        'functionName': '修改',
        'functionCode': 'operation_access_query_rule_update',
        'hasPower': true
      }, {
        'functionName': '删除',
        'functionCode': 'operation_access_query_rule_delete_logic',
        'hasPower': true
      }, {
        'functionName': '启用／停用',
        'functionCode': 'operation_access_query_rule_enable_or_disable',
        'hasPower': true
      }, {
        'functionName': '新增',
        'functionCode': 'operation_access_query_rule_detail_insert',
        'hasPower': true
      }],
      'accessFlag': true
    }, {
      'key': 'mams_update_rule',
      'value': '更新规则定义',
      'icon': 'cloud-upload-o',
      'url': 'urls.UPDATERULE',
      'functionList': [{
        'functionName': '新增',
        'functionCode': 'operation_mams_update_rule_insert',
        'hasPower': true
      }, {
        'functionName': '修改',
        'functionCode': 'operation_mams_update_rule_update',
        'hasPower': true
      }, {
        'functionName': '删除',
        'functionCode': 'operation_mams_update_rule_delete_logic',
        'hasPower': true
      }, {
        'functionName': '定义',
        'functionCode': 'operation_mams_update_rule_defi',
        'hasPower': true
      }],
      'accessFlag': true
    }, {
      'key': 'mams_channel_identification',
      'value': '渠道标识管理',
      'icon': 'pushpin-o',
      'url': 'urls.CHANNELIDENTIFICATION',
      'functionList': [],
      'accessFlag': true
    }],
    'accessFlag': true
  }, {
    'key': 'mams_crm_member',
    'value': 'CRM会员管理',
    'icon': 'team',
    'url': '',
    'children': [{
      'key': 'mams_member_access',
      'value': '用户会员接入',
      'icon': 'user-add',
      'url': '',
      'children': [{
        'key': 'mams_plat_file',
        'value': '平台档案',
        'icon': 'book',
        'url': 'urls.PLATFILE',
        'functionList': [{
          'functionName': '新增',
          'functionCode': 'operation_manage_membership_insert',
          'hasPower': true
        }, {
          'functionName': '修改',
          'functionCode': 'operation_manage_membership_update',
          'hasPower': true
        }, {
          'functionCode': 'operation_manage_membership_delete_logic',
          'functionName': '删除',
          'hasPower': true
        }, {
          'functionName': '启用／停用',
          'functionCode': 'operation_manage_membership_enable_or_disable',
          'hasPower': true
        }, {
          'functionName': '导入',
          'functionCode': 'operation_manage_membership_importinfo',
          'hasPower': true
        }, {
          'functionName': '导出',
          'functionCode': 'operation_manage_membership_exportinfo',
          'hasPower': true
        }],
        'accessFlag': true
      }, {
        'key': 'mams_membership_file',
        'value': '会籍档案',
        'icon': 'database',
        'url': 'urls.MEMBERSHIP',
        'functionList': [{
          'functionName': '新增',
          'functionCode': 'operation_manage_membership_insert',
          'hasPower': true
        }, {
          'functionName': '修改',
          'functionCode': 'operation_manage_membership_update',
          'hasPower': true
        }, {
          'functionCode': 'operation_manage_membership_delete_logic',
          'functionName': '删除',
          'hasPower': true
        }, {
          'functionName': '启用／停用',
          'functionCode': 'operation_manage_membership_enable_or_disable',
          'hasPower': true
        }, {
          'functionName': '导入',
          'functionCode': 'operation_manage_membership_importinfo',
          'hasPower': true
        }, {
          'functionName': '导出',
          'functionCode': 'operation_manage_membership_exportinfo',
          'hasPower': true
        }],
        'accessFlag': true
      }, {
        'key': 'mams_member_file',
        'value': '会员档案',
        'icon': 'user',
        'url': 'urls.MEMBERFILE',
        'functionList': [{
          'functionName': '启用／停用',
          'functionCode': 'operation_manage_userinfo_enbale_or_disable',
          'hasPower': true
        }, {
          'functionName': '新增',
          'functionCode': 'operation_manage_userinfo_insert',
          'hasPower': true
        }, {
          'functionName': '修改',
          'functionCode': 'operation_manage_userinfo_update',
          'hasPower': true
        }, {
          'functionName': '删除',
          'functionCode': 'operation_manage_userinfo_delete_logic',
          'hasPower': true
        }, {
          'functionName': '导入',
          'functionCode': 'operation_manage_userinfo_importinfo',
          'hasPower': true
        }, {
          'functionName': '导出',
          'functionCode': 'operation_manage_userinfo_exportinfo',
          'hasPower': true
        }],
        'accessFlag': true
      }],
      'accessFlag': true
    }, {
      'key': 'mams_level_admin',
      'value': '等级管理',
      'icon': 'flag',
      'url': '',
      'children': [{
        'key': 'mams_member_level',
        'value': '用户等级定义',
        'icon': 'usergroup-add',
        'url': 'urls.MEMBERLEVEL',
        'functionList': [{
          'functionName': '新增',
          'functionCode': 'operation_manage_level_defi_insert',
          'hasPower': true
        }, {
          'functionName': '修改',
          'functionCode': 'operation_manage_level_defi_update',
          'hasPower': true
        }, {
          'functionName': '删除',
          'functionCode': 'operation_manage_level_defi_delete_logic',
          'hasPower': true
        }, {
          'functionName': '启用／停用',
          'functionCode': 'operation_manage_level_defi_enbale_or_disable',
          'hasPower': true
        }],
        'accessFlag': true
      }],
      'accessFlag': true
    }],
    'accessFlag': true
  }, {
    'key': 'mams_rule_admin',
    'value': '规则管理',
    'icon': 'tags-o',
    'url': '',
    'children': [{
      'key': 'mams_money_rule',
      'value': '金额晋级规则',
      'icon': 'shopping-cart',
      'url': 'urls.MONEYRULE',
      'functionList': [{
        'functionName': '启用／停用',
        'functionCode': 'operation_rule_money_rise_enable_or_disable',
        'hasPower': true
      }, {
        'functionName': '修改',
        'functionCode': 'operation_rule_money_rise_update',
        'hasPower': true
      }, {
        'functionName': '删除',
        'functionCode': 'operation_rule_money_rise_delete_logic',
        'hasPower': true
      }, {
        'functionName': '新增',
        'functionCode': 'operation_rule_money_rise_insert',
        'hasPower': true
      }],
      'accessFlag': true
    }, {
      'key': 'mams_level_compute_rule',
      'value': '跨会籍折算规则',
      'icon': 'switcher',
      'url': 'urls.LEVELRULE',
      'functionList': [{
        'functionName': '新增',
        'functionCode': 'operation_rule_cross_rate_insert',
        'hasPower': true
      }, {
        'functionName': '修改',
        'functionCode': 'operation_rule_cross_rate_update',
        'hasPower': true
      }, {
        'functionName': '删除',
        'functionCode': 'operation_rule_cross_rate_delete_logic',
        'hasPower': true
      }, {
        'functionName': '启用／停用',
        'functionCode': 'operation_rule_cross_rate_enable_or_disable',
        'hasPower': true
      }],
      'accessFlag': true
    }, {
      'key': 'mams_industry_convert',
      'value': '跨平台折算规则',
      'icon': 'switcher',
      'url': 'urls.INDUSTRYCONVERT',
      'functionList': [],
      'accessFlag': true
    }, {
      'key': 'mams_basic_integral',
      'value': '基本积分规则',
      'icon': 'bank',
      'url': 'urls.BASICINTEGRAL',
      'functionList': [],
      'accessFlag': true
    }],
    'accessFlag': true
  }, {
    'key': 'mams_member_legal',
    'value': '会员权益管理',
    'icon': 'api',
    'url': '',
    'children': [{
      'key': 'mams_added_service',
      'value': '增值服务权益设置',
      'icon': 'tool',
      'url': 'urls.ADDEDSERVICE',
      'functionList': [{
        'functionName': '启用／停用',
        'functionCode': 'operation_rule_money_rise_enable_or_disable',
        'hasPower': true
      }, {
        'functionName': '修改',
        'functionCode': 'operation_rule_money_rise_update',
        'hasPower': true
      }, {
        'functionName': '删除',
        'functionCode': 'operation_rule_money_rise_delete_logic',
        'hasPower': true
      }, {
        'functionName': '新增',
        'functionCode': 'operation_rule_money_rise_insert',
        'hasPower': true
      }],
      'accessFlag': true
    }, {
      'key': 'mams_member_legal_config',
      'value': '会员权益配置',
      'icon': 'form',
      'url': 'urls.LEGALCONFIG',
      'functionList': [{
        'functionName': '新增',
        'functionCode': 'operation_rule_cross_rate_insert',
        'hasPower': true
      }, {
        'functionName': '修改',
        'functionCode': 'operation_rule_cross_rate_update',
        'hasPower': true
      }, {
        'functionName': '删除',
        'functionCode': 'operation_rule_cross_rate_delete_logic',
        'hasPower': true
      }, {
        'functionName': '启用／停用',
        'functionCode': 'operation_rule_cross_rate_enable_or_disable',
        'hasPower': true
      }],
      'accessFlag': true
    }],
    'accessFlag': true
  }]

export default data
