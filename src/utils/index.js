let baseUrl = 'http://dev.capi.tidc-jcgroup.com.cn/coreapi/'
// let baseUrl = 'http://test.capi.jcgcrm.jcgroup.com.cn/'
let imgPrefix = ''
let loginUrl = 'http://test.admin.sso.jcease.com/login'

if (process.env.NODE_ENV === 'production') {
  baseUrl = 'http://capi.jcgcrm.jcgroup.com.cn/'
  loginUrl = 'http://ssoadmin.jcgroup.com.cn/login'
  // imgPrefix = 'https://image.youxiangtv.com/'
  if (DEV) {
    console.log('in DEV')
    baseUrl = 'http://dev.capi.tidc-jcgroup.com.cn/coreapi/'
    loginUrl = 'http://10.0.21.165/login'
  }
  if (TEST) {
    console.log('in TEST')
    baseUrl = 'http://test.capi.jcgcrm.jcgroup.com.cn/coreapi/'
    loginUrl = 'http://test.admin.sso.jcease.com/login'
    // imgPrefix = 'http://dx-image-test.itangchao.me/'
  }
  if (PRE) {
    console.log('in PRE')
    baseUrl = 'https://precapijcgcrm.jcgroup.com.cn/coreapi'
    loginUrl = 'http://pre.ssoadmin.jcgroup.com.cn/login'
  }
}

export { baseUrl, imgPrefix, loginUrl }
