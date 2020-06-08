import Taro from '@tarojs/taro'
import '@tarojs/async-await'

const WEEK_DAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
// const PAGE_LEVEL_LIMIT = 10

const reduce = Function.bind.call(Function.call, Array.prototype.reduce)
const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable)
const concat = Function.bind.call(Function.call, Array.prototype.concat)
const keys = Reflect.ownKeys

// const IS_H5 = process.env.TARO_ENV === 'h5'

if (!Object.values) {
  Object.values = function values(O) {
    return reduce(keys(O), (v, k) => concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []), [])
  }
}

export function prePageRoute() {
  const arrPage = Taro.getCurrentPages()
  if (arrPage.length == 1) {
    return arrPage[0].__route__
  } else if (arrPage.length > 1) {
    return arrPage[arrPage.length - 2].__route__
  }
  return null
}


/**
 *字符串去除所有空格
 */
function trim(a) {
  if (typeof a == 'string') {
    return a.replace(/\s+/, '')
  } else {
    return a
  }
}

/**
 *是否是字符串
 */
export function isString(a) {
  if ((typeof a) == 'string' && a) {
    return true
  } else {
    return false
  }
}

/**
 *字符串判空
 */
export function isEmpty(a) {
  const b = trim(a)
  if ((typeof a) == 'string' && b) {
    return b.length == 0;
  } else {
    return true
  }
}

/**
 *数字判空,如果不是数字类型，则应首先进行类型转换
 */
export function isNumber(a) {
  if ((typeof a) == 'number' && a != NaN) {
    return true
  } else {
    return false
  }
}


/**
 *数组判空,数组是对象的一种
 */
export function isEmptyArray(a) {
  if ((typeof a) == 'object' && a != null && a.length > 0) {
    return false
  } else {
    return true
  }
}


export function isEmptyObject(obj) {
  if (!obj) {
    return true
  }
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false
    }
  }
  return true
}

/**
 * 不分类型
 */
export function isNullEmpty(a) {
  if ((typeof a) == 'string') {
    return isEmpty(a)
  } else if ((typeof a) == 'number') {
    return !isNumber(a)
  } else if ((a instanceof Array)) {
    return isEmptyArray(a)
  } else if ((typeof a) == 'object' && a != null) {
    return isEmptyObject(a)
  }
  return true
}

//判断一个变量是否为空
export function isVarEmpty(v) {
  switch (typeof v) {
    case 'undefined':
      return true;
    case 'string':
      if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
      break;
    case 'boolean':
      if (!v) return true;
      break;
    case 'number':
      if (0 === v || isNaN(v)) return true;
      break;
    case 'object':
      if (null === v || v.length === 0) return true;
      for (var i in v) {
        return false;
      }
      return true;
  }
  return false;
}
/**
 * 下划线转换驼峰 兼容横线
 * @param name
 * @returns {string}
 */
export function camelCase(name) {
  name = name.toLowerCase()
  if (name.indexOf('_') != -1) {
    return name.replace(/\_(\w)/g, function (all, letter) {
      return letter.toUpperCase()
    })
  }
  return name.replace(/\-(\w)/g, function (all, letter) {
    return letter.toUpperCase()
  })
}

/**
 * 驼峰转换下划线
 * @param name
 * @returns {string}
 */
export function toLine(name) {
  return name.replace(/([A-Z])/g, "_$1").toLowerCase()
}

// //获取当前系统信息
// export function getSystemInfo () {
//   const systemInfo = Taro.getSystemInfoSync() || {
//     model: '',
//     screenWidth: 0,
//     screenHeight: 0
//   }
//   if (IS_H5) {
//     systemInfo.screenWidth = window.innerWidth
//     systemInfo.screenHeight = window.innerHeight
//     systemInfo.videoHeight = Math.floor(systemInfo.screenWidth && systemInfo.screenWidth / VIDEO_RATIO)
//     systemInfo.isIpx = false
//   } else {
//     systemInfo.isIpx = systemInfo.model && systemInfo.model.indexOf('iPhone X') > -1 ? true : false
//     systemInfo.videoHeight = Math.floor(systemInfo.screenWidth && systemInfo.screenWidth / VIDEO_RATIO)
//   }
//   return systemInfo
// }

