/*
* @Author: chengbs
* @Date:   2018-05-11 15:26:15
* @Last Modified by:   chengbs
* @Last Modified time: 2018-05-11 17:31:54
*/
import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'
const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    xs: { span: 12 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
}
const formBtnLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12, offset: 7 },
}
class EditForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  handleSubmit(e) {
    e.preventDefault()
    console.log(this.props.isAddModal)
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values)
        this.props.onSave()
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    console.log(this.props)
    return (
      <Form onSubmit={this.handleSubmit.bind(this)}>
        <FormItem
          label='序号'
          { ...formItemLayout }
        >
          {getFieldDecorator('order', {
            rules: [{ required: true, message: '请刷新重新获取序号' }],
            initialValue: 1234
          })(
            <Input disabled />
          )}
        </FormItem>
        <FormItem
          label='权益名称'
          { ...formItemLayout }
        >
          {getFieldDecorator('legalName', {
            rules: [{ required: true, message: '请输入权益名称' }],
            initialValue: ''
          })(
            <Input />
          )}
        </FormItem>
        <FormItem {...formBtnLayout}>
          <Button>取消</Button>
          <Button type='primary' htmlType='submit' style={{ marginLeft: 20 }}>保存</Button>
        </FormItem>
      </Form>
    )
  }
}

export default Form.create({
  mapPropsToFields(props) {
    console.log(props)
    if (!props.isAddModal) {
      return {
        order: Form.createFormField({
          ...props.selectDetails[0].order,
          value: props.selectDetails[0].order,
        }),
        legalName: Form.createFormField({
          ...props.selectDetails[0].legalName,
          value: props.selectDetails[0].legalName,
        }),
      }
    }
  }
})(EditForm)
