import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Button, Text } from '@tarojs/components'
import {
  AtTabs,
  AtTabsPane,
  AtModal,
  AtModalHeader,
  AtModalAction,
  AtRate,
  AtModalContent,
  AtTextarea, AtToast
} from 'taro-ui'
import Ticket from '../../../components/Ticket'
import { getCacheData } from "../../../utils";
import { BUS_USER_INFO } from "../../constants";
import EmptyStateComponent from "../../common/EmptyStateComponent";
import ErrorTip from "../../../components/tip/ErrorTip";
import MHTComponent from "../../common/MHTComponent";
import { observer, inject } from '@tarojs/mobx'
import './index.styl'
import { refundTicketInfo } from "../../../service"
import { showSimpleToast } from "../../../utils/index"
import { busUrl } from "../../../config/index";


const rateType = ['乘车安全', '车内卫生', '司机态度']
@inject((stores) => ({
  ticketListStore: stores.ticketListStore
}))

@observer
export default class MyTicket extends MHTComponent {
  config = {
    navigationBarTitleText: '我的车票'
  }

  constructor() {
    super(...arguments)
    this.state = {
      ...this.state,
      current: 0,
      disabled: false,
      placeHolder: '在这里输入您的评价',
      rate: 5
    }
    this.remark = ''
    this.rateTypeNumber = 0
  }

  componentWillMount() {
    this.fetchMyTicketList()
  }

  fetchMyTicketList() {
    let openId = getCacheData(BUS_USER_INFO).openid;
    this.props.ticketListStore.fetchTicketList(openId).then((res) => {
      this.resetError()
    }).catch((e) => {
      this.setupError(e.message)
    })
  }

  handleClick(value) {
    this.setState({
      current: value,
      isOpened: false,
      disabled: true,
      placeHolder: '',
      showToast: false,
    })
  }

  handleErrorClick() {
    this.fetchMyTicketList()
  }

  toTicketDetail(ticketid) {
    Taro.navigateTo({ url: '../fareDetail/index?ticketid=' + ticketid })
  }
  /**
   * 弹出提示框
   */
  handleEvaluate(item) {
    this.rateTypeNumber = Math.ceil(Math.random() * 3 - 1)
    this.rateTypeText = rateType[this.rateTypeNumber]
    this.ticketid = item.ticketid
    this.setState({
      isOpened: true,
      disabled: false,
      placeHolder: '在这里输入您的评价',
      showToast: false,
    })
  }

  /**
   * 关闭评论框
   */
  handleModalClose() {
    this.remark = ''
    this.setState({
      isOpened: false,
      rate: 5,
      disabled: true,
      placeHolder: '',
      showToast: false,
    })
  }
  /**
   * 评分改变
   * @param e
   */
  handleRate(e) {
    this.setState({ rate: e })
  }

  /**
   * 评价备注
   * @param e
   */
  handleRemark(e) {
    this.remark = e.detail.value
  }
  refundTicket(ticketid) {
    Taro.showModal({
      title: '确认退票?'
    }).then(res => {
      if (res.confirm) {
        Taro.showLoading({
          title: "退票中"
        })
        refundTicketInfo(ticketid).then(res => {
          Taro.hideLoading()
          showSimpleToast("退票成功", "success")
          this.fetchMyTicketList()
        }).catch(err => {
          Taro.hideLoading()
          console.log(err)
        })
      }
    })
  }

