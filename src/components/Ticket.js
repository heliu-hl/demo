import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import './Ticket.styl'

class Ticket extends Component {

  constructor(props) {
    super(props)
  }
  render() {
    const {isInvalid,ticketData} = this.props
    const ticketImgClass = ticketData.state === 2 ? 'ticket-img;img-evaluated' :  'ticket-img;img-evaluating'
     return (
      <View className='ticket-item' onClick={this.props.onClick}>
        <View className='ticket-item-content'>
          {/*起点与终点*/}
          <View className='bus-info'>
            <Text className='left,bus-location,bus-location-left'>{ticketData.start}</Text>
            <View className='middle'>
              <Text className='bus-site'>{ticketData.busname===null ? '':ticketData.busname}</Text>
              <Text className='bus-number'></Text>
            </View>
            <Text className='right,bus-location,bus-destination-right'>{ticketData.end}</Text>
          </View>
          <View className='ticket-info,ticket-info-column'>
            <Text>发车时间：{ticketData.startdate}-{ticketData.startime}</Text>
            <Text className='top-margin12'>购票时间：{ticketData.appointmentime}</Text>
            <Text className='top-margin12'>购票乘客：{ticketData.passenger}</Text>
          </View>
          <View className='ticket-info,horizontal-align'>
            <Text>座位编号：</Text>
            <Text className='seat-number'>{ticketData.seatnum}</Text>
          </View>
          <View className={ticketImgClass} hidden={!isInvalid} />
        </View>
      </View>

    )
  }
}

export default Ticket
