import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import {
  AtToast,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtTextarea,
  AtFloatLayout,
  AtCheckbox
} from "taro-ui"
import './reservationDetail.styl'
import { BASE_URL } from "../../../config";
import { getCacheData } from "../../../utils";
import { MEETING_ROOM_ADMIN } from "../../constants";
import { observer, inject } from '@tarojs/mobx'
import MHTComponent from "../../common/MHTComponent";
import ErrorTip from "../../../components/tip/ErrorTip";

@inject((stores) => ({
  reservationDetailStore: stores.reservationDetailStore
}))
@observer
export default class ReservationDetail extends MHTComponent {
  config = {
    navigationBarTitleText: '会议室预定情况'
  }

  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      isOpen: false,
      isShowToast: false,
      description: '',
      toastText: '',
      toastStatus: '',
      placeHolder: '',
      disabled: true,
      isShowAssignList: false,
      selectedPersonList: []
    }
  }

  componentWillMount() {
    this.bookId = this.$router.params.bookId
    this.getReservationDetail();
  }

  getReservationDetail() {
    this.props.reservationDetailStore.fetchReservationDetail(this.bookId).then((res) => {
      this.resetError()
    }).catch((e) => {
      this.setupError(e)
    })
  }

  handleDescription(event) {
    this.setState({
      description: event.target.value
    })
  }

  handleCancel() {
    this.setState({
      isOpen: false,
      disabled: true,
      placeHolder: ' ',
      description: ''
    })
  }

  handleConfirm(bookId) {
    this.doAudit(2, this.state.description, bookId)
    this.setState({
      isOpen: false,
      disabled: true,
      placeHolder: '',
      description: ''
    })
  }

  handleReserve(type, bookId) {
    if (type === 'pass') {
      //TODO 分配会议协助人员
      this.props.reservationDetailStore.fetchAssignPerson().then((res) => {
        this.resetError()
        this.setState({
          isShowAssignList: true
        })
      }).catch((e) => {
        this.setupError(e.message)
      })
      // this.doAudit(1, '', bookId)
    } else if (type === 'reject') {
      this.setState({
        isOpen: true,
        disabled: false,
        placeHolder: '在这里输入驳回原因'
      })
    }
  }

  doAudit(auditState, auditRemark, bookId) {
    let that = this
    let assignIds = this.state.selectedPersonList.toString()
    const userInfo = getCacheData(MEETING_ROOM_ADMIN);
    const params = {
      bookId: bookId,
      auditState: auditState,
      auditRemark: auditRemark,
      auditPerson: userInfo.name,
      assignIds: assignIds
    }
    this.props.reservationDetailStore.auditReservationInfo(params).then((res) => {
      this.resetError()
      that.setState({
        isShowToast: true,
        toastStatus: 'success',
        toastText: '审核成功',
        duration: 1500
      })
      // Taro.redirectTo({url:'../booking-list/index'})
      this.navigateToBookingList();
    }).catch((e) => {
      this.setupError(e)
      that.setState({
        isShowToast: true,
        toastStatus: 'error',
        toastText: String(e || '未知错误'),
        duration: 1500
      })
    });
  }

  navigateToBookingList() {
    let pages = Taro.getCurrentPages();
    if (pages.length >= 2) {
      let prePage = pages[pages.length - 2]
      prePage.$component.setState({ needRefresh: true })
      Taro.navigateBack({ delta: 1 })
    }
  }

  preImage(url, bookId, type) {
    if (url) {
      //有图片点击之后可以预览;
      if (type === 'previewImage') {
        Taro.previewImage({
          urls: url
        })
      } else if (type === 'uploadImage') {
        Taro.navigateTo({ url: '../upload-file/uploadAuditImg?bookId=' + bookId })
      }
    } else if (type === 'uploadImage') {
      Taro.navigateTo({ url: '../upload-file/uploadAuditImg?bookId=' + bookId })
    }
  }

  handleErrorClick() {
    this.getReservationDetail()
  }

  handleSelectedPerson(value) {
    this.setState({ selectedPersonList: value })
  }

  handleChoosePerson(type, bookId) {
    if (type === 'cancel') {
      this.setState({
        isShowAssignList: false,
        selectedPersonList: []
      })
    } else if (type === 'confirm') {
      this.doAudit(1, '', bookId)
      this.setState({
        isShowAssignList: false,
        selectedPersonList: []
      })
    }
  }

  render() {
    const { reservationDetailStore: { reservationDetail, loading, assignPersonList } } = this.props

    // 是否有布场公司
    const isCompanyStatus=reservationDetail.isCompany === 1;

    const { isError, errorMessage, isShowAssignList } = this.state
    const hasImg = reservationDetail.imgurl !== null
    const auditChart = hasImg ? '查看图片' : '暂无图片'
    const auditChartClass = !hasImg ? 'audit-chart-disabled;item-text-content' : 'audit-chart;item-text-content'

    const isOpen = this.state.isOpen
    const userInfo = getCacheData(MEETING_ROOM_ADMIN)
    return (
      <View className='root'>
        {!(isError || loading) &&
          <View>
            <View className='container'>
              <View className='title'>
                <Text>预定详情</Text>
                <Text className='audit-state'>{reservationDetail.auditState}</Text>
              </View>
              <View className='item'
                hidden={reservationDetail.auditCode === 0 || reservationDetail.auditCode === 3}>
                <Text className='title-color;item-text-content'>审核人</Text>
                <Text className='time-color;item-text-content'>{reservationDetail.auditPerson}</Text>
              </View>
              <View className='item-remark' hidden={reservationDetail.auditCode !== 2}>
                <Text className='title-color;item-text-content'>审核备注</Text>
                <Text className='time-color;item-text-content'>{reservationDetail.auditRemark}</Text>
              </View>
              <View className='item'>
                <Text className='title-color;item-text-content'>申请人</Text>
                <Text className='item-text-content'>{reservationDetail.personName}</Text>
              </View><View className='item-remark'>
                <Text className='title-color;item-text-content'>申请部门</Text>
                <Text className='item-text-content'>{reservationDetail.deptName}</Text>
              </View><View className='item-remark'>
                <Text className='title-color;item-text-content'>活动名称</Text>
                <Text className='item-text-content'>{reservationDetail.activityName}</Text>
              </View><View className='item'>
                <Text className='title-color;item-text-content'>活动负责人</Text>
                <Text className='item-text-content'>{reservationDetail.activityManager}</Text>
              </View><View className='item'>
                <Text className='title-color;item-text-content'>联系方式</Text>
                <Text className='item-text-content'>{reservationDetail.mobile}</Text>
              </View>
              {/* 是否有布场公司 */}
              {isCompanyStatus&&<View className='company'>
              <View className='item'>
                <Text className='title-color;item-text-content'>是否有布场公司</Text>
                <Text className='item-text-content'>{isCompanyStatus?'是':'否'}</Text>
              </View>
              <View className='item'>
                <Text className='title-color;item-text-content'>布场公司名称</Text>
                <Text className='item-text-content'>{reservationDetail.companyName}</Text>
              </View>
              <View className='item'>
                <Text className='title-color;item-text-content'>布场公司电话</Text>
                <Text className='item-text-content'>{reservationDetail.companyTel}</Text>
              </View>
            </View>}

              <View className='item'>
                <Text className='title-color;item-text-content'>布场时间</Text>
                <Text
                  className='time-color;item-text-content'>{reservationDetail.layoutDate + " " + reservationDetail.layoutStartTime + '-' + reservationDetail.layoutEndTime}</Text>
              </View><View className='item'>
                <Text className='title-color;item-text-content'>彩排时间</Text>
                <Text
                  className='time-color;item-text-content'>{reservationDetail.rehearsalDate + " " + reservationDetail.rehearsalStartTime + '-' + reservationDetail.rehearsalEndTime}</Text>
              </View><View className='item'>
                <Text className='title-color;item-text-content'>演出时间</Text>
                <Text
                  className='time-color;item-text-content'>{reservationDetail.showDate + " " + reservationDetail.showStartTime + '-' + reservationDetail.showEndTime}</Text>
              </View><View className='item'>
                <Text className='title-color;item-text-content'>审核资料</Text>
                {(userInfo.isManager) &&
                  <Text className={auditChartClass}
                    onClick={this.preImage.bind(this, reservationDetail.imgurl, reservationDetail.bookId, 'previewImage')}>{auditChart}</Text>
                }
                {(!userInfo.isManager && hasImg && reservationDetail.auditCode === 0) &&
                  <View className='audit-chart-user'>
                    <Text className={auditChartClass}
                      onClick={this.preImage.bind(this, reservationDetail.imgurl, reservationDetail.bookId, 'uploadImage')}>更改图片</Text>
                    <Text className={auditChartClass}
                      onClick={this.preImage.bind(this, reservationDetail.imgurl, reservationDetail.bookId, 'previewImage')}>查看图片</Text>
                  </View>
                }
                {(!userInfo.isManager && hasImg && (reservationDetail.auditCode === 1 || reservationDetail.auditCode === 2)) &&
                  <Text className='audit-chart;item-text-content'
                    onClick={this.preImage.bind(this, reservationDetail.imgurl, reservationDetail.bookId, 'previewImage')}>查看图片</Text>
                }
                {(!userInfo.isManager && !hasImg) &&
                  <Text className='audit-chart;item-text-content'
                    onClick={this.preImage.bind(this, reservationDetail.imgurl, reservationDetail.bookId, 'uploadImage')}>上传图片</Text>
                }
              </View>
              <View className='bottom' hidden={reservationDetail.content === null}>
                <View className='title-color'>内容及需求</View>
                <Text style='word-break:break-all'>{reservationDetail.content}</Text>
              </View>
              <View hidden={(!(reservationDetail.auditCode === 0 && userInfo.isManager))}>
                <Button className='btn,'
                  onClick={this.handleReserve.bind(this, 'pass', reservationDetail.bookId)}>通过审核</Button>
                <Button className='btn-reject;btn'
                  onClick={this.handleReserve.bind(this, 'reject', reservationDetail.bookId)}>驳回审核</Button>
              </View>
            </View>

            <AtModal isOpened={isOpen}>
              <AtModalHeader>驳回原因</AtModalHeader>
              <AtModalContent>
                <AtTextarea
                  value={this.state.description}
                  onChange={this.handleDescription.bind(this)}
                  maxLength={200}
                  disabled={this.state.disabled}
                  placeholder={this.state.placeHolder}
                />
              </AtModalContent>
              <AtModalAction> <Button onClick={this.handleCancel.bind(this)}>取消</Button> <Button
                onClick={this.handleConfirm.bind(this, reservationDetail.bookId)}>确定</Button> </AtModalAction>
            </AtModal>
            <AtToast isOpened={this.state.isShowToast} status={this.state.toastStatus} text={this.state.toastText}
              duration={this.state.duration}></AtToast>

            <AtFloatLayout isOpened={isShowAssignList} scrollY title="请指派协助会议人员">
              <AtCheckbox options={assignPersonList}
                selectedList={this.state.selectedPersonList}
                onChange={this.handleSelectedPerson.bind(this)} />
              <View className='btn-container'>
                <Button className='btn-reject;btn'
                  onClick={this.handleChoosePerson.bind(this, 'cancel', reservationDetail.bookId)}>取消</Button>
                <Button className='btn,'
                  onClick={this.handleChoosePerson.bind(this, 'confirm', reservationDetail.bookId)}>确定</Button>
              </View>
            </AtFloatLayout>
          </View>
        }
        {(isError || loading) &&
          <View className='grow-container'>
            <ErrorTip loading={loading} message={errorMessage}
              onClick={this.handleErrorClick.bind(this)} />
          </View>
        }
      </View>
    );
  }
}
