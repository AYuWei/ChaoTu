// pages/My/Collection/Collection.js
let that; 
const DB = wx.cloud.database();   
const ChaoTuItem = DB.collection("ChaoTu_Item");   // 商品裂变
const ChaoTuCollect = DB.collection("ChaoTu_Collect");  // 收藏表
let setTimeoutlike;
Page({
      /*
            onLoad 获取收藏列表的值，然后渲染
                  1：获取当前的用户openID 然后去 ChaoTuCollect 查找相应的记录 
                  3：找到后，处理对象添加 collectArr
      */
      /**
       * 页面的初始数据
       */
      userOpenId : '', // 用户openID
      authorOpenId : '', // 作者openID
      currentPage: 1, // 当前页面
      pageNum: 10, // 一条显示多少条数据
      collectList : [], // 收藏条数
      data: {
            collectArr : [],
            itemTotal : 0 // 数据的总数
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function (options) {
            that = this; 
      },
      /**
       * 获取数据
       */
      getAuthorOpenID(){
            // 获取数据的总数
            ChaoTuCollect.where({
                  _openid : that.userOpenId
            }).count().then(res=>{  
                  console.log("总数：", res.total)
                  that.setData({
                        itemTotal:res.total
                  })
            })   
            ChaoTuCollect.where({
                  _openid : that.userOpenId
            }).orderBy('createTime','desc').limit(that.pageNum).get({
                  success(res){
                        console.log("获取收藏成功！", res) 
                        res.data.forEach((item) => {
                              that.collectList.push( item.chaotuCollectData );
                              console.log("authorID:",item.authorOpenId , item.createTime  ) 
                        })
                        that.setData({
                              collectArr : that.collectList
                        })
                        wx.hideToast()
                        console.log("循环完成:",that.collectList) 
                  },
                  fail(res){
                        console.log("获取收藏失败！", res)
                  }
            }) 
      },
             /**
       * 点击wrapper进去预览图片
       */
      onActiveWrapper(event){ 
            wx.navigateTo({
                  url: '/pages/HomePreview/HomePreview',
                  success: function(res) {
                        // 监听 viewImage 事件，传递数据给预览页面
                        res.eventChannel.emit('viewImage', { data: event.currentTarget.dataset.data })
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
            that.collectList = [];
            that.currentPage = 1;
            wx.showToast({
              title: '更新中...',
              icon:"loading"
            }) 
            /**
             * 获取缓存
             */
            wx.getStorage({
                  key:"userData",
                  success(res){   
                        that.userOpenId = res.data._openid; // 存用户_openid 
                        that.getAuthorOpenID(); // 获取authorID
                  },
                  fail(res){
                        wx.showToast({
                          title: '暂未登录、无法查询~',
                          icon:"none"
                        })
                  }
            })
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
            console.log("上拉刷新！~")
            wx.showLoading({
              title: '加载中...',
            })
            //加载标题栏loading动作
            wx.showNavigationBarLoading();
            // 判断当前数据列表数据是否小于获取的总数数据，是则还有数据 否则没有数据 
            console.log(  that.data.collectArr.length , that.data.itemTotal ) 
            if( that.data.collectArr.length < that.data.itemTotal ){ 
                  ChaoTuCollect.where({
                        _openid : that.userOpenId
                  }).orderBy('createTime','desc').skip( that.currentPage * that.pageNum ).limit(that.pageNum).get({
                        success(res){
                              console.log("上啦数学！", res)
                              if(res.data.length > 0){ 
                                    that.setData({
                                          collectArr : that.data.collectArr.concat(...res.data)
                                    })
                              } 
                               //隐藏标题栏loading动作
                               wx.hideNavigationBarLoading();
                              //  因此加载标签
                              wx.hideLoading()
                        }
                  })
                  that.currentPage += 1;
            } else {
                  wx.hideNavigationBarLoading();
                  wx.showToast({
                    title: '没有更多数据了~',
                    icon: "none"
                  })
            } 
      },

      /**
       * 用户点击右上角分享
       */
      onShareAppMessage: function () {

      }
})