import Taro from '@tarojs/taro'
import { Text, View, Image } from '@tarojs/components'
import MHTComponent from "../../common/MHTComponent";
import { observer, inject } from '@tarojs/mobx'
import '../index.styl'
import EmptyStateComponent from "../../common/EmptyStateComponent";
import ErrorTip from "../../../components/tip/ErrorTip";
import { busUrl } from "../../../config";
import { getCacheData } from "../../../utils";
import { BUS_USER_INFO } from "../../constants";

@inject((stores) => ({
  busDispatchStore: stores.busDispatchStore
}))
@observer
export default class DispatchList extends MHTComponent {
  state = {
    ...this.state,
    carType: [
      {
        type: "学生班车",
        id: 'student'
      },
      {
        type: "教工班车",
        id: 'teacher'
      }
    ],
    carTypeId: 'student'
  }
  config = {
    navigationBarTitleText: '调度列表'
  }
  componentWillMount() {
    this.fetchDispatcherBusList(this.state.carTypeId)
  }

  handleClick(scheduleId) {
    let openid = getCacheData(BUS_USER_INFO).openid;
    const dispatcherBusDetail = busUrl + 'bus/toDispatcherPage?scheduleId=' + scheduleId + '&openid=' + openid
    Taro.navigateTo({ url: '../../common/commonWebView?url=' + encodeURIComponent(dispatcherBusDetail) })
  }
  handleErrorClick() {
    this.fetchDispatcherBusList(this.state.carTypeId)
  }

  fetchDispatcherBusList(type) {
    this.props.busDispatchStore.fetchDispatcherBusList(type).then((res) => {
      this.resetError()
    }).catch((e) => {
      this.setupError(e.message)
    })
  }

  componentDidShow() {
    if (this.state.needRefresh) {
      this.fetchDispatcherBusList(this.state.carTypeId)
      this.setState({
        needRefresh: false
      })
    }
  }
  clickCarType(type, e) {
    this.setState({
      carTypeId: type,
    }, () => {
      this.fetchDispatcherBusList(this.state.carTypeId)
    })
  }
  addBus() {
    Taro.navigateTo({ url: './index' })
  }
  clickScan() {
    Taro.navigateTo({
      url: "../scanQRCode/index?role=dis&busId=''"
    })
  }
  render() {
    const { busDispatchStore: { loading, dispatcherBusList } } = this.props
    console.log(dispatcherBusList, "KKK")
    const { isError, errorMessage, carType, carTypeId } = this.state
    const carTypeList = carType.map((item, index) => {
      return (
        <View key={index} className={item.id == carTypeId ? 'car_type_item' : ''} onClick={this.clickCarType.bind(this, item.id)}>{item.type}</View>
      )
    })
    const itemView = dispatcherBusList.map((item, key) => {
      return (
        <View className='bus-list-item' key={key} onClick={this.handleClick.bind(this, item.scheduleid)}>
          <View className='bus-item-content'>
            <View className='bus-time'>
              <Text className='left'>出发：{item.startime}</Text>
              <View className='middle'></View>
              <Text className='right' hidden={true}>到达：{item.endtime}</Text>
            </View>
            <View className='bus-info'>
              <Text className='left,bus-location,bus-location-left'>{item.startpoint}</Text>
              <View className='middle'>
                <Text className='bus-site'>{item.date}</Text>
                <Text className='bus-number'>{item.driver}</Text>
              </View>
              <Text className='right,bus-location,bus-destination-right'>{item.endpoint}</Text>
            </View>
          </View>
        </View>
      );
    })

    const busData = dispatcherBusList.length > 0 ? itemView : <EmptyStateComponent emptyStateHint='暂无排班信息\n\r点击右下角按钮进行排班' />
    return (
      <View className='index'>
        <View className="car_type_list">
          {carTypeList}
        </View>
        {!(isError || loading) &&
          busData
        }
        {(isError || loading) &&
          <View className='grow-container' style='color:#333'>
            <ErrorTip loading={loading} message={errorMessage}
              onClick={this.handleErrorClick.bind(this)} />
          </View>
        }
        {!(isError || loading) &&
          <View>
            <View className='floating-bar' onClick={this.addBus.bind(this)}>班</View>
            <Image onClick={this.clickScan.bind(this)} className="scanQRCode_sty" src={require("../../../assets/images/scan.png")} />
          </View>

        }
      </View>
    )
  }
}
