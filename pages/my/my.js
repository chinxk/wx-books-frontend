// pages/my.js
const URI = require('../../utils/uri.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    edit_mode: false,
    dialog: false,
    checked_books_id: [],
    books: [],
    all: []
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
    console.log('test onshow')
    this.setData({
      slideButtons: [{
        src: '/components/book-fill.svg'
      }, { src: '/components/book.svg' }
        , { src: '/components/del.svg' }
      ],
    });

    const myBooks = wx.getStorageSync('myBooks');
    this.setData({
      books: myBooks,
      all: myBooks
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

  bindSearchInput(e) {
    const key = e.detail.value.toUpperCase()
    const all = this.data.all
    this.setData({
      books: all.filter(b => b.book.title.toUpperCase().includes(key) || b.book.author.toUpperCase().includes(key))
    })
  },

  bindEllipsis(e) {
    this.setData({
      edit_mode: !this.data.edit_mode
    })
  },

  slideButtonTap(e) {
    console.log('slideButtonTap' + e.detail.index)
    const bookIds = [e.currentTarget.dataset.bookId]
    switch (e.detail.index) {
      case 0:
        //read
        this.action(bookIds, URI.READ)
        break;
      case 1:
        //unread
        this.action(bookIds, URI.UNREAD)
        break;
      case 2:
        //remove
        this.action(bookIds, URI.REMOVE)
        break;
      default:
        return
    }
  },

  bindReadTap(e) {
    this.action(this.data.checked_books_id, URI.READ)
  },

  bindUnreadTap(e) {
    this.action(this.data.checked_books_id, URI.UNREAD)
  },

  bindRemoveTap(e) {
    this.action(this.data.checked_books_id, URI.REMOVE)
  },

  checkboxChange(e) {
    this.setData({ checked_books_id: e.detail.value })
  },

  bindViewTap(e) {
    console.log(e)
    let isbn = e.target.dataset.isbn
    let book = this.data.all.filter(b => b.book.isbn == isbn)[0]
    console.log(book)
    this.setData({
      selected: book,
      dialog: true
    })
  },
  
  preventTouchMove() {
    console.log('preventTouchMove')
  },

  action(bookIds, uri) {
    const userInfo = wx.getStorageSync('userInfo')
    const token = wx.getStorageSync('token')
    const booksBack = wx.getStorageSync('myBooks')
    let myBooks = wx.getStorageSync('myBooks')
    bookIds = bookIds.map(b => parseInt(b) )
    console.log(bookIds)

    // refresh local view
    switch (uri) {
      case URI.READ:
        myBooks = myBooks.map(b => {
          if (bookIds.includes(b.book.id)) {
            b.read_date = new Date()
            b.readed = true
          }
          return b
        })
        break
      case URI.UNREAD:
        myBooks = myBooks.map(b => {
          if (bookIds.includes(b.book.id)) {
            b.read_date = null
            b.readed = false
          }
          return b
        })
        break
      case URI.REMOVE:
        myBooks = myBooks.filter(b => {
          return !bookIds.includes(b.book.id)
        })
        break
      default:
        return;
    }
    wx.setStorageSync('myBooks', myBooks)
    this.setData({
      books: myBooks,
      all: myBooks,
      checked_books_id: [],
      edit_mode: false
    })

    // request remote
    wx.request({
      'url': uri,
      header: {
        'Authorization': token
      },
      data: {
        openid: userInfo.openid,
        book_ids: bookIds
      },
      method: 'POST',
      success: r => {
        if (r.statusCode != 200) {
          // show error and recover local view
          wx.setStorageSync('myBooks', booksBack)
          this.setData({
            books: booksBack,
            all: booksBack
          })
          wx.showToast({
            title: r.data.errors[0],
            duration: 2000,
            icon: 'none'
          });
        }
      },
      fail: r => {
        // show error and recover local view
        wx.setStorageSync('myBooks', booksBack)
        this.setData({
          books: booksBack,
          all: booksBack
        })
        wx.showToast({
          title: r,
          duration: 2000,
          icon: 'none'
        });
      }
    })
  },
})