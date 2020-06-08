import Taro, { Component } from '@tarojs/taro'
// 引入 WebView 组件
import { WebView } from '@tarojs/components'
class App extends Component {
  render () {
    return (
      <WebView src='https://mp.weixin.qq.com/'  />
    )
  }
}