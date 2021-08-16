export function commaOn(str) {
  const numStr = (str || '').toString().split('.')
  numStr[0] = numStr[0].replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')
  return numStr.join('.')
}

export function commaOff(str) {
  return str.split(',').join('')
}
