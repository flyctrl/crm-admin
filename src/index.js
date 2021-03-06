import React from 'react'
import ReactDOM from 'react-dom'
import MainRouter from './Router'
import registerServiceWorker from './registerServiceWorker'
import { AppContainer } from 'react-hot-loader'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import { LocaleProvider } from 'antd'
import 'moment/locale/zh-cn'

if (process.env.NODE_ENV === 'development') {
  require('Contants/mock')
}

ReactDOM.render(
  <AppContainer>
    <LocaleProvider locale={zhCN}>
      <MainRouter/>
    </LocaleProvider>
  </AppContainer>,
  document.getElementById('root')
)

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./Router', () => {
    const NextApp = require('./Router').default
    ReactDOM.render(
      <LocaleProvider locale={zhCN}>
      <AppContainer>
        <NextApp/>
      </AppContainer>
      </LocaleProvider>,
      document.getElementById('root')
    )
  })
}

registerServiceWorker()
