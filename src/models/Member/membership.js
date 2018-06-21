import React, { Component } from 'react'
import { Table, Button, Input, Form, Select, Tabs, Modal, message, Upload, Tooltip, Row, Col, Tree, Radio } from 'antd'
const TabPane = Tabs.TabPane
const Option = Select.Option
import moment from 'moment'
import Search from 'Components/FormRow/index'
import AddForm from 'Components/AddForm/index'
import style from './index.css'
import fetch from 'Util/fetch'
import md5 from 'md5'
import { baseUrl } from 'Util'
import api from 'Src/contants/api'
import { transGetUrl } from 'Util/tools'
import tooler from 'Contants/tooler'
import { showSpin } from 'Models/layout'

const TreeNode = Tree.TreeNode
const RadioGroup = Radio.Group
class membership extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      modalTitle: '新增会籍档案',
      addVisible: false,
      selectedRowKeys: [], // 被选中列表的id
      selectDetails: {}, // 被选中列表的详细内容
      shipId: '', // 会籍id
      bottomIndex: '1', // 下面数据下标
      barAddVisible: false,
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
      },
      dataSource: [], // 页面列表数据
      gradeSource: [], // 等级数据
      queryData: {}, // 查询数据
      addForm: [
        {
          type: '所属公司',
          name: 'companyName',
          rules: [{ required: true, message: '请填写所属公司' }],
          item: (<Input placeholder='所属公司' />),
        },
        {
          type: '会籍编号',
          name: 'membershipNoadd',
          rules: [{ required: true, message: '请输入数字和字母', pattern: /^(\w|\d)*$/ }],
          item: (<Input placeholder='会籍编号' maxLength={10} />)
        },
        {
          type: '会籍名称',
          name: 'membershipNameadd',
          rules: [{ required: true, message: '请填写会籍名称' }],
          item: (<Input placeholder='会籍名称' />)
        },
      ],
      columnsThree: [{
        title: '所属会籍',
        dataIndex: 'membershipName'
      }, {
        title: '规则编号',
        dataIndex: 'seriesNo'
      }, {
        title: '规则名称',
        dataIndex: 'name'
      }, {
        title: '初始等级',
        dataIndex: 'beforeLevelName'
      }, {
        title: '晋级等级',
        dataIndex: 'afterLevelName'
      }, {
        title: '累计贡献指标',
        dataIndex: 'contribution'
      }, {
        title: '适用范围',
        dataIndex: 'rangeName'
      }, {
        title: '状态',
        dataIndex: 'isEnable',
        render: (text, record) => {
          return (text || text === 0) ? text === 1 ? '启用' : '停用' : ''
        }
      }],
      columnsTwo: [{
        title: '等级优先',
        dataIndex: 'priority'
      }, {
        title: '会籍',
        dataIndex: 'membershipName'
      }, {
        title: '等级名称',
        dataIndex: 'name'
      }, {
        title: '创建时间',
        dataIndex: 'gmtCreated',
        render: (text, record) => {
          return text && moment(Number(text)).format('YYYY/MM/DD')
        }
      }, {
        title: '启用状态',
        dataIndex: 'isEnable',
        render: (text, record) => {
          return (text || text === 0) ? text === 1 ? '启用' : '停用' : ''
        }
      }, {
        title: '创建人',
        dataIndex: 'creator'
      }, {
        title: '最后修改人',
        dataIndex: 'updator'
      }, {
        title: '最后修改时间',
        dataIndex: 'gmtModified',
        render: (text, record) => {
          return text && moment(Number(text)).format('YYYY/MM/DD')
        }
      }],
      columns: [{
        title: '所属公司',
        dataIndex: 'companyName',
        render: (text, record) => {
          let conent = text && text.length && text.length > 10 ? (<Tooltip placement='topLeft' title={text}>{text.substring(0, 10) + '...'}</Tooltip>) : text
          return conent
        },
        width: 140,
      }, {
        title: '会籍编号',
        dataIndex: 'membershipNo',
        render: (text, record) => {
          let conent = text && text.length && text.length > 10 ? (<Tooltip placement='topLeft' title={text}>{text.substring(0, 10) + '...'}</Tooltip>) : text
          return conent
        },
        width: 140,
      }, {
        title: '会籍名称',
        dataIndex: 'membershipName',
        render: (text, record) => {
          let conent = text && text.length && text.length > 10 ? (<Tooltip placement='topLeft' title={text}>{text.substring(0, 10) + '...'}</Tooltip>) : text
          return conent
        },
        width: 140,
      }, {
        title: '启用状态',
        dataIndex: 'statusStr',
      }, {
        title: '创建人',
        dataIndex: 'createPerson'
      }, {
        title: '最后修改人',
        dataIndex: 'modifyPerson'
      }, {
        title: '最后修改时间',
        dataIndex: 'modifyTime',
        render: (text, record) => {
          return text && moment(Number(text)).format('YYYY/MM/DD')
        }
      }],
      transVisible: false, // transfer start
      expandedKeys: [],
      sourceCheckedKeys: [],
      treeData: [],
      sourceSelectedKeys: [],
      targetCheckedKeys: [],
      autoExpandParent: true,
      targets: [],
      relaDataSource: [], // transfer end
      jsonPower: {},
    }
    this.search = [
      [
        {
          type: '会籍编号',
          name: 'membershipNo',
          item: (<Input maxLength='30' placeholder='请填写会籍编号' />)
        },
        {
          type: '会籍名称',
          name: 'membershipName',
          item: (<Input maxLength='30' placeholder='请填写会籍名称' />)
        },
        {
          type: '启用状态',
          name: 'status',
          item: (<Select style={{ width: '100%' }} placeholder='请选择启用状态' getPopupContainer={trigger => trigger.parentNode}>
            <Option value='2' key='all'>全部</Option>
            <Option value='1' key='on'>启用</Option>
            <Option value='0' key='off'>停用</Option>
          </Select>)
        }
      ],
    ]
    this.handleAddItem = this.handleAddItem.bind(this)
    this.hideAddModal = this.hideAddModal.bind(this)
    this.onSubmitInfo = this.onSubmitInfo.bind(this)
    this.tableChange = this.tableChange.bind(this)
    this.handleModifyItem = this.handleModifyItem.bind(this)
    this.onSelectChange = this.onSelectChange.bind(this)
    this.handleEnableItem = this.handleEnableItem.bind(this)
    this.addOk = this.addOk.bind(this)
    this.changeAddTab = this.changeAddTab.bind(this)
    this.upLoadChange = this.upLoadChange.bind(this)
    this.beforeUpload = this.beforeUpload.bind(this)
    this.handleDelItem = this.handleDelItem.bind(this)
    this.handleChuItem = this.handleChuItem.bind(this)

    /* transfer start */
    this.fetchColumns = this.fetchColumns.bind(this)
    this.fetchTreeCategories = this.fetchTreeCategories.bind(this)
    this.addEstateItem = this.addEstateItem.bind(this)
    this.handleTransCancel = this.handleTransCancel.bind(this)
    this.onExpand = this.onExpand.bind(this)
    this.onSourceCheck = this.onSourceCheck.bind(this)
    this.onSourceSelect = this.onSourceSelect.bind(this)
    this.onTargetChange = this.onTargetChange.bind(this)
    this.handleRight = this.handleRight.bind(this)
    this.handleLeft = this.handleLeft.bind(this)
    this.hideTransModal = this.hideTransModal.bind(this)
    /* transfer end */
  }

  componentDidMount() {
    this.getShipListData()
    this.fetchColumns()
    this.fetchTreeCategories()
    // 权限控制start
    let jsonPower = tooler.authoControl()
    this.setState({ jsonPower })
    // 权限控制end
  }
  // 获取页面列表数据
  getShipListData() {
    const { pagination, queryData } = this.state
    const data = {
      'page': pagination.current,
      'pageSize': pagination.pageSize,
      ...queryData
    }
    fetch.post('/membership/queryMembershipList', data).then(res => {
      this.setState({ loading: false })
      if (res.code === 0) {
        pagination['total'] = res.data.records
        pagination['current'] = res.data.pageNo
        this.setState({ dataSource: res.data.data ? res.data.data : [], pagination, shipId: res.data.data && res.data.data.length ? res.data.data[0].id : undefined }, () => this.getShipBottomData())
      } else {
        message.error(res.errmsg)
      }
    })
  }
  // 导出
  handleChuItem() {
    const { selectedRowKeys, queryData } = this.state
    const data = { ...{ 'id': selectedRowKeys[0] }, ...queryData }
    console.log(data)
    for (var key in data) {
      if (!(data[key] || data[key] === 0)) {
        delete data[key]
      }
    }
    (async () => {
      const newdata = await api.data.memberfile.exportMembershipJudge(data) || false
      console.log(newdata)
      if (newdata) {
        location.href = `${baseUrl}membership/exportMembership?${transGetUrl(data)}`
      }
    })()
  }

  getShipBottomData() {
    const { shipId, selectedRowKeys, bottomIndex } = this.state
    const id = (selectedRowKeys[0] || selectedRowKeys[0] === 0) ? selectedRowKeys[0] : shipId
    if (id) {
      switch (bottomIndex) {
        case '1':
          fetch.get(`/Membership/LevelDefiList/${id}`).then(res => {
            if (res.code === 0) {
              this.setState({ gradeSource: res.data.data })
            }
          })
          break
        case '2':
          fetch.get(`/Membership/RuleMoneyRise/${id}`).then(res => {
            if (res.code === 0) {
              this.setState({ gradeSource: res.data })
            }
          })
          break
        case '3':
          fetch.get(`/Cend/Manage/PlateFormInfo/V1.0.2/${id}`).then(res => {
            if (res.code === 0) {
              this.setState({ gradeSource: res.data })
            }
          })
          break
        case '4':
          fetch.get(`/Cend/Manage/BaseIntergrationRule/V1.0.2/${id}`).then(res => {
            if (res.code === 0) {
              this.setState({ gradeSource: res.data })
            }
          })
          break
        case '5':
          fetch.get(`/Cend/Manage/ProductList/V1.0.2/${id}`).then(res => {
            if (res.code === 0) {
              this.setState({ gradeSource: res.data })
            }
          })
          break
      }
    } else {
      this.setState({ gradeSource: [] })
    }
  }
  // 底下数据切换
  changeAddTab(item) {
    console.log(item)
    this.setState({ bottomIndex: item, barAddVisible: parseInt(item) === 5 }, () => this.getShipBottomData())
  }

  handleAddItem() {
    const { addForm } = this.state
    for (let key in addForm) {
      addForm[key].initialValue = ''
    } // 用form.setFieldsValue方法要先赋初始值
    this.setState({
      addForm,
      addVisible: true,
      modalTitle: '新增会籍档案',
      selectDetails: [],
      selectedRowKeys: []
    })
  }

  hideAddModal() {
    this.setState({
      addVisible: false,
    })
  }
  // 弹窗保存
  addOk(e) {
    e.preventDefault()
    this.props.form.validateFields(['companyName', 'membershipNoadd', 'membershipNameadd'], (err, values) => {
      if (err) return
      values = tooler.jsonTrim(values)
      this.setState({ loading: true })
      values['membershipNo'] = values['membershipNoadd']
      values['membershipName'] = values['membershipNameadd']
      delete values['membershipNoadd']
      delete values['membershipNameadd']
      if (this.state.modalTitle.indexOf('新增') > -1) {
        fetch.post('/membership/addMembership', values).then(res => {
          if (res.code === 0) {
            const { pagination } = this.state
            pagination.current = 1
            message.success('新增成功！', 1)
            this.fetchTreeCategories()
            this.setState({ addVisible: false, pagination, queryData: {}}, () => {
              this.getShipListData()
            })
          } else {
            this.setState({ loading: false })
            message.error(res.errmsg)
          }
        })
      } else {
        const { selectedRowKeys } = this.state
        values['id'] = selectedRowKeys[0]
        fetch.post('/membership/modifyMembership', values).then(res => {
          if (res.code === 0) {
            message.success('修改成功！')
            this.fetchTreeCategories()
            this.setState({ addVisible: false, selectedRowKeys: [], selectDetails: [] }, () => {
              this.getShipListData()
            })
          } else {
            this.setState({ loading: false })
            message.error(res.errmsg)
          }
        })
      }
    })
  }

  // 表格列表点击
  onSelectChange(selectedRowKeys, selectDetails) {
    const { dataSource } = this.state
    const selectedRowKeysChange = selectedRowKeys.splice(selectedRowKeys.length - 1)
    const selectDetailsChange = dataSource.filter((item) => (item['id'] === selectedRowKeysChange[0]))
    this.setState({ selectedRowKeys: selectedRowKeysChange, selectDetails: selectDetailsChange }, () => { this.getShipBottomData() })
  }

  // 删除
  handleDelItem() {
    const { selectedRowKeys, selectDetails } = this.state
    Modal.confirm({
      title: '',
      content: `确认删除${selectDetails[0].membershipName}？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => { this.deleteOk(selectedRowKeys[0]) },
      onCancel() {},
    })
  }
  // 删除
  deleteOk(id) {
    fetch.delete('/membership/deleteMembership/' + id).then(res => {
      if (res.code === 0) {
        message.success('删除成功！')
        this.fetchTreeCategories()
      } else {
        message.error(res.errmsg)
      }
      this.setState({ selectedRowKeys: [], selectDetails: [] }, () => {
        this.getShipListData()
      })
    })
  }
  // 启用
  handleEnableItem() {
    const { selectDetails } = this.state
    this.setState({ loading: true })
    const data = {}
    data['id'] = selectDetails[0].id
    data['status'] = selectDetails[0].status === '1' ? '0' : '1'
    fetch.post('/membership/enableMembership', data).then(res => {
      if (res.code === 0) {
        let type = selectDetails[0].status === '1' ? '停用成功！' : '启用成功！'
        message.success(`${selectDetails[0].membershipName}${type}`)
        this.setState({ selectedRowKeys: [], selectDetails: [] })
        this.getShipListData()
        this.fetchTreeCategories()
      } else {
        this.setState({ loading: false })
        message.error(res.errmsg)
      }
    })
  }
  // 查询
  onSubmitInfo(e) {
    e.preventDefault()
    this.props.form.validateFields(['membershipNo', 'membershipName', 'status'], (err, values) => {
      if (err) return
      values = tooler.jsonTrim(values)
      const { pagination } = this.state
      pagination.current = 1
      this.setState({ queryData: values, pagination, loading: true, selectedRowKeys: [], selectDetails: [] }, () => { this.getShipListData() })
    })
  }
  // table分页
  tableChange(pagination) {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    pager.pageSize = pagination.pageSize
    this.setState({
      pagination: pager,
      selectedRowKeys: [],
      selectDetails: [],
      loading: true
    }, () => {
      this.getShipListData()
    })
  }
  // 修改
  handleModifyItem() {
    const { selectDetails, addForm } = this.state
    const objDetails = {}
    objDetails['companyName'] = selectDetails[0]['companyName']
    objDetails['membershipNoadd'] = selectDetails[0]['membershipNo']
    objDetails['membershipNameadd'] = selectDetails[0]['membershipName']
    for (let key in addForm) {
      addForm[key].initialValue = objDetails[addForm[key].name]
    } // 用form.setFieldsValue方法要先赋初始值
    this.setState({ addForm, addVisible: true, modalTitle: '修改会籍档案' })
  }

  beforeUpload(item) {
    let file = arguments[0]
    return new Promise((resolve, reject) => {
      if (file.size > 2000000000) {
        message.warning(`${file.name} 文件大小超过了2G.`)
        reject()
      } else {
        resolve()
      }
    })
  }
  async upLoadChange(info) {
    if (info.file.status === 'uploading') {
      showSpin(true)
    }
    if (info.file.status === 'done' && info.file.response.code === 0) {
      console.log('done')
      showSpin()
      const { pagination } = this.state
      Modal.success({
        content: <div style={{ maxHeight: '400px', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: info.file.response.data }}/>
      })
      pagination['current'] = 1
      this.setState({ pagination, selectedRowKeys: [], selectDetails: [], queryData: {}, loading: true }, () => this.getShipListData())
      this.fetchTreeCategories()
    }
    if (info.file.status === 'error') {
      showSpin()
      message.error(`${info.file.name}${info.file.response.message}`)
    }
    if (info.file.status === 'done' && info.file.response.code !== 0) {
      showSpin()
      message.error(`${info.file.name}${info.file.response.errmsg}`)
    }
  }

  /* transfer start */
  useAry(ary) {
    console.log(ary)
    let plateformList = []
    let meshipAry = []
    for (let i = 0; i < ary.length; i++) {
      meshipAry.push(ary[i].split('##')[0])
    }
    let setAry = new Set(meshipAry)
    setAry = [...setAry]
    for (let k = 0; k < setAry.length; k++) {
      let sonAry = []
      for (let j = 0; j < ary.length; j++) {
        if (ary[j].split('##')[0] === setAry[k]) {
          sonAry.push(ary[j].split('##')[1])
        }
      }
      plateformList.push({ membershipId: setAry[k], productId: sonAry[0] })
    }
    console.log(plateformList)
    return plateformList
  }
  async fetchColumns() { // 获取右侧列表数据
    const listData = await api.data.platfile.productList() || false
    console.log(listData)
    if (listData) {
      this.setState({ targets: listData })
    }
  }
  async fetchTreeCategories() { // 获取左侧树数据
    const treeData = await api.data.platfile.productTree() || false
    console.log(treeData)
    if (treeData) {
      this.setState({ treeData })
    }
  }
  addEstateItem() {
    this.setState({
      transVisible: true,
    })
  }

  handleTransCancel() {
    this.setState({
      transVisible: false,
      expandedKeys: [],
      targetCheckedKeys: [],
      sourceCheckedKeys: [],
      sourceSelectedKeys: []
    })
  }
  onExpand(expandedKeys) {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    })
  }
  onSourceCheck(sourceCheckedKeys, event) {
    console.log(sourceCheckedKeys)
    let plateformList = this.useAry(sourceCheckedKeys.checked)
    this.setState({ sourceCheckedKeys: sourceCheckedKeys.checked, plateformList })
  }
  onSourceSelect(sourceSelectedKeys, info) { // 点击树节点触发
    const expandedKeys = this.state.expandedKeys
    console.log(sourceSelectedKeys)
    if (expandedKeys.indexOf(sourceSelectedKeys[0]) < 0) {
      expandedKeys.push(sourceSelectedKeys[0])
    }
    this.setState({ sourceSelectedKeys, expandedKeys })
  }
  onTargetChange(e) { // 点击右侧列表事件
    // console.log(checkedValues)
    this.setState({ targetCheckedKeys: e.target.value })
  }

  // 右移操作
  handleRight() {
    // let treeData = this.state.treeData
    // let targets = this.state.targets
    let sourceCheckedKeys = this.state.sourceCheckedKeys
    // let sourceSelectedKeys = this.state.sourceSelectedKeys
    let plateformList = this.state.plateformList
    if (sourceCheckedKeys.length > 0) {
      fetch.put('/Cend/Manage/Membership/Product/Right/V1.0.2', { membershipList: plateformList }).then(res => {
        if (res.code === 0) {
          message.success('操作成功')
          // sourceCheckedKeys.forEach((item) => {
          //   treeData.forEach((treeItem) => {
          //     if (treeItem.membershipList && treeItem.membershipList.length > 0) {
          //       treeItem.membershipList.forEach((items, index, array) => {
          //         if (Number(item) === items.id) {
          //           targets.push(array.splice(index, 1)[0])
          //         }
          //       })
          //     }
          //   })
          // })

          // console.log(this.state.dataSource)
          // if (this.state.selectedRowKeys.length !== 0) {
          //   this.memberlistById(this.state.selectedRowKeys[0])
          // } else {
          //   this.memberlistById(this.state.dataSource[0].id)
          // }
          this.fetchColumns()
          this.getShipBottomData()
          this.setState({ targetCheckedKeys: [], sourceSelectedKeys: [], sourceCheckedKeys: [] })
          this.fetchTreeCategories()
        } else {
          message.error(res.errmsg)
        }
      })
    } else {
      message.error('请选择需要解绑的二级类目')
    }
  }
  // 左移操作
  handleLeft() {
    // let treeData = this.state.treeData
    // let targets = this.state.targets
    let targetCheckedKeys = this.state.targetCheckedKeys
    let sourceSelectedKeys = this.state.sourceSelectedKeys
    if (sourceSelectedKeys.length > 0) {
      fetch.post('/Cend/Manage/Membership/Product/Left/V1.0.2', { membershipId: Number(sourceSelectedKeys[0]), productId: targetCheckedKeys }).then(res => {
        if (res.code === 0) {
          message.success('操作成功')
          // const selectData = treeData.find((item) => {
          //   return item.id === Number(sourceSelectedKeys[0])
          // })
          // targetCheckedKeys.forEach((item) => {
          //   targets.forEach((items, index, array) => {
          //     if (Number(item) === items.id) {
          //       selectData.membershipList.push(array.splice(index, 1)[0])
          //     }
          //   })
          // })
          this.fetchColumns()
          this.getShipBottomData()
          this.setState({ targetCheckedKeys: [], sourceSelectedKeys: [] })
          this.fetchTreeCategories()
        } else {
          message.error(res.errmsg)
        }
      })
    } else {
      message.error('请选择一级类目')
    }
  }
  renderTreeNodes(data, disableCheckbox, selectable) {
  // 树节点dom渲染
    return data.map((item) => {
      if (item.productList) {
        return (
          <TreeNode title={item.name} key={item.id} disabled={item.productList.length > 0} dataRef={item} disableCheckbox={disableCheckbox} selectable={selectable}>
            {this.renderTreeNodes(item.productList, false, false)}
          </TreeNode>
        )
      }
      return <TreeNode title={item.name} key={item.parentId + '##' + item.id} dataRef={item} disableCheckbox={disableCheckbox} selectable={selectable} />
    })
  }
  hideTransModal() {
    this.setState({
      transVisible: false,
      expandedKeys: [],
      targetCheckedKeys: [],
      sourceCheckedKeys: [],
      sourceSelectedKeys: []
    })
  }
  /* transfer end */

  render() {
    const plateColumns = [{
      title: '平台编号',
      dataIndex: 'plateformNo',
      key: 'plateformNo',
    }, {
      title: '平台名称',
      dataIndex: 'plateformName',
      key: 'plateformName',
    }, {
      title: '所属公司',
      dataIndex: 'companyName',
      key: 'companyName',
    }, {
      title: '启用状态',
      dataIndex: 'blEnable',
      key: 'blEnable',
      render: (text, record) => {
        return text ? '启用' : '停用'
      }
    }]
    const integralColumns = [{
      title: '积分编号',
      dataIndex: 'baseIntergrationRuleNo',
      key: 'baseIntergrationRuleNo',
      render: (text, record) => {
        if (record.showStatus === 1) {
          return (<span>{text}</span>)
        }
        return text
      }
    }, {
      title: '积分名称',
      dataIndex: 'baseIntergrationRuleName',
      key: 'baseIntergrationRuleName',
      render: (text, record) => {
        if (record.showStatus === 1) {
          return (<span>{text}</span>)
        }
        return text
      }
    }, {
      title: '所属公司',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (text, record) => {
        if (record.showStatus === 1) {
          return (<span>{text}</span>)
        }
        return text
      }
    }, {
      title: '所属会籍/产业',
      dataIndex: 'membershipName',
      key: 'membershipName',
      render: (text, record) => {
        if (record.showStatus === 1) {
          return (<span>{text}</span>)
        }
        return text
      }
    }, {
      title: '每M货币单位',
      dataIndex: 'currencyUnit',
      key: 'currencyUnit',
      render: (text, record) => {
        if (record.showStatus === 1) {
          return (<span>{text}</span>)
        }
        return text
      }
    }, {
      title: '积N分',
      dataIndex: 'baseIntergration',
      key: 'baseIntergration',
      render: (text, record) => {
        if (record.showStatus === 1) {
          return (<span>{text}</span>)
        }
        return text
      }
    }
    ]
    const estateColumns = [{
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      render: (text, record) => {
        return this.state.gradeSource.indexOf(record) + 1
      }
    }, {
      title: '产业ID',
      dataIndex: 'productId',
      key: 'productId',
    }, {
      title: '产业名称',
      dataIndex: 'productName',
      key: 'productName',
    }]
    const { selectedRowKeys, columns, columnsTwo, columnsThree, loading, dataSource, addForm } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const currTime = (new Date()).valueOf()
    return <div>
      <p>会籍档案</p>
      <div className={style['button-box']}>
        {
          this.state.jsonPower['operation_manage_membership_insert'] ? <Button type='primary' className={style['button']} onClick={this.handleAddItem}>新增</Button> : null
        }
        {
          this.state.jsonPower['operation_manage_membership_update'] ? <Button type='primary' className={style['button']} disabled={ selectedRowKeys.length === 0 } onClick={this.handleModifyItem}>修改</Button> : null
        }
        {
          this.state.jsonPower['operation_manage_membership_delete_logic'] ? <Button type='primary' className={style['button']} disabled={ selectedRowKeys.length === 0 } onClick={this.handleDelItem}>删除</Button> : null
        }
        {
          this.state.jsonPower['operation_manage_membership_enable_or_disable'] ? <Button type='primary' className={style['button']} disabled={ selectedRowKeys.length === 0 } onClick={this.handleEnableItem}>改变启用状态</Button> : null
        }
        <Button type='primary' className={style['button']} onClick={this.onSubmitInfo}>查询</Button>
        {
          this.state.jsonPower['operation_manage_membership_importinfo'] ? <Upload
          name='importFile'
          withCredentials={true}
          multiple={true}
          showUploadList= {false}
          headers={{ randomKey: currTime, secretKey: md5(currTime + 'Wivy45YNgsteznpf') }}
          action={baseUrl + '/membership/importMembershipInfo'}
          onChange={this.upLoadChange}
          beforeUpload={this.beforeUpload}
        > <Button type='primary' className={style['button']} icon='upload'>导入</Button></Upload> : null
        }
        {
          this.state.jsonPower['operation_manage_membership_exportinfo'] ? <Button type='primary' className={style['button']} disabled={ dataSource.length === 0 } onClick={this.handleChuItem}>导出</Button> : null
        }
      </div>
      <Form onSubmit={this.onSubmitInfo}>
        <Search formEle={Form} formMethods={this.props.form} search={this.search} />
      </Form>
      <Table
      className={style['table-one']}
      dataSource={this.state.dataSource}
      locale={{ emptyText: '暂无数据' }}
      rowKey='id'
      scroll={{ x: true }}
      rowSelection={rowSelection}
      pagination={this.state.pagination}
      onChange={this.tableChange} bordered columns={columns} loading={loading} />
      <Tabs defaultActiveKey='1' tabBarExtraContent={ this.state.barAddVisible ? <Button onClick={this.addEstateItem} icon='plus'></Button> : null } className={style['file-tabs']} onChange={this.changeAddTab}>
        <TabPane tab='等级' key='1' className={style['tab-pane']}>
          <Table
          className={style['table']}
          columns={columnsTwo}
          locale={{ emptyText: '暂无数据' }}
          dataSource={this.state.gradeSource}
          pagination={false}
          rowKey={record => record.id} bordered />
        </TabPane>
        <TabPane tab='金额晋级规则' key='2' className={style['tab-pane']}>
          <Table
          className={style['table']}
          locale={{ emptyText: '暂无数据' }}
          columns={columnsThree}
          dataSource={this.state.gradeSource}
          pagination={false}
          rowKey={record => record.id} bordered />
        </TabPane>
        <TabPane tab='平台' key='3' className={style['tab-pane']}>
          <Table
            className={style['table']}
            locale={{ emptyText: '暂无数据' }}
            columns={plateColumns}
            dataSource={this.state.gradeSource}
            pagination={false}
            rowKey={record => record.id} bordered />
        </TabPane>
        <TabPane tab='基本积分规则' key='4' className={style['tab-pane']}>
          <Table
            className={style['table']}
            locale={{ emptyText: '暂无数据' }}
            columns={integralColumns}
            dataSource={this.state.gradeSource}
            pagination={false}
            rowClassName={record => record.showStatus === 1 ? 'gray' : ''}
            rowKey={record => record.id} bordered />
        </TabPane>

        <TabPane tab='所属产业' key='5' className={style['tab-pane']}>
          <Table
            className={style['table']}
            locale={{ emptyText: '暂无数据' }}
            columns={estateColumns}
            dataSource={this.state.gradeSource}
            pagination={false}
            rowKey={record => record.id} bordered />
        </TabPane>
      </Tabs>
      <Modal
        title={this.state.modalTitle}
        visible={this.state.addVisible}
        destroyOnClose
        onOk={this.addOk}
        onCancel={this.hideAddModal}
        okText='保存'
        cancelText='关闭'
      >
        <Form>
          <AddForm formEle={Form} formMethods={this.props.form} addForm={addForm} />
        </Form>
      </Modal>
      <Modal
        title='产业会籍关系配置'
        destroyOnClose
        visible={this.state.transVisible}
        onCancel={this.hideTransModal}
        footer={<Button type='primary' onClick={this.hideTransModal}>返回</Button>}
      >
        <Row className={style['box-header']}>
          <Col span={11}>会籍名称</Col>
          <Col span={11} offset={2}>所属产业</Col>
        </Row>
        <Row className={style['transfer-box']}>
          <Col span={11} className={style['first-list']}>
            <Tree
              checkable
              checkStrictly
              expandedKeys={this.state.expandedKeys}
              onExpand={this.onExpand}
              onCheck={this.onSourceCheck}
              onSelect={this.onSourceSelect}
              checkedKeys={this.state.sourceCheckedKeys}
              autoExpandParent={this.state.autoExpandParent}
            >
              {this.renderTreeNodes(this.state.treeData, true, true)}
            </Tree>
          </Col>
          <Col className={style['oper-btngroup']} span={2}>
            <Button type='primary' size='small' icon='right' className={style['oper-button']} onClick={this.handleRight} disabled={this.state.sourceCheckedKeys.length === 0}/>
            <Button type='primary' size='small' icon='left' className={style['oper-button']} onClick={this.handleLeft} disabled={this.state.sourceSelectedKeys.length <= 0 || this.state.targetCheckedKeys.length <= 0}/>
          </Col>
          <Col span={11} className={style['second-list']}>
            {
              this.state.targets.length > 0 ? <RadioGroup options={this.state.targets.map(item => ({ label: item.productName, value: item.productId }))} value={this.state.targetCheckedKeys} onChange={this.onTargetChange} /> : '暂无项目'
            }
          </Col>
        </Row>
      </Modal>
    </div>
  }
}

export default Form.create()(membership)
