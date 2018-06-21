/**
 * @Author: sunshiqiang
 * @Date: 2018-05-08 14:29:26
 * @Title: 渠道标识管理
 */

import React, { Component } from 'react'
import { Form, Table, Button, Modal, Input, Select } from 'antd'
import style from './index.css'
import tooler from 'Contants/tooler'
import moment from 'moment'
import api from 'Contants/api'

const FormItem = Form.Item
const confirm = Modal.confirm
const Option = Select.Option

class ChannelIdentification extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      plateforms: [], // 平台字典
      jsonPower: tooler.authoControl(),
      addVisible: false,
      tableData: {},
      initialValues: {},
      status: ''
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
        values = this.state.status === 'add' ? values : { ...values, id: this.state.selectedRows[0].id }
        const data = await api.data.channelIdentification[this.state.status](tooler.jsonTrim(values))
        if (data) {
          this.setState({
            selectedRowKeys: [],
            selectedRows: [],
          })
          this.handleHideModal()
          this.handleTableChange({})
        }
      }
    })
  }

  async handleTableChange({ current = 1, pageSize = 10 }) {
    const tableData = await api.data.channelIdentification.list({ pageNo: current, pageSize }) || {}
    this.setState({
      selectedRowKeys: [],
      selectedRows: [],
      tableData
    })
  }

  handleDel() {
    confirm({
      title: `确定要删除${this.state.selectedRows[0].channelCode || ''}吗？`,
      content: '',
      onOk: async() => {
        await api.data.channelIdentification.del(this.state.selectedRows[0].id)
        this.handleTableChange({})
        this.setState({
          selectedRowKeys: [],
          selectedRows: [],
        })
      }
    })
  }

  handleShowModal(type) {
    this.props.form.resetFields()
    this.setState({
      addVisible: true,
      status: type,
      initialValues: type === 'add' ? {} : { ...this.state.selectedRows[0] }
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
    const { selectedRowKeys, jsonPower, addVisible, tableData, initialValues, plateforms, status } = this.state
    const { getFieldDecorator } = this.props.form
    console.log(initialValues)
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
        title: '渠道编号',
        dataIndex: 'channelNo',
        key: 'channelNo',
      },
      {
        title: '渠道名称',
        dataIndex: 'channelName',
        key: 'channelName',
      },
      {
        title: '渠道标识',
        dataIndex: 'channelCode',
        key: 'channelCode',
      },
      {
        title: '平台名称',
        dataIndex: 'plateformName',
        key: 'plateformName',
      },
      {
        title: '创建人',
        dataIndex: 'createdPerson',
        key: 'createdPerson',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: text => moment(text).format('YYYYMMDD')
      },
      {
        title: '最后修改人',
        dataIndex: 'modifiedPerson',
        key: 'modifiedPerson',
      },
      {
        title: '最后修改时间',
        dataIndex: 'modifyTime',
        key: 'modifyTime',
        render: text => moment(text).format('YYYYMMDD')
      }
    ]
    return <div>
      <p>渠道标识管理</p>
      <div className={style['button-box']}>
        {jsonPower['opertion_access_channel_insert'] ? <Button type='primary' className={style['button']}
                                  onClick={() => this.handleShowModal('add')}>新增</Button> : null}
        {jsonPower['opertion_access_channel_update'] ? <Button type='primary' className={style['button']} onClick={() => this.handleShowModal('update')}
                                  disabled={selectedRowKeys.length !== 1}>修改</Button> : null}
        {jsonPower['opertion_access_channel_delete_logic'] ? <Button type='primary' className={style['button']} onClick={this.handleDel}
                                  disabled={selectedRowKeys.length !== 1}>删除</Button> : null}
      </div>
      <Table className={style['table']} dataSource={tableData.data} rowKey='id' rowSelection={rowSelection}
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
        title={status === 'add' ? '新增渠道标识' : '修改渠道标识'}
        visible={addVisible}
        onOk={this.handleSubmit}
        onCancel={this.handleHideModal}
        okText='保存'
        cancelText='关闭'
      >
        <Form>
          <FormItem label='渠道名称'
                    {...formItemLayout}>
            {getFieldDecorator('channelName', {
              initialValue: initialValues.channelName,
              rules: [{ required: true, message: '请输入渠道名称' }]
            })(
              <Input
                placeholder='渠道名称'
                maxLength={10}
              />
            )}
          </FormItem>
          <FormItem label='渠道标识'
                    {...formItemLayout}>
            {getFieldDecorator('channelCode', {
              initialValue: initialValues.channelCode,
              rules: [{ required: true, message: '请输入渠道标识' }]
            })(
              <Input
                placeholder='渠道标识'
                maxLength={4}
              />
            )}
          </FormItem>
          <FormItem label='平台名称'
                    {...formItemLayout}>
            {getFieldDecorator('plateformId', {
              initialValue: initialValues.plateformId,
              rules: [{ required: true, message: '请输入平台名称' }]
            })(<Select style={{ width: '100%' }} placeholder='平台名称' getPopupContainer={trigger => trigger.parentNode}>
              {
                plateforms.map(item => {
                  return <Option value={item.id} key={item.id}>{item.plateformName}</Option>
                })
              }
            </Select>)}
          </FormItem>
        </Form>
      </Modal>
    </div>
  }
}

export default Form.create()(ChannelIdentification)
