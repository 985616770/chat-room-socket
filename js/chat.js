;(function ($) {
  'use strict'

  const socket = io('ws://localhost:8081')

  let user_name = null

  $('.login-btn').click(function () {
    user_name = $.trim($('#loginName').val())

    if (user_name) {
      socket.emit('login', { username: user_name })
    } else {
      alert('请输入昵称')
    }
  })

  window.addEventListener('beforeunload', function () {
    socket.emit('disconnect')
  })
  // 登录成功
  socket.on('loginSuccess', function (data) {
    if (data.username === user_name) {
      checkIn(data)
    } else {
      alert('用户名不匹配,请重新登录')
    }
  })

  // 登录失败
  socket.on('loginFail', function () {
    alert('昵称重复')
  })

  // 新人加入
  socket.on('add', function (data) {
    const html = `<p class="system-text">系统消息: <span class="c_green">${data.username}</span> 加入群聊</p>`
    $('.chat-content').append(html)
  })

  // 退出群聊提示
  socket.on('leave', function (name) {
    if (name !== null) {
      const html = `<p class="system-text">系统消息: <span class="c_red">${name}</span> 退出群聊</p>`
      $('.chat-content').append(html)
    }
  })

  // 发送消息
  $('.chat-sendBtn').click(function () {
    sendMessage()
  })
  $(document).keydown(function (event) {
    if (event.keyCode === 13) {
      sendMessage()
    }
  })

  // 接受消息
  socket.on('receiveMessage', function (data) {
    showMessage(data)
  })
  function checkIn(data) {
    $('.login-wrapper').hide('slow')
    $('.chat-wrapper').show('slow')
  }
  function sendMessage() {
    let $textWrapper = $('#sendText')
    const text = $textWrapper.val()
    $textWrapper.val('')
    if (text) {
      socket.emit('sendMessage', { username: user_name, message: text })
    }
  }
  function showMessage(data) {
    let html
    if (data.username === user_name) {
      html = `
      <div class="chat-item chat-item-right clearFix"><span class="img fr"></span>
      <span class="message fr">
      ${data.message}
      </span></div>
      `
    } else {
      html = `
      <div class="chat-item chat-item-left clearFix relative">
      <span class="absolute username">${data.username}</span>
      <span class="img fl"></span>
      <span class="message fl">
      ${data.message}
      </span></div>
      `
    }
    $('.chat-content').append(html)
  }
})(jQuery)
