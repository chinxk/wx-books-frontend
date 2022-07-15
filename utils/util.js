const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const truncate = (str, num) => {
  if (null == str) {
    return str
  }
  num ||= 3
  return num > str.length ? str : num >= 3 ? str.slice(0, num - 3) + '...' : str.slice(0, num) + '...'
}

const errorToast = () =>  {
  wx.showToast({
    title: '出错啦，稍后再试吧!!!!!!',
    duration: 2000,
    icon: 'none'
  });
}

module.exports = {
  formatTime,
  truncate,
  errorToast
}
