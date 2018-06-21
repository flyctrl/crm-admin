/*
* @Author: chengbs
* @Date:   2018-05-11 11:13:47
* @Last Modified by:   chengbs
* @Last Modified time: 2018-05-11 17:26:41
*/
import React, { Component } from 'react'
import { Button, Table, Modal } from 'antd'
import EditForm from './editForm'
class AddedService extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource:
      [
        {
          key: 1,
          order: 1,
          legalName: '金诚权益1',
          status: 1,
          creater: 'chengbs',
          editer: 'admin',
          laster: 'admin',
          editTime: '2018-05-11'
        },
        {
          key: 2,
          order: 2,
          legalName: '金诚权益2',
          status: 1,
          creater: 'chengbs',
          editer: 'admin',
          laster: 'admin',
          editTime: '2018-05-11'
        },
        {
          key: 3,
          order: 3,
          legalName: '金诚权益3',
          status: 1,
          creater: 'chengbs',
          editer: 'admin',
          laster: 'admin',
          editTime: '2018-05-11'
        }
      ],
      selectedRowKeys: [],
      selectDetails: [],
      isAddModal: true,
      formVisible: false
    }

    this.onSelectChange = this.onSelectChange.bind(this)
    this.handleServiceSave = this.handleServiceSave.bind(this)
    this.handleServiceCancel = this.handleServiceCancel.bind(this)
    this.handleAddBtn = this.handleAddBtn.bind(this)
    this.handleEditBtn = this.handleEditBtn.bind(this)
  }

  // 列表选择
  onSelectChange(selectedRowKeys, selectedRows) {
    // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    const { dataSource } = this.state
    const selectedRowKeysChange = selectedRowKeys.splice(selectedRowKeys.length - 1)
    const selectDetailsChange = dataSource.filter((item) => (item['key'] === selectedRowKeysChange[0]))
    this.setState({ selectedRowKeys: selectedRowKeysChange, selectDetails: selectDetailsChange })
  }

  handleAddBtn() {
    this.setState({
      formVisible: true,
      isAddModal: true
    })
  }

  handleEditBtn() {
    this.setState({
      formVisible: true,
      isAddModal: false
    })
  }

  handleServiceSave() {
    this.setState({
      formVisible: false
    })
  }

  handleServiceCancel() {
    this.setState({
      formVisible: false
    })
  }

  render() {
    const { dataSource, selectedRowKeys, isAddModal, formVisible, selectDetails } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    }
    const columns =
      [
        {
          title: '序号',
          dataIndex: 'order',
          key: 'order',
        }, {
          title: '权益名称',
          dataIndex: 'legalName',
          key: 'legalName',
        }, {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
        }, {
          title: '创建人',
          dataIndex: 'creater',
          key: 'creater',
        }, {
          title: '最后修改人',
          dataIndex: 'laster',
          key: 'laster',
        }, {
          title: '最后修改时间',
          dataIndex: 'editTime',
          key: 'editTime',
        }
      ]
    return (
      <div>
        <p>增值服务权益设置</p>
        <div>
          <Button type='primary' onClick={this.handleAddBtn}>新增</Button>
          <Button type='primary' onClick={this.handleEditBtn} disabled={ selectedRowKeys.length === 0 } style={{ margin: '0 10px' }}>修改</Button>
          <Button type='primary' disabled={ selectedRowKeys.length === 0 }>删除</Button>
        </div>
        <Table
          style={{ marginTop: 10 }}
          locale={{ emptyText: '暂无数据' }}
          rowKey='key'
          scroll={{ x: true }}
          bordered
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
        />
        <Modal title={isAddModal ? '添加增值服务权益' : '编辑增值服务权益设置'}
          visible={formVisible}
          onCancel={this.handleServiceCancel}
          width={450}
          footer={null}
          destroyOnClose={true}
        >
          <EditForm isAddModal={isAddModal} onSave={this.handleServiceSave} ref='serviceForm' selectDetails={selectDetails} />
        </Modal>
      </div>
    )
  }
}

export default AddedService