//---------------------------------------------------
// 日期格式化
// 格式 YYYY/yyyy/YY/yy 表示年份
// MM/M 月份
// W/w 星期
// dd/DD/d/D 日期
// hh/HH/h/H 时间
// mm/m 分钟
// ss/SS/s/S 秒
//---------------------------------------------------
Date.prototype.Format = function (formatStr) {
  let str = formatStr
  let Week = ['日', '一', '二', '三', '四', '五', '六']

  str = str.replace(/yyyy|YYYY/, this.getFullYear())
  str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100))

  str = str.replace(/MM/, String(this.getMonth() + 1) > 9 ? String(this.getMonth() + 1) : '0' + (this.getMonth() + 1))
  str = str.replace(/M/g, (this.getMonth() + 1))

  str = str.replace(/w|W/g, Week[this.getDay()])

  str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate())
  str = str.replace(/d|D/g, this.getDate())

  str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours())
  str = str.replace(/h|H/g, this.getHours())
  str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes())
  str = str.replace(/m/g, this.getMinutes())

  str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds())
  str = str.replace(/s|S/g, this.getSeconds())

  return str
}

export function preDate(time) {
  let timeStamp = Date.parse(new Date(time))
  timeStamp = timeStamp / 1000
  timeStamp -= 86400;   //减去一天
  let newTime = new Date(timeStamp * 1000)
  return newTime;
}

export function lastDate(time) {
  let timeStamp = Date.parse(new Date(time))
  timeStamp = timeStamp / 1000
  timeStamp += 86400;   //加上一天
  let newTime = new Date(timeStamp * 1000)
  return newTime;
}


export function parseDate(time) {
  if (time instanceof Date) {
    return time
  }
  if (time) {
    time = typeof time === 'string' ? time.replace(/-/g, '/') : time
    return new Date(time)
  }
  return new Date()
}

export function getWeekDay(time) {
  const date = parseDate(time)
  return WEEK_DAYS[date.getDay()]
}

export function getParseDay(time, weekDay, symbol) {
  symbol = symbol || '-'
  const date = parseDate(time)
  const month = date.getMonth() + 1
  const parseMonth = month.toString().length < 2 ? `0${month}` : month
  let lparseDate = date.getDate()
  lparseDate = lparseDate.toString().length < 2 ? `0${lparseDate}` : lparseDate
  let parseDay = weekDay
    ? `${date.getFullYear()}${symbol}${parseMonth}${symbol}${lparseDate} ${WEEK_DAYS[date.getDay()]}`
    : `${date.getFullYear()}${symbol}${parseMonth}${symbol}${lparseDate}`
  return parseDay
}

export function getParseTime(time) {
  const date = parseDate(time)
  const hours = date.getHours().toString().length > 1 ? date.getHours() : `0${date.getHours()}`
  const minutes = date.getMinutes().toString().length > 1 ? date.getMinutes() : `0${date.getMinutes()}`
  const seconds = date.getSeconds().toString().length > 1 ? date.getSeconds() : `0${date.getSeconds()}`
  return `${hours}:${minutes}:${seconds}`
}

// /*
//  * 将秒数格式化时间
//  * @param {Number} seconds: 整数类型的秒数
//  * @return {String} time: 格式化之后的时间
//  */
// export function formatTime (seconds) {
//   var min = Math.floor(seconds / 60),
//     second = seconds % 60,
//     hour, newMin, time
//
//   if (min > 60) {
//     hour = Math.floor(min / 60)
//     newMin = min % 60
//   }
//
//   if (second < 10) {
//     second = '0' + second
//   }
//   if (min < 10) {
//     min = '0' + min
//   }
//
//   return time = hour ? (hour + ':' + newMin + ':' + second) : (min + ':' + second)
// }
//
// export function parseMoney (num) {
//   num = num.toString().replace(/\$|,/g, '')
//   if (isNaN(num)) num = '0'
//
//   // let sign = (num === (num = Math.abs(num)))
//
//   num = Math.floor(num * 100 + 0.50000000001)
//   let cents = num % 100
//   num = Math.floor(num / 100).toString()
//
//   if (cents < 10) cents = '0' + cents
//   for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
//     num = num.substring(0, num.length - (4 * i + 3)) + ',' +
//       num.substring(num.length - (4 * i + 3))
//   }
//
//   return (num + '.' + cents)
// }

