import React, { Component } from 'react'
import { Layout, Icon, Alert, Spin } from 'antd'
import {
  Link,
  Route,
} from 'react-router-dom'
import AppMenu from 'Components/Menus'
// import api from 'Contants/api'
// import storage from 'Util/storage'
import YXBreadcrunb from 'Components/Breadcrumb'
import style from './style.css'

const { Sider, Content } = Layout

export let showSpin = null
// const userInfo = storage.get('userInfo') || {}

class MainLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      count: 0 // 记录当前正在请求的数量
    }
    this.setSpin = this.setSpin.bind(this)
    this.toggle = this.toggle.bind(this)
    showSpin = this.setSpin
  }

  // 设置是否可收起
  toggle() {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }
  // 设置全局加载
  setSpin(showSpin) {
    let { count } = this.state
    if (showSpin) {
      ++count
    } else {
      count && --count
    }
    this.setState({ count })
  }

  // 拓展时用
  selectMenu() {
    let pathName = decodeURI(location.pathname)
    let menuName = this.getMenuName(pathName)
    switch (menuName) {
      case 'App':
        return <AppMenu match={this.props.match} selectedMenu={this.props.selectedMenu}
                        collapsed={this.state.collapsed}/>
      default :
        return <AppMenu match={this.props.match} selectedMenu={this.props.selectedMenu}
                        collapsed={this.state.collapsed}/>
    }
  }

  getMenuName(pathName) {
    if (!pathName || pathName === '/') return ''
    let reg = new RegExp(/\/(\b\w*\b)/)
    let matchName = pathName.match(reg)[1]
    let name = matchName.split('')
    name = name[0].toUpperCase() + name.slice(1).join('')
    return name
  }

  render() {
    const { routes } = this.props
    const { collapsed, count } = this.state
    return (
      <Layout className={style.layout}>
        <Sider className={style.sidebar}
               trigger={null}
               collapsible
               collapsed={collapsed}>
          <div className={style.logo}>
            <Link className={style['to-home']} to='/'>
              <img src={require('../assets/logo.png')} alt='logo'/>
              {collapsed ? null : <span>JCGroup</span>}
            </Link>
          </div>
          <div className={style.menu}>
            {this.selectMenu()}
          </div>
        </Sider>
        <Layout className={collapsed ? style['main-content-collapsed'] : style['main-content']}>
          {(/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor))
            ? '' : <Alert message='请使用google chrome浏览器使用系统' banner closable/>}
          <div className={style['header']}>
            <div className={style['header-button']} onClick={this.toggle}>
              <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'}/>
            </div>
            <div className={style['left-warpper']}>
            </div>
          </div>
          <Layout className={style['content']} style={{ padding: '0 24px 24px' }}>
            {
              routes.map((route, index) => {
                return (
                  <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    render={(match, location, history) => {
                      return <div>
                        <YXBreadcrunb match={match} location={location} history={history} routes={routes}/>
                        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                          <route.component match={match} />
                        </Content>
                      </div>
                    }}
                  />
                )
              })
            }
          </Layout>
        </Layout>
        {
          count ? (
            <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: '999' }}>
              <Spin tip={'正在加载数据....'}
                    style={{ position: 'absolute', top: '50%', width: '100%' }}
                    size='large'/>
            </div>) : null
        }
      </Layout>
    )
  }
}

export default MainLayout

