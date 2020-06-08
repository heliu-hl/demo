import {observable,action} from 'mobx'
import {getMyTicket} from "../service";

export default class TicketListStore {
  @observable ticketList = []
  @observable loading = false

  constructor({tickList = [], loading = false} = {}) {
    this.loading = loading
    this.ticketList = tickList
  }

  @action fetchTicketList(openId) {
    return new Promise((resolve,reject) =>{
      this.loading = true
      getMyTicket(openId).then((res) =>{
        this.loading = false
        this.ticketList = res.data
        resolve(res)
      }).catch((e) =>{
        this.loading = false
        reject(e)
      })
    })
  }
}
