import { observable, action } from 'mobx'
import { getBusDispatchInfo, getDispatcherBusList } from "../service";

export default class BusDispatchStore {
  @observable routeList = []
  @observable driverList = []
  @observable loading = false
  @observable dispatcherBusList = []

  constructor({ routeList = [], driverList = [], loading = false, dispatcherBusList = [] } = {}) {
    this.driverList = driverList
    this.routeList = routeList
    this.loading = loading
    this.dispatcherBusList = dispatcherBusList
  }

  @action fetchBusDispatchInfo(date, type) {
    return new Promise((resolve, reject) => {
      this.loading = true
      getBusDispatchInfo(date, type).then((res) => {
        this.loading = false
        this.routeList = res.data.routList
        this.driverList = res.data.driverList
        resolve(res)
      }).catch((e) => {
        this.loading = false
        reject(e)
      })
    })
  }
  @action fetchDispatcherBusList(type) {
    return new Promise((resolve, reject) => {
      this.loading = true
      getDispatcherBusList(type).then((res) => {
        this.loading = false
        this.dispatcherBusList = res.data
        resolve(res)
      }).catch((e) => {
        this.loading = false
        reject(e)
      })
    })
  }
}
