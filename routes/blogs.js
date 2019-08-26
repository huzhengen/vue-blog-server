var models = require('../models');
var express = require('express');
var router = express.Router();
var check = require('../helper/check.js');

//创建博客
router.post('/', check.checkLogin, /*checkBlog, */(req, res) => {
	let title = req.body.title
	let content = req.body.content

	let ret = { status: 'ok', msg: '创建成功' }

	let option = { title, content, UserId: req.session.user.id }

	models.Blog.create(option).then(result => {
		ret.data = result.get({ plain: true })
		return models.User.findByPk(result.UserId)
	}).then(user => {
		ret.data.user = user.get({ plain: true })
		res.send(ret)
	}).catch((e) => {
		console.log(e)
		res.send({ status: 'fail', msg: '创建失败' })
	})
})

module.exports = router;