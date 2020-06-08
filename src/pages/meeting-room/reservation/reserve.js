import Taro, {Component} from '@tarojs/taro'
import {View, Text, Picker, Button, Input, Switch} from '@tarojs/components'
import {AtTextarea, AtModal} from 'taro-ui'
import './reserve.styl'
import {getCacheData, isNullEmpty} from "../../../utils";
import {BASE_URL} from "../../../config";
import {MEETING_ROOM_ADMIN} from "../../constants";
import {inject, observer} from "@tarojs/mobx";
import MHTComponent from "../../common/MHTComponent";

@inject((stores) => ({
  reservationDetailStore: stores.reservationDetailStore
}))
@observer
class RoomReserve extends MHTComponent {
  config = {
    navigationBarTitleText: '会议室预定'
  }

  constructor(props) {
    super(props);
    this.state = {
      isOpened: false,
      roomList: [],
      roomSelected: '请选择会议室',
      layoutStartTime: '请选择布场开始时间',
      layoutEndTime: '请选择布场结束时间',
      rehearsalStartTime: '请选择彩排开始时间',
      rehearsalEndTime: '请选择彩排结束时间',
      showStartTime: '请选择演出开始时间',
      showEndTime: '请选择演出结束时间',
      layoutDate: '请选择布场日期',
      rehearsalDate: '请选择彩排日期',
      showDate: '请选择演出日期',
      errorMessage: '请确认所有信息都已填入！',
      isError: false,
      description: '',
      actType: '请选择活动类型',  //活动类型，仅成电会堂需要填写
      actTypeList: [],
      layoutVoiceControl: true,   //布场是否需要音控
      rehearsalVoiceControl: true, //彩排是否需要音控
      companyControl: false,//是否有外来公司布场
    };
    this.proposer = ''
    this.department = ''
    this.actName = ''
    this.leaderName = ''
    this.phoneNum = ''
    this.companyName = ''//公司名称
    this.companyTel = ''//公司电话
    this.actTypeCode = 0
    this.bookId = ''
    this.roomId = 0
  }

  componentWillMount() {
    this.bookId = this.$router.params.bookId
    this.roomId = this.$router.params.roomId;
    this.roomName = this.$router.params.roomName
    let title = this.$router.params.title
    this.setState({
      roomList: title.split('-'),
      roomSelected: this.roomName
    })
    this.getTypeList()
    if (!isNullEmpty(this.bookId)) {
      this.getReservationDetail(this.bookId);
    }
  }

  //管理员编辑信息
  getReservationDetail(bookId) {
    const that = this
    this.props.reservationDetailStore.fetchReservationDetail(bookId).then((res) => {
      that.editInfoByAdmin(res.data)
    }).catch((e) => {
      this.setupError(e)
    })
  }

  editInfoByAdmin(data) {
    this.setState({
      // roomId:data.roomId,
      layoutDate: data.layoutDate,
      layoutStartTime: data.layoutStartTime,
      layoutEndTime: data.layoutEndTime,
      rehearsalDate: data.rehearsalDate,
      rehearsalStartTime: data.rehearsalStartTime,
      rehearsalEndTime: data.rehearsalEndTime,
      showDate: data.showDate,
      showStartTime: data.showStartTime,
      showEndTime:data.showEndTime,
      actType : data.type,
      roomSelected:data.roomName,
      layoutVoiceControl: data.layoutVoiceControl === 1,
      rehearsalVoiceControl: data.rehearsalVoiceControl === 1,
      companyControl: data.isCompany,
      description:data.content,
      type:data.actTypeCode,
      bookId :this.bookId,
      auditCode : this.auditCode,
  })
    this.roomId = data.roomId
    this.roomName = data.roomName
    this.proposer = data.personName
    this.actName = data.activityName
    this.leaderName = data.activityManager
    this.phoneNum = data.mobile
    this.companyName = data.companyName//公司名称
    this.companyTel = data.companyTel//公司电话
    this.actTypeCode = data.actTypeCode
    this.auditCode = data.auditCode
  }

