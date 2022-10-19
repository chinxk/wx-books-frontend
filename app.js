// app.js
import { INIT } from '/utils/uri.js'

App({
  onLaunch() {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          'url': INIT,
          data: {
            code: res.code,
          },
          method: 'GET',
          success: r => {
            console.log('call books init success')
            console.log(r)
            wx.setStorageSync('userInfo', r.data.user)
            wx.setStorageSync('token', r.data.token)
            wx.setStorageSync('myBooks', r.data.my_books)
            wx.switchTab({
              url: '../index/index',
            })
          },
          fail: r => {
            console.log('call books init  failed')
            wx.redirectTo({
              url: '../error/error'
            })
          }
        })
      },
      fail: r => {
        console.log('wx.login get openId failed')
        wx.redirectTo({
          url: '../error/error'
        })
      }
    })
  },
  globalData: {
  }
})
