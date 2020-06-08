import Taro, { Component } from '@tarojs/taro';
import { View, Image, Canvas } from "@tarojs/components";
const QRCode = require("../../../utils/weapp-qrcode");
import { getFareDetail, getFareQRCode } from "../../../service";
import { isNullEmpty } from "../../../utils/index"
import "./index.styl"
import {
    AtTabs,
    AtTabsPane
} from 'taro-ui'
let qrcode;
export default class FareDetail extends Component {
    config = {
        navigationBarTitleText: '车票详情'
    }
    state = {
        fareInfo: {},
        loading: false,
        current: 0
    }
    componentWillMount() {
        let ticketid = this.$router.params.ticketid;
        this.getFareDetailInfo(ticketid)
        console.log(ticketid)
        qrcode = new QRCode('canvas', {
            // usingIn: this,
            text: ticketid,
            image: '',
            width: 280,
            height: 280,
            colorDark: "#000",
            colorLight: "white",
            correctLevel: QRCode.CorrectLevel.H,
        });
    }
    getFareDetailInfo(ticketid) {
        Taro.showLoading({
            title: '加载中'
        })
        getFareDetail(ticketid).then(res => {
            console.log(res, "KKK")
            this.setState({
                fareInfo: res.data,
            })
            setTimeout(() => {
                Taro.hideLoading()
            }, 500);
        }).catch(err => {
            Taro.hideLoading()
            console.log(err)
        })
    }
    handleClick(value) {
        this.setState({
            current: value,
        })
    }
    render() {
        const tabList = [{ title: '车票信息' }, { title: '二维码' }]
        // const { loading } = this.state;
        let isByWay = isNullEmpty(this.state.fareInfo.stop)
        return (
            <View>
                <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
                    <View>
                        <AtTabsPane current={this.state.current} index={0}>
                            <ScrollView scrollY style='height :100vh'>
                                <View className="img_box">
                                    <Image className="bg_img" src={require("../../../assets/images/15.png")} />
                                    <View className="address_warp">
                                        <View className="address_iten_warp">
                                            <Image src={require("../../../assets/images/qidian.png")} />
                                            <View>{this.state.fareInfo.start}</View>
                                        </View>
                                        <View className="wire_sty"></View>
                                        <View className="address_iten_warp">
                                            <Image src={require("../../../assets/images/zhongdian.png")} />
                                            <View>{this.state.fareInfo.end}</View>
                                        </View>
                                    </View>
                                </View>

                                <View hidden={isByWay} className="car_stop">经停：{this.state.fareInfo.stop}</View>
                                <View className="info_item">
                                    <View>乘客姓名</View>
                                    <View>{this.state.fareInfo.name}</View>
                                </View>
                                <View className="info_item">
                                    <View>发车班次</View>
                                    <View>{this.state.fareInfo.timeStr}</View>
                                </View>
                                <View className="info_item">
                                    <View>车牌号</View>
                                    <View>{this.state.fareInfo.busNo}</View>
                                </View>
                                <View className="seat_num">{this.state.fareInfo.seat}</View>
                            </ScrollView>

                        </AtTabsPane>
                        <AtTabsPane current={this.state.current} index={1}>
                            <ScrollView scrollY style='height :100vh'>
                                <View className="qcode">
                                    <Canvas style="width:280px;height:280px;margin:30px auto" canvas-id='canvas'></Canvas>
                                </View>
                                <View className="car_stop">{this.state.fareInfo.QRTip}</View>
                            </ScrollView>
                        </AtTabsPane>
                    </View>
                </AtTabs>
            </View>

        )
    }
}