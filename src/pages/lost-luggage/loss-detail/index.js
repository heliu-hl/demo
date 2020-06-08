import Taro, { Component } from '@tarojs/taro'
import { View, Image,Button } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import { AtMessage } from 'taro-ui'
import MHTComponent from '../../common/MHTComponent'
import ErrorTip from '../../../components/tip/ErrorTip'
import { handleFinalData } from '../../../utils/index'
import { BASE_URL } from '../../../config/index'

import './index.styl'
import cloud from '../../../assets/images/cloud.png'
import alredyfind from '../../../assets/images/alredyfind.png'
import alredyget from '../../../assets/images/alredyget.png'

@inject((stores) => ({
    goodsDetailStore: stores.goodsDetailStore
}))

@observer
export default class LossDetail extends MHTComponent {
    config = {
        navigationBarTitleText: '详情',
        navigationBarBackgroundColor: '#7fc6e7',
        navigationBarTextStyle: "white"
    }
    constructor(props) {
        super(props);
        this.state = {
            themeReport: '失物招领',
            themeLoss: '寻物启事',
            flag: '',
            fromMine: false,
            status: '',
            buttonStatus:true
        }
        this.handleErrorClick = this.handleErrorClick.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
    }
    componentWillMount() {
        const flag = this.$router.params.flag;
        console.log('hehheheh' + flag)
        const fromMine = this.$router.params.fromMine;
        const infoId = this.$router.params.infoId;
        this.setState({ flag, fromMine, infoId })
    }
    componentDidMount() {
        this.fetchgoodsDetail()
    }
    fetchgoodsDetail() {
        const { infoId, flag } = this.state;
        const type = flag === 'report' ? 2 : 1;
        this.props.goodsDetailStore.getGoodsDetailFunc({ infoId, type }).then(() => {
            const { goodsDetailStore: { goodsDetail } } = this.props;
            this.setState({
                isError: false,
                status: goodsDetail.status,
                buttonStatus:false
            })
        }).catch((e) => {
            this.setState({
                isError: true,
                errorMessage: e.message
            })
        })
    }
    changeStatus() {
        this.setState({
            buttonStatus:true
        })
        Taro.showLoading({
            title:'修改中',                             
            mask:true                                    
        })
        const that =this;
        const { infoId, flag, status } = this.state;
        const type = flag === 'report' ? 2 : 1;
        Taro.request({
            url: BASE_URL + 'lostAndFound/changeStatus',
            data: { infoId, type, status },
            header: {
                'content-type': 'application/json'
            }, success(res) {
                Taro.hideLoading();
                handleFinalData(res, '../my/index',that)
            }, fail() {
                Taro.hideLoading();
                setTimeout(function(){
                    Taro.atMessage({
                        'message': '修改失败',
                        'type': 'error',
                        'duration': 2000
                    })
                },0)
                setTimeout(function(){
                    this.setState({
                        buttonStatus:false
                    })
                },2000)
            }
        })
    }
    handleErrorClick() {
        this.fetchgoodsDetail()
    }
    render() {
        const { themeReport, themeLoss, flag,
            fromMine, isError, errorMessage,
            status
        } = this.state;
        console.log(status + 'ppppppppppp')
        const { goodsDetailStore: { goodsDetail, loading } } = this.props;
        const BooFromMine = fromMine === 'true' ? true : false;
        const theme = flag === 'report' ? themeReport : themeLoss;
        const bgImg = (<Image className='bg-img' src={flag === 'report' ? alredyget : alredyfind} />)
        return (
            <View>
                {!(isError || loading) && <View className='loss-detail'>
                    <AtMessage />
                    <View className='loss-img-box'>
                        <Image src={cloud} className='loss-img'></Image>
                        <View className='theme'>{theme}</View>
                    </View>
                    <View className='loss-tatol'>
                        {(BooFromMine && status == 1) && bgImg}
                        <View className='loss-detail-title'>
                            丢失物品：{goodsDetail.title}
                        </View>
                        <View className='loss-detail-info'>
                            <View className='loss-detail-info-item'>联系人：{goodsDetail.contactor}</View>
                            <View className='loss-detail-info-item'>校区：{goodsDetail.zoneName}</View>
                            <View className='loss-detail-info-item'>联系方式：{goodsDetail.telephone}</View>
                            {flag === 'report' && <View
                                className='loss-detail-info-item'
                            >
                                拾取时间：{goodsDetail.time}
                            </View>}
                            {flag === 'report' && <View
                                className='lost-addr'
                            >
                                联系地址：{goodsDetail.addr!=="null"?goodsDetail.addr:'无'}
                            </View>
                            }
                        </View>
                    </View>
                    <View className='loss-detail-desc'>
                        <View className='loss-desc-title'>详情描述:</View>
                        <View className='loss-desc-info'>{goodsDetail.description}</View>
                    </View>
                    {(BooFromMine && status == 0) && <Button
                        className='alredy-findOrReport'
                        onClick={this.changeStatus}
                        disabled={this.state.buttonStatus}
                    >
                        {flag === 'report' ? '已领取' : '已找回'}
                    </Button>}
                </View>}
                {(isError || loading) &&
                    <View className='tips'>
                        <View className='grow-container' style='color:#333'>
                            <ErrorTip loading={loading} message={errorMessage}
                                onClick={this.handleErrorClick} />
                        </View>
                    </View>
                }
            </View>
        )
    }
}