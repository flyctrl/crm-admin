import React, { Component } from 'react'
import { Table, Button, Input, Form } from 'antd'
const { Column } = Table
import Search from 'Components/FormRow/index'
import style from './index.css'

class tradeRecord extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRowKeys: [],
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
      },
    }
    this.search = [
      [
        {
          type: '订单编号',
          name: 'bookNumber',
          item: (<Input maxLength='30' placeholder='请填写订单编号' />)
        },
        {
          type: '会员编号',
          name: 'bookName',
          item: (<Input maxLength='30' placeholder='请填写会员编号' />)
        },
      ],
    ]
  }

  render() {
    return <div>
      <p>交易记录管理</p>
      <div className={style['button-box']}>
        <Button type='primary' className={style['button']} onClick={this.handleQueryItem}>查询</Button>
      </div>
      <Form onSubmit={this.onSubmitInfo}>
        <Search formEle={Form} formMethods={this.props.form} search={this.search} />
      </Form>
      <Table className={style['table']} dataSource={this.state.dataSource} rowKey='paramId' pagination={this.state.pagination} onChange={this.handleTableChange} bordered scroll={{ x: true }}>
        <Column title='会籍' dataIndex='aaa' key='aaa' className='align-center' />
        <Column title='会员编号' dataIndex='orderNum' key='orderNum' className='align-center' />
        <Column title='会员名称' dataIndex='createUserName' key='createUserName' className='align-center' />
        <Column title='消费日期' dataIndex='gmtModified' key='gmtModified' className='align-center' />
        <Column title='来源系统' dataIndex='modifyUserName' key='modifyUserName' className='align-center' />
        <Column title='来源单据号' dataIndex='bbb' key='bbb' className='align-center' />
        <Column title='来源单据类型' dataIndex='ccc' key='ccc' className='align-center' />
        <Column title='退货原单' dataIndex='rrr' key='rrr' className='align-center' />
        <Column title='商品总数' dataIndex='qq' key='qq' className='align-center' />
        <Column title='金额' dataIndex='hh' key='hh' className='align-center' />
        <Column title='币种' dataIndex='jj' key='jj' className='align-center' />
      </Table>
    </div>
  }
}

export default Form.create()(tradeRecord)
