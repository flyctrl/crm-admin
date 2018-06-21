import React, { Component } from 'react'
import { Table, Button, Modal, Form, Input, Transfer, message, Select } from 'antd'
const { Column } = Table
const Option = Select.Option
const confirm = Modal.confirm
import AddForm from 'Components/AddForm/index'
import style from './index.css'
import fetch from 'Util/fetch'
import { transGetUrl } from 'Util/tools'
import tooler from 'Contants/tooler'
import moment from 'moment'

class queryRule extends Component {
  constructor(props) {
    super(props)
    this.state = {
      listData: [],
      targetKeys: [],
      selectedKeys: [],
      modalTitle: '新增查询规则定义',
      currModel: 0, // 0:新增 1:修改
      addVisible: false,
      transVisible: false,
      selectedRowKeys: [],
      selectedRows: [],
      dataSource: [],
      relaDataSource: [],
      membershipList: [],
      ruleNoList: [],
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
      },
      jsonPower: {}
    }
    this.onSelectChange = this.onSelectChange.bind(this)
    this.handleAddItem = this.handleAddItem.bind(this)
    this.hideAddModal = this.hideAddModal.bind(this)
    this.addOk = this.addOk.bind(this)
    this.handleModifyItem = this.handleModifyItem.bind(this)
    this.handleDelItem = this.handleDelItem.bind(this)
    this.disableList = this.disableList.bind(this)
    this.enableList = this.enableList.bind(this)
    this.handleTransItem = this.handleTransItem.bind(this)
    this.hideTransModal = this.hideTransModal.bind(this)
    this.transferChange = this.transferChange.bind(this)
    this.transferSelectChange = this.transferSelectChange.bind(this)
    this.saveTrans = this.saveTrans.bind(this)
    this.handleTableChange = this.handleTableChange.bind(this)
  }

  componentDidMount() {
    this.fetchQueryRule()
    fetch.get('/CRM/DictDataItems/Memberships').then(res => {
      if (res.code === 0) {
        this.setState({ membershipList: res.data })
      } else {
        message.error(res.errmsg)
      }
    })

    fetch.get('/User/Membership/Query/Categories/Enables').then(res => {
      if (res.code === 0) {
        this.setState({ ruleNoList: res.data.datas.map(item => { item.key = item.id; return item }) })
      } else {
        message.error(res.errmsg)
      }
    })

    // 权限控制start
    let jsonPower = tooler.authoControl()
    this.setState({ jsonPower })
    // 权限控制end
  }

  fetchQueryRule() {
    const pager = { ...this.state.pagination }
    const getJson = { pageNo: pager.current, pageSize: pager.pageSize }
    fetch.get('/User/Membership/Query/Rules?' + transGetUrl(getJson)).then(res => {
      if (res.code === 0) {
        pager.total = res.data.records
        this.setState({
          dataSource: res.data.data,
          pagination: pager,
        })
        if (this.state.selectedRowKeys.length === 0 && res.data.data.length !== 0) {
          fetch.get('/User/Membership/Query/Rule/Detail?membershipId=' + res.data.data[0].membershipId).then(res => {
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
      } else {
        message.error(res.errmsg)
      }
    })
  }

  fetchRuleDetail() {
    if (this.state.selectedRowKeys.length !== 0) {
      fetch.get('/User/Membership/Query/Rule/Detail?membershipId=' + this.state.selectedRows[0].membershipId).then(res => {
        if (res.code === 0) {
          this.setState({ targetKeys: res.data.map(item => item.id) })
        } else {
          message.error(res.errmsg)
        }
      })
    }
  }

  onSelectChange(selectedRowKeys, selectedRows) {
    selectedRowKeys = selectedRowKeys.slice(-1)
    selectedRows = [this.state.dataSource.find(item => item.id === selectedRowKeys[0])]
    if (selectedRowKeys.length !== 0) {
      fetch.get('/User/Membership/Query/Rule/Detail?membershipId=' + selectedRows[0].membershipId).then(res => {
        if (res.code === 0) {
          res.data.forEach((val, index) => {
            val.index = index + 1
          })
          this.setState({ relaDataSource: res.data, targetKeys: res.data.map(item => item.id) })
        } else {
          message.error(res.errmsg)
        }
      })
    } else {
      this.setState({ relaDataSource: [] })
    }
    this.setState({ selectedRowKeys, selectedRows })
  }

  createAddForm() {
    return [
      {
        type: '所属会籍',
        name: 'membershipId',
        rules: [{ required: true, message: '请选择所属会籍' }],
        item: (<Select style={{ width: '100%' }} placeholder='所属会籍' onChange={this.handleQueryNameChange} getPopupContainer={trigger => trigger.parentNode}>
          {
            this.state.membershipList.map(item => {
              return <Option value={item.id} key={item.id}>{item.membershipName}</Option>
            })
          }
        </Select>)
      },
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
  }

  async handleAddItem() {
    await this.setState({
      addVisible: true,
      modalTitle: '新增查询规则定义',
      currModel: 0,
    })
    this.props.form.setFieldsValue({
      membershipId: undefined,
      name: '',
      comment: '',
    })
  }

  async handleModifyItem() {
    await this.setState({
      addVisible: true,
      modalTitle: '修改查询规则定义',
      currModel: 1,
    })
    this.props.form.setFieldsValue({
      membershipId: this.state.selectedRows[0].membershipId,
      name: this.state.selectedRows[0].name,
      comment: this.state.selectedRows[0].comment,
    })
  }

  handleDelItem() {
    confirm({
      title: this.state.selectedRows[0].name ? `确定要删除${this.state.selectedRows[0].name}吗？` : '确定要删除吗?',
      content: '',
      onOk: () => {
        fetch.delete('/User/Membership/Query/Rule/' + this.state.selectedRowKeys[0]).then(res => {
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
                this.fetchQueryRule()
              })
            } else {
              this.fetchQueryRule()
            }
          } else {
            message.error(res.errmsg)
          }
          this.fetchQueryRule()
        })
      },
    })
  }

  async disableList(id) {
    await fetch.put('/User/Membership/Query/Rule/Status', { id, isEnable: 0 }).then(res => {
      if (res.code === 0) {
        message.success('停用成功')
        this.fetchQueryRule()
      } else {
        message.error(res.errmsg)
      }
    })
  }

  async enableList(id) {
    await fetch.put('/User/Membership/Query/Rule/Status', { id, isEnable: 1 }).then(res => {
      if (res.code === 0) {
        message.success('启用成功')
        this.fetchQueryRule()
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
        fetch.post('/User/Membership/Query/Rule', { ...values }).then(res => {
          if (res.code === 0) {
            message.success('新增成功')
            this.hideAddModal()
            this.fetchQueryRule()
            this.setState({
              selectedRowKeys: [],
              selectedRows: [],
            })
          } else {
            message.error(res.errmsg)
          }
        })
      } else {
        fetch.put('/User/Membership/Query/Rule', { ...values, id: this.state.selectedRowKeys[0] }).then(res => {
          if (res.code === 0) {
            message.success('修改成功')
            this.hideAddModal()
            this.fetchQueryRule()
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

  saveTrans() {
    fetch.post('/User/Membership/User/Query/Rules', { categoryIds: this.state.targetKeys, id: this.state.selectedRowKeys[0], membershipId: this.state.selectedRows[0].membershipId }).then(res => {
      if (res.code === 0) {
        message.success('修改成功')
        this.hideAddModal()
        this.fetchQueryRule()
        fetch.get('/User/Membership/Query/Rule/Detail?membershipId=' + this.state.selectedRows[0].membershipId).then(res => {
          if (res.code === 0) {
            res.data.forEach((val, index) => {
              val.index = index + 1
            })
            this.setState({ relaDataSource: res.data })
          } else {
            message.error(res.errmsg)
            this.fetchRuleDetail()
          }
        })
      } else {
        message.error(res.errmsg)
      }
      this.fetchRuleDetail()
    })
    this.setState({
      transVisible: false,
    })
  }

  handleTransItem() {
    this.setState({
      transVisible: true,
      selectedKeys: [],
    })
  }

  hideTransModal() {
    this.fetchRuleDetail()
    this.setState({
      transVisible: false,
    })
  }

  transferChange(nextTargetKeys, direction, moveKeys) {
    this.setState({ targetKeys: nextTargetKeys })
  }

  transferSelectChange(sourceSelectedKeys, targetSelectedKeys) {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] })
  }

  renderTransItem(item) {
    const customLabel = (
      <span>{item.name}</span>
    )
    return {
      label: customLabel, // for displayed item
      value: item.id, // for title and filter matching
    }
  }

  handleTableChange(pagination) {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    pager.pageSize = pagination.pageSize
    this.setState({
      pagination: pager,
      selectedRowKeys: [],
    }, () => {
      this.fetchQueryRule()
    })
  }

  render() {
    const { selectedRowKeys, relaDataSource, dataSource, pagination, transVisible, modalTitle, addVisible, ruleNoList, targetKeys, selectedKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    return <div>
      <p>查询规则定义</p>
      <div className={style['button-box']}>
        {
          this.state.jsonPower['operation_access_query_rule_insert'] ? <Button type='primary' className={style['button']} onClick={this.handleAddItem}>新增</Button> : null
        }
        {
          this.state.jsonPower['operation_access_query_rule_update'] ? <Button type='primary' className={style['button']} onClick={this.handleModifyItem} disabled={selectedRowKeys.length !== 1}>修改</Button> : null
        }
        {
          this.state.jsonPower['operation_access_query_rule_delete_logic'] ? <Button type='primary' className={style['button']} onClick={this.handleDelItem} disabled={selectedRowKeys.length !== 1}>删除</Button> : null
        }
      </div>
      <Table className={style['table']} dataSource={dataSource} rowKey='id' rowSelection={rowSelection} pagination={pagination} onChange={this.handleTableChange} bordered scroll={{ x: true }}>
        <Column title='所属会籍' dataIndex='membershipName' key='membershipName' />
        <Column title='规则编号' dataIndex='seriesNo' key='seriesNo' />
        <Column title='规则名称' dataIndex='name' key='name' />
        <Column title='备注' dataIndex='comment' key='comment' render={(text) => <span title={text} className='crm-ellips' style={{ width: '200px' }}>{text}</span>} />
        <Column title='创建人' dataIndex='creatorName' key='creatorName' />
        <Column title='最近修改人' dataIndex='updatorName' key='updatorName' />
        <Column title='修改时间' dataIndex='gmtModified' key='gmtModified'render={text => text ? moment(text).format('YYYY:MM:DD HH:mm:ss') : ''} />
        <Column title='当前状态' dataIndex='isEnable' key='isEnableState' render={text => text ? '启用' : '停用'} />
        {
          this.state.jsonPower['operation_access_query_rule_enable_or_disable'] ? <Column title='操作状态' dataIndex='isEnable' key='isEnable' render={(text, record) => text ? <Button type='danger' onClick={this.disableList.bind(null, record.id)}>停用</Button> : <Button type='primary' onClick={this.enableList.bind(null, record.id)}>启用</Button>} /> : null
        }
      </Table>
      <p>规则详细</p>
      {
        this.state.jsonPower['operation_access_query_rule_detail_insert'] ? <Button type='primary' className={style['button']} onClick={this.handleTransItem} disabled={selectedRowKeys.length !== 1}>新增</Button> : null
      }
      <Table className={style['table']} dataSource={relaDataSource} rowKey='id' bordered>
        <Column title='编号' dataIndex='index' key='index' />
        <Column title='查询字段' dataIndex='name' key='name' />
      </Table>
      <Modal
        title={modalTitle}
        visible={addVisible}
        onOk={this.addOk}
        onCancel={this.hideAddModal}
        okText='保存'
        cancelText='关闭'
      >
        <Form>
          <AddForm formEle={Form} formMethods={this.props.form} addForm={this.createAddForm()} />
        </Form>
      </Modal>
      <Modal
        title='系统分配查询字段'
        destroyOnClose
        visible={transVisible}
        onOk={this.saveTrans}
        onCancel={this.hideTransModal}
        okText='保存'
        cancelText='关闭'
      >
        <Transfer
          dataSource={ruleNoList}
          listStyle={{ width: '45%' }}
          titles={['待分配', '已分配']}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={this.transferChange}
          onSelectChange={this.transferSelectChange}
          render={this.renderTransItem}
      />
      </Modal>
    </div>
  }
}

export default Form.create()(queryRule)
