// index.js
import { AVATAR } from '../../utils/uri.js'
// 获取应用实例
// const app = getApp()

Page({
  data: {
  },

  onShow: function () {

    console.log('index onshow')
    const userInfo = wx.getStorageSync('userInfo') || {}
    const allBooks = wx.getStorageSync('myBooks') || []
    const readedBooks = allBooks.filter(b => b.readed) || []
    const unReadedBooks = allBooks.filter(b => !b.readed) || []

    const allLast = allBooks.length > 0 ? allBooks[0].book : {}
    const readedLast = readedBooks.length > 0 ? readedBooks[0].book : {}
    const unReadedLast = unReadedBooks.length > 0 ? unReadedBooks[0].book : {}

    this.setData({
      allBooks: allBooks,
      allLast: allLast,
      readedBooks: readedBooks,
      readedLast: readedLast,
      unReadedBooks: unReadedBooks,
      unReadedLast: unReadedLast,
      userInfo: userInfo || {}
    })
  },
  // 事件处理函数
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '获取用户昵称和头像用于展示', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        if (this.data.userInfo.avatar_url != res.userInfo.avatarUrl) {
          this.data.userInfo.nick_name = res.userInfo.nickName
          this.data.userInfo.avatar_url = res.userInfo.avatarUrl
          this.setData(this.data)

          const token = wx.getStorageSync('token')
          wx.request({
            'url': AVATAR,
            header: {
              'Authorization': token
            },
            data: {
              openid: this.data.userInfo.openid,
              user: this.data.userInfo
            },
            method: 'POST',
            success: r => {
              if (r.statusCode == 200) {
                console.log(r)
                if (0 == r.data.status) {
                  wx.setStorageSync('userInfo', this.data.userInfo)
                } else {
                  wx.showToast({
                    title: '保存失败',
                    duration: 2000,
                    icon: 'none'
                  });
                }
              } else {
                console.error(r)
                wx.showToast({
                  title: '出错啦，稍后再试吧',
                  duration: 2000,
                  icon: 'none'
                });
              }
            },
            fail: r => {
              console.error(r)
              wx.showToast({
                title: '出错啦，稍后再试吧',
                duration: 2000,
                icon: 'none'
              });
              console.log(r)
            }
          })
        }
      },
      fail: err => {
        console.log("获取失败: ", err)
        // wx.exitMiniProgram()
      }
    })
  }
})
