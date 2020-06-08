import api from './api'

/**
 * 获取会议室列表
 * @returns {*}
 */
export function getMeetingRoomList() {
  return api.get({
    url: 'propertyAPI/getMeetingRoomList'
  })
}

/**
 * 获取当天的会议室预约情况
 * @param date
 * @returns {*}
 */
export function getMeetingRoomInfo(date) {
  return api.get({
    url: 'propertyAPI/getInfoListByDate',
    data: {
      date: date
    }
  })
}

/**
 * 锁定会议室，管理员功能
 * @param roomId
 * @param date
 * @param startTime
 * @param endTime
 * @returns {*}
 */
export function lockMeetingRoom(roomId, date, startTime, endTime) {
  return api.get({
    url: 'propertyAPI/lockArea',
    data: {
      date: date,
      start: startTime,
      end: endTime,
      roomId: roomId
    }
  })
}

export function unLockMeetingRoom(lockId) {
  return api.get({
    url: 'propertyAPI/unlockArea',
    data: {
      lockId: lockId
    }
  })
}

/**
 * 登录会议室管理系统
 * @param param
 * @returns {*}
 */
export function loginMeetingRoom(param) {
  return api.get({
    url: 'propertyAPI/login',
    data: {
      ...param
    }
  })
}

/**
 * 获取预约列表
 * @param param
 * @returns {*}
 */
export function getBookList(param) {
  return api.get({
    url: 'propertyAPI/getBookList',
    data: {
      ...param
    }
  })
}

/**
 * 会议室预定详情
 * @param bookId
 * @returns {*}
 */
export function getReservationDetail(bookId) {
  return api.get({
    url: 'propertyAPI/getDetailByBookId',
    data: {
      bookId: bookId
    }
  })
}

/**
 * 管理员审核会议室预定
 * @param params
 * @returns {*}
 */
export function auditReservation(params) {
  return api.get({
    url: 'propertyAPI/auditBookInfoById',
    data: {
      ...params
    }
  })
}










import { busUrl } from "../config/index.js";

/**
 * 获取各种配置列表，如角色列表等，传递的参数为，码值类型
 * @param type
 * @returns {*}
 */
export function getBusCodeList(type) {
  return api.get({
    baseUrl: busUrl,
    url: "busAPI/getBusCodeList",
    data: {
      type: type
    }
  })
}

/**
 * 获取我的车票列表
 * @param openId
 * @returns {*}
 */
export function getMyTicket(openId) {
  return api.get({
    baseUrl: busUrl,
    url: 'busAPI/getMyTicketList',
    data: {
      openid: openId
    }
  })
}
/**
 * 
 *  
 * 获取车票详情
*/
export function getFareDetail(ticketid) {
  return api.get({
    baseUrl: busUrl,
    url: 'busAPI/getTicketInfo',
    data: {
      ticketid
    }
  })
}
/**
 * 
 * 
 * ；获取车票二维码
*/
export function getFareQRCode(ticketid) {
  return api.get({
    baseUrl: busUrl,
    url: 'busAPI/generateQrCode',
    data: {
      ticketid
    }
  })
}

/**
 * 
 * 
 * ；退票
*/
export function refundTicketInfo(ticketid) {
  return api.get({
    baseUrl: busUrl,
    url: 'bus/cancelChooseSeat',
    data: {
      ticketid
    }
  })
}

/**
 * 获取当前可预约车次列表
 * @returns {*}
 */
export function getBusList(type) {
  return api.get({
    baseUrl: busUrl,
    url: 'busAPI/getBusAvailableList',
    data: {
      token: type
    }
  })
}

/**
 * 获取校车调度需要的路线和司机信息
 * @returns {*}
 */
export function getBusDispatchInfo(date, type) {
  return api.get({
    baseUrl: busUrl,
    url: 'busAPI/getDispatchInfo',
    data: {
      date,
      type
    }
  })
}

/**  
 * 扫码
 * @returns {*}
 */
export function scanQRCodeReq(date) {
  return api.get({
    baseUrl: busUrl,
    url: 'busAPI/handleQRCodeInfo',
    data: {
      ...date
    }
  })
}

/**
 * 添加调度车辆
 * @param params
 * @returns {*}
 */
export function doBusDispatch(params) {
  return api.get({
    baseUrl: busUrl,
    url: 'busAPI/addBus',
    data: {
      ...params
    }
  })
}

export function getDispatcherBusList(type) {
  return api.get({
    baseUrl: busUrl,
    url: 'busAPI/getDispatcherBusList',
    data: {
      type
    }
  })
}










export function getAssignPerson() {
  return api.get({
    url: 'propertyAPI/getAssignPersonForPhone'
  })
}

// 获取二手市场物品详情
export function getProductDetail(params) {
  return api.get({
    url: 'fleaMarket/getUpperShelfInfo',
    data: {
      ...params
    },
    defaultValue: true
  })
}

//获取列表数据条数
export function getListNumber(params) {
  return api.get({
    url: 'lostAndFound/getDataCount',
    defaultValue: true
  })
}
//获取失物招领物品详情
export function getGoodsDetail(params) {
  return api.get({
    url: 'lostAndFound/getDetailInfo',
    data: {
      ...params
    },
    defaultValue: true
  })
}
//获取上传信息数据来源
export function getDataForm(params) {
  return api.get({
    url: 'lostAndFound/getSourceInfo',
    data: {
      ...params
    },
    defaultValue: true
  })
}
//获取全部失物招领的列表
export function getLostAndFindList(params) {
  return api.get({
    url: 'lostAndFound/getMoreInfoList',
    data: {
      ...params
    },
    defaultValue: true
  })
}
