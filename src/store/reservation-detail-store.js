import {observable,action} from 'mobx'
import {getReservationDetail, auditReservation, getAssignPerson} from "../service";

export default class ReservationDetailStore {
  @observable loading = false
  @observable reservationDetail = {}
  @observable assignPersonList = []

  constructor({loading = false, reservationInfo = {},assignPersonList = []} = {}) {
    this.loading = loading
    this.reservationDetail = reservationInfo
    this.assignPersonList = assignPersonList
  }

  @action fetchReservationDetail(bookId) {
    return new Promise((resolve, reject) => {
      this.loading = true
      getReservationDetail(bookId).then((res) => {
        this.loading = false
        this.reservationDetail = res.data
        resolve(res)
      }).catch((e) => {
        this.loading = false
        reject(e)
      });
    })
  }

  @action auditReservationInfo(param) {
    return new Promise((resolve, reject) => {
      this.loading = true
      auditReservation(param).then((res) => {
        this.loading = false
        resolve(res)
      }).catch((e) => {
        this.loading = false
        reject(e)
      });
    })
  }

  @action fetchAssignPerson() {
    return new Promise((resolve, reject) => {
      this.loading = true
      getAssignPerson().then((res) => {
        this.loading = false
        this.assignPersonList = res.data
        resolve(res)
      }).catch((e) => {
        this.loading = false
        reject(e)
      });
    })
  }
}
