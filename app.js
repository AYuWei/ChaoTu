// app.js
App({

      // 小程序首次打开的时候运行此生命周期
      onLaunch() {
        console.log("小程序首次打开的时候运行此生命周期");
        wx.cloud.init({
            env: 'youpin-3g2tpu7d17cf7974'
        })
      },

})
    