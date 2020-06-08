import Taro, { Component } from '@tarojs/taro'
import { WebView } from '@tarojs/components'
import { busUrl } from "../../config";
import { getCacheData } from "../../utils";
import { BUS_USER_INFO } from "../constants";

export default class BusReserve extends Component {

  // 正确写法
  componentWillMount() {
    let scheduleId = this.$router.params.scheduleId
    this.setState({
      scheduleId
    })
  }
  render() {
    let openid = getCacheData(BUS_USER_INFO).openid;
    const { scheduleId } = this.state
    const url = busUrl + 'bus/toBusDetail?aca050=' + scheduleId + '&openid=' + openid;

    console.info(url)
    return (
      <WebView src={url} />
    )
  }
}
