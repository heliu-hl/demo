import {observable, action} from 'mobx'
import {getBookList} from "../service"

export default class RoomResListStore {
  @observable auditedList = []
  @observable personalList = []
  @observable auditingList = []
  @observable loading = false

  constructor({loading = false, auditedList = [],personalList = [],auditingList = []} = {}){
    this.loading = loading
    this.auditedList = auditedList
    this.auditingList = auditingList
    this.personalList = personalList
  }

  @action fetchRoomResLst(param) {
    return new Promise((resolve,reject) =>{
      this.loading = true
      getBookList(param).then((res) => {
        this.loading = false
        if (res.flag) {
          this.auditedList = res.data.auditedList
          this.auditingList = res.data.auditingList
          this.personalList = res.data.personalList
          resolve(res)
        }else{
          reject(res)
        }
      }).catch((e)=>{
        this.loading = false
        reject(e)
      })
    })
  }
}
