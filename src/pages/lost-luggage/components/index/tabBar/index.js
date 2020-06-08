import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { observer, inject } from '@tarojs/mobx'

import './index.styl'
import upLoadingImg from '../../../../../assets/images/uploading.png'

@inject((stores) => ({
    currentStore: stores.currentStore
}))

@observer
export default class TabBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 'home'
        }
    }
    changeTabBar(value) {
        if (value === 'home') {
            this.props.currentStore.changeCurrent(value);
            Taro.redirectTo({
                url: '/pages/lost-luggage/index'
            })
        } else if (value === 'mine') {
            this.props.currentStore.changeCurrent(value)
            Taro.redirectTo({
                url: '/pages/lost-luggage/my/index'
            })
        } else if (value === 'up') {
            Taro.navigateTo({
                url: '/pages/lost-luggage/up/index'
            })
        }
    }
    componentWillMount() {
        const { typeTab } = this.props;
        this.props.currentStore.changeCurrent(typeTab).then(() => {
            const { currentStore: { current } } = this.props;
            this.setState({
                current
            })
        })
    }
    render() {
        const { current } = this.state;
        return (
            <View className='tab-bar'>
                <View className='tab-bar-home'>
                    <View className='tab-home-container' onClick={this.changeTabBar.bind(this, 'home')}>
                        <View className='tab-home-box'>
                            <AtIcon
                                prefixClass='icon'
                                value='shouye'
                                size='25'
                                color={current === 'home' ? '#7fc6e7' : '#515151'}
                            >
                            </AtIcon>
                            <View className={current === 'home' ? 'currntStyle' : ''}>首页</View>
                        </View>
                    </View>
                </View>
                <View className='tab-up-box' onClick={this.changeTabBar.bind(this, 'up')}>
                    <Image
                        src={upLoadingImg}
                        className='up-img'
                    >
                    </Image>
                    <View className='up-text'>发布</View>
                </View>
                <View className='tab-bar-mine'>
                    <View className='tab-mine-container' onClick={this.changeTabBar.bind(this, 'mine')}>
                        <View className='tab-mine-box'>
                            <AtIcon
                                prefixClass='icon'
                                value='wode'
                                size='25'
                                color={current === 'mine' ? '#7fc6e7' : '#515151'}
                            >
                            </AtIcon>
                            <View className={current === 'mine' ? 'currntStyle' : ''}>我的</View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}