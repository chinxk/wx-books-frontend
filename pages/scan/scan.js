// pages/scan.js
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isScannable: true,
    scannedCodes: [],
    scannedBooks: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  takeCode(e) {
    console.log('takecode');
    if (this.data.isScannable) {
      // 对扫码结果进行处理
      var isbn = e.detail.result
      console.log(isbn);
      if (!(/^\d{10,13}$/.test(isbn))) {
        wx.showToast({
          title: '无效的ISBN',
          duration: 2000,
          icon: 'none'
        });
        return;
      }
      // return if book has been scanned
      if (this.data.scannedCodes.indexOf(isbn) > -1) {
        wx.showToast({
          title: '已扫描过的ISBN',
          duration: 2000,
          icon: 'none'
        });
        return;
      }
      // resolve isbn
      console.log("resolve isbn")
      const token= wx.getStorageSync('token');
      wx.request({
        'url': 'http://192.168.0.147:3000/api/v1/books/by_isbn',
        header: {
          'Authorization': token
        },
        data: {
          isbn: isbn
        },
        method: 'GET',
        success: r => {
          if(r.statusCode == 200){
            var book = r.data.book
            book.title = util.truncate(book.title,10)
            book.author = util.truncate(book.author,10)
            this.data.scannedBooks.push(book)
            this.data.scannedCodes.push(isbn)
            this.data.isScannable = false
            // refresh appData
            this.setData(this.data)
            // console.log(r)
          }else{
            wx.showToast({
              title: r.data.errors[0],
              duration: 2000,
              icon: 'none'
            });
          }
        },
        fail: r => {
          wx.showToast({
            title: '出错啦，稍后再试吧',
            duration: 2000,
            icon: 'none'
          });
          console.log(r)
        }
      })

      // reactive scannable
      setTimeout(() => {
        this.data.isScannable = true;
      }, 1000)
    }
  },
  stock() {
    let books = this.data.scannedBooks || []
    let book_ids = books.map(i => {return i.id})
    let userInfo = wx.getStorageSync('userInfo')
    const token= wx.getStorageSync('token');
    console.log(book_ids)
    wx.request({
      'url': 'http://192.168.0.147:3000/api/v1/users/storage',
      header: {
        'Authorization': token
      },
      data: {
        openid: userInfo.openid,
        book_ids: book_ids
      },
      method: 'POST',
      success: r => {
        if(r.statusCode == 200){
          wx.switchTab({
            url: '../my/my',
          })
        }else{
          wx.showToast({
            title: r.data.errors[0],
            duration: 2000,
            icon: 'none'
          });
        }
      },
      fail: r => {
        wx.showToast({
          title: r,
          duration: 2000,
          icon: 'none'
        });
      }
    })
  }
})