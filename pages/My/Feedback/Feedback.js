// pages/My/Feedback/Feedback.js
const util = require('../../../utils/getNowFormatData.js');
let that;
const DB = wx.cloud.database();
/**
 * 获取属数据库集合【表集合】
 */
const ChaoTuFeedback = DB.collection("ChaoTu_Feedback"); 
Page({

      /**
       * 页面的初始数据
       */
      data: {
            wordNumber:0,
            openID:"",
            title:"",
            isLoading:false,
            butName:"提交反馈",
            type:"primary"
      },
      // 输入框大小
      inputTitle(event){ 
            this.setData({
                  wordNumber:event.detail.cursor,
                  title:event.detail.value
            })
      },
      // 提交按钮
      sendingMes(){ 
            if(that.data.openID == "" ){ 
                  that.showToast('还未登录、请先登录~');
            }else if(!this.data.isLoading){
                  if( this.data.title.length <= 15 ){
                        that.showToast('反馈内容需大于15字符!');
                  } else {
                        this.setData({
                              isLoading:!that.data.isLoading,
                              butName:"反馈中...",
                              duration:"5000",
                              type:"default"
                        })
                        // 提交反馈
                        ChaoTuFeedback.add({
                              data: {
                                    openID : that.data.openID,
                                    createTime : util.getNowFormatData(),
                                    messgin : that.data.title
                              }
                        }).then(res => {
                              console.log("反馈成功", res)
                              that.setData({
                                    isLoading:!that.data.isLoading,
                                    butName:"提交反馈",
                                    title:"",
                                    type:"primary"
                              })
                              wx.showToast({
                                    title: '反馈成功' 
                              })
                              setTimeout(() => {
                                    wx.navigateBack();
                                    console.log("跳转页面")
                              }, 1300);
                        }).catch(res=>{
                              console.log("反馈失败")
                              wx.showToast({
                                title: '反馈失败！',
                                icon:"none"
                              })
                        })
                  }  
            }
      },
      // 显示
      showToast(title){
            wx.showToast({
                  title: title,
                  icon:"none"
            })
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
                              openID:res.data._openid
                          }) 
                  }, 
                  fail(){
                        that.setData({
                              openID:""
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