import Taro, {Component} from '@tarojs/taro';
import {View, Image, Input, Button, Text} from '@tarojs/components';
import logo from '../../../assets/images/login_logo.jpg'
import {isNullEmpty} from "../../../utils";
import './index.styl'
import {observer,inject} from '@tarojs/mobx'
import MHTComponent from "../../common/MHTComponent";

@inject((stores) =>({
  roomLoginStore: stores.roomLoginStore
}))
@observer
class Login extends MHTComponent {
  config = {
    navigationBarTitleText: '登录'
  }
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
    }
    this.account = ''
    this.password = ''
  }

  handleInput(type,e) {
    if (type === 'account') {
      this.account = e.detail.value
    } else if (type === 'password') {
      this.password = e.detail.value
    }
    this.setState({
      isError: false
    })
  }


  handleLogin() {
    //先隐藏错误提示
    this.setState({
      isError: false
    })
    if (isNullEmpty(this.account)) {
      this.setState({
        isError: true,
        errorMessage:'请输入账号后再登录'
      })
    } else if (isNullEmpty(this.password)) {
      this.setState({
        isError: true,
        errorMessage: '请输入密码后再登录'
      })
    } else {
      //TODO 调用登录接口
      console.info(this.account + this.password)
      this.login();

    }
  }

  login() {
    const params ={
          account:this.account,
          password:this.password
    }
    this.props.roomLoginStore.postLoginForm(params).then((res) => {
      console.info(res)
        this.resetError()
      Taro.navigateBack({url:'../index'})
    }).catch((e) => {
        this.setupError(e)
    });
  }

  render() {
    const errorMessage = this.state.errorMessage
    const isError = this.state.isError
    return (
      <View className='root'>
        <Image src={logo} className='header-img ' />
        <View className='input-container'>
          <View className='input-cell'>
            <Text>账号</Text>
            <Input placeholder='请输入您的账号' onInput={this.handleInput.bind(this, 'account')} className='input-style' />
          </View>
          <View className='input-cell'>
            <Text>密码</Text>
            <Input placeholder='请输入您的密码' password onInput={this.handleInput.bind(this, 'password')} className='input-style' />
          </View>
        </View>
        {/*提示信息*/}
        <View className='error-view' hidden={!isError}>
          <Text>{errorMessage}</Text>
        </View>
        <Button  className='button' onClick={this.handleLogin.bind(this)}>登录</Button>
      </View>
    )
  }
}

export default Login
