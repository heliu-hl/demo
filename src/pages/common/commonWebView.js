import Taro,{Component} from '@tarojs/taro'
import {WebView} from '@tarojs/components'

export default class CommonWebView extends Component{
  componentWillMount() {
    //获取传过来的url,记得再传递url时进行编码，否则url传递的参数将获取不到
    this.url = this.$router.params.url
  }
  render() {
    return(
      <WebView src={this.url}/>
    )
  }
}
