import React, { Component } from 'react'
import { Button, Input, Form, Select, DatePicker, Modal, Row, Col, message } from 'antd'
import api from 'Contants/api'

const Option = Select.Option
const FormItem = Form.Item
import moment from 'moment'
import * as urls from '../../contants/url'
import tooler from 'Contants/tooler'
import style from './index.css'
import fetch from 'Util/fetch'
import { createNoTwo } from 'Util/tools'

class fileDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRowKeys: [],
      fileId: this.props.match.match.params.id,
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
      },
      countrys: [<Option key='0'>请选择</Option>], // 国家字典
      provinces: [<Option key='0'>请选择</Option>], // 省／州字典
      citys: [<Option key='0'>请选择</Option>], // 城市字典
      countys: [<Option key='0'>请选择</Option>], // 区／县字典
    }
    this.fileDetailBack = this.fileDetailBack.bind(this)
    this.onSubmitInfo = this.onSubmitInfo.bind(this)
    this.getFields = this.getFields.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
  }

  // 返回
  fileDetailBack() {
    Modal.confirm({
      title: '',
      content: `确认返回？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.props.match.history.push(`${urls.MEMBERFILE}`)
      },
      onCancel() {
      },
    })
  }

  // 地区级联变化
  handleSelectChange(value, type) {
    switch (type) {
      case 'country':
        this._provincesData(value)
        break
      case 'province':
        this._citysData(value)
        break
      case 'city':
        this._countysData(value)
        break
      default:
        break
    }
  }

  // 查询国家列表
  async _countrysData() {
    const data = await api.dictData.countrys() || []
    const countrys = data.map(item => <Option key={item.dataItemValue}>{item.dataItemTitle}</Option>)
    countrys.unshift(<Option key='0'>请选择</Option>)
    this.setState({ countrys })
  }

  // 查询省／州列表
  async _provincesData(parentItemValue) {
    const data = await api.dictData.provinces(parentItemValue)
    const provinces = data.map(item => <Option key={item.dataItemValue}>{item.dataItemTitle}</Option>)
    provinces.unshift(<Option key='0'>请选择</Option>)
    this.setState({ provinces }, () => {
      this.props.form.resetFields(['province', 'city', 'county'])
    })
  }

  // 查询城市列表
  async _citysData(parentItemValue) {
    const data = await api.dictData.citys(parentItemValue)
    const citys = data.map(item => <Option key={item.dataItemValue}>{item.dataItemTitle}</Option>)
    citys.unshift(<Option key='0'>请选择</Option>)
    this.setState({ citys }, () => {
      this.props.form.resetFields(['city', 'county'])
    })
  }

  // 查询区／县列表
  async _countysData(parentItemValue) {
    const data = await api.dictData.countys(parentItemValue)
    const countys = data.map(item => <Option key={item.dataItemValue}>{item.dataItemTitle}</Option>)
    countys.unshift(<Option key='0'>请选择</Option>)
    this.setState({ countys }, () => {
      this.props.form.resetFields(['county'])
    })
  }

  // 保存
  onSubmitInfo(e) {
    e.preventDefault()
    const { fileId } = this.state
    this.props.form.validateFields((err, values) => {
      if (err) return
      if (values['birthDate']) {
        values['birthDate'] = values['birthDate'].valueOf()
      }
      values = tooler.jsonTrim(values)
      if (fileId || fileId === 0) {
        values['id'] = fileId
        fetch.post('/userInfo/updateUserInfo', values).then(res => {
          if (res.code === 0) {
            message.success('修改成功！', 1, () => this.props.match.history.push(`${urls.MEMBERFILE}`))
          } else {
            message.error(res.errmsg)
          }
        })
      } else {
        fetch.post('/userInfo/addUserInfo', values).then(res => {
          if (res.code === 0) {
            message.success('新增成功！', 1, () => this.props.match.history.push(`${urls.MEMBERFILE}`))
          } else {
            message.error(res.errmsg)
          }
        })
      }
    })
  }
  getFields() {
    const search = [
      {
        type: '会员编号',
        name: 'userMemberNo',
        item: (<Input maxLength='30' placeholder='请填写会员编号' disabled={true}/>),
        rules: {
          rules: [{ required: true, message: '请填写会员编号' }],
          initialValue: (this.props.match.match.params.id || this.props.match.match.params.id === 0) ? undefined : createNoTwo('JCJT')
        },
      },
      {
        type: '会员姓名',
        name: 'userNa',
        item: (<Input maxLength='30' placeholder='请填写会员姓名'/>),
        rules: { rules: [{ required: true, message: '请填写会员姓名' }] },
      },
      {
        type: '手机号',
        name: 'mobileNo',
        item: (<Input maxLength='30' placeholder='请填写手机号'/>),
        rules: { rules: [{ required: true, message: '请填写手机号' }] },
      },
      {
        type: '性别',
        name: 'sex',
        item: (<Select style={{ width: '100%' }} placeholder='请选择' getPopupContainer={trigger => trigger.parentNode}>
          <Option key='0'>请选择</Option>
          <Option value='1' key='man'>男</Option>
          <Option value='2' key='woman'>女</Option>
        </Select>)
      },
      {
        type: '学历',
        name: 'education',
        item: (<Select style={{ width: '100%' }} placeholder='请选择' getPopupContainer={trigger => trigger.parentNode}>
          <Option key='0'>请选择</Option>
          <Option value='1' key='underJunior'>大专以下</Option>
          <Option value='2' key='junior'>大专</Option>
          <Option value='3' key='bachelor'>本科</Option>
          <Option value='4' key='master'>硕士</Option>
          <Option value='5' key='doctor'>博士</Option>
        </Select>)
      },
      {
        type: '出生日期',
        name: 'birthDate',
        item: (<DatePicker disabledDate={current => current && current >= moment().startOf('day')} format='YYYY-MM-DD' placeholder='请选择出生日期'/>)
      },
      {
        type: '国家',
        name: 'country',
        item: (<Select style={{ width: '100%' }} placeholder='请填写国家' getPopupContainer={trigger => trigger.parentNode}
                       onChange={value => this.handleSelectChange(value, 'country')}>
          {this.state.countrys}
        </Select>)
      },
      {
        type: '省/州',
        name: 'province',
        item: (<Select style={{ width: '100%' }} placeholder='请填写省/州' getPopupContainer={trigger => trigger.parentNode}
                       onChange={value => this.handleSelectChange(value, 'province')}>
          {this.state.provinces}
        </Select>)
      },
      {
        type: '城市',
        name: 'city',
        item: (<Select style={{ width: '100%' }} placeholder='请填写城市' getPopupContainer={trigger => trigger.parentNode}
                       onChange={value => this.handleSelectChange(value, 'city')}>
          {this.state.citys}
        </Select>)
      },
      {
        type: '区/县',
        name: 'county',
        item: (<Select style={{ width: '100%' }} placeholder='请填写区/县' getPopupContainer={trigger => trigger.parentNode}>
          {this.state.countys}
        </Select>)
      },
      {
        type: '住址',
        name: 'address',
        item: (<Input maxLength='30' placeholder='请填写住址'/>)
      },
      {
        type: '邮政编码',
        name: 'postalCode',
        item: (<Input maxLength='30' placeholder='请填写邮政编码'/>)
      },
      {
        type: '固定电话',
        name: 'fixedTelephone',
        item: (<Input maxLength='30' placeholder='请填写固定电话'/>)
      },
      {
        type: '电子邮件',
        name: 'mailBox',
        item: (<Input maxLength='30' placeholder='请填写电子邮件'/>)
      },
      {
        type: '证件类型',
        name: 'idType',
        item: (<Select style={{ width: '100%' }} placeholder='请选择' getPopupContainer={trigger => trigger.parentNode}>
          <Option key='0'>请选择</Option>
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
        item: (<Input maxLength='30' placeholder='请填写证件号'/>)
      },
      {
        type: '启用状态',
        name: 'status',
        item: (<Select style={{ width: '100%' }} placeholder='请选择' getPopupContainer={trigger => trigger.parentNode}>
          <Option value='1' key='on'>启用</Option>
          <Option value='0' key='off'>停用</Option>
        </Select>)
      },
      {
        type: '员工编号',
        name: 'member',
        item: (<Input maxLength='30' placeholder='请填写员工编号'/>)
      },
      {
        type: '是否内部用户',
        name: 'userType',
        item: (<Select style={{ width: '100%' }} placeholder='请选择' getPopupContainer={trigger => trigger.parentNode}>
          <Option value='1' key='yes'>是</Option>
          <Option value='0' key='no'>否</Option>
        </Select>)
      },
      {
        type: '所属组织',
        name: 'structureId',
        item: (<Input maxLength='30' placeholder='请填写所属组织'/>)
      },
    ]
    const childrenBox = []
    search.forEach((item, index) => {
      childrenBox.push(
        <Col span={8} key={index + item.name}>
          <FormItem label={item.type}>
            {this.props.form.getFieldDecorator(item.name, item.rules && item.rules)(item.item)}
          </FormItem>
        </Col>)
    })
    return childrenBox
  }

  componentDidMount() {
    this._countrysData()
    const { fileId } = this.state
    if (fileId || fileId === 0) {
      fetch.get(`/userInfo/queryUserInfoById/${fileId}`).then(res => {
        if (res.code === 0) {
          for (let key in res.data) {
            this.props.form.getFieldDecorator(key, { initialValue: undefined })
          } // 用form.setFieldsValue方法要先赋初始值
          if (res.data['birthDate']) {
            res.data['birthDate'] = moment(Number(res.data['birthDate']))
          }
          if (res.data.country) {
            (async () => {
              await this._provincesData(res.data.country)
              await this._citysData(res.data.province)
              await this._countysData(res.data.city)
              this.props.form.setFieldsValue(res.data)
            })()
          }
        } else {
          message.error(res.errmsg)
        }
      })
    }
  }

  render() {
    return <div className={style['formitems-box']}>
      <p>会员档案</p>
      <div className={style['button-box']}>
        <Button type='primary' className={style['button']} onClick={this.fileDetailBack}>返回</Button>
        <Button type='primary' className={style['button']} onClick={this.onSubmitInfo}>保存</Button>
      </div>
      <Form onSubmit={this.onSubmitInfo} className={style['files-form']}>
        <Row gutter={24}>
          {this.getFields()}
        </Row>
      </Form>
    </div>
  }
}

export default Form.create()(fileDetail)
