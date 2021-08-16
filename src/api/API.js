import { ajax } from './Ajax'

export function getExchange() {
  return ajax(`${process.env.VUE_APP_EXCHANGE}`, 'get')
}

// 현시세
export function getSise(symbol = '247540') {
  const url = `${process.env.VUE_APP_SISE}?code=${symbol}`
  return ajax(url, 'get')
}

// 종목코드
export function getSymbol(stock) {
  const url = `${process.env.VUE_APP_OPENAPI}`
  const urlSymbol = `${process.env.VUE_APP_SYMBOL}`
  return ajax(url, 'post', { url: urlSymbol, data: { stock } })
}
