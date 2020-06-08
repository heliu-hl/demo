import Taro,{Component} from '@tarojs/taro'
import {View,Text} from '@tarojs/components'
import './index.styl'
import { getCacheData} from "../../utils";
import {MEETING_ROOM_ADMIN} from "../constants";

export default class MeetingRoom extends Component{
  config = {
    navigationBarTitleText : '会议室预定管理'
 }

  constructor(props) {
    super(props)
    this.state={
      hideLogoutBtn : true
    }
  }
  handleItemClick(index) {
    switch (index) {
      case 1:
        //TODO 进入会议室预约查看界面
        Taro.navigateTo({url:'./reservation/index'})
        break

      case 2:
        //TODO 判断是否登录
        // clearCacheData()
        const admin = getCacheData(MEETING_ROOM_ADMIN)
        console.info(admin)
        if (admin) {
          Taro.navigateTo({url:'../../pages/meeting-room/booking-list/index'});
        }else {
          Taro.navigateTo({url:'./login/index'});
        }

        break
    }
  }

  componentDidShow() {
    if (getCacheData(MEETING_ROOM_ADMIN)) {
      this.setState({
        hideLogoutBtn : false
      })
    }else {
      this.setState({
        hideLogoutBtn : true
      })
    }
  }

  handleLoginOut() {
    Taro.removeStorageSync(MEETING_ROOM_ADMIN)
    Taro.navigateTo({url:'./login/index'})
  }
  render() {
    const userInfo = getCacheData(MEETING_ROOM_ADMIN)
    const itemName = userInfo ? (userInfo.isManager ? '审核列表':'我的预定') : '我的预定'
    return(
      <View className='index'>
        <View  className={this.state.hideLogoutBtn? 'header-invisible' : 'header'}>
          <View className='item-name'>你好,{userInfo.name}</View>
          <View onClick={this.handleLoginOut.bind(this)} className='item-login-out'>切换账号</View>
        </View>
        <View className='item-background;bg-meeting-room' onClick={this.handleItemClick.bind(this,1)}>
          <Text>Booking Overview</Text>
          <Text className='text-big'>会议室预定</Text>
        </View>
        <View className='item-background;bg-reservation'onClick={this.handleItemClick.bind(this,2)}>
          <Text>My Reservation</Text>
          <Text className='text-big'>{itemName}</Text>
        </View>
      </View>
    )
  }
}
