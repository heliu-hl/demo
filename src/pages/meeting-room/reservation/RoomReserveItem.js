import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import './index.styl'
import {getCacheData, showSimpleToast} from "../../../utils";
import {AtModal} from "taro-ui";
import {BASE_URL} from '../../../config/index';
import {MEETING_ROOM_ADMIN} from "../../constants";


class RoomReserveItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modifyText: '',
      deleteText: '关闭',
      roomReserveData: '',
      isModalOpened: false,
    }
    this.modalState = 0  ///模态框的状态，0只显示关闭按钮，1显示修改和删除按钮，2删除时的取消和确定状态
    this.modalShow  = true
  }

  handleItemClick(item, time, lockId) {
    //若不是管理员，判断是否登录，若已登录，跳转到预约界面
    const userInfo = getCacheData(MEETING_ROOM_ADMIN);
    if (userInfo) {
      if (!userInfo.isManager) {
        if (lockId === -1) {
          //未锁定才能跳转预定
          Taro.navigateTo({url: './reserve?roomId=' + item.id + '&roomName=' + item.name + '&title=' + this.props.titleName.join('-')});
        } else {
          showSimpleToast('会场已锁定！')
        }
      } else {
        this.handleLockItemClick(item, time, lockId);
      }
    } else {
      Taro.navigateTo({url: '../login/index'})
    }
  }

  //处理点击显示预定信息
  handleBookItemClick(e) {
    const that = this;
    const url = `${BASE_URL}propertyAPI/getNoticeInfo`;
    const bookId = e.currentTarget.dataset.bookid;
    Taro.request({
      url: url,
      method: 'GET',
      data: {
        bookId
      },
      success: function (res) {
        that.setState({
          roomReserveData: res.data.data,
        }, function () {
          that.handleModalChange()
        });
      },
      fail: function () {
        showSimpleToast('请求出错，请检查网络后重试')
      }
    })
  }

  //切换模态框状态
  handleModalChange() {
    const userInfo = getCacheData(MEETING_ROOM_ADMIN);
    if (userInfo) {
      if (!userInfo.isManager) {
        this.modalState = 0;
        this.modalShow = true;
        this.setState({
          isModalOpened: true,
          modifyText: '',
          deleteText: '关闭'
        })
      } else {
        this.modalState = 1;
        this.modalShow = true;
        this.setState({
          isModalOpened: true,
          modifyText: '修改',
          deleteText: '删除'
        });
      }
    } else {
      Taro.navigateTo({url: '../login/index'})
    }
  }

  //管理员删除预定信息
  handleDelete() {
    switch (this.modalState) {
      case 1:
        this.modalState = 2;
        this.modalShow = true;
        this.setState({
          isModalOpened: true,
          modifyText: '确定',
          deleteText: '取消'
        })
        break;
      case 0:
      case 2:
        this.modalState = 0
      default:
        this.setState({
          isModalOpened: false,
        })
    }
  }

  handleModify(bookId) {
    this.setState({
      isModalOpened: false
    })
    switch (this.modalState) {
      case 1:
        Taro.navigateTo({url: './reserve?bookId=' + bookId + '&title=' + this.props.titleName.join('-')});
        break
      case 2:
        this.deleteInfo(bookId)
        break
    }
    this.modalState = 0
  }

  deleteInfo(bookId) {
    const that = this;
    const url = `${BASE_URL}propertyAPI/cancel`;
    Taro.request({
      url: url,
      method: 'GET',
      data: {
        bookId
      },
      success: function () {
        that.modalState = 0;
        showSimpleToast('操作成功');
        that.handleRefreshData()
      },
      fail: function () {
        showSimpleToast('请求出错，请检查网络后重试')
      }
    })
  }

  // 锁定会议室
  handleLockItemClick(item, time, lockId) {
    this.setState({isModalOpened:false})
    this.props.onItemTap(item, time, lockId)
  }

  //管理员删除信息后刷新数据
  handleRefreshData() {
    this.props.onRefreshData()
  }
  /*解决点击取消锁定时两个modal重叠的问题*/
  handleModalClose(){
    this.modalShow = false
  }

  render() {
    const titleList = this.props.titlelist
    const dataList = this.props.datalist
    const time = this.props.time
    const {deleteText, modifyText, isModalOpened, roomReserveData} = this.state
    const reserveItem = titleList.map((item, key) => {
      let css = dataList[key].bookId === 0 ? 'item-text;text10' : 'item-text;' + 'text' + dataList[key].auditState
      return (dataList[key].bookId && dataList[key].bookId !== 0 ?
        <Text
          className={css}
          key={key}
          data-bookId={dataList[key].bookId}
          onClick={this.handleBookItemClick.bind(this)}
        /> :
        <Text
          className={css}
          onClick={this.handleItemClick.bind(this, item, time, dataList[key].lockId ? dataList[key].lockId : -1)}
          key={key}
          data-roomid={item.id}
          data-time={time}
        />)
    })

    return (
      <View>
        <AtModal
          isOpened={isModalOpened && this.modalShow}
          title='提示'
          cancelText={deleteText}
          confirmText={modifyText}
          onClose={this.handleModalClose.bind(this)}
          onConfirm={this.handleModify.bind(this, roomReserveData.bookId)}
          onCancel={this.handleDelete.bind(this, roomReserveData)}
          content={this.modalState === 2 ? '是否要删除信息' :
            `申请人：${roomReserveData.applyPerson}
                    联系电话：${roomReserveData.mobile}
                    活动名称：${roomReserveData.avtivityName}
                    会场名称：${roomReserveData.roomName}
                    申请时间：${roomReserveData.layoutTime}
                    彩排时间：${roomReserveData.rehearsalTime}
                    演出时间：${roomReserveData.showTime}
                    审核状态：${roomReserveData.state}
                    `}
        />
        <View className='item-container'>
          <Text className='item-time;item-text'>{time}</Text>
          {reserveItem}
        </View>
      </View>
    )
  }

}

export default RoomReserveItem
