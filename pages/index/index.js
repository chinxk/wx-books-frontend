// index.js
// 获取应用实例
const app = getApp()
const userInfo = wx.getStorageSync('userInfo') || []

Page({
  data: {
    motto: 'Hello World',
    userInfo: userInfo || {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: true,
    // canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
    canIUseOpenData: false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // onLoad() {
  //   if (wx.getUserProfile) {
  //     this.setData({
  //       canIUseGetUserProfile: true
  //     })
  //   }
  // },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息AAA', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        wx.setStorage({
          key:"userInfo",
          data:res.userInfo
        })
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        
      },
      fail: err => {
        console.log("获取失败: ", err)
        // wx.exitMiniProgram()
      }
    })
  },
  getScanCode(e) {
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['barCode'],
      success: (result) => { console.log(result) },
      fail: (res) => { console.log(res) },
      complete: (res) => { },
    })
  },
  addBooks(e) {
    wx.request({
      'url': 'http://192.168.0.15:3000/api/v1/users/storage',
      header: {
        'Authorization':  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiIzxVc2VyOjB4MDAwMDdmY2M1OGQ5NWZlMD4iLCJleHAiOjE2NDY5MDQ1MTB9.p0YeQum6s4t15zwZDJ0s2n7eSUvbWMb1_i5mmgduGUc"
      },
      data: {
        openid: "ovoNP528lZfe3Xanmq4lzRnlhrrg",
        book_ids: '3,4'
      },
      method: 'POST',
      success: r => {
        console.log(r)
      }
    })
  }
})