  handlePickerChange(type, e) {
    let value = e.detail.value
    this[type] = value
    if (type === 'roomName') {
      this.roomId = parseInt(value) + 1
      this.setState({roomSelected: this.state.roomList[value]})
    } else if (type === 'layoutDate') {
      this.setState({layoutDate: value})
    } else if (type === 'layoutStartTime') {
      this.setState({layoutStartTime: value})
    } else if (type === 'layoutEndTime') {
      this.setState({layoutEndTime: value})
    } else if (type === 'rehearsalDate') {
      this.setState({rehearsalDate: value})
    } else if (type === 'rehearsalStartTime') {
      this.setState({rehearsalStartTime: value})
    } else if (type === 'rehearsalEndTime') {
      this.setState({rehearsalEndTime: value})
    } else if (type === 'showDate') {
      this.setState({showDate: value})
    } else if (type === 'showStartTime') {
      this.setState({showStartTime: value})
    } else if (type === 'showEndTime') {
      this.setState({showEndTime: value})
    } else if (type === 'actType') {
      console.info(value)
      this.actTypeCode = this.state.actTypeList[value].id
      this.setState({actType: this.state.actTypeList[value].name})
    }

  }

  handleInputConfirm(type, e) {
    let value = e.detail.value
    this[type] = value//对象的数组写法
  }

  getTypeList() {
    let that = this
    Taro.request({
      url: BASE_URL + 'propertyAPI/getTypeList',
      data: {
        codeType: 'aba114'
      }, success(res) {
        that.setState({actTypeList: res.data})
      }
    })
  }

  doReserve() {
    const companyControl = this.state.companyControl ? 1 : 0;//判断是否有布场公司

    const that = this
    const admin = getCacheData(MEETING_ROOM_ADMIN);
    const layoutDate = this.state.layoutDate === '请选择布场日期' ? '' : this.state.layoutDate
    const layoutStartTime = this.state.layoutStartTime === '请选择布场开始时间' ? '' : this.state.layoutStartTime
    const layoutEndTime = this.state.layoutEndTime === '请选择布场结束时间' ? '' : this.state.layoutEndTime

    const rehearsalDate = this.state.rehearsalDate === '请选择彩排日期' ? '' : this.state.layoutDate
    const rehearsalStartTime = this.state.rehearsalStartTime === '请选择彩排开始时间' ? '' : this.state.layoutStartTime
    const rehearsalEndTime = this.state.rehearsalEndTime === '请选择彩排结束时间' ? '' : this.state.layoutEndTime
    Taro.request({
      url: BASE_URL + 'propertyAPI/addBookInfo',
      method: 'GET',
      data: {
        roomId: this.roomId,
        personId: admin.personId,
        personName: this.proposer,
        deptName: getCacheData(MEETING_ROOM_ADMIN).deptName,
        activityName: this.actName,
        activityManager: this.leaderName,
        mobile: this.phoneNum,
        layoutStartTime: layoutStartTime,
        layoutEndTime: layoutEndTime,
        rehearsalStartTime: rehearsalStartTime,
        rehearsalEndTime: rehearsalEndTime,
        showStartTime: this.state.showStartTime,
        showEndTime: this.state.showEndTime,
        layoutDate: layoutDate,
        rehearsalDate: rehearsalDate,
        showDate: this.state.showDate,
        content: this.state.description,
        type: this.actTypeCode,
        layoutVoiceControl: this.state.layoutVoiceControl,   //布场是否需要音控
        rehearsalVoiceControl: this.state.rehearsalVoiceControl,//彩排是否需要音控
        isCompany: companyControl,//彩排是否有公司来布场
        companyName: this.companyName,//彩排公司名称
        companyTel: this.companyTel,//彩排公司电话
        bookId: this.bookId,
        auditCode:this.auditCode
      }, success(res) {
        if (res.data.flag) {
          Taro.redirectTo({url: '../booking-list/index?personId=' + admin.personId + '&isManager=' + admin.isManager});
        } else {
          console.info(res)
          that.setState({
            isError: true,
            errorMessage: res.data.msg
          })
        }
      }, fail(res) {
        console.info(res)
        that.setState({
          isError: true,
          errorMessage: res.data.msg
        })
      }

    })
  }

