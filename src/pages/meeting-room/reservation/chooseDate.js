import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtCalendar} from 'taro-ui'
import './index.styl'

class ChooseDate extends Component {
  config = {
    navigationBarTitleText: '选择预定日期'
  }

  onDaySelected(e) {
    console.info(e.value)
    let pages = Taro.getCurrentPages();
    let prePage = pages[pages.length - 2]
    prePage.$component.setState({date: new Date(e.value)})
    Taro.navigateBack({delta: 1})
  }

  render() {
    return (
      <View className='index-container'>
        <AtCalendar onDayClick={this.onDaySelected.bind(this)} />
      </View>
    )
  }
}

export default ChooseDate
