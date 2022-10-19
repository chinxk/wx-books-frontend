const HOST = 'https://chinxk.top'
// const HOST = 'http://192.168.0.147:3000'
const INIT = HOST + '/api/v1/books/init'
const BY_ISBN = HOST + '/api/v1/books/by_isbn'
const BOOKS = HOST + '/api/v1/books'
const STOCK = HOST + '/api/v1/users/stock'
const REMOVE = HOST + '/api/v1/users/remove'
const READ = HOST + '/api/v1/users/read'
const UNREAD = HOST + '/api/v1/users/unread'
const AVATAR = HOST + '/api/v1/users/avatar'
module.exports = {
  INIT,
  BY_ISBN,
  BOOKS,
  STOCK,
  REMOVE,
  READ,
  UNREAD,
  AVATAR
}
