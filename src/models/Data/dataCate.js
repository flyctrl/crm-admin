import React, { Component } from 'react'
import { Table, Button, Modal, Form, Input, Row, Col, Checkbox, Tree, message } from 'antd'
const { Column } = Table
const TreeNode = Tree.TreeNode
const CheckboxGroup = Checkbox.Group
const confirm = Modal.confirm
import AddForm from 'Components/AddForm/index'
import style from './index.css'
import fetch from 'Util/fetch'
import { transGetUrl } from 'Util/tools'
import tooler from 'Contants/tooler'
import moment from 'moment'

class dataCate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalTitle: '新增组别',
      currModel: 0, // 0:新增 1:修改
      addVisible: false,
      transVisible: false,
      selectedRowKeys: [],
      selectedRows: [],
      treeData: [],
      expandedKeys: [],
      autoExpandParent: true,
      sourceCheckedKeys: [],
      sourceSelectedKeys: [],
      targets: [],
      targetCheckedKeys: [],
      dataSource: [],
      relaDataSource: [],
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
      },
      jsonPower: {}
    }
    this.addForm = [
      {
        type: '规则名称',
        name: 'name',
        rules: [{ required: true, message: '请填写规则名称' }],
        item: (<Input placeholder='规则名称' maxLength={10} />)
      },
      {
        type: '备注',
        name: 'comment',
        item: (<Input placeholder='备注' maxLength={50} />)
      },
    ]
    this.onSelectChange = this.onSelectChange.bind(this)
    this.handleAddItem = this.handleAddItem.bind(this)
    this.handleModifyItem = this.handleModifyItem.bind(this)
    this.handleDelItem = this.handleDelItem.bind(this)
    this.disableList = this.disableList.bind(this)
    this.enableList = this.enableList.bind(this)
    this.hideAddModal = this.hideAddModal.bind(this)
    this.addOk = this.addOk.bind(this)
    this.handleTransItem = this.handleTransItem.bind(this)
    this.hideTransModal = this.hideTransModal.bind(this)
    // this.saveTransModal = this.saveTransModal.bind(this)
    this.onExpand = this.onExpand.bind(this)
    this.onSourceCheck = this.onSourceCheck.bind(this)
    this.onSourceSelect = this.onSourceSelect.bind(this)
    this.onTargetChange = this.onTargetChange.bind(this)
    this.handleRight = this.handleRight.bind(this)
    this.handleLeft = this.handleLeft.bind(this)
    this.handleTableChange = this.handleTableChange.bind(this)
  }

  componentDidMount() {
    this.fetchColumns()
    this.fetchTreeCategories()
    this.fetchCategories()
    // 权限控制start
    let jsonPower = tooler.authoControl()
    this.setState({ jsonPower })
    // 权限控制end
  }
  fetchCategories() {
    const pager = { ...this.state.pagination }
    const getJson = { pageNo: pager.current, pageSize: pager.pageSize }
    fetch.get('/User/Membership/Query/Categories?' + transGetUrl(getJson)).then(res => {
      if (res.code === 0) {
        pager.total = res.data.total
        this.setState({
          dataSource: res.data.datas,
          pagination: pager,
        })
        if (this.state.selectedRowKeys.length === 0 && res.data.datas.length !== 0) {
          this.fetchRuleDetail(res.data.datas[0].id)
        }
      } else {
        message.error(res.errmsg)
      }
    })
  }

  fetchColumns() {
    fetch.get('/User/Columns').then(res => {
      if (res.code === 0) {
        this.setState({ targets: res.data })
      } else {
        message.error(res.errmsg)
      }
    })
  }

  fetchTreeCategories() {
    fetch.get('/User/Columns/Categories').then(res => {
      if (res.code === 0) {
        this.setState({ treeData: res.data })
      } else {
        message.error(res.errmsg)
      }
    })
  }

  fetchRuleDetail(id) {
    fetch.get('/User/Membership/User/Column/Detail?categoryId=' + id).then(res => {
      if (res.code === 0) {
        res.data.forEach((val, index) => {
          val.index = index + 1
        })
        this.setState({ relaDataSource: res.data })
      } else {
        message.error(res.errmsg)
      }
    })
  }

  onSelectChange(selectedRowKeys, selectedRows) {
    selectedRowKeys = selectedRowKeys.slice(-1)
    selectedRows = [this.state.dataSource.find(item => item.id === selectedRowKeys[0])]
    if (selectedRowKeys.length !== 0) {
      this.fetchRuleDetail(selectedRowKeys[0])
    } else {
      this.setState({ relaDataSource: [] })
    }
    this.setState({ selectedRowKeys, selectedRows })
  }

  async handleAddItem() {
    await this.setState({
      addVisible: true,
      modalTitle: '新增组别',
      currModel: 0,
    })
    this.props.form.setFieldsValue({
      name: '',
      comment: '',
    })
  }

  async handleModifyItem() {
    await this.setState({
      addVisible: true,
      modalTitle: '修改组别',
      currModel: 1,
    })
    this.props.form.setFieldsValue({
      name: this.state.selectedRows[0].name,
      comment: this.state.selectedRows[0].comment,
    })
  }

  handleDelItem() {
    confirm({
      title: this.state.selectedRows[0].name ? `确定要删除${this.state.selectedRows[0].name}吗？` : '确定要删除吗?',
      content: '',
      onOk: () => {
        fetch.delete('/User/Columns/Category/' + this.state.selectedRowKeys[0]).then(res => {
          if (res.code === 0) {
            message.success('删除成功')
            this.setState({
              selectedRowKeys: [],
              selectedRows: [],
              relaDataSource: [],
            })
            if (this.state.dataSource.length === 1 && this.state.pagination.current > 1) {
              const pagination = this.state.pagination
              pagination.current--
              this.setState({
                pagination
              }, () => {
                this.fetchCategories()
              })
            } else {
              this.fetchCategories()
            }
            this.fetchColumns()
            this.fetchTreeCategories()
          } else {
            message.error(res.errmsg)
          }
          this.fetchCategories()
        })
      },
    })
  }

  async disableList(id) {
    await fetch.put('/User/Membership/Query/Rule/Enable', { id, isEnable: 0 }).then(res => {
      if (res.code === 0) {
        message.success('停用成功')
        this.fetchCategories()
      } else {
        message.error(res.errmsg)
      }
    })
  }

  async enableList(id) {
    await fetch.put('/User/Membership/Query/Rule/Enable', { id, isEnable: 1 }).then(res => {
      if (res.code === 0) {
        message.success('启用成功')
        this.fetchCategories()
      } else {
        message.error(res.errmsg)
      }
    })
  }

  hideAddModal() {
    this.setState({
      addVisible: false,
    })
  }

  async addOk(e) {
    e.preventDefault()
    await this.props.form.validateFields((err, values) => {
      if (err) return
      values = tooler.jsonTrim(values)
      if (!this.state.currModel) {
        fetch.post('/User/Columns/Category', { ...values, creator: 'admin' }).then(res => {
          if (res.code === 0) {
            message.success('新增成功')
            this.hideAddModal()
            this.fetchCategories()
            this.fetchTreeCategories()
            this.fetchColumns()
            this.setState({
              selectedRowKeys: [],
              selectedRows: [],
            })
          } else {
            message.error(res.errmsg)
          }
        })
      } else {
        fetch.put('/User/Columns/Category', { ...values, id: this.state.selectedRowKeys[0] }).then(res => {
          if (res.code === 0) {
            message.success('修改成功')
            this.hideAddModal()
            this.fetchCategories()
            this.fetchTreeCategories()
            this.fetchColumns()
            this.setState({
              selectedRowKeys: [],
              selectedRows: [],
            })
          } else {
            message.error(res.errmsg)
          }
        })
      }
    })
  }

  handleTransItem() {
    this.setState({
      transVisible: true,
    })
  }

  hideTransModal() {
    this.setState({
      transVisible: false,
      expandedKeys: [],
      targetCheckedKeys: [],
      sourceCheckedKeys: []
    })
  }

  // saveTransModal() {
  //   this.setState({
  //     transVisible: false,
  //   })
  //   if (this.state.selectedRowKeys.length !== 0) {
  //     this.fetchRuleDetail(this.state.selectedRowKeys[0])
  //   } else {
  //     this.fetchRuleDetail(this.state.dataSource[0].id)
  //   }
  //   message.success('保存成功')
  // }

  onExpand(expandedKeys) {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    })
  }
  onSourceCheck(sourceCheckedKeys) {
    this.setState({ sourceCheckedKeys: sourceCheckedKeys.checked })
  }
  onSourceSelect(sourceSelectedKeys, info) {
    const expandedKeys = this.state.expandedKeys
    if (expandedKeys.indexOf(sourceSelectedKeys[0]) < 0) {
      expandedKeys.push(sourceSelectedKeys[0])
    }
    this.setState({ sourceSelectedKeys, expandedKeys })
  }
  onTargetChange(checkedValues) {
    this.setState({ targetCheckedKeys: checkedValues })
  }
  // 右移操作
  handleRight() {
    let treeData = this.state.treeData
    let targets = this.state.targets
    let sourceCheckedKeys = this.state.sourceCheckedKeys
    let sourceSelectedKeys = this.state.sourceSelectedKeys
    if (sourceCheckedKeys.length > 0) {
      fetch.post('/User/Category/Move/Right', { ids: sourceCheckedKeys, id: Number(sourceSelectedKeys[0]) }).then(res => {
        if (res.code === 0) {
          message.success('操作成功')
          sourceCheckedKeys.forEach((item) => {
            treeData.forEach((treeItem) => {
              if (treeItem.userColumns && treeItem.userColumns.length > 0) {
                treeItem.userColumns.forEach((items, index, array) => {
                  if (Number(item) === items.id) {
                    targets.push(array.splice(index, 1)[0])
                  }
                })
              }
            })
          })

          if (this.state.selectedRowKeys.length !== 0) {
            this.fetchRuleDetail(this.state.selectedRowKeys[0])
          } else {
            this.fetchRuleDetail(this.state.dataSource[0].id)
          }

          this.setState({ treeData, targets, sourceCheckedKeys: [] })
          this.fetchCategories()
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
    let treeData = this.state.treeData
    let targets = this.state.targets
    let targetCheckedKeys = this.state.targetCheckedKeys
    let sourceSelectedKeys = this.state.sourceSelectedKeys
    if (sourceSelectedKeys.length > 0) {
      fetch.post('/User/Category/Move/Left', { id: Number(sourceSelectedKeys[0]), columnIds: targetCheckedKeys }).then(res => {
        if (res.code === 0) {
          message.success('操作成功')

          const selectData = treeData.find((item) => {
            return item.id === Number(sourceSelectedKeys[0])
          })
          targetCheckedKeys.forEach((item) => {
            targets.forEach((items, index, array) => {
              if (Number(item) === items.id) {
                selectData.userColumns.push(array.splice(index, 1)[0])
              }
            })
          })

          if (this.state.selectedRowKeys.length !== 0) {
            this.fetchRuleDetail(this.state.selectedRowKeys[0])
          } else {
            this.fetchRuleDetail(this.state.dataSource[0].id)
          }

          this.setState({ treeData, targets, targetCheckedKeys: [] })
          this.fetchCategories()
        } else {
          message.error(res.errmsg)
        }
      })
    } else {
      message.error('请选择一级类目')
    }
  }
  renderTreeNodes(data, disableCheckbox, selectable) {
    return data.map((item) => {
      if (item.userColumns) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item} disableCheckbox={disableCheckbox} selectable={selectable}>
            {this.renderTreeNodes(item.userColumns, false, false)}
          </TreeNode>
        )
      }
      return <TreeNode title={item.name} key={item.id} dataRef={item} disableCheckbox={disableCheckbox} selectable={selectable} />
    })
  }

  handleTableChange(pagination) {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    pager.pageSize = pagination.pageSize
    this.setState({
      pagination: pager,
      selectedRowKeys: [],
    }, () => {
      this.fetchCategories()
    })
  }

  render() {
    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    return <div>
      <p>组别管理</p>
      <div className={style['button-box']}>
        {
          this.state.jsonPower['operation_access_data_classify_insert'] ? <Button type='primary' className={style['button']} onClick={this.handleAddItem}>新增</Button> : null
        }
        {
          this.state.jsonPower['operation_access_data_classify_update'] ? <Button type='primary' className={style['button']} onClick={this.handleModifyItem} disabled={selectedRowKeys.length !== 1}>修改</Button> : null
        }
        {
          this.state.jsonPower['operation_access_data_classify_delete_logic'] ? <Button type='primary' className={style['button']} onClick={this.handleDelItem} disabled={selectedRowKeys.length !== 1}>删除</Button> : null
        }
      </div>
      <Table className={style['table']} dataSource={this.state.dataSource} rowKey='id' rowSelection={rowSelection} pagination={this.state.pagination} onChange={this.handleTableChange} bordered scroll={{ x: true }}>
        <Column title='规则编号' dataIndex='seriesNo' key='seriesNo' className='align-center' />
        <Column title='规则名称' dataIndex='name' key='name' className='align-center' />
        <Column title='备注' dataIndex='comment' key='comment' className='align-center' render={(text) => <span title={text} className='crm-ellips' style={{ width: '200px' }}>{text}</span>} />
        <Column title='创建人' dataIndex='creator' key='creator' className='align-center' />
        <Column title='最近修改人' dataIndex='updator' key='updator' className='align-center' />
        <Column title='修改时间' dataIndex='updateTime' key='updateTime' className='align-center' render={text => text ? moment(text).format('YYYY:MM:DD HH:mm:ss') : ''} />
        <Column title='当前状态' dataIndex='isEnable' key='isEnableState' className='align-center' render={text => text ? '启用' : '停用'} />
        {
          this.state.jsonPower['operation_access_data_classify_enable_or_disable'] ? <Column title='操作状态' dataIndex='isEnable' key='isEnable' className='align-center' render={(text, record) => text ? <Button type='danger' onClick={this.disableList.bind(null, record.id)}>停用</Button> : <Button type='primary' onClick={this.enableList.bind(null, record.id)}>启用</Button> } /> : null
        }
      </Table>
      <p>规则详细</p>
      {
        this.state.jsonPower['operation_access_data_classify_detail_insert'] ? <Button type='primary' className={style['button']} onClick={this.handleTransItem}>新增</Button> : null
      }
      <Table className={style['table']} dataSource={this.state.relaDataSource} rowKey='id' bordered scroll={{ x: true }}>
        <Column title='编号' dataIndex='index' key='index' className='align-center' />
        <Column title='查询字段' dataIndex='name' key='name' className='align-center' />
      </Table>
      <Modal
        title={this.state.modalTitle}
        visible={this.state.addVisible}
        onOk={this.addOk}
        onCancel={this.hideAddModal}
        okText='保存'
        cancelText='关闭'
      >
        <Form>
          <AddForm formEle={Form} formMethods={this.props.form} addForm={this.addForm} />
        </Form>
      </Modal>
      <Modal
        title='数据信息分类'
        destroyOnClose
        visible={this.state.transVisible}
        onCancel={this.hideTransModal}
        footer={<Button type='primary' onClick={this.hideTransModal}>返回</Button>}
      >
        <Row className={style['box-header']}>
          <Col span={11}>数据信息分类</Col>
          <Col span={11} offset={2}>数据项</Col>
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
              this.state.targets.length > 0 ? <CheckboxGroup options={this.state.targets.map(item => ({ label: item.name, value: item.id }))} value={this.state.targetCheckedKeys} onChange={this.onTargetChange} /> : '暂无项目'
            }
          </Col>
        </Row>
      </Modal>
    </div>
  }
}

export default Form.create()(dataCate)
