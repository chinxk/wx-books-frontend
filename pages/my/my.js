// pages/my.js
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    books: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('my page onload...')
    const token= wx.getStorageSync('token');
    wx.request({
      url: 'http://192.168.0.147:3000/api/v1/books',
      header: {
        'Authorization': token
      },
      data: {
        openid: 'todo test openid',
      },
      method: 'GET',
      success: r => {
        console.log(r)
        this.setData({
          books: r.data
        })
      },
      fail:r => {console.log(r)}
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
    console.log('my page refresh...')
    const token= wx.getStorageSync('token');
    wx.request({
      url: 'http://192.168.0.147:3000/api/v1/books',
      header: {
        'Authorization': token
      },
      data: {
        openid: 'todo test openid',
      },
      method: 'GET',
      success: r => {
        console.log(r)
        this.setData({
          books: r.data
        })
      },
      fail:r => {console.log(r)}
    })
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

  }
})