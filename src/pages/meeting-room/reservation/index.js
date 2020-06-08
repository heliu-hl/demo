import Taro, {Component} from '@tarojs/taro'
import {View, Text, Image} from '@tarojs/components'
import './index.styl'
import ArrowLeft from '../../../assets/images/arrow_left.png'
import ArrowRight from '../../../assets/images/arrow_right.png'
import RoomReserveItem from "./RoomReserveItem";
import {preDate, lastDate, isNullEmpty, showSimpleToast} from "../../../utils";
import {observer, inject} from '@tarojs/mobx'
import MHTComponent from "../../common/MHTComponent";
import ErrorTip from '@components/tip/ErrorTip'
import {AtModal} from "taro-ui";

@inject((stores) => ({
  meetingRoomInfoStore: stores.meetingRoomInfoStore
}))
@observer
class Reservation extends MHTComponent {
  config = {
    navigationBarTitleText: '会议室预定情况'
  }

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      date: new Date()
    }
    //点击锁定之前的roomId和时间
    this.roomId = -1
    this.startTime = ''
    this.endTime = ''
    this.lockId = -1
  }

  componentWillMount() {
    this.fetchMeetingRoomInfo(this.state.date)
  }

  componentDidShow() {
    this.fetchMeetingRoomInfo(this.state.date)
  }

  fetchMeetingRoomInfo(date) {
    this.props.meetingRoomInfoStore.getMeetingRoomList()
      .then((res) => {
        return this.requestInfoByDate(date)
      }).then((res) => {
      this.resetError()
    }).catch((e) => {
      this.setupError(e.msg)
    });
  }

  requestInfoByDate(date) {
    return this.props.meetingRoomInfoStore.getMeetingRoomInfo(date.Format('YYYY-MM-dd'));
  }

  /* 点击日期，跳转到选择日期界面*/
  handleDateSelect() {
    Taro.navigateTo({url: './chooseDate'})
  }

  /*点击左右箭头进行日期选择*/
  handleArrowClick(type) {
    let currentDate = this.state.date
    if (type === 'left') {
      let preDay = preDate(currentDate.getTime());
      this.fetchMeetingRoomInfo(preDay)
      this.setState({date: preDay})
    } else if (type === 'right') {
      let lastDay = lastDate(currentDate.getTime());
      this.fetchMeetingRoomInfo(lastDay)
      this.setState({date: lastDay})
    }
  }

  handleErrorClick() {
    this.fetchMeetingRoomInfo(this.state.date)
  }

  onReserveItemTap(item, time, lockId) {
    let currentRoomId = item.id;
    let currentTime = time;
    if (this.roomId === -1) {
      if (lockId && lockId!== -1) {
        //如果已锁定，弹框
        this.lockId = lockId
        this.setState({
          isOpened: true
        });
      } else {
        this.roomId = currentRoomId;
        this.startTime = currentTime
      }
    } else {
      if (this.roomId !== currentRoomId) {
        this.resetLockRoomInfo()
        showSimpleToast('两次点击相同的会场才能进行锁定哦')
      } else {
        if (parseInt(currentTime) < parseInt(this.startTime)) {
          this.endTime = this.startTime
          this.startTime = currentTime
        } else {
          this.endTime = currentTime
        }
        if (this.startTime !== this.endTime) {
          //刷新视图
          this.resetError()
          this.props.meetingRoomInfoStore.lockMeetRoom(this.roomId, this.state.date.Format('YYYY-MM-dd'), this.startTime, this.endTime)
            .then(() => {
              this.fetchMeetingRoomInfo(this.state.date)
            }).catch((e) => {
            this.resetError()
            showSimpleToast(e.message)
          }).finally(() => {
            this.resetLockRoomInfo()
          });
        } else {
          this.resetLockRoomInfo()
         showSimpleToast('不能选择相同的时间')
        }
      }
    }
  }

  resetLockRoomInfo() {
    this.roomId = -1
    this.startTime = ''
    this.endTime = ''
    this.lockId = -1
  }
  handleAtModalConfirm() {
    this.setState({
      isOpened: false
    })
    this.props.meetingRoomInfoStore.unLockMeetRoom(this.lockId).then(()=>{
      this.fetchMeetingRoomInfo(this.state.date)
    }).catch((e) => {
      showSimpleToast(e.message)
    })
  }

  handleAtModalCancel() {
    this.setState({
      isOpened: false
    })
  }

  render() {

    const {meetingRoomInfoStore: {title, loading, timeLine}} = this.props
    const {isError, errorMessage, date, isOpened} = this.state
    const titleItem = title.map((item, key) => {
      return (
        <Text className='item-text' key={key}>{item.name + '\n\r(' + item.aaa012 + ')'}</Text>
      )
    })
    const titleName = title.map((item) => {
      return item.name + '(' + item.aaa012 + '人)'
    })
    const listItem = timeLine.map((item, key) => {
      return (
        <RoomReserveItem
          key={key}
          titlelist={title}
          datalist={item.datalist}
          time={item.time}
          titleName={titleName}
          date={date}
          onItemTap={this.onReserveItemTap.bind(this)}
          onRefreshData = {this.fetchMeetingRoomInfo.bind(this,date)}
        />)
    })
    return (
      <View className='index'>
        {!(isError || loading) &&
        <View className='index-container'>
          <View className='header'>
            <View className='arrow-container' onClick={this.handleArrowClick.bind(this, 'left')}>
              <Image src={ArrowLeft} className='header-arrow' mode='scaleToFill'/>
            </View>
            <Text className='header-time'
                  onClick={this.handleDateSelect.bind(this)}>{this.state.date.Format('YYYY-MM-dd')}</Text>
            <View className='arrow-container' onClick={this.handleArrowClick.bind(this, 'right')}>
              <Image src={ArrowRight} className='header-arrow' mode='scaleToFill'/>
            </View>
          </View>
          <View className='item-room'>
            <Text className='item-first;item-text'>时间</Text>
            {titleItem}
          </View>
          {listItem}
          <View className='bottom-white'></View>
        </View>
        }
        {(isError || loading) &&
        <View className='grow-container'>
          <ErrorTip loading={loading} message={errorMessage}
                    onClick={this.handleErrorClick.bind(this)}/>
        </View>
        }
        <AtModal
          isOpened={isOpened}
          title='提示'
          cancelText='取消'
          confirmText='确认'
          onCancel={this.handleAtModalCancel.bind(this)}
          onConfirm={this.handleAtModalConfirm.bind(this)}
          content='是否要取消锁定?'
        />
      </View>
    )
  }
}

export default Reservation