  handleReserve() {
    const companyControl = this.state.companyControl;//查看是否需要外来公司布场的状态
    //先隐藏错误提示
    this.setState({
      isError: false
    })
    //如果信息输入完全，弹出提示用户确认，如果没有，则提示用户进行输入
    if (isNullEmpty(this.actName)) {
      this.setState({isError: true,})
    } else if (isNullEmpty(this.leaderName)) {
      this.setState({isError: true,})
    } else if (isNullEmpty(this.proposer)) {
      this.setState({isError: true,})
    } else if (isNullEmpty(this.phoneNum)) {
      this.setState({isError: true,})
    } else if (isNullEmpty(this.roomName)) {
      this.setState({isError: true,})
    } else if (isNullEmpty(this.state.showDate)) {
      this.setState({isError: true,})
    } else if (isNullEmpty(this.state.showStartTime)) {
      this.setState({isError: true,})
    } else if (isNullEmpty(this.state.showEndTime)) {
      this.setState({isError: true,})
    } else if (this.roomId === 2) {
      //成电会堂需要判断是否选择活动类型
      if (isNullEmpty(this.state.actType)) {
        this.setState({isError: true,})
      } else {
        this.setState({
          isError: false,
          isOpened: true
        })
      }
    } else {
      if (companyControl) {
        //如果有公司来布场，则判断公司名称，公司电话是否为空
        if (isNullEmpty(this.companyName)) {
          this.setState({isError: true,})
        } else if (isNullEmpty(this.companyTel)) {
          this.setState({isError: true,})
        } else {
          this.setState({
            isOpened: true,
            isError: false
          })
        }
      } else {
        // this.doReserve();
        this.setState({
          isOpened: true,
          isError: false
        })
      }
    }
  }

  handleDescription(event) {
    this.setState({
      description: event.target.value
    })
  }

  handleSwitchClick(type, e) {
    if ('layout' === type) {
      this.setState({layoutVoiceControl: e.detail.value})
    } else if ('rehearsal' === type) {
      this.setState({rehearsalVoiceControl: e.detail.value})
    } else if ('company' === type) {
      //控制是否有外来公司布场
      this.setState({companyControl: e.detail.value})
      if (!e.detail.value) {
        this.companyName = ''
        this.companyTel = ''
      }
    }
  }

  // 模态框确认
  handleAtModalConfirm() {
    const that = this
    that.setState({
      isOpened: false
    }, function () {
      that.doReserve();
    })
  }

  // 模态框关闭
  handleAtModalCancel() {
    this.setState({
      isOpened: false
    })
  }

