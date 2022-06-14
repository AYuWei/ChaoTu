// pages/HomePreview/HomePreview.js
const util = require('../../utils/getNowFormatData.js');
let that;
let animation;
const DB = wx.cloud.database();
/**
 * 获取属数据库集合【表集合】
 */
const ChaoTuComment = DB.collection("ChaoTu_Comment");  // 评论表
const ChaoTuItem = DB.collection("ChaoTu_Item");   // 商品裂变
const ChaoTuCollect = DB.collection("ChaoTu_Collect");  // 收藏表
let setTimeoutlike;
Page({
      _id:"", // 上一页面数据的唯一id 用于查询当前数据
      authorId: "", // 作者id -- 用于查询评论记录和添加评论记录
      currentPage: 1, // 当前页面
      pageNum: 3, // 一条显示多少条数据
      
      /**
       * 页面的初始数据
       */
      data: { 
            pageHeight:0,
            pageWidth:0, 
            inputplaceholder: "留下美好的足迹~" ,// input提示  留下美好的足迹...
            valueComment:"",   // 评论内容
            iscollect:false, // 是否收藏
            like:0, // 点赞
            workData:{}, // 消息列表
            userData:{}, // 用户    ;
            commentitem:[], // 评论列表
            itemTotal:0, // 获取页面有多少条评论数据
      },
      // 转发
      onShareMenu(){
            console.log("转发"); 
      },
      // 收藏
      onCollect(){
            if( that.data.userData == undefined ){
                  that.showModal("请登录后收藏~");
                  return;
            }
            wx.showLoading({
              title: '',
            })
            // 数据库查询
            ChaoTuCollect.where({
                  userOpenId: that.data.userData._openid,
                  authorOpenId: that.authorId,
            }).get().then(res => {
                  // 没有数据 -- 插入 否则 删除
                  if( res.data.length == 0 ){
                        ChaoTuCollect.add({
                              data : {
                                    userOpenId: that.data.userData._openid,
                                    authorOpenId: that.authorId,
                                    createTime: util.getNowFormatData(),
                                    chaotuCollectData: that.data.workData
                              },
                              success(res){
                                    console.log("添加收藏", res)
                                    that.showModal('已添加收藏~')    
                                    wx.hideLoading( )
                                    that.setData({
                                          iscollect : true,
                                    })
                              }
                        })
                  } else {
                        ChaoTuCollect.where({
                              userOpenId: that.data.userData._openid,
                              authorOpenId: that.authorId,
                        }).remove().then(res => {
                              wx.hideLoading( )
                              that.showModal('已取消收藏~')   
                              that.setData({
                                    iscollect : false,
                              })
                        })
                  }
                  console.log("查询收藏数据结果：", res);
            }) 
      },
      // 点赞
      onLike(){
            console.log("点赞：", that.data.workData.like )
            that.setData({
                  like : ++that.data.like 
            })
            clearTimeout( setTimeoutlike );
            setTimeoutlike = setTimeout(()=>{ 
                  // 修改数据库like
                  that.changeLike(that.data.workData._id);
            },500)
            
      },
      /**
       * 修改数据库喜欢数量
       * @param {*} event 
       */
      changeLike(id){ 
            ChaoTuItem.doc( id ).update({
                  data : {
                        like : that.data.like
                  }
            }).then(res => {
                  console.log("修改like成功：", res)
            })
      },
      /**
       * 键盘高度发送变化
       * @param {*} event 
       */
      inpFocus(event){ 
            
      },
      // 失去焦点
      inpBlur(event){
           
      },
      // 键盘输入
      inpValue(event){
            this.setData({
                  valueComment:event.detail.value
            })
            console.log( event.detail.value )
      },
      // 输入框发生发送
      onSend(event){ 
            console.log("发送",event.detail.value.length)
            if(event.detail.value.length == 0){
                  that.showModal("不能发送空白消息~");
            } else if( that.data.userData._openid == undefined ){
                  that.showModal("请登录后在发表评论~");
            } else {
                  // 发送数据
                  that.sendComment();
            }
      },
      /**
       * 按钮发生
       */
      onButSend(){ 
            if(this.data.valueComment.length == 0){
                  that.showModal("不能发送空白消息~");
            } else if( that.data.userData == undefined ){
                  that.showModal("请登录后在发表评论~");
            } else {
                  // 发送数据
                  that.sendComment();
            }
      },
      /**
       * 发送评论
       */
      sendComment(){
           console.log( that.data.userData )
           let time = util.getNowFormatData();
           let addData = {
                  authorId : that.authorId,
                  authorName : that.data.userData.nickName,
                  authorUrl : that.data.userData.avatarUrl,
                  comment : that.data.valueComment,
                  createTime : time
            }
            ChaoTuComment.add({
                  data: addData
            }).then(res => {
                  that.data.commentitem.unshift(addData)
                  that.setData({
                        valueComment:""
                  })
                  that.getComment();
                  wx.showToast({
                    title: '评论成功',
                    icon:"none"
                  })
            }).catch(err => console.error(err))
      },
      bindLongTap(event){
            /**
             * event.currentTarget.dataset.userid._openid 评论列表信息 评论者openid
             * that.data.userData._openid 当前用户信息 用户者openid
             * 两者相等则可以实现删除操作
             * 否则显示内容。
             */ 
            console.log("我也要死掉了！",event.currentTarget) 
            console.log("我也要死掉了、哦买噶！",that.data.userData )
            if( that.data.userData != undefined ){
                  if( event.currentTarget.dataset.userid._openid == that.data.userData._openid ){
                        that.showActionSheet("删除我的评论",['删除'],()=>{ 
                              // 删除数据
                              console.log("删除")
                              that.deleteComment(event.currentTarget.dataset.userid._id, event.currentTarget.dataset.index);
                        }) 
                        
                  }else {
                        that.showActionSheet("他人的评论",['回复'],()=>{
                              that.showModal('此功能暂未开启~')   
                        }) 
                  }
                
            } else {
                  that.showActionSheet("评论",['请先登录~'])
                 
            }
            
      },
      /**
       * 删除评论
       * @param {*} _id 删除的id 
       * @param {*} index 点击项 
       */
      deleteComment(_id,index){
            ChaoTuComment.doc(_id).remove().then(res => {
                  that.data.commentitem.splice(index,1)
                  that.setData({
                        itemTotal: --that.data.itemTotal,
                        commentitem: that.data.commentitem
                  })
            }).catch(res => {
                  console.log("删除失败")
            })
      },
      /**
       * 显示操作菜单
       * @param {*} alertText 警示文案
       * @param {*} itemList 按钮的文字数组，数组长度最大为 6
       * @param {*} sFun 接口调用成功的回调函数
       * @param {*} eFun 接口调用失败的回调函数
       */
      showActionSheet(alertText,itemList,sFun, eFun){
            wx.showActionSheet({
                  alertText:alertText,
                  itemList:itemList,
                  success(ers){
                        sFun != undefined ? sFun() : "";
                  },
                  fail(){
                        eFun != undefined ? eFun() : "";
                  }
            })
      },
      /**
       * 不可以发生空白消息
       * @param {*} event 
       */
      showModal(msg){
            wx.showToast({
              title: msg,
              icon:"none"
            })
      }, 
      /**
       * 预览相片
       */
      previewMedia(event){
            let index = event.currentTarget.dataset.index;
            let sourcesArr = []
            that.data.workData.imageList.forEach((res)=>{
                  sourcesArr.push(res)
            })
            wx.previewImage({
            urls : sourcesArr,
              current : that.data.workData.imageList[index],
              showmenu : false, 
            })
      },
      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function (options) {
            that = this;  
            const eventChannel = this.getOpenerEventChannel()
            // 监听 viewImage 事件，获取上一页面通过 eventChannel 传送到当前页面的数据
            eventChannel.on('viewImage', function(data) {
                  console.log("传递消息",data.data) 
                  that._id = data.data;
                  // 通过_id去查询这条记录
                  that.getWorkData(); 
            });
            /**
             * 获取缓存
             */
            wx.getStorage({
                  key:"userData",
                  success(res){   
                        console.log("获取缓存成功：", res) 
                         that.setData({
                              userData : res.data,
                              inputplaceholder : "留下美好的足迹~"
                         }); 
                  },
                  fail(res){
                        console.log("获取缓存失败：", res);
                        that.setData({
                              userData : res.data,
                              inputplaceholder : "登录后留言..."
                         }) 
                  }
            })
      },
      /**
       * 获取是否收藏
       */
      getSclove(){
            console.log("那我先获取收藏记录1111",that.data.userData._openid )
            console.log("那我先获取收藏记录2222", that.authorId) 

            if(that.data.userData == undefined) return;
            // 数据库查询
            ChaoTuCollect.where({
                        userOpenId: that.data.userData._openid,
                        authorOpenId: that.authorId,
                  }).get().then(res => {
                        if(res.data.length > 0){
                              that.setData({
                                    iscollect: true
                              })
                        }
                        console.log("那我先获取收藏记录",res.data.length)
                  })
            },
      /**
       * 拿到 _id 获取这一条记录
       */
      getWorkData( ){
            ChaoTuItem.doc( that._id ).get().then(res => {
                  console.log("_id获取数据成功", res)
                  that.setData({
                        workData:res.data,
                        like: res.data.like
                  })
                  that.authorId = that.data.workData.authorId;
                  console.log( " that.authorId ",that.authorId ) 
                  // 获取评论
                  that.getComment(); 
                  // 获取是否收藏
                  that.getSclove();
            }).catch(res=>{
                  console.log("_id获取数据失败", res)
            })
      },
      /**
       * 获取评论
       */
      getComment(){
            ChaoTuComment.where({
                  authorId : that.authorId
            }).count().then(res=>{ 
            console.log("评论总数",res.total)
                  that.setData({
                        itemTotal:res.total
                  })
            })     
            ChaoTuComment.where({
                  authorId : that.authorId
            }).orderBy('createTime','desc').limit(that.pageNum).get({
                  success(res){
                        console.log("评论查询：", res)
                        that.setData({
                              commentitem:res.data
                        })
                        //终止下拉刷新动作 
                        wx.stopPullDownRefresh();
                         //隐藏标题栏loading动作
                         wx.hideNavigationBarLoading();
                        
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
            let that = this;
            animation = wx.createAnimation({
                  delay: 1,
                  timingFunction:"ease"
            })
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
            //加载标题栏loading动作
            wx.showNavigationBarLoading();
            that.getComment(); // 获取评论 
            
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
            if( that.data.commentitem.length < that.data.itemTotal ){ 
                  ChaoTuComment.where({
                        authorId : that.authorId
                  }).orderBy('createTime','desc').skip( that.currentPage * that.pageNum ).limit(that.pageNum).get({
                        success(res){
                              if(res.data.length > 0){ 
                                    that.setData({
                                          commentitem : that.data.commentitem.concat(...res.data)
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
            return {
                  title : "拾忆",
                  path : "/pages/Home/Home",
                  imageUrl : "cloud://youpin-3g2tpu7d17cf7974.796f-youpin-3g2tpu7d17cf7974-1301890186/ChaoTu_Image/author/51cc01e21302d184f9f4133ead25c0d.jpg"
            }
      }
})