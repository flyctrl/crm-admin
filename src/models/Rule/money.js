import React, { Component } from 'react'
import { Table, Button, Modal, Form, Input, message, Select, InputNumber } from 'antd'
const { Column } = Table
const Option = Select.Option
const confirm = Modal.confirm
import AddForm from 'Components/AddForm/index'
import fetch from 'Util/fetch'
import style from './index.css'
import { transGetUrl } from 'Util/tools'
import tooler from 'Contants/tooler'

class moneyRule extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalTitle: '新增金额晋级规则',
      addVisible: false,
      currModel: 0,
      selectedRowKeys: [],
      selectedRows: [],
      membershipList: [],
      // ruleList: [],
      rangeList: [],
      levelList: [],
      dataSource: [],
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
    this.handleModifyItem = this.handleModifyItem.bind(this)
    this.handleDelItem = this.handleDelItem.bind(this)
    this.disableList = this.disableList.bind(this)
    this.enableList = this.enableList.bind(this)
    this.hideAddModal = this.hideAddModal.bind(this)
    this.addOk = this.addOk.bind(this)
    this.handleMemberChange = this.handleMemberChange.bind(this)
    this.handleTableChange = this.handleTableChange.bind(this)
  }

  componentDidMount() {
    this.fetchMoneyRule()
    fetch.get('/CRM/DictDataItems/Memberships').then(res => {
      if (res.code === 0) {
        this.setState({ membershipList: res.data })
      } else {
        message.error(res.errmsg)
      }
    })
    fetch.get('/CRM/DictData/Dict_Type_C_Cash_Upgrade_Rule_Range').then(res => {
      if (res.code === 0) {
        this.setState({ rangeList: res.data })
      } else {
        message.error(res.errmsg)
      }
    })
    // 权限控制start
    let jsonPower = tooler.authoControl()
    this.setState({ jsonPower })
    // 权限控制end

    // fetch.get('/Membership/Level/Transfers?pageNo=1&pageSize=1000').then(res => {
    //   if (res.code === 0) {
    //     this.setState({ ruleList: res.data.data })
    //   } else {
    //     message.error(res.errmsg)
    //   }
    // })
  }

  fetchLevelList(membershipId) {
    fetch.get('/CRM/DictDataItems/levelDefiItems/' + membershipId).then(res => {
      if (res.code === 0) {
        this.setState({ levelList: res.data || [] })
      } else {
        message.error(res.errmsg)
      }
    })
  }

  handleMemberChange(value) {
    this.fetchLevelList(value)
    this.props.form.setFieldsValue({
      beforeLevelId: undefined,
      afterLevelId: undefined,
    })
  }

  onSelectChange(selectedRowKeys, selectedRows) {
    selectedRowKeys = selectedRowKeys.slice(-1)
    selectedRows = [this.state.dataSource.find(item => item.id === selectedRowKeys[0])]
    this.setState({ selectedRowKeys, selectedRows })
  }

  createAddForm() {
    return [
      {
        type: '所属会籍',
        name: 'membershipId',
        rules: [{ required: true, message: '请选择所属会籍' }],
        item: (<Select style={{ width: '100%' }} placeholder='所属会籍' onChange={this.handleMemberChange} getPopupContainer={trigger => trigger.parentNode}>
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
        item: (<Input placeholder='规则名称' maxLength={20} />)
      },
      {
        type: '初始等级',
        name: 'beforeLevelId',
        rules: [{ required: true, message: '请选择初始等级' }],
        item: (<Select style={{ width: '100%' }} placeholder='初始等级' onChange={this.handleQueryNameChange} getPopupContainer={trigger => trigger.parentNode}>
          {
            this.state.levelList.map(item => {
              return <Option value={item.id} key={item.id}>{item.name}</Option>
            })
          }
        </Select>)
      },
      {
        type: '晋级等级',
        name: 'afterLevelId',
        rules: [{ required: true, message: '请选择晋级等级' }],
        item: (<Select style={{ width: '100%' }} placeholder='晋级等级' onChange={this.handleQueryNameChange} getPopupContainer={trigger => trigger.parentNode}>
          {
            this.state.levelList.map(item => {
              return <Option value={item.id} key={item.id}>{item.name}</Option>
            })
          }
        </Select>)
      },
      {
        type: '累计贡献指标',
        name: 'contribution',
        rules: [{ required: true, message: '请填写累计贡献指标' }],
        item: (<InputNumber style={{ width: '100%' }} placeholder='累计贡献指标' maxLength={9} min={0} />)
      },
      {
        type: '适用范围',
        name: 'range',
        rules: [{ required: true, message: '请选择适用范围' }],
        item: (<Select style={{ width: '100%' }} placeholder='适用范围' onChange={this.handleQueryNameChange} getPopupContainer={trigger => trigger.parentNode}>
          {
            this.state.rangeList.map(item => {
              return <Option value={item.dataItemValue} key={item.dataItemValue}>{item.dataItemTitle}</Option>
            })
          }
        </Select>)
      },
    ]
  }

  fetchMoneyRule() {
    const pager = { ...this.state.pagination }
    const getJson = { pageNo: pager.current, pageSize: pager.pageSize }
    fetch.get('/Membership/Level/Upgrade/Rules?' + transGetUrl(getJson)).then(res => {
      if (res.code === 0) {
        pager.total = res.data.records
        this.setState({
          dataSource: res.data.data,
          pagination: pager,
        })
      } else {
        message.error(res.errmsg)
      }
    })
  }

  async handleAddItem() {
    await this.setState({
      addVisible: true,
      modalTitle: '新增金额晋级规则',
      currModel: 0,
      levelList: []
    })
    this.props.form.setFieldsValue({
      membershipId: undefined,
      name: '',
      beforeLevelId: undefined,
      afterLevelId: undefined,
      contribution: '',
      range: '1',
    })
  }

  async handleModifyItem() {
    await this.setState({
      addVisible: true,
      modalTitle: '修改金额晋级规则',
      currModel: 1,
    })
    this.props.form.setFieldsValue({
      membershipId: this.state.selectedRows[0].membershipId,
      name: this.state.selectedRows[0].name,
      beforeLevelId: this.state.selectedRows[0].beforeLevelId,
      afterLevelId: this.state.selectedRows[0].afterLevelId,
      contribution: this.state.selectedRows[0].contribution,
      range: String(this.state.selectedRows[0].range),
    })
    this.fetchLevelList(this.state.selectedRows[0].membershipId)
  }

  handleDelItem() {
    confirm({
      title: this.state.selectedRows[0].name ? `确定要删除${this.state.selectedRows[0].name}吗？` : '确定要删除吗?',
      content: '',
      onOk: () => {
        fetch.delete('/Membership/Level/Upgrade/Rule/' + this.state.selectedRowKeys[0]).then(res => {
          if (res.code === 0) {
            message.success('删除成功')
            this.setState({
              selectedRowKeys: [],
              selectedRows: [],
            })
            if (this.state.dataSource.length === 1 && this.state.pagination.current > 1) {
              const pagination = this.state.pagination
              pagination.current--
              this.setState({
                pagination
              }, () => {
                this.fetchMoneyRule()
              })
            } else {
              this.fetchMoneyRule()
            }
          } else {
            message.error(res.errmsg)
          }
          this.fetchMoneyRule()
        })
      },
    })
  }

  hideAddModal() {
    this.setState({
      addVisible: false,
    })
  }

  async disableList(id) {
    let { dataSource } = this.state
    await fetch.put('/Membership/EnableOrDisable', { id, isEnable: 0 }).then(res => {
      if (res.code === 0) {
        message.success('停用成功')
        dataSource = dataSource.map(item => {
          if (item.id === id) {
            item.isEnable = 0
          }
          return item
        })
        this.setState({ dataSource })
      } else {
        message.error(res.errmsg)
      }
    })
  }

  async enableList(id) {
    let { dataSource } = this.state
    await fetch.put('/Membership/EnableOrDisable', { id, isEnable: 1 }).then(res => {
      if (res.code === 0) {
        message.success('启用成功')
        dataSource = dataSource.map(item => {
          if (item.id === id) {
            item.isEnable = 1
          }
          return item
        })
        this.setState({ dataSource })
      } else {
        message.error(res.errmsg)
      }
    })
  }

  async addOk(e) {
    e.preventDefault()
    await this.props.form.validateFields((err, values) => {
      if (!(/^[\+\-]?(([1-9]\d*)|\d)$/).test(String(values.contribution))) {
        message.error('累计贡献指标只能是自然数')
        return
      }
      if (err) return
      values = tooler.jsonTrim(values)
      if (!this.state.currModel) {
        fetch.post('/Membership/Level/Upgrade/Rule', { ...values }).then(res => {
          if (res.code === 0) {
            message.success('新增成功')
            this.hideAddModal()
            this.fetchMoneyRule()
            this.setState({
              selectedRowKeys: [],
              selectedRows: [],
            })
          } else {
            message.error(res.errmsg)
          }
        })
      } else {
        fetch.put('/Membership/Level/Upgrade/Rule', { ...values, id: this.state.selectedRowKeys[0] }).then(res => {
          if (res.code === 0) {
            message.success('修改成功')
            this.hideAddModal()
            this.fetchMoneyRule()
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

  handleTableChange(pagination) {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    pager.pageSize = pagination.pageSize
    this.setState({
      pagination: pager,
      selectedRowKeys: []
    }, () => {
      this.fetchMoneyRule()
    })
  }

  render() {
    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    return <div>
      <p>金额晋级规则</p>
      <div className={style['button-box']}>
        {
          this.state.jsonPower['operation_rule_money_rise_insert'] ? <Button type='primary' className={style['button']} onClick={this.handleAddItem}>新增</Button> : null
        }
        {
          this.state.jsonPower['operation_rule_money_rise_update'] ? <Button type='primary' className={style['button']} onClick={this.handleModifyItem} disabled={selectedRowKeys.length !== 1}>修改</Button> : null
        }
        {
          this.state.jsonPower['operation_rule_money_rise_delete_logic'] ? <Button type='primary' className={style['button']} onClick={this.handleDelItem} disabled={selectedRowKeys.length !== 1}>删除</Button> : null
        }
      </div>
      <Table className={style['table']} dataSource={this.state.dataSource} rowKey='id' rowSelection={rowSelection} pagination={this.state.pagination} onChange={this.handleTableChange} bordered scroll={{ x: true }}>
        <Column title='所属会籍' dataIndex='membershipName' key='membershipName' className='align-center' />
        <Column title='规则编号' dataIndex='seriesNo' key='seriesNo' className='align-center' />
        <Column title='规则名称' dataIndex='name' key='name' className='align-center' />
        <Column title='初始等级' dataIndex='beforeLevelName' key='beforeLevelName' className='align-center' />
        <Column title='晋级等级' dataIndex='afterLevelName' key='afterLevelName' className='align-center' />
        <Column title='累计贡献指标' dataIndex='contribution' key='contribution' className='align-center' />
        <Column title='适用范围' dataIndex='rangeName' key='rangeName' className='align-center' />
        <Column title='当前状态' dataIndex='isEnable' key='isEnableState' className='align-center' render={text => text ? '启用' : '停用'} />
        {
          this.state.jsonPower['operation_rule_money_rise_enable_or_disable'] ? <Column title='操作状态' dataIndex='isEnable' key='isEnable' className='align-center' render={(text, record) => text ? <Button type='danger' onClick={this.disableList.bind(null, record.id)}>停用</Button> : <Button type='primary' onClick={this.enableList.bind(null, record.id)}>启用</Button>} /> : null
        }
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
          <AddForm formEle={Form} formMethods={this.props.form} addForm={this.createAddForm()} />
        </Form>
      </Modal>
    </div>
  }
}

export default Form.create()(moneyRule)