  render() {
    const {isOpened} = this.state;
    const companyControlButton = this.state.companyControl;
    const isHiddenType = this.roomId != 2
    const buttonText =isNullEmpty(this.bookId)? "立即预定":"立刻修改"
    const typeList = this.state.actTypeList.map(item => {
      return item.name
    })
    return (
      <View className='root'>
        <View className='container'>
          <Text className='title'>会议室申请</Text>
          {/*选择会议室*/}
          <View className='item-container'>
            <View className='descName'>会议室：</View>
            <Picker mode='selector' range={this.state.roomList} className='picker'
                    onChange={this.handlePickerChange.bind(this, 'roomName')}>
              <View className='round-corner'>
                <Text className='text-with-arrow'>{this.state.roomSelected}</Text>
              </View>
            </Picker>
          </View>
          {/*选择活动类型，仅成电会堂需要*/}
          <View className='item-container' hidden={isHiddenType}>
            <View className='descName'>申请类别：</View>
            <Picker mode='selector' range={typeList} className='picker'
                    onChange={this.handlePickerChange.bind(this, 'actType')}>
              <View className='round-corner'>
                <Text className='text-with-arrow'>{this.state.actType}</Text>
              </View>
            </Picker>
          </View>

          {/*申请人*/}
          <View className='item-container'>
            <View className='descName'>申请人：</View>
            <View className='round-corner'>
              <Input placeholderStyle='color:#666' className='input-container' placeholder='输入申请人' value={this.proposer}
                     onInput={this.handleInputConfirm.bind(this, 'proposer')}
              />
            </View>
          </View>
          {/*部门*/}
          <View className='item-container' hidden>
            <View className='descName'>部门：</View>
            <View className='round-corner'>
              <Input placeholderStyle='color:#666' className='input-container' placeholder='输入部门'
                     onInput={this.handleInputConfirm.bind(this, 'department')}
              />
            </View>
          </View>
          {/*活动名称*/}
          <View className='item-container'>
            <View className='descName'>活动名称：</View>
            <View className='round-corner'>
              <Input placeholderStyle='color:#666' className='input-container' placeholder='输入活动名称' value={this.actName}
                     onInput={this.handleInputConfirm.bind(this, 'actName')}
              />
            </View>
          </View>
          {/*负责人*/}
          <View className='item-container'>
            <View className='descName'>负责人：</View>
            <View className='round-corner'>
              <Input placeholderStyle='color:#666' className='input-container' placeholder='输入负责人' value={this.leaderName}
                     onInput={this.handleInputConfirm.bind(this, 'leaderName')}
              />
            </View>
          </View>
          {/*联系方式*/}
          <View className='item-container'>
            <View className='descName'>联系方式：</View>
            <View className='round-corner'>
              <Input placeholderStyle='color:#666' className='input-container' placeholder='输入联系方式' type='number' value={this.phoneNum}
                     onInput={this.handleInputConfirm.bind(this, 'phoneNum')}
              />
            </View>
          </View>
          {/*是否有外来公司布场*/}
          <View className='item-container'>
            <View className='isCompany'>是否有外来公司布场：</View>
            <View className='switch-container'>
              <Switch color='#4279E6' checked={companyControlButton}
                      onChange={this.handleSwitchClick.bind(this, 'company')}/>
            </View>
          </View>
          {/* 布场公司信息 */}
          {companyControlButton && <View className='companyInfo'>
            <View className='item-container'>
              <View className='descName'>公司名称：</View>
              <View className='companyName round-corner'>
                <Input placeholderStyle='color:#666' className='input-container' placeholder='输入公司名称' type='text' value={this.companyName}
                       onInput={this.handleInputConfirm.bind(this, 'companyName')}
                />
              </View>
            </View>
            <View className='item-container'>
              <View className='descName'>公司电话：</View>
              <View className='companyTel round-corner'>
                <Input placeholderStyle='color:#666' className='input-container' placeholder='输入公司电话' type='phone' value={this.companyTel}
                       onInput={this.handleInputConfirm.bind(this, 'companyTel')}
                />
              </View>
            </View>
          </View>}
          {/*布场日期*/}
          <View className='item-container'>
            <View className='descName'>布场日期：</View>
            <Picker mode='date' onChange={this.handlePickerChange.bind(this, 'layoutDate')} className='picker'>
              <View className='round-corner'>
                <Text className='text-with-arrow'>{this.state.layoutDate}</Text>
              </View>
            </Picker>
          </View>
          {/*布场开始*/}
          <View className='item-container'>
            <View className='descName'>布场开始：</View>
            <Picker mode='time' value='08:00' start='08:00' end='24:00' className='picker'
                    onChange={this.handlePickerChange.bind(this, 'layoutStartTime')}>
              <View className='round-corner'>
                <Text className='text-with-arrow'>{this.state.layoutStartTime}</Text>
              </View>
            </Picker>
          </View>
          {/*布场结束*/}
          <View className='item-container'>
            <View className='descName'>布场结束：</View>
            <Picker mode='time' start='08:00' end='24:00' value='16:00' className='picker'
                    onChange={this.handlePickerChange.bind(this, 'layoutEndTime')}>
              <View className='round-corner'>
                <Text className='text-with-arrow'>{this.state.layoutEndTime}</Text>
              </View>
            </Picker>
          </View>

          {/*布场是否需要音控*/}
          <View className='item-container'>
            <View className='descName'>布场音控：</View>
            <View className='switch-container'>
              <Switch color='#4279E6' checked={this.state.layoutVoiceControl} onChange={this.handleSwitchClick.bind(this, 'layout')}/>
              <View className='switch-hint'>无音控不能使用灯光音响及投影</View>
            </View>
          </View>
          {/*彩排日期*/}
          <View className='item-container'>
            <View className='descName'>彩排日期：</View>
            <Picker mode='date' onChange={this.handlePickerChange.bind(this, 'rehearsalDate')} className='picker'>
              <View className='round-corner'>
                <Text className='text-with-arrow'>{this.state.rehearsalDate}</Text>
              </View>
            </Picker>
          </View>
          {/*彩排开始*/}
          <View className='item-container'>
            <View className='descName'>彩排开始：</View>
            <Picker mode='time' value='08:00' start='08:00' end='24:00' className='picker'
                    onChange={this.handlePickerChange.bind(this, 'rehearsalStartTime')}>
              <View className='round-corner'>
                <Text className='text-with-arrow'>{this.state.rehearsalStartTime}</Text>
              </View>
            </Picker>
          </View>
          {/*彩排结束*/}
          <View className='item-container'>
            <View className='descName'>彩排结束：</View>
            <Picker mode='time' start='08:00' end='24:00' value='16:00' className='picker'
                    onChange={this.handlePickerChange.bind(this, 'rehearsalEndTime')}>
              <View className='round-corner'>
                <Text className='text-with-arrow'>{this.state.rehearsalEndTime}</Text>
              </View>
            </Picker>
          </View>

          {/*彩排是否需要音控*/}
          <View className='item-container'>
            <View className='descName'>彩排音控：</View>
            <View className='switch-container'>
              <Switch color='#4279E6' checked={this.state.rehearsalVoiceControl} onChange={this.handleSwitchClick.bind(this, 'rehearsal')}/>
              <View className='switch-hint'>无音控不能使用灯光音响及投影</View>
            </View>
          </View>
          {/*演出日期*/}
          <View className='item-container'>
            <View className='descName'>演出日期：</View>
            <Picker mode='date' onChange={this.handlePickerChange.bind(this, 'showDate')} className='picker'>
              <View className='round-corner'>
                <Text className='text-with-arrow'>{this.state.showDate}</Text>
              </View>
            </Picker>
          </View>
          {/*演出开始*/}
          <View className='item-container'>
            <View className='descName'>演出开始：</View>
            <Picker mode='time' value='08:00' start='08:00' end='24:00' className='picker'
                    onChange={this.handlePickerChange.bind(this, 'showStartTime')}>
              <View className='round-corner'>
                <Text className='text-with-arrow'>{this.state.showStartTime}</Text>
              </View>
            </Picker>
          </View>
          {/*演出结束*/}
          <View className='item-container'>
            <View className='descName'>演出结束：</View>
            <Picker mode='time' start='08:00' end='24:00' value='16:00' className='picker'
                    onChange={this.handlePickerChange.bind(this, 'showEndTime')}>
              <View className='round-corner'>
                <Text className='text-with-arrow'>{this.state.showEndTime}</Text>
              </View>
            </Picker>
          </View>
          {/*备注*/}
          {/*开始时间*/}
          <AtTextarea
            customStyle='margin-top:10px'
            value={this.state.description}
            onChange={this.handleDescription.bind(this)}
            placeholder='输入内容和需求'
          />
          {/*提示信息*/}
          <View className='error-view' hidden={!this.state.isError}>
            <Text>{this.state.errorMessage}</Text>
          </View>
          <Button className='btn' onClick={this.handleReserve.bind(this)}>{buttonText}</Button>
          {/* 模态框 */}
          <AtModal
            isOpened={isOpened}
            title='提示'
            cancelText='取消'
            confirmText='确认'
            onCancel={this.handleAtModalCancel.bind(this)}
            onConfirm={this.handleAtModalConfirm.bind(this)}
            content='1.到网页上打印并上传盖章申请表 2.如在48小时内未上传审核图片则将取消预定'
          />
        </View>
      </View>
    )
  }
}

export default RoomReserve
