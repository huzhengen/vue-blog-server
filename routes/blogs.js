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

//获取所有博客
router.get('/', (req, res) => {
	// let userId
	// if(req.session.user){
	// 	userId = req.session.user.id
	// }
	let page = parseInt(req.query.page) || 1
	let limit = 10
	let offset = (page - 1) * limit
	let option = {
		offset, limit, where: {},
		attributes: { exclude: ['UserId', 'content'] },
		include: [{ model: models.User, attributes: { exclude: ['password'] } }],
		order: [['createdAt', 'DESC']]
	}

	// if (userId) {
	// 	option.where.UserId = userId
	// }

	models.Blog.findAndCountAll(option)
		.then(({ count, rows }) => {
			let data = {
				status: 'ok',
				msg: '获取成功',
				total: count,
				totalPage: Math.ceil(count / limit),
				page: page,
				data: rows
			}
			console.log(data)
			res.send(data)
		}).catch((e) => {
			console.log(e)
			res.send({ status: 'fail', msg: '查询失败' })
		})
})

// 获取一个用户的所有博客
router.get('/user/:userId', (req, res) => {
	let userId = req.params.userId;
	let page = parseInt(req.query.page) || 1
	let limit = 10
	let offset = (page - 1) * limit
	let option = {
		offset, limit, where: { UserId:userId },
		attributes: { exclude: ['UserId', 'content'] },
		include: [{ model: models.User, attributes: { exclude: ['password'] } }],
		order: [['createdAt', 'DESC']]
	}

	models.Blog.findAndCountAll(option)
		.then(({ count, rows }) => {
			let data = {
				status: 'ok',
				msg: '获取成功',
				total: count,
				totalPage: Math.ceil(count / limit),
				page: page,
				data: rows
			}
			console.log(data)
			res.send(data)
		}).catch((e) => {
			console.log(e)
			res.send({ status: 'fail', msg: '查询失败' })
		})
})

// 根据ID获取每个博客
router.get('/:blogId', (req, res) => {
	models.Blog.findById(req.params.blogId, {
		attributes: { exclude: ['UserId'] },
		include: [{ model: models.User, attributes: { exclude: ['password'] } }]
	}).then(result => {
		let data = result.get({ plain: true })
		let ret = {
			status: 'ok',
			msg: '获取成功',
			data: data
		}
		res.send(ret)
	}).catch(() => {
		res.send({ status: 'fail', msg: '博客不存在' })
	})
})

//修改博客
router.patch('/:blogId', check.checkLogin, /*checkBlog,*/(req, res) => {
	let title = req.body.title
	let content = req.body.content
	let obj = {}
	if (title) {
		obj.title = title
	}
	if (content) {
		obj.content = content
	}
	
	models.Blog.update(obj, { where: { id: req.params.blogId, UserId: req.session.user.id } })
		.then(([affectRow]) => {
			if (affectRow === 0) {
				return res.send({ status: 'fail', msg: '博客不存在或你没有权限' })
			}
			return models.Blog.findById(req.params.blogId, {
				attributes: { exclude: ['UserId'] },
				include: [{ model: models.User, attributes: { exclude: ['password'] } }]
			})
		}).then(result => {
			let data = result.get({ plain: true })
			let ret = {
				status: 'ok',
				msg: '修改成功',
				data: data
			}
			res.send(ret)
		}).catch(() => {
			res.send({ status: 'fail', msg: '修改失败' })
		})
})

//删除博客
router.delete('/:blogId', check.checkLogin, (req, res) => {
	models.Blog.destroy({ where: { id: req.params.blogId, UserId: req.session.user.id } })
		.then(affectRow => {
			if (affectRow === 0) {
				return res.send({ status: 'fail', msg: '博客不存在或你没有权限' })
			}
			res.send({ status: 'ok', msg: '删除成功' })
		}).catch(() => {
			res.send({ status: 'fail', msg: '删除失败' })
		})

})


module.exports = router;