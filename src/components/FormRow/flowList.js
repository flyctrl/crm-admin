import React, { Component } from 'react'
import { Row, Col } from 'antd'
import moment from 'moment'
import style from './flowList.css'

class FlowList extends Component {
  render() {
    const { author, gmtCreated, flowNumber, bookCount, attachmentCount, list } = this.props
    return (
      <div>
        <div className={style['transfer-details-list']}>
          <span><em>交接人</em>：{ author }</span>
          <span><em>发起时间</em>：{ gmtCreated }</span>
          <span><em>流程号</em>：{ flowNumber }</span>
          <span><em>案卷数量</em>：{ bookCount }</span>
          <span><em>附件数量</em>：{ attachmentCount }</span>
        </div>
        <div className={style['transfer-details-flow']}>
          {
            list.length > 0 ? (
              list.map((val, index) => {
                return (
                  <Row key={index}>
                    <Col span={6}>
                      {val.operatorRole}
                    </Col>
                    <Col span={6}>
                      {val.operatorName}
                    </Col>
                    <Col span={6}>
                      {val.operateResult}
                    </Col>
                    <Col span={6}>
                      { val.gmtCreated ? moment(val.gmtCreated).format('YYYY-MM-DD HH:mm:ss') : ''}
                    </Col>
                  </Row>
                )
              })
            ) : (
              <div className={style['transfer-details-null']}>暂无数据</div>
            )
          }
        </div>
      </div>
    )
  }
}

export default FlowList
