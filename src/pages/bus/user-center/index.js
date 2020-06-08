import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem, Form } from '@tarojs/components'
import './index.styl'
import { AtNoticebar } from "taro-ui"
import iconReserve from '../../../assets/images/icon-reserve.png'
import iconTicket from '../../../assets/images/icon-ticket.png'
import { isNullEmpty } from "../../../utils"
import { busUrl } from "../../../config";
import { BUS_USER_INFO } from "../../constants"

export default class UserCenter extends Component {
  config = {
    navigationBarTitleText: '班车预约'
  }

  constructor() {
    super()
    this.state = {
      busNoticeList: []
    }
  }
  handleReserve() {
    Taro.navigateTo({ url: '../index' })
  }

  handleTicket() {
    Taro.navigateTo({ url: '../ticket/index' })
  }

  componentWillMount() {
    this.getBusNotice()
  }
  getBusNotice() {
    const that = this
    Taro.request({
      url: busUrl + 'bus/getMessageList',
      success(res) {
        console.info(res)
        that.setState({
          busNoticeList: res.data
        })
      }, fail(e) {
        console.info(e)
      }
    })
  }

  handleNoticeClick(messageId) {
    const noticeDetailUrl = busUrl + 'bus/toMessageDetail?messageId=' + messageId;
    Taro.navigateTo({ url: '../../common/commonWebView?url=' + encodeURIComponent(noticeDetailUrl) })
  }
  clearCache(e) {
    Taro.showModal({
      title: '确认清除缓存',
      content: "确认清除本地缓存？若需要绑定新的账号，清除本地缓存后需联系管理员删除原有绑定记录才可绑定新的账号。"
    }).then(res => {
      if (res.confirm) {
        Taro.removeStorageSync(BUS_USER_INFO);
        Taro.redirectTo({
          url: "../bind-account/index"
        })
      }
    })
  }
  render() {
    const hideSwiper = isNullEmpty(this.state.busNoticeList);

    // const switerItem = this.state.busNoticeList.map((item, index) => {
    //   return (<SwiperItem key={index} onClick={this.handleNoticeClick.bind(this, item.messageId)}>
    //     <View>{item.messageTitle}</View>
    //   </SwiperItem>)
    // })

    const msgitem = this.state.busNoticeList.map(item => {
      return (
        <View View onClick={this.handleNoticeClick.bind(this, item.messageId)} >
          <AtNoticebar icon='volume-plus' close={true} single={true} marquee={true} hidden={hideSwiper} speed={50} >{item.messageTitle}</AtNoticebar>
        </View>
      )
    })

    return (
      <View className='index' >
        {/* <Swiper
          className='bus-notice-swiper'
          vertical
          circular
          hidden={hideSwiper}
          interval={5000}
          autoplay>
          {switerItem}
        </Swiper> */}
        <View style="position:fixed;top:0;width:100%; heigth:40px;font-size:30px">
          {msgitem}
        </View>
        <View className="clear" onClick={this.clearCache.bind(this)} > 清除缓存</View>
        <View className='item-background,bg-blue' onClick={this.handleReserve.bind(this)}>
          <Image src={iconReserve} className='img' ></Image>
          <Text >车次列表</Text>
        </View>
        <View className='item-background,bg-red' onClick={this.handleTicket.bind(this)}>
          <Image src={iconTicket} className='img'></Image>
          <Text >我的车票</Text>
        </View>
      </View >
    )
  }
}
