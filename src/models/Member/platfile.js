/*
* @Author: chengbs
* @Date:   2018-05-08 14:39:04
* @Last Modified by:   chengbs
* @Last Modified time: 2018-06-20 10:54:17
*/
import React, { Component } from 'react'
import { Button, Table, Tabs, Modal, Input, Form, Row, Col, Tree, message, Checkbox } from 'antd'
import fetch from 'Util/fetch'
import api from 'Src/contants/api'
import tooler from 'Contants/tooler'
import moment from 'moment'
const TabPane = Tabs.TabPane
const FormItem = Form.Item
const TreeNode = Tree.TreeNode
const CheckboxGroup = Checkbox.Group
import style from './index.css'
class PlatFile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tablePlatList: [],
      estateData: [],
      selectedRowKeys: [],
      selectDetails: [],
      platVisible: false,
      platConfLoading: false,
      isAddModal: true,
      plateformList: [],
      transVisible: false, // transfer start
      expandedKeys: [],
      sourceCheckedKeys: [],
      treeData: [],
      sourceSelectedKeys: [],
      targetCheckedKeys: [],
      autoExpandParent: true,
      targets: [],
      relaDataSource: [], // transfer end
      jsonPower: {}

    }

    this.loadPlatList = this.loadPlatList.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleAddItem = this.handleAddItem.bind(this)
    this.handleModifyItem = this.handleModifyItem.bind(this)
    this.handleDelItem = this.handleDelItem.bind(this)
    this.deleteOk = this.deleteOk.bind(this)
    this.disableList = this.disableList.bind(this)
    this.enableList = this.enableList.bind(this)
    this.onSelectChange = this.onSelectChange.bind(this)
    this.handlePlatSave = this.handlePlatSave.bind(this)
    this.handlePlatCancel = this.handlePlatCancel.bind(this)
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
    /* transfer end */
  }

  async loadPlatList(currentPage) {
    const tablePlatList = await api.data.platfile.platList({
      pageNumber: currentPage || 1,
      pageSize: 10
    }) || []
    console.log(tablePlatList)
    this.setState({ tablePlatList })
    if (this.state.selectedRowKeys.length === 0 && tablePlatList['data'].length !== 0) {
      this.memberlistById(tablePlatList['data'][0].id)
    }
  }
  handlePageChange(currentPage) {
    this.loadPlatList(currentPage)
    this.setState({
      selectedRowKeys: [],
      selectDetails: [],
      loading: true
    })
  }
  componentDidMount() {
    this.loadPlatList()
    this.fetchColumns()
    this.fetchTreeCategories()
    // 权限控制start
    let jsonPower = tooler.authoControl()
    this.setState({ jsonPower })
    // 权限控制end
  }

  // 新增按钮
  handleAddItem() {
    this.setState({
      platVisible: true,
      isAddModal: true
    })
    console.log('handleAddItem')
  }

  handlePlatSave() {
    this.handlePlatSubmit()
  }
  handlePlatSubmit() {
    const _t = this
    this.setState({
      platConfLoading: true,
    })
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values = tooler.jsonTrim(values)
        if (this.state.isAddModal) { // 添加
          (async () => {
            const addData = await api.data.platfile.platAdd({
              companyName: values['companyName'],
              plateformName: values['plateformName']
            }) || false
            addData ? _t.loadPlatList() : null
          })()
        } else { // 修改
          (async () => {
            const editData = await api.data.platfile.platEdit({
              ...values
            }) || false
            editData ? _t.loadPlatList() : null
          })()
        }
        this.setState({
          platVisible: false,
          platConfLoading: false,
        })
      }
    })
  }

  handlePlatCancel() {
    this.setState({
      platVisible: false,
    })
  }

  // 编辑按钮
  handleModifyItem() {
    console.log(this.state.selectDetails)
    const { selectDetails } = this.state
    this.setState({
      platVisible: true,
      isAddModal: false
    }, () => {
      this.props.form.setFieldsValue({
        id: selectDetails[0]['id'],
        companyName: selectDetails[0]['companyName'],
        plateformName: selectDetails[0]['plateformName']
      })
    })
    console.log('handleModifyItem')
  }

  // 删除按钮
  handleDelItem() {
    const { selectedRowKeys, selectDetails } = this.state
    Modal.confirm({
      title: '',
      content: `确认删除${selectDetails[0].plateformName}？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => { this.deleteOk(selectedRowKeys[0]) },
      onCancel() {},
    })
  }

  async disableList(id) { // 停用
    const disabledData = await api.data.platfile.platEnable({
      blEnable: false,
      id: id
    }) || false
    if (disabledData) {
      this.loadPlatList()
      this.fetchTreeCategories()
    }
  }

  async enableList(id) { // 启用
    const enableData = await api.data.platfile.platEnable({
      blEnable: true,
      id: id
    }) || false
    if (enableData) {
      this.loadPlatList()
      this.fetchTreeCategories()
    }
  }

  async deleteOk(id) {
    const delData = await api.data.platfile.platDel(id) || false
    if (delData) {
      this.loadPlatList()
      this.fetchTreeCategories()
    }
  }

  async memberlistById(id) {
    const memberData = await api.data.platfile.memeberById(id) || false
    if (memberData) {
      this.setState({
        estateData: memberData
      })
    } else {
      this.setState({
        estateData: []
      })
    }
    console.log(memberData)
  }
  // 选择平台档案列表
  onSelectChange(selectedRowKeys, selectedRows) {
    // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    const { tablePlatList } = this.state
    const platData = tablePlatList['data']
    const selectedRowKeysChange = selectedRowKeys.splice(selectedRowKeys.length - 1)
    const selectDetailsChange = platData.filter((item) => (item['id'] === selectedRowKeysChange[0]))
    console.log(selectDetailsChange)
    console.log(selectedRowKeysChange)
    // this.memberlistById(selectedRowKeysChange[0])
    if (selectedRowKeysChange.length !== 0) {
      this.memberlistById(selectedRowKeysChange[0])
    } else {
      this.setState({ estateData: [] })
    }
    this.setState({ selectedRowKeys: selectedRowKeysChange, selectDetails: selectDetailsChange })
  }

  /* transfer start */
  useAry(ary) {
    console.log(ary)
    let plateformList = []
    let meshipAry = []
    for (let i = 0; i < ary.length; i++) {
      meshipAry.push(Number(ary[i].split('##')[0]))
    }
    let setAry = new Set(meshipAry)
    setAry = [...setAry]
    for (let k = 0; k < setAry.length; k++) {
      let sonAry = []
      for (let j = 0; j < ary.length; j++) {
        if (Number(ary[j].split('##')[0]) === Number(setAry[k])) {
          sonAry.push(Number(ary[j].split('##')[1]))
        }
      }
      plateformList.push({ plateformId: setAry[k], membershipIds: sonAry })
    }
    console.log(plateformList)
    return plateformList
    // console.log(platefomList)
    // return plateformList
  }
  async fetchColumns() { // 获取右侧列表数据
    const listData = await api.data.platfile.memberShipList() || false
    console.log(listData)
    if (listData) {
      this.setState({ targets: listData })
    }
  }
  async fetchTreeCategories() { // 获取左侧树数据
    const treeData = await api.data.platfile.memeberShipTree() || false
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
      sourceCheckedKeys: []
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
    if (expandedKeys.indexOf(sourceSelectedKeys[0]) < 0) {
      expandedKeys.push(sourceSelectedKeys[0])
    }
    this.setState({ sourceSelectedKeys, expandedKeys })
  }
  onTargetChange(checkedValues) { // 点击右侧列表事件
    console.log(checkedValues)
    this.setState({ targetCheckedKeys: checkedValues })
  }

  // 右移操作
  handleRight() {
    // let treeData = this.state.treeData
    // let targets = this.state.targets
    let sourceCheckedKeys = this.state.sourceCheckedKeys
    let plateformList = this.state.plateformList
    if (sourceCheckedKeys.length > 0) {
      fetch.put('/Cend/Manage/PlateForm/MemberShip/Right/V1.0.2', { plateformList: plateformList }).then(res => {
        if (res.code === 0) {
          message.success('操作成功')
          // sourceCheckedKeys.forEach((item) => {
          //   treeData.forEach((treeItem) => {
          //     if (treeItem.membershipList && treeItem.membershipList.length > 0) {
          //       treeItem.membershipList.forEach((items, index, array) => {
          //         if (Number(item) === items.id) {
          //           array.splice(index, 1)[0]
          //         }
          //       })
          //     }
          //   })
          // })

          if (this.state.selectedRowKeys.length !== 0) {
            this.memberlistById(this.state.selectedRowKeys[0])
          } else {
            this.memberlistById(this.state.tablePlatList['data'][0].id)
          }

          this.setState({ sourceCheckedKeys: [] })
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
      fetch.post('/Cend/Manage/PlateForm/MemberShip/Left/V1.0.2', { plateformId: Number(sourceSelectedKeys[0]), membershipIds: targetCheckedKeys }).then(res => {
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
          if (this.state.selectedRowKeys.length !== 0) {
            this.memberlistById(this.state.selectedRowKeys[0])
          } else {
            this.memberlistById(this.state.tablePlatList['data'][0].id)
          }

          this.setState({ targetCheckedKeys: [] })
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
      if (item.membershipList) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item} disableCheckbox={disableCheckbox} selectable={selectable}>
            {this.renderTreeNodes(item.membershipList, false, false)}
          </TreeNode>
        )
      }
      return <TreeNode title={item.name} key={item.parentId + '##' + item.id} dataRef={item} disableCheckbox={disableCheckbox} selectable={selectable} />
    })
  }
  /* transfer end */

  render () {
    const { selectedRowKeys, platVisible, platConfLoading, expandedKeys, sourceCheckedKeys, autoExpandParent, treeData, sourceSelectedKeys, targetCheckedKeys, targets, tablePlatList } = this.state
    let platColumns = []
    platColumns = [
      {
        title: '所属公司',
        dataIndex: 'companyName',
        render: text => <a href='javascript:;'>{text}</a>,
      }, {
        title: '平台编号',
        dataIndex: 'plateformNo',
      }, {
        title: '平台名称',
        dataIndex: 'plateformName',
      }, {
        title: '启用状态',
        dataIndex: 'blEnable',
        key: 'enableState',
        render: (val) => {
          if (val) {
            return '启用'
          } else {
            return '停用'
          }
        }
      }, {
        title: '创建人',
        dataIndex: 'createdPerson',
      }, {
        title: '最后修改人',
        dataIndex: 'modifiedPerson',
      }, {
        title: '最后修改时间',
        dataIndex: 'modifyTime',
        render: (text, record) => {
          return text && moment(Number(text)).format('YYYY/MM/DD')
        }
      }
    ]
    // platColumns.push({
    //   title: '操作状态',
    //   dataIndex: 'blEnable',
    //   key: 'enableControl',
    //   render: (text, record) => {
    //     return text ? <Button type='danger' onClick={this.disableList.bind(null, record.id)}>停用</Button> : <Button type='primary' onClick={this.enableList.bind(null, record.id)}>启用</Button>
    //   }
    // })

    const estateColumns = [{
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      render: (text, record) => {
        return this.state.estateData.indexOf(record) + 1
      }
    }, {
      title: '会籍名称',
      dataIndex: 'membershipName',
      key: 'membershipName',
    }, {
      title: '启用状态',
      dataIndex: 'membershipStatus',
      key: 'membershipStatus',
      render: (val) => {
        if (val) {
          return '启用'
        } else {
          return '停用'
        }
      }
    }]

    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    }
    const { getFieldDecorator } = this.props.form

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    }

    return (
      <div>
        <p>平台档案</p>
        <div className={style['button-box']} style={{ display: 'none' }}>
          <Button type='primary' className={style['button']} onClick={this.handleAddItem}>新增</Button>
          <Button type='primary' disabled={ selectedRowKeys.length === 0 } className={style['button']} onClick={this.handleModifyItem}>修改</Button>
          <Button type='primary' disabled={ selectedRowKeys.length === 0 } className={style['button']} onClick={this.handleDelItem}>删除</Button>
        </div>
        <Table
          className={style['table-one']}
          locale={{ emptyText: '暂无数据' }}
          rowKey='id'
          scroll={{ x: true }}
          bordered
          rowSelection={rowSelection}
          columns={platColumns}
          dataSource={tablePlatList['data']}
          pagination={{
            showQuickJumper: true,
            total: tablePlatList.records,
            onChange: this.handlePageChange,
            pageSize: 10,
            current: tablePlatList.pageNo
          }}
        />
          <Tabs tabBarExtraContent={ <Button onClick={this.addEstateItem} icon='plus'></Button> } type='card'>
            <TabPane tab='会籍/产业' key='1'>
              <Table
              rowKey='id'
              dataSource={this.state.estateData}
              columns={estateColumns}
              pagination={false}
              bordered
              />
            </TabPane>
          </Tabs>
          <Modal title={this.state.isAddModal ? '新增平台档案' : '编辑平台档案'}
            visible={platVisible}
            onOk={this.handlePlatSave}
            confirmLoading={platConfLoading}
            onCancel={this.handlePlatCancel}
            width={450}
            okText='保存'
            cancelText='取消'
            destroyOnClose={true}
          >
            <Form onSubmit={this.handlePlatSubmit}>
              <FormItem
                style={{ display: 'none' }}
                label='平台编号'
                { ...formItemLayout }
              >
                {getFieldDecorator('id', {
                  rules: [{ required: true, message: 'Please input your note!' }],
                  initialValue: 1234
                })(
                  <Input disabled />
                )}
              </FormItem>
              <FormItem
                label='所属公司'
                { ...formItemLayout }
              >
                {getFieldDecorator('companyName', {
                  rules: [{ required: true, message: '请输入所属公司' }],
                  initialValue: ''
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem
                label='平台名称'
                { ...formItemLayout }
              >
                {getFieldDecorator('plateformName', {
                  rules: [{ required: true, message: '请输入平台名称' }],
                })(
                  <Input />
                )}
              </FormItem>
            </Form>
          </Modal>
          <Modal
            title='平台会籍配置'
            width={560}
            visible={this.state.transVisible}
            onCancel={this.handleTransCancel}
            destroyOnClose={true}
            footer={<Button type='primary' onClick={this.handleTransCancel}>返回</Button>}
          >
            <Row className={style['box-header']}>
              <Col span={11}>平台名称</Col>
              <Col span={11} offset={2}>会籍</Col>
            </Row>
            <Row className={style['transfer-box']}>
              <Col span={11} className={style['first-list']}>
                <Tree
                  checkable
                  checkStrictly
                  expandedKeys={expandedKeys}
                  onExpand={this.onExpand}
                  onCheck={this.onSourceCheck}
                  onSelect={this.onSourceSelect}
                  checkedKeys={sourceCheckedKeys}
                  autoExpandParent={autoExpandParent}
                >
                  {this.renderTreeNodes(treeData, true, true)}
                </Tree>
              </Col>
              <Col className={style['oper-btngroup']} span={2}>
              {
                this.state.jsonPower['opertion_manage_plateform_right'] ? <Button type='primary' size='small' icon='right' className={style['oper-button']} onClick={this.handleRight} disabled={sourceCheckedKeys.length === 0}/> : null
              }
              {
                this.state.jsonPower['opertion_manage_plateform_left'] ? <Button type='primary' size='small' icon='left' className={style['oper-button']} onClick={this.handleLeft} disabled={sourceSelectedKeys.length <= 0 || targetCheckedKeys.length <= 0}/> : null
              }
              </Col>
              <Col span={11} className={`${style['second-list']} ${style['plat-check-list']}`}>
                {
                  targets.length > 0 ? <CheckboxGroup options={targets.map(item => ({ label: item.membershipName, value: item.id }))} value={targetCheckedKeys} onChange={this.onTargetChange} /> : '暂无项目'
                }
              </Col>
            </Row>
          </Modal>
      </div>
    )
  }
}

export default Form.create()(PlatFile)
