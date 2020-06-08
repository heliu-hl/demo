import {observable,action} from 'mobx'
import {getBusList} from "../service";

export default class BusListStore {
  @observable busList = []
  @observable loading = false

  constructor({busList = [], loading = false} = {}) {
    this.loading = loading
    this.busList = busList
  }

  @action fetchBusList(type) {
    return new Promise((resolve,reject) =>{
      this.loading = true
      getBusList(type).then((res) =>{
        this.loading = false
        this.busList = res.data
        resolve(res)
      }).catch((e) =>{
        this.loading = false
        reject(e)
      })
    })
  }
}
