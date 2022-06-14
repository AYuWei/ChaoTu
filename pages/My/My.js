// pages/My/My.js
let that ;
const DB = wx.cloud.database();
/**
 * 获取属数据库集合【表集合】
 */
const ChaoTuAuthor = DB.collection("ChaoTu_Author"); 
const ChaoTuUser = DB.collection("ChaoTu_User"); 
Page({

      /**
       * 页面的初始数据
       */
      data: {
            isLogon:false,
            userData:{}, 
            authorCodeUrl:""
      },
      // 点击头像登录
      onLogon(){
            /**
             * avatarUrl:头像
             * cloudID：唯一标识
             * nickName 名称
             */
            let logonData = {}
            if( this.data.userData.avatarUrl == undefined){
                  wx.getUserProfile({
                        desc: '获取微信头像和昵称', 
                        success: (res) => {
                              logonData = {
                                    ...res.userInfo,
                                    updataTime:that.getNowFormatData()
                              } 
                              that.saveAddBase(logonData) 
                        },
                        fail(){
                              console.log("授权失败~")
                              wx.showToast({
                                title: '授权失败~',
                                icon:"error"
                              })
                        }
                  })
            } else {
                  // 已登录
            }
      },
      // addBase 添加数据
      saveAddBase(obj){
            /**
             * 有数据 则修改
             * 没有数据 则添加
             */
            ChaoTuUser.add({
                  // data 传递的数据
                  data:obj
            }).then(res=>{ 
                  console.log("登录数据id",res._id, res)
                  that.getBaseUserOpenID(res._id);
                  wx.showToast({
                        title: '登录成功' 
                  })
            }).catch(console.error)
      },
      // 查询数据 查出_openid
      getBaseUserOpenID(userID){
           ChaoTuUser.where({
                 _id : userID
            }).get().then(res=>{
                  that.getBaseUserID(res.data[0]._openid,userID)
                  console.log("查询数据_openid", res.data[0]._openid)
            }).catch(console.error)
      },
      // 查询数据 查出_id 并保存唯一记录
      getBaseUserID(userOpenid,userID){
            ChaoTuUser.where({
                  _openid : userOpenid
             }).get().then(res=>{
                   res.data.forEach( (item, index) => { 
                        if( item._id != userID ){
                              // 旧记录删掉
                              ChaoTuUser.doc(item._id).remove()
                        } else { 
                              that.setData({
                                    userData:item,
                                    isLogon:true
                              })
                              wx.setStorage({
                                    key:"userData",
                                    data:item, 
                              })
                        }
                   } )
             }).catch(console.error)
       },
      // 收藏
      onActiveSC(){
            wx.navigateTo({
                  url: '../My/Collection/Collection',
                  success: function(res) {
                        // 监听 viewImage 事件，获取上一页面通过 eventChannel 传送到当前页面的数据 
                  }
            })
      },
      // 反馈
      onActiveFk(){
            wx.navigateTo({
                  url: '../My/Feedback/Feedback',
                  success: function(res) {
                        // 监听 viewImage 事件，获取上一页面通过 eventChannel 传送到当前页面的数据 
                  }
            })
      },
      // 联系我们
      onActiveLX(){ 
            if(that.data.authorCodeUrl == ""){
                  wx.showLoading({
                        title: '加载中...',
                  })
                  ChaoTuAuthor.get().then(res=>{
                        that.setData({
                              authorCodeUrl:res.data[0].authorCodeUrl
                        }); 
                        console.log("联系我们",res.data[0].authorCodeUrl) 
                        setTimeout(res=>{ 
                              wx.hideLoading();
                              that.previewImage();
                        },100)
                  })
            } else {
                  that.previewImage();
            }
            
      },
      // 联系我们的二维码
      previewImage(){
            console.log("联系头像：",that.data.authorCodeUrl)
            wx.previewImage({
                  urls : [that.data.authorCodeUrl],
                  current : that.data.authorCodeUrl,
                  showmenu : true, 
            })
      }, 
      // 清除缓存
      onActiveHC(){
            let that = this;
            wx.clearStorage({ 
                  success(res){
                        that.setData({
                              userData:{},
                              isLogon:false
                        })
                        wx.showToast({
                              title: `清除成功` 
                        })
                  }
            })
      },
      //格式化日期时间格式
      getNowFormatData(){
            let date = new Date()
            let seperator1 = "-"
            let seperator2 = ":"
            let month = date.getMonth() + 1
            let strDate = date.getDate()
            let minutes = date.getMinutes() 
            let seconds = date.getSeconds()
            if(month >=1 && month <= 9){
            month = "0" + month;
            }
          
            if(strDate >=0 && strDate <= 9){
            strDate = "0"+ strDate
            }
            if(minutes >=1 && minutes <= 9){
                  minutes = "0" + minutes;
            }
            if(seconds >=1 && seconds <= 9){
                  seconds = "0" + seconds;
            }
            //拼接
            let currentdate = date.getFullYear() + seperator1 + month + seperator1 +strDate + " " + date.getHours() + seperator2 + minutes + seperator2 + seconds ;
            return currentdate
      },
      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function (options) {
            that = this;
            wx.getStorage({
                  key:"userData",
                  success(res){ 
                         that.setData({
                              userData : res.data,
                              isLogon:true
                         })
                         console.log(res.data)
                  },
                  fail(res){

                        that.setData({
                              isLogon:false,
                              userData:{}
                        }) 
                  }
            })

      },

      /**
       * 生命周期函数--监听页面初次渲染完成
       */
      onReady: function () {

      },

      /**
       * 生命周期函数--监听页面显示
       */
      onShow: function () {

      },

      /**
       * 生命周期函数--监听页面隐藏
       */
      onHide: function () {

      },

      /**
       * 生命周期函数--监听页面卸载
       */
      onUnload: function () {

      },

      /**
       * 页面相关事件处理函数--监听用户下拉动作
       */
      onPullDownRefresh: function () {

      },

      /**
       * 页面上拉触底事件的处理函数
       */
      onReachBottom: function () {

      },

      /**
       * 用户点击右上角分享
       */
      onShareAppMessage: function () {

      }
})