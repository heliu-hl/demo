import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Button } from '@tarojs/components'

import Loading from "../loading/Loading"
import errorImage from '../../assets/images/icon_error.svg'

import './ErrorTip.styl'

class ErrorTip extends Component {
    static defaultProps = {
        loading: false,
        onClick: null,
        message: 'Error!'
    }

    static options = {
        addGlobalClass: true
    }

    handleClick () {
        this.props.onClick()
    }

    render () {
        const { message, loading } = this.props
        return (
            <View className='error' onClick={this.handleClick.bind(this)}>
                <View className='container'>
                    {loading && <Loading color={'#00D78F'} size={30} />}
                    {!loading && <Image className='error-image' src={errorImage} />}
                    {!loading && <Text className='error-text'>{message}</Text>}
                    {!loading && <View className='retry-button'>重试</View>}
                </View>
            </View>
        )
    }
}

export default ErrorTip
