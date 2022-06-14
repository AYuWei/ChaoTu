// pages/Home/Home.js 
let that ;
const DB = wx.cloud.database();
/**
 * 获取属数据库集合【表集合】
 */
const ChaoTuItem = DB.collection("ChaoTu_Item"); 
Page({
      /**
       * 页面的初始数据
       */
      currentPage: 1, // 当前页面
      pageNum: 2, // 一条显示多少条数据
      dataList : [],
      data: {
            pageHeight: 0,
            pageWidth:0,
            itemTotal:0, // 获取页面有多少条数据
            itemList : []
      },
      /**
       * 点击wrapper进去预览图片
       */
      onActiveWrapper(event){ 
            wx.navigateTo({
                  url: '/pages/HomePreview/HomePreview',
                  success: function(res) {
                        // 监听 viewImage 事件，获取上一页面通过 eventChannel 传送到当前页面的数据
                        res.eventChannel.emit('viewImage', { data: event.currentTarget.dataset.data })
                  }
            })
      },
      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function (options) {
            
            that = this;
            wx.showLoading({
              title: '加载中...',
            })
            
            // 获取总数
            that.getDataCount();  
            that.getDataList();

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
            let that = this;
            // 获取可视屏幕的大小
            wx.getSystemInfo({
                  success:function(res){
                        let clientHeight = res.windowHeight;
                        let clientWidth = res.windowWidth;
                        let ratio = 750 / clientWidth;
                        let rpxHeight = clientHeight * ratio; // 将px 转为rpx
                        let rpxWidth = clientWidth * ratio; // 将px 转为rpx
                        that.setData({
                              pageHeight:rpxHeight,
                              pageWidth:rpxWidth
                        })
                  }
            })
      },
      /**
       * 获取信息总数
       */
      getDataCount(){
            ChaoTuItem.count().then(res => {
                  that.setData({
                        itemTotal:res.total
                  }) 
                  setTimeout(() => {
                        wx.hideLoading({
                          success: (res) => {},
                        })
                  }, 1000);
            }) 
      },
      /**
       * 获取数据
       */
      getDataList(){  
            console.log("刷新") 
            ChaoTuItem.aggregate().sort({
                  createTime: -1, 
            }).limit(that.pageNum).end().then(res => { 
                  console.log("get:",res)
                  that.setData({
                        itemList : res.list
                  })  
                  //隐藏标题栏loading动作
                  wx.hideNavigationBarLoading();
                  //终止下拉刷新动作 
                  wx.stopPullDownRefresh();
            }).catch(err => console.error(err))
      },
      /**
       * fileid获取临时路径
       */
      getTempFileURL(){

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
            console.log("下拉刷新！~");
            that.currentPage = 1;
            //加载标题栏loading动作
            wx.showNavigationBarLoading();
            that.getDataList();
      },

      /**
       * 页面上拉触底事件的处理函数
       */
      onReachBottom: function () {
            console.log("上拉刷新！~", that.data.itemList.length , that.data.itemTotal,that.currentPage ,that.pageNum)
            //加载标题栏loading动作
            wx.showNavigationBarLoading();
            // 判断当前数据列表数据是否小于获取的总数数据，是则还有数据 否则没有数据
            if( that.data.itemList.length < that.data.itemTotal ){ 
                  ChaoTuItem.aggregate().sort({
                        createTime: -1, 
                  }).skip( that.currentPage * that.pageNum ).limit(that.pageNum).end().then(res => {
                        console.log("触底刷新",res)
                        // data有数据才行
                        if(res.list.length > 0){ 
                              that.setData({
                                    itemList : that.data.itemList.concat(...res.list)
                              })
                        } 
                         //隐藏标题栏loading动作
                        wx.hideNavigationBarLoading();
                  });
                  
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