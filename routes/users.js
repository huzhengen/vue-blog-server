var models = require('../models');
var express = require('express');
var router = express.Router();
var check = require('../helper/check.js');

// 注册
router.post('/register', check.checkUsername, check.checkPassword, (req, res, next) => {
	let username = req.body.username
	let password = req.body.password
	models.User.findOrCreate({
		where: { username },
		defaults: { password: password }
	}).spread((user, created) => {
		if (!created) {
			return res.send({ status: 'fail', msg: '用户已存在' })
		}
		let json = user.get({ plain: true })
		req.session.user = json
		delete json.password;
		res.send({ status: 'ok', msg: '注册成功', data: json })
	})
});

// 登陆
router.post('/login', check.checkUsername, check.checkPassword, (req, res, next) => {
    let username = req.body.username
    let password = req.body.password
    models.User.findOne({ where: { username } })
        .then(user => {
            if (!user) {
                return res.send({ status: 'fail', msg: '用户不存在' })
            }
            if (user.password !== password) {
                return res.send({ status: 'fail', msg: '密码不正确' })
            }
            let json = user.get({ plain: true })
            req.session.user = json
			delete json.password;
            res.send({ status: 'ok', msg: '登录成功', data: json })
        })
})

//注销
router.get('/logout', (req, res, next) => {
	if (req.session.user) {
		req.session.destroy()
		res.send({ status: 'ok', msg: '注销成功' })
	} else {
		res.send({ status: 'fail', msg: '当前用户尚未登录' })
	}

})

router.get('/', (req, res, next) => {
	if (req.session.user) {
		res.send({ status: 'ok', isLogin: true, data: req.session.user })
	} else {
		res.send({ status: 'ok', isLogin: false })
	}
})

module.exports = router;