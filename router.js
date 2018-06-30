"use strict"
const express = require('express');
const router = express.Router();
const mysql = require('./database.js');

router.get('/',function(req,res){
    let username = req.cookies.username
    //用数据库查找文章
    mysql(`select * from articles`,function(err,data){
        if(err) throw err;
        let json = {
            username:username,
            data:data
        }
        res.render('index',json)
    })
})
//index请求
router.get('/index',function(req,res){
    let username = req.cookies.username
    //用数据库查找文章
    mysql(`select * from articles`,function(err,data){
        if(err) throw err;
        let json = {
            username:username,
            data:data
        }
        res.render('index',json)
    })
})
router.post('/index',function(req,res){
    let username = req.body.username||'';
    res.cookie('username',username);
    res.end()
})
//处理ico错误
router.get('/favicon.ico',function(req,res){
    res.end()
})

//登出
router.get('/out',function(req,res){
    res.cookie('username','');
    res.redirect('/index');
})
//获取文章页面
router.get('/article',function(req,res){
    let username = req.cookies.username
    res.render('article',{username:username})

})
//获取文章内容
router.post('/article',function(req,res){
    let username = req.cookies.username
    let title = req.body.title;
    let content = req.body.content;

    //将数据插入数据库即可
    mysql(`insert into articles values(null,\'${title}\',\'${content}\',now(),\'${username}\')`,function(err,data){
        if(err) throw err;
        res.json({
            state:1,
            msg:'发布成功！'
        })
    })
})
//向数据库插入评论
router.post('/comment',function(req,res){
    let username = req.cookies.username;
    let aid = req.body.aid;
    let content = req.body.content;
    mysql(`insert into comments values(null,\'${content}\',now(),\'${username}\',\'${aid}\')`,function(err,data){
        if(err) throw err;
        res.json({
            state:1,
            msg:'评论成功'
        })
    })
})
//获取评论，id指向相应article
router.get('/comment/:id',function(req,res){
    let username = req.cookies.username;
    let aid = req.params.id;
    //取出主要文章
    mysql(`select * from articles where id=\'${aid}\'`,function(err,data){
        if(err) throw err;
        let article = data[0];
        //取出文章相关评论
        mysql(`select * from comments where aid=\'${aid}\'`,function(err,data){
            if(err) throw err;
            let json = {
                username:username,
                article:article,
                comment:data
            }
            res.render('comment',json)
        })

    })
})

//处理注册请求，并将数据加入数据库
router.post('/register',function(req,res){
    //先判断该用户是否注册过
    mysql(`select * from users where username=\'${req.body.username}\'`,function(err,data){
        if(err) throw err;
        if(data.toString()!=''){
            res.json({
                state:0,
                msg:'注册失败,该用户名已存在'
            });

        }
        //没注册过插入数据库返回json即可
        else {
            mysql(`insert into users values(null,\'${req.body.username}\','${req.body.password}\','${req.body.email}\')`,function(err){
                if(err) throw err;
                res.json({
                    state:1,
                    msg:'注册成功'
                });

            })
        }

    })
})
//返回登录页面
router.get('/login',function(req,res){
    res.render('login')

})
//处理登录请求
router.post('/login',function(req,res){
    let username = req.body.username;
    let password = req.body.password;
    mysql(`select * from users where username=\'${username}\'`,function(err,data){
        if(data.toString()!=''){
            if(data[0].username==username&&data[0].password==password){
                res.json({
                    state:1,
                    username:username,
                    msg:'登陆成功'
                })
            }
            else {
                res.json({
                    state:0,
                    msg:'密码错误，请重新输入'
                })
            }
        }
        else {
            res.json({
                state:0,
                msg:'该用户名没有注册，请先注册'
            })
        }
    })
})
module.exports = router;