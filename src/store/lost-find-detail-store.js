import { observable, action } from 'mobx'
import { getGoodsDetail } from '../service'

export default class goodsDetailStore {
    @loading loading= false
    @observable goodsDetail = []

    constructor({ goodsDetail = [], loading = false } = {}) {
        this.goodsDetail = goodsDetail,
        this.loading = loading
    }

    @action getGoodsDetailFunc(data) {
        return new Promise((resolve, reject) => {
            this.loading = true
            getGoodsDetail(data).then((res) => {
                this.loading = false
                this.goodsDetail = res.data
                resolve(res)
            }).catch((e) => {
                this.loading = false
                reject(e)
            })
        })
    }
}
