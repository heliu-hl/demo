import {observable, action} from 'mobx'
import {getMeetingRoomInfo, getMeetingRoomList, lockMeetingRoom, unLockMeetingRoom} from "../service";

export default class MeetingRoomInfoStore {
  @observable title = []
  @observable timeLine = []
  @observable loading = false

  constructor ({ loading = false, title = [], timeLine = [] } = {}) {
    this.loading = loading
    this.timeLine = timeLine
    this.title = title
  }


  @action getMeetingRoomList() {
    return new Promise((resolve, reject) => {
      this.loading = true
      getMeetingRoomList().then((res) => {
        this.title = res.data
        this.loading = false
        resolve(res)
      }).catch((e) => {
        this.loading = false
        reject(e)
      })
    })
  }

  @action getMeetingRoomInfo(date) {
    return new Promise((resolve, reject) => {
      this.loading = true;
      getMeetingRoomInfo(date).then((res) => {
        this.timeLine = res.data
        this.loading = false
        resolve(res)
      }).catch((e) => {
        this.loading = false
        reject(e)
      })
    })
  }

  @action lockMeetRoom(rooId,date,startTime,endTime) {
    return new Promise((resolve, reject) => {
      this.loading = true;
      lockMeetingRoom(rooId,date,startTime,endTime).then((res) => {
        resolve(res)
      }).catch((e) => {
        this.loading = false
        reject(e)
      })
    })
  }

  @action unLockMeetRoom(lockId) {
    return new Promise((resolve, reject) => {
      this.loading = true;
      unLockMeetingRoom(lockId).then((res) => {
        resolve(res)
      }).catch((e) => {
        this.loading = false
        reject(e)
      })
    })
  }
}
