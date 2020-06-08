import { observable, action } from 'mobx'
import { getLostAndFindList } from '../service'

export default class LostAndFindListStore {
    @observable loading = false
    @observable lostFindList = []
    constructor({ lostFindList = [], loading = false } = {}) {
        this.lostFindList = lostFindList,
        this.loading = loading
    }

    @action getLostFindList(data) {
        return new Promise((resolve, reject) => {
            this.loading = true
            getLostAndFindList(data).then((res) => {
                this.loading = false
                this.lostFindList = res.data
                resolve(res)
            }).catch((e) => {
                this.loading = false
                reject(e)
            })
        })
    }
}