import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.styl'
import { observer, inject } from '@tarojs/mobx'
import MHTComponent from "../common/MHTComponent";
import EmptyStateComponent from "../common/EmptyStateComponent";
import ErrorTip from "../../components/tip/ErrorTip";
import { getCacheData } from "../../utils";
import { BUS_USER_INFO } from "../constants";

@inject((stores) => ({
  busListStore: stores.busListStore
}))
@observer
class Bus_Search extends MHTComponent {
  config = {
    navigationBarTitleText: '车次列表'
  }

  constructor(props) {
    super(props)
    this.state = {
      ...this.state
    }
  }

  componentWillMount() {
    this.fetchBusList();
  }
  componentDidShow() {
    this.fetchBusList();
  }
  fetchBusList() {
    let type = getCacheData(BUS_USER_INFO).openid;
    this.props.busListStore.fetchBusList(type).then((res) => {
      this.resetError()
    }).catch((e) => {
      this.setupError(e.message)
    })
  }

  handleClick(item) {
    console.info(item)
    let scheduleId = item.scheduleid
    let routeId = item.routid
    let date = item.date
    Taro.navigateTo({ url: '../../pages/bus/reserve?scheduleId=' + scheduleId })
  }

  handleErrorClick() {
    this.fetchBusList()
  }
  render() {
    const { busListStore: { loading, busList } } = this.props
    console.log(busList, "KKK")
    const { isError, errorMessage } = this.state

    const itemView = busList.map((item, key) => {
      return (
        <View className='bus-list-item' key={key} onClick={this.handleClick.bind(this, item)}>
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
                <Text className='bus-number'>{item.busname}</Text>
              </View>
              <Text className='right,bus-location,bus-destination-right'>{item.endpoint}</Text>
            </View>
          </View>
        </View>
      );
    })
    const busData = busList.length > 0 ? itemView : <EmptyStateComponent emptyStateHint='当前时间暂无可预约车次' />
    return (
      <View className='index'>
        {!(isError || loading) && busData}
        {dataList}
        {(isError || loading) &&
          <View className='grow-container' style='color:#333'>
            <ErrorTip loading={loading} message={errorMessage}
              onClick={this.handleErrorClick.bind(this)} />
          </View>
        }
      </View>
    )
  }
}
export default Bus_Search
