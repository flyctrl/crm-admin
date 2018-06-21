/**
 * @Author: sunshiqiang
 * @Date: 2018-05-10 15:27:58
 * @Title: 基本积分规则新增和修改
 */

import React, { Component } from 'react'
import { Form, Input, InputNumber, Col, Button, Modal, Select, DatePicker } from 'antd'
import style from '../index.css'
import * as urls from 'Contants/url'
import moment from 'moment'
import api from 'Contants/api'
import tooler from 'Contants/tooler'

const FormItem = Form.Item
const Option = Select.Option

class Update extends Component {
  constructor(props) {
    super(props)
    this.state = {
      membershipList: []
    }
    this.fileDetailBack = this.fileDetailBack.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    (async () => {
      const membershipList = await api.dictData.memberships() || []
      this.setState({ membershipList })
    })()
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        values.validTime = values.validTime.format('X') + '000'
        const data = await api.data.rule.basicIntegral.add(tooler.jsonTrim(values))
        data && this.props.match.history.push(urls.BASICINTEGRAL)
      }
    })
  }

  // 返回
  fileDetailBack() {
    Modal.confirm({
      title: '',
      content: `确认返回？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.props.match.history.push(urls.BASICINTEGRAL)
      },
    })
  }

  _renderFormItems(arr) {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }
    return arr.map((item, key) => (
      <Col span={8} key={key} style={{}}>
        <FormItem label={item.type} {...formItemLayout}>
          {this.props.form.getFieldDecorator(item.name, item.rules && item.rules)(item.item)}
        </FormItem>
      </Col>
    ))
  }

  render() {
    const search = [
      {
        type: '所属公司',
        name: 'companyName',
        item: (<Input size='large' maxLength='30' placeholder='请填写所属公司'/>),
        rules: {
          rules: [{ required: true, message: '请填写所属公司' }],
          initialValue: ''
        },
      },
      {
        type: '规则名称',
        name: 'baseIntergrationRuleName',
        item: (<Input size='large' maxLength='30' placeholder='请填写规则名称'/>),
        rules: {
          rules: [{ required: true, message: '请填写规则名称' }],
          initialValue: ''
        },
      },
      {
        type: '所属会籍',
        name: 'membershipId',
        item: (<Select placeholder='请选择' getPopupContainer={trigger => trigger.parentNode} size='large'>
          {
            this.state.membershipList.map(item => {
              return <Option value={item.id} key={item.id}>{item.membershipName}</Option>
            })
          }
        </Select>),
        rules: { rules: [{ required: true, message: '请填写所属会籍' }] },
      },
      {
        type: '每M货币单位',
        name: 'currencyUnit',
        item: (<InputNumber style={{ width: '100%' }} size='large' min='1' maxLength='10' placeholder='请填写每M货币单位'/>),
        rules: {
          rules: [{ required: true, message: '请填写每M货币单位(正整数)', pattern: /^\d*$/ }],
          initialValue: ''
        },
      },
      {
        type: '积N分',
        name: 'baseIntergration',
        item: (<InputNumber style={{ width: '100%' }} size='large' maxLength='10' min='1' placeholder='请填写积N分'/>),
        rules: {
          rules: [{ required: true, message: '请填写积N分(正整数)', pattern: /^\d*$/ }],
          initialValue: ''
        },
      },
      {
        type: '生效时间',
        name: 'validTime',
        item: (<DatePicker style={{ width: '100%' }} disabledDate={current => current && current < moment().startOf('day')} size='large' showTime format='YYYY-MM-DD HH:mm:ss'/>),
        rules: {
          rules: [{ required: true, message: '请输入生效时间' }],
        },
      },
      {
        type: '币种',
        name: 'type',
        item: (<Select placeholder='请选择' getPopupContainer={trigger => trigger.parentNode} size='large'>
          <Option key='0'>人民币</Option>
        </Select>),
        rules: {
          rules: [{ required: true, message: '请选择' }],
          initialValue: '0'
        },
      }]

    return <div className={style['formitems-box']}>
      <div className={style['button-box']}>
        <Button type='primary' className={style['button']} onClick={this.fileDetailBack}>返回</Button>
        <Button type='primary' className={style['button']} onClick={this.handleSubmit}>保存</Button>
      </div>
      <Form onSubmit={this.onSubmitInfo} className={style['files-form']}>
        {this._renderFormItems(search)}
      </Form>
    </div>
  }
}

export default Form.create()(Update)
