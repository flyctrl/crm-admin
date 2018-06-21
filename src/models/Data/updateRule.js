import React, { Component } from 'react'
import { Table, Button, Modal, Form, Transfer, message, Select } from 'antd'

const Option = Select.Option
const confirm = Modal.confirm
import api from 'Contants/api'
import fetch from 'Util/fetch'
import AddForm from 'Components/AddForm/index'
import style from './index.css'
import moment from 'moment'
import { transGetUrl } from 'Util/tools'
import tooler from 'Contants/tooler'

class updateRule extends Component {
  constructor(props) {
    super(props)
    this.state = {
      transferData: [],
      oldTargetKeys: [],
      targetKeys: [],
      selectedKeys: [],
      targetColumns: [], // 定义的表头字典
      addColumns: [], // table组件动态表头配置
      modalTitle: '新增更新规则定义',
      currModel: 0, // 0:新增 1:修改
      addVisible: false,
      transVisible: false,
      selectedRowKeys: [],
      selectedRows: [],
      dataSource: [],
      membershipList: [],
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
    this.hideAddModal = this.hideAddModal.bind(this)
    this.addOk = this.addOk.bind(this)
    this.handleTransItem = this.handleTransItem.bind(this)
    this.hideTransModal = this.hideTransModal.bind(this)
    this.transferChange = this.transferChange.bind(this)
    this.transferSelectChange = this.transferSelectChange.bind(this)
    this.handleTableChange = this.handleTableChange.bind(this)
    this.transOk = this.transOk.bind(this)
  }

  async componentDidMount() {
    const data = await api.data.updateRule.columnsAll() || [] // 纵列表头字典
    const transferData = data.map(item => {
      return {
        key: item.columnId,
        title: item.columnName,
      }
    })
    this.setState({ transferData }, () => {
      this._updateColumns()
      this.fetchUpdateRule()
    })
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

  async _updateColumns() {
    const { transferData } = this.state
    const targetColumns = await api.data.updateRule.columnsUpdate() || [] // 配置纵列表头字典
    const targetKeys = targetColumns.map(item => item.columnId)
    const addColumns = targetKeys.map(key => {
      for (let item in transferData) {
        if (transferData[item].key === key) {
          transferData[item].disabled = true
          return {
            ...transferData[item], dataIndex: key, className: 'align-center',
            render: text => this.transPriority(text)
          }
        }
      }
    })
    this.setState({ targetColumns, oldTargetKeys: [...targetKeys], targetKeys, addColumns })
  }

  fetchUpdateRule() {
    const pager = { ...this.state.pagination }
    const getJson = { pageNo: pager.current, pageSize: pager.pageSize }
    fetch.get('/Update/Priority/Membership/Priorities?' + transGetUrl(getJson)).then(res => {
      if (res.code === 0) {
        pager.total = res.data.records
        let datas = []
        if (res.data.data) {
          datas = res.data.data.map(item => {
            const temp = { ...item }
            item.columns.map(items => {
              temp[items.columnId] = items.priority
            })
            return temp
          })
        }
        this.setState({
          dataSource: datas,
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
      modalTitle: '新增更新规则定义',
      currModel: 0,
    })
    const setValues = { membershipId: undefined }
    this.state.targetKeys.forEach(item => {
      setValues[item] = 3
    })
    this.props.form.setFieldsValue(setValues)
  }

  async handleModifyItem() {
    await this.setState({
      addVisible: true,
      modalTitle: '修改更新规则定义',
      currModel: 1,
    })
    const setValues = { membershipId: this.state.selectedRows[0].membershipId }
    this.state.targetKeys.forEach(item => {
      setValues[item] = this.state.selectedRows[0][item]
    })
    this.props.form.setFieldsValue(setValues)
  }

  handleDelItem() {
    confirm({
      title: this.state.selectedRows[0].membershipName ? `确定要删除${this.state.selectedRows[0].membershipName}吗？` : '确定要删除吗?',
      content: '',
      onOk: () => {
        fetch.delete('/Update/Priority/Membership/Priorities/' + this.state.selectedRows[0].membershipId).then(res => {
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
                this.fetchUpdateRule()
              })
            } else {
              this.fetchUpdateRule()
            }
          } else {
            message.error(res.errmsg)
          }
          this.fetchUpdateRule()
        })
      },
    })
  }

  hideAddModal() {
    this.setState({
      addVisible: false,
    })
  }

  async transOk() {
    const data = await api.data.updateRule.columnsSave({ columnId: this.state.targetKeys })
    data && this.setState({
      transVisible: false,
    }, () => {
      this._updateColumns()
      this.fetchUpdateRule()
      this.setState({
        selectedRowKeys: [],
        selectedRows: [],
      })
    })
  }

  async addOk(e) {
    e.preventDefault()
    await this.props.form.validateFields((err, values) => {
      if (err) return
      const params = {
        membershipId: '',
        columns: []
      }
      for (let key in values) {
        if (key === 'membershipId') {
          params[key] = values[key]
        } else {
          params.columns.push({
            columnId: key,
            priority: values[key]
          })
        }
      }
      if (!this.state.currModel) {
        fetch.post('/Update/Priority/Membership/Priorities', params).then(res => {
          if (res.code === 0) {
            message.success(res.errmsg)
            this.hideAddModal()
            this.fetchUpdateRule()
            this.setState({
              selectedRowKeys: [],
              selectedRows: [],
            })
          } else {
            message.error(res.errmsg)
          }
        })
      } else {
        fetch.put('/Update/Priority/Membership/Priorities', {
          ...params,
          oldMembershipId: this.state.selectedRows[0].membershipId
        }).then(res => {
          if (res.code === 0) {
            message.success('修改成功')
            this.hideAddModal()
            this.fetchUpdateRule()
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

  async handleTransItem() {
    this.setState({
      transVisible: true,
    })
  }

  hideTransModal() {
    this.setState({
      transVisible: false,
      targetKeys: [...this.state.oldTargetKeys],
      selectedKeys: []
    })
  }

  onSelectChange(selectedRowKeys, selectedRows) {
    selectedRowKeys = selectedRowKeys.slice(-1)
    selectedRows = [this.state.dataSource.find(item => item.membershipId === selectedRowKeys[0])]
    this.setState({ selectedRowKeys, selectedRows })
  }

  createAddForm() {
    return [
      {
        type: '所属会籍',
        name: 'membershipId',
        rules: [{ required: true, message: '请选择所属会籍' }],
        item: (<Select style={{ width: '100%' }} placeholder='所属会籍' onChange={this.handleQueryNameChange}
                       getPopupContainer={trigger => trigger.parentNode}>
          {
            this.state.membershipList.map(item => {
              return <Option value={item.id} key={item.id}>{item.membershipName}</Option>
            })
          }
        </Select>)
      },
      ...this.state.targetColumns.map(item => ({
        type: item.columnName,
        name: item.columnId + '',
        rules: [{ required: true, message: `请选择${item.columnName}` }],
        item: (<Select style={{ width: '100%' }} placeholder={item.columnName} onChange={this.handleQueryNameChange}
                       getPopupContainer={trigger => trigger.parentNode}>
          <Option value={3} key={3}>低</Option>
          <Option value={2} key={2}>中</Option>
          <Option value={1} key={1}>高</Option>
        </Select>)
      }))
    ]
  }

  transferChange(nextTargetKeys) {
    this.setState({ targetKeys: nextTargetKeys })
  }

  transferSelectChange(sourceSelectedKeys, targetSelectedKeys) {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] })
  }

  transPriority(num) {
    switch (num) {
      case 1:
        return '高'
      case 2:
        return '中'
      case 3:
        return '低'
      default:
        return '--'
    }
  }

  handleTableChange(pagination) {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    pager.pageSize = pagination.pageSize
    this.setState({
      pagination: pager,
      selectedRowKeys: []
    }, () => {
      this.fetchUpdateRule()
    })
  }

  render() {
    const { selectedRowKeys, addColumns } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const columns = [
      {
        title: '所属会籍',
        dataIndex: 'membershipName',
        key: 'membershipName',
        className: 'align-center',
      },
      ...addColumns,
      {
        title: '创建人',
        dataIndex: 'createByName',
        key: 'createByName',
        className: 'align-center',
      },
      {
        title: '最近修改人',
        dataIndex: 'modifiedByName',
        key: 'modifiedByName',
        className: 'align-center',
      },
      {
        title: '修改时间',
        dataIndex: 'modifyTime',
        key: 'modifyTime',
        className: 'align-center',
        render: text => text ? moment(text).format('YYYY:MM:DD HH:mm:ss') : ''
      }
    ]
    return <div>
      <p>更新规则定义</p>
      <div className={style['button-box']}>
        {
          this.state.jsonPower['operation_mams_update_rule_defi'] ? <Button type='primary' className={style['button']} onClick={this.handleTransItem}>定义</Button> : null
        }
        {
          this.state.jsonPower['operation_mams_update_rule_insert'] ? <Button type='primary' className={style['button']} onClick={this.handleAddItem}>新增</Button> : null
        }
        {
          this.state.jsonPower['operation_mams_update_rule_update'] ? <Button type='primary' className={style['button']} onClick={this.handleModifyItem} disabled={selectedRowKeys.length !== 1}>修改</Button> : null
        }
        {
          this.state.jsonPower['operation_mams_update_rule_delete_logic'] ? <Button type='primary' className={style['button']} onClick={this.handleDelItem} disabled={selectedRowKeys.length !== 1}>删除</Button> : null
        }
      </div>
      <Table scroll={{ x: true }} className={style['table']} dataSource={this.state.dataSource} rowKey='membershipId'
             rowSelection={rowSelection}
             pagination={this.state.pagination} onChange={this.handleTableChange} bordered columns={columns}/>
      <Modal
        title={this.state.modalTitle}
        visible={this.state.addVisible}
        onOk={this.addOk}
        onCancel={this.hideAddModal}
        okText='保存'
        cancelText='关闭'
      >
        <Form>
          <AddForm formEle={Form} formMethods={this.props.form} addForm={this.createAddForm()}/>
        </Form>
      </Modal>
      <Modal
        title='更新数据配置'
        destroyOnClose
        visible={this.state.transVisible}
        onOk={this.transOk}
        onCancel={this.hideTransModal}
        okText='保存'
        cancelText='关闭'
      >
        <Transfer
          titles={['待分配', '已分配']}
          dataSource={this.state.transferData}
          targetKeys={this.state.targetKeys}
          selectedKeys={this.state.selectedKeys}
          onChange={this.transferChange}
          onSelectChange={this.transferSelectChange}
          render={item => item.title}
        />
      </Modal>
    </div>
  }
}

export default Form.create()(updateRule)
