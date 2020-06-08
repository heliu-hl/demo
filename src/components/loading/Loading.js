import Taro, { Component } from '@tarojs/taro'
import { View} from '@tarojs/components'
import PropTypes from "prop-types"

import './Loading.styl'

class Loading extends Component {
    static defaultProps = {
        size: '18',
        color: '#fff'
    }

    static propTypes = {
        size: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        color: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ])
    }

    render () {
        const { color, size } = this.props
        const sizeStyle = {
            width: `${size}PX`,
            height: `${size}PX`
        }
        const colorStyle = {
            'border': `3px solid ${color}`,
            'border-color': `${color} transparent transparent transparent`
        }
        const ringStyle = Object.assign({}, colorStyle, sizeStyle)

        return (
            <View className='at-loading' style={sizeStyle}>
                <View className='at-loading__ring' style={ringStyle}></View>
                <View className='at-loading__ring' style={ringStyle}></View>
                <View className='at-loading__ring' style={ringStyle}></View>
            </View>
        )
    }
}

export default Loading
