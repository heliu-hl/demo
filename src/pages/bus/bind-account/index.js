/*第一次进行预约的时候，进入绑定学号/工资号的页面*/
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Input, Picker } from '@tarojs/components'
import { AtModal, AtButton } from 'taro-ui'
import busLogo from '../../../assets/images/bus-logo.png'
import { isNullEmpty, setCacheData } from '../../../utils/index'
import { busUrl, APP_INFO } from '../../../config/index'
import { BUS_USER_INFO } from "../../constants/index";
import { observer, inject } from '@tarojs/mobx'
import './index.styl'

@inject((stores) => ({
  busBindStore: stores.busBindStore
}))
@observer
export default class BindAccount extends Component {

  config = {
    navigationBarTitleText: '账号绑定'
  }

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '请填写必要的信息',
      isError: false,
      isOpened: false,
      roleSelected: '请选择角色',
      accountPlaceHolder: "请输入您的账号",
      isUp: false,
      isUser: false,
      lostFind: false
    }
    this.roleAccount = ''
    this.roleName = ''
    this.idCard = ''
  }
  componentWillMount() {
    this.fetchRoleList()
    const isUser = this.$router.params.isUser;
    const isUp = this.$router.params.isUp;
    const lostFind = this.$router.params.lostFind;
    this.setState({
      isUp,
      isUser,
      lostFind
    })
  }

  handleRoleChange(e) {
    let index = e.detail.value
    this.roleName = this.props.busBindStore.roleList[index].name
    this.roleId = this.props.busBindStore.roleList[index].id
    this.setState({
      roleSelected: this.roleName,
      isOpened: false,
      isError: false
    })
    this.isAccountNull()
  }


  handleBind() {
    //先隐藏错误提示
    this.setState({
      isError: false
    })
    //如果信息输入完全，弹出提示用户确认，如果没有，则提示用户进行输入
    if (isNullEmpty(this.roleName)) {
      this.setState({
        isError: true,
        isOpened: false,
        errorMessage: "请选择您的角色信息"
      })
    } else if (isNullEmpty(this.roleAccount)) {
      this.setState({ isError: true, isOpened: false })
      this.isAccountNull()
    } else if (isNullEmpty(this.idCard)) {
      this.setState({
        isError: true,
        isOpened: false,
        errorMessage: "请输入您的证件号"
      })
    } else {
      this.setState({ isOpened: true, isError: false })
    }
  }

  isAccountNull() {
    if (this.roleId === '1' || this.roleId === '2') {
      this.setState({ errorMessage: "请输入您的学号", accountPlaceHolder: '请输入您的学号' })
    } else if (this.roleId === '3') {
      this.setState({ errorMessage: "请输入您的工号", accountPlaceHolder: "请输入您的工号" })
    } else if (this.roleId === '4' || this.roleId === '5') {
      this.setState({ errorMessage: "请输入您的手机号", accountPlaceHolder: "请输入您的手机号" })
    }
  }

  handleInputConfirm(type, e) {
    let value = e.detail.value
    this[type] = value
    //先隐藏错误提示
    this.setState({
      isError: false
    })
  }

  handleCancel() {
    this.setState({ isOpened: false })
  }

  fetchRoleList() {
    this.props.busBindStore.fetchBusRoleList('aca044').then((res) => {
      this.setState({
        isError: false      //改变状态，刷新显示
      })
    }).catch((e) => {
      this.setState({
        isError: true,
        errorMessage: e.message
      })
    })
  }
  handleConfirm() {
    let that = this;
    this.setState({ isOpened: false })
    //TODO 跳转到校车预约界面
    Taro.login({
      success: res => {
        if (res.code) {
          console.info(res.code)
          let url = busUrl + 'busAPI/associateWx';
          Taro.request({
            url: url,
            method: 'GET',
            data: {
              account: this.roleAccount,
              appid: APP_INFO.appId,
              secret: APP_INFO.secret,
              idcard: this.idCard,
              js_code: res.code,
              type: this.roleId
            },
            success: function (loginData) {
              console.info(loginData)
              let obj = loginData.data           //请求成功的结果在data会有一个data对象
              if (!obj.flag) {
                //获取失败
                that.setState({
                  isError: true,
                  errorMessage: obj.msg
                })
              } else {
                let userInfo = {
                  bus_account: that.roleAccount,
                  role: that.roleName,
                  id_card: that.idCard,
                  openid: obj.data.openid,
                  type: obj.data.type
                }
                setCacheData(BUS_USER_INFO, userInfo)
                //判断是否从失物招领过来
                if (that.state.lostFind) {
                  Taro.redirectTo({ url: '../../lost-luggage/index' })
                } else {
                  //判断是否从个人中心跳转过来
                  if (that.state.isUser) {
                    Taro.redirectTo({ url: '../../secondhand_market/mine/index' })
                  } else {
                    //判断是否是点击发布按钮跳转过来
                    if (that.state.isUp) {
                      Taro.redirectTo({ url: '../../secondhand_market/upload/index' })
                    } else {
                      if (obj.data.type === '4') {           //type为4表示是司机，跳转到司机页面
                        Taro.redirectTo({ url: '../user-center/driver' })
                      } else if (obj.data.type === '5') {
                        Taro.redirectTo({ url: '/pages/bus/bus-dispatch/list' });
                      } else {
                        Taro.redirectTo({ url: '../user-center/index' });
                      }
                    }
                  }
                }
              }
            },
            fail: function (errMsg) {
              console.info(errMsg)
              that.setState({
                isError: true,
                errorMessage: errMsg.data.msg
              })
            }
          })
        }
      }
    })
  }

  render() {
    const isRoundButton = true;
    const errorMessage = this.state.errorMessage
    const isError = this.state.isError
    const tip = '请确认您的基本信息\n\r' + '角色：' + this.state.roleSelected + '\n\r账号：' + this.roleAccount + '\n\r证件号：' + this.idCard + '\n\r点击确认会将此信息与您的微信账号绑定';
    const { busBindStore: { roleList } } = this.props
    return (
      <View className='bind-account'>
        <View className='bind-head'>
          <Image src={busLogo} />
          <Text>信息绑定</Text>
        </View>

        {/*选择角色*/}
        <Picker mode='selector' range={roleList} rangeKey='name' onChange={this.handleRoleChange.bind(this)}>
          <View className='round-corner,top-margin-role'>
            <Text className='text-with-arrow'>{this.state.roleSelected}</Text>
          </View>
        </Picker>


        {/*输入信息学号与身份证号*/}
        <View className='round-corner'>
          <Input placeholderStyle='color:white' className='input-container' placeholder={this.state.accountPlaceHolder}
            onInput={this.handleInputConfirm.bind(this, 'roleAccount')} />
        </View>
        <View className='round-corner'>
          <Input placeholderStyle='color:white' className='input-container' placeholder='请输入您的证件号'
            onInput={this.handleInputConfirm.bind(this, 'idCard')} />
        </View>

        {/*提示信息*/}
        <View className='error-view' hidden={!isError}>
          <Text>{errorMessage}</Text>
        </View>
        <View className='bind-button'>
          <AtButton circle={isRoundButton} customStyle='background-color:#E8EEFF'
            onClick={this.handleBind.bind(this)} >绑定</AtButton>
        </View>
        <View className='tips'>
          <Text>绑定后暂不能更改，请谨慎操作！</Text>
        </View>
        <AtModal
          isOpened={this.state.isOpened}
          title='提示'
          cancelText='取消'
          confirmText='确认'
          onCancel={this.handleCancel.bind(this)}
          onConfirm={this.handleConfirm.bind(this)}
          content={tip}
        />
      </View>
    )
  }
}
