import { observable, action } from 'mobx'
import { getBusCodeList } from "../service";

export default class BusBindStore {
  @observable roleList = []
  @observable loading = false

  constructor({ roleList = [], loading = false } = {}) {
    this.roleList = roleList
    this.loading = loading
  }

  @action fetchBusRoleList(type) {
    return new Promise((resolve, reject) => {
      this.loading = true
      getBusCodeList(type).then((res) => {
        this.loading = false
        this.roleList = res.data
        resolve(res)
      }).catch((e) => {
        this.loading = false
        reject(e)
      })
    })
  }
}
