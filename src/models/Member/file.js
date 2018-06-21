import React, { Component } from 'react'
import { Table, Button, Input, Form, Select, Tabs, message, Modal, Upload } from 'antd'
import { Link } from 'react-router-dom'
const { Column } = Table
const TabPane = Tabs.TabPane
const Option = Select.Option
import moment from 'moment'
import * as urls from '../../contants/url'
import Search from 'Components/FormRow/index'
import style from './index.css'
import fetch from 'Util/fetch'
import md5 from 'md5'
import api from 'Src/contants/api'
import { baseUrl } from 'Util'
import { transGetUrl } from 'Util/tools'
import tooler from 'Contants/tooler'
import { showSpin } from 'Models/layout'

class memberFile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      activeKey: '1',
      selectedRowKeys: [],
      shipId: '', // 会员id
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
      },
      paginationTwo: {
        pageSize: 10,
        current: 1,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
      },
      dataSource: [], // 页面列表数据
      gradeSource: [], // 等级数据
      queryData: {}, // 查询数据
      columns: [{
        title: '会员编号',
        dataIndex: 'userNo',
        width: 320,
      }, {
        title: '会员姓名',
        dataIndex: 'realName',
      }, {
        title: '手机号',
        dataIndex: 'mobileNo',
      }, {
        title: '性别',
        dataIndex: 'sexName',
      }, {
        title: '学历',
        dataIndex: 'educationName',
      }, {
        title: '启用状态',
        dataIndex: 'enableName',
      }, {
        title: '出生日期',
        dataIndex: 'birthDate',
        render: (text) => {
          return text && moment(Number(text)).format('YYYY/MM/DD')
        },
      }, {
        title: '国家',
        dataIndex: 'countryName',
      }, {
        title: '省/州',
        dataIndex: 'provinceName',
      }, {
        title: '城市',
        dataIndex: 'cityName',
      }, {
        title: '区县',
        dataIndex: 'areaName'
      }, {
        title: '住址',
        dataIndex: 'adddress'
      }, {
        title: '邮政编码',
        dataIndex: 'postalcode'
      }, {
        title: '固定电话',
        dataIndex: 'telPhone'
      }, {
        title: '电子邮件',
        dataIndex: 'email'
      }, {
        title: '证件类型',
        dataIndex: 'cardTypeName',
      }, {
        title: '证件号',
        dataIndex: 'cardNumber'
      }, {
        title: '员工编号',
        dataIndex: 'member'
      }, {
        title: '内部用户',
        dataIndex: 'innerName',
      }, {
        title: '入会方式',
        dataIndex: 'admissionMethodName'
      }],
      columnTwo: [{
        title: '会籍',
        dataIndex: 'membershipName'
      }, {
        title: '等级',
        dataIndex: 'levelName',
      }, {
        title: '启用状态',
        dataIndex: 'membershipStatus',
        render: (text, record) => {
          return text ? '启用' : '停用'
        }
      }, {
        title: '入会时间',
        dataIndex: 'createTime',
        render: (text, record) => {
          return text && moment(Number(text)).format('YYYY/MM/DD')
        }
      }, {
        title: '累计消费金额',
        dataIndex: 'cumulaMoney',
        render: (text, record) => {
          return text || 0
        }
      }, {
        title: '本会籍可用积分',
        dataIndex: 'validIntergration',
        render: (text, record) => {
          return text || 0
        }
      }, {
        title: '累计积分',
        dataIndex: 'cumulaTotalIntergration',
        render: (text, record) => {
          return text || 0
        }
      }, {
        title: '最近等级变动时间',
        dataIndex: 'modifyTime',
        render: (text, record) => {
          return text && moment(Number(text)).format('YYYY/MM/DD')
        }
      }],
      jsonPower: {}
    }
    this.search = [
      [
        {
          type: '会员编号',
          name: 'userMemberNo',
          item: (<Input maxLength='30' placeholder='请填写会籍编号' />)
        },
        {
          type: '会员姓名',
          name: 'userNa',
          item: (<Input maxLength='30' placeholder='请填写会籍名称' />)
        },
        {
          type: '启用状态',
          name: 'status',
          item: (<Select style={{ width: '100%' }} placeholder='请选择启用状态' getPopupContainer={trigger => trigger.parentNode}>
            <Option value='2' key='all'>全部</Option>
            <Option value='1' key='on'>启用</Option>
            <Option value='0' key='off'>停用</Option>
          </Select>)
        }
      ],
      [
        {
          type: '手机号码',
          name: 'mobileNo',
          item: (<Input maxLength='30' placeholder='请填写手机号码' />)
        },
        {
          type: '证件类型',
          name: 'idType',
          item: (<Select style={{ width: '100%' }} placeholder='请选择证件类型' getPopupContainer={trigger => trigger.parentNode}>
            <Option value='0' key='all'>全部</Option>
          <Option value='1' key='shenfenzheng'>身份证</Option>
          <Option value='2' key='huzhao'>护照</Option>
          <Option value='3' key='hukou'>户口本</Option>
          <Option value='4' key='junguan'>军官证</Option>
          <Option value='5' key='jiashi'>驾驶证</Option>
        </Select>)
        },
        {
          type: '证件号码',
          name: 'idNumber',
          item: (<Input maxLength='30' placeholder='请填写证件号码' />)
        }
      ],
    ]
    this.changeTab = this.changeTab.bind(this)
    this.tableChange = this.tableChange.bind(this)
    this.handleDelItem = this.handleDelItem.bind(this)
    this.onSubmitInfo = this.onSubmitInfo.bind(this)
    this.handleModifyItem = this.handleModifyItem.bind(this)
    this.onSelectChange = this.onSelectChange.bind(this)
    this.upLoadChange = this.upLoadChange.bind(this)
    this.beforeUpload = this.beforeUpload.bind(this)
    this.gradeChange = this.gradeChange.bind(this)
    this.handleChuItem = this.handleChuItem.bind(this)
    this.handleEnableItem = this.handleEnableItem.bind(this)
    this.getShipBottomData = this.getShipBottomData.bind(this)
  }

  changeTab(key) {
    this.setState({
      activeKey: key,
    })
  }

  async componentDidMount() {
    this.getShipListData()
    // 权限控制start
    let jsonPower = tooler.authoControl()
    this.setState({ jsonPower })
    // 权限控制end
  }
  // 获取页面列表数据
  getShipListData() {
    const { pagination, queryData, paginationTwo } = this.state
    const data = {
      'page': pagination.current,
      'pagesize': pagination.pageSize,
      ...queryData
    }
    fetch.post('/userInfo/getPageUserInfoList', data).then(res => {
      this.setState({ loading: false })
      if (res.data && res.code === 0) {
        pagination['total'] = res.data.records
        paginationTwo['current'] = 1
        this.setState({ dataSource: res.data.data ? res.data.data : [], pagination, shipId: res.data.data && res.data.data.length ? res.data.data[0].id : undefined, paginationTwo }, () => this.getShipBottomData())
      } else {
        message.error(res.errmsg, 1)
      }
    })
  }
  // 表格列表点击
  onSelectChange(selectedRowKeys, selectDetails) {
    const { paginationTwo } = this.state
    paginationTwo['current'] = 1
    this.setState({ selectedRowKeys: selectedRowKeys.splice(selectedRowKeys.length - 1), selectDetails: selectDetails.splice(selectDetails.length - 1) }, () => { this.getShipBottomData() })
  }
  // 导出
  async handleChuItem() {
    const { selectedRowKeys, queryData } = this.state
    const data = { 'id': selectedRowKeys[0], ...queryData }
    for (var key in data) {
      if (!(data[key] || data[key] === 0)) {
        delete data[key]
      }
    }
    (async () => {
      const newdata = await api.data.memberfile.exportMembersJudge(data) || false
      console.log(newdata)
      if (newdata) {
        location.href = `${baseUrl}/userInfo/exportList?${transGetUrl(data)}`
      }
    })()
  }
  // 修改
  handleModifyItem() {
    const { selectedRowKeys } = this.state
    this.props.match.history.push(`${urls.FILEDETAIL}/${selectedRowKeys[0]}`)
  }
  // 删除
  handleDelItem() {
    const { selectedRowKeys, selectDetails } = this.state
    Modal.confirm({
      title: '',
      content: `确认删除${selectDetails[0].realName}？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => { this.deleteOk(selectedRowKeys[0]) },
      onCancel() {},
    })
  }
  // 删除
  deleteOk(id) {
    fetch.delete('/userInfo/deleteUserInfo/' + id).then(res => {
      if (res.code === 0) {
        message.success('删除成功！')
      } else {
        message.error(res.errmsg)
      }
      this.setState({ selectedRowKeys: [], selectDetails: [], queryData: {}, loading: true }, () => {
        this.getShipListData()
      })
    })
  }
  // 启用
  handleEnableItem() {
    const { selectDetails } = this.state
    this.setState({ loading: true })
    const data = {}
    data['id'] = selectDetails[0].id
    data['status'] = selectDetails[0].blEnbale ? '0' : '1'
    fetch.post('/userInfo/updateUserInfoStatus', data).then(res => {
      if (res.code === 0) {
        let type = selectDetails[0].blEnbale ? '停用成功！' : '启用成功！'
        message.success(`${selectDetails[0].realName}${type}`)
        this.setState({ selectedRowKeys: [], selectDetails: [], queryData: {}})
        this.getShipListData()
      } else {
        this.setState({ loading: false })
        message.error(res.errmsg)
      }
    })
  }
  // 查询
  onSubmitInfo(e) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (err) return
      values = tooler.jsonTrim(values)
      const { pagination } = this.state
      pagination.current = 1
      this.setState({ queryData: values, pagination, loading: true, selectedRowKeys: [], selectDetails: [] }, () => { this.getShipListData() })
    })
  }
  // table分页
  tableChange(pagination) {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    pager.pageSize = pagination.pageSize
    this.setState({
      pagination: pager,
      selectedRowKeys: [],
      loading: true
    }, () => {
      this.getShipListData()
    })
  }

  // 下面数据的table
  gradeChange(pagination) {
    const pager = { ...this.state.paginationTwo }
    pager.current = pagination.current
    pager.pageSize = pagination.pageSize
    this.setState({
      paginationTwo: pager,
    }, () => {
      this.getShipBottomData()
    })
  }

  async getShipBottomData() {
    const { shipId, selectedRowKeys } = this.state
    const id = (selectedRowKeys[0] || selectedRowKeys[0] === 0) ? selectedRowKeys[0] : shipId
    if (id) {
      const gradeSource = await api.data.memberfile.associaction(id) || false
      if (gradeSource) {
        this.setState({
          gradeSource
        })
      } else {
        this.setState({
          gradeSource: []
        })
      }
    } else {
      this.setState({
        gradeSource: []
      })
    }
  }

  beforeUpload(item) {
    let file = arguments[0]
    return new Promise((resolve, reject) => {
      if (file.size > 2000000000) {
        message.warning(`${file.name} 文件大小超过了2G.`)
        reject()
      } else {
        resolve()
      }
    })
  }
  async upLoadChange(info) {
    if (info.file.status === 'uploading') {
      showSpin(true)
    }
    if (info.file.status === 'done' && info.file.response.code === 0) {
      showSpin()
      const { pagination, paginationTwo } = this.state
      Modal.success({ content: <div style={{ maxHeight: '400px', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: info.file.response.data }}/> })
      pagination['current'] = 1
      paginationTwo['current'] = 1
      this.setState({ pagination, paginationTwo, selectedRowKeys: [], selectDetails: [], queryData: {}, loading: true }, () => this.getShipListData())
    }
    if (info.file.status === 'error') {
      showSpin()
      message.error(`${info.file.name}${info.file.response.message}`)
    }
    if (info.file.status === 'done' && info.file.response.code !== 0) {
      showSpin()
      message.error(`${info.file.name}${info.file.response.errmsg}`)
    }
  }

  render() {
    const { selectedRowKeys, columns, columnTwo, loading, dataSource } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const currTime = (new Date()).valueOf()
    return <div>
      <p>会员档案</p>
      <div className={style['button-box']}>
        {
          this.state.jsonPower['operation_manage_userinfo_insert'] ? <Link to={{ pathname: `${urls.FILEDETAIL}` }}><Button type='primary' className={style['button']}>新增</Button></Link> : null
        }
        {
          this.state.jsonPower['operation_manage_userinfo_update'] ? <Button type='primary' className={style['button']} disabled={ selectedRowKeys.length === 0 } onClick={this.handleModifyItem}>修改</Button> : null
        }
        {
          this.state.jsonPower['operation_manage_userinfo_delete_logic'] ? <Button type='primary' className={style['button']} disabled={ selectedRowKeys.length === 0 } onClick={this.handleDelItem}>删除</Button> : null
        }
        <Button type='primary' className={style['button']} onClick={this.onSubmitInfo}>查询</Button>
        {
          this.state.jsonPower['operation_manage_userinfo_enbale_or_disable'] ? <Button type='primary' className={style['button']} disabled={ selectedRowKeys.length === 0 } onClick={this.handleEnableItem}>改变启用状态</Button> : null
        }
        {
          this.state.jsonPower['operation_manage_userinfo_importinfo'] ? <Upload
          name='importFile'
          withCredentials={true}
          showUploadList= {false}
          multiple={true}
          headers={{ randomKey: currTime, secretKey: md5(currTime + 'Wivy45YNgsteznpf') }}
          action={baseUrl + '/userInfo/importUserInfo'}
          onChange={this.upLoadChange}
          beforeUpload={this.beforeUpload}
        > <Button type='primary' className={style['button']} icon='upload'>导入</Button></Upload> : null
        }
        {
          this.state.jsonPower['operation_manage_userinfo_exportinfo'] ? <Button type='primary' className={style['button']} disabled={ dataSource.length === 0 } onClick={this.handleChuItem}>导出</Button> : null
        }
      </div>
      <Form onSubmit={this.onSubmitInfo}>
        <Search formEle={Form} formMethods={this.props.form} search={this.search} />
      </Form>
      <div className={style['file-table']}>
      <Table
      className={style['table-two']}
      filterMultiple={false}
      dataSource={this.state.dataSource}
      rowKey={record => record.id}
      locale={{ emptyText: '暂无数据' }}
      rowSelection={rowSelection}
      pagination={this.state.pagination}
      onChange={this.tableChange} bordered
      columns={columns}
      scroll={{ x: true }} loading={loading} /></div>
      <Tabs activeKey={this.state.activeKey} className={style['file-tabs']} onChange={this.changeTab}>
        <TabPane tab='会员所属会籍' key='1' className={style['tab-pane']}>
          <Table
          className={style['table']}
          dataSource={this.state.gradeSource}
          rowKey={record => record.id}
          columns={columnTwo}
          locale={{ emptyText: '暂无数据' }}
          pagination={false}
          // onChange={this.gradeChange}
          bordered />
        </TabPane>
        <TabPane tab='等级变动记录' key='2' className={style['tab-pane']} disabled={true}>
          <Table className={style['table']} dataSource={this.state.gradeSource} rowKey='paramId' locale={{ emptyText: '暂无数据' }} bordered scroll={{ x: true }}>
            <Column title='会籍' dataIndex='aa' key='aa' className='align-center' />
            <Column title='会员编号' dataIndex='bb' key='bb' className='align-center' />
            <Column title='会员名称' dataIndex='cc' key='cc' className='align-center' />
            <Column title='原等级' dataIndex='dd' key='dd' className='align-center' />
            <Column title='新等级' dataIndex='ee' key='ee' className='align-center' />
            <Column title='变动时间' dataIndex='ff' key='ff' className='align-center' />
          </Table>
        </TabPane>
        <TabPane tab='交易记录' key='3' className={style['tab-pane']} disabled={true}>
          <Table className={style['table']} dataSource={this.state.gradeSource} rowKey='paramId' locale={{ emptyText: '暂无数据' }} bordered scroll={{ x: true }}>
            <Column title='会籍' dataIndex='aa' key='aa' className='align-center' />
            <Column title='会员编号' dataIndex='bb' key='bb' className='align-center' />
            <Column title='会员名称' dataIndex='cc' key='cc' className='align-center' />
            <Column title='消费日期' dataIndex='dd' key='dd' className='align-center' />
            <Column title='来源系统' dataIndex='ee' key='ee' className='align-center' />
            <Column title='来源单据号' dataIndex='ff' key='ff' className='align-center' />
            <Column title='来源单据类型' dataIndex='gg' key='gg' className='align-center' />
            <Column title='退货原单' dataIndex='hh' key='hh' className='align-center' />
            <Column title='商品总数' dataIndex='ii' key='ii' className='align-center' />
            <Column title='金额' dataIndex='oo' key='oo' className='align-center' />
            <Column title='币种' dataIndex='pp' key='pp' className='align-center' />
          </Table>
        </TabPane>
        <TabPane tab='积分明细' key='4' className={style['tab-pane']} disabled={true}>
        </TabPane>
        <TabPane tab='账务信息' key='5' className={style['tab-pane']} disabled={true}>
        </TabPane>
      </Tabs>
    </div>
  }
}

export default Form.create()(memberFile)
