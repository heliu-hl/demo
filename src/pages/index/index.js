/* eslint-disable react/no-unused-state,taro/jsx-handler-names */
import Taro, { Component } from '@tarojs/taro'
import { AtGrid, AtModal, AtModalContent, AtModalAction } from "taro-ui"
import { View, OpenData, Text, Button, Audio } from '@tarojs/components'
import './index.styl'
import { BUS_USER_INFO } from '../constants'
import { getCacheData } from "../../utils";

const Icons = [
  {
    image: require('../../assets/images/1.png'),
    value: '智能报修',
    type: 'repair'
  },
  // {
  //   image: require('../../assets/images/2.png'),
  //   value: '意见与建议',
  //   type: 'advance'
  // },
  {
    image: require('../../assets/images/3.png'),
    value: '日常班车时刻表',
    type: 'bus_search'
  },
  {
    image: require('../../assets/images/7.png'),
    value: '班车预约',
    type: 'bus_date'
  },
  {
    image: require('../../assets/images/8.png'),
    value: '在线点餐',
    type: 'order_food'
  },
  {
    image: require('../../assets/images/img12.png'),
    value: '就餐图谱',
    type: 'dining_room'
  },
  {
    image: require('../../assets/images/18.png'),
    value: '银杏小厨(外卖)',
    type: 'hotel'
  },
  {
    image: require('../../assets/images/4.png'),
    value: '会议室',
    type: 'meeting-room'
  },
  // {
  //   image: require('../../assets/images/5.png'),
  //   value: '通知公告',
  //   type: 'notice'
  // },


  {
    image: require('../../assets/images/19.png'),
    value: '宿舍流量地图',
    type: 'dormitory_map'
  },


  // {
  //   image: require('../../assets/images/10.png'),
  //   value: '卫生评比',
  //   type: 'health_score'
  // },
  // {
  //   image: require('../../assets/images/11.png'),
  //   value: '文化建设',
  //   type: 'cultural_construction'
  // },

  {
    image: require('../../assets/images/17.png'),
    value: '商易购',
    type: 'business_shopping'
  },

  {
    image: require('../../assets/images/12.png'),
    value: '中小学报名',
    type: 'student_enroll'
  },


  {
    image: require('../../assets/images/6.png'),
    value: '失物招领',
    type: 'find_lose'
  },
  // {
  //   image: require('../../assets/images/11.png'),
  //   value: '二手市场',
  //   type: 'secondhand_market'
  // },

  // {
  //   image: require('../../assets/images/supplier.png'),
  //   value: '饮食供应链',
  //   type: 'food_supply'
  // },


]


export default class Index extends Component {

  config = {
    navigationBarTitleText: '后勤综合服务'
  }

  constructor(props) {
    super(props)
    this.state = {
      alertContent: '敬请期待',
      modelOpen: false,
      isBind: false
    }
  }

  componentWillMount() {
    // Taro.clearStorage()
  }
  componentDidMount() {
    console.log(this.porps, "APPPAA")
    // Taro.login({}).then(res => {
    //   // console.log(res, "success")
    //   let data = {
    //     js_code: res.code,
    //     appid: "wx148d26cb07543413",
    //     secret: "304a830a5b9584b940f3342f7dfff96d",
    //     grant_type: "authorization_code"
    //   };
    //   Taro.request({
    //     url: "https://api.weixin.qq.com/sns/jscode2session",
    //     data: data,
    //     method: "GET",
    //     success: res => {
    //       console.log(res, "ok")
    //     },
    //     fail: err => {
    //       console.log(err, "fail")
    //     }
    //   })
    // }).catch(err => {
    //   console.log(err, "KKK")
    // })
  }

  componentWillUnmount() {

  }

  componentDidShow() {
    let busUserInfo = getCacheData(BUS_USER_INFO);
    //检查是否绑定
    if (busUserInfo) {
      //查看绑定信息
      this.setState({
        isBind: true,
      })
    } else {
      this.setState({
        isBind: false,
      })
    }
  }

  componentDidHide() {
  }

