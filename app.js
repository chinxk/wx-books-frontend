// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          'url': 'http://192.168.0.147:3000/api/v1/books/init',
          data: {
            code: res.code,
          },
          method: 'GET',
          success: r => {
            console.log('wx.request success')
            console.log(r)
            const user = r.data.user
            const token = r.data.token
            wx.setStorage({
              key: "userInfo",
              data: user,
              success: r => {
                wx.setStorage({
                  key: 'token',
                  data: 'Bearer ' + token,
                  success: r => {
                    wx.switchTab({
                      url: '../my/my',
                    })
                  }
                });
              }
            })
          },
          fail: r => {
            console.log('wx.request failed')
            wx.redirectTo({
              url: '../error/error',
            })
          }
        })
      },
      fail: r => {
        console.log('wx.login get openId failed')
        wx.redirectTo({
          url: '/error',
        })
      }
    })
  },
  globalData: {
    userInfo: null,
    test: 'testAAA'
  }
})
