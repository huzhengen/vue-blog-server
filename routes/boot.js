var models = require('../models');
var express = require('express');
var router = express.Router();
var check = require('../helper/check.js');
let hash = require('../helper/util.js');

// 注册
router.post('/register', check.checkUsername, check.checkPassword, (req, res, next) => {
	let username = req.body.username
	let password = hash(req.body.password)
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
	let username = req.body.loginname
	let password = hash(req.body.password)
    models.User.findOne({ where: { username } })
        .then(user => {
            if (!user) {
                return res.send({ status: 1, msg: '用户不存在' })
            }
            if (user.password !== password) {
                return res.send({ status: 1, msg: '密码不正确' })
            }
            let json = user.get({ plain: true })
            req.session.user = json
			delete json.password;
            res.send({
				status: 0,
				msg: '登录成功',
				data: {
					username: 'username',
					id: 5,
					permission: [
						{ id: 1 }, 
						{ id: 2 }, 
						{ id: 3 }, 
						{ id: 4 }, 
						{ id: 5 },
						{ id: 6 },
						{ id: 7 },
						{ id: 8 },
						{ id: 9 },
						{ id: 10 },
						{ id: 11 },
						{ id: 12 },
						{ id: 13 },
						{ id: 14 },
						{ id: 15 },
						{ id: 16 },
						{ id: 17 }
					],
					role_id: 5
				}
            })
        })
})

// post indexrole
router.post('/indexrole', (req, res, next) => {
	let pageNum = req.body.pageNum
	let pageSize = req.body.pageSize
	res.send({
		status: 0,
		data: {
			list: [1,2,3,4,5],
			total: 5,
		}
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