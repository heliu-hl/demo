import Taro, { Component } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import { AtTabs, AtTabsPane } from "taro-ui";
import RoomListItem from "./RoomListItem";
import { getCacheData } from "../../../utils";
import { MEETING_ROOM_ADMIN } from "../../constants";
import MHTComponent from "../../common/MHTComponent";
import { observer, inject } from "@tarojs/mobx";
import ErrorTip from "../../../components/tip/ErrorTip";
import "./index.styl";
import EmptyStateComponent from "../../common/EmptyStateComponent";

const bookTabs = [{ title: "我的预约列表" }];
const auditTab = [{ title: "待审核" }, { title: "已审核" }];

@inject(stores => ({
  roomResListStore: stores.roomResListStore
}))
@observer
class BookingList extends MHTComponent {
  config = {
    navigationBarTitleText: getCacheData(MEETING_ROOM_ADMIN).isManager
      ? "审核列表"
      : "我的预约列表"
  };

  constructor(props) {
    super(props);
    this.state = {
      current: 0
    };
  }

  componentWillMount() {
    const admin = getCacheData(MEETING_ROOM_ADMIN);
    this.isManager = admin.isManager;
    this.personId = admin.personId;
    this.setState({
      isManager: this.isManager
    });
    this.fetchRoomResList();
  }

  componentDidShow() {
    if (this.state.needRefresh) {
      this.fetchRoomResList();
      this.setState({
        needRefresh: false
      });
    }
  }
  fetchRoomResList() {
    const params = {
      personId: this.personId,
      isManager: this.isManager
    };
    this.props.roomResListStore
      .fetchRoomResLst(params)
      .then(res => {
        this.resetError();
      })
      .catch(e => {
        this.setupError(e);
      });
  }

  handleTabChange(value) {
    this.setState({
      current: value
    });
  }

  handleErrorClick() {
    this.fetchRoomResList();
  }

  render() {
    const {
      roomResListStore: { loading, personalList, auditingList, auditedList }
    } = this.props;
    const { isError, errorMessage } = this.state;
    const isAdmin = this.state.isManager == 1 ? true : false;
    const personalData = personalList.map((item, key) => {
      return <RoomListItem meetingRoomData={item} key={key} itemIndex={key} />;
    });
    console.log("查看是否空的list:" + auditingList);
    const auditingData = auditingList.map((item, key) => {
      return <RoomListItem meetingRoomData={item} key={key} itemIndex={key} />;
    });
    const auditedData = auditedList.map((item, key) => {
      return <RoomListItem meetingRoomData={item} key={key} itemIndex={key} />;
    });
    const personalItem =
      personalList.length > 0 ? (
        personalData
      ) : (
        <EmptyStateComponent emptyStateHint="暂无您的预定信息\n\r点击【会议室预定】进行预约吧" />
      );
    const auditingItem =
      auditingList.length > 0 ? auditingData : <EmptyStateComponent />;
    const auditedItem =
      auditedList.length > 0 ? auditedData : <EmptyStateComponent />;
    return (
      <AtTabs
        current={this.state.current}
        tabList={isAdmin ? auditTab : bookTabs}
        customStyle="color:#F6F7FB;padding-bottom:40px"
        onClick={this.handleTabChange.bind(this)}
      >
        {!(isError || loading) && (
          <View>
            <AtTabsPane current={this.state.current} index={0}>
              <ScrollView scrollY style="height:100vh">
                {isAdmin ? auditingItem : personalItem}
              </ScrollView>
            </AtTabsPane>

            <AtTabsPane current={this.state.current} index={1}>
              <ScrollView scrollY style="height:100vh">
                {auditedItem}
              </ScrollView>
            </AtTabsPane>
          </View>
        )}
        {(isError || loading) && (
          <View className="grow-container" style="color:#333">
            <ErrorTip
              loading={loading}
              message={errorMessage}
              onClick={this.handleErrorClick.bind(this)}
            />
          </View>
        )}
      </AtTabs>
    );
  }
}
export default BookingList;
