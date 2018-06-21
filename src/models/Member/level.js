import React, { Component } from 'react'
import { Table, Button, Modal, Form, Input, message, Select } from 'antd'
const { Column } = Table
const Option = Select.Option
const confirm = Modal.confirm
import AddForm from 'Components/AddForm/index'
import { transGetUrl } from 'Util/tools'
import tooler from 'Contants/tooler'
import fetch from 'Util/fetch'
import style from './level.css'
import moment from 'moment'

class memberLevel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalTitle: '新增用户等级定义',
      addVisible: false,
      membershipList: [],
      selectedRowKeys: [],
      selectedRows: [],
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
    this.handleAddItem = this.handleAddItem.bind(this)
    this.hideAddModal = this.hideAddModal.bind(this)
    this.handleModifyItem = this.handleModifyItem.bind(this)
    this.addOk = this.addOk.bind(this)
    this.disableList = this.disableList.bind(this)
    this.enableList = this.enableList.bind(this)
    this.onSelectChange = this.onSelectChange.bind(this)
    this.handleDelItem = this.handleDelItem.bind(this)
    this.handleTableChange = this.handleTableChange.bind(this)
  }

  componentDidMount() {
    this.fetchUserLevel()
    fetch.get('/CRM/DictDataItems/Memberships').then(res => {
      if (res.code === 0) {
        this.setState({ membershipList: res.data })
      } else {
        message.error(res.errmsg)
      }
    })
    // 权限控制start
    let jsonPower = tooler.authoControl()
    this.setState({ jsonPower })
    // 权限控制end
  }

  fetchUserLevel() {
    const pager = { ...this.state.pagination }
    const getJson = { pageNo: pager.current, pageSize: pager.pageSize }
    fetch.get('/Membership/Level/Upgrade/Rule/Priorities?' + transGetUrl(getJson)).then(res => {
      if (res.code === 0) {
        pager.total = res.data.total
        this.setState({
          dataSource: res.data.datas,
          pagination: pager,
        })
      } else {
        message.error(res.errmsg)
      }
    })
  }

  onSelectChange(selectedRowKeys, selectedRows) {
    selectedRowKeys = selectedRowKeys.slice(-1)
    selectedRows = [this.state.dataSource.find(item => item.id === selectedRowKeys[0])]
    this.setState({ selectedRowKeys, selectedRows })
  }

  async handleAddItem() {
    await this.setState({
      addVisible: true,
      modalTitle: '新增用户等级定义',
      currModel: 0,
    })
    this.props.form.setFieldsValue({
      priority: undefined,
      membershipId: undefined,
      name: '',
    })
  }

  async handleModifyItem() {
    await this.setState({
      addVisible: true,
      modalTitle: '修改用户等级定义',
      currModel: 1,
    })
    this.props.form.setFieldsValue({
      priority: this.state.selectedRows[0].priority,
      membershipId: this.state.selectedRows[0].membershipId,
      name: this.state.selectedRows[0].name,
    })
  }

  handleDelItem() {
    confirm({
      title: this.state.selectedRows[0].name ? `确定要删除${this.state.selectedRows[0].name}吗？` : '确定要删除吗?',
      content: '',
      onOk: () => {
        fetch.delete('/Membership/Level/Upgrade/Rule/Priority/' + this.state.selectedRowKeys[0]).then(res => {
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
                this.fetchUserLevel()
              })
            } else {
              this.fetchUserLevel()
            }
          } else {
            message.error(res.errmsg)
          }
          this.fetchUserLevel()
        })
      },
    })
  }

  async disableList(id) {
    await fetch.put('/Membership/Level/Upgrade/Rule/Priority/Status', { id, isEnable: 0 }).then(res => {
      if (res.code === 0) {
        message.success('停用成功')
        this.fetchUserLevel()
      } else {
        message.error(res.errmsg)
      }
    })
  }

  async enableList(id) {
    await fetch.put('/Membership/Level/Upgrade/Rule/Priority/Status', { id, isEnable: 1 }).then(res => {
      if (res.code === 0) {
        message.success('启用成功')
        this.fetchUserLevel()
      } else {
        message.error(res.errmsg)
      }
    })
  }

  createAddForm() {
    return [
      {
        type: '会籍',
        name: 'membershipId',
        rules: [{ required: true, message: '请选择会籍' }],
        item: (<Select style={{ width: '100%' }} placeholder='所属会籍' onChange={this.handleQueryNameChange} getPopupContainer={trigger => trigger.parentNode}>
          {
            this.state.membershipList.map(item => {
              return <Option value={item.id} key={item.id}>{item.membershipName}</Option>
            })
          }
        </Select>)
      },
      {
        type: '等级优先级',
        name: 'priority',
        rules: [{ required: true, message: '请选择等级优先级' }],
        item: (<Select style={{ width: '100%' }} placeholder='等级优先级' onChange={this.handleQueryNameChange} getPopupContainer={trigger => trigger.parentNode}>
          {
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => {
              return <Option value={item} key={item}>{item}</Option>
            })
          }
        </Select>)
      },
      {
        type: '等级名称	',
        name: 'name',
        rules: [{ required: true, message: '请填写等级名称' }],
        item: (<Input placeholder='等级名称' maxLength={20} />)
      },
    ]
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
        fetch.post('/Membership/Level/Upgrade/Rule/Priority', { ...values }).then(res => {
          if (res.code === 0) {
            message.success('新增成功')
            this.hideAddModal()
            this.fetchUserLevel()
            this.setState({
              selectedRowKeys: [],
              selectedRows: [],
            })
          } else {
            message.error(res.errmsg)
          }
        })
      } else {
        fetch.put('/Membership/Level/Upgrade/Rule/Priority', { ...values, id: this.state.selectedRowKeys[0] }).then(res => {
          if (res.code === 0) {
            message.success('修改成功')
            this.hideAddModal()
            this.fetchUserLevel()
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
      this.fetchUserLevel()
    })
  }

  render() {
    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    return <div>
      <p>用户等级定义</p>
      <div className={style['button-box']}>
        {
          this.state.jsonPower['operation_manage_level_defi_insert'] ? <Button type='primary' className={style['button']} onClick={this.handleAddItem}>新增</Button> : null
        }
        {
          this.state.jsonPower['operation_manage_level_defi_update'] ? <Button type='primary' className={style['button']} onClick={this.handleModifyItem} disabled={selectedRowKeys.length !== 1}>修改</Button> : null
        }
        {
          this.state.jsonPower['operation_manage_level_defi_delete_logic'] ? <Button type='primary' className={style['button']} onClick={this.handleDelItem} disabled={selectedRowKeys.length !== 1}>删除</Button> : null
        }
      </div>
      <Table className={style['table']} dataSource={this.state.dataSource} rowKey='id' rowSelection={rowSelection} pagination={this.state.pagination} onChange={this.handleTableChange} bordered scroll={{ x: true }}>
        <Column title='等级优先级' dataIndex='priority' key='priority' className='align-center' />
        <Column title='会籍' dataIndex='membershipName' key='membershipName' className='align-center' />
        <Column title='等级名称' dataIndex='name' key='name' className='align-center' />
        <Column title='创建时间' dataIndex='gmtCreated' key='gmtCreated' className='align-center' render={text => text ? moment(text).format('YYYY:MM:DD HH:mm:ss') : ''} />
        <Column title='当前状态' dataIndex='isEnable' key='isEnableState' className='align-center' render={text => text ? '启用' : '停用'} />
        {
          this.state.jsonPower['operation_manage_level_defi_enbale_or_disable'] ? <Column title='操作状态' dataIndex='isEnable' key='isEnable' className='align-center' render={(text, record) => text ? <Button type='danger' onClick={this.disableList.bind(null, record.id)}>停用</Button> : <Button type='primary' onClick={this.enableList.bind(null, record.id)}>启用</Button>} /> : null
        }
        <Column title='创建人' dataIndex='creator' key='creator' className='align-center' />
        <Column title='最后修改人' dataIndex='updator' key='updator' className='align-center' />
        <Column title='最后修改时间' dataIndex='gmtModified' key='gmtModified' className='align-center' render={text => text ? moment(text).format('YYYY:MM:DD HH:mm:ss') : ''} />
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

export default Form.create()(memberLevel)
