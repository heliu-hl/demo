import Taro, {Component} from '@tarojs/taro'
import {View} from "@tarojs/components";
import {AtImagePicker,AtButton,AtToast} from 'taro-ui'
import {BASE_URL} from "../../../config";
import MHTComponent from "../../common/MHTComponent";
import {isNullEmpty} from "../../../utils";


const IS_WEAPP = process.env.TARO_ENV === 'weapp'
export default class UploadImage extends MHTComponent {

  config={
    navigationBarTitleText:'上传图片'
  }
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      image: [],
      showAddBtn: true,
      imgIndex:0
    }
  }

  componentWillMount() {
    this.bookId = this.$router.params.bookId
  }

  pickImage(image, type, index) {
    this.setState({
      image,
      showToast : false,
    });

    let imgArr=[];
    for(let i = 0;i<image.length;i++){
      imgArr.push(image[i].url)
    }
console.log(imgArr,"BBB")
    if(type=="add"){
      let {imgIndex} = this.state;
      this.setState({
        imgIndex:imgIndex+1
      })
      this.doPostImage(imgArr[imgIndex])
      if(imgIndex==4){
        this.setState({
          showAddBtn: false
        })
      }
    }else if(type=="remove"){
      this.removeImg(index);
      this.setState({
        imgIndex:this.state.imgIndex-1,
        showAddBtn:true
      });
    }

  }

  uploadImage() {
    this.navigateToBookingList()
  }
  removeImg(index){
    Taro.request({
      url:BASE_URL +'propertyAPI/delImg',
      data:{
        bookId:this.$router.params.bookId,
        index
      },
      success:res=>{
        console.log(res)
        this.setState({
          showToast : true,
          toastMessage:res.data.msg
        })
      }, fail(res) {
        this.setState({
          showToast : true,
          toastMessage:res.errMsg
        })
      }
    })

  }
  doPostImage(imgUrl) {
    let that = this
    const fileUrl =imgUrl;
    IS_WEAPP && Taro.showNavigationBarLoading();
    Taro.uploadFile({
      url:BASE_URL +'propertyAPI/uploadImg',
      filePath: fileUrl,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        id: this.bookId
      },
      success(res) {
        IS_WEAPP && Taro.hideNavigationBarLoading()
        console.info(res)
        that.setState({
          showToast : true,
          toastMessage:JSON.parse(res.data).msg
        })
        // Taro.redirectTo({url :'../booking-list/index'})

      }, fail(res) {
        IS_WEAPP && Taro.hideNavigationBarLoading()
        that.setState({
          showToast : true,
          toastMessage:res.errMsg
        })
      }
    })
  }

  navigateToBookingList() {
    let pages = Taro.getCurrentPages();
    if (pages.length >= 3) {
      let prePage = pages[pages.length - 3]
      prePage.$component.setState({needRefresh: true})
      Taro.navigateBack({delta: 2})
    }
  }
  render() {
    const {showToast, toastMessage, toastDuration } = this.state
    return (
      <View style='padding-top:20px' >
        <AtImagePicker
          mode={"aspectFit"}
          files={this.state.image}
          onChange={this.pickImage.bind(this)}
          length={1}
          multiple={false}
          showAddBtn={this.state.showAddBtn}/>
        <AtButton onClick={this.uploadImage.bind(this)} type='primary' size={"normal"} customStyle='margin:20px' >确定</AtButton>
        <AtToast
          isOpened={showToast}
          duration={toastDuration}
          text={toastMessage}
          isHiddenIcon={true} />
      </View>
    )
  }
}
