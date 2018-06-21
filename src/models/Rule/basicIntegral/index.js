/**
 * @Author: sunshiqiang
 * @Date: 2018-05-08 15:57:27
 * @Title: 基本积分规则
 */
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as urls from 'Contants/url'
import { Table, Button, Modal } from 'antd'
import style from '../index.css'
import tooler from 'Contants/tooler'
import moment from 'moment'
import api from 'Contants/api'

const confirm = Modal.confirm

class BasicIntegral extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      jsonPower: tooler.authoControl(),
      tableData: [],
    }
    this.handleTableChange = this.handleTableChange.bind(this)
    this.handleDel = this.handleDel.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
  }

  componentDidMount() {
    this.handleTableChange({})
  }

  async handleTableChange({ current = 1, pageSize = 10 }) {
    const tableData = await api.data.rule.basicIntegral.list({ pageNo: current, pageSize }) || {}
    this.setState({
      tableData,
      selectedRowKeys: [],
      selectedRows: [],
    })
  }

  handleDel() {
    confirm({
      title: `确定要删除${this.state.selectedRows[0].baseIntergrationRuleName || ''}吗？`,
      content: '',
      onOk: async () => {
        await api.data.rule.basicIntegral.del(this.state.selectedRows[0].id)
        this.handleTableChange({})
        this.setState({
          selectedRowKeys: [],
          selectedRows: [],
        })
      }
    })
  }

  handleSelectChange(selectedRowKeys, selectedRows) {
    selectedRowKeys = selectedRowKeys.slice(-1)
    selectedRows = [(this.state.tableData.data || []).find(item => item.id === selectedRowKeys[0])]
    this.setState({ selectedRowKeys, selectedRows })
  }

  render() {
    const { selectedRowKeys, jsonPower, tableData } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleSelectChange,
    }
    const columns = [
      {
        title: '所属公司',
        dataIndex: 'companyName',
        key: 'companyName',
      },
      {
        title: '规则编号',
        dataIndex: 'baseIntergrationRuleNo',
        key: 'baseIntergrationRuleNo',
      },
      {
        title: '规则名称',
        dataIndex: 'baseIntergrationRuleName',
        key: 'baseIntergrationRuleName',
      },
      {
        title: '所属会籍/产业',
        dataIndex: 'membershipName',
        key: 'membershipName',
      },
      {
        title: '每M货币单位',
        dataIndex: 'currencyUnit',
        key: 'currencyUnit',
      },
      {
        title: '积N分',
        dataIndex: 'baseIntergration',
        key: 'baseIntergration',
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
      <p>基本积分规则</p>
      <div className={style['button-box']}>
        {jsonPower['opertion_rule_base_intergration_insert'] ? <Link to={urls.BASICINTEGRALUPDATE}><Button type='primary' className={style['button']}
                                                                      onClick={this.handleShowModal}>新增</Button></Link> : null}
        {jsonPower['opertion_rule_base_intergration_delete_logic'] ? <Button type='primary' className={style['button']} onClick={this.handleDel}
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
    </div>
  }
}

export default BasicIntegral
