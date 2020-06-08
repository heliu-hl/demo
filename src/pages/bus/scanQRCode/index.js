import Taro, { Component } from '@tarojs/taro';
import { View, Image } from "@tarojs/components";
import { scanQRCodeReq } from "../../../service"
import { getCacheData } from "../../../utils";
import { BUS_USER_INFO } from "../../constants";
const pass = require("../../../assets/pass.mp3")
const not_pass = require("../../../assets/not_pass.mp3");
import { isNullEmpty } from "../../../utils/index";
import "./index.styl";
import { busUrl } from "../../../config/index.js"
const innerAudioContext = Taro.createInnerAudioContext();
let qrcode;
export default class scanQRCode extends Component {
    config = {
        navigationBarTitleText: '扫码'
    }
    state = {
        message: ""
    }
    componentWillMount() {
        console.log(this.$router.params, "parmas");
        let busId = this.$router.params.busId;
        let role = this.$router.params.role;
        let userInfo = getCacheData(BUS_USER_INFO);
        Taro.scanCode({
            success: res => {
                Taro.showLoading({
                    title: "识别中"
                })
                let data = {
                    ticketId: res.result,
                    role: role,
                    busId: busId,
                    openid: userInfo.openid
                }
                console.log(data, "data ok");
                console.log(busUrl + "busAPI/handleQRCodeInfo", "url");
                Taro.request({
                    url: busUrl + "busAPI/handleQRCodeInfo",
                    method: "GET",
                    data: data
                }).then(res => {
                    Taro.hideLoading();
                    Taro.showToast({
                        title: res.data.msg,
                        icon: "none"
                    })
                    if (res.data.flag) {
                        this.playmp3(pass, "pass");
                        this.setState({
                            message: "",
                        }, () => {
                            setTimeout(() => {
                                this.componentWillMount();
                            }, 800)
                        })

                    } else {
                        this.setState({
                            message: res.data.msg,
                        })
                        this.playmp3(not_pass, "not_pass");
                    }
                }).catch(err => {
                    console.log(err, "fail fail")
                })
            }
        })
    }
    playmp3(data) {
        console.log(data, "mp3 ok")
        innerAudioContext.src = data;
        innerAudioContext.play();
        // innerAudioContext.onEnded(
        //     console.log("KKK")
        // )

    }
    clickScan() {
        this.componentWillMount();
    }
    clickReturn() {
        Taro.navigateBack({
            datal: 1
        })
    }
    render() {
        const isNull = isNullEmpty(this.state.message);
        return (
            <View className="qRCode_warp">
                <Image className="qRCode_bg_img" src={require("../../../assets/images/22.png")} />
                <View className="click_item" hoverClass="hover_sty_item" hoverStayTime={100} onClick={this.clickScan.bind(this)}>扫码</View>
                <View className="click_item" hoverClass="hover_sty_item" hoverStayTime={100} onClick={this.clickReturn}>返回</View>
                <View hidden={isNull} className="failed_msg">{this.state.message}</View>
            </View>
        )
    }
}