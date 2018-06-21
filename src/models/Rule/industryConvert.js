/**
 * @Author: sunshiqiang
 * @Date: 2018-05-08 15:45:15
 * @Title: 跨平台折算规则
 */

import React, { Component } from 'react'
import { Form, Table, Button, Modal, Input, InputNumber, DatePicker, Select } from 'antd'
import style from './index.css'
import tooler from 'Contants/tooler'
import moment from 'moment'
import api from 'Contants/api'

const FormItem = Form.Item
const confirm = Modal.confirm
const Option = Select.Option

class industryConvert extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      plateforms: [], // 平台字典
      jsonPower: tooler.authoControl(),
      addVisible: false,
      tableData: [],
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleTableChange = this.handleTableChange.bind(this)
    this.handleShowModal = this.handleShowModal.bind(this)
    this.handleHideModal = this.handleHideModal.bind(this)
    this.handleDel = this.handleDel.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
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
        const data = await api.data.rule.industryConvert.add(tooler.jsonTrim(values))
        if (data) {
          this.handleHideModal()
          this.handleTableChange({})
        }
      }
    })
  }

  async handleTableChange({ current = 1, pageSize = 10 }) {
    const tableData = await api.data.rule.industryConvert.list({ pageNo: current, pageSize }) || {}
    this.setState({
      tableData,
      selectedRowKeys: [],
      selectedRows: [],
    })
  }

  handleDel() {
    confirm({
      title: `确定要删除${this.state.selectedRows[0].crossPlateformRuleName || ''}吗？`,
      content: '',
      onOk: async () => {
        await api.data.rule.industryConvert.del(this.state.selectedRows[0].id)
        this.handleTableChange({})
        this.setState({
          selectedRowKeys: [],
          selectedRows: [],
        })
      }
    })
  }

  handleShowModal() {
    this.setState({
      selectedRowKeys: [],
      selectedRows: [],
    })
    this.setState({
      addVisible: true,
    }, () => {
      this.props.form.resetFields()
    })
  }

  handleHideModal() {
    this.setState({
      addVisible: false
    })
  }

  handleSelectChange(selectedRowKeys, selectedRows) {
    selectedRowKeys = selectedRowKeys.slice(-1)
    selectedRows = [(this.state.tableData.data || []).find(item => item.id === selectedRowKeys[0])]
    this.setState({ selectedRowKeys, selectedRows })
  }

  render() {
    const { selectedRowKeys, jsonPower, addVisible, tableData, plateforms } = this.state
    const { getFieldDecorator } = this.props.form
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleSelectChange,
    }
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    }
    const columns = [
      {
        title: '规则编号',
        dataIndex: 'crossPlateformRuleNo',
        key: 'crossPlateformRuleNo',
      },
      {
        title: '规则名称',
        dataIndex: 'crossPlateformRuleName',
        key: 'crossPlateformRuleName',
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
        title: '金诚会籍数值',
        dataIndex: 'jcRate',
        key: 'jcRate',
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
      <p>跨平台折算规则</p>
      <div className={style['button-box']}>
        {jsonPower['opertion_rule_plateform_insert'] ? <Button type='primary' className={style['button']}
                                  onClick={this.handleShowModal}>新增</Button> : null}
        {jsonPower['opertion_rule_plateform_delete_logic'] ? <Button type='primary' className={style['button']} onClick={this.handleDel}
                                  disabled={selectedRowKeys.length !== 1}>删除</Button> : null}
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
        title='新增跨平台折算规则'
        visible={addVisible}
        onOk={this.handleSubmit}
        onCancel={this.handleHideModal}
        okText='保存'
        cancelText='关闭'
      >
        <Form>
          <FormItem label='规则名称'
                    {...formItemLayout}>
            {getFieldDecorator('crossPlateformRuleName', {
              rules: [{ required: true, message: '规则名称' }]
            })(
              <Input
                placeholder='跨平台会籍规则名称'
                maxLength={10}
              />
            )}
          </FormItem>
          <FormItem label='平台名称'
                    {...formItemLayout}>
            {getFieldDecorator('plateformId', {
              rules: [{ required: true, message: '请输入平台数值' }]
            })(<Select style={{ width: '100%' }} placeholder='会籍名称' getPopupContainer={trigger => trigger.parentNode}
                       disabled={status === 'update'}>
              {plateforms.map(item => {
                return <Option value={item.id} key={item.id}>{item.plateformName}</Option>
              })}
            </Select>)}
          </FormItem>
          <FormItem label='平台数值'
                    {...formItemLayout}>
            {getFieldDecorator('plateformRate', {
              rules: [{ required: true, message: '请输入平台数值(正整数)', pattern: /^\d*$/ }]
            })(
              <InputNumber
                style={{ width: '100%' }}
                placeholder='平台数值'
                maxLength={10}
                min={1}
              />
            )}
          </FormItem>
          <FormItem label='金诚会籍数值'
                    {...formItemLayout}>
            {getFieldDecorator('jcRate', {
              rules: [{ required: true, message: '请输入金诚集团会籍数值(正整数)', pattern: /^\d*$/ }]
            })(
              <InputNumber
                style={{ width: '100%' }}
                placeholder='金诚集团会籍数值'
                maxLength={10}
                min={1}
              />
            )}
          </FormItem>
          <FormItem label='生效时间'
                    {...formItemLayout}>
            {getFieldDecorator('validTime', {
              rules: [{ required: true, message: '请输入生效时间' }]
            })(
              <DatePicker style={{ width: '100%' }} disabledDate={current => current && current < moment().startOf('day')} showTime format='YYYY-MM-DD HH:mm:ss'/>
            )}
          </FormItem>
        </Form>
      </Modal>
    </div>
  }
}

export default Form.create()(industryConvert)

