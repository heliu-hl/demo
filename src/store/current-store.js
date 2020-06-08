import { observable, action } from 'mobx'

export default class BusListStore {
  @observable current = 'home'

  constructor({ current = 'home' } = {}) {
    this.current = current
  }

  @action changeCurrent(value) {
    return new Promise((resolve) => {
      if (value === 'home') {
        this.current = value
      } else if (value === 'mine') {
        this.current = value
      }
      resolve(value)
    })
  }
}