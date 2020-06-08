import { observable, action } from 'mobx'
import {loginMeetingRoom} from "../service";
import {setCacheData} from "../utils";
import {MEETING_ROOM_ADMIN} from "../pages/constants";

export default class LoginStore {
  @observable loading = false

  constructor({loading = false} ={}) {
    this.loading = loading
  }

  @action postLoginForm(param) {
    return new Promise((resolve, reject) => {
      this.loading = true
      loginMeetingRoom(param).then((res) => {
        if (res.flag) {
        let admin = {
          isManager: res.data.isManager,
          mobile: res.data.mobile,
          name: res.data.name,
          personId: res.data.personId,
          deptName: res.data.deptName,
          // deptNo : res.data.data.deptNo
        }
        setCacheData(MEETING_ROOM_ADMIN, admin)
        resolve(res)
      }else {
        reject(res)
      }
        this.loading = false
      }).catch((e) => {
        this.loading = false
        reject(e)
      })
    })
  }
}
