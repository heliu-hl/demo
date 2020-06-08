import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.styl'

export default class ProductItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    toDeatil(infoId) {
        const { flag,fromMine } = this.props;
        console.log('呵呵呵呵呵'+fromMine);
        Taro.navigateTo({
            url: `/pages/lost-luggage/loss-detail/index?flag=${flag}&fromMine=${fromMine}&infoId=${infoId}`
        })
    }
    render() {
        const { flag,dataitem,num } = this.props;
        return (
            <View className='product-item' onClick={this.toDeatil.bind(this,dataitem.infoId)}>
                <View className='number-box'>
                    <View
                        className={flag === 'report' ? 'item-report-number' : 'item-loss-number'}
                    >
                        {String(num+1).padStart(2,'0')}
                    </View>
                </View>
                <View className='desc-test'>
                    <View className='desc-test-top'>{dataitem.title}</View>
                    <View className='desc-test-middle'>{dataitem.time}</View>
                    <View className='desc-test-bottom'>{dataitem.description}</View>
                </View>
                <View className='right-box'>
                    <View className='campus-name'>{dataitem.zoneName}</View>
                    <View className='look'>查看</View>
                </View> 
            </View>
        )
    }
}