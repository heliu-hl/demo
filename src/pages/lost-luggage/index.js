import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabs, AtTabsPane ,AtModal} from 'taro-ui'
import { getLostAndFindList, getListNumber } from '../../service/index'
import ProductItem from './components/index/product-item/index'
import ErrorTip from "../../components/tip/ErrorTip"
import MHTComponent from "../common/MHTComponent"
import TabBar from './components/index/tabBar/index'
import Header from './components/report/header/index'
import './index.styl'
import { getGlobalData, setGlobalData } from '../../global_data'

export default class LostLuggage extends MHTComponent {
    config = {
        navigationBarTitleText: '失物招领',
        navigationBarBackgroundColor: '#7fc6e7',
        navigationBarTextStyle: "white",
        backgroundTextStyle: "dark",
        enablePullDownRefresh: true,
        onReachBottomDistance: 50
    }
    constructor(props) {
        super(props);
        this.state = {
            lossFlag: 'loss',
            reportFlag: 'report',
            fromMine: false,
            current: 0,
            search_param: '',
            school: '沙河校区',
            loading: false,
            lostFindList: [],
            page: 1,
            count: 10,
            totalPage: 1,
            gsCount: 0,
            zlCount: 0,
            modalShow:getGlobalData('modalShow')
        }
        this.handleShoolClick = this.handleShoolClick.bind(this)
        this.getSearchWords = this.getSearchWords.bind(this)
    }
    componentWillMount() {
        this.fetchLostAndFind();
        this.fetchListNumber();
    }

    //获取列表数据条数
    fetchListNumber() {
        getListNumber().then((res) => {
            this.setState({
                gsCount: res.data.gsCount,
                zlCount: res.data.zlCount
            })
        })
    }
    fetchLostAndFind(page = 1, count = 10, bottom = false) {
        const that = this;
        const { school, search_param, current } = this.state;
        let school_zone;
        if (school === '沙河校区') {
            school_zone = 3
        } else if (school === '清水河校区') {
            school_zone = 4
        }
        const type = current + 1;
        new Promise((resolve, reject) => {
            that.setState({ loading: bottom ? false : true, isError: bottom ? false : true })
            getLostAndFindList({ type, search_param, school_zone, page, count }).then((res) => {
                that.setState({
                    loading: false,
                    lostFindList: parseInt(page) > 1 ? that.state.lostFindList.concat(res.data) : res.data,
                    page: res.currentPage,
                    totalPage: res.pages
                })
                resolve(res)
            }).catch((e) => {
                that.setState({ loading: false })
                reject(e)
            })
        }).then(() => {
            Taro.stopPullDownRefresh();
            Taro.hideLoading();
            that.setState({
                isError: false
            })
        }).catch((e) => {
            Taro.stopPullDownRefresh();
            Taro.hideLoading();
            that.setState({
                isError: false,
                errorMessage: e.message
            })
        })
    }
    //下拉刷新
    onPullDownRefresh() {
        this.fetchLostAndFind();
    }
    // 上拉加载
    onReachBottom() {
        const { page, count, totalPage } = this.state;
        const bottom = true
        if (parseInt(page) < parseInt(totalPage)) {
            const finalPage = parseInt(page) + 1;
            Taro.showLoading({
                title: '玩儿命加载中',
            })
            this.fetchLostAndFind(finalPage, count, bottom);
        } else if (parseInt(page) === parseInt(totalPage)) {
            Taro.showToast({
                icon: 'none',
                title: '我是有底线的',
                duration: 1000,
                mask: true
            })
        }
    }
    handleClick(value) {
        this.setState({
            current: value
        }, function () {
            this.fetchLostAndFind()
        })
    }
    getSearchWords(value) {
        this.setState({
            search_param: value
        }, function () {
            this.fetchLostAndFind()
        })
    }
    handleShoolClick(value) {
        this.setState({
            school: value
        }, function () {
            this.fetchLostAndFind()
        })
    }
    handleErrorClick() {
        this.fetchLostAndFind()
    }

    //关闭提示框
    handleClose(){
        setGlobalData('modalShow',false);
        this.setState({
            modalShow:false
        })
    }

    render() {
        const { isError, errorMessage, lossFlag,
            reportFlag, fromMine, current,
            lostFindList, loading, gsCount, zlCount
        } = this.state;
        let modalShow = getGlobalData('modalShow');
        const tabList = [{ title: `报失`, color: '#7fc6e7' }, { title: `招领`, color: '#7fc6e7' }];
        const dataLists = lostFindList.map((item, index) => {
            return <ProductItem
                flag={current === 0 ? lossFlag : reportFlag}
                fromMine={fromMine}
                dataitem={item}
                key={index}
                num={index}
            />
        })
        const fanlDataList = lostFindList.length > 0 ? dataLists : <View style={{ textAlign: 'center', marginTop: '100px' }}>暂无更多数据</View>
        return (
            <View className='lost-luggage'>
                <AtModal
                isOpened={modalShow}
                title='提示'
                cancelText='取消'
                confirmText='确认'
                onClose={ this.handleClose.bind(this) }
                onCancel={ this.handleClose.bind(this) }
                onConfirm={ this.handleClose.bind(this) }
                content='功能测试中，正式版发布，敬请期待。'
                />
                <View className='gsCount'>
                    ({gsCount}条)
                </View>
                <View className='zlCount'>
                    ({zlCount}条)
                </View>
                <Header
                    handleShoolClick={this.handleShoolClick}
                    getSearchWords={this.getSearchWords}
                />
                <AtTabs
                    swipeable={false}
                    current={this.state.current}
                    tabList={tabList}
                    onClick={this.handleClick.bind(this)}
                >
                    <AtTabsPane current={this.state.current} index={0}>
                        {!(isError || loading) && fanlDataList}
                        {(isError || loading) &&
                            <View className='tips'>
                                <View className='grow-container' style={{ 'color': '#333' }}>
                                    <ErrorTip loading={loading} message={errorMessage}
                                        onClick={this.handleErrorClick.bind(this)} />
                                </View>
                            </View>
                        }
                    </AtTabsPane>
                    <AtTabsPane current={this.state.current} index={1}>
                        {!(isError || loading) && fanlDataList}
                        {(isError || loading) &&
                            <View className='tips'>
                                <View className='grow-container' style={{ 'color': '#333' }}>
                                    <ErrorTip loading={loading} message={errorMessage}
                                        onClick={this.handleErrorClick.bind(this)} />
                                </View>
                            </View>
                        }
                    </AtTabsPane>
                </AtTabs>
                <TabBar
                    typeTab='home'
                >
                </TabBar>
            </View>
        )
    }
}