import React, { Component } from 'react'
import { Table, Button, Modal, Input, Form, InputNumber, Select, DatePicker } from 'antd'

const Option = Select.Option
const confirm = Modal.confirm
import AddForm from 'Components/AddForm/index'
import style from './index.css'
import tooler from 'Contants/tooler'
import moment from 'moment'
import api from 'Contants/api'

class levelRule extends Component {
  constructor(props) {
    super(props)
    this.state = {
      addVisible: false,
      selectedRowKeys: [],
      selectedRows: [],
      tableData: [],
      membershipList: [], // 会籍字典
      plateforms: [], // 平台字典
      jsonPower: tooler.authoControl()
    }
    this.onSelectChange = this.onSelectChange.bind(this)
    this.showAddModal = this.showAddModal.bind(this)
    this.handleDel = this.handleDel.bind(this)
    this.hideAddModal = this.hideAddModal.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleTableChange = this.handleTableChange.bind(this)
    this.handlePlateformChange = this.handlePlateformChange.bind(this)
  }

  componentDidMount() {
    (async () => {
      const plateforms = await api.dictData.plateforms() || []
      this.setState({ plateforms })
    })()
    this.handleTableChange({})
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        values.validTime = values.validTime.format('X') + '000'
        const data = await api.data.rule.level.add(tooler.jsonTrim(values))
        if (data) {
          this.hideAddModal()
          this.handleTableChange({})
        }
      }
    })
  }

  async handleTableChange({ current = 1, pageSize = 10 }) {
    const tableData = await api.data.rule.level.list({ pageNo: current, pageSize }) || {}
    this.setState({
      tableData,
      selectedRowKeys: [],
      selectedRows: [],
    })
  }

  handleDel() {
    confirm({
      title: `确定要删除${this.state.selectedRows[0].crossRuleName || ''}吗？`,
      content: '',
      onOk: async () => {
        await api.data.rule.level.del(this.state.selectedRows[0].id)
        this.handleTableChange({})
        this.setState({
          selectedRowKeys: [],
          selectedRows: [],
        })
      }
    })
  }
  async handlePlateformChange(id) {
    const membershipList = await api.data.rule.level.linkMemberShips(id) || []
    this.props.form.resetFields(['membershipId'])
    this.setState({ membershipList })
  }
  onSelectChange(selectedRowKeys, selectedRows) {
    selectedRowKeys = selectedRowKeys.slice(-1)
    selectedRows = [(this.state.tableData.data || []).find(item => item.id === selectedRowKeys[0])]
    this.setState({ selectedRowKeys, selectedRows })
  }

  showAddModal() {
    this.setState({
      selectedRowKeys: [],
      selectedRows: [],
      membershipList: []
    })
    this.setState({
      addVisible: true,
      modalTitle: '新增跨会籍折算规则',
      currModel: 0,
    }, () => {
      this.props.form.resetFields()
    })
  }

  hideAddModal() {
    this.setState({
      addVisible: false,
    })
  }

  render() {
    const { selectedRowKeys, tableData, addVisible, jsonPower } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const addForm = [
      {
        type: '规则名称',
        name: 'crossRuleName',
        rules: [{ required: true, message: '请填写规则名称' }],
        item: (<Input style={{ width: '100%' }} placeholder='规则名称' maxLength={9}/>)
      },
      {
        type: '平台名称',
        name: 'plateformId',
        rules: [{ required: true, message: '请选择平台名称' }],
        item: (<Select style={{ width: '100%' }} placeholder='平台名称' getPopupContainer={trigger => trigger.parentNode} onChange={this.handlePlateformChange}
                       disabled={this.state.currModel === 1}>
          {
            this.state.plateforms.map(item => {
              return <Option value={item.id} key={item.id}>{item.plateformName}</Option>
            })
          }
        </Select>)
      },
      {
        type: '平台数值',
        name: 'plateformRate',
        rules: [{ required: true, message: '请填写金诚会籍数值(正整数)', pattern: /^\d*$/ }],
        item: (<InputNumber style={{ width: '100%' }} placeholder='金诚会籍数值' maxLength={10} min={1}/>)
      },
      {
        type: '会籍名称',
        name: 'membershipId',
        rules: [{ required: true, message: '请选择会籍名称' }],
        item: (<Select style={{ width: '100%' }} placeholder='会籍名称' getPopupContainer={trigger => trigger.parentNode}
                       disabled={this.state.currModel === 1}>
          {
            this.state.membershipList.map(item => {
              return <Option value={item.id} key={item.id}>{item.membershipName}</Option>
            })
          }
        </Select>)
      },
      {
        type: '本会籍数值',
        name: 'originRate',
        rules: [{ required: true, message: '请填写本会籍数值(正整数)', pattern: /^\d*$/ }],
        item: (<InputNumber style={{ width: '100%' }} placeholder='本会籍数值' maxLength={10} min={1}/>)
      },
      {
        type: '生效时间',
        name: 'validTime',
        item: (
          <DatePicker style={{ width: '100%' }} disabledDate={current => current && current < moment().startOf('day')} showTime format='YYYY-MM-DD HH:mm:ss'/>),
        rules: [{ required: true, message: '请输入生效时间' }],
      },
    ]
    const columns = [
      {
        title: '规则编号',
        dataIndex: 'crossRuleNo',
        key: 'crossRuleNo',
      },
      {
        title: '规则名称',
        dataIndex: 'crossRuleName',
        key: 'crossRuleName',
      },
      {
        title: '会籍/产业',
        dataIndex: 'membershipName',
        key: 'membershipName',
      },
      {
        title: '本会籍数值',
        dataIndex: 'originRate',
        key: 'originRate',
      },
      {
        title: '平台名称',
        dataIndex: 'plateformName',
        key: 'plateformName',
      },
      {
        title: '平台数值',
        dataIndex: 'plateformRate',
        key: 'plateformRate',
      },
      {
        title: '状态',
        dataIndex: 'showStatus',
        key: 'showStatus',
        render: text => text && ['', '失效', '生效', '未生效'][text]
      },
      {
        title: '生效时间',
        dataIndex: 'validTime',
        key: 'validTime',
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
      }
    ]
    return <div>
      <p>跨会籍折算规则</p>
      <div className={style['button-box']}>
        {
          jsonPower['opertion_rule_cross_membership_insert'] ? <Button type='primary' className={style['button']} onClick={this.showAddModal}>新增</Button> : null
        }
        {
          jsonPower['opertion_rule_cross_membership_delete_logic'] ? <Button type='primary' className={style['button']} onClick={this.handleDel}
                    disabled={selectedRowKeys.length !== 1}>删除</Button> : null
        }
      </div>
      <Table className={style['table']} dataSource={tableData.data} rowKey='id' rowSelection={rowSelection}
             rowClassName={record => record.showStatus === 1 ? 'gray' : ''}
             pagination={{
               pageSize: tableData.pageSize,
               current: tableData.pageNo,
               total: tableData.records,
               showSizeChanger: true,
               pageSizeOptions: ['10', '20', '50', '100']
             }} onChange={this.handleTableChange} bordered scroll={{ x: true }}
             columns={columns}>
      </Table>
      <Modal
        title='新增跨会籍折算规则'
        visible={addVisible}
        onOk={this.handleSubmit}
        onCancel={this.hideAddModal}
        okText='保存'
        cancelText='关闭'
      >
        <Form>
          <AddForm formEle={Form} formMethods={this.props.form} addForm={addForm}/>
        </Form>
      </Modal>
    </div>
  }
}

export default Form.create()(levelRule)
