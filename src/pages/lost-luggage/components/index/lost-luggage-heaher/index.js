import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import lostHeaderImg from '../../../../../assets/images/lost-header-bg.png'
import './index.styl'

export default class LostLuggageHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            school: [
                { shcoolName: '沙河校区', type: 3 },
                { shcoolName: '清水河校区', type: 4 }
            ]
        }
        this.handleClick = this.handleClick.bind(this);
        this.handdleMoreClick = this.handdleMoreClick.bind(this);
    }

    handleClick(e) {
        this.props.handleShoolClick(e)
    }
    handdleMoreClick() {
        const {flag}=this.props;
        if(flag==='loss'){
            Taro.navigateTo({
                url:'../../../loss/index?flag=loss'
            })
        }else if(flag==='report'){
            Taro.navigateTo({
                url:'../../../report/index?flag=report'
            })
        }
    }
    render() {
        const { school } = this.state;
        const { currentType, headerText, isChooseShow} = this.props;
        return (
            <View className='lost-luggage-header'>
                <Image src={lostHeaderImg} className='lost-header-img'></Image>
                <View className='lost-header-top'>
                    <View className='header-left'>
                        <View className='headerText'>{headerText}</View>
                        {isChooseShow && <View>
                            <Text
                                className={currentType === 3 ? 'current' : 'qing-river'}
                                data-type={school[0].type}
                                onClick={this.handleClick}
                            >
                                {school[0].shcoolName}
                            </Text>
                            <Text className='Division'>/</Text>
                            <Text
                                className={currentType === 4 ? 'current' : 'qing-river'}
                                data-type={school[1].type}
                                onClick={this.handleClick}
                            >
                                {school[1].shcoolName}
                            </Text>
                        </View>}
                    </View>
                    <View
                        className='more'
                        onClick={this.handdleMoreClick}
                    >
                        更多<AtIcon value='chevron-right' size='15' color='#272727' />
                    </View>
                </View>
            </View>
        )
    }
}