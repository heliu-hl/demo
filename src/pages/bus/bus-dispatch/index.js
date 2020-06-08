import Taro from '@tarojs/taro'
import MHTComponent from "../../common/MHTComponent";
import { View, Picker, Text, Switch, CheckboxGroup, Checkbox } from '@tarojs/components'
import { AtButton, AtCalendar, AtToast } from 'taro-ui'
import './index.styl'
// import "taro-ui/dist/h5/components/tag/index.scss"
import { observer, inject } from '@tarojs/mobx'
import ErrorTip from "../../../components/tip/ErrorTip";
import { doBusDispatch } from "../../../service";
import { getCacheData } from "../../../utils";
import { BUS_USER_INFO } from "../../constants";


@inject((stores) => ({
  busDispatchStore: stores.busDispatchStore
}))
@observer
export default class BusDispatch extends MHTComponent {
  config = {
    navigationBarTitleText: '班车调度'
  }
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      routeName: '',
      routeId: -1,
      driverName: '',
      timeList: [],
      startTime: '',
      timeId: -1,
      date: new Date(),
      stuAppoint: true,
      teaAppoint: false,
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
      carTypeId: 'student',
      driverSelectList: [],
      isRoll: false
    }
  }

  componentWillMount() {
    this.fetchBusDispatchInfo(this.state.date, this.state.carTypeId);
  }
  fetchBusDispatchInfo(date, type) {
    this.props.busDispatchStore.fetchBusDispatchInfo(date.Format('YYYY-MM-dd'), type).then((res) => {
      this.resetError()
    }).catch((e) => {
      this.setupError(e.message)
    })
  }

  handlePickerChange(type, e) {
    let value = e.detail.value
    if (type === 'route') {
      let routeItem = this.props.busDispatchStore.routeList[value]
      let route = routeItem.start + '\xa0' + '至' + '\xa0' + routeItem.end
      this.setState({
        showToast: false,
        routeName: route,
        routeId: routeItem.routId,
        timeList: routeItem.timeList
      })
    } else if (type === 'time') {
      let timeItem = this.state.timeList[value]
      this.setState({
        startTime: timeItem.startTime,
        timeId: timeItem.timeId
      })
    } else if (type === 'driver') {
      let driverItem = this.props.busDispatchStore.driverList[value]
      this.setState({
        driverName: driverItem.driverName,
        driverId: driverItem.driverId
      })
    }
  }

  handleChooseTime() {
    if (this.state.routeName === '') {
      this.setState({
        showToast: true,
        toastMessage: '请先选择路线再选时间'
      })
    } else {
      this.setState({ showToast: false })
    }
  }

  handleErrorClick() {
    this.setState({ showToast: false })
    this.fetchBusDispatchInfo(this.state.date, this.state.carTypeId)
  }

  onDaySelected(e) {
    console.log(e, "UUU")
    this.setState({
      date: new Date(e.value),
      routeName: '',
      driverName: '',
      startTime: '',
      showToast: false
    })
    this.fetchBusDispatchInfo(new Date(e.value), this.state.carTypeId)
  }

  handleSwitchClick(type, e) {
    if ('stu' === type) {
      this.setState({ stuAppoint: e.detail.value, showToast: false })
    } else if ('teacher' === type) {
      this.setState({ teaAppoint: e.detail.value, showToast: false })
    }
  }

  handleBusDispatch() {
    let that = this
    if (this.state.routeId === -1 || this.state.timeId === -1 || this.state.driverSelectList.length == 0) {
      this.setState({ showToast: true, toastMessage: '请确认所有信息都已填入！' })
      return;
    } else {
      let roll = "";
      if (this.state.isRoll) {
        roll = "1"
      } else {
        roll = "0"
      }
      let params = {
        roll: roll,
        timeId: this.state.timeId,
        driverId: this.state.driverSelectList,
        routeId: this.state.routeId,
        date: this.state.date.Format('YYYY-MM-dd'),
        openid: getCacheData(BUS_USER_INFO).openid
      }
      console.log(params, "DDD")
      doBusDispatch(params).then((res) => {
        this.resetError()
        this.setState({ showToast: true, toastMessage: res.msg })
        that.navigateBack()
      }).catch((e) => {
        console.log(e, "KKK")
        this.setupError(e.message)
      });
    }
  }

  navigateBack() {
    let pages = Taro.getCurrentPages();
    let prePage = pages[pages.length - 2]
    prePage.$component.setState({ needRefresh: true })
    Taro.navigateBack({ delta: 1 })
  }
  clickCarType(type, e) {
    console.log(type, "KKK")
    this.setState({
      carTypeId: type,
      startTime: '',
      routeName: '',
      timeId: -1,
      routeId: -1,
      showToast: false
    }, () => {
      this.fetchBusDispatchInfo(this.state.date, this.state.carTypeId)
    })
  }
  selectChange(e) {
    const str = e.detail.value.join(",")
    console.log(str)
    this.setState({
      driverSelectList: str
    })
  }
  handleSwitchClick(e) {
    this.setState({
      isRoll: e.detail.value
    })
  }
  render() {
    const { busDispatchStore: { driverList, routeList, loading } } = this.props
    const { isError, errorMessage, showToast, toastMessage, toastDuration, carType, carTypeId } = this.state
    const routeData = routeList.map((item, index) => {
      let route = {
        routeName: item.start + '\xa0\xa0\xa0' + '至' + '\xa0\xa0\xa0' + item.end,
        routeId: item.routeId
      }
      return route
    })
    const carTypeList = carType.map((item, index) => {
      return (
        <View key={index} className={item.id == carTypeId ? 'car_type_item' : ''} onClick={this.clickCarType.bind(this, item.id)}>{item.type}</View>
      )
    })
    const driverSelect = driverList.map((v, i) => {
      return (
        <View key={i} className="multiple_choice_box_item">
          <Checkbox value={v.driverId}>{v.driverName}</Checkbox>
          {/* <View>{v.driverName}</View> */}
        </View>
      )
    })
    const timePickerDisabled = this.state.routeName === ''
    const currentDate = this.state.date.getTime()
    return (
      <View className='root'>
        {!(isError || loading) &&
          <View>
            <AtCalendar onDayClick={this.onDaySelected.bind(this)} currentDate={currentDate} />
            <View className="car_type_list">
              {carTypeList}
            </View>



            {/*选择路线*/}
            <View className='item-container'>
              <View className='descName'>请选择路线</View>
              <Picker className='picker' mode={"selector"} range={routeData} rangeKey='routeName'
                onChange={this.handlePickerChange.bind(this, 'route')}>
                <Text className='text-with-arrow'>{this.state.routeName}</Text>
              </Picker>
            </View>



            {/*选择时间*/}
            <View className='item-container'>
              <View className='descName'>请选择时间</View>
              <Picker className='picker' mode={"selector"} range={this.state.timeList} disabled={timePickerDisabled}
                rangeKey='startTime'
                onChange={this.handlePickerChange.bind(this, 'time')}>
                <Text className='text-with-arrow' onClick={this.handleChooseTime.bind(this)}>{this.state.startTime}</Text>
              </Picker>
            </View>



            {/*选择司机*/}
            <View className="item-container-driver">
              <View>请选择司机</View>
              <CheckboxGroup onChange={this.selectChange.bind(this)}>
                <View className="item-container-driver-select">
                  {driverSelect}
                </View>
              </CheckboxGroup>
            </View><View className='item-container'>
              <View className='descName'>滚动班次</View>
              <View className='switch-container'>
                <Switch color='#4279E6' onChange={this.handleSwitchClick.bind(this)} />
              </View>
            </View>
            <View className="tip_text">注：如勾选班次为“滚动班次”，则当超过发车时间仍无人预约该班次，则该班次将自动取消并短信通知驾驶员和调度人员。</View>




            <AtButton onClick={this.handleBusDispatch.bind(this)} type='primary' size={"normal"}
              customStyle='margin:20px'>添加班次</AtButton>
          </View>
        }
        {
          (isError || loading) &&
          <View className='grow-container' style='color:#333'>
            <ErrorTip loading={loading} message={errorMessage}
              onClick={this.handleErrorClick.bind(this)} />
          </View>
        }
        <AtToast
          isOpened={showToast}
          duration={toastDuration}
          text={toastMessage}
          isHiddenIcon={true} />
      </View >
    )
  }
}