  /**
   * 发起点评请求
   */
  postEvaluate(rateTypeNumber) {
    let that = this
    Taro.request({
      url: busUrl + 'busAPI/evaluate',
      data: {
        ticketid: this.ticketid,
        rate: this.state.rate,
        rateType: rateTypeNumber,
        rateRemark: this.remark
      }, success(res) {
        that.setState({
          isOpened: false,
          showToast: true,
          toastMessage: res.data.msg,
        })
      }, fail(e) {
        that.setState({
          isOpened: false,
          showToast: true,
          toastMessage: e.data.msg
        })
      }
    })
  }
  render() {
    const rateTypeId = this.rateTypeNumber + 1;
    const tabList = [{ title: '未乘坐' }, { title: '已评价' }, { title: '待评价' }]
    const { ticketListStore: { loading, ticketList } } = this.props

    const { showToast, toastDuration, toastMessage, isOpened, isError, errorMessage } = this.state
    const unexpiredTickList = ticketList.map((item, key) => {
      if (item.state === 1) {
        return (
          <View>
            <Ticket isInvalid={false} ticketData={item} key={key} onClick={this.toTicketDetail.bind(this, item.ticketid)} />
            <View className="refund_ticket" onClick={this.refundTicket.bind(this, item.ticketid)}>退票</View>
          </View>
        )
      }
    })
    const evaluatedTickList = ticketList.map((item, key) => {
      if (item.state === 2) {
        return (<Ticket isInvalid={true} ticketData={item} key={key} />)
      }
    })
    const evaluatingTickList = ticketList.map((item, key) => {
      if (item.state === 3) {
        return (<Ticket isInvalid={true} ticketData={item} key={key} onClick={this.handleEvaluate.bind(this, item)} />)
      }
    })
    const unexpiredData = ticketList.map((item) => {
      if (item.state === 1) {
        return item
      }
    })
    const evaluatedData = ticketList.map((item) => {
      if (item.state === 2) {
        return item
      }
    })
    const evaluatingData = ticketList.map((item) => {
      if (item.state === 3) {
        return item
      }
    })
    const unexpiredItem = unexpiredData.length > 0 ? unexpiredTickList :
      <EmptyStateComponent emptyStateHint='暂无车票信息\n\r进入【车次列表】进行预约吧' />;
    const evaluatedItem = evaluatedData.length > 0 ? evaluatedTickList :
      <EmptyStateComponent emptyStateHint='暂无已评价车票信息' />;
    const evaluatingItem = evaluatingData.length > 0 ? evaluatingTickList :
      <EmptyStateComponent emptyStateHint='暂无待评价车票信息' />;
    return (
      <View>
        <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          {!(isError || loading) &&
            <View>
              <AtTabsPane current={this.state.current} index={0}>
                <ScrollView scrollY style='height :100vh'>
                  {unexpiredItem}
                </ScrollView>
              </AtTabsPane>
              <AtTabsPane current={this.state.current} index={1}>
                <ScrollView scrollY style='height :100vh'>
                  {evaluatedItem}
                </ScrollView>
              </AtTabsPane>
              <AtTabsPane current={this.state.current} index={2}>
                <ScrollView scrollY style='height :100vh'>
                  {evaluatingItem}
                </ScrollView>
              </AtTabsPane>
            </View>
          }
          {(isError || loading) &&
            <View className='grow-container' style='color:#333'>
              <ErrorTip loading={loading} message={errorMessage}
                onClick={this.handleErrorClick.bind(this)} />
            </View>
          }
        </AtTabs>
        {isOpened &&
          <AtModal isOpened={isOpened} onClose={this.handleModalClose.bind(this)} className='customModal'>
            <AtModalHeader>您对本次乘车满意吗</AtModalHeader>
            <AtModalContent>
              <View className='rate-content-container'>
                <View className='rate'>
                  <Text>{this.rateTypeText}</Text>
                  <AtRate value={this.state.rate} size={16} margin={8} onChange={this.handleRate.bind(this)} />
                </View>
                <AtTextarea
                  value={this.remark}
                  onChange={this.handleRemark.bind(this)}
                  maxLength={200}
                  disabled={this.state.disabled}
                  placeholder={this.state.placeHolder}
                />
              </View>
            </AtModalContent>
            <AtModalAction><Button onClick={this.postEvaluate.bind(this, rateTypeId)}>提交</Button> </AtModalAction>
          </AtModal>
        }
        {showToast &&
          <AtToast
            isOpened={showToast}
            duration={toastDuration}
            text={toastMessage}
            isHiddenIcon={true} />}
      </View>
    )
  }
}
