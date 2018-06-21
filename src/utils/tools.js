/**
 * 一些js操作
 */
import moment from 'moment'

const transGetUrl = (obj) => {
  const arr = []
  for (let i in obj) {
    arr.push(`${i}=${obj[i]}`)
  }
  return arr.join('&')
}

const createNo = (pre) => {
  return `${pre}${moment().format('YYYYMMDDHHmmssS')}`
}
const randNumber = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const createNoTwo = (pre) => {
  return `${pre}${moment().format('YYYYMMDDHHmmss')}${randNumber[Math.floor(Math.random() * 10)]}${randNumber[Math.floor(Math.random() * 10)]}${randNumber[Math.floor(Math.random() * 10)]}${randNumber[Math.floor(Math.random() * 10)]}`
}

export { transGetUrl, createNo, createNoTwo }
