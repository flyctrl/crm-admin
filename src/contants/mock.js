/**
 * @Author: sunshiqiang
 * @Date: 2017-10-31 10:28:38
 * @Title: mock 数据
 */
import Mock from 'mockjs'

// 登陆接口
// 登入
Mock.mock('/api/login.json', {
  code: 0,
  data: true,
  accessToken: 'asdasfaefefafassf',
  message: '登陆成功'
})
// 登出
Mock.mock('/api/logout.json', {
  code: 0,
  data: true,
  message: '登出成功'
})
