import React, { Component } from 'react'

class AddForm extends Component {
  render() {
    const FormItem = this.props.formEle.Item
    const { getFieldDecorator } = this.props.formMethods
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
    return (
      <div>
        {
          this.props.addForm && this.props.addForm.map((val, key) => {
            return (
              <FormItem label={ val.type } key={key} {...formItemLayout}>
                {getFieldDecorator(val.name, { rules: val.rules && val.rules, initialValue: val.initialValue })(val.item)}
              </FormItem>
            )
          })
        }
      </div>
    )
  }
}

export default AddForm
