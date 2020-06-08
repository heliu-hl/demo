import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker, ScrollView,Button } from '@tarojs/components'
import { AtInput, AtTextarea, AtMessage } from 'taro-ui'
import { observer, inject } from '@tarojs/mobx'
import { isVarEmpty, handleFinalData } from '../../../utils/index'
import { BASE_URL } from '../../../config/index'

import './index.styl'

@inject((stores) => ({
    dataFromStore: stores.dataFromStore
}))

@observer
export default class Up extends Component {
    config = {
        navigationBarTitleText: '发布',
        navigationBarBackgroundColor: '#7fc6e7',
        navigationBarTextStyle: "white"
    }
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            dateSel: '2019-07-01',
            currentType: 2,
            selector: ['沙河校区', '清水河校区'],
            selectorChecked: '沙河校区',
            title: '',
            phone: '',
            dataForm: '默认',
            source: '',
            address: '',
            buttonStatus:false
        }
        this.onDateChange = this.onDateChange.bind(this);
        this.handleAreaChange = this.handleAreaChange.bind(this);
        this.onCampusChange = this.onCampusChange.bind(this);
        this.handlesubmit = this.handlesubmit.bind(this)
    }
    componentDidMount() {
        this.fetchGetDataForm()
    }
    //获取数据来源
    fetchGetDataForm() {
        const that = this;
        try {
            let bus_user_info = Taro.getStorageSync('bus_user_info')
            if (bus_user_info) {
                const openid = bus_user_info.openid
                this.props.dataFromStore.getDataFormFunc({ openid }).then(() => {
                    const { dataFromStore: { dataForm, source, address } } = that.props;
                    that.setState({ dataForm, source, address });
                }).catch(() => {
                })
            }
        } catch (e) {
            // Do something when catch error
        }
    }
    //电话和标题
    handleChange(type, value) {
        if (type === 'title') {
            this.setState({
                title: value
            })
            return value
        } else if (type === 'phone') {
            this.setState({
                phone: value
            })
            return value
        } else if (type === 'address') {
            this.setState({
                address: value
            })
        }
    }
    //多行文本输入框
    handleAreaChange(event) {
        this.setState({
            value: event.target.value
        })
    }
    // 时间选择
    onDateChange = e => {
        this.setState({
            dateSel: e.detail.value
        })
    }
    // 失物招领或者寻物启事
    HandleLostOrReport(value) {
        this.setState({
            currentType: value
        })
    }
    // 校区选择
    onCampusChange(e) {
        const { selector } = this.state
        this.setState({
            selectorChecked: selector[e.detail.value]
        })
    }
    //提交
    handlesubmit() {
        const that=this;
        const { value, title, phone, address } = this.state;
        const isValue = isVarEmpty(value);
        const isTitle = isVarEmpty(title);
        const isPhone = isVarEmpty(phone);
        if (isValue || isTitle || isPhone) {
            Taro.atMessage({
                'message': '请将表单输入完整',
                'type': 'error',
                'duration': 2000
            })
        } else {
            this.setState({
                buttonStatus:true
            })
            const { dateSel, currentType, selectorChecked, source } = this.state;
            const openid = Taro.getStorageSync('bus_user_info').openid;
            let school_zone;
            if (selectorChecked === '沙河校区') {
                school_zone = 3;
            } else if (selectorChecked === '清水河校区') {
                school_zone = 4;
            }
            Taro.showLoading({
                title:'发布中',                             
                mask:true                                    
            })
            Taro.request({
                url: BASE_URL + 'lostAndFound/addInfo',
                data: {
                    type: currentType,
                    school_zone,
                    title,
                    date: dateSel,
                    desc: value,
                    telephone: phone,
                    source,
                    openid,
                    addr: address
                },
                header: {
                    'content-type': 'application/json'
                }, success(res) {
                    Taro.hideLoading();
                    handleFinalData(res, '../index',that)
                }, fail() {
                    Taro.hideLoading();
                    setTimeout(function(){
                        Taro.atMessage({
                            'message': '提交失败',
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
    }
    render() {
        let { dateSel, currentType, selectorChecked, title, phone, value, dataForm, address } = this.state;
        const TipsText = '可不填'
        const finalAddress = address ? address : TipsText
        const year = dateSel.split('-')[0];
        const months = dateSel.split('-')[1];
        const day = dateSel.split('-')[2];
        return (
            <View className='up'>
                <AtMessage />
                <View className='dataFrom-container'>
                    <View className='dataFrom'>数据来源：</View>
                    <View className='dataFrom-box'>
                        {dataForm}
                    </View>
                </View>
                <View className="category-container">
                    <View className='category'>类目：</View>
                    <View className='category-box'>
                        <View
                            className={currentType === 2 ? 'category-box-current' : 'category-box-pre'}
                            onClick={this.HandleLostOrReport.bind(this, 2)}
                        >
                            失物招领
                        </View>
                        <View
                            className={currentType === 1 ? 'category-box-current' : 'category-box-pre'}
                            onClick={this.HandleLostOrReport.bind(this, 1)}
                        >
                            寻物启事
                        </View>
                    </View>
                </View>
                <View className='campus-container'>
                    <View className='campus'>校区：</View>
                    <Picker
                        mode='selector'
                        range={this.state.selector}
                        onChange={this.onCampusChange}
                    >
                        <View className='campus-box'>{selectorChecked}</View>
                    </Picker>
                </View>
                <View className='title-container'>
                    <View className='title'>标题：</View>
                    <AtInput
                        name='title'
                        className='title-box'
                        type='text'
                        placeholder='钥匙、饭卡'
                        value={title}
                        onChange={this.handleChange.bind(this, 'title')}
                    />
                </View>
                {(currentType === 2) &&
                    <View className='time-container'>
                        <View className='time'>时间：</View>
                        <View className='time-box'>
                            <Picker mode='date' onChange={this.onDateChange}>
                                <View className='picker'>
                                    <Text className='date-number'>{year}</Text>年
                                        <Text className='date-number'>{months}</Text>月
                                        <Text className='date-number'>{day}</Text>日
                                    </View>
                            </Picker>
                        </View>
                    </View>
                }
                <View className='desc-container'>
                    <View className='desc'>物品描述：</View>
                    <AtTextarea
                        className='desc-box'
                        value={value}
                        onChange={this.handleAreaChange}
                        maxLength={200}
                        placeholder='请描述...'
                    />
                </View>
                <View className='connect-container'>
                    <View className='connect'>联系方式：</View>
                    <AtInput
                        name='phone'
                        className='connect-box'
                        type='phone'
                        placeholder='请输入电话号码'
                        value={phone}
                        onChange={this.handleChange.bind(this, 'phone')}
                    />
                </View>
                <View className='address-container'>
                    <View className='address'>地址：</View>
                    <AtInput
                        name='address'
                        className='address-box'
                        type='text'
                        placeholder={finalAddress}
                        value={address}
                        onChange={this.handleChange.bind(this, 'address')}
                    />
                </View>
                <Button className='submit' onClick={this.handlesubmit} disabled={this.state.buttonStatus}>提交</Button>
            </View>
        )
    }
}