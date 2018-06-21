/**
 * Created by yiming on 2017/6/20.
 */
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Icon } from 'antd'
import * as urls from '../../contants/url'
// import api from 'Src/contants/api'
import classNames from 'classnames'
import Style from './style.css'
import md5 from 'md5'
import { baseUrl, loginUrl } from 'Util/index'
import storage from 'Util/storage'
import menuData from './menuData'

const SubMenu = Menu.SubMenu
const MenuItem = Menu.Item

class MamsMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: 'inline',
      data: [],
      // openKeys: JSON.parse(sessionStorage.getItem('openKeys')) || []
    }
  }

  getMenuItemClass(str) {
    const pathName = decodeURI(location.pathname)
    if (str !== urls.HOME) {
      return classNames({
        'ant-menu-item-selected': new RegExp(str).test(pathName)
      })
    }
    return classNames({
      'ant-menu-item-selected': pathName === str
    })
  }

  // handleOpenChange(openKeys) {
  //   this.setState({ openKeys }, () => {
  //     sessionStorage.setItem('openKeys', JSON.stringify(openKeys))
  //   })
  // }

  componentWillReceiveProps(nextProps) {
    this.setState({
      mode: nextProps.collapsed ? 'vertical' : 'inline'
    })
  }
  componentWillMount() {
    console.log(process.env.NODE_ENV)
    if (process.env.NODE_ENV === 'development') {
      window.functionPower = menuData
      setTimeout(() => {
        this.setState({
          data: menuData
        })
      }, 400)
    } else {
      // const res = await api.getMenu({ timestamp: (new Date()).getTime() }) || []
      const currTime = (new Date()).valueOf()
      const _t = this
      let xhr = new XMLHttpRequest()
      xhr.open('get', baseUrl + '/Sso/findMenuList', false)
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
      xhr.setRequestHeader('randomKey', currTime)
      xhr.setRequestHeader('secretKey', md5(currTime + 'Wivy45YNgsteznpf'))
      xhr.withCredentials = true
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          let res = JSON.parse(xhr.responseText)
          if (res.code === 0) {
            window.functionPower = res.data
            _t.setState({
              data: res.data
            })
          } else if (res.code === 20011) {
            window.location.href = loginUrl
          }
        }
      }
      xhr.send()
      // if (res) {
      //   this.setState({
      //     data: res
      //   }, function() {
      //     window.functionPower = this.state.data
      //   })
      // }
    }
  }
  render() {
    let { data } = this.state
    const loop = (data = []) => data.map((item) => {
      if (item.children) {
        return <SubMenu key={item.key} title={<p className={Style.ellip}><Icon type={item.icon}/><span>{item.value}</span></p>}>
          {loop(item.children)}</SubMenu>
      }
      return <MenuItem key={item.key} className={this.getMenuItemClass(urls[item.url.split('.')[1]])}>
        <Link className={Style.ellip} onClick={() => {
          storage.set('stateUrl', item.url)
        }} to={{ pathname: urls[item.url.split('.')[1]] }}><Icon type={item.icon}/><span>{item.value}</span></Link>
      </MenuItem>
    })
    const menusData = loop(data)
    return menusData.length > 0 ? <Menu
      mode={this.state.mode}
      selectedKeys={[this.props.selectedMenu]}
      // openKeys={this.state.openKeys}
      // defaultOpenKeys={['mams_member_data_auth', 'mams_crm_member', 'mams_member_access', 'mams_level_admin', 'mams_rule_admin', 'mams_record_admin']}
      style={{ border: 'none' }}
      // onOpenChange={this.handleOpenChange.bind(this)}
      >
      {menusData}
    </Menu> : null
  }
}

export default MamsMenu
