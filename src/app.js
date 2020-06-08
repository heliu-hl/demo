import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/mobx'
import Index from './pages/index'

import './app.styl'
import './custom-modal.scss'
import './font/iconfont.css'

import { createStoreMap } from "./store/index";

const store = createStoreMap()

class App extends Component {


  config = {
    pages: [
      'pages/index/index',
      // 'pages/secondhand_market/upload/index',
      // 'pages/secondhand_market/mine/index',
      // 'pages/secondhand_market/index',
      'pages/meeting-room/index',
      'pages/meeting-room/login/index',
      'pages/meeting-room/booking-list/index',
      'pages/meeting-room/reservation/index',
      'pages/meeting-room/reservation/reservationDetail',
      'pages/meeting-room/reservation/reserve',
      'pages/meeting-room/reservation/chooseDate',
      'pages/meeting-room/upload-file/uploadAuditImg',
      'pages/pay/index',
      'pages/bus/index',
      'pages/bus/reserve',
      'pages/bus/bind-account/index',
      'pages/bus/bus-dispatch/index',
      'pages/bus/bus-dispatch/list',
      'pages/bus/user-center/index',
      'pages/bus/ticket/index',
      'pages/bus/fareDetail/index',
      'pages/bus/scanQRCode/index',
      'pages/bus/user-center/driver',
      'pages/common/commonWebView',
      // 'pages/secondhand_market/productDetail/index',
      'pages/lost-luggage/index',
      'pages/lost-luggage/up/index',
      'pages/lost-luggage/my/index',
      'pages/lost-luggage/report/index',
      'pages/lost-luggage/loss/index',
      'pages/lost-luggage/loss-detail/index',
      'pages/epidemic_situation/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    navigateToMiniProgramAppIdList: [
      "wx92e266b01d57457a",
      "wxba2c83c0bce77e60",
      "wx856e5f5ed2e7a7bc",
      "wxd340e350e360bf0a",
      "wxce2b7a5a3d064d2e"
    ]
  }

  componentWillMount() {
    if (Taro.canIUse('getUpdateManager')) {
      const updateManager = Taro.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          console.log(res.hasUpdate, "update ok")
          updateManager.onUpdateReady(function () {
            Taro.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？如果不更新有些功能可能无法使用',
              confirmText: "重启",
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            Taro.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      Taro.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  }

  componentDidMount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  componentDidCatchError() {
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
