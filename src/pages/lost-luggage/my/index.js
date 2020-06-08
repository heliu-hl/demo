import Taro, { Component } from '@tarojs/taro'
import { View, Image,OpenData } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import TabBar from '../components/index/tabBar/index'

import './index.styl'
import myBg from '../../../assets/images/my-bg.png'

export default class My extends Component {
    config = {
        navigationBarTitleText: '我的',
        navigationBarBackgroundColor: '#7fc6e7',
        navigationBarTextStyle: "white"
    }
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    toOtherPage(value){
        if(value==='loss'){
            Taro.navigateTo({
                url:'../loss/index?flag=loss&fromMine=true'
            })
        }else if(value==='report'){
            Taro.navigateTo({
                url:'../report/index?flag=report&fromMine=true'
            })
        }
    }
    render() {
        return (
            <View className='my'>
                <View className='bg'>
                    <Image src={myBg} className='my-bg-img'></Image>
                    <View className='portrait'>
                        <OpenData type="userAvatarUrl" className='portrait-img'></OpenData>      
                    </View>
                </View>
                <View className='my-item-box' onClick={this.toOtherPage.bind(this,'loss')}>
                    <View className='my-item'>
                        我的寻物启事
                    </View>
                    <AtIcon value='chevron-right' size='25' color='#4d4d4e'></AtIcon>
                </View>
                <View className='my-item-box' onClick={this.toOtherPage.bind(this,'report')}>
                    <View className='my-item'>
                        我的失物招领
                    </View>
                    <AtIcon value='chevron-right' size='25' color='#4d4d4e'></AtIcon>
                </View>
                <TabBar typeTab='mine'></TabBar>
            </View>
        )
    }
}