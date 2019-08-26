function checkLogin(req, res, next) {
  if(req.session.user){
    next()
  }else {
    res.send({status:'fail', msg: '登录后才能操作'})
  }
}

function checkUsername(req, res, next){
  // let [username = ''] = [req.body.username]
  let username = req.body.username;
  console.log('username:' + username)
  if(/^[\w\u4e00-\u9fa5]{1,15}$/.test(username)){
    next()
  }else{
    res.send({status:'fail', msg: '用户名长度1到15个字符，只能是字母数字下划线中文'})
  }
}

function checkPassword(req, res, next){
  // let [password = ''] = [req.body.password]
  let password = req.body.password
  console.log('password:'+password)
  if(/^.{6,16}$/.test(password)){
    next()
  }else{
    res.send({status:'fail', msg:'密码长度6到16个字符'})
  }
}

function checkBlog(req, res, next){
  let [title = '', content = ''] = [req.body.title, req.body.content]
  if(title.trim() === '' || title.length > 30){
    res.send({status:'fail', msg: '标题不能为空且不超过30个字符'})
  }else if(content.trim() === '' || content.length > 10000){
    res.send({status:'fail', msg: '内容不能为空，且不超过10000个字符'})
  }else {
    next()
  }
}

module.exports = {
  checkLogin,
  checkUsername,
  checkPassword,
  checkBlog
}