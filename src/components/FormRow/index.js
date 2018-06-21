import React, { Component } from 'react'
import { Collapse, Row, Col } from 'antd'
import style from './style.css'
import classnames from 'classnames/bind'

let cx = classnames.bind(style)
const Panel = Collapse.Panel

class SearchInput extends Component {
  constructor(props) {
    super(props)
    this.searchDom = this.searchDom.bind(this)
  }
  searchDom(list) {
    const FormItem = this.props.formEle.Item
    const { getFieldDecorator } = this.props.formMethods
    let rankNum = this.props.rankNum ? this.props.rankNum : 3
    let isLast = false
    return (
      list.map((val, key) => {
        if (key === rankNum - 1) { isLast = true }
        return (
          <Col key={key} span={ 24 / rankNum } className={cx({ 'col-name': true, 'col-name-last': isLast })}>
            <Row>
              <Col span={12}><div className={style['search-title']}>{val.type}</div></Col>
              <Col span={12}>
                <FormItem>
                  {getFieldDecorator(val.name, val.rules && val.rules)(val.item)}
                </FormItem>
              </Col>
            </Row>
          </Col>
        )
      })
    )
  }
  render() {
    return (
      this.props.collapse ? (
        <Collapse className={style['search-wrap-coll']} bordered={true} defaultActiveKey={['1']}>
          <Panel header='查询参数' key='1'>
            <div className={style['search-wrap']}>
              {
                this.props.search && this.props.search.map((val, key) => {
                  return (
                    <Row key={key}>{ this.searchDom(val) }</Row>
                  )
                })
              }
            </div>
          </Panel>
        </Collapse>
      ) : (
        <div className={style['search-wrap']}>
          {
            this.props.search && this.props.search.map((val, key) => {
              return (
                <Row key={key}>{ this.searchDom(val) }</Row>
              )
            })
          }
        </div>
      )
    )
  }
}

export default SearchInput