  handleClickAction(e) {
    // const e = event.currentTarget.dataset.eTapAA || {type: ''};
    if (e.type === 'student_enroll') {
      // this.setState({
      //   alertContent: '未到报名时间,暂不开放',
      //   modelOpen: true
      // })
      //后勤综合服务小程序
      Taro.navigateToMiniProgram({
        appId: 'wx92e266b01d57457a',
        path: 'app/pages/enroll/index',
        extraData: {}
      }).then(data => {
        console.info(data)
      }).catch(() => {
      })
    } else if (e.type === 'repair') {
      //后勤综合服务小程序
      Taro.navigateToMiniProgram({
        appId: 'wx92e266b01d57457a',
        path: 'app/pages/repair/MineRepair',
        extraData: {}
      }).then(data => {
        console.info(data)
      }).catch(err => {
        this.setState({
          alertContent: '请升级微信版本',
          modelOpen: false
        })
        console.info(err)
      })
    } else if (e.type === 'bus_search') {
      // 后勤综合服务小程序
      Taro.navigateToMiniProgram({
        appId: 'wx92e266b01d57457a',
        path: 'app/pages/car/CarServices',
        extraData: {}
      }).then(data => {
        console.info(data)
      }).catch(err => {
        this.setState({
          alertContent: '请升级微信版本',
          modelOpen: false
        })
        console.info(err)
      })
    } else if (e.type === 'bus_date') {
      // this.setState({
      //   alertContent: '敬请期待',
      //   modelOpen: true
      // })
      if (this.state.isBind) {
        if (getCacheData(BUS_USER_INFO).type === '4') {     //为4进入驾驶员界面
          Taro.navigateTo({ url: '/pages/bus/user-center/driver' });
        } else if (getCacheData(BUS_USER_INFO).type === '5') {
          Taro.navigateTo({ url: '/pages/bus/bus-dispatch/list' });
        } else {
          Taro.navigateTo({ url: '/pages/bus/user-center/index' });
        }
      } else {
        Taro.navigateTo({ url: '/pages/bus/bind-account/index' })
      }
    } else if (e.type === 'meeting-room') {
      Taro.navigateTo({ url: '/pages/meeting-room/index' })
    }
    // else if (e.type === 'secondhand_market') {
    //   Taro.navigateTo({ url: '/pages/secondhand_market/index' })
    // }
    else if (e.type === 'find_lose') {
      if (this.state.isBind) {
        Taro.navigateTo({ url: '/pages/lost-luggage/index' })
      } else {
        Taro.navigateTo({ url: '/pages/bus/bind-account/index?lostFind=true' })
      }
    } else if (e.type === 'order_food') {
      // 订餐小程序
      Taro.navigateToMiniProgram({
        appId: 'wxba2c83c0bce77e60',
        path: 'pages/toServer/toServer',
        extraData: {}
      }).then(data => {
        console.info(data)
      }).catch(err => {
        this.setState({
          alertContent: '请升级微信版本',
          modelOpen: false
        })
        console.info(err)
      })
    } else if (e.type === 'business_shopping') {
      // 商易购
      Taro.navigateToMiniProgram({
        appId: 'wxd340e350e360bf0a',
        path: 'pages/toServer/toServer',
        extraData: {}
      }).then(data => {
        console.info(data)
      }).catch(err => {
        this.setState({
          alertContent: '请升级微信版本',
          modelOpen: false
        })
        console.info(err)
      })
    } else if (e.type === 'hotel') {
      // 科大宾馆
      Taro.navigateToMiniProgram({
        appId: 'wxce2b7a5a3d064d2e',
        path: 'pages/home/home',
        extraData: {}
      }).then(data => {
        console.info(data)
      }).catch(err => {
        this.setState({
          alertContent: '请升级微信版本',
          modelOpen: false
        })
        console.info(err)
      })
    } else if (e.type === 'dining_room') {
      // 后勤综合服务小程序
      Taro.navigateToMiniProgram({
        appId: 'wx92e266b01d57457a',
        path: 'app/pages/diningRoom/home',
        extraData: {}
      }).then(data => {
        console.info(data)
      }).catch(err => {
        this.setState({
          alertContent: '请升级微信版本',
          modelOpen: false
        })
        console.info(err)
      })
    } else if (e.type === 'dormitory_map') {
      // 后勤综合服务小程序
      Taro.navigateToMiniProgram({
        appId: 'wx92e266b01d57457a',
        path: '/stuDormitoryStatistics/pages/home/home',
        extraData: {}
      }).then(data => {
        console.info(data)
      }).catch(err => {
        this.setState({
          alertContent: '请升级微信版本',
          modelOpen: false
        })
        console.info(err)
      })
    }
    // else if (e.type === 'food_supply') {
    // 订餐小程序
    // Taro.navigateToMiniProgram({
    //   appId: 'wxba2c83c0bce77e60',
    //   path: 'pages/supplier/supplier_login/supplier_login',
    //   extraData: {}
    // }).then(data => {
    //   console.info(data)
    // }).catch(err => {
    //   this.setState({
    //     alertContent: '请升级微信版本',
    //     modelOpen: false
    //   })
    //   console.info(err)
    // })
    // }
    // else if(e.type === 'health_score'){
    // Taro.navigateTo({url:"/pages/epidemic_situation/index"})
    // }
    else {
      console.log('敬请期待')
      this.setState({
        alertContent: '敬请期待',
        modelOpen: true
      })
    }
  }

  closeModal() {
    this.setState({
      modelOpen: false
    })
  }

  handleBind() {
    //判断是否绑定，如果绑定了则查看绑定信息
    let busUserInfo = getCacheData(BUS_USER_INFO);
    //检查是否绑定
    if (busUserInfo) {
      //查看绑定信息
      const tip = '绑定信息如下\n\r' + '角色：' + busUserInfo.role + '\n\r账号：' + busUserInfo.bus_account + '\n\r证件号：' + busUserInfo.id_card

      this.setState({
        isBind: true,
        //todo 改变alertContent显示
        alertContent: tip,
        modelOpen: true
      })
    } else {
      Taro.navigateTo({ url: '/pages/bus/bind-account/index' })
    }
  }

  render() {
    return (
      <View className='index'>
        <View className='banner'>
          <View className='users_info'>
            <View className='photo'>
              <OpenData className='userinfo-avatar' type='userAvatarUrl' mode='acceptFit'></OpenData>
            </View>
            <View className='username'>
              <OpenData className='userinfo-nickname' type='userNickName'></OpenData>
              <Text className='profile'>个人中心</Text>
            </View>
            <Button className='bind' onClick={this.handleBind.bind(this)}>{this.state.isBind ? '查看' : '绑定'}</Button>
          </View>
        </View>

        <View className='grid-content'>
          <AtGrid data={[...Icons]} onClick={this.handleClickAction.bind(this)} />
        </View>

        <AtModal isOpened={this.state.modelOpen}>
          <AtModalContent>
            <View className='modal-content flex-center'>
              {this.state.alertContent}
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button style='color:#6190E8' onClick={this.closeModal.bind(this)}>
              关闭
            </Button>
          </AtModalAction>
        </AtModal>
        <View className='bottom-empty'></View>
      </View>
    )
  }
}
