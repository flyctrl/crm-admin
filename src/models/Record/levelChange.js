import React, { Component } from 'react'
import { Table, Button, Input, Form } from 'antd'

const { Column } = Table
import Search from 'Components/FormRow/index'
import style from './index.css'

class levelChange extends Component {
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
          type: '会员编号',
          name: 'bookNumber',
          item: (<Input maxLength='30' placeholder='请填写会员编号'/>)
        },
      ],
    ]
  }

  render() {
    return <div>
      <p>等级变动记录</p>
      <div className={style['button-box']}>
        <Button type='primary' className={style['button']} onClick={this.handleQueryItem}>查询</Button>
      </div>
      <Form onSubmit={this.onSubmitInfo}>
        <Search formEle={Form} formMethods={this.props.form} search={this.search}/>
      </Form>
      <Table className={style['table']} dataSource={this.state.dataSource} rowKey='paramId'
             pagination={this.state.pagination} onChange={this.handleTableChange} bordered scroll={{ x: true }}>
        <Column title='会籍' dataIndex='aaa' key='aaa'/>
        <Column title='会员编号' dataIndex='orderNum' key='orderNum'/>
        <Column title='会员名称' dataIndex='createUserName' key='createUserName'/>
        <Column title='原等级' dataIndex='gmtModified' key='gmtModified'/>
        <Column title='新等级' dataIndex='modifyUserName' key='modifyUserName'/>
        <Column title='变动时间' dataIndex='bbb' key='bbb'/>
      </Table>
    </div>
  }
}

export default Form.create()(levelChange)
