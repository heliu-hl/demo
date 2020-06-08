/* eslint-disable import/prefer-default-export */
export const BASE_URL = 'https://hq.uestc.edu.cn/yzs/';
// export const BASE_URL = 'http://192.168.31.156:8080/yzs/';
// export const baseAdress = 'http://192.168.1.7:8080/yzs/';
// export const BASE_URL = 'http://192.168.1.14:8070/yzs/';
export const baseAdress = 'https://hq.uestc.edu.cn/yzs/';
// export const baseAdress = 'http://192.168.31.156:8080/yzs/';
// export const busUrl = 'http://192.168.31.156:8080/yzs/';
export const busUrl = 'https://hq.uestc.edu.cn/bus/';

export const APP_INFO = {
  appId: 'wx148d26cb07543413',
  //TODO 加入secret
  secret: '304a830a5b9584b940f3342f7dfff96d'
}

export const HTTP_ERROR = {
  '400': '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  '401': '用户没有权限（令牌、用户名、密码错误）。',
  '403': '用户得到授权，但是访问是被禁止的。',
  '404': '请求资源不存在。',
  '406': '请求的格式不可得。',
  '410': '请求的资源被永久删除，且不会再得到的。',
  '415': '不支持的媒体类型。',
  '422': '当创建一个对象时，发生一个验证错误。',
  '500': '服务器发生错误',
  '502': '网关错误。',
  '503': '服务器暂时过载或维护。',
  '504': '网关超时。'
}
