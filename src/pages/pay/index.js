import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { busUrl } from "../../config";
import { BUS_USER_INFO } from "../constants";
import { getCacheData } from "../../utils";
import payFailIcon from '../../assets/images/icon_pay_fail.png'
import './index.styl'

class PayExample extends Component {
  config = {
    navigationBarTitleText: '支付页面'
  }
  componentWillMount() {
    const total_fee = this.$router.params.total_fee
    const chooseId = this.$router.params.chooseId
    console.info(chooseId)
    this.setState({
      renderPayFailed: false             //是否渲染支付失败的界面
    })
    this.handlePayment(total_fee, chooseId)
  }

  handlePayment(total_fee, chooseId) {
    let that = this
    let busUserInfo = getCacheData(BUS_USER_INFO);
    let openid = busUserInfo.openid
    let out_trade_no = ''   //支付订单号
    Taro.request({
      url: busUrl + 'busAPI/unifiedOrder',

      data: {
        openid: openid,
        total_fee: total_fee,
        chooseId: chooseId
      },
      method: "GET",
      success(res) {
        console.info(res)
        let result = res.data.data
        out_trade_no = result.out_trade_no
        console.info("unifiedOrder=" + out_trade_no)
        Taro.requestPayment({
          timeStamp: result.timeStamp,
          nonceStr: result.nonceStr,
          package: result.package,
          signType: result.signType,
          paySign: result.paySign,
          success: function (data) {
            console.info(data)
            Taro.request({
              url: busUrl + 'busAPI/handlePay',
              data: {
                flag: 1,
                out_trade_no: out_trade_no
              }, success() {
                Taro.redirectTo({ url: '../../pages/bus/ticket/index' })
              }
            })

          },
          fail: function (e) {
            console.info(e)
            Taro.request({
              url: busUrl + 'busAPI/handlePay',
              data: {
                flag: 0,
                out_trade_no: out_trade_no
              }
            })
            that.setState({ renderPayFailed: true })
          },
          complete: function (e) {
            console.info(e)
          }
        })
      }, fail(res) {
        console.info(res)
      }
    })
  }
  render() {
    return (
      <View className='root'>
        {this.state.renderPayFailed ?
          <View className='fail-container'>
            <Image src={payFailIcon} className='icon-pay-fail' mode='scaleToFill' />
            <Text className='pay-fail-text'> 支付失败</Text>
            <Text className='pay-fail-desc'> 订单支付失败，原因可能是您的
              余额不足，或者是其他原因</Text>
          </View> : ""
        }
      </View>
    );
  }
}
export default PayExample
