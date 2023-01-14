// index.js
import { AVATAR } from '../../utils/uri.js'
// 获取应用实例
// const app = getApp()

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    defaultAvatarUrl:defaultAvatarUrl
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
  // 事件处理函数 getUserProfile已无法正确获取User信息，暂时保留以备老版本对应
  // getUserProfile(e) {
  //   // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
  //   wx.getUserProfile({
  //     desc: '获取用户昵称和头像用于展示', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
  //     success: (res) => {
  //       console.log(res)
  //       if (this.data.userInfo.avatar_url != res.userInfo.avatarUrl) {
  //         this.data.userInfo.nick_name = res.userInfo.nickName
  //         this.data.userInfo.avatar_url = res.userInfo.avatarUrl
  //         this.setData(this.data)

  //         const token = wx.getStorageSync('token')
  //         wx.request({
  //           'url': AVATAR,
  //           header: {
  //             'Authorization': token
  //           },
  //           data: {
  //             openid: this.data.userInfo.openid,
  //             user: this.data.userInfo
  //           },
  //           method: 'POST',
  //           success: r => {
  //             if (r.statusCode == 200) {
  //               console.log(r)
  //               if (0 == r.data.status) {
  //                 wx.setStorageSync('userInfo', this.data.userInfo)
  //               } else {
  //                 wx.showToast({
  //                   title: '保存失败',
  //                   duration: 2000,
  //                   icon: 'none'
  //                 });
  //               }
  //             } else {
  //               console.error(r)
  //               wx.showToast({
  //                 title: '出错啦，稍后再试吧',
  //                 duration: 2000,
  //                 icon: 'none'
  //               });
  //             }
  //           },
  //           fail: r => {
  //             console.error(r)
  //             wx.showToast({
  //               title: '出错啦，稍后再试吧',
  //               duration: 2000,
  //               icon: 'none'
  //             });
  //             console.log(r)
  //           }
  //         })
  //       }
  //     },
  //     fail: err => {
  //       console.log("获取失败: ", err)
  //       // wx.exitMiniProgram()
  //     }
  //   })
  // },
  onChooseAvatar(e) {
    console.log(e)
    // use base64 instead of url
    var that = this
    wx.compressImage({
      src: e.detail.avatarUrl, // 图片路径
      compressedWidth:132,
      compressHeight: 132,
      success: function(res) {
        console.log(res.tempFilePath)
        const avatarUrl = 'data:image/jpeg;base64,' + wx.getFileSystemManager().readFileSync(res.tempFilePath, 'base64')
        console.log(avatarUrl)
        if (that.data.userInfo.avatar_url != avatarUrl) {
          that.data.userInfo.avatar_url = avatarUrl
          // refresh local view
          that.setData(that.data)
          // update remote
          that.updateUserinfo()
        }
      },
      fail: r => {
        console.error(r)
        wx.showToast({
          title: '压缩头像失败',
          duration: 2000,
          icon: 'none'
        });
        console.log(r)
      }
      
    })
    
  },
  onNickChange(e) {
    console.log(e)
    const nickName = e.detail.value
    if (this.data.userInfo.nick_name != nickName) {
      this.data.userInfo.nick_name = nickName
      // refresh local view
      this.setData(this.data)
      // update remote
      this.updateUserinfo()
    }
  },

  updateUserinfo() {
    console.log('updateUserinfo')
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
})
