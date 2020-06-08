import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import ReportHeader from '../components/report/header/index'
import ProductItem from '../components/index/product-item/index'
import ErrorTip from "../../../components/tip/ErrorTip";
import MHTComponent from "../../common/MHTComponent";

import './index.styl'

@inject((stores) => ({
    lostFindStore: stores.lostFindStore
}))

@observer
export default class ReportLoss extends MHTComponent {
    config = {
        navigationBarTitleText: '失物',
        navigationBarBackgroundColor: '#7fc6e7',
        navigationBarTextStyle: "white",
        backgroundTextStyle: "dark",
        enablePullDownRefresh: true,
        onReachBottomDistance: 50
    }
    constructor(props) {
        super(props);
        this.state = {
            flag: '',
            fromMine: false,
            search_param: '',
            school: '沙河校区',
            current: 1,
            lostFindList: [],
            page: 1,
            count: 7,
            totalPage: 1
        }
        this.handleShoolClick = this.handleShoolClick.bind(this)
        this.getSearchWords = this.getSearchWords.bind(this)
    }
    componentWillMount() {
        const flag = this.$router.params.flag;
        const from_mine = this.$router.params.fromMine;
        const fromMine = from_mine ? from_mine : false;
        this.setState({
            flag: flag,
            fromMine: fromMine
        })
        this.fetchLostAndFind()
    }
    componentDidMount() {
        // this.fetchLostAndFind()
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
    fetchLostAndFind(page = 1, count = 7,bottom=false) {
        const that=this;
        const { school } = this.state;
        let school_zone;
        if (school === '沙河校区') {
            school_zone = 3
        } else if (school === '清水河校区') {
            school_zone = 4
        }
        const { search_param,current } = this.state;
        const type = current;
        const bus_user_info = Taro.getStorageSync('bus_user_info');
        const openid = bus_user_info.openid;
        this.props.lostFindStore.getLostFindList({ type, search_param, school_zone, openid,page,count }).then((res) => {
            Taro.stopPullDownRefresh();
            Taro.hideLoading();
            this.setState({
                isError: false,
                lostFindList: parseInt(page) > 1 ? that.state.lostFindList.concat(res.data) : res.data,
                page: res.currentPage,
                totalPage: res.pages
            })
        }).catch((e) => {
            Taro.stopPullDownRefresh();
            Taro.hideLoading();
            this.setState({
                isError: true,
                errorMessage: e.message
            })
        })
    }
    handleErrorClick() {
        this.fetchLostAndFind()
    }
    render() {
        const { isError, errorMessage } = this.state;
        const { flag, lostFindList, fromMine } = this.state;
        const { lostFindStore: { loading } } = this.props;
        console.log(loading)
        const dataLists = lostFindList.map((item, index) => {
            return <ProductItem
                flag={flag}
                fromMine={fromMine}
                dataitem={item}
                key={index}
                num={index}
            />
        })
        const fanlDataList = lostFindList.length > 0 ? dataLists : (<View style={{ textAlign: 'center', marginTop: '100px' }}>暂无更多数据</View>)
        return (
            <View className='report-loss'>
                <ReportHeader
                    handleShoolClick={this.handleShoolClick}
                    getSearchWords={this.getSearchWords}
                />
                {!(isError || loading) && fanlDataList}
                {(isError || loading) &&
                    <View className='tips'>
                        <View className='grow-container' style={{ 'color': '#333' }}>
                            <ErrorTip loading={loading} message={errorMessage}
                                onClick={this.handleErrorClick.bind(this)} />
                        </View>
                    </View>
                }
            </View>
        )
    }
}