import Taro, {Component} from '@tarojs/taro'

class MHTComponent extends Component {
  static options = {
    addGlobalClass: true
  }

  constructor() {
    super(...arguments)
    this.state = {
      needRefresh: false,
      isError: false,
      errorMessage: '出错了',
      showToast: false,
      isOpened: false,
      toastMessage: '提示',
      toastDuration: 1500,
      iPhoneX: false,
    }
    this.timeout = null;
  }


  toast(message, callback) {
    this.setState({
      showToast: true,
      toastMessage: String(message)
    }, () => {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.setState({
          showToast: false
        }, () => {
          if (callback) {
            callback();
          }
        })
      }, this.state.toastDuration)
    })
  }

  resetToast() {
    this.setState({
      showToast: false,
      toastMessage: ''
    })
  }

  setupError(message) {
    this.setState({
      isError: true,
      errorMessage: String(message || '未知错误')
    })
  }

  resetError() {
    this.setState({
      isError: false,
      errorMessage: '出错了'
    })
  }

}

export default MHTComponent
