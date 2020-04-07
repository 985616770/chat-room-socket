const app = require('http').createServer()
const io = require('socket.io')(app)
// 端口
const PORT = 8081

// 用户数据:Array
const users = [{ username: 'asd' }]

app.listen(PORT)

io.on('connection', function (socket) {
  // 是否新用户 和 当前登录的用户
  let isNewPerson = true
  let username = null
  socket.on('login', function (data) {
    console.log(data)
    users.forEach(item => {
      return item.username === data.username ? (isNewPerson = false) : (isNewPerson = true)
    })

    if (isNewPerson) {
      username = data.username
      users.push({
        username
      })
      // 登录成功
      socket.emit('loginSuccess', data)
      // 向所有链接客户端广播add事件
      io.sockets.emit('add', data)
    } else {
      // 登录失败
      socket.emit('loginFail', '')
    }
  })
  socket.on('disconnect', function () {
    // 当页面关闭时触发
    io.sockets.emit('leave', username)
    users.map((item, index) => {
      if (item.username === username) {
        users.splice(index, 1)
      }
    })
  })
  socket.on('sendMessage', function (data) {
    io.sockets.emit('receiveMessage', data)
  })
})

console.log('app is running at :' + PORT)
