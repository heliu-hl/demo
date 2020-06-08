import Taro, {Component} from '@tarojs/taro'
import {View, Text, Image} from '@tarojs/components'
import './roomListItem.styl'
import {getCacheData} from "../../../utils";
import {MEETING_ROOM_ADMIN} from "../../constants";

const iconResource = [
  {image: require('../../../assets/images/icon_blue.png')},
  {image: require('../../../assets/images/icon_green.png')},
  {image: require('../../../assets/images/icon_purple.png')},
  {image: require('../../../assets/images/icon_orange.png')}
]

class RoomListItem extends Component {

  constructor(props) {
    super(props)
  }

  handleClick(bookId,e) {
    Taro.navigateTo({url: '../reservation/reservationDetail?bookId=' + bookId})
  }

  render() {
    const {meetingRoomData, itemIndex} = this.props
    console.info(meetingRoomData)
    const icon = iconResource[itemIndex % iconResource.length]
    return (
      <View className='roomItem' onClick={this.handleClick.bind(this, meetingRoomData.bookId)}>
        <View className='header'>
          <Image src={icon.image} className='roomIcon'/>
          <Text className='header-title'>{meetingRoomData.activityName}</Text>
        </View>
        <View className='body'><Text>{meetingRoomData.roomName}</Text></View>
        <View className='footer'>
          <Text>{meetingRoomData.showDate + " " + meetingRoomData.showStartTime + '-' + meetingRoomData.showEndTime}</Text>
        </View>

        <View className='auditPanel'>
          <Text>{meetingRoomData.auditState}</Text>
          <View className='arrow' />
        </View>
      </View>
    )
  }
}

export default RoomListItem
