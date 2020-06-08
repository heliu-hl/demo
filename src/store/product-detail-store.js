import { observable, action } from 'mobx';
import { getProductDetail } from '../service';

export default class ProductDetailInfo {
    @observable productInfo = []
    @observable loading = false
    @observable imagesList = []

    constructor({ productInfo = [], loading = false, imagesList = [] }={}) {
        this.productInfo = productInfo
        this.loading = loading
        this.imagesList = imagesList
    }
    @action fetchProductInfo(id) {
        return new Promise((resolve, reject) => {
            this.loading = true
            getProductDetail(id).then((res) => {
                this.loading = false
                this.productInfo = res.data
                this.imagesList = res.imageList
                resolve(res)
            }).catch((e) => {
                this.loading = false
                reject(e)
            })
        })
    }
}