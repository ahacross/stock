function saveArr(key, value) {
  const data = load(key) || []
  if (!data.filter(v => v === value).length) {
    localStorage.setItem(key, JSON.stringify([...data, value]))
  }
}

function saveObj(key, value) {
  localStorage.setItem(key, JSON.stringify({ ...(load(key) || {}), ...value }))
}

function deleteArr(key, value) {
  const data = load(key).filter(v => v !== value)
  localStorage.setItem(key, JSON.stringify(data))
}

function deleteObj(key) {
  const data = load(key)
  delete data[key]
  localStorage.setItem(key, JSON.stringify(data))
}

function load(key) {
  return JSON.parse(localStorage.getItem(key))
}

export function addStock(data) {
  const { symbol } = data
  saveObj(symbol, data)
  saveArr('stocks', symbol)
}

export function delStock(symbol) {
  deleteObj(symbol)
  deleteArr('stocks', symbol)
}

export function getStocks() {
  const stocks = load('stocks') || []
  return stocks.map(stock => load(stock))
}
