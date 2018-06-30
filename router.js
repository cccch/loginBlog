"use strict"
const express = require('express');
const router = express.Router();
const mysql = require('./database.js');

router.get('/',function(req,res){
    let username = req.cookies.username
    res.render('index',{username:username})
})
//index请求
router.get('/index',function(req,res){
    let username = req.cookies.username
    res.render('index',{username:username})
})
router.post('/index',function(req,res){
    let username = req.body.username||'';
    res.cookie('username',username);
    res.end()
})

router.get('/favicon.ico',function(req,res){
    res.end()
})
router.get('/login',function(req,res){
    res.render('login')

})
router.get('/out',function(req,res){
    res.cookie('username','');
    res.redirect('/index');
})
router.get('/article',function(req,res){
    let username = req.cookies.username
    res.render('article',{username:username})

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
//处理登录请求
router.post('/login',function(req,res){
    let username = req.body.username;
    let password = req.body.password;
    mysql(`select * from users where username=\'${username}\'`,function(err,data){
        //console.log(`select * from users where username=\'${username}\'`);
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