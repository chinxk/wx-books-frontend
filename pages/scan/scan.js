// pages/scan.js
const URI = require('../../utils/uri.js')

const innerAudioContext = wx.createInnerAudioContext()
innerAudioContext.autoplay = false
innerAudioContext.src = '/assets/scan.mp3'

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
    console.log('scan onshow called')
    this.data.isScannable = true
    this.data.scannedCodes = []
    this.data.scannedBooks = []
    this.setData(this.data)
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

      // vibrate
      wx.vibrateShort({
        type: 'medium',
      })
      // sound effect
      innerAudioContext.play()

      // 对扫码结果进行处理
      var isbn = e.detail.result
      // var i = parseInt(Math.random() * 10)%5
      // var isbns = [9787536693968, 9787806472873,9787560140476, 9787562043706, 9787111422068]
      // isbn = isbns[i]
      // console.log(isbn);
      if (!(/^\d{10,13}$/.test(isbn))) {
        wx.showToast({
          title: '无效的ISBN',
          duration: 2000,
          icon: 'none'
        });
        return;
      }
      // return if book has been scanned or exists
      const myBooks = wx.getStorageSync('myBooks')
      const existISBN = myBooks.map(b => { return b.book.isbn })
      if (this.data.scannedCodes.includes(isbn) || existISBN.includes(isbn)) {
        wx.showToast({
          title: '该书已扫描过或已存在',
          duration: 2000,
          icon: 'none'
        });
        return;
      }
      // resolve isbn
      console.log("resolve isbn")
      const token = wx.getStorageSync('token');

      wx.showLoading({
        title:'处理中...',
        mask:true
      });
      this.setData({
        isScannable: false
      })

      wx.request({
        'url': URI.BY_ISBN,
        header: {
          'Authorization': token
        },
        data: {
          isbn: isbn
        },
        method: 'GET',
        success: r => {
          if (r.statusCode == 200) {
            if ('ok' == r.data.status && r.data.book) {
              let _book = r.data.book
              // push to end, instead of unshift to head
              this.data.scannedBooks.push({book:_book})
              this.data.scannedCodes.push(isbn)
              this.data.toViewId = 'book' + _book.id
              // refresh appData
              this.setData(this.data)
              // console.log(r)
            } else {
              wx.showToast({
                title: '未找到该书',
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
        },
        complete: r => {
          // hide loading and reactive scannable
          wx.hideLoading()
          this.setData({
            isScannable: true
          })
        }
      })
    }
  },

  stock() {
    let books = this.data.scannedBooks || []
    let book_ids = books.map(i => { return i.book.id })
    let userInfo = wx.getStorageSync('userInfo')
    const token = wx.getStorageSync('token');
    console.log(book_ids)
    wx.request({
      'url': URI.STOCK,
      header: {
        'Authorization': token
      },
      data: {
        openid: userInfo.openid,
        book_ids: book_ids
      },
      method: 'POST',
      success: r => {
        if (r.statusCode == 200) {
          // update local view
          const myBooks = wx.getStorageSync('myBooks')
          wx.setStorageSync('myBooks', books.concat(myBooks))
          wx.switchTab({
            url: '../my/my',
          })
        } else {
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