export function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250)
  let last, deferTimer
  return function () {
    let context = scope || this

    let now = +new Date()
    let args = arguments
    if (last && now < last + threshhold) {
      clearTimeout(deferTimer)
      deferTimer = setTimeout(() => {
        last = now
        fn.apply(context, args)
      }, threshhold)
    } else {
      last = now
      fn.apply(context, args)
    }
  }
}

// // 处理微信跳转超过10层
// export function jumpUrl (url, options = {}) {
//   let needLogin = options.needLogin || false
//   if (!isLogin() && needLogin) {
//     goLogin({
//       returnUrl: url
//     })
//     return false
//   }
//   const pages = Taro.getCurrentPages()
//   let method = options.method || 'navigateTo'
//   if (url && typeof url === 'string') {
//     if (method == 'navigateTo' && pages.length >= PAGE_LEVEL_LIMIT - 3) {
//       method = 'redirectTo'
//     }
//
//     if (method == 'navigateToByForce') {
//       method = 'navigateTo'
//     }
//
//     if (method == 'navigateTo' && pages.length == PAGE_LEVEL_LIMIT) {
//       method = 'redirectTo'
//     }
//
//     Taro[method]({
//       url
//     })
//   }
// }

// 去登录
export function goLogin(data) {
  const arrPage = Taro.getCurrentPages()
  let strCurrentPage = '/' + (arrPage[arrPage.length - 1].__route__ || 'pages/index/index')
  let _data = []
  let _dataString = ''
  if (data) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (key === 'return_url' || key === 'returnUrl') {
          strCurrentPage = data[key] || ''
        } else {
          _data.push(`${key}=${data[key]}`)
        }
      }
    }
  }
  if (_data.length > 0) {
    _dataString = '?' + _data.join('&')
  }
  const returnPage = encodeURIComponent(strCurrentPage + _dataString)
  Taro.navigateTo({
    url: '/pages/login/login?return_url=' + returnPage
  })
}


// /*
// 事件管理器
//  */
// export function getEvent () {
//   return eventEmitter
// }


export function setCacheData(key, value) {
  Taro.setStorageSync(key, value)
}

export function getCacheData(key) {
  return Taro.getStorageSync(key)
}

export function clearCacheData() {
  return Taro.clearStorage()
}


// 设置一个全局对象
const globalData = {}

export function setGlobalData(key, val) {
  globalData[key] = val
}

export function getGlobalData(key) {
  return globalData[key]
}

// 转换日期格式
export function switchTime(time) {
  const newTime = /\d{4}-\d{1,2}-\d{1,2}/g.exec(time)
  return newTime
}

//处理请求成功后的数据处理
export function handleFinalData(res, url, that) {
  if (res.data.flag) {
    setTimeout(function () {
      Taro.atMessage({
        'message': res.data.msg,
        'type': 'success',
        'duration': 2000
      })
    }, 0)
    function toHome() {
      that.setState({
        buttonStatus: false
      })
      Taro.redirectTo({
        url
      })
    }
    setTimeout(toHome, 2000)
  } else {
    setTimeout(function () {
      Taro.atMessage({
        'message': res.data.msg,
        'type': 'error',
        'duration': 2000
      })
    }, 0)
    setTimeout(function () {
      that.setState({
        buttonStatus: false
      })
    }, 2000)
  }
}

/**
 * 只显示文字的toast
 * @param message
 */
export function showSimpleToast(message, icon) {
  Taro.showToast({
    title: message,
    icon: icon ? icon : 'none',
    duration: 2000
  })
}
