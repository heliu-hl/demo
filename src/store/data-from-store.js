import {observable,action} from 'mobx'
import {getDataForm} from '../service/index'

export default class DataFromStore {
    @observable dataForm = '默认'
    @observable source=''
    @observable address=''

    constructor({ dataForm = '默认',source='',address='' } = {}) {
        this.dataForm = dataForm;
        this.source=source
        this.address=address
    }

    @action getDataFormFunc(data) {
        return new Promise((resolve, reject) => {
            getDataForm(data).then((res) => {
                console.log(res)
                this.dataForm = res.name
                this.source=res.source
                this.address=res.addr
                resolve(res)
            }).catch((e) => {
                reject(e)
            })
        })
    }
}