import Taro, { Component } from '@tarojs/taro'
import { View, Input, Icon, Picker } from '@tarojs/components'

import './index.styl'

export default class ReportHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchWords: '',
            selector: ['沙河校区', '清水河校区'],
            selectorChecked: '沙河校区',
        }
        this.onChange = this.onChange.bind(this);
        this.handleChangeCampus = this.handleChangeCampus.bind(this);
    }
    onChange(e) {
        this.setState({
            searchWords: e.detail.value
        },function(){
            const {searchWords}=this.state;
            this.props.getSearchWords(searchWords)
        })
        return e.detail.value
    }
    handleChangeCampus(e) {
        this.setState({
            selectorChecked: this.state.selector[e.detail.value]
        },function(){
            const {selectorChecked}=this.state
            this.props.handleShoolClick(selectorChecked)
        })
    }
    render() {
        const { selectorChecked ,searchWords} = this.state;
        return (
            <View className='r-header'>
                <View className='search-box'>
                    <Input
                        className='s-input'
                        name='value'
                        type='text'
                        placeholder='请输入关键字'
                        value={searchWords}
                        onChange={this.onChange}
                    />
                    <Icon
                        type="search"
                        size="16"
                        color="#707070"
                        className='shortIcon'
                    />
                </View>
                <Picker mode='selector' range={this.state.selector} onChange={this.handleChangeCampus}>
                    <View className='picker'>
                        <View className='campusKinds'>{selectorChecked}</View>
                    </View>
                </Picker>
            </View>
        )
    }
}