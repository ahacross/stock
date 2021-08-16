import axios from 'axios'

function urlWrap(url) {
  if (!/^http/.test(url)) {
    url = `${process.env.VUE_APP_BASEURL}${url}`
  }
  return url
}

export async function ajax(url, method = 'get', data, params = { timeout: 30000, returnPromise: false }) {
  try {
    const res = await axios.request({ url: urlWrap(url), method, data })
    return res.data ? res.data : res
  } catch (res) {
    console.error(res)
    res.error = true
    return res
  }
}
