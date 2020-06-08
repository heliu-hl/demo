import Taro, { Component } from '@tarojs/taro'
import {View,Text} from  '@tarojs/components'
import './emptyState.styl'

export default class EmptyStateComponent extends Component{
  static options = {
    addGlobalClass: true
  }
  constructor(props) {
    super(props)
  }
  render() {
    return(
      <View className='root'>
        <Text className='empty-hint'>{this.props.emptyStateHint}</Text>
      </View>
    )
  }
}

EmptyStateComponent.defaultProps = {
  emptyStateHint: '暂无数据'
}
