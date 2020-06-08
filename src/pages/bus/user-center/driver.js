import Taro from '@tarojs/taro'
import { WebView } from '@tarojs/components'
import MHTComponent from "../../common/MHTComponent";
import { busUrl } from "../../../config";
import { getCacheData } from "../../../utils";
import { BUS_USER_INFO } from "../../constants";

export default class DriverHomePage extends MHTComponent {
  render() {
    const openId = getCacheData(BUS_USER_INFO).openid;
    const url = busUrl + 'bus/toDriverPage?openid=' + openId;
    return (
      <WebView src={url} />
    )
  }
}
